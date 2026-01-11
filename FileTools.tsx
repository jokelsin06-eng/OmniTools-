
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

const ToolShell: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-200 h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center">
        <i className="fas fa-file-alt text-xl"></i>
      </div>
      <h3 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h3>
    </div>
    {children}
  </div>
);

const CodeArea: React.FC<{ value: string; onChange?: (v: string) => void; placeholder?: string; readOnly?: boolean; height?: string }> = ({ value, onChange, placeholder, readOnly, height = "h-48" }) => (
  <textarea
    className={`w-full ${height} p-4 border-2 border-slate-100 rounded-2xl font-mono text-xs bg-slate-50 focus:border-violet-500 outline-none transition-all mb-4`}
    value={value}
    onChange={e => onChange?.(e.target.value)}
    placeholder={placeholder}
    readOnly={readOnly}
  />
);

// Placeholder for various file management tools dynamically assigned in registry
export const GenericFileTool: React.FC = () => {
    const title = window.location.hash.replace('#', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return (
        <ToolShell title={title}>
             <div className="flex flex-col items-center justify-center p-20 border-4 border-dashed rounded-[3rem] bg-slate-50 animate-in fade-in">
                <i className="fas fa-file-shield text-6xl text-slate-200 mb-6"></i>
                <p className="text-slate-500 font-black uppercase tracking-widest text-center">{title} Engine</p>
                <p className="text-xs text-slate-400 mt-2 font-medium text-center max-w-xs">We are currently implementing high-performance client-side processing for this file type.</p>
                <button className="mt-8 bg-violet-600 text-white px-10 py-4 rounded-2xl font-black opacity-30 cursor-not-allowed">CHOOSE FILE</button>
             </div>
        </ToolShell>
    );
};

export const JSONValidatorTool: React.FC = () => {
  const [json, setJson] = useState('');
  const [status, setStatus] = useState<{ msg: string; type: 'none' | 'valid' | 'invalid' }>({ msg: '', type: 'none' });

  const validate = () => {
    if (!json.trim()) return setStatus({ msg: 'Please enter JSON', type: 'none' });
    try {
      JSON.parse(json);
      setStatus({ msg: 'JSON is valid!', type: 'valid' });
    } catch (e: any) {
      setStatus({ msg: `Invalid JSON: ${e.message}`, type: 'invalid' });
    }
  };

  return (
    <ToolShell title="JSON Validator">
      <CodeArea value={json} onChange={setJson} placeholder='{"name": "OmniTool"}' />
      <button onClick={validate} className="bg-violet-600 text-white px-8 py-3 rounded-xl font-bold w-full shadow-lg">Validate JSON</button>
      {status.type !== 'none' && (
        <div className={`mt-4 p-4 rounded-xl font-bold ${status.type === 'valid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          <i className={`fas ${status.type === 'valid' ? 'fa-check-circle' : 'fa-times-circle'} mr-2`}></i>
          {status.msg}
        </div>
      )}
    </ToolShell>
  );
};

export const XMLFormatterTool: React.FC = () => {
  const [xml, setXml] = useState('');
  const format = () => {
    let formatted = '';
    let pad = 0;
    xml.replace(/>\s*</g, '><').split(/>\s*</).forEach(node => {
      if (node.match(/^\/\w/)) pad--;
      formatted += '  '.repeat(Math.max(0, pad)) + '<' + node + '>\r\n';
      if (node.match(/^<?\w[^>]*[^\/]$/) && !node.match(/^input|img|br|hr|meta|link/)) pad++;
    });
    setXml(formatted.trim().replace(/^<|>$/g, ''));
  };
  return (
    <ToolShell title="XML Formatter">
      <CodeArea value={xml} onChange={setXml} placeholder="<note><to>User</to></note>" />
      <button onClick={format} className="bg-violet-600 text-white px-8 py-3 rounded-xl font-bold w-full">Prettify XML</button>
    </ToolShell>
  );
};

export const VCardGeneratorTool: React.FC = () => {
  const [v, setV] = useState({ fn: '', ln: '', org: '', email: '', tel: '' });
  const card = `BEGIN:VCARD
VERSION:3.0
FN:${v.fn} ${v.ln}
ORG:${v.org}
TEL;TYPE=CELL:${v.tel}
EMAIL:${v.email}
END:VCARD`;

  const download = () => {
    const blob = new Blob([card], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${v.fn || 'contact'}.vcf`;
    link.click();
  };

  return (
    <ToolShell title="VCard Generator">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input className="p-3 border rounded-xl" placeholder="First Name" value={v.fn} onChange={e => setV({...v, fn: e.target.value})} />
        <input className="p-3 border rounded-xl" placeholder="Last Name" value={v.ln} onChange={e => setV({...v, ln: e.target.value})} />
      </div>
      <input className="w-full p-3 border rounded-xl mb-4" placeholder="Organization" value={v.org} onChange={e => setV({...v, org: e.target.value})} />
      <input className="w-full p-3 border rounded-xl mb-4" placeholder="Email" value={v.email} onChange={e => setV({...v, email: e.target.value})} />
      <input className="w-full p-3 border rounded-xl mb-6" placeholder="Phone Number" value={v.tel} onChange={e => setV({...v, tel: e.target.value})} />
      <button onClick={download} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold w-full">Download .vcf Card</button>
    </ToolShell>
  );
};

export const ICSGeneratorTool: React.FC = () => {
  const [e, setE] = useState({ title: '', start: '', location: '', desc: '' });
  const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${e.title}
DTSTART:${e.start.replace(/[-:]/g, '')}
LOCATION:${e.location}
DESCRIPTION:${e.desc}
END:VEVENT
END:VCALENDAR`;

  const download = () => {
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${e.title || 'event'}.ics`;
    link.click();
  };

  return (
    <ToolShell title="ICS Event Gen">
      <input className="w-full p-3 border rounded-xl mb-4" placeholder="Event Title" value={e.title} onChange={v => setE({...e, title: v.target.value})} />
      <input className="w-full p-3 border rounded-xl mb-4" type="datetime-local" value={e.start} onChange={v => setE({...e, start: v.target.value})} />
      <input className="w-full p-3 border rounded-xl mb-4" placeholder="Location" value={e.location} onChange={v => setE({...e, location: v.target.value})} />
      <textarea className="w-full h-24 p-3 border rounded-xl mb-6" placeholder="Description" value={e.desc} onChange={v => setE({...e, desc: v.target.value})} />
      <button onClick={download} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold w-full">Download Calendar File</button>
    </ToolShell>
  );
};

export const AIDataGeneratorTool: React.FC = () => {
  const [prompt, setPrompt] = useState('10 users with name, age, and email in CSV format');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const resp = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate mock data for the following description. Return ONLY the data content, no markdown or text surrounding it: ${prompt}`
      });
      setResult(resp.text || '');
    } catch (err) { alert('Generation failed'); }
    finally { setLoading(false); }
  };

  return (
    <ToolShell title="AI Data Generator">
      <div className="mb-4">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Describe what you need</label>
        <textarea className="w-full h-24 p-4 border rounded-2xl bg-slate-50 font-bold" value={prompt} onChange={e => setPrompt(e.target.value)} />
      </div>
      <button onClick={generate} disabled={loading} className="w-full bg-violet-600 text-white py-4 rounded-xl font-black shadow-lg shadow-violet-100 mb-6">
        {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-magic mr-2"></i>}
        {loading ? 'Generating...' : 'Generate Mock File Content'}
      </button>
      {result && <CodeArea value={result} readOnly height="h-64" />}
    </ToolShell>
  );
};

export const TextDiffTool: React.FC = () => {
  const [t1, setT1] = useState('');
  const [t2, setT2] = useState('');
  const [diff, setDiff] = useState<string[]>([]);

  const compare = () => {
    const l1 = t1.split('\n');
    const l2 = t2.split('\n');
    const result: string[] = [];
    const max = Math.max(l1.length, l2.length);
    for (let i = 0; i < max; i++) {
      if (l1[i] !== l2[i]) result.push(`Line ${i + 1}: Mismatch`);
    }
    setDiff(result.length ? result : ['No differences found!']);
  };

  return (
    <ToolShell title="Text Diff Inspector">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <textarea className="h-48 p-3 border rounded-xl text-xs font-mono" placeholder="Original text..." value={t1} onChange={e => setT1(e.target.value)} />
        <textarea className="h-48 p-3 border rounded-xl text-xs font-mono" placeholder="Modified text..." value={t2} onChange={e => setT2(e.target.value)} />
      </div>
      <button onClick={compare} className="bg-slate-900 text-white py-3 rounded-xl font-bold w-full mb-6">Find Differences</button>
      <div className="p-4 bg-slate-50 border rounded-xl font-mono text-xs max-h-40 overflow-auto">
        {diff.map((d, i) => <div key={i} className={d.includes('Mismatch') ? 'text-red-600' : 'text-green-600'}>{d}</div>)}
      </div>
    </ToolShell>
  );
};

export const MarkdownTableGeneratorTool: React.FC = () => {
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(3);
  
  const generate = () => {
    let md = '| ' + new Array(cols).fill('Header').join(' | ') + ' |\n';
    md += '| ' + new Array(cols).fill('---').join(' | ') + ' |\n';
    for (let i = 0; i < rows; i++) {
      md += '| ' + new Array(cols).fill('Cell').join(' | ') + ' |\n';
    }
    return md;
  };

  return (
    <ToolShell title="Markdown Table Gen">
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Columns</label>
          <input type="number" className="w-full p-3 border rounded-xl" value={cols} onChange={e => setCols(parseInt(e.target.value))} />
        </div>
        <div className="flex-1">
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Rows</label>
          <input type="number" className="w-full p-3 border rounded-xl" value={rows} onChange={e => setRows(parseInt(e.target.value))} />
        </div>
      </div>
      <CodeArea value={generate()} readOnly height="h-64" />
      <button onClick={() => navigator.clipboard.writeText(generate())} className="bg-violet-600 text-white py-3 rounded-xl font-bold w-full">Copy Markdown</button>
    </ToolShell>
  );
};

export const FileInfoInspectorTool: React.FC = () => {
  const [info, setInfo] = useState<any>(null);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInfo({
        Name: file.name,
        Size: (file.size / 1024).toFixed(2) + ' KB',
        Type: file.type || 'unknown',
        LastModified: new Date(file.lastModified).toLocaleString()
      });
    }
  };

  return (
    <ToolShell title="File Metadata Inspector">
      <label className="block w-full h-32 border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:bg-slate-50 transition-all flex flex-col items-center justify-center mb-6">
        <i className="fas fa-search-plus text-slate-300 text-3xl mb-2"></i>
        <span className="text-slate-400 font-bold uppercase text-[10px]">Select local file to inspect</span>
        <input type="file" className="hidden" onChange={handleFile} />
      </label>
      {info && (
        <div className="bg-slate-900 text-slate-100 p-8 rounded-3xl">
          {Object.entries(info).map(([k, v]) => (
            <div key={k} className="flex justify-between py-3 border-b border-slate-800 last:border-0">
              <span className="text-violet-400 font-black uppercase text-[10px] tracking-widest">{k}</span>
              <span className="font-mono text-sm">{String(v)}</span>
            </div>
          ))}
        </div>
      )}
    </ToolShell>
  );
};

export const JSONToYAMLTool: React.FC = () => {
  const [json, setJson] = useState('{"key": "value"}');
  const [yaml, setYaml] = useState('');
  
  const convert = () => {
    try {
      const obj = JSON.parse(json);
      // Basic simulation of YAML conversion
      let res = '';
      const stringify = (o: any, indent = '') => {
        for (let k in o) {
          if (typeof o[k] === 'object') {
            res += `${indent}${k}:\n`;
            stringify(o[k], indent + '  ');
          } else {
            res += `${indent}${k}: ${o[k]}\n`;
          }
        }
      };
      stringify(obj);
      setYaml(res);
    } catch { alert('Invalid JSON'); }
  };

  return (
    <ToolShell title="JSON to YAML">
      <CodeArea value={json} onChange={setJson} />
      <button onClick={convert} className="bg-violet-600 text-white py-3 rounded-xl font-bold w-full mb-4">Convert to YAML</button>
      {yaml && <CodeArea value={yaml} readOnly height="h-48" />}
    </ToolShell>
  );
};

export const YAMLToJSONTool: React.FC = () => {
  const [yaml, setYaml] = useState('key: value\nfoo:\n  bar: 123');
  const [json, setJson] = useState('');

  const convert = async () => {
    // Relying on AI for complex YAML parsing without weight
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const resp = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Convert this YAML to JSON. Return ONLY valid JSON: ${yaml}`
      });
      setJson(resp.text || '');
    } catch { alert('Error in conversion'); }
  };

  return (
    <ToolShell title="YAML to JSON">
      <CodeArea value={yaml} onChange={setYaml} />
      <button onClick={convert} className="bg-violet-600 text-white py-3 rounded-xl font-bold w-full mb-4">Convert to JSON</button>
      {json && <CodeArea value={json} readOnly height="h-48" />}
    </ToolShell>
  );
};

export const CSVToJSONTool: React.FC = () => {
  const [csv, setCsv] = useState('');
  const [json, setJson] = useState('');

  const convert = () => {
    try {
      const lines = csv.split('\n');
      const headers = lines[0].split(',');
      const result = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i]) continue;
        const obj: any = {};
        const currentline = lines[i].split(',');

        for (let j = 0; j < headers.length; j++) {
          obj[headers[j].trim()] = currentline[j]?.trim();
        }
        result.push(obj);
      }
      setJson(JSON.stringify(result, null, 2));
    } catch (e) {
      alert("Check your CSV format!");
    }
  };

  return (
    <ToolShell title="CSV to JSON Converter">
      <div className="space-y-4">
        <textarea
          className="w-full h-32 p-3 border rounded-lg font-mono text-sm"
          placeholder="id,name,email\n1,John Doe,john@example.com"
          value={csv}
          onChange={e => setCsv(e.target.value)}
        />
        <button onClick={convert} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold w-full">Convert to JSON</button>
        {json && (
          <textarea
            className="w-full h-48 p-3 border rounded-lg font-mono text-sm bg-slate-900 text-slate-100"
            value={json}
            readOnly
          />
        )}
      </div>
    </ToolShell>
  );
};

export const MarkdownToHTMLTool: React.FC = () => {
  const [md, setMd] = useState('');
  const convert = (text: string) => {
    return text
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
      .replace(/\*(.*)\*/gim, '<i>$1</i>')
      .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/\n/gim, '<br />');
  };
  const html = convert(md);
  return (
    <ToolShell title="Markdown to HTML">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea className="w-full h-64 p-3 border rounded-xl font-mono text-sm" placeholder="# Hello World" value={md} onChange={e => setMd(e.target.value)} />
        <div className="w-full h-64 p-3 border rounded-xl overflow-auto bg-slate-50 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      <button onClick={() => navigator.clipboard.writeText(html)} className="mt-4 bg-slate-900 text-white px-6 py-2 rounded-lg font-bold w-full">Copy HTML Code</button>
    </ToolShell>
  );
};
