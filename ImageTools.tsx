
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const ToolShell: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-200 h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center">
        <i className="fas fa-image text-xl"></i>
      </div>
      <h3 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h3>
    </div>
    {children}
  </div>
);

const FileInput: React.FC<{ onFileSelect: (file: File) => void; accept?: string }> = ({ onFileSelect, accept = "image/*" }) => (
  <div className="mb-4">
    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-200 border-dashed rounded-[2rem] cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all group">
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <i className="fas fa-cloud-upload-alt text-2xl text-slate-400 group-hover:text-pink-500"></i>
        </div>
        <p className="mb-2 text-sm text-slate-500 font-bold uppercase tracking-widest">Click or drag image</p>
        <p className="text-xs text-slate-400 font-medium">PNG, JPG, SVG, etc.</p>
      </div>
      <input type="file" className="hidden" accept={accept} onChange={e => e.target.files?.[0] && onFileSelect(e.target.files[0])} />
    </label>
  </div>
);

// Generic tool to handle various image conversions based on the current tool ID/hash
export const GenericImageConverter: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const title = window.location.hash.replace('#', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const targetFormat = title.split(' ').pop()?.toLowerCase() || 'png';

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const convert = () => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const mime = `image/${targetFormat === 'jpg' ? 'jpeg' : targetFormat}`;
      const link = document.createElement('a');
      link.download = `converted-image.${targetFormat}`;
      link.href = canvas.toDataURL(mime);
      link.click();
    };
    img.src = image;
  };

  return (
    <ToolShell title={title}>
      <FileInput onFileSelect={handleFile} />
      {image && (
        <div className="space-y-6 flex flex-col items-center animate-in fade-in">
          <div className="p-4 bg-white border rounded-3xl shadow-sm">
            <img src={image} className="max-h-64 rounded-2xl" alt="Preview" />
          </div>
          <button onClick={convert} className="w-full bg-pink-600 text-white py-4 rounded-2xl font-black text-xl shadow-lg">Download as {targetFormat.toUpperCase()}</button>
        </div>
      )}
    </ToolShell>
  );
};

export const ImageToBase64Tool: React.FC = () => {
  const [base64, setBase64] = useState('');
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => setBase64(reader.result as string);
    reader.readAsDataURL(file);
  };
  return (
    <ToolShell title="Image to Base64">
      <FileInput onFileSelect={handleFile} />
      {base64 && (
        <div className="animate-in fade-in zoom-in duration-300">
          <textarea className="w-full h-48 p-4 border rounded-2xl mb-4 font-mono text-xs bg-slate-900 text-slate-100 shadow-inner" value={base64} readOnly />
          <button 
            onClick={() => {
              navigator.clipboard.writeText(base64);
              alert("Copied!");
            }} 
            className="w-full bg-slate-900 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <i className="fas fa-copy"></i> Copy Base64 String
          </button>
        </div>
      )}
    </ToolShell>
  );
};

export const Base64ToImageTool: React.FC = () => {
  const [base64, setBase64] = useState('');
  return (
    <ToolShell title="Base64 to Image">
      <textarea 
        className="w-full h-48 p-4 border rounded-2xl mb-4 font-mono text-xs bg-slate-50" 
        placeholder="Paste your base64 string here (starting with data:image/)..." 
        value={base64} 
        onChange={e => setBase64(e.target.value)} 
      />
      {base64.startsWith('data:image') && (
        <div className="mt-4 flex flex-col items-center animate-in fade-in duration-300">
          <div className="p-4 bg-white border rounded-2xl shadow-sm mb-4">
            <img src={base64} alt="Preview" className="max-w-full rounded-lg" />
          </div>
          <a href={base64} download="image.png" className="w-full bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-center">Download Image</a>
        </div>
      )}
    </ToolShell>
  );
};

export const ImageCompressorTool: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.8);
  const [compressed, setCompressed] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const compress = () => {
    if (!image || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      setCompressed(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = image;
  };

  return (
    <ToolShell title="Image Compressor">
      {!image ? <FileInput onFileSelect={handleFile} /> : (
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-3xl">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Quality: {Math.round(quality * 100)}%</label>
            <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={e => setQuality(parseFloat(e.target.value))} className="w-full" />
          </div>
          <button onClick={compress} className="w-full bg-pink-600 text-white py-4 rounded-2xl font-black text-xl shadow-lg">Compress Image</button>
          {compressed && (
            <div className="flex flex-col items-center gap-4 animate-in fade-in">
              <div className="p-4 bg-white border rounded-3xl shadow-sm">
                <img src={compressed} alt="Compressed" className="max-w-full rounded-2xl" />
              </div>
              <a href={compressed} download="compressed.jpg" className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-center">Download Compressed JPG</a>
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </ToolShell>
  );
};

export const ImageRotateFlipTool: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(1);
  const [flipV, setFlipV] = useState(1);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <ToolShell title="Rotate & Flip">
      {!image ? <FileInput onFileSelect={handleFile} /> : (
        <div className="space-y-8">
          <div className="flex justify-center p-8 bg-slate-100 rounded-[3rem] shadow-inner overflow-hidden">
            <img 
              src={image} 
              alt="Preview" 
              className="max-h-[300px] object-contain transition-transform duration-300" 
              style={{ transform: `rotate(${rotation}deg) scale(${flipH}, ${flipV})` }} 
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button onClick={() => setRotation(r => r - 90)} className="p-4 bg-white border rounded-2xl font-bold"><i className="fas fa-undo"></i> -90°</button>
            <button onClick={() => setRotation(r => r + 90)} className="p-4 bg-white border rounded-2xl font-bold"><i className="fas fa-redo"></i> +90°</button>
            <button onClick={() => setFlipH(f => f * -1)} className="p-4 bg-white border rounded-2xl font-bold"><i className="fas fa-arrows-alt-h"></i> Flip H</button>
            <button onClick={() => setFlipV(f => f * -1)} className="p-4 bg-white border rounded-2xl font-bold"><i className="fas fa-arrows-alt-v"></i> Flip V</button>
          </div>
          <button onClick={() => {
            const canvas = document.createElement('canvas');
            const img = new Image();
            img.onload = () => {
              const rotateRad = (rotation * Math.PI) / 180;
              const sin = Math.abs(Math.sin(rotateRad));
              const cos = Math.abs(Math.cos(rotateRad));
              canvas.width = img.width * cos + img.height * sin;
              canvas.height = img.width * sin + img.height * cos;
              const ctx = canvas.getContext('2d')!;
              ctx.translate(canvas.width / 2, canvas.height / 2);
              ctx.rotate(rotateRad);
              ctx.scale(flipH, flipV);
              ctx.drawImage(img, -img.width / 2, -img.height / 2);
              const link = document.createElement('a');
              link.download = 'transformed-image.png';
              link.href = canvas.toDataURL();
              link.click();
            };
            img.src = image;
          }} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black">Export Transformed Image</button>
        </div>
      )}
    </ToolShell>
  );
};

export const QRGeneratorTool: React.FC = () => {
  const [text, setText] = useState('');
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  const generate = () => {
    if (!text) return;
    // Using simple Google Charts API for QR generation without adding heavy libraries
    setQrUrl(`https://chart.googleapis.com/chart?cht=qr&chs=500x500&chl=${encodeURIComponent(text)}`);
  };

  return (
    <ToolShell title="QR Generator">
      <div className="space-y-6">
        <input 
          className="w-full p-5 border-2 rounded-2xl text-lg font-bold bg-slate-50 outline-none focus:border-pink-500" 
          placeholder="Enter URL or Text..." 
          value={text} 
          onChange={e => setText(e.target.value)} 
        />
        <button onClick={generate} className="w-full bg-pink-600 text-white py-4 rounded-2xl font-black shadow-lg">Generate QR Code</button>
        {qrUrl && (
          <div className="flex flex-col items-center gap-4 animate-in zoom-in">
            <div className="p-6 bg-white border-8 border-slate-50 rounded-[2rem] shadow-xl">
              <img src={qrUrl} alt="QR Code" className="w-64 h-64" />
            </div>
            <a href={qrUrl} target="_blank" download="qrcode.png" className="text-blue-600 font-bold hover:underline">Download QR Code</a>
          </div>
        )}
      </div>
    </ToolShell>
  );
};

export const ColorPaletteExtractorTool: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [palette, setPalette] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!image) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      canvas.width = 100; // Small sample
      canvas.height = 100;
      ctx.drawImage(img, 0, 0, 100, 100);
      const data = ctx.getImageData(0, 0, 100, 100).data;
      const colors: string[] = [];
      // Very crude palette extraction by sampling fixed points
      const samples = [10, 30, 50, 70, 90];
      for (const y of samples) {
        for (const x of samples) {
          const i = (y * 100 + x) * 4;
          const hex = "#" + ((1 << 24) + (data[i] << 16) + (data[i+1] << 8) + data[i+2]).toString(16).slice(1).toUpperCase();
          if (!colors.includes(hex)) colors.push(hex);
        }
      }
      setPalette(colors.slice(0, 12));
    };
    img.src = image;
  }, [image]);

  return (
    <ToolShell title="Palette Extractor">
      {!image ? <FileInput onFileSelect={handleFile} /> : (
        <div className="space-y-8">
          <div className="flex justify-center p-4 bg-slate-50 rounded-3xl border">
            <img src={image} className="max-h-48 rounded-xl" alt="Source" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {palette.map(color => (
              <div 
                key={color} 
                className="group cursor-pointer flex flex-col items-center" 
                onClick={() => {
                  navigator.clipboard.writeText(color);
                  alert("Copied " + color);
                }}
              >
                <div className="w-full h-16 rounded-xl shadow-sm mb-2 group-hover:scale-110 transition-transform" style={{ backgroundColor: color }} />
                <span className="text-[10px] font-black font-mono text-slate-400 uppercase tracking-tighter">{color}</span>
              </div>
            ))}
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </ToolShell>
  );
};

export const MemeGeneratorTool: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const drawMeme = () => {
    if (!image || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      const fontSize = Math.floor(canvas.width / 10);
      ctx.font = `bold ${fontSize}px Impact`;
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = fontSize / 15;
      ctx.textAlign = 'center';

      // Top Text
      ctx.textBaseline = 'top';
      ctx.strokeText(topText.toUpperCase(), canvas.width / 2, 20);
      ctx.fillText(topText.toUpperCase(), canvas.width / 2, 20);

      // Bottom Text
      ctx.textBaseline = 'bottom';
      ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
      ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
      
      const link = document.createElement('a');
      link.download = 'meme.png';
      link.href = canvas.toDataURL();
      link.click();
    };
    img.src = image;
  };

  return (
    <ToolShell title="Meme Maker">
      {!image ? <FileInput onFileSelect={handleFile} /> : (
        <div className="space-y-6">
          <div className="space-y-4">
            <input 
              className="w-full p-4 border-2 rounded-2xl font-bold uppercase" 
              placeholder="Top Text..." 
              value={topText} 
              onChange={e => setTopText(e.target.value)} 
            />
            <input 
              className="w-full p-4 border-2 rounded-2xl font-bold uppercase" 
              placeholder="Bottom Text..." 
              value={bottomText} 
              onChange={e => setBottomText(e.target.value)} 
            />
          </div>
          <button onClick={drawMeme} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-lg">Download Meme</button>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </ToolShell>
  );
};

export const FaviconGeneratorTool: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const generate = (size: number) => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, size, size);
      const link = document.createElement('a');
      link.download = `favicon-${size}x${size}.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
    img.src = image;
  };

  return (
    <ToolShell title="Favicon Maker">
      {!image ? <FileInput onFileSelect={handleFile} /> : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[16, 32, 64, 128].map(s => (
              <button key={s} onClick={() => generate(s)} className="p-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-pink-500 transition-all font-bold">
                {s} x {s}
              </button>
            ))}
          </div>
          <button onClick={() => [16, 32, 64, 128].forEach(s => generate(s))} className="w-full bg-pink-600 text-white py-4 rounded-2xl font-black">Generate All Sizes</button>
        </div>
      )}
    </ToolShell>
  );
};

export const SVGToPNGTool: React.FC = () => {
  const [svg, setSvg] = useState<string | null>(null);
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => setSvg(e.target?.result as string);
    reader.readAsText(file);
  };

  const convert = () => {
    if (!svg) return;
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width || 1024;
      canvas.height = img.height || 1024;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const link = document.createElement('a');
      link.download = 'exported-vector.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <ToolShell title="SVG to PNG">
      {!svg ? <FileInput onFileSelect={handleFile} accept=".svg" /> : (
        <div className="space-y-6">
          <div className="p-10 bg-white border rounded-[3rem] shadow-inner flex justify-center">
             <div dangerouslySetInnerHTML={{ __html: svg }} className="max-h-48 max-w-full" />
          </div>
          <button onClick={convert} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black">Download High-Res PNG</button>
        </div>
      )}
    </ToolShell>
  );
};

export const ImageExifRemoverTool: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const stripMetadata = () => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      // Canvas stripping automatically removes EXIF since toDataURL creates a new image buffer
      const link = document.createElement('a');
      link.download = 'privacy-safe-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = image;
  };

  return (
    <ToolShell title="EXIF Remover">
      {!image ? <FileInput onFileSelect={handleFile} /> : (
        <div className="space-y-6">
          <p className="text-sm text-slate-500 font-medium">Removing metadata strips GPS coordinates, camera models, and private timestamps.</p>
          <button onClick={stripMetadata} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-lg">Download Stripped Image</button>
        </div>
      )}
    </ToolShell>
  );
};

export const RoundCornersTool: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [radius, setRadius] = useState(50);
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const apply = () => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      
      const r = (radius / 100) * (Math.min(img.width, img.height) / 2);
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(img.width - r, 0);
      ctx.quadraticCurveTo(img.width, 0, img.width, r);
      ctx.lineTo(img.width, img.height - r);
      ctx.quadraticCurveTo(img.width, img.height, img.width - r, img.height);
      ctx.lineTo(r, img.height);
      ctx.quadraticCurveTo(0, img.height, 0, img.height - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, 0, 0);

      const link = document.createElement('a');
      link.download = 'rounded-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = image;
  };

  return (
    <ToolShell title="Round Corners">
      {!image ? <FileInput onFileSelect={handleFile} /> : (
        <div className="space-y-6">
          <div className="p-8 bg-slate-50 rounded-[3rem] shadow-inner flex justify-center">
            <img src={image} style={{ borderRadius: `${radius / 2}%` }} className="max-h-48 shadow-lg" alt="Preview" />
          </div>
          <div className="p-6 bg-slate-50 rounded-3xl">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Corner Radius: {radius}</label>
            <input type="range" min="0" max="100" value={radius} onChange={e => setRadius(parseInt(e.target.value))} className="w-full" />
          </div>
          <button onClick={apply} className="w-full bg-pink-600 text-white py-4 rounded-2xl font-black">Download Rounded Image</button>
        </div>
      )}
    </ToolShell>
  );
};

export const AspectRatioCalculatorTool: React.FC = () => {
  const [w, setW] = useState('1920');
  const [h, setH] = useState('1080');

  const gcd = (a: number, b: number): number => {
    return b ? gcd(b, a % b) : a;
  };

  const calculate = () => {
    const width = parseInt(w) || 0;
    const height = parseInt(h) || 0;
    if (width === 0 || height === 0) return "0:0";
    const common = gcd(width, height);
    return `${width / common}:${height / common}`;
  };

  return (
    <ToolShell title="Aspect Ratio Calc">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Width</label>
            <input className="w-full p-4 border-2 rounded-2xl font-bold bg-slate-50 outline-none focus:border-blue-500" value={w} onChange={e => setW(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Height</label>
            <input className="w-full p-4 border-2 rounded-2xl font-bold bg-slate-50 outline-none focus:border-blue-500" value={h} onChange={e => setH(e.target.value)} />
          </div>
        </div>
        <div className="p-12 bg-slate-900 text-white rounded-[3rem] text-center shadow-xl border-b-8 border-pink-500">
           <div className="text-xs font-bold opacity-50 uppercase tracking-widest mb-2">Aspect Ratio</div>
           <div className="text-7xl font-black">{calculate()}</div>
        </div>
      </div>
    </ToolShell>
  );
};

export const ImageResizerTool: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage(e.target?.result as string);
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!canvasRef.current || !image) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);
      const link = document.createElement('a');
      link.download = 'resized-image.png';
      link.href = canvas.toDataURL();
      link.click();
    };
    img.src = image;
  };

  return (
    <ToolShell title="Image Resizer">
      {!image ? <FileInput onFileSelect={handleFile} /> : (
        <div className="space-y-4 animate-in fade-in">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Width (px)</label>
              <input type="number" value={width} onChange={e => setWidth(parseInt(e.target.value))} className="w-full p-4 border-2 rounded-2xl font-bold bg-slate-50" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Height (px)</label>
              <input type="number" value={height} onChange={e => setHeight(parseInt(e.target.value))} className="w-full p-4 border-2 rounded-2xl font-bold bg-slate-50" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleDownload} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex-1 shadow-lg">Resize & Download</button>
            <button onClick={() => setImage(null)} className="bg-white text-slate-400 px-4 py-4 rounded-2xl font-bold border-2">Clear</button>
          </div>
          <div className="p-4 bg-slate-100 rounded-2xl flex justify-center">
             <img src={image} className="max-h-48 rounded" alt="Resizing preview" />
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </ToolShell>
  );
};

const FilterTool: React.FC<{ title: string; filter: string; icon: string }> = ({ title, filter, icon }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };
  return (
    <ToolShell title={title}>
      {!preview ? <FileInput onFileSelect={handleFile} /> : (
        <div className="space-y-6 flex flex-col items-center animate-in fade-in">
          <div className="p-6 bg-white border-4 border-white shadow-2xl rounded-[3rem]">
            <img src={preview} style={{ filter }} className="max-w-full rounded-[2rem]" alt="Filtered" />
          </div>
          <div className="flex gap-3 w-full">
            <button onClick={() => {
              const canvas = document.createElement('canvas');
              const img = new Image();
              img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d')!;
                ctx.filter = filter;
                ctx.drawImage(img, 0, 0);
                const link = document.createElement('a');
                link.download = 'filtered-image.png';
                link.href = canvas.toDataURL();
                link.click();
              };
              img.src = preview;
            }} className="flex-1 bg-pink-600 text-white py-3 rounded-xl font-bold shadow-lg">Download Result</button>
            <button onClick={() => setPreview(null)} className="px-6 py-3 bg-white border-2 rounded-xl text-slate-400 font-bold">Clear</button>
          </div>
        </div>
      )}
    </ToolShell>
  );
};

// Generic tool to handle various image filters based on the current tool ID/hash
export const GenericImageFilter: React.FC = () => {
  const title = window.location.hash.replace('#', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const toolKey = title.split(' ')[0];
  const filterMap: Record<string, string> = {
    'Blur': 'blur(5px)',
    'Sharpen': 'contrast(1.5) brightness(1.1)',
    'Brightness': 'brightness(1.5)',
    'Contrast': 'contrast(1.5)',
    'Saturation': 'saturate(2)',
    'Hue': 'hue-rotate(90deg)',
    'Grayscale': 'grayscale(1)',
    'Sepia': 'sepia(1)',
    'Invert': 'invert(1)',
    'Pixelate': 'blur(1px) contrast(2)',
    'Vignette': 'brightness(0.8)',
  };
  const filter = filterMap[toolKey] || 'none';
  return <FilterTool title={title} filter={filter} icon="fa-magic" />;
};

export const ImageGrayscaleTool: React.FC = () => <FilterTool title="Grayscale Filter" filter="grayscale(100%)" icon="fa-tint-slash" />;
export const ImageSepiaTool: React.FC = () => <FilterTool title="Sepia Filter" filter="sepia(100%)" icon="fa-history" />;
export const ImageInvertTool: React.FC = () => <FilterTool title="Invert Colors" filter="invert(100%)" icon="fa-adjust" />;
export const ImageBlurTool: React.FC = () => <FilterTool title="Blur Effect" filter="blur(5px)" icon="fa-eye-slash" />;
export const ImageBrightnessTool: React.FC = () => <FilterTool title="Brightness Adj" filter="brightness(150%)" icon="fa-sun" />;

export const ColorPickerTool: React.FC = () => {
  const [color, setColor] = useState('#2563EB');
  return (
    <ToolShell title="Color Picker">
      <div className="flex flex-col items-center gap-10 py-4">
        <div 
          className="w-48 h-48 rounded-[3rem] shadow-2xl border-8 border-white animate-in zoom-in duration-500" 
          style={{ backgroundColor: color }}
        />
        <input 
          type="color" 
          value={color} 
          onChange={e => setColor(e.target.value)} 
          className="w-full h-20 rounded-3xl cursor-pointer border-none shadow-sm"
        />
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="bg-slate-900 text-white p-6 rounded-3xl text-center shadow-lg border-b-4 border-blue-500">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Hex Code</div>
            <div className="font-mono text-2xl font-black">{color.toUpperCase()}</div>
          </div>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(color.toUpperCase());
              alert("Copied " + color.toUpperCase());
            }}
            className="bg-white border-2 border-slate-100 p-6 rounded-3xl text-slate-900 font-black uppercase hover:border-blue-500 transition-all shadow-sm"
          >
            Copy Color
          </button>
        </div>
      </div>
    </ToolShell>
  );
};

export const ImageMetadataTool: React.FC = () => {
  const [info, setInfo] = useState<{ name: string; size: string; type: string; width?: number; height?: number } | null>(null);
  const handleFile = (file: File) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = e => {
      img.onload = () => {
        setInfo({
          name: file.name,
          size: (file.size / 1024).toFixed(2) + ' KB',
          type: file.type,
          width: img.width,
          height: img.height
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };
  return (
    <ToolShell title="Image Metadata">
      {!info ? <FileInput onFileSelect={handleFile} /> : (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
            {Object.entries(info).map(([key, val]) => (
              <div key={key} className="flex justify-between py-4 border-b last:border-0 border-slate-200">
                <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest">{key}</span>
                <span className="font-bold text-slate-900">{val}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setInfo(null)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-lg">Choose Another Image</button>
        </div>
      )}
    </ToolShell>
  );
};

export const AIImageGeneratorTool: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          imageConfig: { aspectRatio: "1:1" }
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64 = `data:image/png;base64,${part.inlineData.data}`;
          setResultImage(base64);
          break;
        }
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell title="AI Image Gen">
      <div className="space-y-6">
        <textarea 
          placeholder="Describe the image you want to create (e.g. 'A futuristic city with neon lights')..." 
          className="w-full p-6 border-2 border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-pink-100 focus:border-pink-500 h-32 text-lg outline-none bg-slate-50 transition-all font-medium"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
        <button 
          onClick={handleGenerate} 
          disabled={loading || !prompt}
          className={`w-full py-5 rounded-2xl font-black text-xl text-white transition-all shadow-xl ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-pink-600 to-indigo-600 hover:scale-[1.02] hover:shadow-pink-200'}`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <i className="fas fa-spinner fa-spin"></i> Gemini is Painting...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-3">
              <i className="fas fa-magic"></i> Generate Masterpiece
            </span>
          )}
        </button>

        {resultImage && (
          <div className="mt-8 flex flex-col items-center animate-in zoom-in duration-500">
            <div className="p-4 bg-white border-8 border-white shadow-2xl rounded-[3rem]">
              <img src={resultImage} alt="Generated" className="max-w-full rounded-[2rem]" />
            </div>
            <a 
              href={resultImage} 
              download="ai-generated.png" 
              className="mt-6 flex items-center gap-2 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:bg-black transition-colors"
            >
              <i className="fas fa-download"></i> Save to Device
            </a>
          </div>
        )}
      </div>
    </ToolShell>
  );
};
