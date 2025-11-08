
import { GoogleGenAI, Type } from "@google/genai";
import { format } from 'date-fns';
import { ReflectionData } from '../types.ts';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const parseTaskFromText = async (
  text: string
): Promise<{ title: string; dueDate: string | null }> => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const prompt = `Parse the following text into a task. Extract the task description and a due date if mentioned.
    The current date is ${today}.
    If a date is mentioned (e.g., 'tomorrow', 'next friday', 'aug 15'), convert it to 'YYYY-MM-DD' format.
    If no date is mentioned, the due date should be null.

    Text: "${text}"`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        // Fix: Made `dueDate` optional and removed `nullable` for robustness.
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "The main description of the task.",
            },
            dueDate: {
              type: Type.STRING,
              description: "The due date in YYYY-MM-DD format, or null if not specified.",
            },
          },
          required: ["title"],
        },
      },
    });

    const jsonResponse = JSON.parse(response.text);
    return {
        title: jsonResponse.title,
        dueDate: jsonResponse.dueDate || null
    };

  } catch (error) {
    console.error("Error parsing task with Gemini:", error);
    // Fallback to simple parsing if API fails
    return {
      title: text,
      dueDate: null,
    };
  }
};


export const getDailySummary = async (
  reflectionData: ReflectionData
): Promise<string> => {
  const { win, lesson, skipped, onMyMind, grateful, procrastinated, highlight, growth } = reflectionData;

  const prompt = `
    Based on the following daily reflection, act as a friendly and encouraging coach.
    Provide a short, insightful summary (2-3 sentences) and one actionable, positive suggestion for tomorrow.
    Format your response as plain text. Use "Summary:" and "Suggestion:" as labels on their own lines.

    Today's Reflection:
    - Today's Win: ${win || 'Not specified'}
    - Lesson Learned: ${lesson || 'Not specified'}
    - I Skipped: ${skipped || 'Not specified'}
    - On My Mind: ${onMyMind || 'Not specified'}
    - Grateful For: ${grateful || 'Not specified'}
    - I Procrastinated On: ${procrastinated || 'Not specified'}
    - Highlight of the Day: ${highlight || 'Not specified'}
    - Room for Growth: ${growth || 'Not specified'}

    Your summary and suggestion should be warm, empathetic, and focus on positive reinforcement and self-compassion.
    `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error getting daily summary from Gemini:", error);
    return "Sorry, I couldn't generate a summary right now. Please try again later.";
  }
};