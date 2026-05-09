import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Palette, Award } from 'lucide-react';
import { Artist } from '../types';
import { artistService } from '../lib/api';

export const Artists: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const data = await artistService.getAll();
        if (Array.isArray(data) && data.length > 0) {
          setArtists(data);
        } else {
          // Fallback artists with images
          setArtists([
            {
              id: 1,
              name: "Серафина Блэк",
              bio: "Специалист по генеративному искусству и квантовой эстетике. Ее работы исследуют границы между реальностью и кодом.",
              specialty: "Generative Art",
              avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
              location: "Берлин",
              exhibitionCount: 12
            },
            {
              id: 2,
              name: "Маркус Вольт",
              bio: "Архитектор виртуальных миров и бруталистского цифрового пространства. Создает масштабные 3D-инсталляции.",
              specialty: "Digital Architecture",
              avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
              location: "Токио",
              exhibitionCount: 8
            },
            {
              id: 3,
              name: "Елена Рэй",
              bio: "Минималист, работающий с цветом и светом в цифровой среде. Ее стиль характеризуется лаконичностью и чистотой.",
              specialty: "Minimalism",
              avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
              location: "Париж",
              exhibitionCount: 15
            }
          ]);
        }
      } catch (error) {
        console.error("Error fetching artists:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-10">
      <div className="max-w-screen-2xl mx-auto">
        <header className="mb-20">
          <span className="text-secondary font-mono text-[10px] uppercase tracking-[0.4em] mb-4 block">Резидентская сеть // Level A</span>
          <h1 className="text-7xl font-serif italic mb-6 tracking-tighter">Художники<span className="text-accent">.</span></h1>
          <p className="text-[#666] max-w-xl text-sm leading-relaxed">
            Визионеры и экспериментаторы, формирующие новый ландшафт современного цифрового искусства.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {artists.map((artist, index) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-[#0D0D0D] border border-border p-10 hover:border-accent transition-all duration-500"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-20 h-20 rotate-45 border border-border bg-onyx overflow-hidden group-hover:border-accent transition-colors">
                  <img 
                    src={artist.avatarUrl} 
                    alt={artist.name}
                    className="w-full h-full object-cover -rotate-45 scale-125"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-right font-mono text-[9px] text-[#444] uppercase tracking-widest">
                  ID: ART-{artist.id}-00X
                </div>
              </div>

              <h2 className="text-3xl font-serif italic mb-4 tracking-tight group-hover:text-white transition-colors">{artist.name}</h2>
              <div className="flex items-center gap-3 text-accent font-mono text-[9px] uppercase tracking-widest mb-6">
                <Palette size={10} /> {artist.specialty}
              </div>
              
              <p className="text-[#666] text-xs leading-relaxed mb-8 h-12 overflow-hidden italic">
                {artist.bio}
              </p>

              <div className="pt-8 border-t border-border flex justify-between items-center text-[9px] uppercase font-bold tracking-widest text-[#444]">
                <div className="flex items-center gap-2">
                  <MapPin size={10} /> {artist.location}
                </div>
                <div className="flex items-center gap-2">
                  <Award size={10} /> {artist.exhibitionCount} Выставок
                </div>
              </div>

              <div className="absolute inset-0 border-2 border-accent opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
