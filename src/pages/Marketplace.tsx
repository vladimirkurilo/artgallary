import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, Search, Grid, List as ListIcon, ChevronDown } from 'lucide-react';
import { artworkService } from '../lib/api';
import { Artwork } from '../types';
import { ArtCard } from '../components/ArtCard';
import { ArtworkDetail } from '../components/ArtworkDetail';

export const Marketplace: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArt, setSelectedArt] = useState<Artwork | null>(null);
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(4);

  const categories = ['All', 'Generative', 'Minimalism', '3D Scape', 'Neon'];

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
        // Fallback same as ArtGrid but expanded
        setArtworks([
          {
            id: 1,
            title: 'Эфирный поток',
            artistName: 'Серафина Блэк',
            price: 1250,
            imageUrl: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=800',
            views: 0,
            salesCount: 0,
            status: 'AVAILABLE',
            artistId: 1,
            description: 'Исследование процедурной генерации.',
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            title: 'Обсидиановая структура',
            artistName: 'Маркус Вольт',
            price: 3400,
            imageUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800',
            views: 0,
            salesCount: 0,
            status: 'AVAILABLE',
            artistId: 2,
            description: 'Бруталистская цифровая архитектура.',
            createdAt: new Date().toISOString()
          },
          {
            id: 3,
            title: 'Золотой горизонт',
            artistName: 'Елена Рэй',
            price: 850,
            imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800',
            views: 0,
            salesCount: 0,
            status: 'SOLD',
            artistId: 3,
            description: 'Теплый минималистичный свет.',
            createdAt: new Date().toISOString()
          },
          {
            id: 4,
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
            id: 5,
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
            id: 6,
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
            id: 7,
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
          },
          {
            id: 8,
            title: 'Кибер Панк',
            artistName: 'Серафина Блэк',
            price: 2800,
            imageUrl: 'https://images.unsplash.com/photo-1614728263952-84ea206f99b6?auto=format&fit=crop&q=80&w=800',
            views: 0,
            salesCount: 0,
            status: 'AVAILABLE',
            artistId: 1,
            description: 'Будущее уже наступило.',
            createdAt: "2024-05-05T11:00:00Z"
          }
        ]);
      }
    } catch (error) {
      console.error("Error fetching marketplace data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArtworks = artworks.filter(art => 
    (category === 'All' || art.description?.toLowerCase().includes(category.toLowerCase())) &&
    art.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-32 pb-20 px-10 bg-[#050505]">
      <div className="max-w-screen-2xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
          <div>
            <span className="text-accent font-mono text-[10px] uppercase tracking-[0.4em] mb-4 block">Открытый рынок // Index-A</span>
            <h1 className="text-7xl font-serif italic mb-6 tracking-tighter">Маркетплейс<span className="text-accent">.</span></h1>
            <p className="text-[#666] max-w-xl text-sm leading-relaxed">
              Эксклюзивные цифровые активы от лучших художников мира. Протоколы владения подтверждены в блокчейне.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
             <div className="relative">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]" />
                <input 
                  type="text" 
                  placeholder="Поиск по названию..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-onyx border border-border pl-12 pr-6 py-4 text-[10px] uppercase tracking-widest font-bold focus:border-accent outline-none w-64"
                />
             </div>
             
             <div className="flex bg-onyx border border-border p-1">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-3 text-[9px] uppercase tracking-widest font-bold transition-all ${
                      category === cat ? 'bg-accent text-white' : 'text-[#666] hover:text-white'
                    }`}
                  >
                    {cat === 'All' ? 'Все' : cat}
                  </button>
                ))}
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-8 gap-y-16">
          {filteredArtworks.slice(0, visibleCount).map((art, index) => (
            <div key={art.id} onClick={() => setSelectedArt(art)}>
              <ArtCard artwork={art} index={index} />
            </div>
          ))}
        </div>

        {filteredArtworks.length > visibleCount && (
          <div className="mt-20 text-center">
            <button 
              onClick={() => setVisibleCount(prev => prev + 4)}
              className="px-12 py-4 border border-border rounded-none text-xs font-bold uppercase tracking-[0.3em] hover:bg-white/5 transition-all text-[#666]"
            >
              Показать больше <span className="ml-2 opacity-40">{visibleCount} / {filteredArtworks.length}</span>
            </button>
          </div>
        )}

        {filteredArtworks.length === 0 && !loading && (
          <div className="py-40 text-center flex flex-col items-center">
            <div className="w-20 h-20 rotate-45 border border-border mb-10 flex items-center justify-center opacity-30">
               <Grid size={24} className="-rotate-45" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#444]">Работы не найдены в текущем секторе</p>
          </div>
        )}
      </div>

      <ArtworkDetail artwork={selectedArt} onClose={() => setSelectedArt(null)} />
    </div>
  );
};
