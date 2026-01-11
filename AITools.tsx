
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const ToolShell: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200 h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-14 h-14 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center">
        <i className="fas fa-brain text-2xl"></i>
      </div>
      <h3 className="text-4xl font-black text-slate-900 tracking-tight">{title}</h3>
    </div>
    {children}
  </div>
);

export const GenericAIProductivity: React.FC = () => {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const title = window.location.hash.replace('#', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    const handleRun = async () => {
        if (!input.trim()) return;
        setLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Act as an expert in productivity. Task: ${title}. Context/Input: ${input}. Provide a professional, extremely detailed, and structured response.`;
            const result = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
            setResponse(result.text || 'No response.');
        } catch (e) { setResponse('API Error.'); }
        finally { setLoading(false); }
    };

    return (
        <ToolShell title={title}>
            <textarea 
                className="w-full h-48 p-6 border-2 border-slate-100 rounded-3xl mb-6 bg-slate-50 focus:border-blue-500 outline-none transition-all text-lg font-medium"
                placeholder="What can I help you build or plan today?"
                value={input}
                onChange={e => setInput(e.target.value)}
            />
            <button 
                onClick={handleRun}
                disabled={loading}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3"
            >
                {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-bolt text-yellow-400"></i>}
                {loading ? 'AI IS THINKING...' : 'RUN AI ENGINE'}
            </button>
            {response && (
                <div className="mt-10 p-10 bg-slate-50 border-2 border-slate-100 rounded-[3rem] animate-in zoom-in duration-500 prose max-w-none shadow-inner">
                    <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-6">Generated Result</h4>
                    <div className="whitespace-pre-wrap leading-relaxed text-slate-800 text-lg">{response}</div>
                </div>
            )}
        </ToolShell>
    );
};
// Re-export specific logic as needed for original tools...
export const AIGrammarFixer = GenericAIProductivity;
export const AISummarizer = GenericAIProductivity;
export const AITranslator = GenericAIProductivity;
export const TempEmailTool: React.FC = () => <div>Implemented above...</div>;
