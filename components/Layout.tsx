import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User as UserIcon, LogOut, Sun, Moon, Globe, MapPin } from 'lucide-react';
import { User, UserRole } from '../types';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  onLoginClick: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onLoginClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme, language, setLanguage, t } = useApp();

  const handleNav = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-reva-900 text-slate-900 dark:text-gray-100 flex flex-col overflow-x-hidden transition-colors duration-500 ease-in-out">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 dark:bg-reva-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-white/10 transition-colors duration-500 ease-in-out shadow-sm dark:shadow-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex-shrink-0 cursor-pointer flex items-center gap-2" onClick={() => handleNav('/')}>
              <div className="w-7 h-7 md:w-8 md:h-8 bg-reva-gold rounded-br-xl rounded-tl-xl flex items-center justify-center shadow-lg shadow-reva-gold/20">
                <span className="font-bold text-reva-900 text-sm md:text-base">R</span>
              </div>
              <span className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">REVA<span className="text-reva-gold">CHALET</span></span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-8 rtl:space-x-reverse mx-10">
                <Link to="/" className={`hover:text-reva-gold px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${location.pathname === '/' ? 'text-reva-gold' : 'text-slate-600 dark:text-gray-300'}`}>{t('discover')}</Link>
                <Link to="/chalets" className={`hover:text-reva-gold px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${location.pathname === '/chalets' ? 'text-reva-gold' : 'text-slate-600 dark:text-gray-300'}`}>{t('chalets')}</Link>
                
                {user && (user.role === UserRole.ADMIN || user.role === UserRole.OWNER) && (
                  <Link to="/dashboard" className={`hover:text-reva-gold px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${location.pathname === '/dashboard' ? 'text-reva-gold' : 'text-slate-600 dark:text-gray-300'}`}>{t('dashboard')}</Link>
                )}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
               {/* Theme Toggle */}
               <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-gray-300 transition-colors duration-300"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Language Toggle */}
              <button 
                onClick={toggleLanguage} 
                className="flex items-center gap-1 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-gray-300 transition-colors duration-300 font-medium text-sm"
                title="Switch Language"
              >
                <Globe size={18} />
                <span>{language === 'en' ? 'AR' : 'EN'}</span>
              </button>

              <div className="w-px h-6 bg-slate-200 dark:bg-white/20 mx-2 transition-colors duration-500"></div>

              {/* User Auth */}
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-reva-700 flex items-center justify-center overflow-hidden border border-reva-gold/50 shadow-sm">
                       {user.avatar ? <img src={user.avatar} alt="User" /> : <UserIcon size={16} className="text-slate-600 dark:text-gray-300" />}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-gray-200">{user.name}</span>
                  </div>
                  <button onClick={onLogout} className="text-gray-400 hover:text-red-500 dark:hover:text-white transition-colors duration-300">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={onLoginClick}
                  className="bg-reva-gold text-reva-900 px-5 py-2 rounded-full font-semibold hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-reva-gold/20"
                >
                  {t('signIn')}
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden gap-1 sm:gap-2">
              <button onClick={toggleTheme} className="p-2 text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors">{theme === 'dark' ? <Sun size={20}/> : <Moon size={20}/>}</button>
              <button onClick={toggleLanguage} className="p-2 text-slate-500 dark:text-gray-400 font-bold hover:bg-slate-100 dark:hover:bg-white/10 rounded-full text-sm transition-colors">{language === 'en' ? 'AR' : 'EN'}</button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="bg-slate-100 dark:bg-reva-800 inline-flex items-center justify-center p-2 rounded-md text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white focus:outline-none transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              {...{
                initial: { opacity: 0, height: 0 },
                animate: { opacity: 1, height: 'auto' },
                exit: { opacity: 0, height: 0 }
              } as any}
              className="md:hidden bg-white dark:bg-reva-900 border-b border-gray-100 dark:border-white/10 overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <button onClick={() => handleNav('/')} className="text-slate-600 dark:text-gray-300 hover:text-reva-gold dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-start">{t('discover')}</button>
                <button onClick={() => handleNav('/chalets')} className="text-slate-600 dark:text-gray-300 hover:text-reva-gold dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-start">{t('chalets')}</button>
                {user && (user.role === UserRole.ADMIN || user.role === UserRole.OWNER) && (
                   <button onClick={() => handleNav('/dashboard')} className="text-slate-600 dark:text-gray-300 hover:text-reva-gold dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-start">{t('dashboard')}</button>
                )}
                {!user ? (
                  <button onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }} className="text-reva-gold font-bold block px-3 py-2 rounded-md text-base w-full text-start">{t('signIn')}</button>
                ) : (
                  <button onClick={() => { onLogout(); setIsMobileMenuOpen(false); }} className="text-red-500 dark:text-red-400 block px-3 py-2 rounded-md text-base font-medium w-full text-start">{t('logOut')}</button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-16 md:pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-reva-900 border-t border-gray-100 dark:border-white/5 py-12 transition-colors duration-500 ease-in-out">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-start rtl:md:text-right">
            <div className="col-span-1 md:col-span-1">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">REVA<span className="text-reva-gold">CHALET</span></span>
              <p className="mt-4 text-slate-500 dark:text-gray-400 text-sm leading-relaxed">{t('heroText')}</p>
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white font-semibold mb-4">{t('explore')}</h3>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-gray-400">
                <li><a href="#" className="hover:text-reva-gold transition-colors">{t('destinations')}</a></li>
                <li><a href="#" className="hover:text-reva-gold transition-colors">{t('collections')}</a></li>
                <li><a href="#" className="hover:text-reva-gold transition-colors">{t('experiences')}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white font-semibold mb-4">{t('company')}</h3>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-gray-400">
                <li><a href="#" className="hover:text-reva-gold transition-colors">{t('aboutUs')}</a></li>
                <li><a href="#" className="hover:text-reva-gold transition-colors">{t('careers')}</a></li>
                <li><a href="#" className="hover:text-reva-gold transition-colors">{t('press')}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white font-semibold mb-4">{t('contact')}</h3>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-gray-400">
                <li className="flex items-center justify-center md:justify-start gap-2"><MapPin size={14} /> King Hussein Business Park, Amman</li>
                <li>support@reva.jo</li>
                <li>+962 6 555 0199</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-100 dark:border-white/5 pt-8 flex justify-between items-center flex-col md:flex-row gap-4">
             <p className="text-xs text-slate-500 dark:text-gray-500">{t('rights')}</p>
             <div className="flex gap-4">
               {/* Social icons placeholder */}
               <div className="w-5 h-5 bg-slate-200 dark:bg-gray-700 rounded-full hover:bg-reva-gold transition-colors cursor-pointer"></div>
               <div className="w-5 h-5 bg-slate-200 dark:bg-gray-700 rounded-full hover:bg-reva-gold transition-colors cursor-pointer"></div>
               <div className="w-5 h-5 bg-slate-200 dark:bg-gray-700 rounded-full hover:bg-reva-gold transition-colors cursor-pointer"></div>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;