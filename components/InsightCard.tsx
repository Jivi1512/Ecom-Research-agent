
import React from 'react';
import { InsightData, ResearchMode } from '../types';
import { Share2, FileDown, MessageSquare, AlertCircle } from 'lucide-react';

interface Props {
  data: InsightData;
  mode: ResearchMode;
  onFollowUp: (intent: string) => void;
  onExport: () => void;
}

const InsightCard: React.FC<Props> = ({ data, mode, onFollowUp, onExport }) => {
  return (
    <div id="insight-card-capture" className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden transition-all hover:shadow-xl">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h3 className="text-xl font-bold text-slate-800">{data.title}</h3>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${mode === ResearchMode.DEEP ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {mode} MODE
            </span>
            ID: {data.id}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${data.confidence > 0.8 ? 'bg-green-500' : data.confidence > 0.5 ? 'bg-yellow-500' : 'bg-red-500'}`} />
            <span className="text-sm font-semibold text-slate-700">{(data.confidence * 100).toFixed(0)}% Confidence</span>
          </div>
          <p className="text-[10px] text-slate-400">Based on {data.citations.length} sources</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {data.takeaway && (
          <div className="bg-slate-50 border-l-4 border-slate-400 p-4 rounded-r-lg">
            <p className="text-slate-700 italic leading-relaxed">"{data.takeaway}"</p>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-tight text-slate-400">Key Takeaways</h4>
          <ul className="space-y-2">
            {data.bullets.map((b, i) => (
              <li key={i} className="flex gap-3 text-slate-700">
                <span className="flex-shrink-0 w-5 h-5 bg-slate-100 text-slate-500 text-[10px] flex items-center justify-center rounded-full font-bold">{i + 1}</span>
                <span className="text-sm leading-snug">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {data.citations.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-tight text-slate-400">Evidence</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.citations.slice(0, 2).map((cite, i) => (
                <a 
                  key={i} 
                  href={cite.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <p className="text-xs text-slate-600 line-clamp-2 italic">"{cite.snippet}"</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-indigo-600 font-medium group-hover:underline">View Source</span>
                    <AlertCircle className="w-3 h-3 text-slate-300" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-2 justify-between">
        <div className="flex gap-2">
          <button 
            onClick={() => onFollowUp('focus_negative')}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-2"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Follow-up
          </button>
          <button 
             onClick={() => onExport()}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-2"
          >
            <FileDown className="w-3.5 h-3.5" /> Export
          </button>
        </div>
        <button className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <Share2 className="w-3.5 h-3.5" /> Share to Slack
        </button>
      </div>
    </div>
  );
};

export default InsightCard;
