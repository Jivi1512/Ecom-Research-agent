
import { GoogleGenAI, Type } from "@google/genai";
import { DEEP_ANALYSIS_TPL } from '../prompts/templates';

export class GeminiService {
  /**
   * Generates an autonomous plan for product research.
   * Following guidelines: uses process.env.API_KEY directly and creates instance per call.
   */
  async plannerCall(prompt: string): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  tool: { type: Type.STRING },
                  type: { type: Type.STRING },
                  input: { type: Type.OBJECT },
                  description: { type: Type.STRING }
                },
                required: ["id", "tool", "type", "description"]
              }
            },
            estimated_time_sec: { type: Type.NUMBER },
            estimated_cost_usd: { type: Type.NUMBER }
          }
        }
      }
    });
    // response.text is a getter, not a method.
    return JSON.parse(response.text || '{}');
  }

  /**
   * Summarizes or analyzes input text via Gemini Flash.
   */
  async summarizerCall(prompt: string): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{}');
  }

  /**
   * Synthesizes complex evidence into a final strategic report.
   * Uses Gemini Pro with thinking budget for enhanced reasoning.
   */
  async synthCall(evidence: any[], context: any, sku: string, title: string): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = DEEP_ANALYSIS_TPL
      .replace('{{evidence}}', JSON.stringify(evidence))
      .replace('{{sku}}', sku)
      .replace('{{kpis}}', JSON.stringify(context.kpis))
      .replace('{{marketplaces}}', JSON.stringify(context.marketplaces));

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || '{}');
  }
}
