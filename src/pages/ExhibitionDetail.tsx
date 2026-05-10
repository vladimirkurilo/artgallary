import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { exhibitionService } from '../lib/api';
import { Exhibition, Review } from '../types';
import { Calendar, MapPin, Play, Loader2, ArrowLeft, Clock, MessageSquare, Star, User, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { ArtCard } from '../components/ArtCard';
import { useAuth } from '../components/AuthProvider';
import { useLikes } from '../components/LikesProvider';

export const ExhibitionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ comment: '', rating: 5 });
  const { user } = useAuth();
  const { toggleLikeExhibition, isLikedExhibition } = useLikes();

  const liked = isLikedExhibition(String(id));

  const fetchExhibition = async () => {
    try {
      const data = await exhibitionService.getById(Number(id));
      setExhibition(data);
    } catch (error) {
      console.error("Error fetching exhibition:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExhibition();
  }, [id]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('Войдите, чтобы оставить отзыв');
    try {
      await fetch(`/api/exhibitions/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newReview,
          userId: user.email,
          userName: user.displayName || user.email
        })
      });
      setNewReview({ comment: '', rating: 5 });
      fetchExhibition();
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-onyx flex items-center justify-center">
      <Loader2 className="animate-spin text-accent" size={48} />
    </div>
  );

  if (!exhibition) return (
    <div className="min-h-screen bg-onyx flex flex-col items-center justify-center space-y-6">
      <h1 className="text-4xl font-serif italic text-white">Выставка не найдена</h1>
      <Link to="/exhibitions" className="text-accent uppercase tracking-widest text-xs border-b border-accent pb-1">Вернуться к списку</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-onyx text-white">
      {/* Hero Section */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-onyx/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx via-transparent to-transparent z-10" />
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src={exhibition.imageUrl} 
          alt={exhibition.title} 
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-10 md:p-24 max-w-screen-2xl mx-auto w-full">
          <Link to="/exhibitions" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 text-[10px] uppercase tracking-widest font-bold">
            <ArrowLeft size={14} /> Назад к выставкам
          </Link>
          
          <div className="max-w-4xl flex items-end justify-between w-full">
            <div>
              <span className={`inline-block px-3 py-1 mb-6 text-[10px] uppercase tracking-widest font-bold border ${exhibition.status === 'ACTIVE' ? 'border-accent text-accent' : 'border-[#444] text-[#444]'}`}>
                {exhibition.status === 'ACTIVE' ? 'Live Now' : 'Upcoming'}
              </span>
              <h1 className="text-7xl md:text-9xl font-serif italic mb-8 tracking-tighter leading-none">{exhibition.title}</h1>
              
              <div className="flex flex-wrap gap-10 items-center">
                <div className="flex items-center gap-3 text-xs uppercase tracking-widest font-bold">
                  <Calendar size={18} className="text-accent" />
                  <span>{exhibition.startDate} — {exhibition.endDate}</span>
                </div>
                <div className="flex items-center gap-3 text-xs uppercase tracking-widest font-bold">
                  <MapPin size={18} className="text-accent" />
                  <span>{exhibition.location}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => toggleLikeExhibition(String(exhibition.id))}
              className={`p-6 border transition-all mb-4 ${liked ? 'bg-accent border-accent text-white' : 'border-white/20 bg-black/20 backdrop-blur-md text-white hover:border-accent'}`}
            >
              <Heart size={24} className={liked ? 'fill-white' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-screen-2xl mx-auto px-10 py-24 grid grid-cols-1 lg:grid-cols-12 gap-24 font-sans">
        <div className="lg:col-span-8 space-y-24">
          {/* Concept */}
          <div className="space-y-8">
            <h2 className="text-4xl font-serif italic">О концепции</h2>
            <div className="text-xl text-[#888] font-light leading-relaxed italic">
              {exhibition.description}
            </div>
          </div>
          
          {/* Artworks */}
          <div className="space-y-12">
            <h2 className="text-4xl font-serif italic">Картины в экспозиции</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {exhibition.artworks?.map((art, idx) => (
                <Link key={art.id} to={`/artwork/${art.id}`}>
                  <ArtCard 
                    artwork={art} 
                    index={idx}
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Artists */}
          <div className="space-y-12">
            <h2 className="text-4xl font-serif italic">Художники-участники</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {exhibition.artists?.map((artist) => (
                <Link key={artist.id} to={`/artist/${artist.id}`} className="group p-6 bg-[#0D0D0D] border border-border hover:border-accent transition-all">
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-6 border border-border group-hover:border-accent transition-all">
                    <img src={artist.avatarUrl} alt={artist.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-lg font-serif italic group-hover:text-accent transition-colors">{artist.name}</h3>
                  <p className="text-[10px] uppercase tracking-widest text-[#444] mt-2">{artist.specialty}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="space-y-12 border-t border-border pt-24">
            <h2 className="text-4xl font-serif italic flex items-center gap-4">
              Отзывы <MessageSquare size={24} className="text-accent" />
            </h2>
            
            <div className="space-y-8">
              {exhibition.reviews?.map((review) => (
                <div key={review.id} className="p-8 bg-[#0D0D0D] border border-border">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                        <User size={14} className="text-accent" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-widest">{review.userName}</div>
                        <div className="text-[9px] text-[#444]">{new Date(review.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex text-accent">
                      {[...Array(review.rating)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                    </div>
                  </div>
                  <p className="text-[#888] italic leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleAddReview} className="p-10 border border-accent/20 bg-accent/5 space-y-6">
              <h3 className="text-xl font-serif italic mb-4">Оставить свой отзыв</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                   {[1,2,3,4,5].map(v => (
                     <button type="button" key={v} onClick={() => setNewReview({...newReview, rating: v})} className={`p-2 border ${newReview.rating >= v ? 'border-accent text-accent' : 'border-border text-[#444]'}`}>
                        <Star size={16} fill={newReview.rating >= v ? "currentColor" : "none"} />
                     </button>
                   ))}
                </div>
                <textarea 
                  value={newReview.comment} 
                  onChange={e => setNewReview({...newReview, comment: e.target.value})}
                  placeholder="Ваше впечатление о выставке..."
                  className="w-full bg-[#111] border border-border p-6 text-sm focus:border-accent focus:outline-none h-32 transition-colors italic"
                  required
                />
                <button type="submit" className="w-full py-5 bg-accent text-white font-bold uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all">
                  Отправить в Nexus
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-12">
           <div className="p-10 bg-[#0D0D0D] border border-border space-y-8 sticky top-32">
              <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-[#666]">Информация</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-border flex items-center justify-center text-accent">
                    <Clock size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest font-bold text-[#444] mb-1">Режим работы</div>
                    <div className="text-sm">24/7 Цифровой доступ</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-border flex items-center justify-center text-accent">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest font-bold text-[#444] mb-1">Местоположение</div>
                    <div className="text-sm">{exhibition.location}</div>
                  </div>
                </div>
              </div>

              <button className="w-full py-5 border border-accent text-accent hover:bg-accent hover:text-white transition-all font-bold uppercase tracking-widest text-[10px]">
                Архивные данные
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
