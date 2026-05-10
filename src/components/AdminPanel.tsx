import React, { useState, useEffect } from 'react';
import { artworkService, exhibitionService, artistService } from '../lib/api';
import { Artwork, Exhibition, Artist } from '../types';
import { Trash2, Plus, X, ShieldAlert, Layout, Users, Calendar, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency } from '../lib/utils';
import { useAuth } from './AuthProvider';
import { FileUploader } from './FileUploader';

type Tab = 'artworks' | 'artists' | 'exhibitions';

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('artworks');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, profile, loading: authLoading, isAdmin: checkAdmin } = useAuth();
  
  const [newArtwork, setNewArtwork] = useState({
    title: '',
    artistName: '',
    price: 0,
    imageUrl: '',
    description: '',
    royaltyRate: 10
  });

  const [newArtist, setNewArtist] = useState({
    name: '',
    bio: '',
    specialty: '',
    avatarUrl: '',
    location: '',
    artworkCount: 0
  });

  const [newExhibition, setNewExhibition] = useState({
    title: '',
    description: '',
    imageUrl: '',
    videoUrl: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    location: '',
    status: 'UPCOMING'
  });

  const isAdmin = checkAdmin(user) || checkAdmin(profile);

  useEffect(() => {
    if (!authLoading) {
      console.log('Admin Access Check:', { 
        email: user?.email, 
        roles: user?.roles, 
        isAdmin 
      });
    }
  }, [user, isAdmin, authLoading]);

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      let data: any[] = [];
      if (activeTab === 'artworks') data = await artworkService.getAll();
      else if (activeTab === 'artists') data = await artistService.getAll();
      else if (activeTab === 'exhibitions') data = await exhibitionService.getAll();
      
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm(`Вы уверены, что хотите удалить этот объект (${activeTab})?`)) return;
    try {
      if (activeTab === 'artworks') await artworkService.delete(id);
      else if (activeTab === 'artists') await artistService.delete(id);
      else if (activeTab === 'exhibitions') await exhibitionService.delete(id);
      
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error(`Error deleting ${activeTab}:`, error);
    }
  };

  const handleAddArtwork = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (!newArtwork.imageUrl) {
        setError('Пожалуйста, загрузите изображение или укажите ссылку на него.');
        return;
      }
      if (editingItem) {
        const updated = await artworkService.update(editingItem.id, newArtwork);
        setItems(items.map(item => item.id === editingItem.id ? updated : item));
      } else {
        const added = await artworkService.create({
          ...newArtwork,
          artistId: user?.email || 'admin',
          status: 'AVAILABLE'
        });
        setItems([...items, added]);
      }
      setShowAddForm(false);
      setEditingItem(null);
      setNewArtwork({ title: '', artistName: '', price: 0, imageUrl: '', description: '', royaltyRate: 10 });
    } catch (err: any) {
      console.error("Error saving artwork:", err);
      setError(err.response?.data?.error || 'Ошибка при сохранении работы.');
    }
  };

  const handleAddArtist = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingItem) {
        const updated = await artistService.update(editingItem.id, newArtist);
        setItems(items.map(item => item.id === editingItem.id ? updated : item));
      } else {
        const added = await artistService.create(newArtist);
        setItems([...items, added]);
      }
      setShowAddForm(false);
      setEditingItem(null);
      setNewArtist({ name: '', bio: '', specialty: '', avatarUrl: '', location: '', artworkCount: 0 });
    } catch (err: any) {
      console.error("Error saving artist:", err);
      setError(err.response?.data?.error || 'Ошибка при сохранении профиля художника.');
    }
  };

  const handleAddExhibition = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (!newExhibition.imageUrl) {
        setError('Пожалуйста, загрузите обложку выставки.');
        return;
      }
      if (editingItem) {
        const updated = await exhibitionService.update(editingItem.id, newExhibition);
        setItems(items.map(item => item.id === editingItem.id ? updated : item));
      } else {
        const added = await exhibitionService.create(newExhibition);
        setItems([...items, added]);
      }
      setShowAddForm(false);
      setEditingItem(null);
      setNewExhibition({
        title: '', description: '', imageUrl: '', videoUrl: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        location: '', status: 'UPCOMING'
      });
    } catch (err: any) {
      console.error("Error saving exhibition:", err);
      setError(err.response?.data?.error || 'Ошибка при сохранении выставки.');
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    if (activeTab === 'artworks') {
      setNewArtwork({
        title: item.title || '',
        artistName: item.artistName || '',
        price: item.price || 0,
        imageUrl: item.imageUrl || '',
        description: item.description || '',
        royaltyRate: item.royaltyRate || 10
      });
    } else if (activeTab === 'artists') {
      setNewArtist({
        name: item.name || '',
        bio: item.bio || '',
        specialty: item.specialty || '',
        avatarUrl: item.avatarUrl || '',
        location: item.location || '',
        artworkCount: item.artworkCount || 0
      });
    } else if (activeTab === 'exhibitions') {
      setNewExhibition({
        title: item.title || '',
        description: item.description || '',
        imageUrl: item.imageUrl || '',
        videoUrl: item.videoUrl || '',
        startDate: item.startDate || '',
        endDate: item.endDate || '',
        location: item.location || '',
        status: item.status || 'UPCOMING'
      });
    }
    setShowAddForm(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen pt-40 flex flex-col items-center justify-center text-center px-10">
        <div className="w-10 h-10 border border-t-accent border-border rounded-full animate-spin mb-8"></div>
        <p className="text-[#666] uppercase tracking-[0.2em] text-[10px]">Синхронизация протоколов...</p>
      </div>
    );
  }

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <div>
          <span className="text-accent font-mono text-[10px] uppercase tracking-[0.4em] mb-4 block font-bold">Admin Protocol // V5.0</span>
          <h1 className="text-6xl font-serif italic tracking-tighter leading-none">Управление платформой</h1>
        </div>
        
        <div className="flex gap-4 p-1 bg-[#111] border border-border">
          <button 
            onClick={() => setActiveTab('artworks')}
            className={`px-6 py-3 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 transition-all ${activeTab === 'artworks' ? 'bg-accent text-white' : 'text-[#555] hover:text-white'}`}
          >
            <Layout size={14} /> Работы
          </button>
          <button 
            onClick={() => setActiveTab('artists')}
            className={`px-6 py-3 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 transition-all ${activeTab === 'artists' ? 'bg-accent text-white' : 'text-[#555] hover:text-white'}`}
          >
            <Users size={14} /> Художники
          </button>
          <button 
            onClick={() => setActiveTab('exhibitions')}
            className={`px-6 py-3 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 transition-all ${activeTab === 'exhibitions' ? 'bg-accent text-white' : 'text-[#555] hover:text-white'}`}
          >
            <Calendar size={14} /> Выставки
          </button>
        </div>

        <button 
          onClick={() => setShowAddForm(true)}
          className="px-8 py-4 bg-accent text-white text-[10px] uppercase tracking-widest font-bold flex items-center gap-3 hover:scale-105 transition-all"
        >
          <Plus size={16} /> Добавить {activeTab === 'artworks' ? 'работу' : activeTab === 'artists' ? 'художника' : 'выставку'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="py-20 text-center opacity-40">Загрузка данных...</div>
        ) : items.length === 0 ? (
          <div className="py-32 text-center border border-dashed border-border text-[#444] uppercase tracking-widest text-xs">
            Нет данных в этом секторе.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-8 border border-border bg-[#0D0D0D] hover:border-accent transition-colors group">
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 border border-border overflow-hidden bg-[#222]">
                  {(item.imageUrl || item.avatarUrl) ? (
                    <img src={item.imageUrl || item.avatarUrl} alt={item.title || item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-[#444]">NO IMG</div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-serif leading-none mb-2">{item.title || item.name}</h3>
                  <p className="text-[10px] uppercase tracking-widest text-[#666]">
                    {activeTab === 'artworks' && `От ${item.artistName} • ${formatCurrency(item.price)}`}
                    {activeTab === 'artists' && `${item.specialty} • ${item.location} • ${item.artworkCount} работ`}
                    {activeTab === 'exhibitions' && `${item.location} • ${item.startDate} — ${item.endDate}`}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleEdit(item)}
                  className="p-4 border border-border text-[#444] hover:text-accent hover:border-accent transition-all"
                >
                  <Edit2 size={20} />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
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
            className="fixed inset-0 z-50 bg-onyx/95 backdrop-blur-xl flex items-center justify-center p-10 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-2xl bg-[#0D0D0D] border border-border p-12 relative my-auto"
            >
              <button 
                onClick={() => {
                  setShowAddForm(false);
                  setEditingItem(null);
                }}
                className="absolute top-8 right-8 text-[#666] hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-3xl font-serif italic mb-8">
                {editingItem ? 'Редактирование' : (activeTab === 'artworks' ? 'Новая работа' : activeTab === 'artists' ? 'Новый художник' : 'Новая выставка')}
              </h2>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 mb-8 text-xs font-mono flex items-center gap-3">
                  <ShieldAlert size={16} />
                  {error}
                </div>
              )}
              
              {activeTab === 'artworks' && (
                <form onSubmit={handleAddArtwork} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Название</label>
                      <input required type="text" value={newArtwork.title || ''} onChange={e => setNewArtwork({...newArtwork, title: e.target.value})}
                        className="w-full bg-[#111] border border-border p-4 focus:border-accent focus:outline-none transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Художник</label>
                      <input required type="text" value={newArtwork.artistName || ''} onChange={e => setNewArtwork({...newArtwork, artistName: e.target.value})}
                        className="w-full bg-[#111] border border-border p-4 focus:border-accent focus:outline-none transition-colors" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Цена (USD)</label>
                      <input required type="number" value={newArtwork.price ?? 0} onChange={e => setNewArtwork({...newArtwork, price: Number(e.target.value)})}
                        className="w-full bg-[#111] border border-border p-4 focus:border-accent focus:outline-none transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Роялти (%)</label>
                      <input required type="number" value={newArtwork.royaltyRate ?? 0} onChange={e => setNewArtwork({...newArtwork, royaltyRate: Number(e.target.value)})}
                        className="w-full bg-[#111] border border-border p-4 focus:border-accent focus:outline-none transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Изображение работы</label>
                    <FileUploader 
                      currentUrl={newArtwork.imageUrl || ''} 
                      onUploadSuccess={(url) => setNewArtwork({...newArtwork, imageUrl: url})} 
                    />
                    <div className="mt-2 flex gap-2">
                      <input type="text" value={newArtwork.imageUrl || ''} onChange={e => setNewArtwork({...newArtwork, imageUrl: e.target.value})}
                        placeholder="Или вставьте прямую ссылку"
                        className="flex-1 bg-[#111] border border-border p-3 text-[10px] focus:border-accent focus:outline-none transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Описание</label>
                    <textarea value={newArtwork.description || ''} onChange={e => setNewArtwork({...newArtwork, description: e.target.value})}
                      className="w-full bg-[#111] border border-border p-4 h-32 focus:border-accent focus:outline-none transition-colors"></textarea>
                  </div>
                  <button type="submit" className="w-full py-5 bg-accent text-white font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-all">
                    {editingItem ? 'Сохранить изменения' : 'Создать запись'}
                  </button>
                </form>
              )}

              {activeTab === 'artists' && (
                <form onSubmit={handleAddArtist} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Имя</label>
                      <input required type="text" value={newArtist.name || ''} onChange={e => setNewArtist({...newArtist, name: e.target.value})}
                        className="w-full bg-[#111] border border-border p-4 focus:border-accent focus:outline-none transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Специализация</label>
                      <input required type="text" value={newArtist.specialty || ''} onChange={e => setNewArtist({...newArtist, specialty: e.target.value})}
                        className="w-full bg-[#111] border border-border p-4 focus:border-accent focus:outline-none transition-colors" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Локация</label>
                      <input required type="text" value={newArtist.location || ''} onChange={e => setNewArtist({...newArtist, location: e.target.value})}
                        className="w-full bg-[#111] border border-border p-4 focus:border-accent focus:outline-none transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Кол-во работ</label>
                      <input type="number" value={newArtist.artworkCount ?? 0} onChange={e => setNewArtist({...newArtist, artworkCount: Number(e.target.value)})}
                        className="w-full bg-[#111] border border-border p-4 focus:border-accent focus:outline-none transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Аватар художника</label>
                    <FileUploader 
                      currentUrl={newArtist.avatarUrl || ''} 
                      onUploadSuccess={(url) => setNewArtist({...newArtist, avatarUrl: url})} 
                    />
                    <div className="mt-2 flex gap-2">
                      <input type="text" value={newArtist.avatarUrl || ''} onChange={e => setNewArtist({...newArtist, avatarUrl: e.target.value})}
                        placeholder="Или вставьте прямую ссылку"
                        className="flex-1 bg-[#111] border border-border p-3 text-[10px] focus:border-accent focus:outline-none transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Биография</label>
                    <textarea value={newArtist.bio || ''} onChange={e => setNewArtist({...newArtist, bio: e.target.value})}
                      className="w-full bg-[#111] border border-border p-4 h-32 focus:border-accent focus:outline-none transition-colors"></textarea>
                  </div>
                  <button type="submit" className="w-full py-5 bg-accent text-white font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-all">
                    {editingItem ? 'Сохранить изменения' : 'Создать профиль'}
                  </button>
                </form>
              )}

              {activeTab === 'exhibitions' && (
                <form onSubmit={handleAddExhibition} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Название</label>
                    <input required type="text" value={newExhibition.title || ''} onChange={e => setNewExhibition({...newExhibition, title: e.target.value})}
                      className="w-full bg-[#111] border border-border p-4 focus:border-accent focus:outline-none transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Дата начала</label>
                      <input required type="date" value={newExhibition.startDate || ''} onChange={e => setNewExhibition({...newExhibition, startDate: e.target.value})}
                        className="w-full bg-[#111] border border-border p-4 focus:border-accent focus:outline-none transition-colors text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Дата окончания</label>
                      <input required type="date" value={newExhibition.endDate || ''} onChange={e => setNewExhibition({...newExhibition, endDate: e.target.value})}
                        className="w-full bg-[#111] border border-border p-4 focus:border-accent focus:outline-none transition-colors text-white" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Локация</label>
                      <input required type="text" value={newExhibition.location || ''} onChange={e => setNewExhibition({...newExhibition, location: e.target.value})}
                        className="w-full bg-[#111] border border-border p-4 focus:border-accent focus:outline-none transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Статус</label>
                      <select value={newExhibition.status || 'UPCOMING'} onChange={e => setNewExhibition({...newExhibition, status: e.target.value})}
                        className="w-full bg-[#111] border border-border p-4 focus:border-accent focus:outline-none transition-colors">
                        <option value="ACTIVE">Активна</option>
                        <option value="UPCOMING">Предстоит</option>
                        <option value="FINISHED">Завершена</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Обложка выставки</label>
                      <FileUploader 
                        currentUrl={newExhibition.imageUrl || ''} 
                        onUploadSuccess={(url) => setNewExhibition({...newExhibition, imageUrl: url})} 
                      />
                      <input type="text" value={newExhibition.imageUrl || ''} onChange={e => setNewExhibition({...newExhibition, imageUrl: e.target.value})}
                        placeholder="Ссылка на обложку (опционально, если загружен файл)"
                        className="mt-2 w-full bg-[#111] border border-border p-3 text-[10px] focus:border-accent focus:outline-none transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">URL Видео (опционально)</label>
                      <input type="text" value={newExhibition.videoUrl || ''} onChange={e => setNewExhibition({...newExhibition, videoUrl: e.target.value})}
                        placeholder="https://youtube.com/..."
                        className="w-full bg-[#111] border border-border p-4 h-[180px] focus:border-accent focus:outline-none transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Описание</label>
                    <textarea value={newExhibition.description || ''} onChange={e => setNewExhibition({...newExhibition, description: e.target.value})}
                      className="w-full bg-[#111] border border-border p-4 h-32 focus:border-accent focus:outline-none transition-colors"></textarea>
                  </div>
                  <button type="submit" className="w-full py-5 bg-accent text-white font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-all">
                    {editingItem ? 'Сохранить изменения' : 'Открыть выставку'}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
