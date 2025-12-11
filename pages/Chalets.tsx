import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import ChaletCard from '../components/ChaletCard';
import { MOCK_CHALETS } from '../constants';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const ChaletsPage: React.FC = () => {
  const { t } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const filteredChalets = MOCK_CHALETS.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter ? c.location.includes(locationFilter) : true;
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-10 text-center md:text-start">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4"
        >
          {t('chalets')}
        </motion.h1>
        <motion.p 
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="text-slate-600 dark:text-gray-400 text-lg max-w-2xl"
        >
          {t('collectionSub')}
        </motion.p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-reva-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 mb-10 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full relative">
           <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
           <input 
             type="text" 
             placeholder="Search chalets..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-reva-900 border-none focus:ring-1 focus:ring-reva-gold text-slate-900 dark:text-white focus:outline-none"
           />
        </div>
        <div className="w-full md:w-auto min-w-[220px] relative">
           <MapPin className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
           <select 
             value={locationFilter}
             onChange={(e) => setLocationFilter(e.target.value)}
             className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-8 py-3 rounded-xl bg-slate-50 dark:bg-reva-900 border-none focus:ring-1 focus:ring-reva-gold text-slate-900 dark:text-white appearance-none cursor-pointer focus:outline-none"
           >
             <option value="">All Locations</option>
             <option value="Amman">Amman</option>
             <option value="Dead Sea">Dead Sea</option>
             <option value="Aqaba">Aqaba</option>
             <option value="Wadi Rum">Wadi Rum</option>
             <option value="Ajloun">Ajloun</option>
           </select>
           <ChevronDown className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredChalets.length > 0 ? (
          filteredChalets.map((chalet, index) => (
            <ChaletCard key={chalet.id} chalet={chalet} index={index} t={t} navigate={navigate} />
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-slate-500 dark:text-gray-400">
            <p className="text-xl">No chalets found matching your criteria.</p>
            <button 
              onClick={() => { setSearchTerm(''); setLocationFilter(''); }}
              className="mt-4 text-reva-gold hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChaletsPage;