
import React, { useState } from 'react';
import { InsightData, Topic } from '../types';
// Fix: Added missing AlertCircle import from lucide-react
import { BarChart3, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';

interface Props {
  data: InsightData;
}

const DetailsPanel: React.FC<Props> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'complaints' | 'pricing' | 'sentiment'>('complaints');

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
      <div className="flex border-b border-slate-100">
        {[
          { id: 'complaints', label: 'Top Complaints', icon: TrendingDown },
          { id: 'pricing', label: 'Price Compare', icon: DollarSign },
          { id: 'sentiment', label: 'Sentiment', icon: BarChart3 }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === tab.id ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6 h-[400px] overflow-y-auto">
        {activeTab === 'complaints' && (
          <div className="space-y-4">
            {data.topics?.map((topic, i) => (
              <div key={i} className="p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="text-sm font-bold text-slate-800">{topic.topic}</h5>
                    <p className="text-[10px] text-slate-400 font-medium">Topic Confidence: {(topic.score * 100).toFixed(0)}%</p>
                  </div>
                  <span className="px-2 py-1 bg-red-50 text-red-600 rounded text-[10px] font-bold">
                    {topic.count} MENTIONS
                  </span>
                </div>
                <div className="relative h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
                  <div className="absolute top-0 left-0 h-full bg-red-400" style={{ width: `${Math.min(100, (topic.count / 20) * 100)}%` }} />
                </div>
                {topic.examples.map((ex, j) => (
                  <div key={j} className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg border-l-2 border-slate-200">
                    "{ex.text}"
                  </div>
                ))}
              </div>
            )) || <EmptyState message="No complaint data extracted yet." />}
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <p className="text-[10px] font-bold text-indigo-400 uppercase">Your Base Price</p>
                <p className="text-2xl font-black text-indigo-700 mt-1">${data.priceComparison?.basePrice.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Avg. Competitor</p>
                <p className="text-2xl font-black text-slate-700 mt-1">
                  ${(data.priceComparison?.competitors.reduce((acc, c) => acc + c.price_normalized, 0)! / (data.priceComparison?.competitors.length || 1)).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100">
                    <th className="pb-2 font-bold uppercase tracking-tighter">Marketplace</th>
                    <th className="pb-2 font-bold uppercase tracking-tighter">Listed Price</th>
                    <th className="pb-2 font-bold uppercase tracking-tighter">Normalized</th>
                    <th className="pb-2 font-bold uppercase tracking-tighter">Diff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.priceComparison?.competitors.map((c, i) => {
                    const diff = c.price_normalized - (data.priceComparison?.basePrice || 0);
                    return (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 font-semibold text-slate-700">{c.marketplace}</td>
                        <td className="py-3 text-slate-500">{c.price_raw}</td>
                        <td className="py-3 font-mono font-bold">${c.price_normalized.toFixed(2)}</td>
                        <td className={`py-3 font-bold ${diff > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {diff > 0 ? '+' : ''}{diff.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'sentiment' && (
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <div className="relative w-48 h-48">
              {/* Simple CSS-based Sentiment Circle */}
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <path
                  className="text-slate-100 stroke-current"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400 stroke-current"
                  strokeWidth="3.5"
                  strokeDasharray={`${data.sentimentDistribution?.positive || 33}, 100`}
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                   className="text-red-400 stroke-current"
                   strokeWidth="3.5"
                   strokeDasharray={`${data.sentimentDistribution?.negative || 20}, 100`}
                   strokeDashoffset="-70"
                   fill="none"
                   d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-800">{data.sentimentDistribution?.positive || 0}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Positive</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 w-full gap-4">
              <div className="text-center">
                 <div className="h-2 w-full bg-emerald-100 rounded-full mb-2 overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${data.sentimentDistribution?.positive}%` }} />
                 </div>
                 <span className="text-[10px] font-bold text-emerald-600">POS</span>
              </div>
              <div className="text-center">
                 <div className="h-2 w-full bg-slate-100 rounded-full mb-2 overflow-hidden">
                    <div className="h-full bg-slate-400" style={{ width: `${data.sentimentDistribution?.neutral}%` }} />
                 </div>
                 <span className="text-[10px] font-bold text-slate-500">NEU</span>
              </div>
              <div className="text-center">
                 <div className="h-2 w-full bg-red-100 rounded-full mb-2 overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: `${data.sentimentDistribution?.negative}%` }} />
                 </div>
                 <span className="text-[10px] font-bold text-red-600">NEG</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center h-full text-slate-400">
    <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
    <p className="text-sm italic">{message}</p>
  </div>
);

export default DetailsPanel;