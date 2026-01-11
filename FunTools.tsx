
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const ToolShell: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200 h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-14 h-14 bg-fuchsia-100 text-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg shadow-fuchsia-100">
        <i className="fas fa-gamepad text-2xl"></i>
      </div>
      <h3 className="text-4xl font-black text-slate-900 tracking-tight">{title}</h3>
    </div>
    {children}
  </div>
);

export const GenericFunTool: React.FC = () => {
    const [result, setResult] = useState<string | number | null>(null);
    const [loading, setLoading] = useState(false);
    const title = window.location.hash.replace('#', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    const handleAction = async () => {
        setLoading(true);
        // If it's a generator that requires AI
        if (title.includes('Gen') || title.includes('Quote') || title.includes('Riddle')) {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const prompt = `Game/Fun Utility: ${title}. Provide a unique, creative, and fun result for this task. Keep it short and high-energy!`;
                const resp = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
                setResult(resp.text || 'Error');
            } catch (e) { setResult('Try again later!'); }
        } else {
            // Simple randomization logic
            setTimeout(() => {
                if (title.includes('Dice')) setResult(Math.floor(Math.random() * 6) + 1);
                else if (title.includes('Coin')) setResult(Math.random() > 0.5 ? 'HEADS' : 'TAILS');
                else setResult('CLICK TO ROLL');
            }, 500);
        }
        setLoading(false);
    };

    return (
        <ToolShell title={title}>
            <div className="flex flex-col items-center">
                <div className="w-full h-80 bg-gradient-to-br from-fuchsia-500 to-pink-600 rounded-[3.5rem] flex flex-col items-center justify-center shadow-2xl mb-10 overflow-hidden relative border-8 border-white">
                    <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:20px_20px]"></div>
                    <div className="text-white text-6xl font-black tracking-tighter drop-shadow-lg text-center px-8">
                        {loading ? <i className="fas fa-spinner fa-spin text-4xl"></i> : (result || '?')}
                    </div>
                    {result && !loading && (
                        <div className="absolute bottom-10 animate-bounce bg-white/20 px-4 py-1 rounded-full text-white font-black text-[10px] uppercase tracking-widest">Victory!</div>
                    )}
                </div>
                <button 
                    onClick={handleAction} 
                    disabled={loading}
                    className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                >
                    {loading ? 'PROCESSING...' : 'TRIGGER ACTION'}
                </button>
            </div>
        </ToolShell>
    );
};
