import React from 'react';
import { Instagram, Twitter, Mail, Globe, Cpu, Database, Key } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-onyx border-t border-border">
      <div className="py-24 px-10 max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
        <div className="md:col-span-2">
          <div className="text-4xl font-serif italic tracking-tight mb-8">
            ArtSphere<span className="text-accent">.</span>
          </div>
          <p className="max-w-md text-[#666] text-sm leading-relaxed mb-10 font-light italic">
            "Революционный узел, где алгоритмическая точность пересекается с первозданной текучестью человеческого подсознания."
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-[#444] hover:text-accent transition-all uppercase text-[10px] tracking-widest font-bold">Instagram</a>
            <a href="#" className="text-[#444] hover:text-accent transition-all uppercase text-[10px] tracking-widest font-bold">Twitter</a>
            <a href="#" className="text-[#444] hover:text-accent transition-all uppercase text-[10px] tracking-widest font-bold">Email</a>
          </div>
        </div>

        <div>
           <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#666] mb-8">Навигация</h4>
           <ul className="space-y-4 text-xs uppercase tracking-widest font-medium text-[#444]">
             <li><a href="#" className="hover:text-accent transition-all">Выставки</a></li>
             <li><a href="#" className="hover:text-accent transition-all">Маркетплейс</a></li>
             <li><a href="#" className="hover:text-accent transition-all">Художники</a></li>
             <li><a href="#" className="hover:text-accent transition-all">Протокол</a></li>
           </ul>
        </div>

        <div>
           <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#666] mb-8">Интеллект</h4>
           <ul className="space-y-4 text-xs uppercase tracking-widest font-medium text-[#444]">
             <li><a href="#" className="hover:text-accent transition-all">Поддержка</a></li>
             <li><a href="#" className="hover:text-accent transition-all">Управление</a></li>
             <li><a href="#" className="hover:text-accent transition-all">ИИ Куратор</a></li>
             <li><a href="#" className="hover:text-accent transition-all">API Доступ</a></li>
           </ul>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-accent text-white px-10 h-14 flex items-center justify-between">
        <div className="flex gap-10 text-[9px] font-black uppercase tracking-[0.2em] items-center">
          <span className="flex items-center gap-2 font-black italic"><Database size={10} strokeWidth={3} /> Firestore Активен</span>
          <span className="flex items-center gap-2 font-black italic"><Cpu size={10} strokeWidth={3} /> Redis Cache Hit</span>
        </div>
        <div className="hidden lg:flex gap-10 text-[9px] font-black uppercase tracking-[0.2em] items-center">
          <span className="flex items-center gap-2 font-black italic"><Key size={10} strokeWidth={3} /> Secure JWT 256</span>
          <span className="font-black italic">© 2026 Глобальный консорциум ArtSphere</span>
        </div>
      </div>
    </footer>
  );
};
