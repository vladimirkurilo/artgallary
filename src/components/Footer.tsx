import React from 'react';
import { Instagram, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-onyx border-t border-border">
      <div className="py-24 px-10 max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-20">
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
             <li><Link to="/exhibitions" className="hover:text-accent transition-all">Выставки</Link></li>
             <li><Link to="/marketplace" className="hover:text-accent transition-all">Маркетплейс</Link></li>
             <li><Link to="/artists" className="hover:text-accent transition-all">Художники</Link></li>
             <li><Link to="/" className="hover:text-accent transition-all">Главная</Link></li>
           </ul>
        </div>
      </div>

      <div className="border-t border-border/50 px-10 py-6 flex justify-between items-center text-[10px] uppercase tracking-widest text-[#444]">
        <span>© 2026 Глобальный консорциум ArtSphere</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
};
