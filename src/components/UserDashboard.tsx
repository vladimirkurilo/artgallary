import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { artworkService } from '../lib/api';
import { Artwork } from '../types';
import { User, Package, Settings, LogOut, Layout } from 'lucide-react';
import { motion } from 'motion/react';
import { formatCurrency } from '../lib/utils';

export const UserDashboard: React.FC = () => {
  const { user, profile, logout: signOut, isArtist } = useAuth();
  const [purchasedArtworks, setPurchasedArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'collection' | 'profile' | 'artist-tools'>('collection');

  const artistMode = isArtist(user);

  useEffect(() => {
    if (user) {
      fetchUserArtworks();
    }
  }, [user]);

  const fetchUserArtworks = async () => {
    try {
      // Имитируем данные для демо
      const data = await artworkService.getAll();
      if (Array.isArray(data)) {
        if (artistMode) {
          // Если художник, показываем его работы
          setPurchasedArtworks(data.slice(0, 3)); 
        } else {
          setPurchasedArtworks(data.slice(0, 2)); 
        }
      } else {
        setPurchasedArtworks([]);
      }
    } catch (error) {
      console.error("Error fetching user artworks:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-40 px-10 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-serif italic mb-8">Войдите в систему</h1>
        <p className="text-[#666] mb-12">Пожалуйста, войдите в свой аккаунт, чтобы просмотреть личный кабинет.</p>
        <button onClick={() => window.location.href='/'} className="px-10 py-4 bg-accent text-white uppercase tracking-widest text-[10px] font-bold">На главную</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 pb-24 px-10 max-w-screen-2xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
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
            <h2 className="text-2xl font-serif italic mb-1 leading-tight">{artistMode ? 'Художник' : 'Коллекционер'}</h2>
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
                  onClick={() => window.location.href='/admin'}
                  className="py-4 text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-3 text-accent border border-accent/20 hover:bg-accent/10 transition-all"
                >
                  <Layout size={14} /> Управление артом
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
                className="py-4 text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-3 text-[#FF3E00] hover:bg-[#FF3E00]/10 transition-all"
              >
                <LogOut size={14} /> Выйти
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {activeTab === 'collection' ? (
            <div>
              <h3 className="text-4xl font-serif italic mb-12">{artistMode ? 'Ваше творчество' : 'Ваши приобретения'}</h3>
              {loading ? (
                <div className="py-20 opacity-40">Синхронизация данных...</div>
              ) : purchasedArtworks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {purchasedArtworks.map(art => (
                    <div key={art.id} className="border border-border bg-[#0D0D0D] group cursor-pointer" onClick={() => window.location.href=`/artwork/${art.id}`}>
                      <div className="aspect-[4/3] overflow-hidden border-b border-border">
                        <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                      <div className="p-6">
                        <h4 className="text-xl font-serif mb-1">{art.title}</h4>
                        <p className="text-[10px] uppercase tracking-widest text-[#666] mb-4">{artistMode ? 'Просмотров: 1.2k' : `От ${art.artistName}`}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 p-12 border border-dashed border-border text-center">
                  <p className="text-[#444] text-xs uppercase tracking-widest font-bold mb-8">
                    {artistMode ? 'У вас пока нет добавленных работ' : 'В вашей коллекции пока нет работ'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-xl">
              <h3 className="text-4xl font-serif italic mb-12">Настройки личности</h3>
              <div className="p-12 border border-border bg-[#0D0D0D]">
                <p className="text-[#666] font-mono text-[10px] uppercase tracking-widest italic mb-4">Системный статус:</p>
                <p className="text-white text-xl font-serif">Активен. Идентификация подтверждена как {artistMode ? 'Художник' : 'Коллекционер'}.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
