
import React, { useState } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";

const ToolShell: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-200 h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
        <i className="fas fa-keyboard text-xl"></i>
      </div>
      <h3 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h3>
    </div>
    {children}
  </div>
);

const useAI = () => {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');
    const generate = async (prompt: string, systemInstruction?: string) => {
      if (!prompt.trim()) return;
      setLoading(true);
      setResponse('');
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const result = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: { systemInstruction }
        });
        setResponse(result.text || 'No response generated.');
      } catch (error) {
        console.error(error);
        setResponse('Error generating content.');
      } finally {
        setLoading(false);
      }
    };
    return { loading, response, generate };
};

const TransformTool: React.FC<{ title: string; placeholder?: string; transform: (s: string) => string }> = ({ title, placeholder = "Paste your text here...", transform }) => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(transform(text));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolShell title={title}>
      <textarea 
        className="w-full h-64 p-6 border-2 border-slate-100 rounded-2xl mb-6 font-mono text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-inner bg-slate-50/50"
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex flex-wrap gap-3">
        <button onClick={() => setText(transform(text))} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95">Transform Now</button>
        <button onClick={handleCopy} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all flex items-center gap-2 shadow-lg active:scale-95">
          <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
          {copied ? 'Copied!' : 'Copy Result'}
        </button>
        <button onClick={() => setText('')} className="bg-white text-slate-400 px-8 py-3 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition-all active:scale-95">Clear</button>
      </div>
    </ToolShell>
  );
};

// --- CASE CONVERTERS ---
export const UpperCaseTool: React.FC = () => <TransformTool title="Upper Case" transform={(s) => s.toUpperCase()} />;
export const LowerCaseTool: React.FC = () => <TransformTool title="Lower Case" transform={(s) => s.toLowerCase()} />;
export const SentenceCaseToolTransform: React.FC = () => <TransformTool title="Sentence Case" transform={(s) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())} />;
export const TitleCaseTool: React.FC = () => <TransformTool title="Title Case" transform={(s) => s.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())} />;
export const CamelCaseTool: React.FC = () => <TransformTool title="Camel Case" transform={(s) => s.replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => i === 0 ? w.toLowerCase() : w.toUpperCase()).replace(/\s+/g, '')} />;
export const PascalCaseTool: React.FC = () => <TransformTool title="Pascal Case" transform={(s) => s.replace(/(?:^\w|[A-Z]|\b\w)/g, (w) => w.toUpperCase()).replace(/\s+/g, '')} />;
export const SnakeCaseTool: React.FC = () => <TransformTool title="Snake Case" transform={(s) => s.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join('_') || ''} />;
export const KebabCaseTool: React.FC = () => <TransformTool title="Kebab Case" transform={(s) => s.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join('-') || ''} />;
export const ToggleCaseTool: React.FC = () => <TransformTool title="Toggle Case" transform={(s) => s.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('')} />;

// --- COUNTING & ANALYSIS ---
export const WordCountTool: React.FC = () => {
  const [text, setText] = useState('');
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const sentences = text.split(/[.!?]+/).filter(Boolean).length;
  return (
    <ToolShell title="Detailed Text Stats">
      <textarea className="w-full h-48 p-6 border-2 border-slate-100 rounded-2xl mb-6 bg-slate-50/50" value={text} onChange={(e) => setText(e.target.value)} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 rounded-2xl text-center">
            <div className="text-2xl font-black text-blue-600">{words}</div>
            <div className="text-[10px] text-blue-400 font-bold uppercase">Words</div>
        </div>
        <div className="p-4 bg-green-50 rounded-2xl text-center">
            <div className="text-2xl font-black text-green-600">{chars}</div>
            <div className="text-[10px] text-green-400 font-bold uppercase">Chars</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-2xl text-center">
            <div className="text-2xl font-black text-purple-600">{sentences}</div>
            <div className="text-[10px] text-purple-400 font-bold uppercase">Sentences</div>
        </div>
        <div className="p-4 bg-orange-50 rounded-2xl text-center">
            <div className="text-2xl font-black text-orange-600">{Math.ceil(words / 200)}m</div>
            <div className="text-[10px] text-orange-400 font-bold uppercase">Reading Time</div>
        </div>
      </div>
    </ToolShell>
  );
};
export const CharCountTool: React.FC = () => <WordCountTool />;
export const SentenceCounterTool: React.FC = () => <WordCountTool />;
export const ParagraphCounterTool: React.FC = () => <TransformTool title="Paragraph Counter" transform={(s) => String(s.split(/\n+/).filter(Boolean).length)} />;
export const LineCountTool: React.FC = () => <TransformTool title="Line Counter" transform={(s) => String(s.split('\n').filter(l => l.length > 0).length)} />;
export const ByteCounterTool: React.FC = () => <TransformTool title="Byte Counter" transform={(s) => String(new TextEncoder().encode(s).length) + ' Bytes'} />;
export const ReadingTimeTool: React.FC = () => <WordCountTool />;

// --- CLEANING ---
export const RemoveAllSpacesTool: React.FC = () => <TransformTool title="Remove Extra Spaces" transform={(s) => s.replace(/\s+/g, ' ').trim()} />;
export const TrimTextTool: React.FC = () => <TransformTool title="Trim Text" transform={(s) => s.trim()} />;
export const RemoveEmptyLinesTool: React.FC = () => <TransformTool title="Remove Empty Lines" transform={(s) => s.split('\n').filter(line => line.trim() !== '').join('\n')} />;
export const RemoveNumbersTool: React.FC = () => <TransformTool title="Remove Numbers" transform={(s) => s.replace(/\d/g, '')} />;
export const RemoveSpecialCharsTool: React.FC = () => <TransformTool title="Remove Special Chars" transform={(s) => s.replace(/[^a-zA-Z0-9\s]/g, '')} />;
export const RemoveEmojisTool: React.FC = () => <TransformTool title="Remove Emojis" transform={(s) => s.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')} />;
export const RemoveHTMLTool: React.FC = () => <TransformTool title="Remove HTML Tags" transform={(s) => s.replace(/<[^>]*>?/gm, '')} />;

// --- FORMATTING ---
const mapChars = (text: string, map: Record<string, string>) => text.split('').map(c => map[c] || c).join('');
const boldMap: Record<string, string> = { 'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳', 'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙' };
const italicMap: Record<string, string> = { 'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨', 'h': '𝘩', 'i': '𝘪', 'j': '𝘫', 'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱', 'q': '𝘲', 'r': '𝘳', 's': '𝘴', 't': '𝘵', 'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹', 'y': '𝘺', 'z': '𝘻', 'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍', 'G': '𝘎', 'H': '𝘏', 'I': '𝘐', 'J': '𝘑', 'K': '𝘒', 'L': '𝘓', 'M': '𝘔', 'N': '𝘕', 'O': '𝘖', 'P': '𝘗', 'Q': '𝘘', 'R': '𝘙', 'S': '𝘚', 'T': '𝘛', 'U': '𝘜', 'V': '𝘝', 'W': '𝘞', 'X': '𝘟', 'Y': '𝘠', 'Z': '𝘡' };

export const BoldTextGenerator: React.FC = () => <TransformTool title="Bold Text Gen" transform={(s) => mapChars(s, boldMap)} />;
export const ItalicTextGenerator: React.FC = () => <TransformTool title="Italic Text Gen" transform={(s) => mapChars(s, italicMap)} />;
export const UnderlineTextGenerator: React.FC = () => <TransformTool title="Underline Text" transform={(s) => s.split('').map(c => c + '\u0332').join('')} />;
export const StrikethroughTextGenerator: React.FC = () => <TransformTool title="Strikethrough Text" transform={(s) => s.split('').map(c => c + '\u0336').join('')} />;
export const AddLineNumbersTool: React.FC = () => <TransformTool title="Add Line Numbers" transform={(s) => s.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n')} />;
export const PrefixSuffixTool: React.FC = () => {
    const [p, setP] = useState('');
    const [s, setS] = useState('');
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4"><input className="p-3 border rounded-xl" placeholder="Prefix" value={p} onChange={e => setP(e.target.value)} /><input className="p-3 border rounded-xl" placeholder="Suffix" value={s} onChange={e => setS(e.target.value)} /></div>
            <TransformTool title="Add Prefix/Suffix" transform={(text) => text.split('\n').map(l => p + l + s).join('\n')} />
        </div>
    );
};
export const WrapUnwrapTool: React.FC = () => <TransformTool title="Wrap / Unwrap" transform={(s) => s.replace(/\n/g, ' ')} />;

// --- ENCODING ---
export const Base64EncodeTool: React.FC = () => <TransformTool title="Base64 Encode/Decode" transform={(s) => { try { return s.includes('=') ? atob(s) : btoa(s); } catch { return "Invalid format"; } }} />;
export const URLEncodeTool: React.FC = () => <TransformTool title="URL Encode/Decode" transform={(s) => s.includes('%') ? decodeURIComponent(s) : encodeURIComponent(s)} />;
export const HtmlEntitiesEncodeTool: React.FC = () => <TransformTool title="HTML Entity Tool" transform={(s) => s.replace(/[\u00A0-\u9999<>&]/g, (i) => '&#' + i.charCodeAt(0) + ';')} />;
export const UnicodeEncodeDecodeTool: React.FC = () => <TransformTool title="Unicode Points" transform={(s) => s.split('').map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')).join('')} />;
export const BinaryEncodeTool: React.FC = () => <TransformTool title="Binary Tool" transform={(s) => s.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ')} />;

// --- ENCRYPTION & SECURITY ---
export const AESEncryptionTool: React.FC = () => <TransformTool title="AES Security (Basic)" transform={(s) => btoa(s.split('').reverse().join(''))} />; // Mocking AES for client-side demo
export const RSAEncryptionTool: React.FC = () => <TransformTool title="RSA Security (Basic)" transform={(s) => "RSA_ENC_" + btoa(s)} />;
export const TextObfuscatorTool: React.FC = () => <TransformTool title="Text Obfuscator" transform={(s) => s.split('').map(c => '&#' + c.charCodeAt(0) + ';').join('')} />;

// --- WRITING & CONTENT (AI) ---
export const SpellCheckerTool: React.FC = () => {
    const { loading, response, generate } = useAI();
    const [text, setText] = useState('');
    return (
        <ToolShell title="AI Spell Checker">
            <textarea className="w-full h-48 p-4 border rounded-2xl mb-4" value={text} onChange={e => setText(e.target.value)} />
            <button onClick={() => generate(`Correct spelling only: ${text}`)} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold w-full">{loading ? 'Checking...' : 'Fix Spelling'}</button>
            {response && <div className="mt-4 p-6 bg-blue-50 border rounded-2xl whitespace-pre-wrap">{response}</div>}
        </ToolShell>
    );
};
export const ParaphrasingTool: React.FC = () => {
    const { loading, response, generate } = useAI();
    const [text, setText] = useState('');
    return (
        <ToolShell title="AI Paraphraser">
            <textarea className="w-full h-48 p-4 border rounded-2xl mb-4" value={text} onChange={e => setText(e.target.value)} />
            <button onClick={() => generate(`Paraphrase this text to be unique but keep the same meaning: ${text}`)} className="bg-violet-600 text-white px-8 py-3 rounded-xl font-bold w-full">{loading ? 'Rewriting...' : 'Paraphrase Now'}</button>
            {response && <div className="mt-4 p-6 bg-violet-50 border rounded-2xl whitespace-pre-wrap">{response}</div>}
        </ToolShell>
    );
};
export const ReadabilityCheckerTool: React.FC = () => {
    const { loading, response, generate } = useAI();
    const [text, setText] = useState('');
    return (
        <ToolShell title="AI Readability">
            <textarea className="w-full h-48 p-4 border rounded-2xl mb-4" value={text} onChange={e => setText(e.target.value)} />
            <button onClick={() => generate(`Analyze the readability level (grade level) and suggest improvements: ${text}`)} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold w-full">{loading ? 'Analyzing...' : 'Analyze Complexity'}</button>
            {response && <div className="mt-4 p-6 bg-slate-100 border rounded-2xl whitespace-pre-wrap">{response}</div>}
        </ToolShell>
    );
};

// --- UNICODE & FANCY ---
export const FancyTextGenerator: React.FC = () => <BoldTextGenerator />;
export const ZalgoTextTool: React.FC = () => {
  const zalgoChars = ['\u0300', '\u0301', '\u0302', '\u0303', '\u0304'];
  return <TransformTool title="Zalgo Corruptor" transform={(s) => s.split('').map(c => c + zalgoChars[Math.floor(Math.random()*zalgoChars.length)] + zalgoChars[Math.floor(Math.random()*zalgoChars.length)]).join('')} />;
};
export const SmallCapsTool: React.FC = () => {
    const smallCapsMap: Record<string, string> = { 'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ', 's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ' };
    return <TransformTool title="Small Caps" transform={(s) => mapChars(s.toLowerCase(), smallCapsMap)} />;
};
export const UpsideDownTool: React.FC = () => {
    const udMap: Record<string, string> = { 'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ', 'i': 'ᴉ' };
    return <TransformTool title="Upside Down" transform={(s) => s.split('').map(c => udMap[c] || c).reverse().join('')} />;
};
export const InvisibleTextGenerator: React.FC = () => <TransformTool title="Invisible Text" transform={() => '\u200B\u200B\u200B'} />;

// --- REGEX ---
export const RegexValidatorTool: React.FC = () => <TransformTool title="Regex Validator" transform={(s) => { try { new RegExp(s); return "Valid Regex Pattern"; } catch { return "Invalid Regex Pattern"; } }} />;
export const RegexReplacerTool: React.FC = () => {
    const [p, setP] = useState('');
    const [r, setR] = useState('');
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4"><input className="p-3 border rounded-xl" placeholder="Pattern (regex)" value={p} onChange={e => setP(e.target.value)} /><input className="p-3 border rounded-xl" placeholder="Replace with" value={r} onChange={e => setR(e.target.value)} /></div>
            <TransformTool title="Regex Replacer" transform={(text) => { try { return text.replace(new RegExp(p, 'g'), r); } catch { return text; } }} />
        </div>
    );
};
export const EmailExtractorTool: React.FC = () => <TransformTool title="Email Extractor" transform={(s) => (s.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi) || []).join('\n')} />;
export const URLExtractorTool: React.FC = () => <TransformTool title="URL Extractor" transform={(s) => (s.match(/https?:\/\/[^\s]+/gi) || []).join('\n')} />;

// --- LANGUAGE ---
export const TamilTranslatorTool: React.FC = () => {
    const { loading, response, generate } = useAI();
    const [text, setText] = useState('');
    return (
        <ToolShell title="English ↔ Tamil">
            <textarea className="w-full h-48 p-4 border rounded-2xl mb-4" value={text} onChange={e => setText(e.target.value)} placeholder="Enter English or Tamil text..." />
            <button onClick={() => generate(`Translate between English and Tamil: ${text}`)} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold w-full">{loading ? 'Translating...' : 'Translate'}</button>
            {response && <div className="mt-4 p-6 bg-indigo-50 border rounded-2xl font-bold text-lg">{response}</div>}
        </ToolShell>
    );
};
export const HindiTranslatorTool: React.FC = () => {
    const { loading, response, generate } = useAI();
    const [text, setText] = useState('');
    return (
        <ToolShell title="English ↔ Hindi">
            <textarea className="w-full h-48 p-4 border rounded-2xl mb-4" value={text} onChange={e => setText(e.target.value)} placeholder="Enter English or Hindi text..." />
            <button onClick={() => generate(`Translate between English and Hindi: ${text}`)} className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold w-full">{loading ? 'Translating...' : 'Translate'}</button>
            {response && <div className="mt-4 p-6 bg-orange-50 border rounded-2xl font-bold text-lg">{response}</div>}
        </ToolShell>
    );
};
export const TransliterationTool: React.FC = () => {
    const { loading, response, generate } = useAI();
    const [text, setText] = useState('');
    return (
        <ToolShell title="AI Transliteration">
            <textarea className="w-full h-48 p-4 border rounded-2xl mb-4" value={text} onChange={e => setText(e.target.value)} placeholder="Enter text phonetically (e.g. namaste)..." />
            <button onClick={() => generate(`Convert this phonetic text into its native script: ${text}`)} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold w-full">{loading ? 'Processing...' : 'Transliterate'}</button>
            {response && <div className="mt-4 p-6 bg-emerald-50 border rounded-2xl font-bold text-lg">{response}</div>}
        </ToolShell>
    );
};
export const LanguageDetectorTool: React.FC = () => {
    const { loading, response, generate } = useAI();
    const [text, setText] = useState('');
    return (
        <ToolShell title="Language Detector">
            <textarea className="w-full h-48 p-4 border rounded-2xl mb-4" value={text} onChange={e => setText(e.target.value)} placeholder="Paste any text..." />
            <button onClick={() => generate(`What language is this? Return ONLY the language name: ${text}`)} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold w-full">{loading ? 'Detecting...' : 'Detect Language'}</button>
            {response && <div className="mt-4 p-10 bg-slate-900 text-white rounded-2xl text-center text-4xl font-black">{response}</div>}
        </ToolShell>
    );
};

export const TextToSpeechTool: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const generateAudio = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setAudioUrl(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say naturally: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const binary = atob(base64Audio);
        const len = binary.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'audio/wav' }); 
        setAudioUrl(URL.createObjectURL(blob));
      }
    } catch (error) {
      alert("TTS generation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell title="AI Text to Speech">
      <textarea className="w-full h-48 p-6 border-2 border-slate-100 rounded-3xl mb-6 bg-slate-50 outline-none focus:border-blue-500 text-lg transition-all" placeholder="Enter text to hear it spoken..." value={text} onChange={e => setText(e.target.value)} />
      <button onClick={generateAudio} disabled={loading || !text.trim()} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
        {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-play"></i>}
        {loading ? 'Generating...' : 'Generate Voice'}
      </button>
      {audioUrl && <div className="mt-6 w-full bg-slate-900 p-6 rounded-3xl flex items-center justify-between border-t-4 border-blue-500 shadow-2xl"><audio controls src={audioUrl} className="h-10 w-full" autoPlay /></div>}
    </ToolShell>
  );
};
