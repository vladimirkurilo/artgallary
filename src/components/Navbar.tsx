import React, { useState } from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { AuthModal } from './AuthModal';

export const Navbar: React.FC = () => {
  const { user, logout: signOut } = useAuth();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || user?.email === 'Vovkin06@gmail.com';

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-6 px-10 border-b border-border",
      isScrolled ? "bg-onyx/90 backdrop-blur-md py-4" : "bg-onyx"
    )}>
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex flex-col group">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#666] mb-1 group-hover:text-accent transition-colors">Платформа Цифрового Искусства</span>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-serif italic tracking-tight"
          >
            ArtSphere<span className="text-accent">.</span>
          </motion.div>
        </Link>
          
        <div className="flex items-center gap-12">
          <div className="hidden lg:flex items-center gap-10 text-xs uppercase tracking-widest font-medium text-[#AAA]">
            <Link to="/marketplace" className="hover:text-white transition-colors">Маркетплейс</Link>
            <Link to="/exhibitions" className="hover:text-white transition-colors">Выставки</Link>
            <Link to="/artists" className="hover:text-white transition-colors">Художники</Link>
            {isAdmin && <Link to="/admin" className="text-accent font-bold hover:text-white transition-colors">Админ</Link>}
            {user && <Link to="/dashboard" className="hover:text-white transition-colors">Кабинет</Link>}
          </div>

          <div className="flex items-center gap-6 border-l border-border pl-12">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                   <div className="w-10 h-10 rotate-45 border border-border bg-[#0D0D0D] flex items-center justify-center overflow-hidden hover:border-accent transition-colors">
                      <User size={20} className="-rotate-45" />
                   </div>
                </Link>
                <button 
                  onClick={signOut}
                  className="text-[#666] hover:text-accent transition-all"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="px-6 py-2 bg-accent text-white text-[10px] uppercase tracking-widest font-bold hover:scale-105 transition-all"
              >
                Войти
              </button>
            )}
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  );
};
