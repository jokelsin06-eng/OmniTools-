
import React, { useState } from 'react';

const ToolShell: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
        <i className="fas fa-calculator text-xl"></i>
      </div>
      <h3 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h3>
    </div>
    {children}
  </div>
);

const InputField: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }> = ({ label, value, onChange, placeholder, type = "number" }) => (
  <div className="mb-4">
    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">{label}</label>
    <input 
      type={type} 
      className="w-full p-4 border-2 border-slate-100 rounded-2xl text-lg font-bold outline-none focus:border-green-500 bg-slate-50/50 transition-all" 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      placeholder={placeholder} 
    />
  </div>
);

const ResultCard: React.FC<{ label: string; value: string; secondary?: boolean }> = ({ label, value, secondary }) => (
  <div className={`p-6 rounded-2xl ${secondary ? 'bg-slate-900 text-white' : 'bg-green-600 text-white shadow-lg shadow-green-100'}`}>
    <div className="text-[10px] font-bold uppercase opacity-60 mb-1 tracking-widest">{label}</div>
    <div className="text-2xl font-black">{value}</div>
  </div>
);

// Placeholder for various financial tools dynamically assigned in registry
export const GenericFinanceCalc: React.FC = () => {
    const title = window.location.hash.replace('#', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return (
        <ToolShell title={title}>
            <div className="p-10 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 animate-pulse">
                <i className="fas fa-hand-holding-dollar text-4xl text-slate-200 mb-4"></i>
                <p className="text-slate-500 font-bold">This specialized {title} tool is being fine-tuned for professional financial analysis.</p>
                <p className="text-xs text-slate-400 mt-2 font-medium italic">Comprehensive modeling and localized tax rules are being updated.</p>
            </div>
        </ToolShell>
    );
};

// Placeholder for various math tools dynamically assigned in registry
export const GenericMathCalc: React.FC = () => {
    const title = window.location.hash.replace('#', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return (
        <ToolShell title={title}>
             <div className="p-10 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 animate-pulse">
                <i className="fas fa-square-root-alt text-4xl text-slate-200 mb-4"></i>
                <p className="text-slate-500 font-bold">The {title} engine is being optimized for complex problem-solving and visualization.</p>
                <p className="text-xs text-slate-400 mt-2 font-medium italic">Our symbolic math processing unit is coming online soon.</p>
            </div>
        </ToolShell>
    );
};

export const GSTCalculator: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('18');
  const amt = parseFloat(amount) || 0;
  const r = parseFloat(rate) || 0;
  const gst = (amt * r) / 100;
  
  return (
    <ToolShell title="GST Calculator">
      <div className="space-y-6">
        <InputField label="Base Amount" value={amount} onChange={setAmount} placeholder="0.00" />
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Tax Rate (%)</label>
          <div className="grid grid-cols-4 gap-2">
            {[5, 12, 18, 28].map(v => (
              <button key={v} onClick={() => setRate(v.toString())} className={`py-3 rounded-xl font-bold border-2 transition-all ${rate === v.toString() ? 'bg-green-600 border-green-600 text-white' : 'border-slate-100 bg-white text-slate-400 hover:border-green-200'}`}>
                {v}%
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <ResultCard label="GST Amount" value={gst.toFixed(2)} secondary />
          <ResultCard label="Total Amount" value={(amt + gst).toFixed(2)} />
        </div>
      </div>
    </ToolShell>
  );
};

export const EMICalculator: React.FC = () => {
  const [p, setP] = useState('');
  const [r, setR] = useState('');
  const [n, setN] = useState('');
  const principal = parseFloat(p) || 0;
  const rate = parseFloat(r) / 12 / 100 || 0;
  const months = parseFloat(n) * 12 || 0;
  const emi = months > 0 ? (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1) : 0;

  return (
    <ToolShell title="Loan EMI">
      <div className="space-y-4">
        <InputField label="Principal Amount" value={p} onChange={setP} placeholder="1,00,000" />
        <InputField label="Interest Rate (%)" value={r} onChange={setR} placeholder="10.5" />
        <InputField label="Tenure (Years)" value={n} onChange={setN} placeholder="5" />
        <div className="p-10 bg-blue-600 text-white text-center rounded-3xl shadow-xl shadow-blue-100 mt-6">
          <div className="text-xs font-bold uppercase opacity-60 mb-2 tracking-widest">Monthly Installment</div>
          <div className="text-5xl font-black">₹{emi ? emi.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '0'}</div>
        </div>
      </div>
    </ToolShell>
  );
};

export const SimpleInterestCalculator: React.FC = () => {
  const [p, setP] = useState('');
  const [r, setR] = useState('');
  const [t, setT] = useState('');
  
  const principal = parseFloat(p) || 0;
  const rate = parseFloat(r) || 0;
  const time = parseFloat(t) || 0;
  const interest = (principal * rate * time) / 100;
  
  return (
    <ToolShell title="Simple Interest">
      <div className="space-y-4">
        <InputField label="Principal (₹)" value={p} onChange={setP} placeholder="10000" />
        <InputField label="Rate of Interest (%)" value={r} onChange={setR} placeholder="5" />
        <InputField label="Time (Years)" value={t} onChange={setT} placeholder="1" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <ResultCard label="Interest Amount" value={`₹${interest.toLocaleString()}`} secondary />
          <ResultCard label="Total Amount" value={`₹${(principal + interest).toLocaleString()}`} />
        </div>
      </div>
    </ToolShell>
  );
};

export const CompoundInterestCalculator: React.FC = () => {
  const [p, setP] = useState('');
  const [r, setR] = useState('');
  const [t, setT] = useState('');
  const [n, setN] = useState('12'); // Compound frequency
  
  const principal = parseFloat(p) || 0;
  const rate = parseFloat(r) / 100 || 0;
  const time = parseFloat(t) || 0;
  const freq = parseFloat(n) || 1;
  
  const amount = principal * Math.pow(1 + rate / freq, freq * time);
  
  return (
    <ToolShell title="Compound Interest">
      <div className="space-y-4">
        <InputField label="Principal Amount" value={p} onChange={setP} placeholder="10000" />
        <InputField label="Annual Interest Rate (%)" value={r} onChange={setR} placeholder="8" />
        <InputField label="Time (Years)" value={t} onChange={setT} placeholder="5" />
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Compounding</label>
          <select className="w-full p-4 border-2 border-slate-100 rounded-2xl bg-slate-50 font-bold" value={n} onChange={e => setN(e.target.value)}>
            <option value="1">Annually (1/yr)</option>
            <option value="2">Semi-Annually (2/yr)</option>
            <option value="4">Quarterly (4/yr)</option>
            <option value="12">Monthly (12/yr)</option>
            <option value="365">Daily (365/yr)</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <ResultCard label="Interest Earned" value={`₹${(amount - principal).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} secondary />
          <ResultCard label="Maturity Value" value={`₹${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
        </div>
      </div>
    </ToolShell>
  );
};

export const MortgageCalculator: React.FC = () => {
  const [p, setP] = useState('');
  const [r, setR] = useState('');
  const [t, setT] = useState('30');
  const [tax, setTax] = useState('0');
  const [ins, setIns] = useState('0');
  
  const principal = parseFloat(p) || 0;
  const rate = parseFloat(r) / 12 / 100 || 0;
  const months = parseFloat(t) * 12 || 0;
  const monthlyTax = (parseFloat(tax) || 0) / 12;
  const monthlyIns = (parseFloat(ins) || 0) / 12;
  
  const pAndI = months > 0 ? (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1) : 0;
  const totalMonthly = pAndI + monthlyTax + monthlyIns;

  return (
    <ToolShell title="Mortgage Calculator">
      <div className="space-y-4">
        <InputField label="Home Price" value={p} onChange={setP} placeholder="350000" />
        <InputField label="Interest Rate (%)" value={r} onChange={setR} placeholder="6.5" />
        <InputField label="Loan Term (Years)" value={t} onChange={setT} placeholder="30" />
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Annual Property Tax" value={tax} onChange={setTax} placeholder="2400" />
          <InputField label="Annual Insurance" value={ins} onChange={setIns} placeholder="1200" />
        </div>
        <div className="p-8 bg-blue-900 text-white rounded-[2.5rem] mt-6 flex flex-col items-center">
          <div className="text-[10px] font-bold uppercase opacity-50 mb-2 tracking-widest">Total Monthly Payment</div>
          <div className="text-6xl font-black">${totalMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div className="mt-4 text-xs opacity-50 font-bold">P&I: ${Math.round(pAndI).toLocaleString()} | Tax: ${Math.round(monthlyTax).toLocaleString()} | Ins: ${Math.round(monthlyIns).toLocaleString()}</div>
        </div>
      </div>
    </ToolShell>
  );
};

export const PercentageCalculator: React.FC = () => {
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');
  const [mode, setMode] = useState('isOf'); // mode: isOf, whatIs, change
  
  const getResult = () => {
    const v1 = parseFloat(val1) || 0;
    const v2 = parseFloat(val2) || 0;
    if (mode === 'isOf') return v2 !== 0 ? `${((v1 / v2) * 100).toFixed(2)}%` : '0%';
    if (mode === 'whatIs') return `${((v1 / 100) * v2).toFixed(2)}`;
    if (mode === 'change') return v1 !== 0 ? `${(((v2 - v1) / v1) * 100).toFixed(2)}%` : '0%';
    return '0';
  };

  return (
    <ToolShell title="Percentage Calculator">
      <div className="space-y-6">
        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
          <button onClick={() => setMode('isOf')} className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase ${mode === 'isOf' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}>X is what % of Y</button>
          <button onClick={() => setMode('whatIs')} className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase ${mode === 'whatIs' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}>X % of Y</button>
          <button onClick={() => setMode('change')} className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase ${mode === 'change' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}>% Change</button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <InputField label={mode === 'change' ? "Start Value" : "Value 1"} value={val1} onChange={setVal1} />
          <InputField label={mode === 'change' ? "End Value" : "Value 2"} value={val2} onChange={setVal2} />
        </div>
        
        <div className="p-10 bg-slate-900 text-white rounded-[2.5rem] text-center border-b-8 border-blue-500">
           <div className="text-[10px] font-bold uppercase opacity-50 mb-2 tracking-widest">Result</div>
           <div className="text-6xl font-black">{getResult()}</div>
        </div>
      </div>
    </ToolShell>
  );
};

export const SIPCalculator: React.FC = () => {
  const [m, setM] = useState('');
  const [r, setR] = useState('');
  const [n, setN] = useState('');
  
  const monthly = parseFloat(m) || 0;
  const rate = parseFloat(r) / 12 / 100 || 0;
  const months = parseFloat(n) * 12 || 0;
  
  const totalValue = rate > 0 ? monthly * ((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate) : monthly * months;
  const invested = monthly * months;
  const wealth = totalValue - invested;

  return (
    <ToolShell title="SIP Calculator">
      <div className="space-y-4">
        <InputField label="Monthly Investment" value={m} onChange={setM} placeholder="5,000" />
        <InputField label="Expected Return Rate (%)" value={r} onChange={setR} placeholder="12" />
        <InputField label="Tenure (Years)" value={n} onChange={setN} placeholder="10" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <ResultCard label="Invested Amount" value={`₹${invested.toLocaleString()}`} secondary />
          <ResultCard label="Wealth Gained" value={`₹${Math.round(wealth).toLocaleString()}`} secondary />
          <ResultCard label="Total Value" value={`₹${Math.round(totalValue).toLocaleString()}`} />
        </div>
      </div>
    </ToolShell>
  );
};

export const RDCalculator: React.FC = () => {
  const [m, setM] = useState('');
  const [r, setR] = useState('');
  const [t, setT] = useState('');
  
  const monthly = parseFloat(m) || 0;
  const rate = (parseFloat(r) || 0) / 100;
  const years = parseFloat(t) || 0;
  const n = 4; // Quarterly compounding
  const totalMonths = years * 12;
  
  let maturity = 0;
  for (let k = 1; k <= totalMonths; k++) {
    maturity += monthly * Math.pow(1 + rate / n, n * ( (totalMonths - k + 1) / 12 ) );
  }

  return (
    <ToolShell title="RD Calculator">
      <div className="space-y-4">
        <InputField label="Monthly Deposit" value={m} onChange={setM} placeholder="2,000" />
        <InputField label="Interest Rate (%)" value={r} onChange={setR} placeholder="6.5" />
        <InputField label="Tenure (Years)" value={t} onChange={setT} placeholder="3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <ResultCard label="Total Invested" value={`₹${(monthly * totalMonths).toLocaleString()}`} secondary />
          <ResultCard label="Maturity Value" value={`₹${Math.round(maturity).toLocaleString()}`} />
        </div>
      </div>
    </ToolShell>
  );
};

export const FDCalculator: React.FC = () => {
  const [p, setP] = useState('');
  const [r, setR] = useState('');
  const [t, setT] = useState('');
  const principal = parseFloat(p) || 0;
  const rate = parseFloat(r) || 0;
  const time = parseFloat(t) || 0;
  const n = 4;
  const maturityValue = principal * Math.pow((1 + (rate / 100) / n), (n * time));
  const interestEarned = maturityValue - principal;

  return (
    <ToolShell title="FD Calculator">
      <div className="space-y-6">
        <InputField label="Investment Amount (₹)" value={p} onChange={setP} placeholder="50,000" />
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Interest Rate (%)" value={r} onChange={setR} placeholder="7.5" />
          <InputField label="Tenure (Years)" value={t} onChange={setT} placeholder="5" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <ResultCard label="Interest Earned" value={`₹${Math.round(interestEarned).toLocaleString()}`} secondary />
          <ResultCard label="Maturity Value" value={`₹${Math.round(maturityValue).toLocaleString()}`} />
        </div>
      </div>
    </ToolShell>
  );
};

export const GradeCalculator: React.FC = () => {
  const [grades, setGrades] = useState([{ score: '', weight: '' }]);
  const addRow = () => setGrades([...grades, { score: '', weight: '' }]);
  
  const calculate = () => {
    let totalScore = 0;
    let totalWeight = 0;
    grades.forEach(g => {
      const s = parseFloat(g.score);
      const w = parseFloat(g.weight);
      if (!isNaN(s) && !isNaN(w)) {
        totalScore += s * w;
        totalWeight += w;
      }
    });
    return totalWeight > 0 ? (totalScore / totalWeight).toFixed(2) : '0';
  };

  return (
    <ToolShell title="Grade Calculator">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 px-2">
           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score (%)</div>
           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Weight (%)</div>
        </div>
        {grades.map((g, i) => (
          <div key={i} className="grid grid-cols-2 gap-4">
            <input 
              type="number" 
              className="p-3 border rounded-xl font-bold bg-slate-50" 
              value={g.score} 
              onChange={e => {
                const next = [...grades];
                next[i].score = e.target.value;
                setGrades(next);
              }}
              placeholder="90"
            />
            <input 
              type="number" 
              className="p-3 border rounded-xl font-bold bg-slate-50" 
              value={g.weight} 
              onChange={e => {
                const next = [...grades];
                next[i].weight = e.target.value;
                setGrades(next);
              }}
              placeholder="20"
            />
          </div>
        ))}
        <button onClick={addRow} className="w-full py-3 text-blue-600 font-bold text-xs uppercase tracking-widest hover:bg-blue-50 rounded-xl transition-all">+ Add Grade Item</button>
        <div className="p-8 bg-blue-600 text-white rounded-[2rem] text-center mt-6">
           <div className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-1">Final Weighted Grade</div>
           <div className="text-5xl font-black">{calculate()}%</div>
        </div>
      </div>
    </ToolShell>
  );
};

export const BMINormalizer: React.FC = () => {
  const [h, setH] = useState('');
  const [w, setW] = useState('');
  const bmiValue = parseFloat(w) / Math.pow(parseFloat(h)/100, 2);
  const bmi = bmiValue.toFixed(1);
  return (
    <ToolShell title="BMI Calculator">
      <div className="space-y-4 max-w-sm mx-auto">
        <InputField label="Height (cm)" value={h} onChange={setH} placeholder="175" />
        <InputField label="Weight (kg)" value={w} onChange={setW} placeholder="70" />
        <div className="mt-8 text-center bg-slate-50 p-10 rounded-[3rem] border-4 border-white shadow-inner">
          <div className="text-7xl font-black text-slate-900 mb-2">{isNaN(parseFloat(bmi)) || !isFinite(parseFloat(bmi)) ? '0.0' : bmi}</div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Body Mass Index</p>
        </div>
      </div>
    </ToolShell>
  );
};

export const BMRCalculator: React.FC = () => {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState('male');
  
  const calculate = () => {
    const a = parseFloat(age) || 0;
    const w = parseFloat(weight) || 0;
    const h = parseFloat(height) || 0;
    if (a && w && h) {
      if (gender === 'male') return Math.round(10 * w + 6.25 * h - 5 * a + 5);
      return Math.round(10 * w + 6.25 * h - 5 * a - 161);
    }
    return 0;
  };

  return (
    <ToolShell title="BMR Calculator">
      <div className="space-y-4">
        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl mb-4">
           <button onClick={() => setGender('male')} className={`flex-1 py-3 rounded-xl font-bold ${gender === 'male' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}>MALE</button>
           <button onClick={() => setGender('female')} className={`flex-1 py-3 rounded-xl font-bold ${gender === 'female' ? 'bg-white shadow-sm text-pink-600' : 'text-slate-400'}`}>FEMALE</button>
        </div>
        <InputField label="Age" value={age} onChange={setAge} />
        <InputField label="Weight (kg)" value={weight} onChange={setWeight} />
        <InputField label="Height (cm)" value={height} onChange={setHeight} />
        <div className="p-8 bg-orange-500 text-white rounded-[2rem] text-center mt-6">
           <div className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-1">BMR (Calories/Day)</div>
           <div className="text-5xl font-black">{calculate()}</div>
        </div>
      </div>
    </ToolShell>
  );
};

export const AreaCalculator: React.FC = () => {
  const [shape, setShape] = useState('circle');
  const [v1, setV1] = useState('');
  const [v2, setV2] = useState('');
  
  const calculate = () => {
    const a = parseFloat(v1) || 0;
    const b = parseFloat(v2) || 0;
    if (shape === 'circle') return (Math.PI * a * a).toFixed(2);
    if (shape === 'square') return (a * a).toFixed(2);
    if (shape === 'rectangle') return (a * b).toFixed(2);
    if (shape === 'triangle') return (0.5 * a * b).toFixed(2);
    return '0';
  };

  return (
    <ToolShell title="Area Calculator">
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
           {['circle', 'square', 'rectangle', 'triangle'].map(s => (
             <button key={s} onClick={() => setShape(s)} className={`py-3 rounded-xl border-2 font-bold uppercase text-[10px] ${shape === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100'}`}>{s}</button>
           ))}
        </div>
        <InputField label={shape === 'circle' ? "Radius" : (shape === 'triangle' ? "Base" : "Length")} value={v1} onChange={setV1} />
        {(shape === 'rectangle' || shape === 'triangle') && <InputField label={shape === 'triangle' ? "Height" : "Width"} value={v2} onChange={setV2} />}
        <div className="p-8 bg-purple-600 text-white rounded-[2rem] text-center mt-6">
           <div className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-1">Total Area</div>
           <div className="text-5xl font-black">{calculate()}</div>
        </div>
      </div>
    </ToolShell>
  );
};

export const VolumeCalculator: React.FC = () => {
  const [shape, setShape] = useState('sphere');
  const [v1, setV1] = useState('');
  const [v2, setV2] = useState('');
  
  const calculate = () => {
    const a = parseFloat(v1) || 0;
    const b = parseFloat(v2) || 0;
    if (shape === 'sphere') return ((4/3) * Math.PI * Math.pow(a, 3)).toFixed(2);
    if (shape === 'cube') return Math.pow(a, 3).toFixed(2);
    if (shape === 'cylinder') return (Math.PI * a * a * b).toFixed(2);
    if (shape === 'cone') return ((1/3) * Math.PI * a * a * b).toFixed(2);
    return '0';
  };

  return (
    <ToolShell title="Volume Calculator">
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
           {['sphere', 'cube', 'cylinder', 'cone'].map(s => (
             <button key={s} onClick={() => setShape(s)} className={`py-3 rounded-xl border-2 font-bold uppercase text-[10px] ${shape === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100'}`}>{s}</button>
           ))}
        </div>
        <InputField label={shape === 'cube' ? "Side Length" : "Radius"} value={v1} onChange={setV1} />
        {(shape === 'cylinder' || shape === 'cone') && <InputField label="Height" value={v2} onChange={setV2} />}
        <div className="p-8 bg-teal-600 text-white rounded-[2rem] text-center mt-6">
           <div className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-1">Total Volume</div>
           <div className="text-5xl font-black">{calculate()}</div>
        </div>
      </div>
    </ToolShell>
  );
};

export const TipCalculator: React.FC = () => {
  const [bill, setBill] = useState('');
  const [tipPct, setTipPct] = useState('15');
  const [people, setPeople] = useState('1');
  
  const b = parseFloat(bill) || 0;
  const t = parseFloat(tipPct) || 0;
  const p = Math.max(1, parseInt(people) || 1);
  
  const totalTip = (b * t) / 100;
  const totalBill = b + totalTip;
  const perPerson = totalBill / p;

  return (
    <ToolShell title="Tip Calculator">
      <div className="space-y-4">
        <InputField label="Bill Amount" value={bill} onChange={setBill} placeholder="120.00" />
        <InputField label="Tip Percentage (%)" value={tipPct} onChange={setTipPct} placeholder="15" />
        <InputField label="Number of People" value={people} onChange={setPeople} placeholder="1" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <ResultCard label="Total Tip" value={`$${totalTip.toFixed(2)}`} secondary />
          <ResultCard label="Total Bill" value={`$${totalBill.toFixed(2)}`} secondary />
          <ResultCard label="Each Person" value={`$${perPerson.toFixed(2)}`} />
        </div>
      </div>
    </ToolShell>
  );
};

export const DateDifferenceCalculator: React.FC = () => {
  const [d1, setD1] = useState('');
  const [d2, setD2] = useState('');
  
  const diff = () => {
    if (!d1 || !d2) return 0;
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  return (
    <ToolShell title="Date Difference">
      <div className="space-y-4">
        <InputField label="Start Date" value={d1} onChange={setD1} type="date" />
        <InputField label="End Date" value={d2} onChange={setD2} type="date" />
        <div className="p-12 bg-indigo-600 text-white rounded-[3rem] text-center shadow-2xl">
          <div className="text-8xl font-black mb-2">{diff()}</div>
          <div className="text-xs font-bold uppercase tracking-widest opacity-60">Days Difference</div>
        </div>
      </div>
    </ToolShell>
  );
};

export const AgeCalculator: React.FC = () => {
  const [dob, setDob] = useState('');
  const calculate = () => {
    if (!dob) return { y: 0, m: 0, d: 0 };
    const b = new Date(dob);
    const n = new Date();
    let y = n.getFullYear() - b.getFullYear();
    let m = n.getMonth() - b.getMonth();
    let d = n.getDate() - b.getDate();
    if (d < 0) { m--; d += 30; }
    if (m < 0) { y--; m += 12; }
    return { y, m, d };
  };
  const age = calculate();
  return (
    <ToolShell title="Age Calculator">
      <InputField label="Date of Birth" value={dob} onChange={setDob} type="date" />
      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="p-6 bg-slate-50 border-2 border-white rounded-3xl text-center shadow-sm">
          <div className="text-4xl font-black text-slate-900">{age.y}</div>
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Years</div>
        </div>
        <div className="p-6 bg-slate-50 border-2 border-white rounded-3xl text-center shadow-sm">
          <div className="text-4xl font-black text-slate-900">{age.m}</div>
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Months</div>
        </div>
        <div className="p-6 bg-slate-50 border-2 border-white rounded-3xl text-center shadow-sm">
          <div className="text-4xl font-black text-slate-900">{age.d}</div>
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Days</div>
        </div>
      </div>
    </ToolShell>
  );
};

export const SalesTaxCalculator: React.FC = () => {
  const [price, setPrice] = useState('');
  const [tax, setTax] = useState('');
  const p = parseFloat(price) || 0;
  const t = parseFloat(tax) || 0;
  const taxAmt = (p * t) / 100;
  return (
    <ToolShell title="Sales Tax">
      <div className="space-y-4">
        <InputField label="Net Price" value={price} onChange={setPrice} placeholder="100.00" />
        <InputField label="Tax Rate (%)" value={tax} onChange={setTax} placeholder="8.5" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <ResultCard label="Tax Amount" value={`$${taxAmt.toFixed(2)}`} secondary />
          <ResultCard label="Gross Total" value={`$${(p + taxAmt).toFixed(2)}`} />
        </div>
      </div>
    </ToolShell>
  );
};

export const ProfitMarginCalculator: React.FC = () => {
  const [cost, setCost] = useState('');
  const [revenue, setRevenue] = useState('');
  const c = parseFloat(cost) || 0;
  const r = parseFloat(revenue) || 0;
  const profit = r - c;
  const margin = r !== 0 ? (profit / r) * 100 : 0;
  const markup = c !== 0 ? (profit / c) * 100 : 0;
  
  return (
    <ToolShell title="Profit Margin">
      <div className="space-y-4">
        <InputField label="Cost Price" value={cost} onChange={setCost} placeholder="50.00" />
        <InputField label="Selling Price" value={revenue} onChange={setRevenue} placeholder="75.00" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <ResultCard label="Profit" value={`$${profit.toFixed(2)}`} secondary />
          <ResultCard label="Margin (%)" value={`${margin.toFixed(1)}%`} />
          <ResultCard label="Markup (%)" value={`${markup.toFixed(1)}%`} />
        </div>
      </div>
    </ToolShell>
  );
};

const UnitConverter: React.FC<{ title: string; units: Record<string, number>; icon: string }> = ({ title, units, icon }) => {
  const [val, setVal] = useState('');
  const [from, setFrom] = useState(Object.keys(units)[0]);
  const [to, setTo] = useState(Object.keys(units)[1]);
  
  const convert = () => {
    const v = parseFloat(val);
    if (isNaN(v)) return '0';
    const baseVal = v / units[from];
    const res = baseVal * units[to];
    return res.toLocaleString(undefined, { maximumFractionDigits: 6 });
  };

  return (
    <ToolShell title={title}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select className="p-4 border-2 rounded-2xl font-bold bg-white" value={from} onChange={e => setFrom(e.target.value)}>
            {Object.keys(units).map(u => <option key={u} value={u}>{u}</option>)}
          </select>
          <select className="p-4 border-2 rounded-2xl font-bold bg-white" value={to} onChange={e => setTo(e.target.value)}>
            {Object.keys(units).map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <InputField label="Enter Value" value={val} onChange={setVal} placeholder="1" />
        <div className="p-10 bg-slate-900 text-white rounded-[2.5rem] text-center">
          <div className="text-sm font-bold opacity-50 uppercase mb-2 tracking-widest">Converted Result</div>
          <div className="text-4xl font-black break-all">{convert()} <span className="text-blue-400">{to}</span></div>
        </div>
      </div>
    </ToolShell>
  );
};

export const LengthConverter: React.FC = () => (
  <UnitConverter 
    title="Length Converter" 
    units={{ 'Meter': 1, 'KM': 0.001, 'CM': 100, 'MM': 1000, 'Mile': 0.000621371, 'Yard': 1.09361, 'Foot': 3.28084, 'Inch': 39.3701 }} 
    icon="fa-ruler-horizontal" 
  />
);

export const WeightConverter: React.FC = () => (
  <UnitConverter 
    title="Weight Converter" 
    units={{ 'KG': 1, 'Gram': 1000, 'MG': 1000000, 'Pound': 2.20462, 'Ounce': 35.274 }} 
    icon="fa-weight-hanging" 
  />
);

export const TemperatureConverter: React.FC = () => {
  const [val, setVal] = useState('');
  const [from, setFrom] = useState('Celsius');
  const [to, setTo] = useState('Fahrenheit');
  
  const convert = () => {
    const v = parseFloat(val);
    if (isNaN(v)) return '0';
    let c = v;
    if (from === 'Fahrenheit') c = (v - 32) * 5 / 9;
    if (from === 'Kelvin') c = v - 273.15;
    
    let res = c;
    if (to === 'Fahrenheit') res = (c * 9 / 5) + 32;
    if (to === 'Kelvin') res = c + 273.15;
    
    return res.toFixed(2);
  };

  return (
    <ToolShell title="Temp Converter">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <select className="p-4 border-2 rounded-2xl bg-white font-bold" value={from} onChange={e => setFrom(e.target.value)}>
            <option>Celsius</option><option>Fahrenheit</option><option>Kelvin</option>
          </select>
          <select className="p-4 border-2 rounded-2xl bg-white font-bold" value={to} onChange={e => setTo(e.target.value)}>
            <option>Celsius</option><option>Fahrenheit</option><option>Kelvin</option>
          </select>
        </div>
        <InputField label="Enter Temperature" value={val} onChange={setVal} placeholder="0" />
        <div className="p-10 bg-orange-600 text-white rounded-[2.5rem] text-center shadow-2xl">
          <div className="text-7xl font-black">{convert()}°</div>
          <div className="text-xs font-bold uppercase tracking-widest opacity-60 mt-2">{to}</div>
        </div>
      </div>
    </ToolShell>
  );
};

export const BinaryCalculator: React.FC = () => {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [op, setOp] = useState('+');
  const calc = () => {
    const v1 = parseInt(a, 2);
    const v2 = parseInt(b, 2);
    if (isNaN(v1) || isNaN(v2)) return '0';
    let res = 0;
    if (op === '+') res = v1 + v2;
    if (op === '-') res = v1 - v2;
    if (op === '*') res = v1 * v2;
    return res.toString(2);
  };
  return (
    <ToolShell title="Binary Calculator">
      <div className="space-y-4">
        <InputField label="First Binary" value={a} onChange={setA} placeholder="1010" type="text" />
        <select className="w-full p-4 border-2 rounded-2xl font-bold bg-white" value={op} onChange={e => setOp(e.target.value)}>
          <option value="+">ADD (+)</option>
          <option value="-">SUB (-)</option>
          <option value="*">MUL (*)</option>
        </select>
        <InputField label="Second Binary" value={b} onChange={setB} placeholder="0101" type="text" />
        <div className="p-10 bg-slate-900 text-white rounded-[2.5rem] text-center font-mono">
          <div className="text-xs font-bold uppercase opacity-50 mb-2 tracking-widest">Binary Result</div>
          <div className="text-4xl font-black break-all">{calc()}</div>
        </div>
      </div>
    </ToolShell>
  );
};

export const DiscountCalculator: React.FC = () => {
  const [p, setP] = useState('');
  const [d, setD] = useState('');
  const savings = (parseFloat(p) * parseFloat(d)) / 100 || 0;
  return (
    <ToolShell title="Discount Calculator">
      <div className="space-y-4">
        <InputField label="Original Price" value={p} onChange={setP} placeholder="1000" />
        <InputField label="Discount %" value={d} onChange={setD} placeholder="20" />
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
          <div className="flex justify-between border-b border-slate-800 pb-4 mb-4">
            <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">You Save</span>
            <span className="text-red-400 font-black">₹{savings.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Final Price</span>
            <span className="text-4xl font-black text-green-400">₹{((parseFloat(p) || 0) - savings).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </ToolShell>
  );
};
