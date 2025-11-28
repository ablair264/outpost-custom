import React, { useState } from 'react';
import { X, Sparkles, Send, Lightbulb, MessageSquare } from 'lucide-react';
import { ProductFilters } from '../lib/productBrowserApi';
import './SmartSearchModal.css';

interface SmartSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySearch: (query: string, filters: ProductFilters) => void;
}

interface QuickQuestion {
  id: string;
  question: string;
  category: 'purpose' | 'audience' | 'style' | 'budget';
  icon: React.ReactNode;
}

const SmartSearchModal: React.FC<SmartSearchModalProps> = ({
  isOpen,
  onClose,
  onApplySearch
}) => {
  // Remote ON by default; set REACT_APP_SMART_SEARCH_REMOTE=false to force local-only
  const SMART_SEARCH_REMOTE = (process.env.REACT_APP_SMART_SEARCH_REMOTE || '').toLowerCase() !== 'false';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Quick questions to help users
  const quickQuestions: QuickQuestion[] = [
    {
      id: 'corporate-gifts',
      question: 'Corporate gifts for clients',
      category: 'purpose',
      icon: <Lightbulb size={16} />
    },
    {
      id: 'team-uniforms',
      question: 'Uniforms for my team',
      category: 'purpose',
      icon: <MessageSquare size={16} />
    },
    {
      id: 'promotional-items',
      question: 'Promotional items for events',
      category: 'purpose',
      icon: <Sparkles size={16} />
    },
    {
      id: 'outdoor-workwear',
      question: 'Outdoor workwear that lasts',
      category: 'style',
      icon: <Lightbulb size={16} />
    },
    {
      id: 'budget-friendly',
      question: 'Budget-friendly options',
      category: 'budget',
      icon: <MessageSquare size={16} />
    },
    {
      id: 'premium-quality',
      question: 'Premium quality products',
      category: 'budget',
      icon: <Sparkles size={16} />
    },
    {
      id: 'large-quantities',
      question: 'Large quantity orders',
      category: 'purpose',
      icon: <Lightbulb size={16} />
    },
    {
      id: 'sustainable',
      question: 'Eco-friendly & sustainable',
      category: 'style',
      icon: <MessageSquare size={16} />
    }
  ];

  const exampleQueries = [
    "I need branded polo shirts for a team of 20 office workers",
    "High-vis safety gear for construction workers",
    "Promotional tote bags for a trade show under £10 each",
    "Warm winter jackets for outdoor staff",
    "Sustainable workwear options with company logo"
  ];

  const toggleQuestion = (questionId: string) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() && selectedQuestions.length === 0) return;

    setIsProcessing(true);

    try {
      // Build search query from selected questions and text
      const selectedQuestionTexts = quickQuestions
        .filter(q => selectedQuestions.includes(q.id))
        .map(q => q.question);
      
      const fullQuery = [searchQuery, ...selectedQuestionTexts]
        .filter(Boolean)
        .join('. ');

      if (!SMART_SEARCH_REMOTE) {
        // Local-only: derive simple filters from query and let Supabase do the heavy lifting
        const localFilters = generateFallbackFilters(fullQuery);
        console.log('[SmartSearch] Using local matching only. Filters:', localFilters);
        setIsProcessing(false);
        onApplySearch(fullQuery, localFilters);
        onClose();
        return;
      }

      // Remote AI-powered filter generation (only if explicitly enabled)
      const generatedFilters = await generateFiltersFromQuery(fullQuery, selectedQuestionTexts);

      setIsProcessing(false);
      onApplySearch(fullQuery, generatedFilters);
      onClose();
    } catch (error) {
      console.error('Search failed:', error);
      setIsProcessing(false);
      // Could show error message to user here
    }
  };

  // AI-powered filter generation using backend API
  const generateFiltersFromQuery = async (query: string, selectedQuestionTexts: string[]): Promise<ProductFilters> => {
    const explicitUrl = process.env.REACT_APP_SMART_SEARCH_URL; // full endpoint, e.g. https://splitfin-zoho-api.onrender.com/api/smart-search
    const renderBase = process.env.REACT_APP_RENDER_API_BASE_URL; // base URL, e.g. https://splitfin-zoho-api.onrender.com
    const apiBase = process.env.REACT_APP_API_BASE_URL; // base path, e.g. /api or https://host/api

    const bases: string[] = [];
    if (explicitUrl) bases.push(explicitUrl);
    if (renderBase) {
      bases.push(`${renderBase.replace(/\/$/, '')}/api/smart-search`);
      bases.push(`${renderBase.replace(/\/$/, '')}/smart-search`);
    }
    if (apiBase) bases.push(`${apiBase.replace(/\/$/, '')}/smart-search`);
    // Local/Netlify defaults
    bases.push('/api/smart-search');
    bases.push('/.netlify/functions/smart-search');
    const payload = {
      mode: 'ai',
      query,
      selectedQuestions: selectedQuestionTexts,
      availableFilters: {
        productTypes: ['T-Shirts', 'Hoodies', 'Polo Shirts', 'Jackets', 'Bags', 'Accessories'],
        materials: ['Cotton', 'Polyester', 'Cotton/Polyester blends', 'Viscose blends', 'Organic Cotton'],
        brands: ["AWDis Just T's", 'Bella + Canvas', 'Gildan', 'Fruit of the Loom', 'Russell'],
        genders: ['Male', 'Female', 'Unisex'],
        ageGroups: ['Adult', 'Youth', 'Kids'],
        priceRange: { min: 0, max: 100 }
      }
    };

    // De-duplicate while preserving order
    const tried = new Set<string>();
    for (const base of bases) {
      if (!base || tried.has(base)) continue;
      tried.add(base);
      try {
        const url = base;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const contentType = response.headers.get('content-type') || '';
        console.log('[SmartSearch] Request', { url, status: response.status, ok: response.ok, contentType });
        let data: any;
        if (contentType.includes('application/json')) {
          data = await response.json();
        } else {
          const text = await response.text();
          try {
            data = JSON.parse(text);
          } catch {
            console.warn(`[SmartSearch] Non-JSON response from ${url}:`, text.slice(0, 200));
            throw new Error(`Non-JSON response (${response.status})`);
          }
        }

        // Accept either normalized responses (success + filters) or plain filters
        if (data?.success && data?.filters) {
          console.log('AI Explanation:', data.explanation);
          console.log('Generated Filters:', JSON.stringify(data.filters, null, 2));
          return data.filters;
        } else if (data?.filters) {
          console.log('Generated Filters (no success flag):', JSON.stringify(data.filters, null, 2));
          return data.filters;
        } else if (data?.data?.filters) {
          console.log('Generated Filters (nested data):', JSON.stringify(data.data.filters, null, 2));
          return data.data.filters;
        } else {
          console.warn('[SmartSearch] Upstream payload had no filters. Full payload follows:');
          console.dir(data);
          console.warn('AI search failed, using fallback:', data?.error);
          return data?.fallback || {};
        }
      } catch (err) {
        console.warn('[SmartSearch] API base failed:', base, err);
        // try next base
      }
    }

    console.error('All API bases failed; using fallback filters');
    return generateFallbackFilters(query);
  };

  // Fallback function for when API fails
  const generateFallbackFilters = (query: string): ProductFilters => {
    const filters: ProductFilters = {};
    const lowerQuery = query.toLowerCase();

    // Product type detection - using actual product types from your database
    if (lowerQuery.includes('polo')) {
      filters.productTypes = ['Polos'];
    } else if (lowerQuery.includes('shirt') || lowerQuery.includes('tee') || lowerQuery.includes('t-shirt')) {
      filters.productTypes = ['T-Shirts'];
    }
    if (lowerQuery.includes('hoodie') || lowerQuery.includes('sweatshirt')) {
      filters.productTypes = ['Hoodies'];
    }
    if (lowerQuery.includes('jacket') || lowerQuery.includes('coat')) {
      filters.productTypes = ['Jackets'];
    }
    if (lowerQuery.includes('bag') || lowerQuery.includes('tote')) {
      filters.productTypes = ['Bags'];
    }

    // Price detection
    if (lowerQuery.includes('budget') || lowerQuery.includes('cheap') || lowerQuery.includes('under £10')) {
      filters.priceMax = 10;
    }
    if (lowerQuery.includes('premium') || lowerQuery.includes('high quality')) {
      filters.priceMin = 50;
    }
    if (lowerQuery.includes('under £25')) {
      filters.priceMax = 25;
    }

    // Material/sustainability detection
    if (lowerQuery.includes('sustainable') || lowerQuery.includes('eco') || lowerQuery.includes('organic')) {
      filters.materials = ['Organic Cotton', 'Recycled'];
    }

    // Gender detection
    if (lowerQuery.includes('office') || lowerQuery.includes('corporate')) {
      filters.genders = ['Unisex'];
    }

    return filters;
  };

  const clearAll = () => {
    setSearchQuery('');
    setSelectedQuestions([]);
  };

  if (!isOpen) return null;

  return (
    <div className="smart-search-overlay" onClick={onClose}>
      <div className="smart-search-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <Sparkles size={24} className="header-icon" />
            <div>
              <h2>Smart Product Search</h2>
              <p>Tell us what you need and we'll find the perfect products</p>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="modal-body">
          {/* Main Search */}
          <div className="search-section">
            <label className="search-label">
              What are you looking for?
            </label>
            <div className="search-input-container">
              <textarea
                className="search-textarea"
                placeholder="Describe what you need... (e.g., 'I need branded polo shirts for a team of 20 office workers')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Quick Questions */}
          <div className="questions-section">
            <h3>Or choose what applies to you:</h3>
            <div className="questions-grid">
              {quickQuestions.map(question => (
                <button
                  key={question.id}
                  className={`question-button ${selectedQuestions.includes(question.id) ? 'selected' : ''}`}
                  onClick={() => toggleQuestion(question.id)}
                >
                  {question.icon}
                  <span>{question.question}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Example Queries */}
          <div className="examples-section">
            <h4>Example searches:</h4>
            <div className="examples-list">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  className="example-button"
                  onClick={() => setSearchQuery(example)}
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button 
            className="clear-button"
            onClick={clearAll}
            disabled={!searchQuery && selectedQuestions.length === 0}
          >
            Clear All
          </button>
          <button 
            className="search-button"
            onClick={handleSearch}
            disabled={(!searchQuery.trim() && selectedQuestions.length === 0) || isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="spinner"></div>
                Finding products...
              </>
            ) : (
              <>
                <Send size={18} />
                Smart Search
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default SmartSearchModal;
