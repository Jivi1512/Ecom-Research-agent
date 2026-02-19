
import React from 'react';
import { Target, Zap, Filter, PackageOpen } from 'lucide-react';

interface Props {
  onAction: (action: string) => void;
}

const FollowUpToolbar: React.FC<Props> = ({ onAction }) => {
  const actions = [
    { id: 'focus_negative', label: 'Focus Negative Reviews', icon: Filter, color: 'text-red-500' },
    { id: 'optimize_margins', label: 'Optimize for Margins', icon: Target, color: 'text-emerald-500' },
    { id: 'batch_export', label: 'Batch Export Findings', icon: Zap, color: 'text-amber-500' },
    { id: 'inventory_sync', label: 'Predict Stock Impact', icon: PackageOpen, color: 'text-indigo-500' },
  ];

  return (
    <div className="sticky bottom-6 left-0 right-0 z-10 flex justify-center px-4 pointer-events-none">
      <div className="bg-white/80 backdrop-blur-md border border-slate-200 p-2 rounded-2xl shadow-2xl flex items-center gap-1 pointer-events-auto">
        <span className="text-[10px] font-black text-slate-400 px-3 uppercase tracking-tighter">Quick Actions</span>
        <div className="h-6 w-px bg-slate-200 mx-2" />
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onAction(action.id)}
            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 rounded-xl transition-all group"
          >
            <action.icon className={`w-4 h-4 ${action.color} group-hover:scale-110 transition-transform`} />
            <span className="text-xs font-bold text-slate-600 whitespace-nowrap">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FollowUpToolbar;
