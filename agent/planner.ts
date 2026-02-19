
import { GeminiService } from '../services/geminiService';
import { PLANNER_TPL } from '../prompts/templates';
import { UserMemory, Plan } from '../types';

export class Planner {
  private gemini = new GeminiService();

  async generatePlan(query: string, sku: string, memory: UserMemory): Promise<Plan> {
    const prompt = PLANNER_TPL
      .replace('{{query}}', query)
      .replace('{{sku}}', sku)
      .replace('{{kpis}}', JSON.stringify(memory.kpis))
      .replace('{{marketplaces}}', JSON.stringify(memory.marketplaces));

    const response = await this.gemini.plannerCall(prompt);
    
    // Enforce initial status for steps
    const steps = response.steps.map((s: any) => ({
      ...s,
      status: 'pending',
      logs: []
    }));

    return {
      ...response,
      steps
    };
  }
}
