import React, { useState } from 'react';
import { useSkills, Skill } from '../hooks/useSkills';
import { Lightbulb, Plus, Trash2, Edit2, Save, X, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface SkillsPageProps {
  embedMode?: boolean;
}

export const SkillsPage = ({ embedMode = false }: SkillsPageProps) => {
  const { skills, loading, addSkill, updateSkill, deleteSkill } = useSkills();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    systemPrompt: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateSkill(editingId, formData);
      setEditingId(null);
    } else {
      await addSkill(formData);
      setIsAdding(false);
    }
    setFormData({ title: '', description: '', systemPrompt: '' });
  };

  const startEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setFormData({
      title: skill.title,
      description: skill.description || '',
      systemPrompt: skill.systemPrompt,
    });
    setIsAdding(true);
  };

  return (
    <div className={cn("mx-auto", embedMode ? "w-full" : "p-8 max-w-5xl")}>
      {!embedMode && (
        <header className="flex justify-between items-start mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">技能库</h1>
            </div>
            <p className="text-gray-500">将系统提示词和指令配置为可复用的技能模块。</p>
          </div>
          <button
            onClick={() => {
              setIsAdding(!isAdding);
              setEditingId(null);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
          >
            {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isAdding ? '取消' : '创建技能'}
          </button>
        </header>
      )}

      {embedMode && (
        <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
          <div>
             <h4 className="text-white font-bold text-lg tracking-tight">自定义技能</h4>
             <p className="text-gray-500 text-xs">通过提示词工程定义特定任务的执行逻辑</p>
          </div>
          <button
            onClick={() => {
              setIsAdding(!isAdding);
              setEditingId(null);
            }}
            className="bg-indigo-600 text-white px-4 py-1.5 rounded-xl font-bold text-[11px] hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            {isAdding ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            添加技能
          </button>
        </div>
      )}

      <AnimatePresence>
        {(isAdding || editingId) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-10"
          >
            <form onSubmit={handleSubmit} className={cn(
              "rounded-2xl p-8 border",
              embedMode 
                ? "bg-[#1a1a1a] border-white/10 shadow-2xl" 
                : "bg-white border-gray-200 shadow-sm"
            )}>
              <h2 className={cn("text-lg font-bold mb-6", embedMode ? "text-white" : "text-gray-900")}>
                {editingId ? '编辑技能' : '创建新技能'}
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">技能名称</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="例如：写作助手"
                    className={cn(
                      "w-full px-4 py-2 rounded-xl outline-none transition-all text-sm font-bold",
                      embedMode 
                        ? "bg-[#0d0d0d] border border-white/5 text-white focus:border-indigo-500" 
                        : "border border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500"
                    )}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">描述</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="一句话描述该技能用途..."
                    className={cn(
                      "w-full px-4 py-2 rounded-xl outline-none transition-all text-sm",
                      embedMode 
                        ? "bg-[#0d0d0d] border border-white/5 text-white focus:border-indigo-500" 
                        : "border border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500"
                    )}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">系统提示词 (System Prompt)</label>
                  <textarea
                    required
                    rows={8}
                    value={formData.systemPrompt}
                    onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                    placeholder="输入详细的系统指令集..."
                    className={cn(
                      "w-full px-4 py-2 rounded-xl outline-none transition-all font-mono text-xs leading-relaxed",
                      embedMode 
                        ? "bg-[#0d0d0d] border border-white/5 text-white focus:border-indigo-500" 
                        : "border border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500"
                    )}
                  />
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button
                  type="submit"
                  className={cn(
                    "px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all",
                    embedMode ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-blue-600 text-white hover:bg-blue-700"
                  )}
                >
                  <Save className="w-4 h-4" /> 保存并应用
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                  }}
                  className={cn(
                    "px-8 py-2.5 rounded-xl font-bold transition-all",
                    embedMode ? "text-gray-400 hover:bg-white/5" : "text-gray-500 hover:bg-gray-100"
                  )}
                >
                  放弃更改
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="py-20 text-center text-gray-500 text-sm animate-pulse">正在同步云端库...</div>
        ) : skills.length === 0 ? (
          <div className={cn(
            "py-20 text-center border-2 border-dashed rounded-2xl text-xs",
            embedMode ? "border-white/5 text-gray-600" : "border-gray-200 text-gray-400"
          )}>
            技能库暂无数据。点击“添加技能”开始构建您的能力矩阵。
          </div>
        ) : (
          skills.map((skill) => (
            <motion.div
              layout
              key={skill.id}
              className={cn(
                "rounded-2xl overflow-hidden shadow-sm transition-all group border",
                embedMode 
                  ? "bg-[#141414] border-white/5 hover:border-white/10" 
                  : "bg-white border-gray-100 hover:shadow-md"
              )}
            >
              <div className="p-6 border-b border-white/5 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className={cn("font-bold text-base truncate", embedMode ? "text-white" : "text-gray-900")}>{skill.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{skill.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(skill)}
                    className="p-2 text-gray-500 hover:text-indigo-400 hover:bg-white/5 rounded-lg transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteSkill(skill.id)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className={cn("p-6", embedMode ? "bg-[#1a1a1a]/40" : "bg-gray-50")}>
                <div className="flex items-center gap-2 text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                  <Terminal className="w-3 h-3" /> 核心指令集
                </div>
                <div className={cn(
                  "rounded-xl p-4 font-mono text-[11px] whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto scrollbar-hide border",
                  embedMode ? "bg-[#0d0d0d] border-white/5 text-gray-400" : "bg-white border-gray-200 text-gray-600"
                )}>
                  {skill.systemPrompt}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
