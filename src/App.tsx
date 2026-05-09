import React from 'react';
import { AuthProvider } from './components/AuthProvider';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { ArtGrid } from './components/ArtGrid';
import { Footer } from './components/Footer';
import { Routes, Route } from 'react-router-dom';
import { AdminPanel } from './components/AdminPanel';
import { UserDashboard } from './components/UserDashboard';
import { motion, AnimatePresence } from 'motion/react';

const ImmersiveTeaser = () => (
// ... (ImmersiveTeaser stays same)
  <section className="py-32 px-10 relative overflow-hidden">
    <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <span className="text-accent font-mono text-[10px] uppercase tracking-[0.4em] mb-4 block font-bold">Протокол виртуальной реальности</span>
        <h2 className="text-5xl md:text-7xl font-serif italic leading-tight mb-8">Пространственная<br />Галерея</h2>
        <p className="text-base font-light text-[#777] mb-10 leading-relaxed max-w-lg italic">
          "Преодолейте границы традиционных экранов. Наша Пространственная Галерея позволяет вам прогуляться по мирам, созданным художниками, и увидеть цифровое искусство в предназначенном для него контексте."
        </p>
        <button className="px-10 py-5 bg-accent text-white text-[10px] uppercase font-bold tracking-widest hover:scale-105 transition-all">
          Запросить доступ
        </button>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative aspect-square"
      >
        <div className="absolute inset-0 bg-accent/5 blur-3xl rounded-full" />
        <div className="absolute -top-4 -left-4 w-32 h-32 border-t border-l border-accent opacity-30"></div>
        <img 
          src="https://images.unsplash.com/photo-1547891269-045ad91d039d?auto=format&fit=crop&q=80&w=1000" 
          alt="Virtual Exhibition Preview" 
          className="relative z-10 w-full h-full object-cover rounded-none grayscale transition-all duration-1000 border border-border"
          referrerPolicy="no-referrer"
        />
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#0D0D0D] border border-border flex flex-col items-center justify-center text-center p-4 z-20">
          <div className="text-2xl font-serif italic text-accent leading-none mb-1">8K</div>
          <div className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Разрешение</div>
        </div>
      </motion.div>
    </div>
  </section>
);

const LandingPage = () => (
  <>
    <Hero />
    <Features />
    <ArtGrid />
    <ImmersiveTeaser />

    {/* Newsletter / CTA */}
    <section className="py-40 px-10 bg-onyx border-t border-border">
      <div className="max-w-screen-xl mx-auto text-center relative">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-accent/30"></div>
        <h2 className="text-6xl md:text-8xl font-serif italic mb-8 pt-24 tracking-tighter">Войти в нексус<span className="text-accent">.</span></h2>
        <p className="max-w-xl mx-auto mb-16 text-[#666] font-light italic leading-relaxed">
          "Подпишитесь на протокол для синхронизированных обновлений о закрытых кураторских событиях и алгоритмических циклах дропов."
        </p>
        <form className="max-w-md mx-auto flex flex-col md:flex-row gap-0" onSubmit={e => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="IDENTITY@PROTOCOL.SYS" 
            className="flex-1 px-8 py-5 bg-[#0D0D0D] border border-border focus:border-accent focus:outline-none placeholder:text-[#333] text-[10px] tracking-[0.2em] font-bold uppercase transition-colors"
          />
          <button className="px-12 py-5 bg-accent text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-onyx transition-all">
            Синхронизировать
          </button>
        </form>
        <div className="mt-12 text-[9px] uppercase tracking-[0.4em] text-[#444] font-black">
          ЗАЩИЩЕННЫЙ ТЕРМИНАЛ ASTR-999
        </div>
      </div>
    </section>
  </>
);

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Navbar />
        
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/success" element={<div className="min-h-screen pt-60 text-center px-10"><h1 className="text-6xl font-serif italic mb-4">Успешно!</h1><p className="text-[#666]">Ваш транзакционный цикл завершен. Работа добавлена в коллекцию.</p></div>} />
            <Route path="/cancel" element={<div className="min-h-screen pt-60 text-center px-10"><h1 className="text-6xl font-serif italic mb-4">Отмена</h1><p className="text-[#666]">Транзакция была прервана пользователем.</p></div>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}
