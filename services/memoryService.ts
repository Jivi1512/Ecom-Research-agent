
import { UserMemory, KPIConfig } from '../types';

const MEMORY_KEY = 'ecom_agent_memory';

const DEFAULT_MEMORY: UserMemory = {
  kpis: { margins: 70, retention: 50, growth: 80 },
  marketplaces: ['Amazon', 'Walmart']
};

export class MemoryService {
  static getMemory(): UserMemory {
    const saved = localStorage.getItem(MEMORY_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_MEMORY;
  }

  static setMemory(memory: UserMemory) {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
  }
}
