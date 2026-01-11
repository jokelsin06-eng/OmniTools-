
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const ToolShell: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-200 h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
        <i className="fas fa-search-location text-xl"></i>
      </div>
      <h3 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h3>
    </div>
    {children}
  </div>
);

const CodeBlock: React.FC<{ code: string; label: string }> = ({ code, label }) => (
  <div className="mt-6">
    <div className="flex justify-between items-center mb-2">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <button 
        onClick={() => {
            navigator.clipboard.writeText(code);
            alert("Copied to clipboard!");
        }}
        className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
      >
        <i className="fas fa-copy mr-1"></i> Copy Code
      </button>
    </div>
    <pre className="bg-slate-900 text-slate-100 p-6 rounded-2xl font-mono text-xs overflow-x-auto shadow-inner leading-relaxed">
      {code}
    </pre>
  </div>
);

// Placeholder for various web tools dynamically assigned in registry
export const GenericWebTool: React.FC = () => {
    const title = window.location.hash.replace('#', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return (
        <ToolShell title={title}>
             <div className="p-10 bg-orange-50 rounded-[3rem] border-2 border-orange-100 text-center animate-in zoom-in">
                <i className="fas fa-globe text-4xl text-orange-200 mb-6"></i>
                <p className="text-orange-900 font-black uppercase tracking-tight text-lg leading-tight">Professional {title}</p>
                <p className="text-sm text-orange-600 mt-2 font-bold">This utility is being synchronized with our real-time SEO indexing engine.</p>
                <p className="text-xs text-orange-400 mt-4 italic">Advanced web audit nodes are currently being provisioned for your region.</p>
             </div>
        </ToolShell>
    );
};

export const MetaTagGenerator: React.FC = () => {
  const [data, setData] = useState({ title: '', desc: '', keys: '', author: '', robots: 'index, follow' });
  
  const code = `<!-- Primary Meta Tags -->
<title>${data.title}</title>
<meta name="title" content="${data.title}">
<meta name="description" content="${data.desc}">
<meta name="keywords" content="${data.keys}">
<meta name="author" content="${data.author}">
<meta name="robots" content="${data.robots}">`;

  return (
    <ToolShell title="Meta Tag Generator">
      <div className="space-y-4">
        <input className="w-full p-4 border rounded-xl bg-slate-50 font-bold" placeholder="Site Title" value={data.title} onChange={e => setData({...data, title: e.target.value})} />
        <textarea className="w-full h-24 p-4 border rounded-xl bg-slate-50" placeholder="Site Description (Max 160 chars)" value={data.desc} onChange={e => setData({...data, desc: e.target.value})} />
        <input className="w-full p-4 border rounded-xl bg-slate-50" placeholder="Keywords (comma separated)" value={data.keys} onChange={e => setData({...data, keys: e.target.value})} />
        <CodeBlock code={code} label="HTML Meta Tags" />
      </div>
    </ToolShell>
  );
};

export const OpenGraphGenerator: React.FC = () => {
    const [data, setData] = useState({ title: '', url: '', type: 'website', img: '', desc: '' });
    const code = `<!-- Open Graph / Facebook -->
<meta property="og:type" content="${data.type}">
<meta property="og:url" content="${data.url}">
<meta property="og:title" content="${data.title}">
<meta property="og:description" content="${data.desc}">
<meta property="og:image" content="${data.img}">`;

    return (
      <ToolShell title="Open Graph Generator">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input className="p-4 border rounded-xl bg-slate-50 font-bold" placeholder="Page Title" value={data.title} onChange={e => setData({...data, title: e.target.value})} />
            <input className="p-4 border rounded-xl bg-slate-50" placeholder="Page URL" value={data.url} onChange={e => setData({...data, url: e.target.value})} />
          </div>
          <input className="w-full p-4 border rounded-xl bg-slate-50" placeholder="Image URL" value={data.img} onChange={e => setData({...data, img: e.target.value})} />
          <textarea className="w-full h-24 p-4 border rounded-xl bg-slate-50" placeholder="Short Description" value={data.desc} onChange={e => setData({...data, desc: e.target.value})} />
          <CodeBlock code={code} label="OG Metadata" />
        </div>
      </ToolShell>
    );
};

export const TwitterCardGenerator: React.FC = () => {
    const [data, setData] = useState({ title: '', user: '@username', img: '', desc: '' });
    const code = `<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://example.com/">
<meta property="twitter:title" content="${data.title}">
<meta property="twitter:description" content="${data.desc}">
<meta property="twitter:image" content="${data.img}">
<meta property="twitter:site" content="${data.user}">`;

    return (
      <ToolShell title="Twitter Card Generator">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input className="p-4 border rounded-xl bg-slate-50 font-bold" placeholder="Twitter Handle" value={data.user} onChange={e => setData({...data, user: e.target.value})} />
            <input className="p-4 border rounded-xl bg-slate-50 font-bold" placeholder="Card Title" value={data.title} onChange={e => setData({...data, title: e.target.value})} />
          </div>
          <input className="w-full p-4 border rounded-xl bg-slate-50" placeholder="Large Image URL" value={data.img} onChange={e => setData({...data, img: e.target.value})} />
          <textarea className="w-full h-24 p-4 border rounded-xl bg-slate-50" placeholder="Description" value={data.desc} onChange={e => setData({...data, desc: e.target.value})} />
          <CodeBlock code={code} label="Twitter Meta Tags" />
        </div>
      </ToolShell>
    );
};

export const RobotsTxtGenerator: React.FC = () => {
    const [allow, setAllow] = useState(true);
    const [sitemap, setSitemap] = useState('');
    const code = `User-agent: *
${allow ? 'Allow' : 'Disallow'}: /
${sitemap ? `Sitemap: ${sitemap}` : ''}`;

    return (
      <ToolShell title="Robots.txt Generator">
        <div className="space-y-6">
          <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-2xl border">
            <span className="font-bold text-slate-700">Crawler Visibility:</span>
            <button onClick={() => setAllow(true)} className={`px-6 py-2 rounded-xl font-bold ${allow ? 'bg-green-600 text-white' : 'bg-white text-slate-400'}`}>Allow All</button>
            <button onClick={() => setAllow(false)} className={`px-6 py-2 rounded-xl font-bold ${!allow ? 'bg-red-600 text-white' : 'bg-white text-slate-400'}`}>Block All</button>
          </div>
          <input className="w-full p-4 border rounded-xl bg-slate-50" placeholder="Full Sitemap URL (Optional)" value={sitemap} onChange={e => setSitemap(e.target.value)} />
          <CodeBlock code={code} label="robots.txt Output" />
        </div>
      </ToolShell>
    );
};

export const SitemapGenerator: React.FC = () => {
  const [urls, setUrls] = useState('');
  const generate = () => {
    const list = urls.split('\n').filter(u => u.trim());
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${list.map(u => `  <url>
    <loc>${u.trim()}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;
    return xml;
  };

  return (
    <ToolShell title="Sitemap Generator">
      <div className="space-y-4">
        <textarea 
            className="w-full h-32 p-4 border rounded-xl bg-slate-50 font-mono text-sm" 
            placeholder="https://example.com/page1&#10;https://example.com/page2" 
            value={urls} 
            onChange={e => setUrls(e.target.value)} 
        />
        <CodeBlock code={generate()} label="sitemap.xml Output" />
      </div>
    </ToolShell>
  );
};

export const SchemaGenerator: React.FC = () => {
  const [type, setType] = useState('Article');
  const [data, setData] = useState({ name: '', author: '', date: new Date().toISOString().split('T')[0] });
  
  const code = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "${type}",
  "headline": "${data.name}",
  "author": {
    "@type": "Person",
    "name": "${data.author}"
  },
  "datePublished": "${data.date}"
}
</script>`;

  return (
    <ToolShell title="Schema (JSON-LD) Gen">
      <div className="space-y-4">
        <select className="w-full p-4 border rounded-xl bg-slate-50 font-bold" value={type} onChange={e => setType(e.target.value)}>
           <option>Article</option>
           <option>Recipe</option>
           <option>Review</option>
           <option>Product</option>
        </select>
        <div className="grid grid-cols-2 gap-4">
            <input className="p-4 border rounded-xl bg-slate-50" placeholder="Headline / Name" value={data.name} onChange={e => setData({...data, name: e.target.value})} />
            <input className="p-4 border rounded-xl bg-slate-50" placeholder="Author Name" value={data.author} onChange={e => setData({...data, author: e.target.value})} />
        </div>
        <CodeBlock code={code} label="JSON-LD Code" />
      </div>
    </ToolShell>
  );
};

export const KeywordDensityChecker: React.FC = () => {
  const [text, setText] = useState('');
  const words = text.toLowerCase().match(/\b(\w+)\b/g) || [];
  const freq: Record<string, number> = {};
  words.forEach(w => { if(w.length > 3) freq[w] = (freq[w] || 0) + 1; });
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10);

  return (
    <ToolShell title="Keyword Density Checker">
      <textarea className="w-full h-40 p-4 border rounded-xl bg-slate-50 mb-6" placeholder="Paste your article content..." value={text} onChange={e => setText(e.target.value)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sorted.map(([word, count]) => (
          <div key={word} className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex justify-between items-center">
            <span className="font-bold text-slate-700 uppercase text-xs tracking-widest">{word}</span>
            <div className="flex items-center gap-4">
                <span className="text-orange-600 font-black">{((count / words.length) * 100).toFixed(1)}%</span>
                <span className="text-[10px] text-slate-400 font-bold">{count} matches</span>
            </div>
          </div>
        ))}
      </div>
    </ToolShell>
  );
};

export const HtaccessGenerator: React.FC = () => {
    const [from, setFrom] = useState('/old-page');
    const [to, setTo] = useState('https://example.com/new-page');
    const code = `Redirect 301 ${from} ${to}`;
    return (
        <ToolShell title=".htaccess Redirect Gen">
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <input className="p-4 border rounded-xl bg-slate-50 font-mono text-sm" placeholder="/old-path" value={from} onChange={e => setFrom(e.target.value)} />
                    <input className="p-4 border rounded-xl bg-slate-50 font-mono text-sm" placeholder="https://..." value={to} onChange={e => setTo(e.target.value)} />
                </div>
                <CodeBlock code={code} label=".htaccess Directive" />
            </div>
        </ToolShell>
    );
};

const useAISearch = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const runAudit = async (prompt: string) => {
        if (!prompt) return;
        setLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt
            });
            setResult(response.text || '');
        } catch (e) { setResult('Audit failed.'); }
        finally { setLoading(false); }
    };
    return { loading, result, runAudit };
};

export const AISEOAudiTool: React.FC = () => {
    const { loading, result, runAudit } = useAISearch();
    const [input, setInput] = useState('');
    return (
        <ToolShell title="AI SEO Audit">
            <textarea className="w-full h-40 p-4 border rounded-2xl bg-slate-50 mb-4" placeholder="Describe your website or paste a snippet of your content..." value={input} onChange={e => setInput(e.target.value)} />
            <button 
                onClick={() => runAudit(`Analyze this website/content for SEO improvements. Identify missing keywords, technical issues, and suggest 5 improvements in a professional tone: ${input}`)} 
                disabled={loading}
                className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-orange-100 disabled:opacity-50"
            >
                {loading ? 'Analyzing...' : 'Run Comprehensive Audit'}
            </button>
            {result && (
                <div className="mt-8 p-8 bg-slate-900 text-slate-100 rounded-[2.5rem] text-sm leading-relaxed border-t-4 border-orange-500 whitespace-pre-wrap">
                    {result}
                </div>
            )}
        </ToolShell>
    );
};

export const PerformanceAdvisorAI: React.FC = () => {
    const { loading, result, runAudit } = useAISearch();
    const [input, setInput] = useState('');
    return (
        <ToolShell title="Speed Advisor (AI)">
            <textarea className="w-full h-32 p-4 border rounded-2xl bg-slate-50 mb-4" placeholder="Paste your tech stack (e.g. Next.js, React) or your website URL..." value={input} onChange={e => setInput(e.target.value)} />
            <button 
                onClick={() => runAudit(`Give 5 specific technical performance optimization tips (LCP, FID, CLS) for a site using: ${input}. Be extremely specific.`)} 
                disabled={loading}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-lg disabled:opacity-50"
            >
                {loading ? 'Consulting Experts...' : 'Get Performance Plan'}
            </button>
            {result && (
                <div className="mt-8 p-8 bg-blue-50 border border-blue-100 text-blue-900 rounded-[2.5rem] text-sm leading-relaxed whitespace-pre-wrap">
                    {result}
                </div>
            )}
        </ToolShell>
    );
};
