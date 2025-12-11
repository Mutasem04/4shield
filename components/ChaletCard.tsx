import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Star } from 'lucide-react';
import { Chalet } from '../types';

interface ChaletCardProps {
  chalet: Chalet;
  index: number;
  t: (key: string) => string;
  navigate: (path: string) => void;
}

const ChaletCard: React.FC<ChaletCardProps> = ({ chalet, index, t, navigate }) => {
  return (
    <motion.div
      {...{
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { delay: index * 0.1 },
        whileHover: { y: -10 }
      } as any}
      className="group bg-white dark:bg-reva-800 rounded-2xl overflow-hidden border border-transparent dark:border-white/5 hover:border-gray-100 dark:hover:border-reva-gold/30 transition-all duration-500 ease-in-out shadow-lg shadow-gray-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-gray-300/50 dark:hover:shadow-reva-gold/10 cursor-pointer"
      onClick={() => navigate(`/chalets/${chalet.id}`)}
    >
      <div className="relative h-56 md:h-64 overflow-hidden">
        <img 
          src={chalet.imageUrl} 
          alt={chalet.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 text-white text-xs font-bold border border-white/10">
          <Star size={12} className="text-reva-gold fill-reva-gold" />
          {chalet.rating}
        </div>
      </div>
      <div className="p-5 md:p-6">
        <div className="flex justify-between items-start mb-2">
           <div>
             <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white group-hover:text-reva-gold transition-colors duration-300">{chalet.name}</h3>
             <div className="flex items-center text-slate-500 dark:text-gray-400 text-xs md:text-sm mt-1">
               <MapPin size={14} className="mx-1" />
               {chalet.location}
             </div>
           </div>
        </div>
        
        <p className="text-slate-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">{chalet.description}</p>
        
        <div className="flex items-center gap-4 text-slate-500 dark:text-gray-500 text-xs md:text-sm mb-6">
          <div className="flex items-center gap-1"><Users size={14}/> {chalet.guests} {t('guests')}</div>
          <div className="flex items-center gap-1"><span className="font-bold">·</span></div>
          <div className="flex items-center gap-1">{chalet.bedrooms} {t('bdrm')}</div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
          <div>
            <span className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{chalet.pricePerNight} <small className="text-sm font-normal text-reva-gold">JD</small></span>
            <span className="text-slate-500 text-xs md:text-sm"> {t('night')}</span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/chalets/${chalet.id}`);
            }}
            className="px-3 md:px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-reva-gold dark:hover:bg-reva-gold hover:text-reva-900 text-slate-900 dark:text-white rounded-lg font-medium transition-colors text-xs md:text-sm"
          >
            {t('details')}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChaletCard;