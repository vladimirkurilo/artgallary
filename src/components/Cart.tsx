import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, ArrowRight, CreditCard, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { useCart } from './CartProvider';
import { formatCurrency } from '../lib/utils';
import { useAuth } from './AuthProvider';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

type CheckoutStep = 'cart' | 'details' | 'success';

export const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, total, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setStep('cart'), 300);
    }
  }, [isOpen]);

  const handleNextStep = () => {
    if (step === 'cart') setStep('details');
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setStep('success');
    clearCart();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
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
                  {step === 'cart' && <ShoppingBag size={20} className="text-accent" />}
                  {step === 'details' && <CreditCard size={20} className="text-accent" />}
                  {step === 'success' && <CheckCircle2 size={20} className="text-green-500" />}
                  <h2 className="text-xl font-serif italic">
                    {step === 'cart' && 'Корзина'}
                    {step === 'details' && 'Оформление'}
                    {step === 'success' && 'Успешно'}
                  </h2>
                </div>
                <button onClick={handleClose} className="text-[#444] hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <AnimatePresence mode="wait">
                  {step === 'cart' && (
                    <motion.div
                      key="cart-step"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-[#444] py-20 space-y-4">
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
                              onClick={() => removeItem(Number(item.id))}
                              className="text-[#333] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))
                      )}
                    </motion.div>
                  )}

                  {step === 'details' && (
                    <motion.div
                      key="details-step"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div className="space-y-4">
                        <div className="text-[10px] uppercase tracking-[0.3em] text-[#666] font-bold">Сводка заказа</div>
                        <div className="p-6 bg-[#080808] border border-border space-y-4">
                          {items.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-xs">
                              <span className="text-[#888] italic">{item.title}</span>
                              <span className="font-mono">{formatCurrency(item.price)}</span>
                            </div>
                          ))}
                          <div className="pt-4 border-t border-border flex justify-between items-center">
                            <span className="text-sm font-bold uppercase tracking-widest">Итого</span>
                            <span className="text-xl font-mono text-accent font-bold">{formatCurrency(total)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                         <div className="text-[10px] uppercase tracking-[0.3em] text-[#666] font-bold">Данные покупателя</div>
                         <div className="p-6 bg-[#080808] border border-border space-y-3">
                            <div className="text-xs">
                              <div className="text-[#444] uppercase mb-1">Email</div>
                              <div>{user?.email || 'Гость'}</div>
                            </div>
                            <div className="text-xs">
                              <div className="text-[#444] uppercase mb-1">Адрес доставки</div>
                              <div className="italic text-[#666]">Цифровая доставка в Nexus</div>
                            </div>
                         </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-green-500/5 border border-green-500/20 text-green-500 rounded-none">
                        <ShieldCheck size={16} />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Безопасный платеж Aetheria</span>
                      </div>
                    </motion.div>
                  )}

                  {step === 'success' && (
                    <motion.div
                      key="success-step"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-20 space-y-8"
                    >
                      <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 size={40} />
                      </div>
                      <div>
                        <h3 className="text-3xl font-serif italic mb-4">Оплата принята</h3>
                        <p className="text-sm text-[#666] leading-relaxed italic">
                          Благодарим вас за поддержку современного искусства. Ваша работа будет доступна в личном кабинете после подтверждения в Nexus-сети.
                        </p>
                      </div>
                      <button 
                        onClick={handleClose}
                        className="px-10 py-4 border border-border text-[10px] uppercase tracking-widest font-bold hover:border-accent transition-all"
                      >
                        Вернуться к просмотру
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {step !== 'success' && items.length > 0 && (
                <div className="p-8 border-t border-border bg-[#0a0a0a]">
                  {step === 'cart' ? (
                    <div className="space-y-6">
                      <div className="flex justify-between items-end">
                        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#666]">Сумма</div>
                        <div className="text-3xl font-mono text-accent font-bold tracking-tighter">
                          {formatCurrency(total)}
                        </div>
                      </div>
                      <button 
                        onClick={handleNextStep}
                        className="w-full py-5 bg-accent text-white font-bold uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        Оформить заказ <ArrowRight size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setStep('cart')}
                        disabled={isProcessing}
                        className="flex-1 py-5 border border-border text-[#444] hover:text-white hover:border-white transition-all font-bold uppercase tracking-widest text-xs"
                      >
                        Назад
                      </button>
                      <button 
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="flex-[2] py-5 bg-accent text-white font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Обработка...
                          </>
                        ) : (
                          <>
                            Оплатить {formatCurrency(total)}
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
