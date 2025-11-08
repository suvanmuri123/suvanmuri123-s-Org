import React, { useState, useRef, useEffect, useCallback } from 'react';
// Fix: Removed non-existent LiveSession from import.
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import anime from 'animejs';
import LiveBackground from './LiveBackground';

// Audio processing functions (as per guidelines)
function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


interface Transcript {
    source: 'user' | 'model';
    text: string;
    isFinal: boolean;
}

const LiveCoach: React.FC = () => {
    // Fix: Replaced state with refs for session promise and other non-rendering values.
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [transcripts, setTranscripts] = useState<Transcript[]>([]);
    
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const outputGainNodeRef = useRef<GainNode | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const outputSources = useRef<Set<AudioBufferSourceNode>>(new Set()).current;
    const nextStartTime = useRef(0);

    const transcriptContainerRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when transcripts update
    useEffect(() => {
        if (transcriptContainerRef.current) {
            transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
        }
    }, [transcripts]);
    
    const updateTranscript = (source: 'user' | 'model', text: string, isFinal: boolean) => {
        setTranscripts(prev => {
            const last = prev[prev.length - 1];
            if (last && last.source === source && !last.isFinal) {
                // Update the last transcript entry
                const newTranscripts = [...prev.slice(0, -1)];
                newTranscripts.push({ source, text: last.text + text, isFinal });
                return newTranscripts;
            } else {
                // Add a new transcript entry
                return [...prev, { source, text, isFinal }];
            }
        });
    };
    
    const createBlob = (data: Float32Array): Blob => {
        const l = data.length;
        const int16 = new Int16Array(l);
        for (let i = 0; i < l; i++) {
            int16[i] = data[i] * 32768;
        }
        return {
            data: encode(new Uint8Array(int16.buffer)),
            mimeType: 'audio/pcm;rate=16000',
        };
    };

    // Fix: Added stopSession to clean up resources.
    const stopSession = useCallback(async () => {
        if (!isActive && !isConnecting) return;
        setIsActive(false);
        setIsConnecting(false);

        if (sessionPromiseRef.current) {
            try {
                const session = await sessionPromiseRef.current;
                session.close();
            } catch (e) {
                console.error("Error closing session:", e);
            }
        }
        sessionPromiseRef.current = null;
        
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
        
        scriptProcessorRef.current?.disconnect();
        scriptProcessorRef.current = null;
        
        sourceNodeRef.current?.disconnect();
        sourceNodeRef.current = null;
        
        if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
          await inputAudioContextRef.current.close();
        }
        inputAudioContextRef.current = null;

        if (outputGainNodeRef.current) {
            outputGainNodeRef.current.disconnect();
            outputGainNodeRef.current = null;
        }
        
        if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
            await outputAudioContextRef.current.close();
        }
        outputAudioContextRef.current = null;
        
        outputSources.forEach(source => source.stop());
        outputSources.clear();
        nextStartTime.current = 0;
    }, [isActive, isConnecting, outputSources]);

    const startSession = useCallback(async () => {
        if (!outputAudioContextRef.current || outputAudioContextRef.current.state !== 'running') {
            setError('Audio playback is not ready. Please try again.');
            setIsConnecting(false);
            return;
        }

        setIsConnecting(true);
        setError(null);
        setTranscripts([]);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                // Fix: Implemented all required callbacks (onopen, onmessage, onerror, onclose).
                callbacks: {
                    onopen: () => {
                        console.log('Live session open');
                        setIsConnecting(false);
                        setIsActive(true);

                        if (!inputAudioContextRef.current || !mediaStreamRef.current) return;
                        
                        const source = inputAudioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
                        sourceNodeRef.current = source;
                        
                        const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;
                        
                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            sessionPromise.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContextRef.current.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
                            const base64Audio = message.serverContent.modelTurn.parts[0].inlineData.data;
                            if (outputAudioContextRef.current && outputGainNodeRef.current) {
                                nextStartTime.current = Math.max(nextStartTime.current, outputAudioContextRef.current.currentTime);
                                const audioBuffer = await decodeAudioData(
                                    decode(base64Audio),
                                    outputAudioContextRef.current,
                                    24000, 1
                                );
                                const source = outputAudioContextRef.current.createBufferSource();
                                source.buffer = audioBuffer;
                                source.connect(outputGainNodeRef.current);
                                source.addEventListener('ended', () => {
                                    outputSources.delete(source);
                                });
                                source.start(nextStartTime.current);
                                nextStartTime.current += audioBuffer.duration;
                                outputSources.add(source);
                            }
                        }
                        
                        if (message.serverContent?.interrupted) {
                            for (const source of outputSources.values()) {
                                source.stop();
                                outputSources.delete(source);
                            }
                            nextStartTime.current = 0;
                        }

                        if (message.serverContent?.inputTranscription) {
                           // Fix: Cast inputTranscription to `any` to access `isFinal` property, which exists in the API response but may be missing from the type definition.
                           updateTranscript('user', message.serverContent.inputTranscription.text, (message.serverContent.inputTranscription as any).isFinal ?? false);
                        }
                        if (message.serverContent?.outputTranscription) {
                           // Fix: Cast outputTranscription to `any` to access `isFinal` property, which exists in the API response but may be missing from the type definition.
                           updateTranscript('model', message.serverContent.outputTranscription.text, (message.serverContent.outputTranscription as any).isFinal ?? false);
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live session error:', e);
                        setError('An error occurred during the session.');
                        stopSession();
                    },
                    onclose: (e: CloseEvent) => {
                        console.log('Live session closed');
                        stopSession();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
                    },
                    systemInstruction: "You are a friendly and encouraging productivity coach. Keep your responses concise and motivating.",
                },
            });
            sessionPromiseRef.current = sessionPromise;

        } catch (err: any) {
            setError(err.message || 'Failed to start session. Check microphone permissions.');
            setIsConnecting(false);
        }
    }, [stopSession, outputSources]);

    const handleToggleSession = useCallback(async () => {
        if (isActive || isConnecting) {
            stopSession();
        } else {
            try {
                // Create and resume the output audio context immediately on user gesture.
                if (!outputAudioContextRef.current || outputAudioContextRef.current.state === 'closed') {
                    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                    outputAudioContextRef.current = audioContext;

                    const gainNode = audioContext.createGain();
                    gainNode.connect(audioContext.destination);
                    outputGainNodeRef.current = gainNode;
                }
                
                if (outputAudioContextRef.current.state === 'suspended') {
                    await outputAudioContextRef.current.resume();
                }

                // Now that the audio context is running, proceed with the rest of the setup.
                startSession();
            } catch (e) {
                console.error("Failed to initialize audio:", e);
                setError("Could not activate audio. Your browser might be blocking it.");
                stopSession();
            }
        }
    }, [isActive, isConnecting, startSession, stopSession]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopSession();
        };
    }, [stopSession]);

    return (
        <div className="relative h-full flex flex-col items-center justify-center text-center p-4 overflow-hidden">
            <LiveBackground />
            <div className="relative z-10 w-full max-w-2xl h-full flex flex-col">
                <header className="mb-4">
                     <h2 className="text-3xl font-bold text-text-primary">AI Live Coach</h2>
                     <p className="text-text-secondary">Your personal productivity partner, live.</p>
                </header>
                
                <div ref={transcriptContainerRef} className="flex-1 bg-secondary/70 backdrop-blur-md rounded-lg p-4 mb-4 overflow-y-auto shadow-inner">
                    {transcripts.length === 0 && !isConnecting && (
                        <div className="flex items-center justify-center h-full text-text-secondary">
                            <p>Press the button below to start your session.</p>
                        </div>
                    )}
                     {transcripts.map((t, i) => (
                        <div key={i} className={`flex items-start my-2 ${t.source === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-xl ${t.source === 'user' ? 'bg-highlight text-white' : 'bg-white text-text-primary'}`}>
                                <p style={{ opacity: t.isFinal ? 1 : 0.7 }}>{t.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <footer className="flex flex-col items-center justify-center">
                    <button
                        onClick={handleToggleSession}
                        disabled={isConnecting}
                        className={`relative w-24 h-24 rounded-full transition-all duration-300 flex items-center justify-center text-white shadow-lg focus:outline-none focus:ring-4 focus:ring-highlight/50 disabled:opacity-50 ${isActive ? 'bg-rose-500 hover:bg-rose-600' : 'bg-highlight hover:opacity-90'}`}
                    >
                        {isConnecting ? (
                           <div className="w-8 h-8 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                        ) : (
                             <div className={`w-10 h-10 transition-all duration-300 ${isActive ? 'bg-white rounded-md' : 'border-t-[20px] border-t-transparent border-b-[20px] border-b-transparent border-l-[30px] border-l-white'}`}></div>
                        )}
                         <span className={`absolute w-full h-full rounded-full animate-ping-slow ${isActive ? 'bg-rose-400' : 'bg-highlight'}`} style={{animationDuration: '2s'}}></span>
                    </button>
                    {error && <p className="text-rose-500 mt-4">{error}</p>}
                    <p className="text-text-secondary text-sm mt-4">{isConnecting ? "Connecting..." : isActive ? "Session is active. Tap to end." : "Tap to start."}</p>
                </footer>
            </div>
        </div>
    );
};

// Fix: Added default export.
export default LiveCoach;