
import React, { useState } from 'react';

const ToolShell: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200 h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
        <i className="fas fa-chart-area text-2xl"></i>
      </div>
      <h3 className="text-4xl font-black text-slate-900 tracking-tight">{title}</h3>
    </div>
    {children}
  </div>
);

export const GenericDataUtility: React.FC = () => {
    const [data, setData] = useState('');
    const title = window.location.hash.replace('#', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    return (
        <ToolShell title={title}>
            <div className="space-y-6">
                <div className="flex justify-between items-center px-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Input Dataset</span>
                    <button className="text-xs font-bold text-emerald-600 hover:underline">UPLOAD CSV/JSON</button>
                </div>
                <textarea 
                    className="w-full h-64 p-6 bg-slate-900 text-emerald-400 font-mono text-sm rounded-[2.5rem] shadow-inner outline-none focus:ring-4 focus:ring-emerald-100 border-none transition-all"
                    placeholder="Paste your raw data here..."
                    value={data}
                    onChange={e => setData(e.target.value)}
                />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-emerald-700 transition-all">PROCESS</button>
                    <button className="bg-slate-100 text-slate-600 py-4 rounded-2xl font-black hover:bg-slate-200 transition-all">VALIDATE</button>
                    <button className="bg-slate-100 text-slate-600 py-4 rounded-2xl font-black hover:bg-slate-200 transition-all">MINIFY</button>
                    <button className="bg-slate-100 text-slate-600 py-4 rounded-2xl font-black hover:bg-slate-200 transition-all">EXPORT</button>
                </div>
                <div className="mt-8 p-12 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem]">
                    <i className="fas fa-microchip text-4xl text-slate-200 mb-4"></i>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Waiting for data processing...</p>
                </div>
            </div>
        </ToolShell>
    );
};
