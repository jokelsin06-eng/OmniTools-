
import React from 'react';
import { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
  onClick: (tool: Tool) => void;
  searchQuery?: string;
}

const Highlight: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() 
          ? <span key={i} className="bg-blue-600 text-white rounded-sm px-0.5">{part}</span> 
          : part
      )}
    </>
  );
};

const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick, searchQuery = '' }) => {
  return (
    <div 
      onClick={() => onClick(tool)}
      className="tool-card group cursor-pointer bg-white p-6 rounded-[2rem] border border-slate-200 hover:border-blue-500 hover:ring-4 hover:ring-blue-500/5 transition-all flex flex-col items-center text-center gap-4 h-full animate-in fade-in zoom-in duration-300"
    >
      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-blue-200">
        <i className={`fas ${tool.icon} text-xl`}></i>
      </div>
      <div>
        <h4 className="font-black text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors text-sm uppercase tracking-tight">
          <Highlight text={tool.name} query={searchQuery} />
        </h4>
        <p className="text-[10px] text-slate-400 font-bold line-clamp-2 leading-relaxed uppercase tracking-tighter opacity-80">
          <Highlight text={tool.description} query={searchQuery} />
        </p>
      </div>
      <div className="mt-auto pt-2">
         <div className="bg-slate-100 text-[8px] font-black text-slate-400 px-3 py-1 rounded-full uppercase tracking-widest group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
            {tool.category.split(' ')[0]}
         </div>
      </div>
    </div>
  );
};

export default ToolCard;
