export interface UserProfile {
  id: string;
  displayName: string;
  photoURL: string;
  bio?: string;
  role: 'artist' | 'collector' | 'curator';
  createdAt: string;
}

export interface Review {
  id: number;
  exhibitionId?: number;
  artworkId?: string | number;
  userId: string;
  userName: string;
  comment: string;
  rating: number;
  createdAt: string;
}

export interface Artwork {
  id: string | number;
  title: string;
  description: string;
  artistId: string | number;
  artistName: string;
  price: number;
  imageUrl: string;
  exhibitionId?: string | number;
  status: 'AVAILABLE' | 'SOLD' | 'RESERVED';
  views?: number;
  salesCount?: number;
  createdAt: string;
}

export interface Exhibition {
  id: string | number;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  startDate: string;
  endDate: string;
  location: string;
  status: 'UPCOMING' | 'ACTIVE' | 'FINISHED';
  artworks?: Artwork[];
  artists?: Artist[];
  reviews?: Review[];
}

export interface Artist {
  id: string | number;
  name: string;
  bio: string;
  specialty: string;
  avatarUrl: string;
  location: string;
  exhibitionCount: number;
  artworks?: Artwork[];
  exhibitions?: Exhibition[];
}

export interface Transaction {
  id: string | number;
  artworkId: string | number;
  buyerId: string;
  artistId: string | number;
  amount: number;
  createdAt: string;
}
