import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { User, UserRole, Booking, Chalet } from '../types';
import { dataService } from '../services/dataService';
import { TrendingUp, DollarSign, Calendar, Home as HomeIcon, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const isOwner = user.role === UserRole.OWNER;
  const isAdmin = user.role === UserRole.ADMIN;
  const { t, theme } = useApp();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [chalets, setChalets] = useState<Chalet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load Data from Backend Service
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch Chalets
        const fetchedChalets = await dataService.getChalets();
        const myChalets = isOwner 
          ? fetchedChalets.filter(c => c.ownerId === user.id)
          : fetchedChalets;
        setChalets(myChalets);

        // Fetch Bookings
        const fetchedBookings = await dataService.getBookings();
        const myBookings = isOwner
          ? fetchedBookings.filter(b => myChalets.some(c => c.id === b.chaletId))
          : fetchedBookings;
        setBookings(myBookings);

      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user.id, isOwner]);

  const handleStatusUpdate = async (bookingId: string, status: 'CONFIRMED' | 'CANCELLED') => {
    try {
      const updatedBooking = await dataService.updateBookingStatus(bookingId, status);
      // Optimistic update
      setBookings(prev => prev.map(b => b.id === bookingId ? updatedBooking : b));
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  // Calculations
  const totalRevenue = bookings.filter(b => b.status === 'CONFIRMED').reduce((acc, curr) => acc + curr.totalPrice, 0);
  const activeBookings = bookings.filter(b => b.status === 'CONFIRMED').length;
  const pendingRequests = bookings.filter(b => b.status === 'PENDING').length;

  const chartData = [
    { name: 'Jan', revenue: 1400 },
    { name: 'Feb', revenue: 1200 },
    { name: 'Mar', revenue: 900 },
    { name: 'Apr', revenue: 1500 },
    { name: 'May', revenue: 1800 },
    { name: 'Jun', revenue: 2100 },
    { name: 'Jul', revenue: 2500 },
  ];

  if (!isOwner && !isAdmin) {
    return <div className="text-center py-20 text-slate-900 dark:text-white">{t('accessDenied')}</div>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-reva-900 transition-colors duration-500">
        <Loader2 className="animate-spin text-reva-gold" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <div className="mb-8 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white transition-colors">
          {isAdmin ? t('adminDash') : t('ownerDash')}
        </h1>
        <p className="text-slate-600 dark:text-gray-400 mt-2 text-sm md:text-base">{t('welcomeBack')}, {user.name}. {t('happening')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
        <StatCard title={t('revenue')} value={`${totalRevenue.toLocaleString()} JD`} icon={<DollarSign size={24} />} delay={0} />
        <StatCard title={t('activeBookings')} value={activeBookings.toString()} icon={<Calendar size={24} />} delay={0.1} />
        <StatCard title={t('totalProps')} value={chalets.length.toString()} icon={<HomeIcon size={24} />} delay={0.2} />
        <StatCard title={t('pendingReq')} value={pendingRequests.toString()} icon={<TrendingUp size={24} />} delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-10">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-reva-800 border border-transparent dark:border-white/5 rounded-2xl p-4 md:p-6 shadow-xl shadow-gray-200/50 dark:shadow-none transition-all duration-500 ease-in-out">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">{t('revOverview')}</h3>
          <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "#334155" : "#e2e8f0"} />
                <XAxis dataKey="name" stroke={theme === 'dark' ? "#94a3b8" : "#64748b"} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={theme === 'dark' ? "#94a3b8" : "#64748b"} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value} JD`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#1e293b' : '#fff', 
                    borderColor: theme === 'dark' ? '#334155' : '#e2e8f0', 
                    color: theme === 'dark' ? '#fff' : '#0f172a',
                    borderRadius: '0.5rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ color: '#d4af37' }}
                  cursor={{ fill: theme === 'dark' ? '#334155' : '#f1f5f9', opacity: 0.4 }}
                  formatter={(value) => [`${value} JD`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#d4af37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity / List */}
        <div className="bg-white dark:bg-reva-800 border border-transparent dark:border-white/5 rounded-2xl p-4 md:p-6 shadow-xl shadow-gray-200/50 dark:shadow-none flex flex-col transition-all duration-500 ease-in-out">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">{t('recentBookings')}</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[300px] lg:max-h-none">
             {bookings.map((booking) => (
               <div key={booking.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 bg-slate-50 dark:bg-reva-900/50 rounded-xl border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-reva-gold/20 transition-colors gap-4 sm:gap-0">
                  <div className="flex-1">
                    <div className="text-slate-900 dark:text-white font-medium text-sm md:text-base">
                      {chalets.find(c => c.id === booking.chaletId)?.name || t('unknown')}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-gray-400 mt-1">{booking.startDate} - {booking.endDate}</div>
                    <div className="mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold ${
                        booking.status === 'CONFIRMED' ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400' :
                        booking.status === 'PENDING' ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' : 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  
                  {booking.status === 'PENDING' && (
                    <div className="flex gap-2">
                       <button 
                         onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                         className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full transition-colors"
                         title={t('approve')}
                       >
                         <CheckCircle size={18} />
                       </button>
                       <button 
                         onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                         className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-full transition-colors"
                         title={t('reject')}
                       >
                         <XCircle size={18} />
                       </button>
                    </div>
                  )}
               </div>
             ))}
             {bookings.length === 0 && <p className="text-slate-500 text-center text-sm">No bookings yet.</p>}
          </div>
        </div>
      </div>
      
      {/* Property Management Quick View */}
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t('yourProps')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chalets.map(chalet => (
          <div key={chalet.id} className="bg-white dark:bg-reva-800 rounded-xl p-4 border border-transparent dark:border-white/5 flex gap-4 items-center shadow-lg shadow-gray-200/50 dark:shadow-none transition-all duration-500">
            <img src={chalet.imageUrl} alt={chalet.name} className="w-16 h-16 rounded-lg object-cover" />
            <div className="min-w-0">
              <h4 className="text-slate-900 dark:text-white font-medium text-sm truncate">{chalet.name}</h4>
              <p className="text-slate-500 dark:text-gray-400 text-xs truncate">{chalet.location}</p>
              <div className="mt-2 text-xs text-reva-gold font-semibold">{chalet.pricePerNight} JD / {t('night')}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; delay: number }> = ({ title, value, icon, delay }) => (
  <motion.div
    {...{
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay }
    } as any}
    className="bg-white dark:bg-reva-800 p-6 rounded-2xl border border-transparent dark:border-white/5 shadow-lg shadow-gray-200/50 dark:shadow-none flex items-center gap-4 hover:border-gray-100 dark:hover:border-reva-gold/30 transition-all duration-500 ease-in-out"
  >
    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-reva-900 flex items-center justify-center text-reva-gold border border-reva-gold/20 flex-shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-slate-500 dark:text-gray-400 text-sm">{title}</p>
      <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  </motion.div>
);

export default Dashboard;