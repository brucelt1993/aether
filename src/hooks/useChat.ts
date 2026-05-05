import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, getDocs } from 'firebase/firestore';
import { db, auth, OperationType, handleFirestoreError } from '../services/firebase';

export interface AgentConfig {
  modelId: string;
  skillId: string;
  temperature: number;
  topP: number;
  tools: string[];
}

export const useAgentConfig = () => {
  const [config, setConfig] = useState<AgentConfig>({
    modelId: '',
    skillId: '',
    temperature: 0.7,
    topP: 0.9,
    tools: ['Web Search', 'File System MCP']
  });

  const updateConfig = (updates: Partial<AgentConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  return { config, updateConfig };
};

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: any;
}

export const useChat = (config: AgentConfig) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (content: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Mocking response logic for MVP
    // In a real app, this would use config.modelId and config.skillId to call the LLM
    setTimeout(() => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `我是您的专属智能体。我当前正在使用选定的模型配置和 "${config.skillId || '默认'}" 技能。请问还有什么我可以帮您的？`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return { messages, isTyping, sendMessage };
};
