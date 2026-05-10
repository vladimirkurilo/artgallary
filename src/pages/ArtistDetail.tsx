import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { artistService } from '../lib/api';
import { Artist, Artwork } from '../types';
import { MapPin, Palette, Award, Loader2, ArrowLeft, ArrowRight, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { ArtCard } from '../components/ArtCard';
import { useLikes } from '../components/LikesProvider';

export const ArtistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const { toggleLikeArtist, isLikedArtist } = useLikes();

  const liked = isLikedArtist(String(id));

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const data = await artistService.getById(Number(id));
        setArtist(data);
      } catch (error) {
        console.error("Error fetching artist:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArtist();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-onyx flex items-center justify-center">
      <Loader2 className="animate-spin text-accent" size={48} />
    </div>
  );

  if (!artist) return (
    <div className="min-h-screen bg-onyx flex flex-col items-center justify-center space-y-6">
      <h1 className="text-4xl font-serif italic">Художник не найден</h1>
      <Link to="/artists" className="text-accent uppercase tracking-widest text-xs border-b border-accent pb-1">Вернуться к списку</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-onyx text-white pt-32 pb-24">
      <div className="max-w-screen-2xl mx-auto px-10">
        <Link to="/artists" className="inline-flex items-center gap-2 text-[#666] hover:text-white transition-colors mb-12 text-[10px] uppercase tracking-widest font-bold">
          <ArrowLeft size={14} /> Назад к художникам
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          {/* Left: Identity */}
          <div className="lg:col-span-5 space-y-12">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 border-t-2 border-l-2 border-accent/20 z-0" />
              <div className="relative aspect-square bg-[#111] overflow-hidden border border-border z-10 shadow-2xl">
                <img src={artist.avatarUrl} alt={artist.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 border-b-2 border-r-2 border-accent/20 z-0" />
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-1 p-6 bg-[#0D0D0D] border border-border">
                  <div className="text-[10px] uppercase tracking-widest text-[#666] mb-2 flex items-center gap-2">
                    <MapPin size={12} className="text-accent" /> Локация
                  </div>
                  <div className="text-sm font-medium">{artist.location}</div>
                </div>
                <div className="flex-1 p-6 bg-[#0D0D0D] border border-border">
                  <div className="text-[10px] uppercase tracking-widest text-[#666] mb-2 flex items-center gap-2">
                    <Award size={12} className="text-accent" /> Выставки
                  </div>
                  <div className="text-sm font-medium">{artist.exhibitionCount} завершено</div>
                </div>
              </div>
              
              <div className="p-6 bg-[#0D0D0D] border border-border">
                <div className="text-[10px] uppercase tracking-widest text-[#666] mb-2 flex items-center gap-2">
                  <Palette size={12} className="text-accent" /> Специализация
                </div>
                <div className="text-sm font-medium italic">{artist.specialty}</div>
              </div>
            </div>
          </div>

          {/* Right: Bio & Works */}
          <div className="lg:col-span-7 space-y-16">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-accent font-mono text-[10px] uppercase tracking-[0.5em] mb-4 block">Досье художника</span>
                <h1 className="text-7xl md:text-8xl font-serif italic mb-8 tracking-tighter leading-none">{artist.name}</h1>
              </div>
              <button 
                onClick={() => toggleLikeArtist(String(artist.id))}
                className={`p-6 border border-border group transition-all ${liked ? 'bg-[#1a1a1a] border-accent text-accent' : 'hover:border-accent hover:bg-[#1a1a1a]'}`}
              >
                <Heart size={24} className={liked ? 'fill-accent' : ''} />
              </button>
            </div>

            <div className="pt-16 border-t border-border/50">
              <h2 className="text-3xl font-serif italic mb-12">Избранные работы</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {artist.artworks?.map((artwork, idx) => (
                  <motion.div
                    key={artwork.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link to={`/artwork/${artwork.id}`}>
                      <ArtCard 
                        artwork={artwork} 
                        index={idx}
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {artist.exhibitions && artist.exhibitions.length > 0 && (
              <div className="pt-16 border-t border-border/50">
                <h2 className="text-3xl font-serif italic mb-12">Участие в выставках</h2>
                <div className="space-y-6">
                  {artist.exhibitions.map((exh) => (
                    <Link key={exh.id} to={`/exhibition/${exh.id}`} className="group flex items-center justify-between p-8 bg-[#0D0D0D] border border-border hover:border-accent transition-all">
                      <div>
                        <h4 className="text-xl font-serif italic group-hover:text-accent transition-colors">{exh.title}</h4>
                        <p className="text-[10px] uppercase tracking-widest text-[#444] mt-2">{exh.startDate} — {exh.endDate}</p>
                      </div>
                      <ArrowRight size={20} className="text-[#333] group-hover:text-accent transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
