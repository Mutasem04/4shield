import { Chalet, User, UserRole, Booking } from './types';

// Replace these with your actual keys from emailjs.com
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_6o175gw', 
  TEMPLATE_ID: 'template_ziecikq',
  PUBLIC_KEY: '4JPn0ReWZ4lOt8CLF',
};

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Alice Admin', email: 'admin@reva.com', role: UserRole.ADMIN, avatar: 'https://picsum.photos/id/64/100/100', password: 'password123' },
  { id: '2', name: 'Omar Owner', email: 'owner@reva.com', role: UserRole.OWNER, avatar: 'https://picsum.photos/id/91/100/100', password: 'password123' },
  { id: '3', name: 'John Doe', email: 'user@reva.com', role: UserRole.USER, avatar: 'https://picsum.photos/id/12/100/100', password: 'password123' },
];

export const MOCK_CHALETS: Chalet[] = [
  {
    id: 'c1',
    ownerId: '2',
    name: 'Wadi Rum Starlight Bubble',
    description: 'Experience the Martian landscape of Wadi Rum in a luxury bubble tent. Perfect for stargazing and desert adventures.',
    location: 'Wadi Rum, Aqaba',
    pricePerNight: 180,
    guests: 2,
    bedrooms: 1,
    rating: 4.9,
    reviews: 340,
    imageUrl: 'https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?q=80&w=2070&auto=format&fit=crop',
    amenities: ['Stargazing Roof', 'Desert Tour', 'Breakfast', 'AC']
  },
  {
    id: 'c2',
    ownerId: '2',
    name: 'Dead Sea Infinity Villa',
    description: 'Private villa with an infinity pool overlooking the Dead Sea. Enjoy the healing waters and spectacular sunsets.',
    location: 'Sowayma, Balqa',
    pricePerNight: 350,
    guests: 6,
    bedrooms: 3,
    rating: 4.8,
    reviews: 125,
    imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2049&auto=format&fit=crop',
    amenities: ['Infinity Pool', 'Private Beach Access', 'BBQ', 'Wi-Fi']
  },
  {
    id: 'c3',
    ownerId: '2',
    name: 'Ajloun Forest Lodge',
    description: 'Nestled in the oak forests of Ajloun. A cozy eco-friendly wooden cabin perfect for hiking and nature lovers.',
    location: 'Ajloun, North',
    pricePerNight: 120,
    guests: 4,
    bedrooms: 2,
    rating: 4.7,
    reviews: 98,
    imageUrl: 'https://images.unsplash.com/photo-1520638023360-6def43369781?q=80&w=2069&auto=format&fit=crop',
    amenities: ['Fireplace', 'Hiking Trails', 'Organic Breakfast', 'Terrace']
  },
  {
    id: 'c4',
    ownerId: '99',
    name: 'Red Sea Royal Chalet',
    description: 'Exclusive beachfront chalet in Tala Bay. Crystal clear waters, diving spots, and ultimate luxury.',
    location: 'Aqaba, South',
    pricePerNight: 450,
    guests: 8,
    bedrooms: 4,
    rating: 5.0,
    reviews: 65,
    imageUrl: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop',
    amenities: ['Private Pool', 'Beach Access', 'Concierge', 'Smart Home']
  },
  {
    id: 'c5',
    ownerId: '2',
    name: 'Amman Hilltop Palace',
    description: 'A modern architectural masterpiece in Dabouq with panoramic views of the capital city.',
    location: 'Amman, Capital',
    pricePerNight: 550,
    guests: 10,
    bedrooms: 5,
    rating: 4.9,
    reviews: 45,
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop',
    amenities: ['Heated Pool', 'Cinema Room', 'Gym', 'Security']
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  { id: 'b1', chaletId: 'c1', userId: '3', startDate: '2023-12-20', endDate: '2023-12-22', totalPrice: 360, status: 'CONFIRMED', createdAt: '2023-11-01' },
  { id: 'b2', chaletId: 'c2', userId: '3', startDate: '2024-01-10', endDate: '2024-01-12', totalPrice: 700, status: 'PENDING', createdAt: '2023-12-05' },
  { id: 'b3', chaletId: 'c3', userId: '99', startDate: '2024-02-01', endDate: '2024-02-03', totalPrice: 240, status: 'CONFIRMED', createdAt: '2024-01-10' },
];