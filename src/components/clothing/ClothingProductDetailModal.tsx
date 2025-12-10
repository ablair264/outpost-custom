import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Check, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProductGroup } from './ClothingBrowser';
import ClothingPathSelector, { ClothingSubmissionPath } from './ClothingPathSelector';
import ClothingLogoUploader from './ClothingLogoUploader';
import ClothingHelpRequestForm from './ClothingHelpRequestForm';
import ClothingConsultationBooker from './ClothingConsultationBooker';

// Theme colors - matching clothing pages
const clothingColors = {
  accent: '#64a70b',
  dark: '#183028',
  darkLight: '#234a3a',
  secondary: '#1e3a2f',
};

type ModalStep = 'info' | 'path-select' | 'upload' | 'help' | 'consult' | 'details' | 'success';

interface ClothingProductDetailModalProps {
  productGroup: ProductGroup;
  isOpen: boolean;
  onClose: () => void;
}

const formatSizeRange = (sizeRange: string): string => {
  if (!sizeRange) return '';
  return sizeRange
    .replace(/to/gi, ' - ')
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')
    .replace(/(\d)([a-zA-Z])/g, '$1$2')
    .trim();
};

const ClothingProductDetailModal: React.FC<ClothingProductDetailModalProps> = ({
  productGroup,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<ModalStep>('info');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedPath, setSelectedPath] = useState<ClothingSubmissionPath | null>(null);

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

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep('info');
      setSelectedPath(null);
    }
  }, [isOpen]);

  const handlePathSelect = (path: ClothingSubmissionPath) => {
    setSelectedPath(path);
    switch (path) {
      case 'ready':
        setCurrentStep('upload');
        break;
      case 'help':
        setCurrentStep('help');
        break;
      case 'consult':
        setCurrentStep('consult');
        break;
    }
  };

  const handleGoToProduct = () => {
    navigate(`/products/${productGroup.style_code}`);
    onClose();
  };

  const handleBack = () => {
    if (currentStep === 'upload' || currentStep === 'help' || currentStep === 'consult') {
      setCurrentStep('path-select');
    } else if (currentStep === 'path-select') {
      setCurrentStep('info');
    }
  };

  const handleComplete = () => {
    setCurrentStep('success');
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

  // Product info step content
  const renderProductInfo = () => (
    <div className="flex flex-col md:flex-row max-h-[90vh] overflow-y-auto md:overflow-hidden">
      {/* Left: Image Gallery */}
      <div className="md:w-2/5 bg-white relative flex-shrink-0">
        {/* Main Image */}
        <div className="aspect-square relative">
          <img
            src={currentImage !== 'Not available'
              ? currentImage
              : `https://via.placeholder.com/800x800/ffffff/64a70b?text=${encodeURIComponent(productGroup.style_name?.slice(0, 2) || 'P')}`
            }
            alt={productGroup.style_name}
            className="w-full h-full object-contain p-8"
            onError={(e) => {
              e.currentTarget.src = `https://via.placeholder.com/800x800/ffffff/64a70b?text=${encodeURIComponent(productGroup.style_name?.slice(0, 2) || 'P')}`;
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
            {productGroup.colors.slice(0, 8).map((_, i) => (
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
            {productGroup.colors.length > 8 && (
              <span className="text-[10px] text-white/70 ml-1">+{productGroup.colors.length - 8}</span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Product Info */}
      <div className="md:w-3/5 p-6 md:p-8 md:overflow-y-auto">
        {/* Brand */}
        <p className="embossing-font text-[11px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: clothingColors.accent }}>
          {productGroup.brand}
        </p>

        {/* Name */}
        <h2 className="hearns-font text-2xl md:text-3xl text-white leading-tight mb-4">
          {productGroup.style_name}
        </h2>

        {/* Price */}
        {productGroup.price_range && productGroup.price_range.min > 0 && (
          <div className="mb-5">
            <p className="neuzeit-font text-2xl font-bold text-white">
              From £{productGroup.price_range.min.toFixed(2)}
              {productGroup.price_range.min !== productGroup.price_range.max && (
                <span className="text-base font-normal text-white/60 ml-2">
                  - £{productGroup.price_range.max.toFixed(2)}
                </span>
              )}
            </p>
            <p className="neuzeit-light-font text-sm text-white/50 mt-1">Price varies by size and quantity</p>
          </div>
        )}

        {/* Colours */}
        <div className="mb-5">
          <p className="embossing-font text-[10px] font-semibold text-white/50 uppercase tracking-wide mb-2">
            Colour: <span className="text-white/80">{currentColor?.name}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {productGroup.colors.slice(0, 12).map((color, i) => (
              <button
                key={color.code}
                onClick={() => setSelectedColorIndex(i)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  selectedColorIndex === i
                    ? 'border-[#64a70b] scale-110 ring-2 ring-[#64a70b]/30'
                    : 'border-white/20 hover:border-white/40'
                }`}
                style={{ backgroundColor: color.rgb }}
                title={color.name}
              />
            ))}
            {productGroup.colors.length > 12 && (
              <button
                onClick={handleGoToProduct}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[10px] text-white/60 hover:text-white font-medium transition-all border-2 border-white/15"
                title={`View all ${productGroup.colors.length} colours`}
              >
                +{productGroup.colors.length - 12}
              </button>
            )}
          </div>
        </div>

        {/* Sizes */}
        <div className="mb-5">
          <p className="embossing-font text-[10px] font-semibold text-white/50 uppercase tracking-wide mb-2">
            Available Sizes ({allSizes.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {allSizes.slice(0, 10).map((size) => (
              <span
                key={size}
                className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-sm neuzeit-font border border-white/10"
              >
                {size}
              </span>
            ))}
            {allSizes.length > 10 && (
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white/60 text-sm neuzeit-font">
                +{allSizes.length - 10} more
              </span>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mb-6 py-4 border-t border-b border-white/10">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/70">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4" style={{ color: clothingColors.accent }} />
              <span className="neuzeit-font">Custom embroidery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4" style={{ color: clothingColors.accent }} />
              <span className="neuzeit-font">Screen printing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4" style={{ color: clothingColors.accent }} />
              <span className="neuzeit-font">Vinyl transfer</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4" style={{ color: clothingColors.accent }} />
              <span className="neuzeit-font">Bulk discounts</span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <button
            onClick={() => setCurrentStep('path-select')}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl neuzeit-font font-semibold text-black transition-all hover:opacity-90"
            style={{ backgroundColor: clothingColors.accent }}
          >
            Get a Quote
          </button>
          <button
            onClick={handleGoToProduct}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl neuzeit-font font-semibold transition-all border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50"
          >
            View Full Details
          </button>
        </div>

        {/* Contact */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <p className="neuzeit-light-font text-sm text-white/50 text-center">
            Need help? <a href="mailto:info@outpostcustom.co.uk" className="hover:underline" style={{ color: clothingColors.accent }}>Contact our team</a>
          </p>
        </div>
      </div>
    </div>
  );

  // Success step content
  const renderSuccess = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-xl mx-auto text-center py-12 px-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className="w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center"
        style={{ backgroundColor: `${clothingColors.accent}25` }}
      >
        <CheckCircle className="w-12 h-12" style={{ color: clothingColors.accent }} />
      </motion.div>

      <h2 className="hearns-font text-3xl text-white mb-3">
        Request Received!
      </h2>
      <p className="embossing-font text-xl mb-4" style={{ color: clothingColors.accent }}>
        We'll be in touch soon
      </p>
      <p className="neuzeit-light-font text-white/70 max-w-md mx-auto mb-8">
        Our team will review your request and get back to you within 24 hours with a mockup and quote.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onClose}
          className="px-6 py-3 rounded-xl neuzeit-font font-semibold text-black transition-all hover:opacity-90"
          style={{ backgroundColor: clothingColors.accent }}
        >
          Continue Browsing
        </button>
        <button
          onClick={handleGoToProduct}
          className="px-6 py-3 rounded-xl neuzeit-font font-semibold transition-all border-2 border-white/30 text-white hover:bg-white/10"
        >
          View Product Details
        </button>
      </div>
    </motion.div>
  );

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
            className={`relative w-full mx-4 rounded-2xl overflow-hidden shadow-2xl ${
              currentStep === 'info' ? 'max-w-5xl max-h-[90vh]' : 'max-w-4xl max-h-[90vh]'
            }`}
            style={{ backgroundColor: clothingColors.dark }}
          >
            {/* Background texture */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'url(/BlackTextureBackground.webp)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Content */}
            <div className="relative z-10">
              <AnimatePresence mode="wait">
                {currentStep === 'info' && (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderProductInfo()}
                  </motion.div>
                )}

                {currentStep === 'path-select' && (
                  <motion.div
                    key="path-select"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="p-6 md:p-10 overflow-y-auto max-h-[90vh]"
                  >
                    <ClothingPathSelector
                      onSelectPath={handlePathSelect}
                      productName={productGroup.style_name}
                      recommendedPath="ready"
                    />
                  </motion.div>
                )}

                {currentStep === 'upload' && (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="p-6 md:p-10 overflow-y-auto max-h-[90vh]"
                  >
                    <ClothingLogoUploader
                      onBack={handleBack}
                      onComplete={handleComplete}
                      productTitle={productGroup.style_name}
                      productImage={currentImage}
                    />
                  </motion.div>
                )}

                {currentStep === 'help' && (
                  <motion.div
                    key="help"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="p-6 md:p-10 overflow-y-auto max-h-[90vh]"
                  >
                    <ClothingHelpRequestForm
                      onBack={handleBack}
                      onComplete={handleComplete}
                      productTitle={productGroup.style_name}
                    />
                  </motion.div>
                )}

                {currentStep === 'consult' && (
                  <motion.div
                    key="consult"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="p-6 md:p-10 overflow-y-auto max-h-[90vh]"
                  >
                    <ClothingConsultationBooker
                      onBack={handleBack}
                      onComplete={handleComplete}
                      productName={productGroup.style_name}
                    />
                  </motion.div>
                )}

                {currentStep === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderSuccess()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ClothingProductDetailModal;
