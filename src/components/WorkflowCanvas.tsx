import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Handle,
  Position,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useSkills } from '../hooks/useSkills';
import { Lightbulb, Save, X, Plus, Play, GitBranch, Share } from 'lucide-react';

const StartNode = () => (
  <div className="px-4 py-3 shadow-xl rounded-xl bg-green-50 border-2 border-green-500 w-48 overflow-hidden">
    <div className="flex items-center gap-2 mb-1">
      <Play className="w-4 h-4 text-green-600 fill-green-600" />
      <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">触发节点</span>
    </div>
    <div className="text-sm font-bold text-gray-800">外部请求 / 手动启动</div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-green-500" />
  </div>
);

const LogicNode = ({ data }: any) => (
  <div className="px-4 py-3 shadow-xl rounded-xl bg-orange-50 border-2 border-orange-500 w-48">
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-orange-500" />
    <div className="flex items-center gap-2 mb-1">
      <GitBranch className="w-4 h-4 text-orange-600" />
      <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">判定节点</span>
    </div>
    <div className="text-sm font-bold text-gray-800">{data.label || '条件过滤'}</div>
    <div className="flex justify-between mt-4">
      <div className="relative">
        <Handle type="source" position={Position.Bottom} id="true" className="w-3 h-3 bg-green-500" />
        <span className="text-[8px] font-bold text-green-600 absolute -bottom-4 left-0">TRUE</span>
      </div>
      <div className="relative">
        <Handle type="source" position={Position.Bottom} id="false" className="w-3 h-3 bg-red-500" />
        <span className="text-[8px] font-bold text-red-600 absolute -bottom-4 right-0">FALSE</span>
      </div>
    </div>
  </div>
);

const SkillNode = ({ data }: any) => (
  <div className="px-4 py-3 shadow-xl rounded-xl bg-white border-2 border-indigo-500 w-48">
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-indigo-500" />
    <div className="flex items-center gap-2 mb-1">
      <Lightbulb className="w-4 h-4 text-indigo-500" />
      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">技能节点</span>
    </div>
    <div className="text-sm font-bold text-gray-800 truncate">{data.label}</div>
    <div className="text-[10px] text-gray-400 mt-1 line-clamp-2">{data.description}</div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-indigo-500" />
  </div>
);

const OutputNode = () => (
  <div className="px-4 py-3 shadow-xl rounded-xl bg-blue-50 border-2 border-blue-500 w-48">
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500" />
    <div className="flex items-center gap-2 mb-1">
      <Share className="w-4 h-4 text-blue-600" />
      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">输出节点</span>
    </div>
    <div className="text-sm font-bold text-gray-800">汇总结果并返回</div>
  </div>
);

const nodeTypes = {
  start: StartNode,
  skill: SkillNode,
  logic: LogicNode,
  output: OutputNode,
};

interface WorkflowCanvasProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onSave: (nodes: Node[], edges: Edge[]) => void;
  onClose: () => void;
  name: string;
}

export const WorkflowCanvas = ({ initialNodes = [], initialEdges = [], onSave, onClose, name }: WorkflowCanvasProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { skills } = useSkills();
  const [showPicker, setShowPicker] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = (type: string, data = {}) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 250, y: 250 },
      data,
    };
    setNodes((nds) => nds.concat(newNode));
    setShowPicker(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <header className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
          <div className="flex flex-col">
            <h2 className="font-bold text-gray-900 italic tracking-tight leading-none mb-1">
              {name}
            </h2>
            <div className="flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">可视化编辑器</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPicker(true)}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
          >
            <Plus className="w-4 h-4" /> 添加节点
          </button>
          <button
            onClick={() => onSave(nodes, edges)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-xs hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" /> 保存工作流
          </button>
        </div>
      </header>

      <div className="flex-1 relative bg-[#fafafa]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid
          snapGrid={[15, 15]}
        >
          <Background color="#e2e8f0" variant={BackgroundVariant.Dots} gap={20} />
          <Controls className="bg-white shadow-xl border-gray-100 rounded-lg overflow-hidden" />
          <MiniMap className="bg-white border-gray-100 shadow-xl rounded-lg overflow-hidden" />
        </ReactFlow>

        {showPicker && (
          <div className="absolute top-4 right-4 z-[100] w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[calc(100%-2rem)] overflow-hidden">
            <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <span className="font-bold text-sm text-gray-900 uppercase tracking-widest">节点选择器</span>
              <button 
                onClick={() => setShowPicker(false)}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-4 space-y-6">
              {/* Core Nodes */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">基础控制</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => addNode('start')} className="flex flex-col items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-100 hover:border-green-500 transition-all group">
                    <Play className="w-5 h-5 text-green-600" />
                    <span className="text-[10px] font-bold text-green-700">开始</span>
                  </button>
                  <button onClick={() => addNode('logic')} className="flex flex-col items-center gap-2 p-3 bg-orange-50 rounded-xl border border-orange-100 hover:border-orange-500 transition-all group">
                    <GitBranch className="w-5 h-5 text-orange-600" />
                    <span className="text-[10px] font-bold text-orange-700">逻辑</span>
                  </button>
                  <button onClick={() => addNode('output')} className="flex flex-col items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100 hover:border-blue-500 transition-all group">
                    <Share className="w-5 h-5 text-blue-600" />
                    <span className="text-[10px] font-bold text-blue-700">输出</span>
                  </button>
                </div>
              </div>

              {/* Skills */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">可用技能模块</p>
                <div className="space-y-2">
                  {skills.length === 0 ? (
                    <div className="p-4 text-center text-[11px] text-gray-400 border border-dashed border-gray-200 rounded-xl">
                      技能库为空，请先前往技能库创建。
                    </div>
                  ) : (
                    skills.map(skill => (
                      <button
                        key={skill.id}
                        onClick={() => addNode('skill', { label: skill.title, description: skill.description, skillId: skill.id })}
                        className="w-full text-left p-3 hover:bg-indigo-50 rounded-xl flex items-center gap-3 transition-colors border border-transparent hover:border-indigo-200 group"
                      >
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg group-hover:scale-110 transition-transform">
                          <Lightbulb className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-gray-800 truncate">{skill.title}</div>
                          <div className="text-[10px] text-gray-500 truncate">{skill.description}</div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
