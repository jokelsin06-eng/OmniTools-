
import React, { useState } from 'react';

const ToolShell: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200 h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
        <i className="fas fa-volume-high text-2xl"></i>
      </div>
      <h3 className="text-4xl font-black text-slate-900 tracking-tight">{title}</h3>
    </div>
    {children}
  </div>
);

export const GenericAudioConverter: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const title = window.location.hash.replace('#', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const format = title.split(' ').pop();

    return (
        <ToolShell title={title}>
            <div className="flex flex-col items-center">
                <label className="w-full h-72 border-4 border-dashed border-indigo-100 rounded-[3rem] bg-indigo-50/30 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50 transition-all group mb-8">
                    <div className="flex gap-1 mb-6">
                        {[1,2,3,4,5,4,3,2,1].map((h, i) => (
                            <div key={i} className={`w-1.5 bg-indigo-200 group-hover:bg-indigo-400 rounded-full transition-all`} style={{ height: `${h * 10}px` }}></div>
                        ))}
                    </div>
                    <span className="text-xl font-black text-indigo-900 uppercase tracking-widest">Upload Audio File</span>
                    <p className="text-sm text-indigo-400 font-bold mt-2">MP3, WAV, FLAC, M4A...</p>
                    <input type="file" className="hidden" accept="audio/*" onChange={e => setFile(e.target.files?.[0] || null)} />
                </label>
                {file && (
                    <div className="w-full bg-slate-900 p-8 rounded-[2.5rem] flex justify-between items-center mb-8 shadow-2xl">
                        <div className="flex items-center gap-4">
                            <i className="fas fa-music text-indigo-400"></i>
                            <span className="text-white font-bold truncate max-w-xs">{file.name}</span>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                    </div>
                )}
                <button className="w-full bg-indigo-600 text-white py-6 rounded-2xl font-black text-2xl shadow-xl hover:bg-indigo-700 transition-all active:scale-95 disabled:bg-slate-200" disabled={!file}>
                    DOWNLOAD AS {format}
                </button>
            </div>
        </ToolShell>
    );
};

export const GenericAudioEffect: React.FC = () => {
    const title = window.location.hash.replace('#', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return (
        <ToolShell title={title}>
            <div className="p-12 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem]">
                <i className="fas fa-sliders-h text-6xl text-slate-200 mb-6"></i>
                <h4 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">{title} Controller</h4>
                <p className="text-slate-500 font-medium max-w-md mx-auto">This tool uses Web Audio API nodes for zero-latency client-side processing. Select a file to begin.</p>
                <button className="mt-8 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black tracking-widest hover:bg-black transition-all">CHOOSE SOURCE</button>
            </div>
        </ToolShell>
    );
};
