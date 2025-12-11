export enum UserRole {
  GUEST = 'GUEST',
  USER = 'USER',
  OWNER = 'OWNER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  password?: string;
}

export interface Chalet {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  location: string;
  pricePerNight: number;
  guests: number;
  bedrooms: number;
  rating: number;
  imageUrl: string;
  amenities: string[];
  reviews: number;
}

export interface Booking {
  id: string;
  chaletId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
}

export interface RevenueStats {
  month: string;
  revenue: number;
}