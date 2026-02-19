
import { MOCK_CATALOG, MOCK_REVIEWS, MOCK_COMPETITORS, MOCK_RATES } from '../mocks/dataset';
import { GeminiService } from '../services/geminiService';

const gemini = new GeminiService();

export const tools: Record<string, Function> = {
  fetchReviews: async ({ sku, max = 50 }: { sku: string; max: number }) => {
    const data = MOCK_REVIEWS.filter(r => r.sku === sku).slice(0, max);
    return {
      success: true,
      data,
      logs: [`Retrieved ${data.length} reviews for SKU ${sku} from mock corpus.`],
      cost_estimate_usd: 0
    };
  },

  fetchCompetitors: async ({ sku }: { sku: string }) => {
    const data = MOCK_COMPETITORS.filter(c => c.sku === sku);
    return {
      success: true,
      data,
      logs: [`Retrieved ${data.length} competitor listings from mock corpus.`],
      cost_estimate_usd: 0
    };
  },

  priceNormalize: async ({ priceList }: { priceList: any[] }) => {
    const normalized = priceList.map(item => ({
      ...item,
      price_normalized: item.price * (MOCK_RATES[item.currency as keyof typeof MOCK_RATES] || 1.0),
      fees_est: 5.00
    }));
    return {
      success: true,
      data: normalized,
      logs: ["Normalized prices using global rates and standard fee rules."],
      cost_estimate_usd: 0
    };
  },

  sentimentAnalysis: async ({ texts }: { texts: string[] }) => {
    const context = texts.slice(0, 10).join('\n');
    const prompt = `Perform sentiment analysis on these reviews and return JSON: { "positive": %, "neutral": %, "negative": % }. Reviews: \n${context}`;
    const result = await gemini.summarizerCall(prompt);
    return {
      success: true,
      data: result,
      logs: ["Computed sentiment distribution using Gemini Flash."],
      cost_estimate_usd: 0.001
    };
  },

  extractTopics: async ({ texts, maxTopics = 3 }: { texts: string[]; maxTopics: number }) => {
    const context = texts.slice(0, 10).join('\n');
    const prompt = `Extract top ${maxTopics} complaint topics. Return JSON: { "topics": [{ "topic": string, "count": number, "example": string }] }. Reviews: \n${context}`;
    const result = await gemini.summarizerCall(prompt);
    return {
      success: true,
      data: result.topics,
      logs: [`Extracted ${result.topics?.length} key complaint topics.`],
      cost_estimate_usd: 0.001
    };
  },

  ragRetrieve: async ({ query, k = 3 }: { query: string; k: number }) => {
    const results = MOCK_REVIEWS
      .filter(r => r.text.toLowerCase().includes(query.toLowerCase()))
      .slice(0, k)
      .map((r, i) => ({ id: i, text: r.text, source_url: r.source_url }));
    return {
      success: true,
      data: results,
      logs: [`Performed RAG retrieval for query "${query}". Found ${results.length} relevant snippets.`],
      cost_estimate_usd: 0
    };
  },

  llmSynthesize: async ({ evidence, context, sku }: { evidence: any[]; context: any; sku: string }) => {
    const product = MOCK_CATALOG.find(p => p.sku === sku);
    const result = await gemini.synthCall(evidence, context, sku, product?.title || sku);
    return {
      success: true,
      data: result,
      logs: ["Synthesized final strategic report using Gemini Pro."],
      cost_estimate_usd: 0.02
    };
  }
};
