import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, ArrowRight, ChevronDown } from 'lucide-react';
import { MOCK_CHALETS } from '../constants';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import ChaletCard from '../components/ChaletCard';

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useApp();
  const navigate = useNavigate();

  const filteredChalets = MOCK_CHALETS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-12 md:gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] md:h-[80vh] flex items-center justify-center overflow-hidden py-20 md:py-0">
        {/* Background Image with Animated Zoom (Ken Burns Effect) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.img 
            initial={{ scale: 1 }}
            animate={{ scale: 1.1 }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
            src="https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=2070&auto=format&fit=crop" 
            alt="Jordan Wadi Rum" 
            className="w-full h-full object-cover origin-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/40 to-slate-50 dark:to-reva-900 transition-colors duration-500 ease-in-out"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto w-full">
          <motion.div
            {...{
              initial: { opacity: 0, y: 30 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.8 }
            } as any}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-reva-gold text-xs md:text-sm font-medium tracking-wider mb-4 md:mb-6 shadow-sm">
              THE JEWEL OF JORDAN
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-4 md:mb-6 drop-shadow-lg">
              {t('heroTitle')} <br/> {t('heroSubtitle')} <span className="text-reva-gold italic">{t('heroSubtitleHighlight')}</span>
            </h1>
            <p className="text-base md:text-xl text-gray-100 mb-8 md:mb-10 max-w-2xl mx-auto drop-shadow-md font-light tracking-wide">
              {t('heroText')}
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            {...{
              initial: { opacity: 0, scale: 0.9 },
              animate: { opacity: 1, scale: 1 },
              transition: { delay: 0.4, duration: 0.5 }
            } as any}
            className="bg-white/90 dark:bg-white/10 backdrop-blur-xl border border-white/40 dark:border-white/20 p-2 rounded-3xl md:rounded-full max-w-3xl mx-auto flex flex-col md:flex-row gap-2 shadow-2xl transition-colors duration-500"
          >
            <div className="flex-1 flex items-center px-4 bg-white dark:bg-reva-900/50 rounded-full h-12 md:h-14 border border-transparent focus-within:border-reva-gold/50 transition-colors duration-300 relative">
              <MapPin className="text-slate-400 dark:text-gray-400 mx-2 flex-shrink-0" size={20} />
              <select
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-slate-900 dark:text-white w-full text-sm md:text-base appearance-none cursor-pointer pr-8"
              >
                <option value="" className="text-slate-900 dark:text-white bg-white dark:bg-reva-800">{t('searchWhere')}</option>
                <option value="Amman" className="text-slate-900 dark:text-white bg-white dark:bg-reva-800">Amman</option>
                <option value="Sowayma" className="text-slate-900 dark:text-white bg-white dark:bg-reva-800">Dead Sea</option>
                <option value="Aqaba" className="text-slate-900 dark:text-white bg-white dark:bg-reva-800">Aqaba</option>
                <option value="Wadi Rum" className="text-slate-900 dark:text-white bg-white dark:bg-reva-800">Wadi Rum</option>
                <option value="Ajloun" className="text-slate-900 dark:text-white bg-white dark:bg-reva-800">Ajloun</option>
              </select>
              <ChevronDown className="absolute right-4 text-slate-400 dark:text-gray-400 pointer-events-none rtl:right-auto rtl:left-4" size={16} />
            </div>
            <div className="flex-1 flex items-center px-4 bg-white dark:bg-reva-900/50 rounded-full h-12 md:h-14 border border-transparent focus-within:border-reva-gold/50 transition-colors duration-300">
              <Calendar className="text-slate-400 dark:text-gray-400 mx-2 flex-shrink-0" size={20} />
              <input 
                type="text" 
                placeholder={t('searchDates')}
                className="bg-transparent border-none focus:outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 w-full text-sm md:text-base"
                onFocus={(e) => e.target.type = 'date'}
                onBlur={(e) => e.target.type = 'text'}
              />
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                boxShadow: ["0 0 0 0 rgba(212, 175, 55, 0)", "0 0 0 10px rgba(212, 175, 55, 0)"]
              }}
              transition={{
                boxShadow: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }
              }}
              className="h-12 md:h-14 px-8 bg-reva-gold hover:bg-yellow-400 text-reva-900 font-bold rounded-full transition-all flex items-center justify-center gap-2 shadow-lg text-sm md:text-base"
            >
              <Search size={20} />
              <span>{t('searchButton')}</span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Featured Chalets */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">{t('exclusiveCollection')}</h2>
            <p className="text-slate-600 dark:text-gray-400 text-sm md:text-base">{t('collectionSub')}</p>
          </div>
          <button className="flex items-center gap-2 text-reva-gold hover:text-yellow-600 dark:hover:text-white transition-colors text-sm font-medium">
            {t('viewAll')} <ArrowRight size={16} className="rtl:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredChalets.map((chalet, index) => (
            <ChaletCard key={chalet.id} chalet={chalet} index={index} t={t} navigate={navigate} />
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-16 md:py-24 mx-4 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none transition-shadow duration-500">
        <div className="absolute inset-0 bg-reva-800 dark:bg-reva-800">
           <img src="https://images.unsplash.com/photo-1589820296156-2454b3a95725?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-20 mix-blend-overlay" alt="CTA BG"/>
        </div>
        <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6">{t('listProperty')}</h2>
          <p className="text-gray-300 mb-6 md:mb-8 text-sm md:text-base">
            {t('listPropertySub')}
          </p>
          <button 
            onClick={() => navigate('/become-host')}
            className="px-6 md:px-8 py-3 bg-transparent border border-reva-gold text-reva-gold hover:bg-reva-gold hover:text-reva-900 rounded-full font-semibold transition-all text-sm md:text-base"
          >
            {t('becomeHost')}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;