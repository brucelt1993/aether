import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Bot, 
  GitFork, 
  Lightbulb, 
  Key, 
  LogOut, 
  User as UserIcon,
  MessageSquare,
  Plus,
  Settings,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Layers
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../services/firebase';
import { cn } from '../lib/utils';
import { SettingsModal } from './SettingsModal';

interface SidebarItemProps {
  to: string;
  icon: any;
  label: string;
  disabled?: boolean;
}

const SidebarItem = ({ to, icon: Icon, label, disabled }: SidebarItemProps) => (
  <NavLink
    to={disabled ? '#' : to}
    className={({ isActive }) => cn(
      "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group",
      isActive && !disabled
        ? "bg-white/10 text-white shadow-sm" 
        : "text-gray-400 hover:text-white hover:bg-white/5",
      disabled && "opacity-30 cursor-not-allowed"
    )}
  >
    <Icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", disabled ? "" : "text-gray-400 group-hover:text-white")} />
    <span className="truncate">{label}</span>
  </NavLink>
);

export const Sidebar = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <aside className={cn(
      "h-screen bg-[#0d0d0d] border-r border-white/5 flex flex-col transition-all duration-300 relative group/sidebar",
      collapsed ? "w-[72px]" : "w-[260px]"
    )}>
      {/* Brand & New Chat */}
      <div className="p-4 flex flex-col gap-4">
        <div className={cn("flex items-center gap-3 px-2 h-10", collapsed && "justify-center")}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-lg shadow-indigo-900/40">
            Æ
          </div>
          {!collapsed && (
            <span className="font-bold text-white italic tracking-tighter text-lg truncate uppercase">
              Aether <span className="text-indigo-500">靈境</span>
            </span>
          )}
        </div>

        <div className="px-1">
          <button className={cn(
            "w-full h-11 bg-white/5 hover:bg-white/10 text-white rounded-xl flex items-center gap-3 border border-white/10 transition-all active:scale-[0.98] group",
            collapsed ? "justify-center" : "px-4"
          )}>
            <Plus className="w-4 h-4" />
            {!collapsed && <span className="text-sm font-bold">新建对话</span>}
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 space-y-8 scrollbar-hide">
        <nav className="space-y-1">
          <SidebarItem to="/chat" icon={MessageSquare} label="对话" />
          <SidebarItem to="/agent" icon={Bot} label="智能体" />
          <SidebarItem to="/workflow" icon={GitFork} label="工作流" />
        </nav>

        {!collapsed && (
          <div className="animate-in fade-in slide-in-from-left-2 duration-500">
            <p className="px-3 text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-4">最近会话</p>
            <div className="space-y-1 px-1">
              {['系统架构讨论', '技能提示词优化', '灵境引擎入门'].map((item, i) => (
                <button 
                  key={i} 
                  className="w-full text-left px-3 py-2.5 text-xs text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all truncate border border-transparent hover:border-white/5 group/history"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-3 h-3 text-gray-600 group-hover/history:text-indigo-400 shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer User Info */}
      <div className="p-3 border-t border-white/5 bg-[#0d0d0d]">
        {user ? (
          <div 
            onClick={() => setIsSettingsOpen(true)}
            className={cn(
              "flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl transition-all cursor-pointer group",
              collapsed ? "justify-center" : "px-3"
            )}
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center ring-2 ring-white/10 overflow-hidden shrink-0 group-hover:ring-indigo-500 transition-all">
              {user.photoURL ? <img src={user.photoURL} alt="User" referrerPolicy="no-referrer" /> : <UserIcon className="w-4 h-4 text-white" />}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate group-hover:text-indigo-400 transition-colors">{user.displayName || '用户'}</p>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-gray-500 truncate group-hover:text-gray-400 transition-colors">设置与更多</p>
                  <Settings className="w-3 h-3 text-gray-600 group-hover:text-indigo-400 transition-colors" />
                </div>
              </div>
            )}
          </div>
        ) : (
          !collapsed && <div className="px-2 italic text-[10px] text-gray-600">未登录</div>
        )}
      </div>

      {/* Collapse Button - Floating like in some modern apps */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-[#0d0d0d] border border-white/10 rounded-full flex items-center justify-center text-gray-500 hover:text-white z-20 shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-transform opacity-0 group-hover/sidebar:opacity-100"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </aside>
  );
};

