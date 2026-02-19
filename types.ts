
export enum ResearchMode {
  QUICK = 'QUICK',
  DEEP = 'DEEP'
}

export interface KPIConfig {
  margins: number;
  retention: number;
  growth: number;
}

export interface UserMemory {
  kpis: KPIConfig;
  marketplaces: string[];
}

export interface Topic {
  topic: string;
  count: number;
  score: number;
  examples: { text: string; sourceUrl: string }[];
}

export interface Citation {
  url: string;
  snippet: string;
}

export interface Step {
  id: string;
  tool: string;
  type: "action" | "ask";
  input: any;
  description: string;
  status: "pending" | "running" | "completed" | "failed" | "paused";
  result?: any;
  logs: string[];
}

export interface Plan {
  id: string;
  steps: Step[];
  estimated_time_sec: number;
  estimated_cost_usd: number;
}

export interface TraceEntry {
  step_id: string;
  tool: string;
  start_ts: number;
  end_ts: number;
  result: any;
  logs: string[];
  success: boolean;
}

export interface InsightData {
  id: string;
  title: string;
  bullets: string[];
  confidence: number;
  citations: Citation[];
  sentimentDistribution?: { positive: number; neutral: number; negative: number };
  takeaway?: string;
  priceComparison?: {
    basePrice: number;
    competitors: { marketplace: string; price_raw: string; price_normalized: number; fees_est: number; timestamp: string }[];
  };
  topics?: Topic[];
  findings?: { title: string; description: string; evidence: Citation[]; confidence: number; estimated_impact: Record<string, number> }[];
  roadmap?: string[];
  trace?: TraceEntry[];
}

export interface CatalogItem {
  sku: string;
  title: string;
  category: string;
  brand: string;
  list_price: number;
  currency: string;
}

export interface Review {
  sku: string;
  review_id: string;
  date: string;
  rating: number;
  text: string;
  source_url: string;
}

export interface Competitor {
  sku: string;
  competitor_id: string;
  marketplace: string;
  price: number;
  currency: string;
  url: string;
  scraped_at: string;
}
