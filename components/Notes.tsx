

import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import MoodTracker from './MoodTracker.tsx';
import { Mood, MoodValue, ReflectionData } from '../types.ts';
import MoodMascot from './MoodMascot.tsx';
import ReflectionIcon, { IconType } from './ReflectionIcon.tsx';
import { getDailySummary } from '../services/geminiService.ts';
import { SparklesIcon } from './Icons.tsx';

interface NotesProps {
  onAddMood: (mood: MoodValue) => void;
  lastMood?: Mood;
}

interface ReflectionCardProps {
    title: string;
    bgColor: string;
    gridClass: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    iconType: IconType;
}

const ReflectionCard: React.FC<ReflectionCardProps> = ({ title, bgColor, gridClass, value, onChange, iconType }) => (
    <div className={`flex flex-col p-3 rounded-lg shadow-sm ${bgColor} ${gridClass}`}>
        <div className="flex items-center gap-2 mb-2">
            <ReflectionIcon type={iconType} />
            <h3 className="text-sm font-bold text-text-primary/70 uppercase tracking-wider">{title}</h3>
        </div>
        <textarea
            value={value}
            onChange={onChange}
            className="w-full h-full flex-grow bg-transparent focus:outline-none text-text-primary resize-none placeholder:text-text-primary/40 text-base"
        />
    </div>
);

const Notes: React.FC<NotesProps> = ({ onAddMood, lastMood }) => {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    const dayOfWeek = format(today, 'E').toUpperCase();
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    
    const getInitialData = (): ReflectionData => {
        const savedData = localStorage.getItem(`karyaSuchi_reflection-${todayStr}`);
        if (savedData) {
            return JSON.parse(savedData);
        }
        return {
            win: '',
            lesson: '',
            skipped: '',
            onMyMind: '',
            grateful: '',
            procrastinated: '',
            highlight: '',
            growth: '',
        };
    };

    const [data, setData] = useState<ReflectionData>(getInitialData);
    const [summary, setSummary] = useState<string | null>(null);
    const [isSummarizing, setIsSummarizing] = useState(false);


    useEffect(() => {
        localStorage.setItem(`karyaSuchi_reflection-${todayStr}`, JSON.stringify(data));
    }, [data, todayStr]);

    const handleChange = useCallback((field: keyof ReflectionData) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setData(prev => ({ ...prev, [field]: e.target.value }));
    }, []);

    const handleGetSummary = async () => {
        setIsSummarizing(true);
        setSummary(null);
        try {
            const result = await getDailySummary(data);
            setSummary(result);
        } catch (error) {
            console.error(error);
            setSummary("There was an error generating your summary.");
        } finally {
            setIsSummarizing(false);
        }
    };

    const isReflectionEmpty = Object.values(data).every(value => value === '');

  return (
    <div className="h-full flex flex-col">
        <div>
            <h2 className="text-3xl font-bold mb-2 text-text-primary">Daily Self Reflection</h2>
            <div className="flex justify-between items-center mb-4 text-text-secondary">
                <div className="flex items-center gap-2 p-2 bg-[#EAE1D6] rounded-md">
                    <span className="font-semibold text-sm">DATE</span>
                    <span className="text-sm">{format(today, 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-[#EAE1D6] rounded-md">
                    <span className="font-semibold text-sm">DAY</span>
                    <div className="flex gap-1.5 text-xs">
                        {days.map(d => (
                            <span key={d} className={`font-mono ${d.slice(0,1) === dayOfWeek.slice(0,1) ? 'font-bold text-highlight' : ''}`}>{d.charAt(0)}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-5 gap-4">
                <ReflectionCard iconType="win" title="Today's Win" bgColor="bg-[#FADADD]" gridClass="md:col-span-4" value={data.win} onChange={handleChange('win')} />
                
                <ReflectionCard iconType="lesson" title="Lesson Learnt" bgColor="bg-[#F8D57E]" gridClass="md:col-span-1 md:row-span-1" value={data.lesson} onChange={handleChange('lesson')} />
                <ReflectionCard iconType="skipped" title="Skipped" bgColor="bg-[#D1D9E6]" gridClass="md:col-span-1 md:row-span-1" value={data.skipped} onChange={handleChange('skipped')} />
                <ReflectionCard iconType="onMyMind" title="On My Mind" bgColor="bg-[#EAE1D6]" gridClass="md:col-span-2 md:row-span-2" value={data.onMyMind} onChange={handleChange('onMyMind')} />

                <ReflectionCard iconType="grateful" title="Grateful For" bgColor="bg-[#D8D1E5]" gridClass="md:col-span-1 md:row-span-1" value={data.grateful} onChange={handleChange('grateful')} />
                <ReflectionCard iconType="procrastinated" title="Procrastinated" bgColor="bg-[#F3D4C4]" gridClass="md:col-span-1 md:row-span-1" value={data.procrastinated} onChange={handleChange('procrastinated')} />

                <ReflectionCard iconType="highlight" title="The Highlight Of My Day" bgColor="bg-[#D5E8D4]" gridClass="md:col-span-3 md:row-span-1" value={data.highlight} onChange={handleChange('highlight')} />
                
                <div className="flex flex-col p-3 rounded-lg shadow-sm bg-[#D1E8E6] md:col-span-1 md:row-span-2">
                    <label className="text-sm font-bold text-text-primary/70 mb-2 uppercase tracking-wider text-center">My Vibe Today</label>
                    <div className="flex-1 flex flex-col items-center justify-center min-h-[120px]">
                        <MoodMascot mood={lastMood?.mood} />
                    </div>
                    <MoodTracker onAddMood={onAddMood} lastMood={lastMood} />
                </div>

                <ReflectionCard iconType="growth" title="Room For Growth" bgColor="bg-[#C9C0D9]" gridClass="md:col-span-3 md:row-span-1" value={data.growth} onChange={handleChange('growth')} />

            </div>
        </div>
        <div className="mt-auto pt-4">
            <div className="flex justify-center mb-4">
                <button
                    onClick={handleGetSummary}
                    disabled={isSummarizing || isReflectionEmpty}
                    className="flex items-center gap-2 px-6 py-3 font-semibold text-white bg-highlight rounded-lg hover:opacity-90 active:scale-95 transition-all duration-200 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isSummarizing ? (
                        <>
                            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                            <span>Generating...</span>
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="w-5 h-5" />
                            <span>Get My AI Summary</span>
                        </>
                    )}
                </button>
            </div>

            {summary && (
                <div className="p-4 bg-secondary/80 rounded-lg shadow-md border border-accent animate-fade-in">
                    <h3 className="text-lg font-bold text-text-primary mb-2">Your AI Coach Says...</h3>
                    <p className="text-text-primary whitespace-pre-wrap font-sans">
                        {summary}
                    </p>
                </div>
            )}
        </div>
    </div>
  );
};

export default Notes;