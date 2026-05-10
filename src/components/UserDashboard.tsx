import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { artworkService } from '../lib/api';
import { Artwork } from '../types';
import { User, Package, Settings, LogOut, Layout, BarChart2, DollarSign, Upload, Plus, Eye, Trash2, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency } from '../lib/utils';
import { FileUploader } from './FileUploader';
import { Link } from 'react-router-dom';

interface ArtistStats {
  totalViews: number;
  totalSalesValue: number;
  salesCount: number;
  artworkStats: { id: number; title: string; views: number; salesCount: number }[];
}

export const UserDashboard: React.FC = () => {
  const { user, logout: signOut, isArtist } = useAuth();
  const [purchasedArtworks, setPurchasedArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'collection' | 'profile' | 'studio'>('collection');
  const [stats, setStats] = useState<ArtistStats | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newWork, setNewWork] = useState({ title: '', price: 0, description: '', imageUrl: '' });
  
  const [editingPriceId, setEditingPriceId] = useState<number | string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  const artistMode = isArtist(user);

  useEffect(() => {
    if (user) {
      fetchUserArtworks();
      if (artistMode && user.artistId) {
        fetchArtistStats();
      }
    }
  }, [user, artistMode]);

  const fetchArtistStats = async () => {
    try {
      const response = await fetch(`/api/artist-stats/${user?.artistId}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchUserArtworks = async () => {
    try {
      const data = await artworkService.getAll();
      if (Array.isArray(data)) {
        if (artistMode && user?.artistId) {
          const artistWorks = data.filter(art => art.artistId === user.artistId);
          setPurchasedArtworks(artistWorks);
        } else {
          // For regular users, show some "purchased" works for demo
          setPurchasedArtworks(data.slice(0, 2)); 
        }
      }
    } catch (error) {
      console.error("Error fetching user artworks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadWork = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await artworkService.create({
        ...newWork,
        artistId: user?.artistId,
        artistName: user?.displayName,
        status: 'AVAILABLE'
      });
      setIsUploading(false);
      setNewWork({ title: '', price: 0, description: '', imageUrl: '' });
      fetchUserArtworks();
      fetchArtistStats();
    } catch (error) {
      console.error("Error uploading work:", error);
    }
  };

  const handleUpdatePrice = async (artworkId: number | string) => {
    try {
      await artworkService.update(Number(artworkId), { price: tempPrice });
      setEditingPriceId(null);
      fetchUserArtworks();
    } catch (error) {
       console.error("Error updating price:", error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-40 px-10 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-serif italic mb-8">Войдите в систему</h1>
        <p className="text-[#666] mb-12">Пожалуйста, войдите в свой аккаунт, чтобы просмотреть личный кабинет.</p>
        <Link to="/" className="px-10 py-4 bg-accent text-white uppercase tracking-widest text-[10px] font-bold">На главную</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 pb-24 px-10 max-w-screen-2xl mx-auto font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="p-8 border border-border bg-[#0D0D0D] text-center">
            <div className="w-24 h-24 rotate-45 border border-accent/30 mx-auto mb-8 bg-[#222] overflow-hidden flex items-center justify-center">
               <img 
                 src={artistMode ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"}
                 alt="Profile"
                 className="w-full h-full object-cover -rotate-45 scale-125"
                 referrerPolicy="no-referrer"
               />
            </div>
            <h2 className="text-2xl font-serif italic mb-1 leading-tight">{artistMode ? user.displayName : 'Коллекционер'}</h2>
            <p className="text-[10px] uppercase tracking-widest text-[#666] mb-8">{user.email}</p>
            
            <div className="pt-8 border-t border-border flex flex-col gap-2">
              <button 
                onClick={() => setActiveTab('collection')}
                className={`py-4 text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-3 transition-all ${activeTab === 'collection' ? 'bg-accent text-white' : 'text-[#444] hover:text-white'}`}
              >
                <Package size={14} /> {artistMode ? 'Мои работы' : 'Моя коллекция'}
              </button>
              
              {artistMode && (
                <button 
                  onClick={() => setActiveTab('studio')}
                  className={`py-4 text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-3 transition-all ${activeTab === 'studio' ? 'bg-accent text-white' : 'text-[#444] hover:text-white'}`}
                >
                  <BarChart2 size={14} /> Студия
                </button>
              )}

              <button 
                onClick={() => setActiveTab('profile')}
                className={`py-4 text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-3 transition-all ${activeTab === 'profile' ? 'bg-accent text-white' : 'text-[#444] hover:text-white'}`}
              >
                <Settings size={14} /> Профиль
              </button>
              
              <button 
                onClick={signOut}
                className="py-4 text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-3 text-[#FF3E00] hover:bg-[#FF3E00]/10 transition-all font-mono"
              >
                <LogOut size={14} /> Выйти
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeTab === 'collection' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex justify-between items-end mb-12">
                  <h3 className="text-4xl font-serif italic">{artistMode ? 'Ваше творчество' : 'Ваши приобретения'}</h3>
                  {artistMode && (
                    <button 
                      onClick={() => setIsUploading(true)}
                      className="px-6 py-3 border border-accent text-accent hover:bg-accent hover:text-white transition-all text-[10px] uppercase tracking-widest font-bold flex items-center gap-2"
                    >
                      <Plus size={14} /> Загрузить работу
                    </button>
                  )}
                </div>

                {loading ? (
                  <div className="py-20 opacity-40">Синхронизация данных...</div>
                ) : purchasedArtworks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {purchasedArtworks.map(art => (
                      <div key={art.id} className="border border-border bg-[#0D0D0D] group relative">
                        <div className="aspect-[4/3] overflow-hidden border-b border-border">
                          <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-2">
                             <h4 className="text-xl font-serif">{art.title}</h4>
                             {artistMode ? (
                               editingPriceId === art.id ? (
                                 <div className="flex items-center gap-2">
                                   <input 
                                     type="number" 
                                     value={tempPrice ?? 0} 
                                     onChange={e => setTempPrice(Number(e.target.value))}
                                     className="w-20 bg-onyx border border-accent p-1 text-xs font-mono"
                                   />
                                   <button onClick={() => handleUpdatePrice(art.id)} className="text-green-500"><Plus size={14} /></button>
                                 </div>
                               ) : (
                                 <div className="flex items-center gap-2 group/price cursor-pointer" onClick={() => { setEditingPriceId(art.id); setTempPrice(art.price); }}>
                                   <div className="text-xs font-mono text-accent">{formatCurrency(art.price)}</div>
                                   <Edit size={10} className="opacity-0 group-hover/price:opacity-100 transition-opacity" />
                                 </div>
                               )
                             ) : (
                               <div className="text-xs font-mono text-accent">{formatCurrency(art.price)}</div>
                             )}
                          </div>
                          <p className="text-[10px] uppercase tracking-widest text-[#444] mb-4">
                            {artistMode ? `Просмотров: ${art.views || 0} // Продано: ${art.salesCount || 0}` : `От ${art.artistName}`}
                          </p>
                          <div className="flex gap-4">
                            <Link to={`/artwork/${art.id}`} className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#666] hover:text-white transition-colors flex items-center gap-2">
                               <Eye size={12} /> Просмотр
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 p-12 border border-dashed border-border text-center">
                    <p className="text-[#444] text-xs uppercase tracking-widest font-bold">
                      {artistMode ? 'У вас пока нет добавленных работ' : 'В вашей коллекции пока нет работ'}
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'studio' && stats && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-12">
                <h3 className="text-4xl font-serif italic">Аналитика Nexus</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-8 bg-[#0D0D0D] border border-border">
                    <div className="text-[10px] uppercase tracking-widest text-[#444] mb-2 flex items-center gap-2">
                      <Eye size={12} className="text-accent" /> Всего просмотров
                    </div>
                    <div className="text-3xl font-serif">{stats.totalViews.toLocaleString()}</div>
                  </div>
                  <div className="p-8 bg-[#0D0D0D] border border-border">
                    <div className="text-[10px] uppercase tracking-widest text-[#444] mb-2 flex items-center gap-2">
                      <DollarSign size={12} className="text-green-500" /> Объем продаж
                    </div>
                    <div className="text-3xl font-serif">{formatCurrency(stats.totalSalesValue)}</div>
                  </div>
                  <div className="p-8 bg-[#0D0D0D] border border-border">
                    <div className="text-[10px] uppercase tracking-widest text-[#444] mb-2 flex items-center gap-2">
                      <BarChart2 size={12} className="text-accent" /> Коэффициент
                    </div>
                    <div className="text-3xl font-serif">{((stats.salesCount / (stats.totalViews || 1)) * 100).toFixed(2)}%</div>
                  </div>
                </div>

                <div className="bg-[#0D0D0D] border border-border">
                   <div className="p-8 border-b border-border flex justify-between items-center">
                      <h4 className="text-xs uppercase tracking-widest font-bold">Показатели по работам</h4>
                      <BarChart2 size={16} className="text-[#333]" />
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="p-8 text-[10px] uppercase tracking-widest text-[#444] font-bold">Название</th>
                            <th className="p-8 text-[10px] uppercase tracking-widest text-[#444] font-bold">Просмотры</th>
                            <th className="p-8 text-[10px] uppercase tracking-widest text-[#444] font-bold">Продажи</th>
                            <th className="p-8 text-[10px] uppercase tracking-widest text-[#444] font-bold">Конверсия</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.artworkStats.map(art => (
                            <tr key={art.id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                              <td className="p-8 text-sm italic font-serif">{art.title}</td>
                              <td className="p-8 font-mono text-sm">{art.views}</td>
                              <td className="p-8 font-mono text-sm">{art.salesCount}</td>
                              <td className="p-8 font-mono text-xs text-accent">
                                {((art.salesCount / (art.views || 1)) * 100).toFixed(1)}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-xl space-y-12">
                <h3 className="text-4xl font-serif italic">Настройки личности</h3>
                <div className="p-12 border border-border bg-[#0D0D0D] space-y-8">
                  <div>
                    <p className="text-[#666] font-mono text-[10px] uppercase tracking-widest italic mb-2">Системный статус:</p>
                    <p className="text-white text-xl font-serif uppercase tracking-tighter">Активен. Идентификация подтверждена.</p>
                  </div>
                  <div>
                    <p className="text-[#666] font-mono text-[10px] uppercase tracking-widest italic mb-2">Роль:</p>
                    <p className="text-accent text-xl font-serif italic">{artistMode ? 'Художник Платформы' : 'Коллекционер'}</p>
                  </div>
                  <div className="pt-8 border-t border-border">
                    <p className="text-[10px] uppercase tracking-widest text-[#333] leading-relaxed">
                      Ваш аккаунт синхронизирован с глобальным протоколом ArtSphere Nexus. Все транзакции и взаимодействия записываются в распределенный реестр.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-onyx/90 backdrop-blur-md" onClick={() => setIsUploading(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-2xl bg-[#0D0D0D] border border-border p-12 relative z-10 shadow-2xl"
          >
            <h3 className="text-4xl font-serif italic mb-10">Новая материализация</h3>
            <form onSubmit={handleUploadWork} className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Название</label>
                  <input required value={newWork.title || ''} onChange={e => setNewWork({...newWork, title: e.target.value})} className="w-full bg-[#111] border border-border p-4 focus:border-accent font-serif italic" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Цена (ETH)</label>
                  <input required type="number" step="0.01" value={newWork.price ?? 0} onChange={e => setNewWork({...newWork, price: Number(e.target.value)})} className="w-full bg-[#111] border border-border p-4 focus:border-accent font-mono" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Изображение</label>
                <FileUploader onUploadSuccess={(url) => setNewWork({...newWork, imageUrl: url})} currentUrl={newWork.imageUrl || ''} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Описание концепции</label>
                <textarea required value={newWork.description || ''} onChange={e => setNewWork({...newWork, description: e.target.value})} className="w-full bg-[#111] border border-border p-4 focus:border-accent h-32 italic font-light" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 py-5 bg-accent text-white font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-all">
                  Разместить в Nexus
                </button>
                <button type="button" onClick={() => setIsUploading(false)} className="px-8 border border-border text-[#444] hover:text-white transition-colors uppercase text-[10px] font-bold tracking-widest">
                  Отмена
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
