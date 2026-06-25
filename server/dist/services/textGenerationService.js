import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";
import { sanitizeString } from "../utils/http.js";
export const generatePostCopy = async (prompt, tone) => {
    if (!env.geminiApiKey) {
        throw new Error("GEMINI_API_KEY is required to generate post copy");
    }
    const ai = new GoogleGenAI({ apiKey: env.geminiApiKey });
    const textResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Generate one polished social media post.
Prompt: "${prompt}"
Tone: ${tone}
Return strict JSON only with "content" and "imagePrompt" fields. Include relevant hashtags in content.`,
    });
    const rawText = textResponse.text || "";
    try {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        const data = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(rawText);
        return {
            content: sanitizeString(data.content || rawText, 2200),
            imagePrompt: sanitizeString(data.imagePrompt || prompt, 1000),
        };
    }
    catch {
        return {
            content: sanitizeString(rawText, 2200),
            imagePrompt: prompt,
        };
    }
};
