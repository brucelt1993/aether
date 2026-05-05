import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  User, 
  Palette, 
  Bell, 
  Brain, 
  Lightbulb, 
  Key, 
  Shield, 
  Terminal,
  Globe2,
  FolderTree,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { SkillsPage } from '../pages/SkillsPage';
import { ModelsPage } from '../pages/ModelsPage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState('skills');

  const tabs = [
    { id: 'account', label: '账户信息', icon: User },
    { id: 'appearance', label: '界面外观', icon: Palette },
    { id: 'skills', label: '技能库', icon: Lightbulb },
    { id: 'models', label: '核心模型', icon: Key },
    { id: 'tools', label: 'MCP 工具', icon: Terminal },
    { id: 'privacy', label: '隐私安全', icon: Shield },
    { id: 'about', label: '关于灵境', icon: Globe2 },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl h-[80vh] bg-[#1a1a1a] rounded-3xl border border-white/10 shadow-2xl flex overflow-hidden lg:flex-row flex-col"
        >
          {/* Header for Mobile */}
          <div className="lg:hidden p-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-white font-bold">设置中心</h2>
            <button onClick={onClose} className="p-2 text-gray-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Left Sidebar */}
          <div className="w-full lg:w-64 bg-[#141414] border-r border-white/5 flex flex-col p-4 shrink-0 overflow-y-auto lg:overflow-visible">
            <div className="hidden lg:flex items-center gap-3 px-4 py-6 mb-4">
              <Settings className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-bold text-white tracking-tight">综合设置</h2>
            </div>

            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                    activeTab === tab.id
                      ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10"
                      : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                  )}
                >
                  <tab.icon className={cn(
                    "w-4 h-4 shrink-0",
                    activeTab === tab.id ? "text-indigo-400" : "text-gray-500 group-hover:text-gray-400"
                  )} />
                  <span className="flex-1 text-left">{tab.label}</span>
                  {activeTab === tab.id && <motion.div layoutId="setting-active" className="w-1 h-4 bg-indigo-500 rounded-full" />}
                </button>
              ))}
            </nav>

            <div className="mt-auto hidden lg:block pt-8 px-4">
              <div className="p-4 bg-indigo-600/10 rounded-2xl border border-indigo-500/20">
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">PRO 计划已启用</p>
                <p className="text-[10px] text-gray-500 leading-relaxed font-medium">无限制访问 DeepSeek-V3 与 Aether 路由中心。</p>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 flex flex-col bg-[#0d0d0d] overflow-hidden">
            <header className="hidden lg:flex items-center justify-between px-8 py-6 border-b border-white/5">
              <h3 className="text-xl font-bold text-white tracking-tight">
                {tabs.find(t => t.id === activeTab)?.label}
              </h3>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-xl transition-all text-gray-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  {activeTab === 'skills' && (
                    <div className="h-full">
                      <SkillsPage embedMode />
                    </div>
                  )}
                  {activeTab === 'models' && (
                    <div className="h-full">
                      <ModelsPage embedMode />
                    </div>
                  )}
                  {activeTab === 'tools' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div>
                        <h4 className="text-white font-bold text-lg mb-2">模型能力增强 (MCP)</h4>
                        <p className="text-gray-500 text-xs mb-6">让智能体连接实时工具，跨越模型知识边界。</p>
                        
                        <div className="grid grid-cols-1 gap-3">
                          {[
                            { id: 'search', name: 'Web Search', desc: '实时网页搜索与信息检索', icon: Globe2, enabled: true },
                            { id: 'code', name: 'Code Interpreter', desc: '在隔离沙箱中执行 Python/JS 代码', icon: Terminal, enabled: true },
                            { id: 'file', name: 'File System MCP', desc: '读写本地/云端文件系统权限', icon: FolderTree, enabled: false },
                          ].map(tool => (
                            <div key={tool.id} className="p-4 bg-[#141414] border border-white/5 rounded-2xl flex items-center gap-4 group hover:border-indigo-500/30 transition-all">
                              <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center",
                                tool.enabled ? "bg-indigo-500/10 text-indigo-400" : "bg-gray-800 text-gray-500"
                              )}>
                                <tool.icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-white">{tool.name}</span>
                                  {tool.enabled && <span className="text-[8px] bg-indigo-500 text-white px-1 rounded uppercase tracking-tighter">Active</span>}
                                </div>
                                <p className="text-[10px] text-gray-500">{tool.desc}</p>
                              </div>
                              <button className={cn(
                                "px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                                tool.enabled ? "bg-white/10 text-white hover:bg-white/20" : "bg-indigo-600 text-white hover:bg-indigo-700"
                              )}>
                                {tool.enabled ? '配置参数' : '立即安装'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-8 border-t border-white/5">
                         <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                            <div>
                               <p className="text-xs font-bold text-white mb-1">MCP 开发者模式</p>
                               <p className="text-[10px] text-gray-500">连接您本地运行的 MCP Server 接口</p>
                            </div>
                            <div className="w-10 h-5 bg-indigo-600/20 rounded-full flex items-center px-1">
                               <div className="w-3 h-3 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/50 translate-x-5"></div>
                            </div>
                         </div>
                      </div>
                    </div>
                  )}
                  {activeTab === 'appearance' && (
                     <div className="space-y-8">
                       <div>
                         <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">界面主题</p>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           {['System', 'Light', 'Dark'].map(theme => (
                             <div key={theme} className="group cursor-pointer">
                               <div className="aspect-[16/10] bg-[#1a1a1a] border-2 border-white/5 rounded-2xl mb-3 overflow-hidden group-hover:border-indigo-500 transition-all flex items-center justify-center p-4">
                                  <div className="w-full h-full bg-[#0d0d0d] rounded-lg border border-white/10 p-3">
                                     <div className="w-1/2 h-2 bg-white/10 rounded-full mb-2"></div>
                                     <div className="w-full h-2 bg-white/5 rounded-full mb-2"></div>
                                     <div className="w-3/4 h-2 bg-white/5 rounded-full"></div>
                                  </div>
                               </div>
                               <p className="text-sm font-bold text-center text-gray-400 group-hover:text-white transition-colors">{theme}</p>
                             </div>
                           ))}
                         </div>
                       </div>
                       
                       <div className="pt-8 border-t border-white/5">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">默认语言 (Language)</p>
                          <select className="w-full bg-[#1a1a1a] border border-white/10 text-white rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-bold appearance-none">
                            <option>简体中文</option>
                            <option>English</option>
                            <option>日本語</option>
                          </select>
                       </div>
                     </div>
                  )}
                  {activeTab === 'account' && (
                    <div className="flex flex-col items-center justify-center h-full text-center py-10">
                      <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2.5rem] flex items-center justify-center text-white mb-6 shadow-2xl shadow-indigo-500/20">
                        <User className="w-12 h-12" />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">灵境专家用户</h4>
                      <p className="text-gray-500 text-sm max-w-xs mb-8">管理您的个人资料、订阅计划以及数据同步设置。</p>
                      <button className="px-8 py-3 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-95 text-sm">
                        管理个人资料
                      </button>
                    </div>
                  )}
                  {!['skills', 'models', 'appearance', 'account'].includes(activeTab) && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                       <p className="text-gray-500 text-sm font-medium">该功能板块正在建设中...</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
