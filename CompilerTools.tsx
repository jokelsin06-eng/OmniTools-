
import React, { useState, useRef, useEffect } from 'react';

const VS_CODE_THEME = {
  bg: 'bg-[#1e1e1e]',
  sidebar: 'bg-[#252526]',
  activityBar: 'bg-[#333333]',
  gutter: 'bg-[#1e1e1e]',
  gutterText: 'text-[#858585]',
  text: 'text-[#d4d4d4]',
  accent: 'bg-[#007acc]',
  border: 'border-[#3c3c3c]',
  header: 'bg-[#2d2d2d]',
  console: 'bg-[#1e1e1e]',
  keyword: 'text-[#569cd6]',
  string: 'text-[#ce9178]'
};

const DEFAULT_CODE: Record<string, string> = {
  python: 'def greet(name):\n    print(f"Hello, {name} from Python!")\n\ngreet("OmniTool User")\n\n# Dynamic result\na = 5\nb = 10\nprint(f"Sum: {a + b}")',
  javascript: '/**\n * OmniTool JS Sandbox\n */\nconsole.log("Initializing runtime...");\n\nconst stack = ["Node.js", "React", "Gemini"];\nconsole.log("Cloud Stack:", stack.join(" -> "));\n\nfunction fib(n) {\n    return n <= 1 ? n : fib(n-1) + fib(n-2);\n}\n\nconsole.log("Fibonacci(10):", fib(10));',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "C++ Standard IO Connected." << endl;\n    cout << "Executing binary..." << endl;\n    return 0;\n}',
  c: '#include <stdio.h>\n\nint main() {\n    printf("Standard C execution simulated.\\n");\n    printf("Process exited with code 0.\\n");\n    return 0;\n}',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Java Virtual Machine (JVM) Initialized.");\n        System.out.println("Executing Main.class...");\n    }\n}',
  php: '<?php\n\n$msg = "PHP 8.2 Runtime Active";\necho $msg . "\\n";\n\n$data = ["status" => "online", "env" => "OmniTool"];\nprint_r($data);',
  html: '<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body { background: #121212; color: #00ff00; font-family: monospace; padding: 2rem; }\n    .box { border: 2px solid #333; padding: 1rem; border-radius: 8px; }\n    h1 { color: #007acc; }\n  </style>\n</head>\n<body>\n  <div class="box">\n    <h1>Live Preview Active</h1>\n    <p>Edit the code to see instant changes.</p>\n    <button onclick="alert(\'OmniTool Event Handler\')">Test JS Bridge</button>\n  </div>\n</body>\n</html>'
};

const LANGUAGE_METADATA: Record<string, { icon: string; name: string; file: string; color: string }> = {
  python: { icon: 'fab fa-python', name: 'Python 3', file: 'main.py', color: 'text-blue-400' },
  javascript: { icon: 'fab fa-js', name: 'Node.js', file: 'app.js', color: 'text-yellow-400' },
  html: { icon: 'fab fa-html5', name: 'HTML/CSS', file: 'index.html', color: 'text-orange-500' },
  cpp: { icon: 'fas fa-file-code', name: 'C++', file: 'main.cpp', color: 'text-blue-600' },
  c: { icon: 'fas fa-file-code', name: 'C', file: 'main.c', color: 'text-slate-400' },
  java: { icon: 'fab fa-java', name: 'Java', file: 'Main.java', color: 'text-red-500' },
  php: { icon: 'fab fa-php', name: 'PHP', file: 'index.php', color: 'text-indigo-400' },
};

export const CodeCompiler: React.FC = () => {
  const [lang, setLang] = useState('javascript');
  const [code, setCode] = useState(DEFAULT_CODE['javascript']);
  const [output, setOutput] = useState<string[]>(['[System] Editor Ready.', '[System] Select a language to start.']);
  const [isRunning, setIsRunning] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const lines = code.split('\n');

  const syncScroll = () => {
    if (editorRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = editorRef.current.scrollTop;
    }
  };

  const handleLangChange = (newLang: string) => {
    setLang(newLang);
    setCode(DEFAULT_CODE[newLang] || '');
    setOutput([`[System] Switched to ${LANGUAGE_METADATA[newLang].name}`, `[System] Working Directory: /home/omnitool/${newLang}/`]);
  };

  const runCode = () => {
    setIsRunning(true);
    const timestamp = new Date().toLocaleTimeString();
    setOutput(prev => [...prev, `[${timestamp}] $ run ${LANGUAGE_METADATA[lang].file}`]);

    setTimeout(() => {
      if (lang === 'javascript') {
        try {
          const logs: string[] = [];
          const originalLog = console.log;
          console.log = (...args) => logs.push(args.join(' '));
          new Function(code)();
          console.log = originalLog;
          setOutput(prev => [...prev, ...logs.map(l => `> ${l}`), '[Success] Process finished with exit code 0']);
        } catch (e: any) {
          setOutput(prev => [...prev, `[Error] Runtime exception: ${e.message}`]);
        }
      } else if (lang === 'html') {
        setOutput(prev => [...prev, '[Info] Rendering HTML to preview buffer...']);
      } else {
        setOutput(prev => [
          ...prev, 
          `[VM] Connecting to remote ${lang} node...`,
          `[VM] Compiling binary...`,
          `> Output simulated for ${LANGUAGE_METADATA[lang].name}:`,
          `> Hello world from OmniTool Studio!`,
          `[Done] Execution finished.`
        ]);
      }
      setIsRunning(false);
    }, 1000);
  };

  const downloadFile = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = LANGUAGE_METADATA[lang].file;
    a.click();
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* OS Style Header */}
      <div className={`${VS_CODE_THEME.header} h-10 flex items-center justify-between px-4 border-b ${VS_CODE_THEME.border}`}>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">OmniTool Studio — {LANGUAGE_METADATA[lang].file}</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={downloadFile} className="text-slate-400 hover:text-white transition-colors text-xs flex items-center gap-1">
            <i className="fas fa-download"></i> Save
          </button>
          <button onClick={() => setOutput(['Console cleared.'])} className="text-slate-400 hover:text-white transition-colors text-xs flex items-center gap-1">
            <i className="fas fa-eraser"></i> Clear
          </button>
        </div>
      </div>

      <div className="flex h-[750px]">
        {/* Activity Bar (VS Code left-most bar) */}
        <div className={`${VS_CODE_THEME.activityBar} w-12 flex flex-col items-center py-4 gap-6`}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`text-xl ${sidebarOpen ? 'text-white' : 'text-slate-500'}`}>
            <i className="fas fa-file"></i>
          </button>
          <button className="text-xl text-slate-500 hover:text-white"><i className="fas fa-search"></i></button>
          <button className="text-xl text-slate-500 hover:text-white"><i className="fas fa-code-branch"></i></button>
          <button className="text-xl text-slate-500 hover:text-white"><i className="fas fa-th-large"></i></button>
          <div className="mt-auto flex flex-col gap-6">
             <button className="text-xl text-slate-500 hover:text-white"><i className="fas fa-cog"></i></button>
          </div>
        </div>

        {/* Sidebar Explorer */}
        {sidebarOpen && (
          <div className={`${VS_CODE_THEME.sidebar} w-64 border-r ${VS_CODE_THEME.border} flex flex-col`}>
            <div className="p-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Explorer</div>
            <div className="flex-grow">
               <div className="px-3 py-1 flex items-center gap-2 text-white font-bold text-xs bg-white/5 cursor-pointer">
                  <i className="fas fa-chevron-down"></i> OMNITOOL-PROJECT
               </div>
               <div className="ml-4 mt-2 flex flex-col gap-1">
                 {Object.entries(LANGUAGE_METADATA).map(([id, meta]) => (
                   <button 
                     key={id}
                     onClick={() => handleLangChange(id)}
                     className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-l-md transition-all ${lang === id ? 'bg-[#37373d] text-white' : 'text-slate-400 hover:bg-[#2a2d2e] hover:text-slate-200'}`}
                   >
                     <i className={`${meta.icon} ${meta.color} w-4`}></i>
                     {meta.file}
                   </button>
                 ))}
               </div>
            </div>
          </div>
        )}

        {/* Workspace */}
        <div className="flex-grow flex flex-col bg-[#1e1e1e]">
          {/* Tabs */}
          <div className={`${VS_CODE_THEME.sidebar} h-9 flex border-b ${VS_CODE_THEME.border}`}>
             <div className="bg-[#1e1e1e] border-t-2 border-[#007acc] px-4 flex items-center gap-2 text-white text-xs border-r border-[#3c3c3c]">
                <i className={`${LANGUAGE_METADATA[lang].icon} ${LANGUAGE_METADATA[lang].color}`}></i>
                {LANGUAGE_METADATA[lang].file}
                <i className="fas fa-times ml-2 opacity-50 hover:opacity-100 cursor-pointer"></i>
             </div>
          </div>

          {/* Editor & Console Split */}
          <div className="flex-grow flex flex-col relative">
            <div className="flex-grow flex overflow-hidden">
               {/* Line Numbers */}
               <div ref={gutterRef} className={`${VS_CODE_THEME.gutter} ${VS_CODE_THEME.gutterText} w-12 pt-4 text-right pr-3 font-mono text-xs select-none overflow-hidden leading-6`}>
                  {lines.map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
               </div>
               
               {/* Code TextArea */}
               <textarea
                 ref={editorRef}
                 onScroll={syncScroll}
                 value={code}
                 onChange={(e) => setCode(e.target.value)}
                 spellCheck={false}
                 className="flex-grow bg-transparent text-[#d4d4d4] font-mono text-sm p-4 pt-4 outline-none resize-none leading-6 scrollbar-thin scrollbar-thumb-white/10"
                 placeholder="// Start coding..."
               />

               {/* Run Button Floating */}
               <div className="absolute top-4 right-8 flex gap-2">
                  <button 
                    onClick={runCode}
                    disabled={isRunning}
                    className="flex items-center gap-2 bg-[#007acc] hover:bg-[#0062a3] text-white px-4 py-2 rounded-md font-bold text-xs shadow-lg transition-all active:scale-95"
                  >
                    {isRunning ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-play"></i>}
                    {isRunning ? 'RUNNING' : 'RUN'}
                  </button>
               </div>
            </div>

            {/* Console / Output */}
            <div className={`h-1/3 border-t-8 ${VS_CODE_THEME.border} ${VS_CODE_THEME.console} flex flex-col`}>
              <div className="px-4 py-2 flex items-center justify-between border-b border-white/5">
                <div className="flex gap-6">
                   <button className="text-[10px] font-black text-white border-b border-white uppercase tracking-widest pb-1">Output</button>
                   <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest pb-1">Terminal</button>
                   <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest pb-1">Debug Console</button>
                </div>
              </div>
              <div className="flex-grow p-4 font-mono text-xs overflow-auto">
                 {lang === 'html' ? (
                   <div className="w-full h-full bg-white rounded shadow-inner overflow-hidden">
                      <iframe className="w-full h-full" srcDoc={code} title="Live Preview" />
                   </div>
                 ) : (
                   <div className="space-y-1">
                      {output.map((line, i) => (
                        <div key={i} className={`
                          ${line.startsWith('>') ? 'text-[#dcdcaa]' : ''}
                          ${line.startsWith('[Error]') ? 'text-[#f44747]' : ''}
                          ${line.startsWith('[System]') ? 'text-[#4ec9b0]' : ''}
                          ${line.startsWith('[VM]') ? 'text-[#c586c0]' : ''}
                          ${line.startsWith('$') ? 'text-[#569cd6]' : 'text-slate-300'}
                        `}>
                          {line}
                        </div>
                      ))}
                      {isRunning && <div className="text-white animate-pulse">_</div>}
                   </div>
                 )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-[#007acc] h-6 flex items-center justify-between px-3 text-[10px] text-white">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1"><i className="fas fa-code-branch"></i> main*</div>
           <div className="flex items-center gap-1"><i className="fas fa-sync"></i> Synchronized</div>
           <div className="flex items-center gap-1 text-red-100"><i className="fas fa-times-circle"></i> 0</div>
           <div className="flex items-center gap-1"><i className="fas fa-exclamation-triangle"></i> 0</div>
        </div>
        <div className="flex items-center gap-4">
           <div>Spaces: 4</div>
           <div>UTF-8</div>
           <div className="font-bold">{LANGUAGE_METADATA[lang].name}</div>
           <div className="bg-white/20 px-2 h-full flex items-center"><i className="fas fa-bell"></i></div>
        </div>
      </div>
    </div>
  );
};
