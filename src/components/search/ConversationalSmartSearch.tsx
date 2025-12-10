import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import SmartSearchChat, { ChatMessage } from './SmartSearchChat';
import SmartSearchResults from './SmartSearchResults';
import { SearchProduct } from './SmartSearchProductCard';

// API endpoint for product search
const API_BASE = '/.netlify/functions/products';

interface ConversationalSmartSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

// AI System Prompt for understanding product queries
const SYSTEM_PROMPT = `You are a helpful product search assistant for Outpost, a workwear and promotional clothing company.

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

When you DO search, your message should briefly describe what you found, e.g.:
- "Here are some budget-friendly t-shirts! Let me know if you'd like to filter by color or brand."
- "I've found polo shirts that would work great for staff uniforms. Want me to narrow these down?"

When you DON'T have enough to search (greeting, unclear request), set searchQuery to null and ask what they're looking for.

Available categories: T-Shirts, Polo Shirts, Sweatshirts, Hoodies, Fleeces, Jackets, Coats, Trousers, Shorts, Hi-Vis, Workwear, Footwear, Caps, Beanies, Bags, Aprons.

Popular brands: Stanley/Stella, Fruit of the Loom, Gildan, Russell, B&C Collection, AWDis, Result, Regatta, Snickers.

Keep responses concise (1-2 sentences).`;

const ConversationalSmartSearch: React.FC<ConversationalSmartSearchProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<{ role: string; content: string }[]>([]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Small delay before clearing to allow close animation
      const timer = setTimeout(() => {
        setMessages([]);
        setProducts([]);
        setHasSearched(false);
        setConversationHistory([]);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Execute search via Netlify function API
  const executeSearch = async (searchQuery: {
    keywords?: string[];
    category?: string;
    brand?: string;
    priceMax?: number;
    priceMin?: number;
    color?: string;
    sustainable?: boolean;
    gender?: string;
  }): Promise<SearchProduct[]> => {
    try {
      // Build query params for API
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
      if (searchQuery.gender) {
        params.set('gender', searchQuery.gender);
      }
      if (searchQuery.keywords && searchQuery.keywords.length > 0) {
        params.set('search', searchQuery.keywords.join(' '));
      }

      const response = await fetch(`${API_BASE}/styles?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Search request failed');
      }

      const data = await response.json();

      if (!data.success || !data.styles) {
        return [];
      }

      // Transform to SearchProduct format
      return data.styles.map((item: any) => ({
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
    } catch (err) {
      console.error('Search execution error:', err);
      return [];
    }
  };

  // Send message to AI and get response
  const handleSendMessage = useCallback(async (userMessage: string) => {
    // Add user message to chat
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // Build conversation context for AI
      const newHistory = [
        ...conversationHistory,
        { role: 'user', content: userMessage },
      ];

      // Call OpenAI API via Railway backend
      const response = await fetch('https://outpost-custom-production.up.railway.app/api/smart-search-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory,
          systemPrompt: SYSTEM_PROMPT,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();

      // Parse AI response
      let aiMessage = "I'd be happy to help you find what you're looking for. Could you tell me more about what you need?";
      let searchQuery = null;

      try {
        // Try to parse JSON response
        const parsed = JSON.parse(data.message);
        aiMessage = parsed.message || aiMessage;
        searchQuery = parsed.searchQuery;
      } catch {
        // If not JSON, use as plain message
        aiMessage = data.message || aiMessage;
      }

      // Add AI message to chat
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiMessage,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);

      // Update conversation history
      setConversationHistory([
        ...newHistory,
        { role: 'assistant', content: data.message },
      ]);

      // Execute search only if we have meaningful query criteria
      // Check specifically for keywords or category - the main search drivers
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
    } catch (error) {
      console.error('Error sending message:', error);

      // Fallback: try local search with keywords
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Let me search for that...",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, fallbackMsg]);

      setHasSearched(true);
      const results = await executeSearch({
        keywords: userMessage.toLowerCase().split(' ').filter(w => w.length > 2),
      });
      setProducts(results);
    } finally {
      setIsTyping(false);
    }
  }, [conversationHistory]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70"
          />

          {/* Modal - centered with flexbox */}
          <div className="fixed z-50 inset-0 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-[900px] h-full max-h-[600px] bg-[#183028] rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
            >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <h2 className="text-lg font-medium text-white hearns-font">
                Smart Search
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
              >
                <X size={20} className="text-white/60" />
              </button>
            </div>

            {/* Content - Split Panel */}
            <div className="flex-1 flex overflow-hidden">
              {/* Chat Panel (Left - 40%) */}
              <div className="w-2/5 border-r border-white/10 flex flex-col">
                <SmartSearchChat
                  messages={messages}
                  isTyping={isTyping}
                  onSendMessage={handleSendMessage}
                />
              </div>

              {/* Results Panel (Right - 60%) */}
              <div className="w-3/5 flex flex-col">
                <SmartSearchResults
                  products={products}
                  isLoading={isTyping && hasSearched}
                  hasSearched={hasSearched}
                  onClose={onClose}
                />
              </div>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConversationalSmartSearch;
