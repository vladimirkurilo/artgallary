import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, ShieldCheck, Heart, Loader2 } from 'lucide-react';
import { Artwork } from '../types';
import { formatCurrency } from '../lib/utils';
import { artworkService } from '../lib/api';
import { useAuth } from './AuthProvider';

interface ArtworkDetailProps {
  artwork: Artwork | null;
  onClose: () => void;
}

export const ArtworkDetail: React.FC<ArtworkDetailProps> = ({ artwork, onClose }) => {
  const { user, signIn } = useAuth();
  const [purchasing, setPurchasing] = useState(false);

  if (!artwork) return null;

  const handlePurchase = async () => {
    if (!user) {
      if (window.confirm("Для покупки необходимо авторизоваться. Войти в систему?")) {
        signIn();
      }
      return;
    }

    try {
      setPurchasing(true);
      const checkoutUrl = await artworkService.purchase(Number(artwork.id));
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Purchase error:", error);
      alert("Ошибка при инициации транзакции. Убедитесь, что Backend запущен.");
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-10">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-onyx/95 backdrop-blur-xl"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-6xl bg-onyx border border-border rounded-none overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row h-full max-h-[85vh]"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-10 w-10 h-10 bg-onyx border border-border flex items-center justify-center hover:bg-white hover:text-onyx transition-colors transition-all"
          >
            <X size={20} />
          </button>

          {/* Left: Image Container */}
          <div className="md:w-3/5 h-full bg-[#050505] relative group flex items-center justify-center">
             <div className="absolute top-8 left-8 w-24 h-24 border-t border-l border-accent/30 pointer-events-none"></div>
            <img 
              src={artwork.imageUrl} 
              alt={artwork.title}
              className="w-full h-full object-contain p-20 z-10"
              referrerPolicy="no-referrer"
            />
             <div className="absolute bottom-8 right-8 w-24 h-24 border-b border-r border-accent/30 pointer-events-none"></div>
          </div>

          {/* Right: Info Container */}
          <div className="md:w-2/5 p-10 md:p-16 flex flex-col justify-center overflow-y-auto border-l border-border bg-[#0D0D0D]">
            <div className="mb-10">
              <span className="text-accent font-mono text-[10px] uppercase tracking-[0.4em] mb-4 block">Протокол Aetheria v4.0</span>
              <h2 className="text-5xl md:text-6xl font-serif italic mb-4 tracking-tighter leading-[0.9]">{artwork.title}</h2>
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-[#666]">
                <span>Автор: {artwork.artistName}</span>
                <div className="w-1 h-1 rounded-full bg-accent" />
                <span>Верифицированный актив</span>
              </div>
            </div>

            <p className="text-sm font-light text-[#777] mb-10 leading-relaxed italic">
              {artwork.description || "Исследование процедурной генерации и человеческого подсознания. Часть серии выставок «Виртуальное эхо»."}
            </p>

            <div className="p-8 mb-10 bg-[#080808] border border-border">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#444] mb-2">Начальная цена</div>
                  <div className="text-3xl font-mono text-accent font-bold tracking-tighter">{formatCurrency(artwork.price)}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handlePurchase}
                disabled={purchasing}
                className="flex-1 py-5 bg-accent text-white font-bold uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {purchasing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Инициация...
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} />
                    Приобрести работу
                  </>
                )}
              </button>
            </div>
            
            <div className="mt-10 pt-10 border-t border-border flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-[#444]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-green-500" /> ПРОИСХОЖДЕНИЕ ПОДТВЕРЖДЕНО
              </div>
              <div className="font-mono text-[9px]">DOC# AS-882-QX</div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
