import React, { useState, useEffect } from 'react';
import { artworkService } from '../lib/api';
import { Artwork } from '../types';
import { Trash2, Plus, X, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency } from '../lib/utils';
import { useAuth } from './AuthProvider';

export const AdminPanel: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const { user } = useAuth();
  
  const [newArtwork, setNewArtwork] = useState({
    title: '',
    artistName: '',
    price: 0,
    imageUrl: '',
    description: ''
  });

  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || user?.email === 'Vovkin06@gmail.com';

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      const data = await artworkService.getAll();
      if (Array.isArray(data)) {
        setArtworks(data);
      } else {
        setArtworks([]);
      }
    } catch (error) {
      console.error("Error fetching artworks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту работу?')) return;
    try {
      await artworkService.delete(id);
      setArtworks(artworks.filter(a => a.id !== id));
    } catch (error) {
      console.error("Error deleting artwork:", error);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const added = await artworkService.create({
        ...newArtwork,
        artistId: user?.email || 'admin',
        status: 'AVAILABLE'
      });
      setArtworks([...artworks, added]);
      setShowAddForm(false);
      setNewArtwork({
        title: '',
        artistName: '',
        price: 0,
        imageUrl: '',
        description: ''
      });
    } catch (error) {
      console.error("Error adding artwork:", error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-40 flex flex-col items-center justify-center text-center px-10">
        <ShieldAlert size={64} className="text-accent mb-8" />
        <h1 className="text-4xl font-serif italic mb-4">Доступ ограничен</h1>
        <p className="text-[#666] max-w-md">У вас нет прав администратора для доступа к этой панели.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 pb-24 px-10 max-w-screen-2xl mx-auto">
      <div className="flex justify-between items-end mb-16">
        <div>
          <span className="text-accent font-mono text-[10px] uppercase tracking-[0.4em] mb-4 block font-bold">Admin Protocol // V4.0</span>
          <h1 className="text-6xl font-serif italic tracking-tighter leading-none">Панель управления</h1>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="px-8 py-4 bg-accent text-white text-[10px] uppercase tracking-widest font-bold flex items-center gap-3 hover:scale-105 transition-all"
        >
          <Plus size={16} /> Добавить работу
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="py-20 text-center opacity-40">Загрузка протоколов...</div>
        ) : (
          artworks.map((artwork) => (
            <div key={artwork.id} className="flex items-center justify-between p-8 border border-border bg-[#0D0D0D] hover:border-accent transition-colors">
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 border border-border overflow-hidden">
                  <img src={artwork.imageUrl} alt={artwork.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-xl font-serif leading-none mb-2">{artwork.title}</h3>
                  <p className="text-[10px] uppercase tracking-widest text-[#666]">От {artwork.artistName} • {formatCurrency(artwork.price)}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleDelete(artwork.id)}
                  className="p-4 border border-border text-[#444] hover:text-accent hover:border-accent transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-onyx/95 backdrop-blur-xl flex items-center justify-center p-10"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-2xl bg-[#0D0D0D] border border-border p-12 relative"
            >
              <button 
                onClick={() => setShowAddForm(false)}
                className="absolute top-8 right-8 text-[#666] hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-3xl font-serif italic mb-8">Новая работа</h2>
              
              <form onSubmit={handleAdd} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Название</label>
                    <input 
                      required
                      type="text" 
                      value={newArtwork.title}
                      onChange={e => setNewArtwork({...newArtwork, title: e.target.value})}
                      className="w-full bg-[#111] border border-border p-4 focus:border-accent focus:outline-none transition-colors" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Художник</label>
                    <input 
                      required
                      type="text" 
                      value={newArtwork.artistName}
                      onChange={e => setNewArtwork({...newArtwork, artistName: e.target.value})}
                      className="w-full bg-[#111] border border-border p-4 focus:border-accent focus:outline-none transition-colors" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Цена (USD)</label>
                  <input 
                    required
                    type="number" 
                    value={newArtwork.price}
                    onChange={e => setNewArtwork({...newArtwork, price: Number(e.target.value)})}
                    className="w-full bg-[#111] border border-border p-4 focus:border-accent focus:outline-none transition-colors" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">URL Изображения</label>
                  <input 
                    required
                    type="url" 
                    value={newArtwork.imageUrl}
                    onChange={e => setNewArtwork({...newArtwork, imageUrl: e.target.value})}
                    className="w-full bg-[#111] border border-border p-4 focus:border-accent focus:outline-none transition-colors" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Описание</label>
                  <textarea 
                    value={newArtwork.description}
                    onChange={e => setNewArtwork({...newArtwork, description: e.target.value})}
                    className="w-full bg-[#111] border border-border p-4 h-32 focus:border-accent focus:outline-none transition-colors"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-accent text-white font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-all"
                >
                  Создать запись
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
