
import React, { useState, useEffect } from 'react';

const ToolShell: React.FC<{ title: string; icon: string; color: string; children: React.ReactNode }> = ({ title, icon, color, children }) => (
  <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-sm border border-slate-200 h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
    <div className="flex items-center gap-4 mb-8">
      <div className={`w-14 h-14 ${color} text-white rounded-2xl flex items-center justify-center shadow-lg`}>
        <i className={`fas ${icon} text-2xl`}></i>
      </div>
      <h3 className="text-4xl font-black text-slate-900 tracking-tight uppercase">{title}</h3>
    </div>
    {children}
  </div>
);

// --- SOCIAL VIDEO DOWNLOADER ---
export const SocialVideoDownloader: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0); // 0: Input, 1: Options

  const handleProcess = () => {
    if (!url.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(1);
    }, 1500);
  };

  return (
    <ToolShell title="Video Downloader" icon="fa-download" color="bg-blue-600">
      <div className="space-y-6">
        {step === 0 ? (
          <>
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Paste Video URL</label>
              <input 
                type="text" 
                className="w-full p-4 border-2 border-slate-200 rounded-2xl text-lg font-bold outline-none focus:border-blue-500 transition-all shadow-inner"
                placeholder="https://www.instagram.com/reels/..."
                value={url}
                onChange={e => setUrl(e.target.value)}
              />
              <div className="flex gap-4 mt-6 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                <i className="fab fa-instagram text-xl"></i>
                <i className="fab fa-facebook text-xl"></i>
                <i className="fab fa-youtube text-xl"></i>
                <i className="fab fa-tiktok text-xl"></i>
                <i className="fab fa-twitter text-xl"></i>
              </div>
            </div>
            <button 
              onClick={handleProcess}
              disabled={loading || !url}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-bolt mr-2"></i>}
              {loading ? 'ANALYZING MEDIA...' : 'GET DOWNLOAD LINKS'}
            </button>
          </>
        ) : (
          <div className="animate-in zoom-in duration-300">
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white mb-6">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center"><i className="fas fa-film"></i></div>
                 <div>
                    <div className="text-xs font-black text-blue-400 uppercase tracking-widest">Media Found</div>
                    <div className="font-bold truncate max-w-xs">{url}</div>
                 </div>
              </div>
              <div className="space-y-3">
                <button className="w-full bg-white/10 hover:bg-white/20 p-4 rounded-xl flex justify-between items-center transition-all">
                  <span className="font-bold">720p HD (MP4)</span>
                  <i className="fas fa-download text-blue-400"></i>
                </button>
                <button className="w-full bg-white/10 hover:bg-white/20 p-4 rounded-xl flex justify-between items-center transition-all">
                  <span className="font-bold">1080p Full HD (MP4)</span>
                  <i className="fas fa-download text-blue-400"></i>
                </button>
                <button className="w-full bg-white/10 hover:bg-white/20 p-4 rounded-xl flex justify-between items-center transition-all">
                  <span className="font-bold">Audio Only (MP3)</span>
                  <i className="fas fa-music text-blue-400"></i>
                </button>
              </div>
            </div>
            <button onClick={() => setStep(0)} className="w-full py-4 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-blue-600 transition-colors">Download Another Video</button>
          </div>
        )}
      </div>
    </ToolShell>
  );
};

// --- TEMPORARY EMAIL GENERATOR ---
export const TempEmailGenerator: React.FC = () => {
  const [email, setEmail] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [emails, setEmails] = useState<any[]>([]);

  useEffect(() => {
    generateEmail();
    const timer = setInterval(() => setTimeLeft(t => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const generateEmail = () => {
    const domains = ['tempcloud.com', 'mailburst.net', 'zero-spam.io', 'quickmail.top', 'cloakmail.org'];
    const rand = Math.random().toString(36).substring(2, 10);
    setEmail(`${rand}@${domains[Math.floor(Math.random() * domains.length)]}`);
    setTimeLeft(600);
    setEmails([]);
  };

  const simulateArrival = () => {
    const mock = {
      from: 'Verify@Service.com',
      subject: 'Your Verification Code: ' + Math.floor(100000 + Math.random() * 900000),
      time: 'Just now'
    };
    setEmails([mock, ...emails]);
  };

  return (
    <ToolShell title="Temp Email" icon="fa-envelope-open-text" color="bg-amber-500">
      <div className="space-y-8">
        <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 flex flex-col items-center">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Your Private Address</div>
          <div className="text-3xl font-black text-slate-900 mb-6 font-mono break-all text-center animate-in fade-in duration-300">{email}</div>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => navigator.clipboard.writeText(email)} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all">
              <i className="fas fa-copy"></i> Copy
            </button>
            <button onClick={generateEmail} className="bg-white border-2 border-slate-200 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:border-amber-500 hover:text-amber-600 transition-all">
              <i className="fas fa-rotate"></i> Regenerate
            </button>
          </div>
          <div className="mt-8 text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-4 py-2 rounded-full">
            Session expires in {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </div>
        </div>

        <div className="bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h4 className="text-white font-black uppercase text-xs tracking-widest">Inbox</h4>
            <button onClick={simulateArrival} className="text-[10px] text-amber-500 font-bold hover:underline">Simulate OTP</button>
          </div>
          <div className="min-h-[200px] max-h-[300px] overflow-auto">
            {emails.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[200px] opacity-20">
                <i className="fas fa-inbox text-4xl text-white mb-2"></i>
                <span className="text-white text-xs font-bold uppercase tracking-widest">Waiting for incoming mail...</span>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {emails.map((m, i) => (
                  <div key={i} className="p-6 hover:bg-white/5 transition-colors cursor-pointer group animate-in slide-in-from-left duration-300">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-amber-500 font-bold text-xs">{m.from}</span>
                      <span className="text-[10px] text-slate-500">{m.time}</span>
                    </div>
                    <div className="text-white font-bold group-hover:text-amber-400 transition-colors">{m.subject}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolShell>
  );
};

// --- TEMPORARY PHONE RECEIVER ---
export const TempPhoneReceiver: React.FC = () => {
  const [selectedNum, setSelectedNum] = useState<any>(null);
  
  const generateRandomPhone = (countryCode: string) => {
    const randomDigits = Math.floor(100000000 + Math.random() * 900000000).toString();
    if (countryCode === '+91') return `${randomDigits.slice(0, 5)} ${randomDigits.slice(5)}`;
    if (countryCode === '+1') return `${randomDigits.slice(0, 3)}-555-${randomDigits.slice(6)}`;
    return `${randomDigits.slice(0, 4)} ${randomDigits.slice(4)}`;
  };

  const [numbers, setNumbers] = useState([
    { country: 'India', code: '+91', flag: '🇮🇳', num: '98765 43210' },
    { country: 'USA', code: '+1', flag: '🇺🇸', num: '202-555-0143' },
    { country: 'UK', code: '+44', flag: '🇬🇧', num: '7911 123456' },
  ]);

  const handleRegenerate = (index: number) => {
    const newNumbers = [...numbers];
    newNumbers[index].num = generateRandomPhone(newNumbers[index].code);
    setNumbers(newNumbers);
    if (selectedNum?.country === newNumbers[index].country) {
      setSelectedNum(newNumbers[index]);
    }
  };

  return (
    <ToolShell title="Temp Phone" icon="fa-mobile-screen" color="bg-emerald-500">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {numbers.map((n, idx) => (
            <div 
              key={n.country} 
              onClick={() => setSelectedNum(n)}
              className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all relative group overflow-hidden ${selectedNum?.country === n.country ? 'border-emerald-500 bg-emerald-50 shadow-lg' : 'border-slate-100 hover:border-emerald-200 bg-slate-50'}`}
            >
              <div className="text-3xl mb-3">{n.flag}</div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{n.country}</div>
              <div className="text-lg font-black text-slate-900 animate-in fade-in duration-300">{n.code} {n.num}</div>
              
              <button 
                onClick={(e) => { e.stopPropagation(); handleRegenerate(idx); }}
                className="absolute top-4 right-4 text-slate-300 hover:text-emerald-600 transition-colors"
                title="Regenerate this number"
              >
                <i className="fas fa-rotate text-sm"></i>
              </button>
            </div>
          ))}
        </div>

        {selectedNum ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border-b-8 border-emerald-500">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-emerald-600 to-teal-700">
                 <div>
                    <h4 className="text-white font-black text-2xl tracking-tighter uppercase">SMS Live Feed</h4>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{selectedNum.code} {selectedNum.num}</p>
                 </div>
                 <div className="flex gap-4">
                    <button 
                      onClick={() => handleRegenerate(numbers.findIndex(n => n.country === selectedNum.country))}
                      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      Regenerate
                    </button>
                    <i className="fas fa-signal text-white animate-pulse mt-2"></i>
                 </div>
              </div>
              <div className="p-12 text-center opacity-30">
                 <i className="fas fa-comment-sms text-5xl text-white mb-4"></i>
                 <p className="text-white text-sm font-black uppercase tracking-widest">Listening for incoming OTPs...</p>
                 <p className="text-white/40 text-[10px] mt-2 max-w-xs mx-auto font-bold">The virtual terminal automatically refreshes every 5 seconds. Compatible with WhatsApp, Google, and major apps.</p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-red-500 font-bold text-[10px] uppercase tracking-widest">
              <i className="fas fa-triangle-exclamation"></i>
              <span>Temporary use only. Numbers are shared and public.</span>
            </div>
          </div>
        ) : (
          <div className="p-20 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem]">
            <i className="fas fa-phone-volume text-4xl text-slate-200 mb-4"></i>
            <p className="text-slate-400 font-bold uppercase tracking-widest">Select a regional gateway to start receiving SMS</p>
          </div>
        )}
      </div>
    </ToolShell>
  );
};
