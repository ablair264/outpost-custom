import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Send, X, Sparkles, User, Search, Lightbulb } from 'lucide-react';
import SmartSearchResults from './search/SmartSearchResults';
import { SearchProduct } from './search/SmartSearchProductCard';

const API_BASE = '/.netlify/functions/products';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type ChatMode = 'livechat' | 'smartsearch';

// Clothing page paths
const CLOTHING_PATHS = ['/clothing', '/product/', '/all-clothing'];

// AI System Prompt for SmartSearch mode
const SMART_SEARCH_PROMPT = `You are a helpful product search assistant for Outpost, a workwear and promotional clothing company.

CRITICAL BEHAVIOR:
- When the user mentions ANY product type (t-shirts, jackets, polos, etc.), ALWAYS search immediately
- Don't ask clarifying questions unless the query is genuinely unclear (e.g., just "hi" or "help")
- "Budget-friendly t-shirts" = search for t-shirts sorted by price. Don't ask about colors first.
- "Polo shirts for staff" = search for polo shirts. Don't ask about brand preferences first.
- Search first, then offer to refine. Users can see results and ask for changes.

IMPORTANT: You must respond with a JSON object in this exact format:
{
  "message": "Your conversational response to the user",
  "searchQuery": {
    "keywords": ["keyword1", "keyword2"],
    "category": "category name or null",
    "brand": "brand name or null",
    "priceMax": number or null,
    "priceMin": number or null,
    "color": "color name or null",
    "sustainable": boolean or null,
    "gender": "Mens", "Ladies", "Unisex" or null
  }
}

When you DO search, your message should briefly describe what you found.
When you DON'T have enough to search, set searchQuery to null and ask what they're looking for.

Available categories: T-Shirts, Polo Shirts, Sweatshirts, Hoodies, Fleeces, Jackets, Coats, Trousers, Shorts, Hi-Vis, Workwear, Footwear, Caps, Beanies, Bags, Aprons.

Keep responses concise (1-2 sentences).`;

const UnifiedChatWidget: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>('livechat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showProactivePopup, setShowProactivePopup] = useState(false);
  const [idleTime, setIdleTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine if we're on a clothing page
  const isClothingPage = CLOTHING_PATHS.some(path => location.pathname.startsWith(path));

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setMessages([]);
        setProducts([]);
        setHasSearched(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Set mode based on page
  useEffect(() => {
    if (isClothingPage) {
      setMode('smartsearch');
    } else {
      setMode('livechat');
    }
  }, [isClothingPage]);

  // Proactive popup after idle time on clothing pages
  useEffect(() => {
    if (!isClothingPage || isOpen) {
      setIdleTime(0);
      setShowProactivePopup(false);
      return;
    }

    const interval = setInterval(() => {
      setIdleTime(prev => prev + 1);
    }, 1000);

    // Show popup after 30 seconds of idle time
    if (idleTime >= 30 && !showProactivePopup) {
      setShowProactivePopup(true);
    }

    return () => clearInterval(interval);
  }, [isClothingPage, isOpen, idleTime, showProactivePopup]);

  // Reset idle time on user activity
  useEffect(() => {
    const resetIdle = () => setIdleTime(0);
    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    window.addEventListener('scroll', resetIdle);
    return () => {
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('scroll', resetIdle);
    };
  }, []);

  // Execute product search using Netlify API
  const executeSearch = async (searchQuery: {
    keywords?: string[];
    category?: string;
    brand?: string;
    priceMax?: number;
    priceMin?: number;
  }): Promise<SearchProduct[]> => {
    try {
      const params = new URLSearchParams();
      params.set('limit', '24');

      if (searchQuery.category) {
        params.set('productType', searchQuery.category);
      }
      if (searchQuery.brand) {
        params.set('brand', searchQuery.brand);
      }
      if (searchQuery.priceMin !== undefined && searchQuery.priceMin !== null) {
        params.set('priceMin', searchQuery.priceMin.toString());
      }
      if (searchQuery.priceMax !== undefined && searchQuery.priceMax !== null) {
        params.set('priceMax', searchQuery.priceMax.toString());
      }
      if (searchQuery.keywords && searchQuery.keywords.length > 0) {
        params.set('search', searchQuery.keywords.join(' '));
      }

      const response = await fetch(`${API_BASE}/styles?${params.toString()}`);
      if (!response.ok) return [];

      const data = await response.json();
      const styles = data.styles || [];

      return styles.map((item: any) => ({
        id: item.id?.toString() || item.style_code,
        sku: item.style_code,
        title: item.style_name,
        supplier_name: item.brand,
        category: item.product_type,
        base_price: item.price_min ? parseFloat(item.price_min) : undefined,
        max_price: item.price_max ? parseFloat(item.price_max) : undefined,
        primary_image_url: item.primary_product_image_url,
        color_count: item.available_colors?.length || 1,
      }));
    } catch {
      return [];
    }
  };

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      if (mode === 'smartsearch') {
        // SmartSearch mode - use product search API
        const response = await fetch('https://outpost-custom-production.up.railway.app/api/smart-search-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: messages.map(m => ({ role: m.role, content: m.content })).concat([{ role: 'user', content: trimmed }]),
            systemPrompt: SMART_SEARCH_PROMPT,
          }),
        });

        const data = await response.json();
        let aiMessage = "I'd be happy to help you find what you're looking for.";
        let searchQuery = null;

        try {
          const parsed = JSON.parse(data.message);
          aiMessage = parsed.message || aiMessage;
          searchQuery = parsed.searchQuery;
        } catch {
          aiMessage = data.message || aiMessage;
        }

        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiMessage,
        }]);

        // Execute search if criteria provided
        const hasSearchCriteria = searchQuery && (
          (searchQuery.keywords && searchQuery.keywords.length > 0) ||
          (searchQuery.category && searchQuery.category.trim() !== '') ||
          (searchQuery.brand && searchQuery.brand.trim() !== '')
        );

        if (hasSearchCriteria) {
          setHasSearched(true);
          const results = await executeSearch(searchQuery);
          setProducts(results);
        }
      } else {
        // LiveChat mode - use service chat API
        const apiUrl = process.env.REACT_APP_CHAT_API_URL || 'https://outpost-custom-production.up.railway.app/api/chat';
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            history: messages.map(m => ({ role: m.role, content: m.content })),
          }),
        });

        const data = await response.json();
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.reply || data.error || 'Sorry, I had trouble with that.',
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Network error. Please try again.',
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, mode]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleOpen = (forceMode?: ChatMode) => {
    if (forceMode) setMode(forceMode);
    setIsOpen(true);
    setShowProactivePopup(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const isExpanded = mode === 'smartsearch' && isOpen;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isOpen ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`bg-[#183028] shadow-2xl flex flex-col overflow-hidden border border-white/10 ${
                isExpanded
                  ? 'fixed inset-0 sm:relative sm:inset-auto w-full h-full sm:w-[900px] sm:h-[600px] sm:rounded-2xl rounded-none'
                  : 'fixed inset-0 sm:relative sm:inset-auto w-full h-full sm:w-[380px] sm:h-[550px] sm:rounded-2xl rounded-none'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-gradient-to-r from-[#64a70b]/10 to-transparent">
                <div className="flex items-center gap-3">
                  {mode === 'smartsearch' ? (
                    <div className="w-10 h-10 rounded-full bg-[#64a70b]/20 flex items-center justify-center">
                      <Search size={20} className="text-[#64a70b]" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#64a70b]/20 flex items-center justify-center">
                      <MessageCircle size={20} className="text-[#64a70b]" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-semibold text-white hearns-font">
                      {mode === 'smartsearch' ? 'Smart Search' : 'Live Chat'}
                    </h2>
                    <p className="text-xs text-white/50">
                      {mode === 'smartsearch' ? 'Find the perfect products' : 'Ask us anything'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <X size={20} className="text-white/60" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
                {/* Products Panel (top on mobile, left on desktop, only in SmartSearch) */}
                {isExpanded && (
                  <div className="h-[45%] sm:h-auto sm:w-[55%] border-b sm:border-b-0 sm:border-r border-white/10 overflow-auto">
                    <SmartSearchResults
                      products={products}
                      isLoading={loading && hasSearched}
                      hasSearched={hasSearched}
                      onClose={handleClose}
                    />
                  </div>
                )}

                {/* Chat Panel */}
                <div className={`flex flex-col ${isExpanded ? 'h-[55%] sm:h-auto sm:w-[45%]' : 'w-full'}`}>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && (
                      <div className="text-center py-8">
                        <div className="w-14 h-14 rounded-full bg-[#64a70b]/15 flex items-center justify-center mx-auto mb-4">
                          <Sparkles size={28} className="text-[#64a70b]" />
                        </div>
                        <h3 className="text-base font-medium text-white mb-2 hearns-font">
                          {mode === 'smartsearch' ? 'How can I help?' : 'Hi there!'}
                        </h3>
                        <p className="text-sm text-white/50 max-w-xs mx-auto">
                          {mode === 'smartsearch'
                            ? 'Describe what you\'re looking for'
                            : 'Ask about our services, pricing, or anything else'}
                        </p>

                        {/* Quick suggestions for SmartSearch */}
                        {mode === 'smartsearch' && (
                          <div className="flex flex-wrap gap-2 justify-center mt-4">
                            {['Polo shirts for staff', 'Budget t-shirts', 'Warm jackets'].map((suggestion) => (
                              <button
                                key={suggestion}
                                onClick={() => {
                                  setInput(suggestion);
                                  setTimeout(() => sendMessage(), 100);
                                }}
                                className="px-3 py-1.5 rounded-full text-xs bg-[#64a70b]/15 text-[#64a70b] border border-[#64a70b]/30 hover:bg-[#64a70b]/25 transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="w-7 h-7 rounded-full bg-[#64a70b]/20 flex-shrink-0 flex items-center justify-center">
                            <Sparkles size={14} className="text-[#64a70b]" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                            msg.role === 'user'
                              ? 'bg-[#64a70b] text-white rounded-br-sm'
                              : 'bg-white/10 text-white/90 rounded-bl-sm'
                          }`}
                        >
                          {msg.content}
                        </div>
                        {msg.role === 'user' && (
                          <div className="w-7 h-7 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center">
                            <User size={14} className="text-white/70" />
                          </div>
                        )}
                      </div>
                    ))}

                    {loading && (
                      <div className="flex gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#64a70b]/20 flex-shrink-0 flex items-center justify-center">
                          <Sparkles size={14} className="text-[#64a70b]" />
                        </div>
                        <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-sm">
                          <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                              <motion.span
                                key={i}
                                className="w-2 h-2 rounded-full bg-[#64a70b]"
                                animate={{ y: [0, -4, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-3 border-t border-white/10">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKey}
                        placeholder={mode === 'smartsearch' ? 'Describe what you need...' : 'Type a message...'}
                        disabled={loading}
                        className="flex-1 bg-transparent text-sm text-white placeholder-white/40 outline-none"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!input.trim() || loading}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-[#64a70b] disabled:opacity-40 transition-opacity"
                      >
                        <Send size={16} className="text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Proactive popup */}
              <AnimatePresence>
                {showProactivePopup && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-20 right-0 bg-[#183028] rounded-xl p-4 shadow-xl border border-white/10 w-64"
                  >
                    <button
                      onClick={() => setShowProactivePopup(false)}
                      className="absolute top-2 right-2 text-white/40 hover:text-white/60"
                    >
                      <X size={16} />
                    </button>
                    <p className="text-sm text-white mb-3">Need help finding something?</p>
                    <button
                      onClick={() => handleOpen('smartsearch')}
                      className="w-full py-2 bg-[#64a70b] text-white text-sm font-medium rounded-lg hover:bg-[#5a9608] transition-colors"
                    >
                      Start Smart Search
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main toggle button - smaller on mobile */}
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleOpen()}
                className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-3 rounded-full bg-[#64a70b] text-white font-semibold shadow-lg shadow-[#64a70b]/30"
              >
                {isClothingPage ? (
                  <>
                    <Lightbulb size={20} fill="currentColor" />
                    <span className="hidden sm:inline">Smart Search</span>
                  </>
                ) : (
                  <>
                    <MessageCircle size={20} />
                    <span className="hidden sm:inline">Chat with us</span>
                  </>
                )}
              </motion.button>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default UnifiedChatWidget;
