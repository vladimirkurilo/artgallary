import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Lock, Mail } from 'lucide-react';
import { useAuth } from './AuthProvider';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Pass actual credentials from form
      await signIn({ email, password });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-onyx/90 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md bg-[#0D0D0D] border border-border p-10 shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-[#444] hover:text-white transition-colors">
              <X size={20} />
            </button>

            <div className="text-center mb-10">
              <div className="w-16 h-16 rotate-45 border border-accent/30 mx-auto mb-8 flex items-center justify-center">
                <Shield size={24} className="-rotate-45 text-accent" />
              </div>
              <h2 className="text-3xl font-serif italic mb-2">{isLogin ? 'Авторизация' : 'Регистрация'}</h2>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#666]">Протокол безопасности // V.4</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest font-bold text-[#444] flex items-center gap-2">
                  <Mail size={10} /> Email
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#111] border border-border p-4 text-xs font-mono focus:border-accent outline-none"
                  placeholder="user@nxs.sys"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest font-bold text-[#444] flex items-center gap-2">
                  <Lock size={10} /> Пароль
                </label>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#111] border border-border p-4 text-xs font-mono focus:border-accent outline-none"
                  placeholder="********"
                  required
                />
              </div>

              <button 
                disabled={loading}
                className="w-full py-5 bg-accent text-white uppercase tracking-widest text-[10px] font-bold hover:scale-105 transition-all disabled:opacity-50"
              >
                {loading ? 'Синхронизация...' : (isLogin ? 'Войти в нексус' : 'Создать идентификатор')}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-[9px] uppercase tracking-widest font-bold text-[#444] hover:text-white transition-colors"
              >
                {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Есть аккаунт? Войти'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
