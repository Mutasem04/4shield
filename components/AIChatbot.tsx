import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGeminiResponse } from '../services/geminiService';
import { useApp } from '../contexts/AppContext';

const AIChatbot: React.FC = () => {
  const { t } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: 'Hello! I am Reva, your personal concierge. How can I help you plan your dream getaway today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const response = await getGeminiResponse(userMsg, messages);

    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 rtl:right-auto rtl:left-4 rtl:md:left-6 z-50 flex flex-col items-end rtl:items-start">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            {...{
              initial: { opacity: 0, scale: 0.8, y: 20 },
              animate: { opacity: 1, scale: 1, y: 0 },
              exit: { opacity: 0, scale: 0.8, y: 20 }
            } as any}
            className="mb-4 w-[95vw] md:w-[400px] h-[70vh] md:h-[500px] bg-white/95 dark:bg-reva-800/95 backdrop-blur-xl border border-reva-gold/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-colors"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-gray-100 to-white dark:from-reva-900 dark:to-reva-800 border-b border-gray-200 dark:border-white/10 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-reva-gold/20 flex items-center justify-center text-reva-gold">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t('aiTitle')}</h3>
                  <p className="text-xs text-reva-gold">{t('aiSub')}</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-reva-gold text-reva-900 rounded-br-none rtl:rounded-bl-none rtl:rounded-br-2xl font-medium' 
                      : 'bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-100 rounded-bl-none rtl:rounded-br-none rtl:rounded-bl-2xl'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                 <div className="flex justify-start">
                   <div className="bg-gray-100 dark:bg-white/10 p-3 rounded-2xl rounded-bl-none rtl:rounded-br-none rtl:rounded-bl-2xl flex items-center gap-2">
                     <Loader2 className="animate-spin text-reva-gold" size={16} />
                     <span className="text-xs text-gray-500 dark:text-gray-400">{t('thinking')}</span>
                   </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-gray-50/50 dark:bg-reva-900/50 border-t border-gray-200 dark:border-white/10 flex-shrink-0">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={t('askRec')}
                  className="w-full bg-white dark:bg-reva-800 text-gray-900 dark:text-white rounded-full pl-4 rtl:pl-12 rtl:pr-4 pr-12 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-reva-gold border border-gray-200 dark:border-white/5 shadow-sm"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 rtl:right-auto rtl:left-2 top-1/2 -translate-y-1/2 p-2 bg-reva-gold rounded-full text-reva-900 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={16} className="rtl:rotate-180" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        {...{
          whileHover: { scale: 1.1 },
          whileTap: { scale: 0.9 }
        } as any}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 md:w-14 md:h-14 bg-reva-gold text-reva-900 rounded-full shadow-lg shadow-reva-gold/30 flex items-center justify-center font-bold"
      >
        {isOpen ? <X size={20} className="md:w-6 md:h-6" /> : <MessageCircle size={24} className="md:w-[28px] md:h-[28px]" />}
      </motion.button>
    </div>
  );
};

export default AIChatbot;