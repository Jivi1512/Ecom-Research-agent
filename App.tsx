
import React, { useState, useEffect, useCallback, useRef } from 'react';
// Fix: Removed non-existent ModeIcon and unused icons SlidersHorizontal, Upload
import { Search, Loader2, Database, Brain, Sparkles, Settings } from 'lucide-react';
import { ResearchMode, UserMemory, InsightData, Plan, Step } from './types';
import { MemoryService } from './services/memoryService';
import { Planner } from './agent/planner';
import { Executor } from './agent/executor';
import InsightCard from './components/InsightCard';
import DetailsPanel from './components/DetailsPanel';
import MemoryPanel from './components/MemoryPanel';
import FollowUpToolbar from './components/FollowUpToolbar';
import AgentConsole from './components/AgentConsole';
import { MARKETPLACES } from './constants';

const App: React.FC = () => {
  const [sku, setSku] = useState('SKU-7788');
  const [mode, setMode] = useState<ResearchMode>(ResearchMode.QUICK);
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<InsightData | null>(null);
  const [memory, setMemory] = useState<UserMemory>(MemoryService.getMemory());
  const [showSettings, setShowSettings] = useState(false);
  
  // Agent State
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  const planner = new Planner();
  const executorRef = useRef<Executor | null>(null);

  const handleInitiate = async () => {
    if (!sku) return;
    setLoading(true);
    setInsight(null);
    try {
      const generatedPlan = await planner.generatePlan(
        `Perform a ${mode.toLowerCase()} analysis for product positioning and competitive gaps.`, 
        sku, 
        memory
      );
      setPlan(generatedPlan);
    } catch (error) {
      console.error("Planning failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRunPlan = async () => {
    if (!plan) return;
    setIsRunning(true);
    const executor = new Executor();
    executorRef.current = executor;

    const generator = executor.execute(plan, memory);
    
    for await (const state of generator) {
      setPlan(state.plan);
      if (state.isAsking) {
        setIsRunning(false);
        break;
      }
    }

    if (plan.steps.every(s => s.status === 'completed')) {
      const report = executor.getFinalReport(plan.steps.map((s, i) => ({
        step_id: s.id,
        tool: s.tool,
        start_ts: 0,
        end_ts: 0,
        result: s.result,
        logs: s.logs,
        success: s.status === 'completed'
      })));
      setInsight(report as InsightData);
      setIsRunning(false);
    }
  };

  const handleAnswerAsk = async (answer: string) => {
    if (!plan) return;
    
    // Update the plan: find the paused step and resume
    const updatedSteps = plan.steps.map(s => {
      if (s.status === 'paused') {
        return { ...s, status: 'completed' as const, result: answer, logs: [...s.logs, `User provided choice: ${answer}`] };
      }
      return s;
    });

    const updatedPlan = { ...plan, steps: updatedSteps };
    setPlan(updatedPlan);
    
    // Resume execution
    handleRunPlan();
  };

  const updateMemory = (newMemory: UserMemory) => {
    setMemory(newMemory);
    MemoryService.setMemory(newMemory);
  };

  return (
    <div className="min-h-screen pb-24 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter text-slate-800">ECOM.INTEL</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Autonomous Agent v2</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
             {/* Note: API key UI elements removed as keys are managed via process.env.API_KEY per guidelines. */}
             <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
             >
               <Settings className="w-5 h-5" />
             </button>
          </div>
        </div>
      </header>

      <section className="bg-slate-50 border-b border-slate-200 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Multi-Step Research Agent</h2>
            <p className="text-slate-500">The agent will build an execution plan based on your goal and KPI weights.</p>
          </div>

          <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-100 flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input 
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Enter SKU (e.g., SKU-7788)..."
                className="w-full h-14 pl-12 pr-4 text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none bg-transparent"
              />
            </div>
            <div className="flex gap-2">
              <div className="bg-slate-50 rounded-xl p-1 flex items-center border border-slate-200">
                <button 
                  onClick={() => setMode(ResearchMode.QUICK)}
                  className={`px-4 h-10 rounded-lg text-xs font-bold transition-all ${mode === ResearchMode.QUICK ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                >
                  Quick
                </button>
                <button 
                  onClick={() => setMode(ResearchMode.DEEP)}
                  className={`px-4 h-10 rounded-lg text-xs font-bold transition-all ${mode === ResearchMode.DEEP ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                >
                  Deep
                </button>
              </div>
              <button 
                onClick={handleInitiate}
                disabled={loading || isRunning}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-8 h-12 md:h-14 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {loading ? 'Planning...' : 'Generate Plan'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full space-y-12">
        <AgentConsole 
          plan={plan} 
          isRunning={isRunning} 
          onRunPlan={handleRunPlan} 
          onAnswerAsk={handleAnswerAsk}
          onAbort={() => { setIsRunning(false); setPlan(null); }}
        />

        {insight && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="lg:col-span-8 space-y-8">
              <InsightCard 
                data={insight} 
                mode={mode} 
                onFollowUp={(intent) => console.log('Follow up:', intent)}
                onExport={() => alert('Exporting synthesized package...')}
              />
              <DetailsPanel data={insight} />
            </div>

            <aside className="lg:col-span-4 space-y-8">
              <MemoryPanel memory={memory} onEdit={() => setShowSettings(true)} />
              
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <Database className="w-4 h-4" /> Data Provenance
                </h4>
                <div className="space-y-3">
                  {plan?.steps.filter(s => s.status === 'completed').map((step, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                       <span className="text-[10px] font-bold text-slate-600">{step.tool}</span>
                       <span className="text-[10px] text-emerald-600 font-bold uppercase">Verified</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}

        {!plan && !loading && !insight && (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
              <Database className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-lg font-bold text-slate-400">Autonomous planning engine standby.</p>
            <p className="text-sm text-slate-300">Enter a SKU and initiate the agent to see the multi-step trace.</p>
          </div>
        )}
      </main>

      {insight && <FollowUpToolbar onAction={(action) => console.log('Toolbar action:', action)} />}

      {showSettings && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-black text-xl text-slate-800">Agent Configuration</h3>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">×</button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Strategic KPI Weights</label>
                <div className="space-y-4">
                  {Object.entries(memory.kpis).map(([kpi, weight]) => (
                    <div key={kpi}>
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="capitalize">{kpi}</span>
                        <span>{weight}%</span>
                      </div>
                      <input 
                        type="range" 
                        className="w-full accent-indigo-600"
                        value={weight}
                        onChange={(e) => updateMemory({ ...memory, kpis: { ...memory.kpis, [kpi]: parseInt(e.target.value) } })}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setShowSettings(false)}
                className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
              >
                Save Agent Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
