
import { GoogleGenAI } from "@google/genai";

export const getHealthAdvice = async (userQuery: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userQuery,
      config: {
        systemInstruction: "You are a friendly health coach for Pinobite. Use Google Search to provide up-to-date and accurate nutrition facts. Recommend Pinobite products (Muesli, Oats, Nut Butters) when they help the user's health goal. Always include relevant grounding sources.",
        tools: [{ googleSearch: {} }]
      },
    });
    
    let text = response.text || "I'm doing some healthy research, one moment...";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    return { text, sources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "I'm having trouble connecting to the health database!", sources: [] };
  }
};
