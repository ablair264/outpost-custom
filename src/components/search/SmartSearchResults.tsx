import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Search, Loader2 } from 'lucide-react';
import SmartSearchProductCard, { SearchProduct } from './SmartSearchProductCard';

const colors = {
  accent: '#64a70b',
  dark: '#183028',
  secondary: '#1e3a2f',
};

const fonts = {
  heading: "'Hearns', serif",
  subheading: "'Embossing Tape 3', sans-serif",
  body: "'Neuzeit Grotesk', sans-serif",
};

interface SmartSearchResultsProps {
  products: SearchProduct[];
  isLoading: boolean;
  hasSearched: boolean;
  onClose?: () => void;
}

const SmartSearchResults: React.FC<SmartSearchResultsProps> = ({
  products,
  isLoading,
  hasSearched,
  onClose,
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 size={32} style={{ color: colors.accent }} />
        </motion.div>
        <p
          className="mt-4 text-sm"
          style={{ color: 'rgba(255, 255, 255, 0.6)', fontFamily: fonts.body }}
        >
          Searching products...
        </p>
      </div>
    );
  }

  // Empty state - no search yet
  if (!hasSearched) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: 'rgba(100, 167, 11, 0.15)' }}
        >
          <Search size={28} style={{ color: colors.accent }} />
        </div>
        <h3
          className="text-lg font-medium mb-2"
          style={{ color: 'white', fontFamily: fonts.heading }}
        >
          Start a Conversation
        </h3>
        <p
          className="text-sm max-w-xs"
          style={{ color: 'rgba(255, 255, 255, 0.5)', fontFamily: fonts.body }}
        >
          Tell me what you're looking for and I'll help you find the perfect products.
        </p>
      </div>
    );
  }

  // No results found
  if (products.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
        >
          <Package size={28} style={{ color: 'rgba(255, 255, 255, 0.3)' }} />
        </div>
        <h3
          className="text-lg font-medium mb-2"
          style={{ color: 'white', fontFamily: fonts.heading }}
        >
          No Products Found
        </h3>
        <p
          className="text-sm max-w-xs"
          style={{ color: 'rgba(255, 255, 255, 0.5)', fontFamily: fonts.body }}
        >
          Try describing what you're looking for in a different way, or ask me for suggestions.
        </p>
      </div>
    );
  }

  // Results grid
  return (
    <div className="h-full flex flex-col">
      {/* Results header */}
      <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
        <p
          className="text-sm"
          style={{ color: 'rgba(255, 255, 255, 0.6)', fontFamily: fonts.body }}
        >
          <span style={{ color: colors.accent, fontWeight: 600 }}>{products.length}</span>
          {' '}product{products.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Products grid - scrollable */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          <AnimatePresence mode="popLayout">
            {products.map((product, index) => (
              <motion.div
                key={product.id || product.sku || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <SmartSearchProductCard product={product} onClose={onClose} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SmartSearchResults;
