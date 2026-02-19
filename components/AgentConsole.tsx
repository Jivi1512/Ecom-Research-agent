
import React from 'react';
import { Plan, TraceEntry, Step } from '../types';
import { CheckCircle2, Circle, Loader2, HelpCircle, Terminal, AlertTriangle, PlayCircle } from 'lucide-react';

interface Props {
  plan: Plan | null;
  isRunning: boolean;
  onRunPlan: () => void;
  onAnswerAsk: (choice: string) => void;
  onAbort: () => void;
}

const AgentConsole: React.FC<Props> = ({ plan, isRunning, onRunPlan, onAnswerAsk, onAbort }) => {
  if (!plan) return null;

  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden font-mono text-xs">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-700">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-indigo-400" />
          <div>
            <h4 className="font-bold text-sm tracking-tight">AGENT CONSOLE</h4>
            <p className="text-[10px] text-slate-400">SESSION: {plan.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] text-slate-500 font-bold uppercase">Estimated Cost</p>
            <p className="text-indigo-400 font-bold">${plan.estimated_cost_usd.toFixed(4)}</p>
          </div>
          {!isRunning && plan.steps.every(s => s.status === 'pending') && (
            <button 
              onClick={onRunPlan}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
            >
              <PlayCircle className="w-4 h-4" /> Run Plan
            </button>
          )}
          {isRunning && (
             <button 
              onClick={onAbort}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg font-bold border border-red-500/30 transition-all"
            >
              Abort
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 h-[500px]">
        {/* Step List */}
        <div className="border-r border-slate-700 p-6 overflow-y-auto space-y-4 bg-slate-900/50">
          <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Execution Steps</h5>
          {plan.steps.map((step, idx) => (
            <div 
              key={step.id} 
              className={`p-4 rounded-xl border transition-all ${
                step.status === 'running' ? 'bg-indigo-500/10 border-indigo-500/50' :
                step.status === 'completed' ? 'bg-emerald-500/5 border-emerald-500/20' :
                step.status === 'paused' ? 'bg-amber-500/10 border-amber-500/50 scale-[1.02] shadow-xl shadow-amber-500/10' :
                'bg-slate-800/50 border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {step.status === 'completed' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> :
                   step.status === 'running' ? <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" /> :
                   step.status === 'paused' ? <HelpCircle className="w-4 h-4 text-amber-500" /> :
                   <Circle className="w-4 h-4 text-slate-600" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-300">STEP {idx + 1}: {step.tool.toUpperCase()}</span>
                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                       step.status === 'running' ? 'bg-indigo-500 text-white' :
                       step.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                       step.status === 'paused' ? 'bg-amber-500 text-white animate-pulse' :
                       'bg-slate-700 text-slate-500'
                    }`}>
                      {step.status}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-snug">{step.description}</p>
                  
                  {step.status === 'paused' && step.input?.question && (
                    <div className="mt-4 p-4 bg-slate-950 rounded-lg border border-amber-500/30">
                      <p className="text-amber-400 font-bold mb-3 flex items-center gap-2 italic">
                        <AlertTriangle className="w-3.5 h-3.5" /> {step.input.question}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {step.input.choices?.map((choice: string) => (
                          <button
                            key={choice}
                            onClick={() => onAnswerAsk(choice)}
                            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 border border-amber-500/50 rounded-md transition-all font-bold"
                          >
                            {choice}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Streaming Logs */}
        <div className="p-6 overflow-y-auto bg-slate-950/50 font-mono text-[10px] space-y-1">
          <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Live Execution Trace</h5>
          {plan.steps.flatMap(s => s.logs).map((log, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-slate-700">[{new Date().toLocaleTimeString()}]</span>
              <span className="text-slate-300">{log}</span>
            </div>
          ))}
          {isRunning && (
             <div className="flex gap-2 animate-pulse">
               <span className="text-indigo-500 italic">Executing task sequence...</span>
               <span className="w-1 h-3 bg-indigo-500" />
             </div>
          )}
          {plan.steps.every(s => s.status === 'completed') && (
            <div className="mt-4 p-4 border border-emerald-500/30 bg-emerald-500/5 rounded-xl">
              <p className="text-emerald-400 font-bold">✓ PIPELINE COMPLETE</p>
              <p className="text-slate-500 mt-1">Report synthesized and validated against schema. Rendering visuals...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentConsole;
