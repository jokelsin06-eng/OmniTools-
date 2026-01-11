
import React, { useState } from 'react';

const ToolShell: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200 h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
        <i className="fas fa-file-pdf text-2xl"></i>
      </div>
      <h3 className="text-4xl font-black text-slate-900 tracking-tight">{title}</h3>
    </div>
    {children}
  </div>
);

export const GenericPDFTool: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const title = window.location.hash.replace('#', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    return (
        <ToolShell title={title}>
            <div className="flex flex-col items-center">
                <label className="w-full h-64 border-4 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all group mb-8">
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <i className="fas fa-cloud-upload-alt text-3xl text-red-500"></i>
                    </div>
                    <span className="text-lg font-black text-slate-400 uppercase tracking-widest">Drop PDF Files Here</span>
                    <input type="file" multiple className="hidden" accept=".pdf" onChange={e => setFiles(Array.from(e.target.files || []))} />
                </label>
                {files.length > 0 && (
                    <div className="w-full space-y-4 mb-8">
                        {files.map((f, i) => (
                            <div key={i} className="bg-slate-900 text-white p-6 rounded-2xl flex justify-between items-center">
                                <span className="font-bold truncate">{f.name}</span>
                                <span className="text-xs font-black text-slate-400">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                        ))}
                    </div>
                )}
                <button className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-red-700 transition-all active:scale-95 disabled:bg-slate-200" disabled={files.length === 0}>
                    PROCESS PDF
                </button>
            </div>
        </ToolShell>
    );
};
