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
  id: string | number;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  startDate: string;
  endDate: string;
  location: string;
  status: 'UPCOMING' | 'ACTIVE' | 'FINISHED';
}

export interface Artist {
  id: string | number;
  name: string;
  bio: string;
  specialty: string;
  avatarUrl: string;
  location: string;
  exhibitionCount: number;
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
