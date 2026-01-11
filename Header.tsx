
import React, { useRef, useEffect } from 'react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange, onHomeClick }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 py-4 px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3 cursor-pointer group" onClick={onHomeClick}>
        <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-blue-200">
          <i className="fas fa-tools text-xl"></i>
        </div>
        <h1 className="text-2xl font-black tracking-tighter text-slate-900 group-hover:text-blue-600 transition-colors uppercase">OMNITOOL</h1>
      </div>

      <div className="relative w-full max-w-xl group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <i className={`fas fa-search transition-colors duration-300 ${searchQuery ? 'text-blue-500' : 'text-slate-400'}`}></i>
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search 1,000+ tools (Press '/' to focus)..."
          className="block w-full pl-11 pr-12 py-3.5 border border-slate-200 rounded-[1.5rem] bg-slate-50 leading-5 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 sm:text-sm transition-all shadow-inner"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button 
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-red-500 transition-colors"
          >
            <i className="fas fa-circle-xmark text-lg"></i>
          </button>
        )}
      </div>

      <nav className="hidden md:flex items-center gap-8">
        <button onClick={onHomeClick} className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">Explorer</button>
        <button className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">Pro Access</button>
        <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:scale-105 transition-all shadow-xl shadow-slate-200">Join Cloud</button>
      </nav>
    </header>
  );
};

export default Header;
