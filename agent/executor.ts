
import { tools } from './tools';
import { Plan, TraceEntry, InsightData, Step } from '../types';

export class Executor {
  private trace: TraceEntry[] = [];

  async *execute(plan: Plan, context: any): AsyncGenerator<{ plan: Plan; trace: TraceEntry[]; isAsking: boolean; question?: any }> {
    for (let i = 0; i < plan.steps.length; i++) {
      const step = plan.steps[i];
      
      if (step.status === 'completed') continue;

      if (step.type === 'ask') {
        step.status = 'paused';
        yield { plan: { ...plan }, trace: [...this.trace], isAsking: true, question: step.input };
        // Wait for external resume (UI handles this by passing updated plan back)
        return;
      }

      step.status = 'running';
      yield { plan: { ...plan }, trace: [...this.trace], isAsking: false };

      const start = Date.now();
      try {
        // Resolve inputs from previous steps if needed (e.g., <s1.output>)
        const toolInput = this.resolveInputs(step.input, plan);
        const { success, data, logs, cost_estimate_usd } = await tools[step.tool](toolInput);
        
        step.result = data;
        step.status = success ? 'completed' : 'failed';
        step.logs.push(...logs);

        this.trace.push({
          step_id: step.id,
          tool: step.tool,
          start_ts: start,
          end_ts: Date.now(),
          result: data,
          logs,
          success
        });
      } catch (err: any) {
        step.status = 'failed';
        step.logs.push(`Error: ${err.message}`);
        this.trace.push({
          step_id: step.id,
          tool: step.tool,
          start_ts: start,
          end_ts: Date.now(),
          result: null,
          logs: [`Execution failed: ${err.message}`],
          success: false
        });
      }

      yield { plan: { ...plan }, trace: [...this.trace], isAsking: false };
    }
  }

  private resolveInputs(input: any, plan: Plan): any {
    // Simple mock of cross-step data dependency resolution
    // In a real agent, we'd parse templates like <s1.output>
    const resolved = { ...input };
    if (resolved.texts === '<s1.output.texts>') {
      const s1 = plan.steps.find(s => s.id === 's1');
      resolved.texts = s1?.result?.map((r: any) => r.text) || [];
    }
    if (resolved.priceList === '<s4.output>') {
      const s4 = plan.steps.find(s => s.id === 's4');
      resolved.priceList = s4?.result || [];
    }
    if (resolved.evidence === '<all previous outputs>') {
      resolved.evidence = plan.steps.filter(s => s.status === 'completed').map(s => ({ step: s.id, tool: s.tool, data: s.result }));
    }
    return resolved;
  }

  getFinalReport(trace: TraceEntry[]): Partial<InsightData> {
    const lastAction = trace.find(t => t.tool === 'llmSynthesize');
    const topicsAction = trace.find(t => t.tool === 'extractTopics');
    const sentimentAction = trace.find(t => t.tool === 'sentimentAnalysis');
    const priceAction = trace.find(t => t.tool === 'priceNormalize');

    const data = lastAction?.result || {};
    return {
      ...data,
      topics: topicsAction?.result?.map((t: any) => ({
        ...t,
        score: 0.8,
        examples: [{ text: t.example, sourceUrl: '#' }]
      })),
      sentimentDistribution: sentimentAction?.result || { positive: 50, neutral: 30, negative: 20 },
      priceComparison: {
        basePrice: 299.99,
        competitors: priceAction?.result || []
      },
      trace
    };
  }
}
