import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { ChevronLeft, ChevronRight, Heart, Ruler, Sparkles, Shirt, Info } from 'lucide-react';
import { ProductGroup } from './ClothingBrowser';
import { Product, ColorVariant, getRgbValues } from '../../lib/supabase';
import { useWishlist } from '../../contexts/WishlistContext';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '../ui/carousel';
import ClothingOrderWizard, { LogoPreviewData } from './ClothingOrderWizard';
import ClothingLogoUploader from './ClothingLogoUploader';
import ClothingHelpRequestForm from './ClothingHelpRequestForm';
import ClothingConsultationBooker from './ClothingConsultationBooker';
import ClothingHowItWorks from './ClothingHowItWorks';
import { submitClothingEnquiry, SubmitEnquiryRequest } from '../../lib/enquiry-service';
import { sendEnquiryEmails } from '../../lib/email-service';

// Design system colors
const colors = {
  dark: '#183028',
  darkLight: '#234a3a',
  accent: '#64a70b',
  accentHover: '#578f09',
  neutral: '#c1c6c8',
  neutralLight: '#e8eaeb',
  white: '#ffffff',
  textDark: '#333333',
  textMuted: '#666666',
};

interface MobileProductSheetProps {
  productGroup: ProductGroup;
  isOpen: boolean;
  onClose: () => void;
}

const MobileProductSheet: React.FC<MobileProductSheetProps> = ({
  productGroup,
  isOpen,
  onClose,
}) => {
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'care' | 'sizing'>('overview');
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [quoteStep, setQuoteStep] = useState<'logo-options' | 'upload' | 'help' | 'consult' | 'success' | 'submitting'>('logo-options');
  const [savedLogoData, setSavedLogoData] = useState<LogoPreviewData | null>(null);
  const [enquiryRef, setEnquiryRef] = useState<string>('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hexLookup, setHexLookup] = useState<Map<string, string>>(new Map());
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { toggleWishlist, isInWishlist } = useWishlist();

  // Load hex color lookup
  useEffect(() => {
    const loadHexLookup = async () => {
      const lookup = await getRgbValues();
      setHexLookup(lookup);
    };
    loadHexLookup();
  }, []);

  // Lock body scroll when open
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

  // Reset state when product changes
  useEffect(() => {
    setSelectedColor(0);
    setSelectedSize('');
    setCurrentViewIndex(0);
    setActiveTab('overview');
    setShowQuoteModal(false);
    setShowHowItWorksModal(false);
    setQuoteStep('logo-options');
  }, [productGroup.style_code]);

  // Sync carousel with selected color
  useEffect(() => {
    if (carouselApi) {
      carouselApi.scrollTo(0);
      setCurrentViewIndex(0);
    }
  }, [carouselApi, selectedColor]);

  // Listen to carousel changes
  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => setCurrentViewIndex(carouselApi.selectedScrollSnap());
    carouselApi.on('select', onSelect);
    return () => { carouselApi.off('select', onSelect); };
  }, [carouselApi]);

  // Handle drag to dismiss
  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  // Build colors with proper hex values
  const buildColors = useCallback((): ColorVariant[] => {
    return productGroup.colors.map(color => {
      const variant = productGroup.variants.find(v => v.colour_code === color.code);

      const getHexColor = (rgbString: string): string | null => {
        if (!rgbString || rgbString === 'Not available') return null;
        const firstColor = rgbString.split('|')[0].trim();
        const normalized = firstColor.replace(/\s+/g, ' ').trim();
        if (hexLookup.has(normalized)) return hexLookup.get(normalized)!;
        const parts = normalized.split(' ').map(n => parseInt(n, 10));
        if (parts.length >= 3 && parts.every(n => !isNaN(n) && n >= 0 && n <= 255)) {
          return `#${parts[0].toString(16).padStart(2, '0')}${parts[1].toString(16).padStart(2, '0')}${parts[2].toString(16).padStart(2, '0')}`;
        }
        return null;
      };

      let displayColor = color.rgb || (variant ? getHexColor(variant.rgb) : null);
      if (!displayColor) {
        const colorName = color.name.toLowerCase();
        if (colorName.includes('black')) displayColor = '#000000';
        else if (colorName.includes('white')) displayColor = '#ffffff';
        else if (colorName.includes('navy')) displayColor = '#001f3f';
        else if (colorName.includes('grey') || colorName.includes('gray')) displayColor = '#6c757d';
        else displayColor = '#cccccc';
      }

      return {
        colour_code: color.code,
        colour_name: color.name,
        colour_image: color.image,
        rgb: displayColor,
        colour_shade: variant?.colour_shade,
        back_image_url: variant?.back_image_url,
        side_image_url: variant?.side_image_url,
        additional_image_url: variant?.additional_image_url,
      };
    });
  }, [productGroup, hexLookup]);

  const colorVariants = buildColors();
  const currentColor = colorVariants[selectedColor];

  // Get current variant
  const currentVariant = selectedSize
    ? productGroup.variants.find(v => v.colour_code === currentColor?.colour_code && v.size_code === selectedSize)
      || productGroup.variants.find(v => v.colour_code === currentColor?.colour_code)
      || productGroup.variants[0]
    : productGroup.variants.find(v => v.colour_code === currentColor?.colour_code)
      || productGroup.variants[0];

  // Get available sizes for selected color
  const availableSizes = Array.from(
    new Set(
      productGroup.variants
        .filter(v => v.colour_code === currentColor?.colour_code && v.sku_status !== 'Discontinued')
        .map(v => v.size_code)
    )
  );

  // Get price
  const getCurrentPrice = (): { specific: number } | { min: number; max: number } | null => {
    if (selectedSize && currentVariant) {
      const price = parseFloat(currentVariant.single_price);
      if (!isNaN(price) && price > 0) return { specific: price };
    }
    const colorVariantPrices = productGroup.variants
      .filter(v => v.colour_code === currentColor?.colour_code)
      .map(v => parseFloat(v.single_price))
      .filter(p => !isNaN(p) && p > 0);
    if (colorVariantPrices.length === 0) return productGroup.price_range || null;
    const min = Math.min(...colorVariantPrices);
    const max = Math.max(...colorVariantPrices);
    return min === max ? { specific: min } : { min, max };
  };

  const currentPrice = getCurrentPrice();

  // Build gallery images for carousel
  const frontImage = currentColor?.colour_image || currentVariant?.primary_product_image_url;
  const galleryImages: { src: string; label: string }[] = [];
  if (frontImage) galleryImages.push({ src: frontImage, label: 'Front' });
  if (currentColor?.back_image_url) galleryImages.push({ src: currentColor.back_image_url, label: 'Back' });
  if (currentColor?.side_image_url) galleryImages.push({ src: currentColor.side_image_url, label: 'Side' });
  if (currentColor?.additional_image_url) galleryImages.push({ src: currentColor.additional_image_url, label: 'Detail' });

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    const groupedProduct = {
      style_code: productGroup.style_code,
      style_name: productGroup.style_name,
      brand: productGroup.brand,
      product_type: currentVariant?.product_type || productGroup.product_type || '',
      gender: currentVariant?.gender || '',
      categorisation: currentVariant?.categorisation || '',
      primary_product_image_url: frontImage || currentVariant?.primary_product_image_url || '',
      price_range: productGroup.price_range || { min: 0, max: 0 },
      size_range: productGroup.size_range,
      colors: colorVariants,
      sizes: availableSizes,
      variants: productGroup.variants,
    };
    toggleWishlist(groupedProduct);
  };

  // Handle enquiry submission
  const handleEnquirySubmit = async (contactData: any, pathType: string) => {
    setQuoteStep('submitting');
    setSubmitError(null);

    try {
      const enquiryData: SubmitEnquiryRequest = {
        customerName: contactData.name,
        customerEmail: contactData.email,
        customerPhone: contactData.phone || '',
        productName: productGroup.style_name,
        productStyleCode: productGroup.style_code,
        productColor: currentColor?.colour_name || '',
        productColorCode: currentColor?.colour_code || '',
        productImageUrl: currentColor?.colour_image || '',
        logoData: savedLogoData?.logoSrc || undefined,
        logoAnalysis: savedLogoData?.analysis || undefined,
        logoPositionX: savedLogoData?.x,
        logoPositionY: savedLogoData?.y,
        logoSizePercent: savedLogoData?.size,
        estimatedQuantity: contactData.quantity || '',
        additionalNotes: contactData.message || '',
        enquiryType: pathType as 'upload' | 'design_help' | 'consultation',
      };

      const result = await submitClothingEnquiry(enquiryData);
      if (result.success && result.enquiryRef) {
        setEnquiryRef(result.enquiryRef);
        await sendEnquiryEmails({
          customerEmail: enquiryData.customerEmail,
          customerName: enquiryData.customerName,
          customerPhone: enquiryData.customerPhone,
          enquiryId: result.enquiryId || '',
          enquiryRef: result.enquiryRef,
          productName: enquiryData.productName,
          enquiryType: enquiryData.enquiryType,
          estimatedQuantity: enquiryData.estimatedQuantity,
          additionalNotes: enquiryData.additionalNotes,
          logoQuality: savedLogoData?.analysis?.qualityTier,
        });
        setQuoteStep('success');
      } else {
        throw new Error('Failed to submit enquiry');
      }
    } catch (error) {
      setSubmitError('Failed to submit enquiry. Please try again.');
      setQuoteStep('logo-options');
    }
  };

  // Render quote flow content
  const renderQuoteContent = () => {
    if (showHowItWorksModal) {
      return (
        <div className="p-4">
          <button
            onClick={() => setShowHowItWorksModal(false)}
            className="mb-4 text-white/70 flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <ClothingHowItWorks
            isOpen={showHowItWorksModal}
            onClose={() => setShowHowItWorksModal(false)}
            onStartOrder={() => {
              setShowHowItWorksModal(false);
              setQuoteStep('logo-options');
            }}
          />
        </div>
      );
    }

    switch (quoteStep) {
      case 'logo-options':
        return (
          <ClothingOrderWizard
            productName={productGroup.style_name}
            productImage={currentColor?.colour_image || productGroup.variants[0]?.primary_product_image_url}
            productColors={colorVariants.map(c => ({
              name: c.colour_name,
              rgb: c.rgb,
              image: c.colour_image,
              code: c.colour_code,
            }))}
            initialColorIndex={selectedColor}
            onSelectPath={(path) => {
              if (path === 'upload') setQuoteStep('upload');
              else if (path === 'help') setQuoteStep('help');
              else if (path === 'consult') setQuoteStep('consult');
            }}
          />
        );
      case 'upload':
        return (
          <ClothingLogoUploader
            productTitle={productGroup.style_name}
            productImage={currentColor?.colour_image || productGroup.variants[0]?.primary_product_image_url}
            onBack={() => setQuoteStep('logo-options')}
            onComplete={() => setQuoteStep('success')}
          />
        );
      case 'help':
        return (
          <ClothingHelpRequestForm
            productTitle={productGroup.style_name}
            onBack={() => setQuoteStep('logo-options')}
            onComplete={() => setQuoteStep('success')}
          />
        );
      case 'consult':
        return (
          <ClothingConsultationBooker
            productName={productGroup.style_name}
            onBack={() => setQuoteStep('logo-options')}
            onComplete={() => setQuoteStep('success')}
          />
        );
      case 'submitting':
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4" />
            <p className="text-white">Submitting your enquiry...</p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Enquiry Submitted!</h3>
            <p className="text-white/70 mb-4">Reference: {enquiryRef}</p>
            <p className="text-white/60 text-sm mb-6">We'll be in touch within 24 hours.</p>
            <button
              onClick={() => {
                setShowQuoteModal(false);
                setQuoteStep('logo-options');
              }}
              className="px-6 py-3 rounded-lg text-white font-semibold"
              style={{ backgroundColor: colors.accent }}
            >
              Continue Browsing
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

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
            className="fixed inset-0 bg-black/60 z-50"
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: '15%' }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-[10px] overflow-hidden"
            style={{
              height: '100%',
              backgroundColor: colors.dark,
            }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
              <div
                className="w-12 h-1.5 rounded-full"
                style={{
                  backgroundColor: colors.accent,
                  boxShadow: `0 2px 8px ${colors.accent}40`,
                }}
              />
            </div>

            {/* Content */}
            <div
              ref={contentRef}
              className="h-full overflow-y-auto overscroll-contain pb-20"
              style={{ maxHeight: 'calc(100% - 24px)' }}
            >
              {showQuoteModal ? (
                renderQuoteContent()
              ) : (
                <div className="px-4 pb-8">
                  {/* Image Carousel */}
                  <div className="relative mb-4">
                    <Carousel setApi={setCarouselApi} className="w-full">
                      <CarouselContent>
                        {galleryImages.map((img, idx) => (
                          <CarouselItem key={idx}>
                            <div className="aspect-square bg-white rounded-lg overflow-hidden">
                              <img
                                src={img.src}
                                alt={`${productGroup.style_name} - ${img.label}`}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>

                    {/* Carousel Indicators */}
                    {galleryImages.length > 1 && (
                      <div className="flex justify-center gap-2 mt-3">
                        {galleryImages.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => carouselApi?.scrollTo(idx)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                              currentViewIndex === idx
                                ? 'bg-white text-gray-900'
                                : 'bg-white/20 text-white/70'
                            }`}
                          >
                            {img.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={handleWishlistToggle}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-lg"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isInWishlist(productGroup.style_code)
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-600'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="mb-4">
                    <p className="text-white/60 text-sm mb-1">{productGroup.brand}</p>
                    <h2 className="text-xl font-bold text-white mb-2">{productGroup.style_name}</h2>
                    <p className="text-lg font-semibold" style={{ color: colors.accent }}>
                      {currentPrice && 'specific' in currentPrice
                        ? `£${currentPrice.specific.toFixed(2)}`
                        : currentPrice
                        ? `£${currentPrice.min.toFixed(2)} - £${currentPrice.max.toFixed(2)}`
                        : 'Price on request'}
                      <span className="text-white/50 text-sm ml-2">per unit</span>
                    </p>
                  </div>

                  {/* Color Selection */}
                  <div className="mb-4">
                    <p className="text-white/70 text-sm mb-2">
                      Colour: <span className="text-white">{currentColor?.colour_name}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {colorVariants.slice(0, 12).map((color, idx) => (
                        <button
                          key={color.colour_code}
                          onClick={() => setSelectedColor(idx)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            selectedColor === idx
                              ? 'border-white scale-110'
                              : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color.rgb }}
                          title={color.colour_name}
                        />
                      ))}
                      {colorVariants.length > 12 && (
                        <span className="text-white/50 text-sm self-center ml-2">
                          +{colorVariants.length - 12} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div className="mb-6">
                    <p className="text-white/70 text-sm mb-2">Size Range: {productGroup.size_range}</p>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            selectedSize === size
                              ? 'bg-white text-gray-900'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product Details Tabs */}
                  <div className="mb-6">
                    <div className="flex gap-1 mb-4 overflow-x-auto pb-2">
                      {(['overview', 'details', 'care', 'sizing'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                            activeTab === tab
                              ? 'bg-white text-gray-900'
                              : 'bg-white/10 text-white/70'
                          }`}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                      {activeTab === 'overview' && (
                        <div className="text-white/80 text-sm space-y-2">
                          <p>{currentVariant?.retail_description || 'No description available.'}</p>
                          {currentVariant?.product_feature_1 && (
                            <p className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-green-400" />
                              {currentVariant.product_feature_1}
                            </p>
                          )}
                          {currentVariant?.product_feature_2 && (
                            <p className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-green-400" />
                              {currentVariant.product_feature_2}
                            </p>
                          )}
                          {currentVariant?.product_feature_3 && (
                            <p className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-green-400" />
                              {currentVariant.product_feature_3}
                            </p>
                          )}
                        </div>
                      )}
                      {activeTab === 'details' && (
                        <div className="text-white/80 text-sm space-y-2">
                          {currentVariant?.fabric && (
                            <p><span className="text-white/50">Fabric:</span> {currentVariant.fabric}</p>
                          )}
                          {currentVariant?.weight_gsm && (
                            <p><span className="text-white/50">Weight:</span> {currentVariant.weight_gsm}</p>
                          )}
                          {currentVariant?.specification && (
                            <p><span className="text-white/50">Specification:</span> {currentVariant.specification}</p>
                          )}
                        </div>
                      )}
                      {activeTab === 'care' && (
                        <div className="text-white/80 text-sm">
                          <p>{currentVariant?.washing_instructions || 'Care instructions not available.'}</p>
                        </div>
                      )}
                      {activeTab === 'sizing' && (
                        <div className="text-white/80 text-sm space-y-2">
                          <p><span className="text-white/50">Size Range:</span> {productGroup.size_range}</p>
                          {currentVariant?.sizing_to_fit && (
                            <p><span className="text-white/50">Sizing:</span> {currentVariant.sizing_to_fit}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowQuoteModal(true)}
                      className="w-full py-4 rounded-lg text-white font-bold text-lg transition-all active:scale-[0.98]"
                      style={{ backgroundColor: colors.accent }}
                    >
                      Start Order
                    </button>
                    <button
                      onClick={() => setShowHowItWorksModal(true)}
                      className="w-full py-3 rounded-lg text-white/80 font-medium border border-white/20 flex items-center justify-center gap-2"
                    >
                      <Info className="w-5 h-5" />
                      How does it work?
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileProductSheet;
