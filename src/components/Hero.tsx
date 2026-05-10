import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Play } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 lg:pt-0">
      {/* Background with parallax-like effect */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=2000" 
          alt="Abstract Gallery" 
          className="w-full h-full object-cover opacity-30 transform scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-onyx via-transparent to-onyx" />
      </div>

      <div className="relative z-10 max-w-screen-2xl mx-auto px-10 grid grid-cols-1 lg:grid-cols-12 gap-0 items-center h-full">
        {/* Vertical Rail */}
        <div className="hidden lg:col-span-1 h-full border-r border-border lg:flex flex-col justify-end items-center pb-24">
          <span className="rail-label">
            Кураторские коллекции 2026
          </span>
        </div>

        <div className="lg:col-span-7 lg:px-20 py-20 lg:py-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="mb-10 max-w-2xl relative group">
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t border-l border-accent opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="bg-gradient-to-br from-[#1A1A1A] to-[#050505] p-1 border border-border relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200" 
                  alt="Metamorphosis Preview" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <video 
                  src="https://player.vimeo.com/external/494270275.sd.mp4?s=d00ed50ef861c8567fdf8073b9ce967b57b78a00&profile_id=165"
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200"
                  className="relative z-10 w-full aspect-video object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                />
                <div className="absolute inset-0 bg-onyx/20 pointer-events-none z-20" />
              </div>
              <div className="absolute bottom-6 right-6 flex items-center gap-4 bg-onyx/80 backdrop-blur-md px-6 py-2 border border-border">
                <span className="text-xs font-serif italic">От 2.4 ETH</span>
                <button className="text-accent text-[10px] uppercase tracking-widest font-bold">
                  Подробнее
                </button>
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-serif mb-6 leading-[0.9] tracking-tighter">
              Вихрь<br /><span className="italic">Незримого Мира</span>
            </h1>
            <p className="max-w-md text-sm md:text-base font-light text-[#777] leading-relaxed mb-10">
              Исследование процедурной генерации и человеческого подсознания. Часть серии выставок «Виртуальное эхо», проходящих на платформе ArtSphere.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button className="px-10 py-4 bg-accent text-white font-bold uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all">
                Войти на выставку
              </button>
              <button className="flex items-center gap-3 px-8 py-4 text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors border border-border bg-white/5">
                <Play size={14} fill="currentColor" />
                Предпросмотр
              </button>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-4 h-full bg-[#0D0D0D] border-l border-border p-12 hidden lg:flex flex-col justify-center">
          <section className="mb-12">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#666] mb-6 font-bold">Художник месяца</h3>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-none rotate-45 border border-border flex items-center justify-center overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" 
                  alt="Valeria Ashwood" 
                  className="w-full h-full object-cover -rotate-45 scale-125"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <p className="text-sm font-medium">Валерия Эшвуд</p>
                <p className="text-[11px] text-[#555] uppercase tracking-widest">Цифровой архитектор</p>
              </div>
            </div>
          </section>

          <section className="p-8 border border-border bg-[#080808] mb-12">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#666] mb-6 font-bold">Статистика платформы</h3>
            <div className="flex justify-between items-end mb-4">
              <span className="text-3xl font-serif">$814,204</span>
              <span className="text-[10px] text-green-500 font-mono tracking-tighter">+12.4%</span>
            </div>
            <div className="h-1 bg-[#1A1A1A] w-full relative">
              <div className="h-full bg-accent w-[65%] shadow-[0_0_10px_rgba(255,62,0,0.5)]"></div>
            </div>
            <p className="text-[9px] text-[#444] mt-4 uppercase tracking-tighter italic">Всего распределено роялти на вторичном рынке</p>
          </section>

          <div className="mt-auto pt-8 border-t border-border flex justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] text-[#444] uppercase font-bold mb-1">Статус</span>
              <span className="text-[10px] font-mono flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> СИСТЕМА АКТИВНА
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[9px] text-[#444] uppercase font-bold mb-1">Версия</span>
              <span className="text-[10px] font-mono">v4.0.1-AE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative vertical lines */}
      <div className="absolute left-10 bottom-0 h-32 w-px bg-white/10 hidden lg:block" />
      <div className="absolute right-10 bottom-0 h-32 w-px bg-white/10 hidden lg:block" />
    </section>
  );
};
