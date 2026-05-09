import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { artworkService } from '../lib/api';
import { Artwork } from '../types';
import { ShoppingCart, ShieldCheck, Heart, Loader2, ArrowLeft, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency } from '../lib/utils';
import { useAuth } from '../components/AuthProvider';
import { useCart } from '../components/CartProvider';

export const ArtworkDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const data = await artworkService.getById(Number(id));
        setArtwork(data);
      } catch (error) {
        console.error("Error fetching artwork:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArtwork();
  }, [id]);

  const handleAddToCart = () => {
    if (!artwork) return;
    setAdding(true);
    addItem(artwork);
    setTimeout(() => setAdding(false), 1000);
  };

  if (loading) return (
    <div className="min-h-screen bg-onyx flex items-center justify-center">
      <Loader2 className="animate-spin text-accent" size={48} />
    </div>
  );

  if (!artwork) return (
    <div className="min-h-screen bg-onyx flex flex-col items-center justify-center space-y-6 text-white">
      <h1 className="text-4xl font-serif italic text-white">Работа не найдена</h1>
      <Link to="/marketplace" className="text-accent uppercase tracking-widest text-xs border-b border-accent pb-1">Вернуться в маркетплейс</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-onyx text-white pt-32 pb-24">
      <div className="max-w-screen-2xl mx-auto px-10">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-[#666] hover:text-white transition-colors mb-12 text-[10px] uppercase tracking-widest font-bold">
          <ArrowLeft size={14} /> К списку работ
        </Link>

        <div className="flex flex-col lg:flex-row gap-20">
          {/* Left: Image Container */}
          <div className="lg:w-3/5 bg-[#050505] border border-border relative aspect-square lg:aspect-auto flex items-center justify-center group overflow-hidden">
             <motion.img 
               initial={{ scale: 1.1, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               src={artwork.imageUrl} 
               alt={artwork.title}
               className="w-full h-full object-contain p-20 z-10 transition-transform duration-1000 group-hover:scale-110"
               referrerPolicy="no-referrer"
             />
             <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-accent/30 pointer-events-none" />
             <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-accent/30 pointer-events-none" />
             
             <button className="absolute bottom-10 left-10 z-20 flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] text-[#444] hover:text-accent transition-colors bg-onyx/50 backdrop-blur-md px-4 py-2 border border-border">
               <ZoomIn size={14} /> Детализация
             </button>
          </div>

          {/* Right: Info */}
          <div className="lg:w-2/5 flex flex-col justify-center">
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-accent font-mono text-[10px] uppercase tracking-[0.5em]">L-SYS #882</span>
                <div className="flex-1 h-[1px] bg-border/30" />
              </div>
              <h1 className="text-6xl md:text-8xl font-serif italic mb-6 tracking-tighter leading-[0.85]">{artwork.title}</h1>
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-[#666]">
                <Link to={`/artist/${artwork.artistId}`} className="hover:text-accent transition-colors">Автор: {artwork.artistName}</Link>
                <div className="w-1 h-1 rounded-full bg-accent" />
                <span>Оригинал</span>
              </div>
            </div>

            <p className="text-lg font-light text-[#888] mb-12 leading-relaxed italic max-w-lg">
              {artwork.description || "Концептуальное исследование материальной памяти и цифрового шума. Работа анализирует границы между осязаемым и эфемерным."}
            </p>

            <div className="p-10 bg-[#0D0D0D] border border-border mb-12">
              <div className="flex justify-between items-end mb-10">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#444] mb-3">Стоимость актива</div>
                  <div className="text-4xl font-mono text-accent font-bold tracking-tighter">{formatCurrency(artwork.price)}</div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="flex-1 py-5 bg-accent text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
                >
                  <AnimatePresence mode="wait">
                    {adding ? (
                      <motion.span key="added" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>В корзине</motion.span>
                    ) : (
                      <motion.div key="cart" className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <ShoppingCart size={16} /> Добавить в корзину
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
                <button className="w-16 border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-all">
                   <Heart size={20} />
                </button>
              </div>
            </div>

            <div className="pt-12 border-t border-border flex flex-col gap-6">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-[#444]">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-green-500" /> ВерификацияNexus v4
                </div>
                <div className="font-mono">HASH: 0x82A...F9E</div>
              </div>
              <p className="text-[9px] text-[#444] leading-relaxed uppercase tracking-widest">
                Приобретая данный актив, вы получаете полное право владения инструментом материализации и цифровым сертификатом подлинности.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
