import React, { createContext, useContext, useState, useEffect } from 'react';

interface LikesContextType {
  likedArtworks: string[];
  likedArtists: string[];
  likedExhibitions: string[];
  toggleLikeArtwork: (id: string) => void;
  toggleLikeArtist: (id: string) => void;
  toggleLikeExhibition: (id: string) => void;
  isLikedArtwork: (id: string) => boolean;
  isLikedArtist: (id: string) => boolean;
  isLikedExhibition: (id: string) => boolean;
}

const LikesContext = createContext<LikesContextType | undefined>(undefined);

export const LikesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [likedArtworks, setLikedArtworks] = useState<string[]>(() => 
    JSON.parse(localStorage.getItem('likedArtworks') || '[]')
  );
  const [likedArtists, setLikedArtists] = useState<string[]>(() => 
    JSON.parse(localStorage.getItem('likedArtists') || '[]')
  );
  const [likedExhibitions, setLikedExhibitions] = useState<string[]>(() => 
    JSON.parse(localStorage.getItem('likedExhibitions') || '[]')
  );

  useEffect(() => {
    localStorage.setItem('likedArtworks', JSON.stringify(likedArtworks));
  }, [likedArtworks]);

  useEffect(() => {
    localStorage.setItem('likedArtists', JSON.stringify(likedArtists));
  }, [likedArtists]);

  useEffect(() => {
    localStorage.setItem('likedExhibitions', JSON.stringify(likedExhibitions));
  }, [likedExhibitions]);

  const toggleLikeArtwork = (id: string) => {
    setLikedArtworks(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleLikeArtist = (id: string) => {
    setLikedArtists(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleLikeExhibition = (id: string) => {
    setLikedExhibitions(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const isLikedArtwork = (id: string) => likedArtworks.includes(id);
  const isLikedArtist = (id: string) => likedArtists.includes(id);
  const isLikedExhibition = (id: string) => likedExhibitions.includes(id);

  return (
    <LikesContext.Provider value={{ 
      likedArtworks, likedArtists, likedExhibitions,
      toggleLikeArtwork, toggleLikeArtist, toggleLikeExhibition,
      isLikedArtwork, isLikedArtist, isLikedExhibition
    }}>
      {children}
    </LikesContext.Provider>
  );
};

export const useLikes = () => {
  const context = useContext(LikesContext);
  if (!context) throw new Error('useLikes must be used within LikesProvider');
  return context;
};
