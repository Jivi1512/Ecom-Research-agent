
import React from 'react';
// Fix: Corrected KPI_LABELS import (it resides in constants.tsx)
import { UserMemory } from '../types';
import { KPI_LABELS } from '../constants';
import { BrainCircuit, Settings2 } from 'lucide-react';

interface Props {
  memory: UserMemory;
  onEdit: () => void;
}

const MemoryPanel: React.FC<Props> = ({ memory, onEdit }) => {
  return (
    <div className="bg-slate-900 text-white rounded-xl shadow-lg p-6 border border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <BrainCircuit className="w-5 h-5 text-indigo-400" />
          </div>
          <h4 className="font-bold text-sm uppercase tracking-wider">Agent Memory</h4>
        </div>
        <button 
          onClick={onEdit}
          className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Settings2 className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">Strategic KPIs</h5>
          <div className="space-y-4">
            {Object.entries(memory.kpis).map(([kpi, weight]) => (
              <div key={kpi}>
                <div className="flex justify-between text-[11px] mb-1.5 font-medium">
                  <span className="text-slate-300">{(KPI_LABELS as any)[kpi]}</span>
                  <span className="text-indigo-400">{weight}%</span>
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" 
                    style={{ width: `${weight}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">Active Marketplaces</h5>
          <div className="flex flex-wrap gap-2">
            {memory.marketplaces.map(m => (
              <span key={m} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[10px] font-bold text-slate-300">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-800">
        <p className="text-[10px] text-slate-500 leading-relaxed italic">
          {/* Fix: Cast entries to [string, number][] to allow arithmetic operations in sort */}
          "Insights are currently weighted toward {(Object.entries(memory.kpis) as Array<[string, number]>).sort((a,b) => b[1] - a[1])[0][0]} optimization based on your active preferences."
        </p>
      </div>
    </div>
  );
};

export default MemoryPanel;