
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const ToolShell: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
        <i className="fas fa-code text-xl"></i>
      </div>
      <h3 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h3>
    </div>
    {children}
  </div>
);

const CodeEditor: React.FC<{ value: string; onChange: (v: string) => void; placeholder?: string; readOnly?: boolean; height?: string }> = ({ value, onChange, placeholder, readOnly, height = "h-80" }) => (
  <textarea 
    className={`w-full ${height} p-8 border-2 border-slate-100 rounded-3xl font-mono text-sm mb-6 bg-slate-900 text-slate-100 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none shadow-inner`}
    placeholder={placeholder}
    value={value}
    readOnly={readOnly}
    onChange={e => onChange(e.target.value)}
  />
);

export const JSONFormatter: React.FC = () => {
  const [json, setJson] = useState('');
  const format = () => {
    try {
      const obj = JSON.parse(json);
      setJson(JSON.stringify(obj, null, 2));
    } catch (e) { alert("Invalid JSON"); }
  };
  return (
    <ToolShell title="JSON Prettifier">
      <CodeEditor value={json} onChange={setJson} placeholder='{"foo":"bar"}' />
      <button onClick={format} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all">Prettify Code</button>
    </ToolShell>
  );
};

export const JSONMinifier: React.FC = () => {
  const [json, setJson] = useState('');
  const minify = () => {
    try {
      const obj = JSON.parse(json);
      setJson(JSON.stringify(obj));
    } catch (e) { alert("Invalid JSON"); }
  };
  return (
    <ToolShell title="JSON Minifier">
      <CodeEditor value={json} onChange={setJson} />
      <button onClick={minify} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:bg-black active:scale-95 transition-all">Minify JSON</button>
    </ToolShell>
  );
};

export const HTMLFormatter: React.FC = () => {
  const [code, setCode] = useState('');
  const format = () => {
    let formatted = '';
    let pad = 0;
    code.split(/>\s*</).forEach(node => {
      if (node.match(/^\/\w/)) pad--;
      formatted += '  '.repeat(Math.max(0, pad)) + '<' + node + '>\r\n';
      if (node.match(/^<?\w[^>]*[^\/]$/) && !node.match(/^input|img|br|hr|meta|link/)) pad++;
    });
    setCode(formatted.trim().replace(/^<|>$/g, ''));
  };
  return (
    <ToolShell title="HTML Prettifier">
      <CodeEditor value={code} onChange={setCode} placeholder="<div class='foo'><p>Hello World</p></div>" />
      <button onClick={format} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black">Beautify HTML</button>
    </ToolShell>
  );
};

export const JSFormatter: React.FC = () => {
  const [code, setCode] = useState('');
  const format = () => {
    let formatted = code
      .replace(/\{/g, ' {\n  ')
      .replace(/\}/g, '\n}\n')
      .replace(/;/g, ';\n')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
    setCode(formatted);
  };
  return (
    <ToolShell title="JS Prettifier">
      <CodeEditor value={code} onChange={setCode} placeholder="function hello(){console.log('world');}" />
      <button onClick={format} className="bg-yellow-500 text-black px-10 py-4 rounded-2xl font-black">Beautify JavaScript</button>
    </ToolShell>
  );
};

export const SQLFormatter: React.FC = () => {
  const [code, setCode] = useState('');
  const format = () => {
    const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'GROUP BY', 'ORDER BY', 'LIMIT', 'INSERT INTO', 'UPDATE', 'DELETE', 'SET', 'VALUES'];
    let formatted = code;
    keywords.forEach(k => {
      const regex = new RegExp(`\\b${k}\\b`, 'gi');
      formatted = formatted.replace(regex, `\n${k.toUpperCase()}`);
    });
    setCode(formatted.trim());
  };
  return (
    <ToolShell title="SQL Prettifier">
      <CodeEditor value={code} onChange={setCode} placeholder="SELECT * FROM users WHERE id=1" />
      <button onClick={format} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black">Format SQL</button>
    </ToolShell>
  );
};

const useAIConverter = () => {
  const [loading, setLoading] = useState(false);
  const convert = async (input: string, promptPrefix: string) => {
    if (!input.trim()) return '';
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `${promptPrefix}: ${input}. Return ONLY the code, no markdown formatting.`;
      const result = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      return result.text?.trim() || 'Conversion failed.';
    } catch (e) {
      return 'Error: AI conversion unavailable.';
    } finally {
      setLoading(false);
    }
  };
  return { loading, convert };
};

// Generic tool for formatting various languages dynamically
export const GenericCodeFormatter: React.FC = () => {
  const [code, setCode] = useState('');
  const { loading, convert } = useAIConverter();
  const title = window.location.hash.replace('#', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const lang = title.replace('Formatter', '').trim();

  return (
    <ToolShell title={title}>
      <CodeEditor value={code} onChange={setCode} placeholder={`Paste your ${lang} code here...`} />
      <button 
        disabled={loading}
        onClick={async () => setCode(await convert(code, `Prettify and indent this ${lang} code`))} 
        className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black disabled:opacity-50"
      >
        {loading ? 'Formatting...' : `Beautify ${lang}`}
      </button>
    </ToolShell>
  );
};

// Generic tool for various developer utilities dynamically
export const GenericDevUtil: React.FC = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const title = window.location.hash.replace('#', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    const handleRun = async () => {
        if (!input.trim()) return;
        setLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Developer Utility Task: ${title}. Input: ${input}. Provide the most professional and standard result. Return ONLY the output value:`;
            const result = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
            setOutput(result.text || 'Error');
        } catch (e) { setOutput('API Error'); }
        finally { setLoading(false); }
    };

    return (
        <ToolShell title={title}>
            <textarea 
                className="w-full h-40 p-6 bg-slate-900 text-slate-100 rounded-3xl font-mono text-sm mb-4 outline-none focus:ring-4 focus:ring-blue-100 transition-all" 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                placeholder="Paste input here..." 
            />
            <button 
                onClick={handleRun} 
                disabled={loading} 
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black mb-4 hover:bg-black transition-colors"
            >
                {loading ? 'Processing...' : `Execute ${title}`}
            </button>
            {output && (
                <div className="p-6 bg-blue-50 text-blue-900 rounded-2xl font-mono text-xs whitespace-pre-wrap border border-blue-100 animate-in zoom-in duration-300">
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">Output Result</h4>
                    {output}
                </div>
            )}
        </ToolShell>
    );
};

export const YAMLToJSON: React.FC = () => {
  const [input, setInput] = useState('');
  const { loading, convert } = useAIConverter();
  return (
    <ToolShell title="YAML to JSON">
      <CodeEditor value={input} onChange={setInput} placeholder="foo: bar&#10;list:&#10;  - item 1" />
      <button 
        disabled={loading}
        onClick={async () => setInput(await convert(input, 'Convert this YAML to JSON'))} 
        className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black disabled:opacity-50"
      >
        {loading ? 'Converting...' : 'Convert to JSON'}
      </button>
    </ToolShell>
  );
};

export const JSONToYAML: React.FC = () => {
  const [input, setInput] = useState('');
  const { loading, convert } = useAIConverter();
  return (
    <ToolShell title="JSON to YAML">
      <CodeEditor value={input} onChange={setInput} placeholder='{"foo": "bar"}' />
      <button 
        disabled={loading}
        onClick={async () => setInput(await convert(input, 'Convert this JSON to YAML'))} 
        className="bg-orange-600 text-white px-10 py-4 rounded-2xl font-black disabled:opacity-50"
      >
        {loading ? 'Converting...' : 'Convert to YAML'}
      </button>
    </ToolShell>
  );
};

export const CURLToCode: React.FC = () => {
  const [input, setInput] = useState('');
  const { loading, convert } = useAIConverter();
  return (
    <ToolShell title="CURL to Code">
      <CodeEditor value={input} onChange={setInput} placeholder="curl https://api.example.com/data" />
      <button 
        disabled={loading}
        onClick={async () => setInput(await convert(input, 'Convert this CURL command to a clean JavaScript fetch() call'))} 
        className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black disabled:opacity-50"
      >
        {loading ? 'Converting...' : 'Generate Fetch Code'}
      </button>
    </ToolShell>
  );
};

export const JSONToTypeScript: React.FC = () => {
  const [input, setInput] = useState('');
  const { loading, convert } = useAIConverter();
  return (
    <ToolShell title="JSON to TS">
      <CodeEditor value={input} onChange={setInput} placeholder='{"id": 1, "name": "Tool"}' />
      <button 
        disabled={loading}
        onClick={async () => setInput(await convert(input, 'Convert this JSON object to a TypeScript Interface named RootObject'))} 
        className="bg-blue-700 text-white px-10 py-4 rounded-2xl font-black disabled:opacity-50"
      >
        {loading ? 'Generating TS...' : 'Generate Interfaces'}
      </button>
    </ToolShell>
  );
};

export const XMLToJSONAI: React.FC = () => {
  const [input, setInput] = useState('');
  const { loading, convert } = useAIConverter();
  return (
    <ToolShell title="XML to JSON (AI)">
      <CodeEditor value={input} onChange={setInput} placeholder="<note><to>User</to></note>" />
      <button 
        disabled={loading}
        onClick={async () => setInput(await convert(input, 'Convert this XML to a structured JSON object'))} 
        className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black"
      >
        Convert to JSON
      </button>
    </ToolShell>
  );
};

export const JSONToXMLAI: React.FC = () => {
  const [input, setInput] = useState('');
  const { loading, convert } = useAIConverter();
  return (
    <ToolShell title="JSON to XML (AI)">
      <CodeEditor value={input} onChange={setInput} placeholder='{"note": {"to": "User"}}' />
      <button 
        disabled={loading}
        onClick={async () => setInput(await convert(input, 'Convert this JSON to clean XML markup'))} 
        className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black"
      >
        Convert to XML
      </button>
    </ToolShell>
  );
};

export const CronHelper: React.FC = () => {
  const [input, setInput] = useState('');
  const { loading, convert } = useAIConverter();
  return (
    <ToolShell title="Crontab Helper">
      <div className="mb-4">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Describe Frequency</label>
        <input 
            className="w-full p-4 border-2 rounded-2xl font-bold bg-slate-50 mb-4" 
            placeholder="Every Monday at 3 PM..." 
            value={input} 
            onChange={e => setInput(e.target.value)} 
        />
        <button 
            disabled={loading}
            onClick={async () => setInput(await convert(input, 'Generate a crontab expression for the following description'))} 
            className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black w-full"
        >
            Generate Cron
        </button>
      </div>
      <div className="p-10 bg-slate-900 text-white rounded-[2.5rem] text-center font-mono text-4xl">
        {loading ? '...' : (input.includes('*') ? input : 'Result Here')}
      </div>
    </ToolShell>
  );
};

export const LoremIpsumGenerator: React.FC = () => {
  const [paras, setParas] = useState(3);
  const [result, setResult] = useState('');
  const gen = () => {
    const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ";
    setResult(new Array(paras).fill(text).join('\n\n'));
  };
  return (
    <ToolShell title="Lorem Ipsum">
      <div className="flex gap-4 mb-8 items-center bg-slate-50 p-6 rounded-3xl border">
        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Paragraphs</label>
        <input type="number" value={paras} onChange={e => setParas(parseInt(e.target.value))} className="w-24 p-2 border rounded-xl font-bold" />
        <button onClick={gen} className="bg-slate-900 text-white px-8 py-2 rounded-xl font-bold flex-grow">Generate Text</button>
      </div>
      <CodeEditor value={result} onChange={setResult} placeholder="Placeholder text will appear here..." />
    </ToolShell>
  );
};

export const CSSShadowGenerator: React.FC = () => {
  const [h, setH] = useState(10);
  const [v, setV] = useState(10);
  const [b, setB] = useState(20);
  const [s, setS] = useState(0);
  const shadow = `${h}px ${v}px ${b}px ${s}px rgba(0,0,0,0.2)`;
  return (
    <ToolShell title="CSS Box Shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex justify-between items-center"><label className="text-[10px] font-bold uppercase">H-Offset</label><input type="range" min="-100" max="100" value={h} onChange={e => setH(parseInt(e.target.value))} className="w-40" /></div>
          <div className="flex justify-between items-center"><label className="text-[10px] font-bold uppercase">V-Offset</label><input type="range" min="-100" max="100" value={v} onChange={e => setV(parseInt(e.target.value))} className="w-40" /></div>
          <div className="flex justify-between items-center"><label className="text-[10px] font-bold uppercase">Blur</label><input type="range" min="0" max="100" value={b} onChange={e => setB(parseInt(e.target.value))} className="w-40" /></div>
          <div className="flex justify-between items-center"><label className="text-[10px] font-bold uppercase">Spread</label><input type="range" min="-50" max="50" value={s} onChange={e => setS(parseInt(e.target.value))} className="w-40" /></div>
          <div className="p-4 bg-slate-900 text-white rounded-2xl font-mono text-xs break-all">box-shadow: {shadow};</div>
        </div>
        <div className="flex items-center justify-center p-12 bg-slate-50 rounded-[3rem] shadow-inner">
           <div className="w-48 h-48 bg-white rounded-3xl" style={{ boxShadow: shadow }}></div>
        </div>
      </div>
    </ToolShell>
  );
};

export const CSSGradientGenerator: React.FC = () => {
  const [c1, setC1] = useState('#2563EB');
  const [c2, setC2] = useState('#10B981');
  const [deg, setDeg] = useState(135);
  const gradient = `linear-gradient(${deg}deg, ${c1}, ${c2})`;
  return (
    <ToolShell title="CSS Gradient">
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4 bg-slate-50 p-6 rounded-3xl">
           <input type="color" value={c1} onChange={e => setC1(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none" />
           <input type="color" value={c2} onChange={e => setC2(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer border-none" />
           <input type="number" value={deg} onChange={e => setDeg(parseInt(e.target.value))} className="w-full h-12 rounded-xl p-2 border font-bold text-center" />
        </div>
        <div className="w-full h-40 rounded-[2.5rem] shadow-2xl" style={{ background: gradient }}></div>
        <div className="p-6 bg-slate-900 text-white rounded-3xl font-mono text-sm border-l-8 border-blue-500">background: {gradient};</div>
      </div>
    </ToolShell>
  );
};

export const JSONPathTester: React.FC = () => {
  const [json, setJson] = useState('{"store": {"book": [{"title": "Saying"}, {"title": "Sword"}]}}');
  const [path, setPath] = useState('$.store.book[*].title');
  const { loading, convert } = useAIConverter();
  return (
    <ToolShell title="JSON Path Tester">
      <CodeEditor height="h-40" value={json} onChange={setJson} />
      <div className="flex gap-4 mb-4">
        <input className="flex-grow p-4 border-2 rounded-2xl font-mono text-sm bg-slate-50" value={path} onChange={e => setPath(e.target.value)} />
        <button 
            disabled={loading}
            onClick={async () => setPath(await convert(json + "\n" + path, 'Execute this JSONPath query on the provided JSON data and return the resulting objects/values as a formatted JSON array'))} 
            className="bg-blue-600 text-white px-8 rounded-2xl font-black"
        >
            Test Path
        </button>
      </div>
      <div className="bg-slate-900 p-8 rounded-3xl min-h-[100px] font-mono text-green-400 text-xs shadow-inner">
        {loading ? 'Evaluating...' : (path.startsWith('[') || path.startsWith('{') ? path : 'Results will appear here')}
      </div>
    </ToolShell>
  );
};

export const HashGenerator: React.FC = () => {
  const [text, setText] = useState('');
  const [hashes, setHashes] = useState({ sha256: '', sha512: '', sha1: '' });

  useEffect(() => {
    const gen = async () => {
      if (!text) return;
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      
      const calc = async (algo: string) => {
        const buffer = await crypto.subtle.digest(algo, data);
        return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
      };

      setHashes({
        sha256: await calc('SHA-256'),
        sha512: await calc('SHA-512'),
        sha1: await calc('SHA-1')
      });
    };
    gen();
  }, [text]);

  return (
    <ToolShell title="Hash Generator">
      <textarea className="w-full h-32 p-6 border-2 rounded-3xl mb-6 bg-slate-50 font-mono" placeholder="Enter text to hash..." value={text} onChange={e => setText(e.target.value)} />
      <div className="space-y-4">
        {Object.entries(hashes).map(([k, v]) => (
          <div key={k} className="bg-slate-900 p-6 rounded-2xl border-l-4 border-blue-500">
            <div className="text-[10px] text-blue-400 font-bold uppercase mb-2">{k}</div>
            <div className="font-mono text-slate-100 text-xs break-all">{v || '...'}</div>
          </div>
        ))}
      </div>
    </ToolShell>
  );
};

export const TimestampConverter: React.FC = () => {
  const [ts, setTs] = useState(Math.floor(Date.now() / 1000).toString());
  const date = new Date(parseInt(ts) * 1000);
  return (
    <ToolShell title="Unix Timestamp">
      <div className="mb-6">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Unix Epoch Time</label>
        <input className="w-full p-4 border-2 rounded-2xl font-mono text-2xl text-blue-600" value={ts} onChange={e => setTs(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 p-6 rounded-2xl border">
          <div className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Local Time</div>
          <div className="text-lg font-bold">{date.toString() === 'Invalid Date' ? 'Invalid' : date.toLocaleString()}</div>
        </div>
        <div className="bg-slate-50 p-6 rounded-2xl border">
          <div className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">UTC Time</div>
          <div className="text-lg font-bold">{date.toString() === 'Invalid Date' ? 'Invalid' : date.toUTCString()}</div>
        </div>
      </div>
    </ToolShell>
  );
};

export const RegexTester: React.FC = () => {
  const [regex, setRegex] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');
  
  const getMatches = (): RegExpMatchArray[] | null => {
    try {
      if (!regex) return [];
      const r = new RegExp(regex, flags);
      return Array.from(text.matchAll(r));
    } catch (e) { return null; }
  };

  const matches = getMatches();

  return (
    <ToolShell title="Regex Tester">
      <div className="flex gap-4 mb-4">
        <div className="flex-grow">
          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest">Expression</label>
          <input className="w-full p-4 border-2 rounded-2xl font-mono" placeholder="[a-z]+" value={regex} onChange={e => setRegex(e.target.value)} />
        </div>
        <div className="w-24">
          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest">Flags</label>
          <input className="w-full p-4 border-2 rounded-2xl font-mono text-center" value={flags} onChange={e => setFlags(e.target.value)} />
        </div>
      </div>
      <textarea className="w-full h-40 p-6 border-2 rounded-3xl mb-6 font-mono bg-slate-50" placeholder="Sample text..." value={text} onChange={e => setText(e.target.value)} />
      <div className="p-6 bg-slate-900 rounded-2xl">
        <div className="text-[10px] text-green-400 font-bold uppercase mb-4 tracking-widest">Matches Found: {matches === null ? 'Error' : matches.length}</div>
        <div className="space-y-2 max-h-40 overflow-auto">
          {matches && matches.map((m, i) => (
            <div key={i} className="text-slate-100 text-xs font-mono bg-slate-800 p-2 rounded">
              #{i + 1}: <span className="text-yellow-400">"{m[0]}"</span> at index {m.index}
            </div>
          ))}
          {matches === null && <div className="text-red-400 font-bold">Invalid Regular Expression</div>}
        </div>
      </div>
    </ToolShell>
  );
};

export const URLParser: React.FC = () => {
  const [url, setUrl] = useState('https://www.example.com/path?query=123#hash');
  let parsed: URL | null = null;
  try { parsed = new URL(url); } catch (e) {}

  return (
    <ToolShell title="URL Parser">
      <input className="w-full p-4 border-2 rounded-2xl font-mono mb-8 text-blue-600" value={url} onChange={e => setUrl(e.target.value)} />
      {parsed ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { l: 'Protocol', v: parsed.protocol },
            { l: 'Host', v: parsed.hostname },
            { l: 'Path', v: parsed.pathname },
            { l: 'Search', v: parsed.search },
            { l: 'Hash', v: parsed.hash },
            { l: 'Origin', v: parsed.origin },
            { l: 'Port', v: parsed.port || 'Default' },
            { l: 'Params', v: parsed.searchParams.toString() }
          ].map((item, i) => (
            <div key={i} className="bg-slate-50 p-4 rounded-xl border">
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">{item.l}</div>
              <div className="text-xs font-bold truncate text-slate-700">{item.v || '-'}</div>
            </div>
          ))}
        </div>
      ) : <div className="p-10 bg-red-50 text-red-600 rounded-3xl text-center font-bold">Invalid URL</div>}
    </ToolShell>
  );
};

export const UUIDGenerator: React.FC = () => {
  const [uuids, setUuids] = useState<string[]>([]);
  const gen = () => setUuids([crypto.randomUUID(), ...uuids].slice(0, 10));
  return (
    <ToolShell title="UUID v4 Gen">
      <button onClick={gen} className="w-full bg-blue-600 text-white px-8 py-5 rounded-2xl font-black shadow-lg shadow-blue-100 mb-6">Generate New UUID</button>
      <div className="space-y-3">
        {uuids.map((u, i) => (
          <div key={i} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-sm flex justify-between items-center group">
            <span className="text-slate-600">{u}</span>
            <button onClick={() => navigator.clipboard.writeText(u)} className="text-blue-600 p-2 hover:bg-white rounded-lg transition-colors"><i className="fas fa-copy"></i></button>
          </div>
        ))}
        {uuids.length === 0 && <p className="text-center text-slate-400 italic py-10">No UUIDs generated yet</p>}
      </div>
    </ToolShell>
  );
};

export const JWTDecoderTool: React.FC = () => {
  const [token, setToken] = useState('');
  const decode = () => {
    try {
      const parts = token.split('.');
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      return { header, payload };
    } catch(e) { return null; }
  };
  const result = decode();
  return (
    <ToolShell title="JWT Decoder">
      <textarea className="w-full h-32 p-6 border-2 border-slate-100 rounded-2xl mb-6 text-xs font-mono bg-slate-50" placeholder="Paste JWT..." value={token} onChange={e => setToken(e.target.value)} />
      {result ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 p-6 rounded-2xl overflow-auto h-80 border-t-4 border-pink-500">
            <h4 className="text-pink-400 font-bold mb-4 uppercase text-xs tracking-widest">Header</h4>
            <pre className="text-slate-100 text-[10px] leading-relaxed">{JSON.stringify(result.header, null, 2)}</pre>
          </div>
          <div className="bg-slate-900 p-6 rounded-2xl overflow-auto h-80 border-t-4 border-blue-500">
            <h4 className="text-blue-400 font-bold mb-4 uppercase text-xs tracking-widest">Payload</h4>
            <pre className="text-slate-100 text-[10px] leading-relaxed">{JSON.stringify(result.payload, null, 2)}</pre>
          </div>
        </div>
      ) : <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 font-medium">Please enter a valid JWT token to inspect</div>}
    </ToolShell>
  );
};

export const RandomPasswordTool: React.FC = () => {
  const [pass, setPass] = useState('');
  const [len, setLen] = useState(16);
  const gen = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let res = "";
    for(let i=0; i<len; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
    setPass(res);
  };
  return (
    <ToolShell title="Password Gen">
      <div className="space-y-8">
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <label className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
            Password Length <span>{len} chars</span>
          </label>
          <input type="range" min="8" max="128" value={len} onChange={e => setLen(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
        </div>
        <div className="flex gap-4">
          <input readOnly value={pass} className="flex-grow p-5 border-2 border-slate-100 rounded-2xl font-mono bg-white text-xl text-center text-blue-600 shadow-inner" placeholder="P@ssw0rd123" />
          <button onClick={gen} className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700">GENERATE</button>
        </div>
        {pass && (
          <button onClick={() => navigator.clipboard.writeText(pass)} className="w-full py-4 text-blue-600 font-bold hover:bg-blue-50 rounded-xl transition-all">Copy to Clipboard</button>
        )}
      </div>
    </ToolShell>
  );
};

export const ColorConverterTool: React.FC = () => {
  const [color, setColor] = useState('#2563EB');
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };
  return (
    <ToolShell title="Color Converter">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="w-full h-64 rounded-3xl shadow-2xl border-8 border-white" style={{ backgroundColor: color }} />
          <input type="color" className="w-full h-16 rounded-2xl cursor-pointer border-none shadow-sm" value={color} onChange={e => setColor(e.target.value)} />
        </div>
        <div className="space-y-4">
          <div className="p-6 bg-slate-50 rounded-2xl border flex justify-between items-center group">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Hex Code</div>
              <div className="font-mono text-xl font-bold">{color.toUpperCase()}</div>
            </div>
            <button onClick={() => navigator.clipboard.writeText(color.toUpperCase())} className="opacity-0 group-hover:opacity-100 text-blue-600 transition-all"><i className="fas fa-copy"></i></button>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border flex justify-between items-center group">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">RGB Values</div>
              <div className="font-mono text-xl font-bold">{hexToRgb(color)}</div>
            </div>
            <button onClick={() => navigator.clipboard.writeText(hexToRgb(color))} className="opacity-0 group-hover:opacity-100 text-blue-600 transition-all"><i className="fas fa-copy"></i></button>
          </div>
        </div>
      </div>
    </ToolShell>
  );
};

export const Base64ImageEncoder: React.FC = () => {
  const [base64, setBase64] = useState('');
  const [fileInfo, setFileInfo] = useState<any>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64(reader.result as string);
        setFileInfo({ name: file.name, type: file.type, size: (file.size / 1024).toFixed(2) + 'KB' });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <ToolShell title="Image to Base64">
      <div className="mb-8">
        <label className="flex flex-col items-center justify-center w-full h-40 border-4 border-slate-100 border-dashed rounded-[2.5rem] cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <i className="fas fa-file-image text-4xl text-slate-300 mb-4"></i>
            <p className="mb-2 text-sm text-slate-500 font-bold">Select Image File</p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleFile} />
        </label>
      </div>
      {base64 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl text-white">
            <span className="text-xs font-bold opacity-50">{fileInfo.name}</span>
            <button onClick={() => navigator.clipboard.writeText(base64)} className="bg-blue-600 px-4 py-1 rounded-lg text-xs font-bold">COPY URI</button>
          </div>
          <textarea readOnly className="w-full h-32 p-4 border-2 rounded-2xl font-mono text-[10px] bg-slate-50" value={base64} />
        </div>
      )}
    </ToolShell>
  );
};
