export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  joinedDate: Date;
  avatar?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city: string;
  district?: string;
  country?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
}

export type Condition = 'new' | 'likeNew' | 'good' | 'fair' | 'poor';

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency?: string;
  category: Category;
  condition: Condition;
  images: string[];
  location: Location;
  seller: User;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isSold?: boolean;
  isFeatured: boolean;
  viewCount: number;
  favoriteCount: number;
  tags: string[];
}

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  condition?: Condition[];
  categoryId?: string;
  location?: string;
  sortBy?: 'newest' | 'oldest' | 'priceLow' | 'priceHigh' | 'distance';
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  listingId?: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  listing?: Listing;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'offer' | 'listing' | 'system';
  title: string;
  body: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
}

export interface Offer {
  id: string;
  listingId: string;
  buyerId: string;
  amount: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: Date;
  expiresAt: Date;
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Sell: undefined;
  Messages: undefined;
  Profile: undefined;
}; 