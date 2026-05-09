import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from './CartProvider';
import { formatCurrency } from '../lib/utils';
import { artworkService } from '../lib/api';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, total, clearCart } = useCart();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    try {
      // For demo, just purchase the first item or handle all
      const checkoutUrl = await artworkService.purchase(items[0].id);
      window.location.href = checkoutUrl;
      clearCart();
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Ошибка при оформлении заказа.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-onyx/80 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-[#0D0D0D] border-l border-border shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingBag size={20} className="text-accent" />
                  <h2 className="text-xl font-serif italic">Корзина</h2>
                </div>
                <button onClick={onClose} className="text-[#444] hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-[#444] space-y-4">
                    <ShoppingBag size={48} strokeWidth={1} />
                    <p className="text-[10px] uppercase tracking-widest font-bold">Ваша корзина пуста</p>
                  </div>
                ) : (
                  items.map(item => (
                    <div key={item.id} className="flex gap-4 p-4 bg-[#111] border border-border group">
                      <div className="w-20 h-20 bg-[#050505] flex-shrink-0">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xs font-bold uppercase tracking-tight mb-1">{item.title}</h3>
                        <p className="text-[9px] uppercase text-[#666] mb-2">{item.artistName}</p>
                        <div className="text-sm font-mono text-accent">{formatCurrency(item.price)}</div>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-[#333] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="p-8 border-t border-border bg-[#0a0a0a]">
                  <div className="flex justify-between items-end mb-8">
                    <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#666]">Итого к оплате</div>
                    <div className="text-3xl font-mono text-accent font-bold tracking-tighter">
                      {formatCurrency(total)}
                    </div>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full py-5 bg-accent text-white font-bold uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    Перейти к оплате <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
