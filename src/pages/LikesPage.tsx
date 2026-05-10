import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Palette, Calendar, ArrowRight } from 'lucide-react';
import { useLikes } from '../components/LikesProvider';
import { artworkService, artistService, exhibitionService } from '../lib/api';
import { Artwork, Artist, Exhibition } from '../types';
import { ArtCard } from '../components/ArtCard';
import { Link } from 'react-router-dom';

export const LikesPage: React.FC = () => {
  const { likedArtworks, likedArtists, likedExhibitions } = useLikes();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'artworks' | 'artists' | 'exhibitions'>('artworks');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [allArt, allArtists, allExhibitions] = await Promise.all([
          artworkService.getAll(),
          artistService.getAll(),
          exhibitionService.getAll()
        ]);

        setArtworks(allArt.filter(a => likedArtworks.includes(String(a.id))));
        setArtists(allArtists.filter(a => likedArtists.includes(String(a.id))));
        setExhibitions(allExhibitions.filter(e => likedExhibitions.includes(String(e.id))));
      } catch (error) {
        console.error("Error fetching liked content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [likedArtworks, likedArtists, likedExhibitions]);

  const tabs = [
    { id: 'artworks', label: 'Работы', icon: Palette, count: artworks.length },
    { id: 'artists', label: 'Художники', icon: Palette, count: artists.length },
    { id: 'exhibitions', label: 'Выставки', icon: Calendar, count: exhibitions.length },
  ];

  return (
    <div className="min-h-screen bg-onyx pt-32 pb-20 px-10">
      <div className="max-w-screen-2xl mx-auto">
        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-accent font-mono text-[10px] uppercase tracking-[0.4em] mb-4 block font-bold">Избранное пользователя</span>
            <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter leading-none mb-8">Коллекция<span className="text-accent">.</span></h1>
          </motion.div>

          <div className="flex gap-8 border-b border-border">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-4 text-[10px] uppercase tracking-widest font-bold transition-all flex items-center gap-2 ${
                  activeTab === tab.id ? 'text-accent border-b border-accent' : 'text-[#444] hover:text-[#888]'
                }`}
              >
                <tab.icon size={12} />
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="aspect-[4/5] bg-[#111] animate-pulse" />)}
          </div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="min-h-[400px]"
          >
            {activeTab === 'artworks' && (
              artworks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {artworks.map((art, i) => <ArtCard key={art.id} artwork={art} index={i} />)}
                </div>
              ) : (
                <EmptyState icon={Heart} message="У вас пока нет любимых работ" />
              )
            )}

            {activeTab === 'artists' && (
              artists.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {artists.map((artist, index) => (
                    <Link key={artist.id} to={`/artist/${artist.id}`}>
                      <div className="group bg-[#0D0D0D] border border-border p-10 hover:border-accent transition-all">
                        <div className="w-16 h-16 rotate-45 border border-border bg-onyx overflow-hidden group-hover:border-accent transition-colors mb-8">
                          <img src={artist.avatarUrl} alt={artist.name} className="w-full h-full object-cover -rotate-45 scale-125" referrerPolicy="no-referrer" />
                        </div>
                        <h3 className="text-2xl font-serif italic mb-2">{artist.name}</h3>
                        <p className="text-[10px] text-accent font-mono uppercase tracking-widest">{artist.specialty}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState icon={Palette} message="Список художников пуст" />
              )
            )}

            {activeTab === 'exhibitions' && (
              exhibitions.length > 0 ? (
                <div className="grid grid-cols-1 gap-8">
                  {exhibitions.map((exh) => (
                    <Link key={exh.id} to={`/exhibition/${exh.id}`}>
                      <div className="group flex flex-col md:flex-row border border-border bg-[#0a0a0a] hover:border-accent transition-all overflow-hidden">
                        <div className="md:w-1/3 aspect-video">
                          <img src={exh.imageUrl} alt={exh.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
                        </div>
                        <div className="p-8 flex flex-col justify-center">
                          <h3 className="text-3xl font-serif italic mb-4">{exh.title}</h3>
                          <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-[#444]">
                            Смотреть детали <ArrowRight size={14} className="text-accent" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState icon={Calendar} message="Вы еще не добавили ни одной выставки" />
              )
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ icon: Icon, message }: { icon: any, message: string }) => (
  <div className="flex flex-col items-center justify-center py-40 border border-dashed border-border text-[#444]">
    <Icon size={48} strokeWidth={1} className="mb-6 opacity-20" />
    <p className="text-[10px] uppercase tracking-[0.4em] font-bold">{message}</p>
  </div>
);
