
import { CatalogItem, Review, Competitor } from './types';

export const SAMPLE_CATALOG: CatalogItem[] = [
  { sku: 'SKU-7788', title: 'SonicMax Noise Cancelling Headphones', category: 'Audio', brand: 'SonicTech', list_price: 299.99, currency: 'USD' },
  { sku: 'SKU-1122', title: 'EverGrip Pro Yoga Mat', category: 'Fitness', brand: 'ZenBalance', list_price: 89.00, currency: 'USD' },
];

export const SAMPLE_REVIEWS: Review[] = [
  { sku: 'SKU-7788', review_id: 'R1', date: '2023-10-01', rating: 5, text: 'Amazing noise cancelling. Use them for work every day.', source_url: 'https://amazon.com/review/1' },
  { sku: 'SKU-7788', review_id: 'R2', date: '2023-10-05', rating: 2, text: 'The ear pads wore out after 2 months. Very disappointed with durability.', source_url: 'https://amazon.com/review/2' },
  { sku: 'SKU-7788', review_id: 'R3', date: '2023-10-10', rating: 4, text: 'Great sound quality but a bit heavy for long flights.', source_url: 'https://amazon.com/review/3' },
  { sku: 'SKU-7788', review_id: 'R4', date: '2023-10-12', rating: 1, text: 'Stopped charging after only 3 weeks. Battery issues are real.', source_url: 'https://amazon.com/review/4' },
  { sku: 'SKU-7788', review_id: 'R5', date: '2023-11-01', rating: 5, text: 'Best ANC on the market right now. Comparable to Bose but better bass.', source_url: 'https://amazon.com/review/5' },
];

export const SAMPLE_COMPETITORS: Competitor[] = [
  { sku: 'SKU-7788', competitor_id: 'C1', marketplace: 'Walmart', price: 279.99, currency: 'USD', url: 'https://walmart.com/p/1', scraped_at: '2023-11-15' },
  { sku: 'SKU-7788', competitor_id: 'C2', marketplace: 'Best Buy', price: 299.00, currency: 'USD', url: 'https://bestbuy.com/p/1', scraped_at: '2023-11-15' },
  { sku: 'SKU-7788', competitor_id: 'C3', marketplace: 'Target', price: 285.50, currency: 'USD', url: 'https://target.com/p/1', scraped_at: '2023-11-15' },
];

export const MARKETPLACES = ['Amazon', 'Walmart', 'Best Buy', 'Target', 'eBay'];
export const KPI_LABELS = {
  margins: 'Profit Margins',
  retention: 'Customer Retention',
  growth: 'Market Growth'
};
