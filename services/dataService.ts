
import { SAMPLE_CATALOG, SAMPLE_REVIEWS, SAMPLE_COMPETITORS } from '../constants';
import { CatalogItem, Review, Competitor } from '../types';

export class DataService {
  static getProductBySku(sku: string): CatalogItem | undefined {
    return SAMPLE_CATALOG.find(p => p.sku === sku) || 
           SAMPLE_CATALOG.find(p => p.title.toLowerCase().includes(sku.toLowerCase()));
  }

  static getReviews(sku: string): Review[] {
    return SAMPLE_REVIEWS.filter(r => r.sku === sku);
  }

  static getCompetitors(sku: string): Competitor[] {
    return SAMPLE_COMPETITORS.filter(c => c.sku === sku);
  }

  static normalizePrice(price: number, currency: string): number {
    // Simple mock normalization
    const rates: Record<string, number> = { 'USD': 1.0, 'EUR': 1.08, 'GBP': 1.25 };
    return price * (rates[currency] || 1.0);
  }
}
