import React, { useState, useRef, useEffect } from 'react';
import { useModels } from '../hooks/useModels';
import { useSkills } from '../hooks/useSkills';
import { useAgentConfig, useChat } from '../hooks/useChat';
import { 
  Send, 
  Paperclip, 
  Bot, 
  User, 
  Settings, 
  Globe, 
  FolderTree, 
  Code, 
  Layers, 
  Trash2,
  Maximize2,
  Minimize2,
  Copy,
  Download,
  Share2,
  Eye,
  FileCode,
  Zap,
  ChevronDown,
  Sparkles,
  Globe2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

// Artifact Type Definition
interface Artifact {
  id: string;
  title: string;
  content: string;
  type: 'code' | 'markdown' | 'ui' | 'diagram';
  language?: string;
  version: number;
  status: 'generating' | 'ready';
}

export const ChatPage = () => {
  const { models } = useModels();
  const { skills } = useSkills();
  const { config, updateConfig } = useAgentConfig();
  const { messages, isTyping, sendMessage } = useChat(config);
  
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null);
  const [isArtifactPanelOpen, setIsArtifactPanelOpen] = useState(false);
  const [panelWidth, setPanelWidth] = useState(50); // percentage
  const [artifactActiveTab, setArtifactActiveTab] = useState<'preview' | 'code'>('code');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const currentModel = models.find(m => m.id === config.modelId) || models[0];

  return (
    <div className="flex h-screen bg-[#fafafa] overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        <div 
          className="flex flex-col relative transition-all duration-500 ease-in-out"
          style={{ width: isArtifactPanelOpen ? `${100 - panelWidth}%` : '100%' }}
        >
          <header className="w-full h-14 flex items-center justify-between px-6 shrink-0 bg-white/50 backdrop-blur-xl border-b border-gray-100 z-10 transition-colors">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-xl shadow-sm text-xs font-bold text-gray-700 cursor-pointer hover:border-indigo-500 transition-all">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                架构师 Aether
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </div>
              <div className="h-4 w-[1px] bg-gray-200" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-indigo-500 fill-indigo-500" />
                  {currentModel?.name || 'Aether Engine'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isArtifactPanelOpen && (
                <button 
                  onClick={() => setIsArtifactPanelOpen(false)}
                  className="px-3 py-1.5 text-[10px] font-bold text-indigo-500 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all uppercase tracking-widest flex items-center gap-2"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  隐藏看板
                </button>
              )}
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </header>

          <div className="flex-1 w-full overflow-y-auto px-4 py-8 scrollbar-hide">
            <div className={cn(
              "mx-auto space-y-10 transition-all duration-500",
              isArtifactPanelOpen ? "max-w-2xl" : "max-w-3xl"
            )}>
              <AnimatePresence initial={false}>
                {messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-20 flex flex-col items-center text-center"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white mb-8 shadow-2xl shadow-indigo-200">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight italic">今天有什么可以帮您的？</h3>
                    <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                      编排您的灵境智能体，通过自定义技能和多模型协同完成复杂任务。
                    </p>
                  </motion.div>
                ) : (
                  messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-6",
                        msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 shadow-sm font-bold text-xs",
                        msg.role === 'user' ? "bg-gray-900 text-white" : "bg-white text-indigo-600 border border-gray-100"
                      )}>
                        {msg.role === 'user' ? 'U' : 'Æ'}
                      </div>
                      <div className={cn(
                        "flex-1 space-y-2 max-w-[85%]",
                        msg.role === 'user' ? "text-right" : "text-left"
                      )}>
                         <div className={cn(
                           "inline-block p-4 rounded-3xl shadow-sm text-sm leading-relaxed relative group/msg",
                           msg.role === 'user' 
                            ? "bg-indigo-600 text-white rounded-tr-none px-6" 
                            : "bg-white border border-gray-100 text-gray-800 rounded-tl-none px-6"
                         )}>
                           {msg.content}
                           
                           {msg.content.includes('```') && msg.role === 'assistant' && (
                             <button 
                              onClick={() => {
                                const parts = msg.content.split('```');
                                const codeBlock = parts[1];
                                const lines = codeBlock.split('\n');
                                const language = lines[0].trim();
                                const content = lines.slice(1).join('\n').trim();
                                
                                setActiveArtifact({
                                  id: Math.random().toString(),
                                  title: language ? `${language.toUpperCase()} Component` : "System Logic",
                                  content: content,
                                  type: 'code',
                                  language: language || 'text',
                                  version: 1,
                                  status: 'ready'
                                });
                                setIsArtifactPanelOpen(true);
                                setArtifactActiveTab('code');
                              }}
                              className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 text-indigo-500 rounded-xl text-[10px] font-bold hover:bg-indigo-500 hover:text-white transition-all uppercase tracking-widest border border-indigo-500/20 group/artifact"
                             >
                              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse group-hover/artifact:bg-white" />
                              预览构件 (v1.0)
                             </button>
                           )}
                         </div>
                      </div>
                    </motion.div>
                  ))
                )}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-6"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white text-indigo-600 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm font-bold text-xs">
                      Æ
                    </div>
                    <div className="flex gap-1 items-center bg-white border border-gray-100 px-4 py-2 rounded-2xl shadow-sm">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-75"></span>
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} className="h-10" />
            </div>
          </div>

          <div className={cn(
            "pb-8 pt-2 transition-all duration-500 px-4 flex flex-col items-center",
            isArtifactPanelOpen ? "w-full" : "w-full max-w-3xl mx-auto"
          )}>
            <div className={cn(
              "bg-white rounded-3xl shadow-2xl shadow-black/5 border border-gray-100 overflow-hidden relative transition-all duration-500",
              isArtifactPanelOpen ? "w-full max-w-2xl" : "w-full"
            )}>
              <form onSubmit={handleSend} className="flex flex-col">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  placeholder="键入任何问题或指令..."
                  className="w-full px-6 pt-6 pb-2 bg-transparent outline-none resize-none min-h-[80px] max-h-[300px] text-sm text-gray-700 leading-relaxed"
                  rows={1}
                />
                <div className="flex items-center justify-between px-4 pb-4">
                  <div className="flex items-center gap-1">
                    <button type="button" className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <div className="h-4 w-[1px] bg-gray-100 mx-1"></div>
                    <button type="button" className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all uppercase tracking-widest">
                      <Zap className="w-3 h-3" />
                       Flash
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                     <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg border border-gray-100 text-[10px] font-bold text-gray-400">
                       <Settings className="w-3 h-3" />
                       {currentModel?.provider || 'Native'}
                     </div>
                     <button
                      type="submit"
                      disabled={!input.trim() || isTyping}
                      className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 disabled:opacity-30 transition-all active:scale-90 shadow-lg shadow-indigo-200"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-4 font-medium italic">
              灵境 Artifacts 已就绪 • 就地迭代代码与可视化
            </p>
          </div>
        </div>

        <AnimatePresence>
          {isArtifactPanelOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="h-full bg-white border-l border-gray-200 z-30 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.02)]"
              style={{ width: `${panelWidth}%` }}
            >
              <div className="h-14 flex items-center justify-between px-6 border-b border-gray-100 shrink-0 bg-white/80 backdrop-blur-lg">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 tracking-tight">{activeArtifact?.title}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Workspace v{activeArtifact?.version}.0</p>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span className="text-[9px] text-indigo-500 font-bold uppercase tracking-tighter">Ready</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button 
                    onClick={() => setArtifactActiveTab('preview')}
                    className={cn(
                      "px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all",
                      artifactActiveTab === 'preview' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    预览
                  </button>
                  <button 
                    onClick={() => setArtifactActiveTab('code')}
                    className={cn(
                      "px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all",
                      artifactActiveTab === 'code' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    代码
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-all">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-all">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-[1px] h-4 bg-gray-100 mx-1" />
                  <button 
                    onClick={() => setIsArtifactPanelOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col bg-[#fafafa]">
                <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                  <div className="max-w-4xl mx-auto">
                    {artifactActiveTab === 'code' ? (
                      <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl relative group">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <div className="px-2 py-1 bg-white/10 backdrop-blur-md rounded text-[9px] font-bold text-white/50 uppercase tracking-widest">
                             {activeArtifact?.language || 'code'}
                           </div>
                        </div>
                        <pre className="p-8 text-xs font-mono text-gray-100 leading-relaxed overflow-x-auto">
                          <code>{activeArtifact?.content}</code>
                        </pre>
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col relative">
                        {/* Browser Header Mock */}
                        <div className="h-10 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-2">
                          <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 bg-red-400 rounded-full" />
                            <div className="w-2.5 h-2.5 bg-amber-400 rounded-full" />
                            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full" />
                          </div>
                          <div className="flex-1 max-w-sm mx-auto h-6 bg-white border border-gray-200 rounded-md flex items-center px-3 gap-2">
                            <Globe2 className="w-2.5 h-2.5 text-gray-300" />
                            <div className="text-[9px] text-gray-400 truncate">preview.aether.ai/artifact/{activeArtifact?.id}</div>
                          </div>
                        </div>

                        {/* Rendering Area */}
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                          <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-indigo-100 animate-pulse">
                            <Eye className="w-10 h-10" />
                          </div>
                          <h4 className="text-gray-900 font-bold text-lg mb-2">构件渲染完成</h4>
                          <p className="text-gray-500 text-xs max-w-xs leading-relaxed mb-10">
                            正在为您提供多态化的可视化输出。在该预览模式下，您可以直接查看代码的运行效果与交互逻辑。
                          </p>
                          
                          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                             <div className="p-4 bg-white rounded-2xl border border-gray-100 text-left hover:border-indigo-500 transition-all cursor-pointer">
                               <p className="text-[9px] font-bold text-gray-400 uppercase mb-2">Inspector</p>
                               <p className="text-xs font-bold text-gray-800">查看节点树</p>
                             </div>
                             <div className="p-4 bg-white rounded-2xl border border-gray-100 text-left hover:border-indigo-500 transition-all cursor-pointer">
                               <p className="text-[9px] font-bold text-gray-400 uppercase mb-2">Network</p>
                               <p className="text-xs font-bold text-gray-800">请求监控</p>
                             </div>
                          </div>
                        </div>

                        {/* Bottom Bar */}
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                           <div className="flex items-center gap-2">
                             <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                             <span className="text-[9px] font-bold text-gray-500 uppercase">Live Preview Active</span>
                           </div>
                           <button className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold shadow-lg shadow-indigo-100">
                             部署预览
                           </button>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-8 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                       <h5 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> 智能体见解
                       </h5>
                       <p className="text-xs text-indigo-900/70 leading-relaxed font-medium italic">
                        这是基于 Aether 构件标准生成的逻辑片段。您可以直接复制该片段到您的本地工作区，或在此处继续要求我进行细化微调。
                       </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="absolute inset-0 bg-black/5 backdrop-blur-[2px] z-20"
              />
              <motion.div
                initial={{ x: 400 }}
                animate={{ x: 0 }}
                exit={{ x: 400 }}
                className="absolute right-4 top-14 bottom-4 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 z-30 p-6 flex flex-col overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-gray-900 tracking-tight flex items-center gap-2 text-lg">
                    <Settings className="w-5 h-5 text-indigo-600" />
                    配置中心
                  </h3>
                  <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400">
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <Layers className="w-3 h-3" /> 推理引擎选择
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {models.map(m => (
                        <button
                          key={m.id}
                          onClick={() => updateConfig({ modelId: m.id })}
                          className={cn(
                            "w-full text-left p-3 rounded-xl border text-xs font-bold transition-all",
                            config.modelId === m.id 
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" 
                              : "bg-white border-gray-100 text-gray-600 hover:border-indigo-600"
                          )}
                        >
                          {m.name}
                          <div className={cn("text-[9px] mt-0.5", config.modelId === m.id ? "text-indigo-100" : "text-gray-400")}>
                            {m.provider}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">路由策略：灵境动态均衡</span>
                    </div>
                    <p className="text-[10px] text-indigo-500/80 leading-relaxed font-medium">
                      内置 Aether 策略将根据任务复杂度自动在模型间分配 Token，确保在成本与质量间达到最优平衡。
                    </p>
                  </div>

                  <div>
                     <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">扩展工具 (Tools)</label>
                     <div className="space-y-2">
                       {[
                         { name: 'Web Search', icon: Globe, label: '全球搜索' },
                         { name: 'File System MCP', icon: FolderTree, label: '文件存取' },
                         { name: 'Code Interpreter', icon: Code, label: '代码执行' }
                       ].map(tool => (
                         <label key={tool.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer">
                           <input 
                            type="checkbox"
                            checked={config.tools.includes(tool.name)}
                            onChange={(e) => {
                              if (e.target.checked) updateConfig({ tools: [...config.tools, tool.name] });
                              else updateConfig({ tools: config.tools.filter(t => t !== tool.name) });
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
                           />
                           <tool.icon className="w-4 h-4 text-gray-400" />
                           <span className="text-xs font-bold text-gray-600">{tool.label}</span>
                         </label>
                       ))}
                     </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
