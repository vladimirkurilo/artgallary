export interface UserProfile {
  id: string;
  displayName: string;
  photoURL: string;
  bio?: string;
  role: 'artist' | 'collector' | 'curator';
  createdAt: string;
}

export interface Artwork {
  id: string | number;
  title: string;
  description: string;
  artistId: string;
  artistName: string;
  price: number;
  royaltyRate: number;
  imageUrl: string;
  exhibitionId?: string;
  status: 'available' | 'sold' | 'reserved';
  createdAt: string;
}

export interface Exhibition {
  id: string;
  title: string;
  description: string;
  curatorId: string;
  coverImageUrl: string;
  startDate: string;
  endDate: string;
  isPublic: boolean;
  layoutType: 'minimal' | 'immersive' | 'grid';
}

export interface Review {
  id: string;
  artworkId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  artworkId: string;
  buyerId: string;
  artistId: string;
  amount: number;
  royaltyAmount: number;
  stripeSessionId: string;
  createdAt: string;
}
