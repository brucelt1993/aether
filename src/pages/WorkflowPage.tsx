import React, { useState } from 'react';
import { useWorkflows, Workflow } from '../hooks/useWorkflows';
import { GitFork, Plus, Trash2, Edit2, Save, X, LayoutGrid, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WorkflowCanvas } from '../components/WorkflowCanvas';

export const WorkflowPage = () => {
  const { workflows, loading, addWorkflow, updateWorkflow, deleteWorkflow } = useWorkflows();
  const [isAdding, setIsAdding] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addWorkflow({
      ...formData,
      nodes: [],
      edges: [],
    });
    setIsAdding(false);
    setFormData({ name: '', description: '' });
  };

  const handleCanvasSave = async (nodes: any[], edges: any[]) => {
    if (editingWorkflow) {
      await updateWorkflow(editingWorkflow.id, { nodes, edges });
      setEditingWorkflow(null);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="flex justify-between items-start mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <GitFork className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 italic">工作流</h1>
          </div>
          <p className="text-gray-500 font-medium">使用可视化画布节点编排复杂的逻辑。</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? '取消' : '新建工作流'}
        </button>
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-8"
          >
            <form onSubmit={handleSubmit} className="bg-white border border-indigo-100 rounded-2xl p-8 shadow-sm">
              <h2 className="text-lg font-bold mb-6">初始化新工作流</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">名称</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="例如：内容生成流水线"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">描述</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="该工作流的简要目标..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all"
              >
                创建并启动编辑器
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 py-20 text-center text-gray-400">正在加载工作流...</div>
        ) : workflows.length === 0 ? (
          <div className="col-span-2 py-20 text-center border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
            暂未定义工作流。
          </div>
        ) : (
          workflows.map((wf) => (
            <motion.div
              layout
              key={wf.id}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors">{wf.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{wf.description || '无描述'}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                    onClick={() => deleteWorkflow(wf.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <LayoutGrid className="w-3 h-3" />
                  {(wf.nodes || []).length} 个节点
                </div>
                <button
                  onClick={() => setEditingWorkflow(wf)}
                  className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-bold text-xs hover:bg-indigo-600 hover:text-white transition-all"
                >
                  <Maximize2 className="w-3 h-3" />
                  打开画布
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {editingWorkflow && (
          <WorkflowCanvas
            name={editingWorkflow.name}
            initialNodes={editingWorkflow.nodes || []}
            initialEdges={editingWorkflow.edges || []}
            onSave={handleCanvasSave}
            onClose={() => setEditingWorkflow(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
