
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const ToolShell: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200 h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
        <i className="fas fa-graduation-cap text-2xl"></i>
      </div>
      <h3 className="text-4xl font-black text-slate-900 tracking-tight">{title}</h3>
    </div>
    {children}
  </div>
);

export const GenericEducationAI: React.FC = () => {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const title = window.location.hash.replace('#', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    const handleRun = async () => {
        if (!input.trim()) return;
        setLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Act as an academic tutor. Task: ${title}. Input context: ${input}. Provide a structured, highly educational, and accurate response. Format it clearly for study purposes.`;
            const result = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
            setResponse(result.text || 'No response.');
        } catch (e) { setResponse('Error: AI Node offline.'); }
        finally { setLoading(false); }
    };

    return (
        <ToolShell title={title}>
            <textarea 
                className="w-full h-48 p-8 border-2 border-slate-100 rounded-[2.5rem] mb-6 bg-slate-50 focus:border-blue-500 outline-none transition-all text-lg font-medium"
                placeholder="What topic are we studying today?"
                value={input}
                onChange={e => setInput(e.target.value)}
            />
            <button onClick={handleRun} disabled={loading} className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-2xl shadow-xl shadow-blue-100">
                {loading ? 'AI IS TUTORING...' : 'GENERATE STUDY MATERIAL'}
            </button>
            {response && (
                <div className="mt-10 p-10 bg-slate-900 text-white rounded-[3rem] prose prose-invert max-w-none shadow-2xl">
                    <div className="whitespace-pre-wrap leading-relaxed">{response}</div>
                </div>
            )}
        </ToolShell>
    );
};

export const GenericScienceTool: React.FC = () => {
    const title = window.location.hash.replace('#', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return (
        <ToolShell title={title}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Problem Parameters</label>
                    <input className="w-full p-5 border-2 rounded-2xl font-bold bg-slate-50" placeholder="Parameter X" />
                    <input className="w-full p-5 border-2 rounded-2xl font-bold bg-slate-50" placeholder="Parameter Y" />
                    <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black shadow-lg">CALCULATE RESULT</button>
                </div>
                <div className="p-10 bg-cyan-50 rounded-[2.5rem] flex flex-col items-center justify-center border-4 border-white shadow-inner">
                    <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2">Scientific Output</div>
                    <div className="text-6xl font-black text-cyan-600 tracking-tighter">0.000</div>
                    <div className="mt-4 text-xs font-bold text-cyan-300 uppercase">Wait for input...</div>
                </div>
            </div>
        </ToolShell>
    );
};
