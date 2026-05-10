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

  const [visibleCount, setVisibleCount] = useState(4);
  const [filter, setFilter] = useState<'trending' | 'recent' | 'primary'>('trending');

  useEffect(() => {
    fetchArtworks();
  }, []);

  const getFilteredArtworks = () => {
    let filtered = [...artworks];
    if (filter === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } else if (filter === 'primary') {
      filtered = filtered.filter(art => art.price < 2000);
    } else if (filter === 'trending') {
      filtered = filtered.filter(art => art.price > 1000);
    }
    return filtered;
  };

  const visibleArtworks = getFilteredArtworks().slice(0, visibleCount);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      const data = await artworkService.getAll();
      if (Array.isArray(data) && data.length > 0) {
        setArtworks(data);
      } else {
        // Fallback for demo with more items
        setArtworks([
          {
            id: 1,
            title: 'Эфирный поток',
            artistName: 'Серафина Блэк',
            price: 1250,
            imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800',
            views: 0,
            salesCount: 0,
            status: 'AVAILABLE',
            artistId: 1,
            description: 'Исследование цифровой текучести.',
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            title: 'Обсидиановая структура',
            artistName: 'Маркус Вольт',
            price: 3400,
            imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=800',
            views: 0,
            salesCount: 0,
            status: 'AVAILABLE',
            artistId: 2,
            description: 'Бруталистская цифровая архитектура.',
            createdAt: new Date().toISOString()
          },
          {
            id: 3,
            title: 'Неоновый разрез',
            artistName: 'Елена Рэй',
            price: 1800,
            imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
            views: 0,
            salesCount: 0,
            status: 'AVAILABLE',
            artistId: 3,
            description: 'Геометрический неоновый минимализм.',
            createdAt: "2024-05-01T10:00:00Z"
          },
          {
            id: 4,
            title: 'Цифровой генезис',
            artistName: 'Серафина Блэк',
            price: 950,
            imageUrl: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=800',
            views: 0,
            salesCount: 0,
            status: 'AVAILABLE',
            artistId: 1,
            description: 'Начало новой формы.',
            createdAt: "2024-05-02T12:00:00Z"
          },
          {
            id: 5,
            title: 'Метаморфоза',
            artistName: 'Маркус Вольт',
            price: 2100,
            imageUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=800',
            views: 0,
            salesCount: 0,
            status: 'AVAILABLE',
            artistId: 2,
            description: 'Трансформация пространства.',
            createdAt: "2024-05-03T15:00:00Z"
          },
          {
            id: 6,
            title: 'Свет будущего',
            artistName: 'Елена Рэй',
            price: 1500,
            imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800',
            views: 0,
            salesCount: 0,
            status: 'AVAILABLE',
            artistId: 3,
            description: 'Оптимистичный взгляд на технологии.',
            createdAt: "2024-05-04T09:00:00Z"
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
          <button 
            onClick={() => setFilter('trending')}
            className={`px-6 py-4 border-accent text-[10px] font-bold uppercase tracking-widest transition-all ${filter === 'trending' ? 'border-b-2 opacity-100' : 'opacity-40 hover:opacity-100'}`}
          >
            В тренде
          </button>
          <button 
            onClick={() => setFilter('recent')}
            className={`px-6 py-4 border-accent text-[10px] font-bold uppercase tracking-widest transition-all ${filter === 'recent' ? 'border-b-2 opacity-100' : 'opacity-40 hover:opacity-100'}`}
          >
            Недавние
          </button>
          <button 
            onClick={() => setFilter('primary')}
            className={`px-6 py-4 border-accent text-[10px] font-bold uppercase tracking-widest transition-all ${filter === 'primary' ? 'border-b-2 opacity-100' : 'opacity-40 hover:opacity-100'}`}
          >
            Первичный рынок
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {visibleArtworks.map((art, i) => (
          <div key={art.id} onClick={() => setSelectedArt(art)}>
            <ArtCard artwork={art} index={i} />
          </div>
        ))}
      </div>
      
      <ArtworkDetail artwork={selectedArt} onClose={() => setSelectedArt(null)} />
      
      {getFilteredArtworks().length > visibleCount && (
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 text-center"
        >
          <button 
            onClick={() => setVisibleCount(prev => prev + 4)}
            className="px-12 py-4 border border-border rounded-none text-xs font-bold uppercase tracking-[0.3em] hover:bg-white/5 transition-all text-[#666]"
          >
            Показать больше <span className="ml-2 opacity-40">{visibleCount} / {getFilteredArtworks().length}</span>
          </button>
        </motion.div>
      )}
    </section>
  );
};
