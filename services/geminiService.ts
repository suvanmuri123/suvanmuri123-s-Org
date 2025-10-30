import { GoogleGenAI, Type } from "@google/genai";
import { format } from 'date-fns';

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
