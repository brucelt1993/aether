import React, { useState } from 'react';
import { useModels, Model } from '../hooks/useModels';
import { Key, Plus, Trash2, Edit2, Settings, ChevronDown, ChevronUp, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface ModelsPageProps {
  embedMode?: boolean;
}

export const ModelsPage = ({ embedMode = false }: ModelsPageProps) => {
  const { models, loading, addModel, updateModel, deleteModel } = useModels();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    provider: 'Custom' as Model['provider'],
    apiKey: '',
    baseUrl: '',
    parameters: {
      temperature: 0.7,
      maxTokens: 4096,
      topP: 0.9,
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateModel(editingId, formData);
      setEditingId(null);
    } else {
      await addModel(formData);
      setIsAdding(false);
    }
    setFormData({
      name: '',
      description: '',
      provider: 'Custom',
      apiKey: '',
      baseUrl: '',
      parameters: { temperature: 0.7, maxTokens: 4096, topP: 0.9 }
    });
  };

  const startEdit = (model: Model) => {
    setEditingId(model.id);
    setFormData({
      name: model.name,
      description: model.description || '',
      provider: model.provider,
      apiKey: model.apiKey,
      baseUrl: model.baseUrl || '',
      parameters: model.parameters
    });
    setIsAdding(true);
  };

  return (
    <div className={cn("mx-auto", embedMode ? "w-full" : "p-8 max-w-5xl")}>
      {!embedMode && (
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Key className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">核心模型配置</h1>
          </div>
          <p className="text-gray-500">配置主流及私有 LLM 的 API 密钥，以便在工作流中使用它们。</p>
        </header>
      )}

      {embedMode && (
        <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
          <div>
             <h4 className="text-white font-bold text-lg tracking-tight">模型引擎集</h4>
             <p className="text-gray-500 text-xs">通过 API 密钥连接外部高性能推理中心</p>
          </div>
          <button
            onClick={() => {
              setIsAdding(!isAdding);
              setEditingId(null);
            }}
            className="bg-indigo-600 text-white px-4 py-1.5 rounded-xl font-bold text-[11px] hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            {isAdding ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            添加模型
          </button>
        </div>
      )}

      <AnimatePresence>
        {(isAdding || editingId) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-10 overflow-hidden"
          >
            <form onSubmit={handleSubmit} className={cn(
              "rounded-2xl p-8 border",
              embedMode 
                ? "bg-[#1a1a1a] border-white/10 shadow-2xl" 
                : "bg-white border-blue-100 shadow-sm"
            )}>
              <h2 className={cn("text-lg font-bold mb-6", embedMode ? "text-white" : "text-gray-900")}>
                {editingId ? '编辑模型' : '新建模型引擎'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="md:col-span-1">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">引擎名称</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="例如：Gemini 2.0 Pro"
                    className={cn(
                      "w-full px-4 py-2 rounded-xl text-sm font-bold outline-none transition-all",
                      embedMode ? "bg-[#0d0d0d] border border-white/5 text-white focus:border-indigo-500" : "border border-gray-200"
                    )}
                  />
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">供应商 (Provider)</label>
                   <select 
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value as any })}
                    className={cn(
                      "w-full px-4 py-2 rounded-xl text-sm font-bold outline-none transition-all appearance-none",
                      embedMode ? "bg-[#0d0d0d] border border-white/5 text-white focus:border-indigo-500" : "border border-gray-200"
                    )}
                   >
                     <option value="Google">Google</option>
                     <option value="OpenAI">OpenAI</option>
                     <option value="DeepSeek">DeepSeek</option>
                     <option value="Anthropic">Anthropic</option>
                     <option value="Custom">Custom (OpenAI Compatible)</option>
                   </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">API 密钥 (Secrets)</label>
                  <input
                    type="password"
                    required
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    placeholder="在此输入您的密钥（将进行安全存储）"
                    className={cn(
                      "w-full px-4 py-2 rounded-xl text-xs font-mono outline-none transition-all",
                      embedMode ? "bg-[#0d0d0d] border border-white/5 text-white focus:border-indigo-500" : "border border-gray-200"
                    )}
                  />
                </div>
              </div>

              <div className={cn(
                "rounded-2xl p-6 border",
                embedMode ? "bg-[#0d0d0d] border-white/5" : "bg-gray-50 border-gray-100"
              )}>
                <p className="text-[10px] font-bold text-indigo-400 flex items-center gap-2 mb-6 uppercase tracking-[0.2em]">
                  <Settings className="w-3.5 h-3.5" /> 核心性能参数
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">API 基准地址 (Base URL)</label>
                    <input
                      type="text"
                      value={formData.baseUrl}
                      onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                      placeholder="https://api.example.com/v1"
                      className={cn(
                        "w-full px-4 py-2 rounded-xl text-xs outline-none transition-all",
                        embedMode ? "bg-[#1a1a1a] border border-white/5 text-gray-300 focus:border-indigo-500" : "bg-white border border-gray-200"
                      )}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      <span>推理温度控制 (Temp)</span>
                      <span className="text-indigo-400">{formData.parameters.temperature}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={formData.parameters.temperature}
                      onChange={(e) => setFormData({ ...formData, parameters: { ...formData.parameters, temperature: parseFloat(e.target.value) } })}
                      className="w-full h-1.5 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                  <div>
                     <div className="flex justify-between mb-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                       <span>采样平衡 (Top P)</span>
                       <span className="text-indigo-400">{formData.parameters.topP}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={formData.parameters.topP}
                      onChange={(e) => setFormData({ ...formData, parameters: { ...formData.parameters, topP: parseFloat(e.target.value) } })}
                      className="w-full h-1.5 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="submit"
                  className={cn(
                    "px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all",
                    embedMode ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20" : "bg-blue-600 text-white hover:bg-blue-700"
                  )}
                >
                  <Save className="w-4 h-4" />
                  保存并同步
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
                  取消
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="py-20 text-center text-gray-500 text-sm animate-pulse">正在握手推理节点...</div>
        ) : models.length === 0 ? (
          <div className={cn(
            "py-20 text-center border-2 border-dashed rounded-2xl text-xs",
            embedMode ? "border-white/5 text-gray-600" : "border-gray-200 text-gray-400"
          )}>
            无可用的模型连接，建议从主流厂商开始添加。
          </div>
        ) : (
          models.map((model) => (
            <motion.div
              layout
              key={model.id}
              className={cn(
                "rounded-2xl p-6 transition-all flex items-center gap-6 border group",
                embedMode ? "bg-[#141414] border-white/5 hover:border-white/10" : "bg-white border-gray-100"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                embedMode ? "bg-[#0d0d0d] text-indigo-500 shadow-inner" : "bg-gray-50 text-gray-400"
              )}>
                <Key className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={cn("font-bold text-sm tracking-tight flex items-center gap-2", embedMode ? "text-white" : "text-gray-900")}>
                  {model.name}
                  <span className={cn(
                    "text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest",
                    embedMode ? "bg-indigo-500/10 text-indigo-400" : "bg-gray-100 text-gray-500"
                  )}>{model.provider}</span>
                </h3>
                <p className="text-xs text-gray-500 truncate mt-0.5">{model.description || '自动发现的推理节点'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEdit(model)}
                  className="p-2 text-gray-500 hover:text-indigo-400 hover:bg-white/5 rounded-lg transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteModel(model.id)}
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
