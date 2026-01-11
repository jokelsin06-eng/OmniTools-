
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const ToolShell: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200 h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
        <i className="fas fa-share-nodes text-2xl"></i>
      </div>
      <h3 className="text-4xl font-black text-slate-900 tracking-tight">{title}</h3>
    </div>
    {children}
  </div>
);

export const GenericSocialAI: React.FC = () => {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const title = window.location.hash.replace('#', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    const handleRun = async () => {
        if (!input.trim()) return;
        setLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Act as a top-tier social media manager and growth expert. 
            Task: ${title}. 
            Context: ${input}. 
            Provide the output with viral potential, including relevant hashtags, emojis, and optimal spacing for the specific platform mentioned in the task name. 
            Make it professional yet engaging.`;
            
            const result = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
            setResponse(result.text || 'No response.');
        } catch (e) { 
            setResponse('API Connection Error. Please verify your Gemini connection.'); 
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <ToolShell title={title}>
            <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Post Context / Topic</label>
                    <textarea 
                        className="w-full h-40 p-4 border-2 border-slate-200 rounded-2xl bg-white focus:border-red-500 outline-none transition-all font-medium text-lg shadow-inner"
                        placeholder="What is your post or brand about? (e.g. 'Healthy breakfast recipes' or 'New gaming PC build')"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                </div>
                <button 
                    onClick={handleRun} 
                    disabled={loading || !input.trim()} 
                    className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-red-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                >
                    {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-bolt"></i>}
                    {loading ? 'CRAFTING VIRAL CONTENT...' : 'GENERATE STRATEGY'}
                </button>
                {response && (
                    <div className="mt-8 p-10 bg-slate-900 text-white rounded-[3rem] shadow-2xl animate-in zoom-in duration-500 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4">
                             <button onClick={() => navigator.clipboard.writeText(response)} className="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all"><i className="fas fa-copy"></i></button>
                        </div>
                        <h4 className="text-[10px] font-black text-red-400 uppercase tracking-[0.3em] mb-6">Generated Content Plan</h4>
                        <div className="whitespace-pre-wrap leading-relaxed text-lg border-l-4 border-red-500 pl-6">{response}</div>
                    </div>
                )}
            </div>
        </ToolShell>
    );
};
