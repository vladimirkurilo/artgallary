import React from 'react';
import { motion } from 'motion/react';
import { Eye, Heart, Share2 } from 'lucide-react';
import { Artwork } from '../types';
import { formatCurrency } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { useLikes } from './LikesProvider';

interface ArtCardProps {
  artwork: Artwork;
  index: number;
}

export const ArtCard: React.FC<ArtCardProps> = ({ artwork, index }) => {
  const navigate = useNavigate();
  const { toggleLikeArtwork, isLikedArtwork } = useLikes();
  const liked = isLikedArtwork(String(artwork.id));

  const handleArtistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/artist/${artwork.artistId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="luxury-card group"
    >
      <div className="relative aspect-[4/5] overflow-hidden border-b border-border">
        <img 
          src={artwork.imageUrl} 
          alt={artwork.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-onyx/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          <button className="w-full py-4 bg-accent text-white text-[10px] uppercase font-bold tracking-widest hover:bg-white hover:text-onyx transition-all">
            Смотреть детали
          </button>
        </div>

        {/* Price Tag */}
        <div className="absolute top-0 right-0 p-4 bg-onyx/80 backdrop-blur-md border-l border-b border-border">
          <span className="text-accent font-mono text-xs font-bold leading-none">{formatCurrency(artwork.price)}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-2xl font-serif mb-1 leading-tight">{artwork.title}</h3>
          <button 
            onClick={handleArtistClick}
            className="text-[10px] uppercase tracking-widest text-[#666] hover:text-accent transition-colors font-medium leading-none focus:outline-none"
          >
            От {artwork.artistName}
          </button>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-[9px] uppercase tracking-tighter text-[#444] italic">
            Nexus-верифицирован // {artwork.views || 0} просмотров
          </div>
          <div className="flex gap-3">
             <button 
               onClick={(e) => {
                 e.preventDefault();
                 e.stopPropagation();
                 toggleLikeArtwork(String(artwork.id));
               }} 
               className={`p-2 transition-colors ${liked ? "text-accent" : "text-[#444] hover:text-accent"}`}
             >
               <Heart size={14} className={liked ? "fill-accent" : ""} />
             </button>
             <button onClick={(e) => {
               e.preventDefault();
               e.stopPropagation();
             }} className="p-2 text-[#444] hover:text-accent transition-colors"><Share2 size={14} /></button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
