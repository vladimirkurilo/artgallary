import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { exhibitionService } from '../lib/api';
import { Exhibition } from '../types';
import { Calendar, MapPin, Play, Loader2, ArrowLeft, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export const ExhibitionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchExhibition();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-onyx flex items-center justify-center">
      <Loader2 className="animate-spin text-accent" size={48} />
    </div>
  );

  if (!exhibition) return (
    <div className="min-h-screen bg-onyx flex flex-col items-center justify-center space-y-6">
      <h1 className="text-4xl font-serif italic">Выставка не найдена</h1>
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
          
          <div className="max-w-4xl">
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
        </div>
      </div>

      {/* Content */}
      <div className="max-w-screen-2xl mx-auto px-10 py-24 grid grid-cols-1 lg:grid-cols-12 gap-24">
        <div className="lg:col-span-8 space-y-12">
          <div className="space-y-8">
            <h2 className="text-4xl font-serif italic">О концепции</h2>
            <div className="text-xl text-[#888] font-light leading-relaxed italic">
              {exhibition.description}
            </div>
          </div>
          
          {exhibition.videoUrl && (
             <div className="aspect-video bg-[#111] border border-border group relative cursor-pointer overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center z-10 transition-transform group-hover:scale-110">
                   <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-white">
                      <Play fill="currentColor" size={24} />
                   </div>
                </div>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-0" />
                <img src={exhibition.imageUrl} alt="Video Thumbnail" className="w-full h-full object-cover blur-[2px]" />
             </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-12">
           <div className="p-10 bg-[#0D0D0D] border border-border space-y-8">
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
                Записаться на просмотр
              </button>
           </div>

           <div className="p-10 border border-border/30">
              <p className="text-[9px] uppercase tracking-widest leading-relaxed text-[#444]">
                Все выставки ArtSphere проходят под эгидой глобального консорциума и защищены протоколом Nexus V.4.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
