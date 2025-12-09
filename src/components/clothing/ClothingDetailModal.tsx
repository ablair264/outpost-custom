import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ShoppingCart, Heart, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProductGroup } from './ClothingBrowser';

// Theme colors
const clothingColors = {
  dark: '#0a0a0a',
  accent: '#78BE20',
  secondary: '#1a1a1a',
};

interface ClothingDetailModalProps {
  productGroup: ProductGroup;
  isOpen: boolean;
  onClose: () => void;
}

const formatSizeRange = (sizeRange: string): string => {
  if (!sizeRange) return '';
  return sizeRange
    .replace(/to/gi, ' – ')
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')
    .replace(/(\d)([a-zA-Z])/g, '$1$2')
    .trim();
};

const ClothingDetailModal: React.FC<ClothingDetailModalProps> = ({
  productGroup,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const currentColor = productGroup.colors[selectedColorIndex];
  const currentImage = currentColor?.image || productGroup.variants[0]?.primary_product_image_url;

  // Get current variant based on selected color
  const currentVariant = productGroup.variants.find(v =>
    v.colour_code === currentColor?.code
  ) || productGroup.variants[0];

  // Get all sizes for this product
  const getAllSizes = () => {
    const sizes = new Set<string>();
    productGroup.variants.forEach(v => {
      if (v.size_name) sizes.add(v.size_name);
    });
    return Array.from(sizes);
  };

  const allSizes = getAllSizes();

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleGoToProduct = () => {
    navigate(`/products/${productGroup.style_code}`);
    onClose();
  };

  const nextColor = () => {
    setSelectedColorIndex((prev) =>
      prev < productGroup.colors.length - 1 ? prev + 1 : 0
    );
  };

  const prevColor = () => {
    setSelectedColorIndex((prev) =>
      prev > 0 ? prev - 1 : productGroup.colors.length - 1
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl max-h-[90vh] mx-4 rounded-2xl overflow-hidden shadow-2xl"
            style={{ backgroundColor: clothingColors.dark }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="flex flex-col md:flex-row max-h-[90vh] overflow-y-auto md:overflow-hidden">
              {/* Left: Image Gallery */}
              <div className="md:w-1/2 bg-white relative flex-shrink-0">
                {/* Main Image */}
                <div className="aspect-square relative">
                  <img
                    src={currentImage !== 'Not available'
                      ? currentImage
                      : `https://via.placeholder.com/800x800/ffffff/78BE20?text=${encodeURIComponent(productGroup.style_name?.slice(0, 2) || 'P')}`
                    }
                    alt={productGroup.style_name}
                    className="w-full h-full object-contain p-8"
                    onError={(e) => {
                      e.currentTarget.src = `https://via.placeholder.com/800x800/ffffff/78BE20?text=${encodeURIComponent(productGroup.style_name?.slice(0, 2) || 'P')}`;
                    }}
                  />

                  {/* Navigation arrows for colors */}
                  {productGroup.colors.length > 1 && (
                    <>
                      <button
                        onClick={prevColor}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-white" />
                      </button>
                      <button
                        onClick={nextColor}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-white" />
                      </button>
                    </>
                  )}

                  {/* Color indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60">
                    {productGroup.colors.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedColorIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === selectedColorIndex
                            ? 'bg-white scale-125'
                            : 'bg-white/50 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Product Info */}
              <div className="md:w-1/2 p-6 md:p-8 md:overflow-y-auto">
                {/* Brand */}
                <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: clothingColors.accent }}>
                  {productGroup.brand}
                </p>

                {/* Name */}
                <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-4" style={{ fontFamily: 'Montserrat, system-ui, sans-serif' }}>
                  {productGroup.style_name}
                </h2>

                {/* Price */}
                {productGroup.price_range && productGroup.price_range.min > 0 && (
                  <div className="mb-6">
                    <p className="text-3xl font-bold text-white" style={{ fontFamily: 'Montserrat, system-ui, sans-serif' }}>
                      £{productGroup.price_range.min.toFixed(2)}
                      {productGroup.price_range.min !== productGroup.price_range.max && (
                        <span className="text-lg font-normal text-white/60 ml-2">
                          – £{productGroup.price_range.max.toFixed(2)}
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-white/50 mt-1">Price varies by size and quantity</p>
                  </div>
                )}

                {/* Description */}
                {currentVariant?.specification && (
                  <div className="mb-6">
                    <p className="text-sm text-white/70 leading-relaxed">
                      {currentVariant.specification}
                    </p>
                  </div>
                )}

                {/* Colours */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-3">
                    Colour: <span className="text-white">{currentColor?.name}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {productGroup.colors.map((color, i) => (
                      <button
                        key={color.code}
                        onClick={() => setSelectedColorIndex(i)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          selectedColorIndex === i
                            ? 'border-[#78BE20] scale-110 ring-2 ring-[#78BE20]/30'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                        style={{ backgroundColor: color.rgb }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-3">
                    Available Sizes ({allSizes.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {allSizes.map((size) => (
                      <span
                        key={size}
                        className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm font-medium border border-white/10"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                  {productGroup.size_range && (
                    <p className="text-xs text-white/40 mt-2">
                      Size range: {formatSizeRange(productGroup.size_range)}
                    </p>
                  )}
                </div>

                {/* Product Details */}
                <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-t border-b border-white/10">
                  <div>
                    <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wide mb-1">
                      Style Code
                    </p>
                    <p className="text-sm text-white font-medium">{productGroup.style_code}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wide mb-1">
                      Total Variants
                    </p>
                    <p className="text-sm text-white font-medium">{productGroup.variants.length}</p>
                  </div>
                  {currentVariant?.fabric && (
                    <div>
                      <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wide mb-1">
                        Fabric
                      </p>
                      <p className="text-sm text-white font-medium">{currentVariant.fabric}</p>
                    </div>
                  )}
                  {currentVariant?.gender && (
                    <div>
                      <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wide mb-1">
                        Gender
                      </p>
                      <p className="text-sm text-white font-medium">{currentVariant.gender}</p>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/70">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-4 h-4" style={{ color: clothingColors.accent }} />
                      <span>Custom embroidery</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-4 h-4" style={{ color: clothingColors.accent }} />
                      <span>Screen printing</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-4 h-4" style={{ color: clothingColors.accent }} />
                      <span>Bulk discounts</span>
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleGoToProduct}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-black transition-all hover:opacity-90"
                    style={{ backgroundColor: clothingColors.accent }}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    View & Configure
                  </button>
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all border-2 ${
                      isFavorite
                        ? 'bg-[#78BE20] border-[#78BE20] text-black'
                        : 'border-white/30 text-white hover:bg-white/10 hover:border-white/50'
                    }`}
                  >
                    <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {/* Contact */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <p className="text-sm text-white/50 text-center">
                    Need help? <a href="mailto:info@outpostcustom.co.uk" className="text-[#78BE20] hover:underline">Contact our team</a>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ClothingDetailModal;
