import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, Github, Loader2, Key, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { dataService } from '../services/dataService';
import { User as UserType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
}

const FloatingParticle: React.FC<{ delay: number; x: number }> = ({ delay, x }) => (
  <motion.div
    initial={{ y: 100, opacity: 0 }}
    animate={{ 
      y: -500, 
      opacity: [0, 0.4, 0],
      rotate: [0, 180] 
    }}
    transition={{ 
      duration: 10, 
      repeat: Infinity, 
      delay, 
      ease: "linear" 
    }}
    className="absolute bottom-0 w-2 h-2 rounded-full bg-reva-gold/20 backdrop-blur-sm"
    style={{ left: `${x}%` }}
  />
);

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null); // New state for email specific errors
  
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useApp();

  useEffect(() => {
    if (isOpen) {
      resetState();
    }
  }, [isOpen]);

  const resetState = () => {
    setError(null);
    setEmailError(null);
    setIsLoading(false);
    setStep('credentials');
    setOtp('');
    setDemoOtp(null);
    setIsEmailSent(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailError(null);
    setIsLoading(true);
    
    try {
      if (isLogin) {
        const user = await dataService.login(email, password);
        onLoginSuccess(user);
        onClose();
      } else {
        if (step === 'credentials') {
          // Step 1: Initiate Signup
          const response = await dataService.initiateSignup(email);
          
          if (response.sent) {
            setIsEmailSent(true);
            setDemoOtp(null);
            setEmailError(null);
          } else {
            setIsEmailSent(false);
            setDemoOtp(response.otp);
            // If there was a specific error returned, store it
            if (response.error) {
              setEmailError(response.error);
            }
          }
          
          setStep('otp');
        } else {
          // Step 2: Verify OTP
          const user = await dataService.completeSignup(name, email, password, otp);
          onLoginSuccess(user);
          onClose();
        }
      }
    } catch (err: any) {
      if (err.message === 'Invalid credentials') setError(t('invalidCredentials'));
      else if (err.message === 'User already exists') setError(t('userExists'));
      else if (err.message === 'Invalid OTP') setError(t('invalidOtp'));
      else setError(t('error'));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetState();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        {...{
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        } as any}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        {...{
          initial: { opacity: 0, scale: 0.9, y: 20 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.9, y: 20 }
        } as any}
        className="relative w-full max-w-md bg-white dark:bg-reva-800 border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-colors max-h-[90vh] flex flex-col"
      >
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FloatingParticle delay={0} x={10} />
          <FloatingParticle delay={2} x={30} />
          <FloatingParticle delay={4} x={50} />
          <FloatingParticle delay={1} x={70} />
          <FloatingParticle delay={3} x={90} />
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-gray-400 hover:text-gray-900 dark:hover:text-white z-10">
          <X size={20} />
        </button>

        <div className="p-8 overflow-y-auto relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {isLogin ? t('welcomeBack') : (step === 'otp' ? t('otpLabel') : t('createAccount'))}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {isLogin 
                ? t('enterDetails') 
                : (step === 'otp' ? `${t('otpSent')}` : t('joinReva'))}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* --- OTP STEP --- */}
            {step === 'otp' && !isLogin ? (
               <div className="space-y-4">
                 
                 {/* Success Message for Real Email */}
                 {isEmailSent && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-xl text-center"
                    >
                      <div className="flex items-center justify-center gap-2 text-green-800 dark:text-green-300 font-semibold mb-2">
                        <CheckCircle size={18} /> {t('emailSentSuccess')}
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-200">{t('checkEmail')}</p>
                    </motion.div>
                 )}

                 {/* Demo Message Box (Fallback) */}
                 {demoOtp && !isEmailSent && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl text-center"
                    >
                      <div className="flex items-center justify-center gap-2 text-blue-800 dark:text-blue-300 font-semibold mb-2 text-xs uppercase tracking-wider">
                        <Info size={14} /> {t('demoMode')}
                      </div>
                      {/* Show the specific error if available so user knows why it failed */}
                      {emailError && (
                        <div className="mb-2 p-2 bg-red-100 dark:bg-red-900/30 rounded text-xs text-red-600 dark:text-red-300 flex items-center gap-2 justify-center">
                           <AlertTriangle size={12} />
                           <span>Email failed: {emailError}</span>
                        </div>
                      )}
                      <p className="text-sm text-blue-900 dark:text-blue-200 mb-2">{t('demoOtpMessage')}</p>
                      <div className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-black/20 py-2 rounded-lg border border-blue-100 dark:border-blue-500/20 shadow-sm select-all">
                        {demoOtp}
                      </div>
                    </motion.div>
                 )}

                 <div className="space-y-2">
                   <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mx-1">{t('otpLabel')}</label>
                   <div className="relative">
                     <Key className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                     <input
                       type="text"
                       value={otp}
                       onChange={(e) => setOtp(e.target.value)}
                       className="w-full bg-gray-50 dark:bg-reva-900 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 rtl:pl-4 rtl:pr-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-reva-gold transition-colors tracking-widest text-center font-mono text-lg"
                       placeholder="123456"
                       maxLength={6}
                       required
                       autoFocus
                     />
                   </div>
                   <div className="text-center mt-2">
                     <button 
                       type="button" 
                       onClick={() => setStep('credentials')} 
                       className="text-xs text-reva-gold hover:underline"
                     >
                       Change email
                     </button>
                   </div>
                 </div>
               </div>
            ) : (
              /* --- CREDENTIALS STEP --- */
              <>
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mx-1">{t('fullName')}</label>
                    <div className="relative">
                      <User className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-reva-900 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 rtl:pl-4 rtl:pr-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-reva-gold transition-colors"
                        placeholder="John Doe"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mx-1">{t('email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-reva-900 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 rtl:pl-4 rtl:pr-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-reva-gold transition-colors"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mx-1">{t('password')}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-reva-900 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 rtl:pl-4 rtl:pr-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-reva-gold transition-colors"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-900/50">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-reva-gold hover:bg-yellow-400 text-reva-900 font-bold py-3 rounded-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-reva-gold/20"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {isLogin ? t('signIn') : (step === 'otp' ? t('verify') : t('signIn'))} 
                  <ArrowRight size={18} className="rtl:rotate-180" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isLogin ? t('dontHaveAccount') : t('haveAccount')}{" "}
              <button
                onClick={toggleMode}
                className="text-reva-gold hover:underline font-medium"
              >
                {isLogin ? t('signIn') : t('signIn')}
              </button>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
            <p className="text-center text-xs text-gray-500 mb-4">{t('continueWith')}</p>
            <div className="flex gap-4 justify-center">
              <button className="p-3 bg-gray-50 dark:bg-reva-900 rounded-full border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/30 transition-colors text-gray-900 dark:text-white hover:scale-110 transform duration-200">
                <Github size={20} />
              </button>
              <button className="p-3 bg-gray-50 dark:bg-reva-900 rounded-full border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/30 transition-colors text-gray-900 dark:text-white font-bold w-[46px] hover:scale-110 transform duration-200">
                G
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};