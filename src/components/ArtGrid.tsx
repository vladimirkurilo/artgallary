import React, { useEffect, useState } from 'react';
import { artworkService } from '../lib/api';
import { Artwork } from '../types';
import { ArtCard } from './ArtCard';
import { motion } from 'motion/react';

import { ArtworkDetail } from './ArtworkDetail';

export const ArtGrid: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArt, setSelectedArt] = useState<Artwork | null>(null);

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      const data = await artworkService.getAll();
      if (Array.isArray(data) && data.length > 0) {
        setArtworks(data);
      } else {
        // Fallback for demo if backend is empty or returning non-array
        setArtworks([
          {
            id: 1,
            title: 'Эфирный поток',
            artistName: 'Серафина Блэк',
            price: 1250,
            imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800',
            royaltyRate: 10,
            status: 'available',
            artistId: 'mock-1',
            description: 'Исследование цифровой текучести.',
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            title: 'Обсидиановая структура',
            artistName: 'Маркус Вольт',
            price: 3400,
            imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=800',
            royaltyRate: 15,
            status: 'available',
            artistId: 'mock-2',
            description: 'Бруталистская цифровая архитектура.',
            createdAt: new Date().toISOString()
          }
        ]);
      }
    } catch (error) {
      console.error("Error fetching artworks:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 px-10 max-w-screen-2xl mx-auto">
      {/* ... header ... */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <span className="text-accent font-mono text-[10px] uppercase tracking-[0.3em] mb-4 block font-bold">Протокол // Глобальный каталог</span>
          <h2 className="text-5xl md:text-7xl font-serif italic tracking-tighter leading-none">Новые релизы</h2>
        </div>
        <div className="flex gap-4 border-b border-border">
          <button className="px-6 py-4 border-accent border-b-2 text-[10px] font-bold uppercase tracking-widest">В тренде</button>
          <button className="px-6 py-4 opacity-40 text-[10px] font-bold uppercase tracking-widest hover:opacity-100 transition-opacity">Недавние</button>
          <button className="px-6 py-4 opacity-40 text-[10px] font-bold uppercase tracking-widest hover:opacity-100 transition-opacity">Первичный рынок</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {artworks.map((art, i) => (
          <div key={art.id} onClick={() => setSelectedArt(art)}>
            <ArtCard artwork={art} index={i} />
          </div>
        ))}
      </div>
      
      <ArtworkDetail artwork={selectedArt} onClose={() => setSelectedArt(null)} />
      
      {artworks.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 text-center"
        >
          <button className="px-12 py-4 border border-border rounded-none text-xs font-bold uppercase tracking-[0.3em] hover:bg-white/5 transition-all text-[#666]">
            Показать больше <span className="ml-2 opacity-40">24 / 150</span>
          </button>
        </motion.div>
      )}
    </section>
  );
};
