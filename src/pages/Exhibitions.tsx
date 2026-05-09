import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Exhibition } from '../types';
import { exhibitionService } from '../lib/api';

export const Exhibitions: React.FC = () => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const data = await exhibitionService.getAll();
        if (Array.isArray(data) && data.length > 0) {
          setExhibitions(data);
        } else {
          // Fallback with high-quality images
          setExhibitions([
            {
              id: 1,
              title: "Виртуальное безмолвие",
              description: "Исследование цифровой пустоты и формы в пост-технологическую эпоху.",
              imageUrl: "https://images.unsplash.com/photo-1554188248-986adbb73be4?auto=format&fit=crop&q=80&w=1200",
              videoUrl: "https://player.vimeo.com/external/494270275.sd.mp4?s=d00ed50ef861c8567fdf8073b9ce967b57b78a00&profile_id=165",
              startDate: "2024-05-15",
              endDate: "2024-06-30",
              location: "Галерея Нексус, Уровень 4",
              status: "ACTIVE"
            },
            {
              id: 2,
              title: "Неоновые сны",
              description: "Ретроспектива киберпанка и неоновой эстетики в современном искусстве.",
              imageUrl: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&q=80&w=1200",
              startDate: "2024-07-10",
              endDate: "2024-08-20",
              location: "Облачный Зал",
              status: "UPCOMING"
            }
          ]);
        }
      } catch (error) {
        console.error("Error fetching exhibitions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExhibitions();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-10">
      <div className="max-w-screen-2xl mx-auto">
        <header className="mb-20">
          <span className="text-accent font-mono text-[10px] uppercase tracking-[0.4em] mb-4 block">Кураторская программа v.11</span>
          <h1 className="text-7xl font-serif italic mb-6 tracking-tighter">Выставки<span className="text-accent">.</span></h1>
          <p className="text-[#666] max-w-xl text-sm leading-relaxed italic">
            Наши текущие и будущие экспозиции объединяют физическое и цифровое пространство, создавая уникальный иммерсивный опыт.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-12">
          {exhibitions.map((exhibition, index) => (
            <motion.div
              key={exhibition.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group flex flex-col md:flex-row border border-border overflow-hidden bg-[#0a0a0a]"
            >
              <div className="md:w-1/2 aspect-video overflow-hidden relative">
                {exhibition.videoUrl ? (
                  <video 
                    src={exhibition.videoUrl}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : null}
                <img 
                  src={exhibition.imageUrl} 
                  alt={exhibition.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="md:w-1/2 p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 border ${
                    exhibition.status === 'ACTIVE' ? 'border-accent text-accent' : 'border-[#444] text-[#444]'
                  }`}>
                    {exhibition.status === 'ACTIVE' ? 'В эфире' : 'Скоро'}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#666]">
                    <Calendar size={12} /> {exhibition.startDate} — {exhibition.endDate}
                  </div>
                </div>
                <h2 className="text-4xl font-serif italic mb-6 tracking-tight group-hover:text-accent transition-colors">{exhibition.title}</h2>
                <p className="text-sm text-[#888] mb-8 leading-relaxed max-w-md">{exhibition.description}</p>
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-[#444] mb-10">
                  <MapPin size={12} className="text-accent" /> {exhibition.location}
                </div>
                <button className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] group-hover:gap-6 transition-all">
                  Смотреть детали <ArrowRight size={14} className="text-accent" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
