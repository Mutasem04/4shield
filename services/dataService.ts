import { Chalet, Booking, User, UserRole } from '../types';
import { MOCK_CHALETS, MOCK_BOOKINGS, MOCK_USERS, EMAILJS_CONFIG } from '../constants';
import { send } from '@emailjs/browser';

// Keys for LocalStorage
const STORAGE_KEYS = {
  CHALETS: 'reva_chalets',
  BOOKINGS: 'reva_bookings',
  USERS: 'reva_users',
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class DataService {
  // Store OTPs in memory for the session (email -> otp)
  private pendingOtps = new Map<string, string>();

  private getFromStorage<T>(key: string, defaultData: T): T {
    const stored = localStorage.getItem(key);
    if (!stored) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(stored);
  }

  private saveToStorage(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // --- Chalets ---

  async getChalets(): Promise<Chalet[]> {
    await delay(300); // Simulate network latency
    return this.getFromStorage<Chalet[]>(STORAGE_KEYS.CHALETS, MOCK_CHALETS);
  }

  async searchChalets(criteria: { location?: string; minPrice?: number; maxPrice?: number; guests?: number }): Promise<Chalet[]> {
    await delay(500);
    const chalets = await this.getChalets();
    return chalets.filter(c => {
      if (criteria.location && !c.location.toLowerCase().includes(criteria.location.toLowerCase())) return false;
      if (criteria.minPrice && c.pricePerNight < criteria.minPrice) return false;
      if (criteria.maxPrice && c.pricePerNight > criteria.maxPrice) return false;
      if (criteria.guests && c.guests < criteria.guests) return false;
      return true;
    });
  }

  async getChaletById(id: string): Promise<Chalet | undefined> {
    await delay(200);
    const chalets = await this.getChalets();
    return chalets.find(c => c.id === id);
  }

  // --- Bookings ---

  async getBookings(): Promise<Booking[]> {
    await delay(300);
    return this.getFromStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, MOCK_BOOKINGS);
  }

  async getBookingsForUser(userId: string): Promise<Booking[]> {
    const bookings = await this.getBookings();
    return bookings.filter(b => b.userId === userId);
  }

  async getBookingsForOwner(ownerId: string): Promise<Booking[]> {
    const chalets = await this.getChalets();
    const myChaletIds = chalets.filter(c => c.ownerId === ownerId).map(c => c.id);
    const bookings = await this.getBookings();
    return bookings.filter(b => myChaletIds.includes(b.chaletId));
  }

  async createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<Booking> {
    await delay(600);
    const bookings = await this.getBookings();
    const newBooking: Booking = {
      ...booking,
      id: `b${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString().split('T')[0],
    };
    bookings.push(newBooking);
    this.saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
    return newBooking;
  }

  async updateBookingStatus(bookingId: string, status: 'CONFIRMED' | 'CANCELLED'): Promise<Booking> {
    await delay(400);
    const bookings = await this.getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index === -1) throw new Error('Booking not found');
    
    bookings[index].status = status;
    this.saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
    return bookings[index];
  }

  // --- Users ---
  
  async getUser(email: string): Promise<User | undefined> {
    await delay(200);
    const users = this.getFromStorage<User[]>(STORAGE_KEYS.USERS, MOCK_USERS);
    return users.find(u => u.email === email);
  }

  async getUserById(id: string): Promise<User | undefined> {
    await delay(200);
    const users = this.getFromStorage<User[]>(STORAGE_KEYS.USERS, MOCK_USERS);
    return users.find(u => u.id === id);
  }

  async login(email: string, password: string): Promise<User> {
    await delay(800);
    const users = this.getFromStorage<User[]>(STORAGE_KEYS.USERS, MOCK_USERS);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user || (user.password && user.password !== password)) {
      throw new Error('Invalid credentials');
    }
    
    return user;
  }

  // Step 1: Initiate Signup & Send Email (Real or Demo)
  async initiateSignup(email: string): Promise<{ otp: string, sent: boolean, error?: string }> {
    await delay(500);
    const users = this.getFromStorage<User[]>(STORAGE_KEYS.USERS, MOCK_USERS);
    
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('User already exists');
    }

    if (!email) {
      throw new Error('Email address is required');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.pendingOtps.set(email, otp);

    // Attempt to send real email
    let emailSent = false;
    let errorMsg = undefined;
    
    // Simple check if keys are configured
    const isConfigured = EMAILJS_CONFIG.PUBLIC_KEY && 
                         EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' && 
                         EMAILJS_CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID';

    if (isConfigured) {
      try {
        console.log("Attempting to send email with keys:", EMAILJS_CONFIG);
        
        // Pass the email in every common variable name to ensure it matches the template config
        const templateParams = {
          // Recipient handling
          to_email: email,      
          email: email,         
          user_email: email,    
          recipient: email,     
          reply_to: email,      
          to_name: email.split('@')[0],

          // OTP Variable Bombardment (Cover all bases)
          otp: otp,             // <--- Likely the missing one
          code: otp,
          otp_code: otp,
          verification_code: otp,
          pin: otp,
          
          // Content/Message fields (Some templates use these)
          message: otp,         
          content: `Your verification code is: ${otp}`,
          text: `Your verification code is: ${otp}`,
          
          // Expiry (implied by your screenshot text "valid till .")
          expiry: "15 minutes",
          valid_for: "15 minutes",
          date: new Date().toLocaleDateString()
        };

        // Use named export 'send'
        const response = await send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID,
          templateParams,
          EMAILJS_CONFIG.PUBLIC_KEY
        );
        
        console.log('OTP Email sent successfully:', response);
        emailSent = true;
      } catch (error: any) {
        // Extract meaningful error message
        const detailedError = error?.text || error?.message || JSON.stringify(error);
        console.error('FAILED TO SEND EMAIL:', detailedError);
        errorMsg = detailedError;
        emailSent = false;
      }
    } else {
      console.warn('EmailJS keys not configured properly in constants.ts. Using Demo Mode.');
      errorMsg = "Keys not configured";
    }
    
    return { otp, sent: emailSent, error: errorMsg };
  }

  // Step 2: Verify OTP
  async completeSignup(name: string, email: string, password: string, otp: string): Promise<User> {
    await delay(500);
    
    const storedOtp = this.pendingOtps.get(email);
    if (!storedOtp || storedOtp !== otp) {
      throw new Error('Invalid OTP');
    }

    const users = this.getFromStorage<User[]>(STORAGE_KEYS.USERS, MOCK_USERS);
    
    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      email,
      role: UserRole.USER,
      password,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=d4af37&color=fff`
    };

    users.push(newUser);
    this.saveToStorage(STORAGE_KEYS.USERS, users);
    
    this.pendingOtps.delete(email);

    return newUser;
  }
}

export const dataService = new DataService();