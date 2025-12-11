import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Users, Bed, Wifi, Wind, Coffee, Home, ChevronLeft, Calendar, CheckCircle } from 'lucide-react';
import { Chalet, User } from '../types';
import { dataService } from '../services/dataService';
import { useApp } from '../contexts/AppContext';

const ChaletDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useApp();
  const [chalet, setChalet] = useState<Chalet | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Booking State
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const foundChalet = await dataService.getChaletById(id);
        if (foundChalet) {
          setChalet(foundChalet);
          const foundOwner = await dataService.getUserById(foundChalet.ownerId);
          if (foundOwner) setOwner(foundOwner);
        }
      } catch (error) {
        console.error("Failed to load chalet", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chalet) return;
    
    // Check if user is logged in (using local storage for quick check in this context)
    const userId = localStorage.getItem('reva_user_id');
    if (!userId) {
      alert("Please sign in to book this chalet.");
      return;
    }

    setBookingLoading(true);
    try {
      // Calculate days
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      
      await dataService.createBooking({
        chaletId: chalet.id,
        userId: userId,
        startDate: checkIn,
        endDate: checkOut,
        totalPrice: chalet.pricePerNight * diffDays,
      });
      
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        // navigate('/dashboard'); // Optional: redirect to dashboard
      }, 3000);
    } catch (error) {
      console.error("Booking failed", error);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-50 dark:bg-reva-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-reva-gold"></div>
      </div>
    );
  }

  if (!chalet) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center bg-slate-50 dark:bg-reva-900 text-slate-900 dark:text-white">
        <h2 className="text-2xl font-bold mb-4">Chalet not found</h2>
        <button onClick={() => navigate('/')} className="text-reva-gold hover:underline flex items-center gap-2">
          <ChevronLeft size={20} /> Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-reva-900 text-slate-900 dark:text-white transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 flex items-center gap-2 text-slate-500 dark:text-gray-400 hover:text-reva-gold transition-colors"
        >
          <ChevronLeft size={20} /> Back
        </button>

        {/* Header Images */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-3xl overflow-hidden shadow-2xl mb-8 md:h-[500px]"
        >
          <div className="h-64 md:h-full relative overflow-hidden group">
            <img 
              src={chalet.imageUrl} 
              alt={chalet.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
          </div>
          <div className="grid grid-cols-2 gap-4 h-64 md:h-full">
            {/* Mock secondary images based on the main one */}
            <div className="relative overflow-hidden group rounded-2xl md:rounded-none">
              <img src={chalet.imageUrl} alt="Detail 1" className="w-full h-full object-cover filter brightness-90 group-hover:brightness-110 transition-all duration-500 group-hover:scale-105" />
            </div>
            <div className="relative overflow-hidden group rounded-2xl md:rounded-none">
              <img src={chalet.imageUrl} alt="Detail 2" className="w-full h-full object-cover filter contrast-125 group-hover:contrast-100 transition-all duration-500 group-hover:scale-105" />
            </div>
            <div className="relative overflow-hidden group rounded-2xl md:rounded-none">
              <img src={chalet.imageUrl} alt="Detail 3" className="w-full h-full object-cover filter sepia-[.3] group-hover:sepia-0 transition-all duration-500 group-hover:scale-105" />
            </div>
            <div className="relative overflow-hidden group rounded-2xl md:rounded-none">
              <div className="absolute inset-0 bg-reva-900/50 flex items-center justify-center z-10 group-hover:bg-reva-900/40 transition-colors">
                 <span className="text-white font-medium border-b border-white pb-1">View all photos</span>
              </div>
              <img src={chalet.imageUrl} alt="Detail 4" className="w-full h-full object-cover blur-[1px] group-hover:blur-0 transition-all duration-500" />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          
          {/* Left Column: Details */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{chalet.name}</h1>
                <div className="flex items-center gap-2 text-reva-gold font-semibold">
                   <Star className="fill-reva-gold" size={20} />
                   <span className="text-xl">{chalet.rating}</span>
                   <span className="text-slate-400 dark:text-gray-500 text-sm font-normal">({chalet.reviews} reviews)</span>
                </div>
              </div>
              <div className="flex items-center text-slate-500 dark:text-gray-400 mb-6">
                <MapPin size={18} className="mr-2 text-reva-gold" />
                {chalet.location}
              </div>
              
              <div className="flex gap-6 py-6 border-y border-gray-100 dark:border-white/10 text-sm md:text-base">
                 <div className="flex items-center gap-2">
                    <Users size={20} className="text-slate-400" />
                    <span>{chalet.guests} Guests</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Bed size={20} className="text-slate-400" />
                    <span>{chalet.bedrooms} Bedrooms</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Home size={20} className="text-slate-400" />
                    <span>Entire Chalet</span>
                 </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">About this place</h2>
              <p className="text-slate-600 dark:text-gray-300 leading-relaxed text-lg">
                {chalet.description}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {chalet.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-slate-600 dark:text-gray-300">
                    <div className="p-2 bg-slate-100 dark:bg-white/5 rounded-lg text-reva-gold">
                       {amenity.includes('Wi-Fi') ? <Wifi size={18} /> : 
                        amenity.includes('AC') ? <Wind size={18} /> :
                        amenity.includes('Breakfast') ? <Coffee size={18} /> :
                        <CheckCircle size={18} />}
                    </div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {owner && (
               <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300">
                    <img src={owner.avatar || `https://ui-avatars.com/api/?name=${owner.name}`} alt={owner.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Hosted by {owner.name}</h3>
                    <p className="text-slate-500 dark:text-gray-400 text-sm">Superhost · 5 years hosting</p>
                  </div>
               </div>
            )}

          </motion.div>

          {/* Right Column: Booking Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
             <div className="sticky top-24 bg-white dark:bg-reva-800 p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-gray-100 dark:border-white/10">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <span className="text-3xl font-bold text-reva-gold">{chalet.pricePerNight} JD</span>
                    <span className="text-slate-500 dark:text-gray-400"> / night</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-900 dark:text-white">
                    <Star size={12} className="fill-slate-900 dark:fill-white" /> {chalet.rating}
                  </div>
                </div>

                <form onSubmit={handleBook} className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-1">
                      <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1">Check-in</label>
                      <div className="relative">
                        <input 
                          type="date" 
                          required
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="w-full p-3 bg-slate-50 dark:bg-reva-900 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-reva-gold text-sm dark:text-white" 
                        />
                      </div>
                    </div>
                    <div className="col-span-1">
                      <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1">Check-out</label>
                      <div className="relative">
                        <input 
                          type="date" 
                          required
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="w-full p-3 bg-slate-50 dark:bg-reva-900 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-reva-gold text-sm dark:text-white" 
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1">Guests</label>
                    <select 
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full p-3 bg-slate-50 dark:bg-reva-900 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-reva-gold text-sm dark:text-white"
                    >
                      {[...Array(chalet.guests)].map((_, i) => (
                        <option key={i} value={i + 1}>{i + 1} Guest{i > 0 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  {bookingSuccess ? (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full bg-green-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={20} /> Request Sent!
                    </motion.div>
                  ) : (
                    <button 
                      type="submit" 
                      disabled={bookingLoading}
                      className="w-full bg-gradient-to-r from-reva-gold to-yellow-500 hover:from-yellow-400 hover:to-yellow-500 text-reva-900 font-bold py-4 rounded-xl shadow-lg shadow-reva-gold/20 transform transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {bookingLoading ? 'Processing...' : 'Reserve'}
                    </button>
                  )}
                  
                  <p className="text-center text-xs text-slate-400 mt-2">You won't be charged yet</p>
                </form>

                <div className="mt-6 space-y-3 pt-6 border-t border-gray-100 dark:border-white/10 text-sm text-slate-600 dark:text-gray-300">
                   <div className="flex justify-between">
                     <span className="underline">Service fee</span>
                     <span>0 JD</span>
                   </div>
                   <div className="flex justify-between font-bold text-lg text-slate-900 dark:text-white pt-2">
                     <span>Total</span>
                     <span>{checkIn && checkOut ? chalet.pricePerNight * (Math.ceil(Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) || 1) : chalet.pricePerNight} JD</span>
                   </div>
                </div>
             </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ChaletDetails;