
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

const ToolShell: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200 h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
        <i className="fas fa-magnifying-glass-chart text-2xl"></i>
      </div>
      <h3 className="text-4xl font-black text-slate-900 tracking-tight">{title}</h3>
    </div>
    {children}
  </div>
);

export const AdvancedPlagiarismChecker: React.FC = () => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState<any>(null);

    const handleCheck = async () => {
        if (!text.trim()) return;
        setLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Act as an advanced plagiarism detection engine. Analyze the following text for matches against known web content, academic journals, and books. Identify exact, partial, and paraphrased similarities. Return a structured JSON response. Text: ${text}`;
            
            const result = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            originality_percentage: { type: Type.NUMBER },
                            plagiarism_percentage: { type: Type.NUMBER },
                            matched_sentences: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        text: { type: Type.STRING },
                                        similarity: { type: Type.STRING, description: 'exact, partial, or paraphrased' },
                                        source: { type: Type.STRING }
                                    }
                                }
                            },
                            summary: { type: Type.STRING }
                        },
                        required: ['originality_percentage', 'plagiarism_percentage', 'matched_sentences']
                    }
                }
            });

            const data = JSON.parse(result.text || '{}');
            setReport(data);
        } catch (e) {
            console.error(e);
            alert("Analysis failed. Please try a shorter snippet.");
        } finally {
            setLoading(false);
        }
    };

    const renderHighlighter = () => {
        if (!report) return null;
        let highlighted = text;
        return (
            <div className="p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] leading-relaxed text-lg text-slate-800 shadow-inner">
                {text.split('. ').map((sentence, idx) => {
                    const match = report.matched_sentences.find((m: any) => m.text.includes(sentence) || sentence.includes(m.text));
                    const color = match ? (match.similarity === 'exact' ? 'bg-red-200 text-red-900 border-b-2 border-red-400' : 'bg-yellow-200 text-yellow-900 border-b-2 border-yellow-400') : '';
                    return (
                        <span key={idx} className={`${color} rounded px-1 cursor-help group relative inline-block transition-all hover:brightness-95`}>
                            {sentence}. 
                            {match && (
                                <span className="absolute bottom-full left-0 mb-2 w-64 bg-slate-900 text-white text-[10px] p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none shadow-xl">
                                    <strong>{match.similarity.toUpperCase()} MATCH:</strong> {match.source}
                                </span>
                            )}
                        </span>
                    );
                })}
            </div>
        );
    };

    return (
        <ToolShell title="AI Plagiarism Suite">
            <div className="space-y-8">
                <div className="relative">
                    <textarea 
                        className="w-full h-80 p-8 border-2 border-slate-100 rounded-[2.5rem] focus:border-blue-500 outline-none transition-all text-lg bg-slate-50/50"
                        placeholder="Paste your document content here (Max 5,000 words)..."
                        value={text}
                        onChange={e => setText(e.target.value)}
                    />
                    <div className="absolute bottom-6 right-8 text-slate-400 font-bold text-xs uppercase tracking-widest">
                        {text.trim().split(/\s+/).length} Words
                    </div>
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={handleCheck}
                        disabled={loading || !text}
                        className="flex-grow bg-blue-600 text-white py-6 rounded-2xl font-black text-2xl shadow-xl shadow-blue-200 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {loading ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-shield-halved mr-3"></i>}
                        {loading ? 'ANALYZING SEMANTICS...' : 'SCAN FOR PLAGIARISM'}
                    </button>
                    <label className="cursor-pointer bg-slate-900 text-white px-8 flex items-center justify-center rounded-2xl font-bold hover:bg-black transition-colors">
                        <i className="fas fa-file-arrow-up text-xl"></i>
                        <input type="file" className="hidden" />
                    </label>
                </div>

                {report && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 text-center shadow-sm">
                                <div className="text-5xl font-black text-blue-600 mb-2">{report.originality_percentage}%</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Originality Score</div>
                            </div>
                            <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 text-center shadow-sm">
                                <div className="text-5xl font-black text-red-600 mb-2">{report.plagiarism_percentage}%</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plagiarism Detected</div>
                            </div>
                            <div className="bg-slate-900 p-8 rounded-[2rem] flex flex-col items-center justify-center text-center shadow-xl">
                                <button className="text-white font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:text-blue-400 transition-colors">
                                    <i className="fas fa-download"></i> Download Report (PDF)
                                </button>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Interactive Document Analysis</h4>
                            {renderHighlighter()}
                        </div>

                        <div className="bg-blue-50 p-10 rounded-[2.5rem] border border-blue-100">
                            <h4 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-4">Semantic Summary</h4>
                            <p className="text-blue-800 leading-relaxed font-medium">{report.summary}</p>
                        </div>
                    </div>
                )}
            </div>
        </ToolShell>
    );
};
