
import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import ToolCard from './components/ToolCard';
import { ALL_TOOLS } from './toolRegistry';
import { Tool, ToolCategory } from './types';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('recent_searches');
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) {
        setSelectedTool(null);
        setSelectedCategory(null);
      } else {
        const tool = ALL_TOOLS.find(t => t.id === hash);
        if (tool) {
          setSelectedTool(tool);
          setSelectedCategory(tool.category);
        } else {
          const cat = Object.values(ToolCategory).find(c => c.toLowerCase().replace(/\s+/g, '-') === hash);
          if (cat) {
            setSelectedCategory(cat);
            setSelectedTool(null);
          }
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleCategoryClick = (cat: ToolCategory) => {
    setSearchQuery('');
    window.location.hash = cat.toLowerCase().replace(/\s+/g, '-');
  };

  const handleToolClick = (tool: Tool) => {
    if (searchQuery.trim()) {
      const newRecent = [searchQuery.trim(), ...recentSearches.filter(s => s !== searchQuery.trim())].slice(0, 5);
      setRecentSearches(newRecent);
      localStorage.setItem('recent_searches', JSON.stringify(newRecent));
    }
    setSearchQuery('');
    window.location.hash = tool.id;
  };

  const handleHomeClick = () => {
    window.location.hash = '';
    setSearchQuery('');
  };

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return ALL_TOOLS.filter(t => 
      t.name.toLowerCase().includes(query) || 
      t.description.toLowerCase().includes(query) ||
      t.category.toLowerCase().includes(query) ||
      t.subCategory?.toLowerCase().includes(query) ||
      t.id.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const searchGroups = useMemo(() => {
    const groups: Record<string, Tool[]> = {};
    filteredTools.forEach(t => {
      if (!groups[t.category]) groups[t.category] = [];
      groups[t.category].push(t);
    });
    return groups;
  }, [filteredTools]);

  const getCategoryInfo = (cat: ToolCategory | string) => {
    switch(cat) {
      case ToolCategory.TEXT: return { icon: 'fa-paragraph', color: 'from-blue-500 to-indigo-600' };
      case ToolCategory.CALCULATOR: return { icon: 'fa-calculator', color: 'from-emerald-500 to-teal-600' };
      case ToolCategory.DEVELOPER: return { icon: 'fa-code', color: 'from-slate-700 to-slate-900' };
      case ToolCategory.IMAGE: return { icon: 'fa-image', color: 'from-pink-500 to-rose-600' };
      case ToolCategory.SEO: return { icon: 'fa-search-location', color: 'from-orange-500 to-amber-600' };
      case ToolCategory.FILE: return { icon: 'fa-file-archive', color: 'from-violet-500 to-purple-600' };
      case ToolCategory.AI: return { icon: 'fa-brain', color: 'from-cyan-500 to-blue-500' };
      case ToolCategory.SOCIAL: return { icon: 'fa-share-nodes', color: 'from-red-500 to-pink-600' };
      case ToolCategory.PDF: return { icon: 'fa-file-pdf', color: 'from-rose-700 to-red-800' };
      case ToolCategory.AUDIO: return { icon: 'fa-volume-high', color: 'from-indigo-500 to-purple-600' };
      case ToolCategory.VIDEO: return { icon: 'fa-video', color: 'from-slate-800 to-slate-950' };
      case ToolCategory.EDUCATION: return { icon: 'fa-graduation-cap', color: 'from-blue-600 to-cyan-500' };
      case ToolCategory.DATA: return { icon: 'fa-chart-area', color: 'from-teal-400 to-emerald-600' };
      case ToolCategory.GAMING: return { icon: 'fa-gamepad', color: 'from-fuchsia-500 to-pink-500' };
      case ToolCategory.REAL_ESTATE: return { icon: 'fa-house-chimney', color: 'from-amber-600 to-orange-700' };
      case ToolCategory.HEALTH: return { icon: 'fa-heart-pulse', color: 'from-rose-400 to-red-600' };
      case ToolCategory.ECOMMERCE: return { icon: 'fa-cart-shopping', color: 'from-indigo-400 to-blue-700' };
      case ToolCategory.TRAVEL: return { icon: 'fa-plane-departure', color: 'from-sky-400 to-blue-600' };
      case ToolCategory.SECURITY: return { icon: 'fa-shield-halved', color: 'from-slate-700 to-slate-900' };
      case ToolCategory.UTILITIES: return { icon: 'fa-globe', color: 'from-amber-400 to-orange-500' };
      default: return { icon: 'fa-box', color: 'from-slate-400 to-slate-500' };
    }
  };

  const groupedTools = useMemo(() => {
    if (!selectedCategory) return null;
    const categoryTools = ALL_TOOLS.filter(t => t.category === selectedCategory);
    const groups: Record<string, Tool[]> = {};
    categoryTools.forEach(t => {
      const sub = t.subCategory || 'General Utilities';
      if (!groups[sub]) groups[sub] = [];
      groups[sub].push(t);
    });
    return groups;
  }, [selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} onHomeClick={handleHomeClick} />

      <main className="flex-grow p-4 md:p-8 max-w-[1800px] mx-auto w-full">
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
          <button onClick={handleHomeClick} className="hover:text-blue-600 transition-colors">Home</button>
          
          {searchQuery ? (
             <>
               <i className="fas fa-chevron-right text-[7px] opacity-30"></i>
               <span className="text-blue-600">Search Results</span>
             </>
          ) : (
            <>
              {selectedCategory && (
                <>
                  <i className="fas fa-chevron-right text-[7px] opacity-30"></i>
                  <button onClick={() => handleCategoryClick(selectedCategory)} className={`hover:text-blue-600 transition-colors ${!selectedTool ? 'text-slate-900' : ''}`}>
                    {selectedCategory}
                  </button>
                </>
              )}
              {selectedTool && (
                <>
                  <i className="fas fa-chevron-right text-[7px] opacity-30"></i>
                  <span className="text-slate-900">{selectedTool.name}</span>
                </>
              )}
            </>
          )}
        </nav>

        {/* Live Search Results View (Takes priority) */}
        {searchQuery.trim() !== '' ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="flex items-end justify-between mb-12 border-b-4 border-slate-900 pb-6">
                <div>
                  <h2 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">Global Search</h2>
                  <p className="text-slate-500 font-bold mt-2">Found {filteredTools.length} matching tools for <span className="text-blue-600">"{searchQuery}"</span></p>
                </div>
                <div className="hidden md:block">
                  {recentSearches.length > 0 && (
                    <div className="flex gap-2">
                       {recentSearches.map(s => (
                         <button key={s} onClick={() => setSearchQuery(s)} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-all">
                           {s}
                         </button>
                       ))}
                    </div>
                  )}
                </div>
             </div>

             {filteredTools.length > 0 ? (
               <div className="space-y-16">
                 {Object.entries(searchGroups).map(([cat, tools]) => (
                   <div key={cat}>
                     <div className="flex items-center gap-4 mb-8">
                       <div className={`w-10 h-10 bg-gradient-to-br ${getCategoryInfo(cat).color} text-white rounded-xl flex items-center justify-center text-sm shadow-lg shadow-blue-500/10`}>
                          <i className={`fas ${getCategoryInfo(cat).icon}`}></i>
                       </div>
                       <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.4em]">{cat}</h3>
                       <div className="h-px flex-grow bg-slate-200 opacity-50"></div>
                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{(tools as Tool[]).length} TOOLS</span>
                     </div>
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
                       {(tools as Tool[]).map(tool => (
                         <ToolCard key={tool.id} tool={tool} onClick={handleToolClick} searchQuery={searchQuery} />
                       ))}
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 shadow-inner">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200 text-4xl">
                    <i className="fas fa-search"></i>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">No tools matched your query</h3>
                  <p className="text-slate-400 font-medium">Try broadening your terms or explore our categories below.</p>
                  <button onClick={() => setSearchQuery('')} className="mt-8 text-blue-600 font-black uppercase tracking-widest text-xs hover:underline bg-blue-50 px-8 py-3 rounded-full transition-all">Back to Home</button>
               </div>
             )}
          </div>
        ) : selectedTool ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="max-w-6xl mx-auto"><selectedTool.component /></div>
          </div>
        ) : selectedCategory ? (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-tight">{selectedCategory}</h2>
                  <p className="text-slate-500 font-medium text-lg">Explore our exhaustive list of {ALL_TOOLS.filter(t => t.category === selectedCategory).length} {selectedCategory}.</p>
                </div>
                <div className="hidden md:flex bg-white p-3 rounded-[2rem] shadow-xl border border-slate-100">
                   <div className={`w-16 h-16 bg-gradient-to-br ${getCategoryInfo(selectedCategory).color} text-white rounded-2xl flex items-center justify-center shadow-lg`}>
                      <i className={`fas ${getCategoryInfo(selectedCategory).icon} text-2xl`}></i>
                   </div>
                </div>
             </div>
             
             {groupedTools && Object.entries(groupedTools).map(([subCat, tools]) => (
               <section key={subCat} className="mb-16">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.4em] whitespace-nowrap">{subCat}</h3>
                    <div className="h-px flex-grow bg-slate-200"></div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
                    {(tools as Tool[]).map(tool => (
                      <ToolCard key={tool.id} tool={tool} onClick={handleToolClick} />
                    ))}
                  </div>
               </section>
             ))}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="text-center mb-16 max-w-4xl mx-auto py-12">
              <span className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-2xl shadow-blue-500/20">GLOBAL UTILITY ARCHITECTURE</span>
              <h2 className="text-9xl font-black text-slate-900 tracking-tighter mb-10 leading-[0.85]">800+ Tools.<br/><span className="text-blue-600">Zero Friction.</span></h2>
              <p className="text-2xl text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto">The world's most comprehensive library of client-side tools. Instant performance, complete privacy.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Object.values(ToolCategory).map(cat => {
                const info = getCategoryInfo(cat);
                const count = ALL_TOOLS.filter(t => t.category === cat).length;
                return (
                  <div key={cat} onClick={() => handleCategoryClick(cat)} className="group cursor-pointer relative overflow-hidden bg-white p-12 rounded-[3.5rem] border border-slate-200 hover:border-blue-400 transition-all hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col h-80">
                    <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${info.color} text-white flex items-center justify-center text-3xl shadow-xl mb-12 group-hover:scale-110 transition-transform duration-500`}>
                      <i className={`fas ${info.icon}`}></i>
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase group-hover:text-blue-600 transition-colors leading-tight">{cat}</h3>
                      <p className="text-[10px] text-slate-400 font-black tracking-[0.3em] mt-4 uppercase">{count} POWER TOOLS</p>
                    </div>
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-slate-50 rounded-full opacity-50 group-hover:bg-blue-50 transition-colors duration-500"></div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-slate-950 text-white py-32 px-8 mt-32 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-4 mb-10">
              <div className="bg-blue-600 p-4 rounded-2xl shadow-2xl shadow-blue-500/20"><i className="fas fa-tools text-3xl"></i></div>
              <span className="font-black text-5xl tracking-tighter uppercase">OMNITOOL</span>
            </div>
            <p className="text-slate-400 font-medium text-xl leading-relaxed max-w-md">OmniTool is the ultimate platform for power users, developers, and creators. Everything you need, processed instantly in your browser.</p>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-[0.3em] text-[10px] mb-10 text-blue-500">Main Suites</h4>
            <div className="space-y-5 text-sm font-bold text-slate-500">
               {Object.values(ToolCategory).slice(0, 10).map(c => (
                 <div key={c} className="hover:text-white cursor-pointer transition-colors flex items-center gap-2 group" onClick={() => handleCategoryClick(c)}>
                   <div className="w-1 h-1 rounded-full bg-slate-800 group-hover:bg-blue-500 transition-colors"></div>
                   {c}
                 </div>
               ))}
            </div>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-[0.3em] text-[10px] mb-10 text-blue-500">Resources</h4>
            <div className="space-y-5 text-sm font-bold text-slate-500">
               <div className="hover:text-white cursor-pointer">API Integration</div>
               <div className="hover:text-white cursor-pointer">Local Performance</div>
               <div className="hover:text-white cursor-pointer">Privacy Blueprint</div>
               <div className="hover:text-white cursor-pointer">Global Index</div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
          <div>&copy; 2025 OMNITOOL GLOBAL SYSTEMS. ALL RIGHTS RESERVED.</div>
          <div className="flex gap-10">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">System Status</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
