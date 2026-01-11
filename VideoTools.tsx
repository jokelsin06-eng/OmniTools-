
import React, { useState } from 'react';

const ToolShell: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-slate-950 p-10 rounded-[3rem] shadow-2xl h-full animate-in fade-in zoom-in duration-300">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center">
        <i className="fas fa-video text-2xl"></i>
      </div>
      <h3 className="text-4xl font-black text-white tracking-tight">{title}</h3>
    </div>
    {children}
  </div>
);

export const GenericVideoConverter: React.FC = () => {
    const [video, setVideo] = useState<File | null>(null);
    const title = window.location.hash.replace('#', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const format = title.split(' ').pop();

    return (
        <ToolShell title={title}>
            <div className="flex flex-col items-center">
                <label className="w-full h-80 border-4 border-dashed border-white/10 rounded-[3rem] bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all group mb-8">
                    <div className="w-20 h-20 bg-white text-slate-900 rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <i className="fas fa-play text-2xl"></i>
                    </div>
                    <span className="text-xl font-black text-white uppercase tracking-widest">Load Media Asset</span>
                    <input type="file" className="hidden" accept="video/*" onChange={e => setVideo(e.target.files?.[0] || null)} />
                </label>
                {video && (
                    <div className="w-full bg-white/10 p-8 rounded-[2.5rem] flex justify-between items-center mb-8 border border-white/5">
                        <span className="text-white font-bold truncate">{video.name}</span>
                        <div className="bg-blue-500 text-[10px] font-black text-white px-3 py-1 rounded-full uppercase">Ready</div>
                    </div>
                )}
                <button className="w-full bg-white text-slate-950 py-6 rounded-2xl font-black text-2xl shadow-xl hover:bg-slate-100 transition-all active:scale-95 disabled:bg-white/10 disabled:text-white/20" disabled={!video}>
                    RENDER AS {format}
                </button>
            </div>
        </ToolShell>
    );
};

export const GenericVideoEffect: React.FC = () => {
    const title = window.location.hash.replace('#', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return (
        <ToolShell title={title}>
            <div className="p-20 text-center bg-white/5 border-2 border-dashed border-white/10 rounded-[3rem]">
                <i className="fas fa-film text-6xl text-white/20 mb-6"></i>
                <p className="text-white font-black uppercase tracking-widest text-lg">{title} Workbench</p>
                <p className="text-white/40 text-sm mt-4">Hardware-accelerated processing node enabled.</p>
                <button className="mt-10 bg-blue-600 text-white px-12 py-5 rounded-2xl font-black tracking-widest shadow-lg shadow-blue-500/20">ATTACH FILE</button>
            </div>
        </ToolShell>
    );
};
