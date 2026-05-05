import React from 'react';
import { signInWithGoogle } from '../services/firebase';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const LoginPage = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/agent" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-xl shadow-indigo-200">
            Æ
          </div>
          <h1 className="text-2xl font-bold text-gray-900 italic tracking-tight">AETHER 灵境引擎</h1>
          <p className="text-gray-500 mt-2">部署您的下一代智能体劳动力</p>
        </div>

        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          使用 Google 账号登录
        </button>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <ShieldCheck className="w-4 h-4" />
            安全的身份验证，保护您的数据隐私
          </div>
        </div>
      </motion.div>
    </div>
  );
};
