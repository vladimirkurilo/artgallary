import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '../components/CartProvider';

export const SuccessPage: React.FC = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart on successful purchase
    clearCart();
  }, []);

  return (
    <div className="min-h-screen bg-onyx text-white flex flex-col items-center justify-center p-10 text-center">
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(34,197,94,0.3)]"
      >
        <CheckCircle size={48} className="text-white" />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl"
      >
        <h1 className="text-6xl font-serif italic mb-6 tracking-tighter">Оплата подтверждена</h1>
        <p className="text-xl text-[#888] font-light leading-relaxed mb-12 italic">
          Ваш цифровой актив успешно верифицирован в Nexus. Право владения перешло в ваш личный профиль. Детали транзакции доступны в распределенном реестре.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link 
            to="/dashboard" 
            className="px-10 py-5 bg-accent text-white font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            В личный кабинет <ArrowRight size={16} />
          </Link>
          <button 
            className="px-10 py-5 border border-border text-white font-bold uppercase tracking-widest text-xs hover:border-white transition-all flex items-center justify-center gap-2"
          >
            Скачать сертификат <Download size={16} />
          </button>
        </div>
      </motion.div>

      <div className="mt-24 pt-12 border-t border-border w-full max-w-lg opacity-30">
        <div className="text-[10px] uppercase font-bold tracking-[0.5em] mb-4 text-[#444]">System Log</div>
        <div className="font-mono text-[9px] text-[#444] space-y-1">
          <div>// BLOCK_CONFIRMED: 0x82A...F9E</div>
          <div>// TIMESTAMP: {new Date().toISOString()}</div>
          <div>// STATUS: FINALIZED</div>
        </div>
      </div>
    </div>
  );
};
