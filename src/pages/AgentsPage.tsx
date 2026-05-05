import React from 'react';
import { Bot, Plus, Search, MoreVertical, Zap, MessageSquare, Code, Globe, Shield, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

const MOCK_AGENTS = [
  {
    id: '1',
    name: '架构师 Aether',
    description: '精通分布式系统设计，提供深度的技术方案评审',
    model: 'Gemini 1.5 Pro',
    tags: ['架构设计', '后端'],
    icon: Code,
    active: true
  },
  {
    id: '2',
    name: '创意文案专家',
    description: '通过灵感算法生成具有冲击力的营销文案与视觉脚本',
    model: 'Gemini 1.5 Flash',
    tags: ['创意', '营销'],
    icon: Zap,
    active: true
  },
  {
    id: '3',
    name: '代码审计官',
    description: '自动化扫描安全风险并提供修复建议的智能代码专家',
    model: 'Gemini 1.5 Pro',
    tags: ['代码审计', '安全'],
    icon: Shield,
    active: false
  }
];

export const AgentsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 bg-[#fafafa] flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="h-16 px-8 flex items-center justify-between bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900 tracking-tight italic">智能体管理</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Agent Orchestration</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group/search">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within/search:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="搜索智能体..."
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 transition-all w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95">
            <Plus className="w-3.5 h-3.5" />
            新建智能体
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-8 scrollbar-hide">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Banner */}
          <div className="mb-10 p-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2 italic">欢迎来到智能体工坊</h2>
              <p className="text-indigo-100 text-xs max-w-lg leading-relaxed font-medium">
                在这里，您可以构建具备核心能力的智能体。通过挂载不同的技能（Skills）和配置专属模型，让它们在特定领域展现卓越表现。
              </p>
            </div>
            <Sparkles className="absolute right-[-20px] top-[-20px] w-64 h-64 text-white/10 rotate-12" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_AGENTS.map((agent, i) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white border border-gray-100 rounded-[1.5rem] p-6 hover:shadow-2xl hover:shadow-black/5 hover:border-indigo-500/20 transition-all cursor-pointer relative"
                onClick={() => navigate('/chat')}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    "p-3 rounded-2xl",
                    agent.id === '1' ? "bg-indigo-50 text-indigo-600" :
                    agent.id === '2' ? "bg-amber-50 text-amber-600" :
                    "bg-emerald-50 text-emerald-600"
                  )}>
                    <agent.icon className="w-6 h-6" />
                  </div>
                  <button className="p-2 text-gray-300 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{agent.name}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{agent.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {agent.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-50 text-gray-400 rounded text-[9px] font-bold uppercase tracking-widest border border-gray-100">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center">
                         <Zap className="w-2.5 h-2.5 text-gray-400" />
                       </div>
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{agent.model}</span>
                    </div>
                    <button className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                      <MessageSquare className="w-3.5 h-3.5" />
                      开始对话
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Create Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="border-2 border-dashed border-gray-200 rounded-[1.5rem] p-6 flex flex-col items-center justify-center text-center group hover:border-indigo-500/40 hover:bg-indigo-50/50 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-4 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold text-gray-400 group-hover:text-indigo-600 transition-colors">创建自定义智能体</h3>
              <p className="text-[10px] text-gray-400 mt-1 max-w-[150px]">定制模型提示词与挂载工具集</p>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};
