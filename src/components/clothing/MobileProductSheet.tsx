import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { ChevronLeft, ChevronRight, Heart, Sparkles, Info, ChevronDown, ZoomIn, X } from 'lucide-react';
import { ProductGroup } from './ClothingBrowser';
import { ColorVariant, getRgbValues } from '../../lib/supabase';
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
  const [openAccordion, setOpenAccordion] = useState<'overview' | 'details' | 'care' | 'sizing' | null>('overview');
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);
  const [zoomedImageSrc, setZoomedImageSrc] = useState<string | null>(null);
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
    setOpenAccordion('overview');
    setColorDropdownOpen(false);
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
            style={{ touchAction: 'none' }}
            onTouchMove={(e) => e.preventDefault()}
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
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-[10px] overflow-hidden flex flex-col"
            style={{
              height: '85%',
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
              className="flex-1 overflow-y-auto overscroll-none"
              style={{ touchAction: 'pan-y' }}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {showQuoteModal ? (
                renderQuoteContent()
              ) : (
                <div className="px-3 pb-4">
                  {/* Image Carousel - reduced size */}
                  <div className="relative mb-3">
                    <Carousel setApi={setCarouselApi} className="w-full">
                      <CarouselContent>
                        {galleryImages.map((img, idx) => (
                          <CarouselItem key={idx}>
                            <div
                              className="aspect-[4/3] bg-white rounded-lg overflow-hidden cursor-pointer relative group"
                              onClick={() => setZoomedImageSrc(img.src)}
                            >
                              <img
                                src={img.src}
                                alt={`${productGroup.style_name} - ${img.label}`}
                                className="w-full h-full object-contain"
                              />
                              {/* Zoom hint overlay */}
                              <div className="absolute inset-0 bg-black/0 group-active:bg-black/10 transition-colors flex items-center justify-center">
                                <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 text-white text-xs opacity-70">
                                  <ZoomIn className="w-3 h-3" />
                                  <span>Tap to zoom</span>
                                </div>
                              </div>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>

                    {/* Carousel Indicators */}
                    {galleryImages.length > 1 && (
                      <div className="flex justify-center gap-1.5 mt-2">
                        {galleryImages.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => carouselApi?.scrollTo(idx)}
                            className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all ${
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
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 shadow-lg"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isInWishlist(productGroup.style_code)
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-600'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Product Info - tighter spacing */}
                  <div className="mb-3">
                    <p className="text-white/60 text-xs mb-0.5">{productGroup.brand}</p>
                    <h2 className="text-lg font-bold text-white mb-1">{productGroup.style_name}</h2>
                    <p className="text-base font-semibold" style={{ color: colors.accent }}>
                      {currentPrice && 'specific' in currentPrice
                        ? `£${currentPrice.specific.toFixed(2)}`
                        : currentPrice
                        ? `£${currentPrice.min.toFixed(2)} - £${currentPrice.max.toFixed(2)}`
                        : 'Price on request'}
                      <span className="text-white/50 text-xs ml-1">per unit</span>
                    </p>
                  </div>

                  {/* Color Selection - Dropdown */}
                  <div className="mb-3 relative">
                    <button
                      onClick={() => setColorDropdownOpen(!colorDropdownOpen)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/10 border border-white/20"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-full border border-white/30"
                          style={{ backgroundColor: currentColor?.rgb }}
                        />
                        <span className="text-white text-sm">{currentColor?.colour_name}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${colorDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {colorDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-20 top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-lg bg-[#1e3a2f] border border-white/20 shadow-xl"
                        >
                          {colorVariants.map((color, idx) => (
                            <button
                              key={color.colour_code}
                              onClick={() => {
                                setSelectedColor(idx);
                                setColorDropdownOpen(false);
                              }}
                              className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-white/10 transition-colors ${
                                selectedColor === idx ? 'bg-white/10' : ''
                              }`}
                            >
                              <div
                                className="w-4 h-4 rounded-full border border-white/30 flex-shrink-0"
                                style={{ backgroundColor: color.rgb }}
                              />
                              <span className="text-white text-sm truncate">{color.colour_name}</span>
                              {selectedColor === idx && (
                                <span className="ml-auto text-xs" style={{ color: colors.accent }}>✓</span>
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Size Selection - improved layout */}
                  {availableSizes.length > 0 && (
                    <div className="mb-3">
                      <p className="text-white/70 text-xs mb-1.5">Size Range: {productGroup.size_range}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {availableSizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
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
                  )}

                  {/* Product Details Accordion */}
                  <div className="mb-4 space-y-1">
                    {(['overview', 'details', 'care', 'sizing'] as const).map((section) => {
                      const isOpen = openAccordion === section;
                      const hasContent = section === 'overview'
                        ? true
                        : section === 'details'
                          ? !!(currentVariant?.fabric || currentVariant?.weight_gsm || currentVariant?.specification)
                          : section === 'care'
                            ? !!currentVariant?.washing_instructions
                            : true;

                      if (!hasContent && section !== 'overview' && section !== 'sizing') return null;

                      return (
                        <div key={section} className="rounded-lg overflow-hidden bg-white/5">
                          <button
                            onClick={() => setOpenAccordion(isOpen ? null : section)}
                            className="w-full flex items-center justify-between px-3 py-2 text-left"
                          >
                            <span className="text-white text-sm font-medium">
                              {section.charAt(0).toUpperCase() + section.slice(1)}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                          </button>

                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="px-3 pb-3 text-white/80 text-xs space-y-1.5">
                                  {section === 'overview' && (
                                    <>
                                      <p>{currentVariant?.retail_description || productGroup.variants[0]?.retail_description || 'No description available.'}</p>
                                      {(currentVariant?.product_feature_1 || productGroup.product_feature_1) && (
                                        <p className="flex items-start gap-1.5">
                                          <Sparkles className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                                          <span>{currentVariant?.product_feature_1 || productGroup.product_feature_1}</span>
                                        </p>
                                      )}
                                      {(currentVariant?.product_feature_2 || productGroup.product_feature_2) && (
                                        <p className="flex items-start gap-1.5">
                                          <Sparkles className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                                          <span>{currentVariant?.product_feature_2 || productGroup.product_feature_2}</span>
                                        </p>
                                      )}
                                      {(currentVariant?.product_feature_3 || productGroup.product_feature_3) && (
                                        <p className="flex items-start gap-1.5">
                                          <Sparkles className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                                          <span>{currentVariant?.product_feature_3 || productGroup.product_feature_3}</span>
                                        </p>
                                      )}
                                    </>
                                  )}
                                  {section === 'details' && (
                                    <>
                                      {(currentVariant?.fabric || productGroup.fabric) && (
                                        <p><span className="text-white/50">Fabric:</span> {currentVariant?.fabric || productGroup.fabric}</p>
                                      )}
                                      {currentVariant?.weight_gsm && (
                                        <p><span className="text-white/50">Weight:</span> {currentVariant.weight_gsm}</p>
                                      )}
                                      {currentVariant?.specification && (
                                        <p><span className="text-white/50">Specification:</span> {currentVariant.specification}</p>
                                      )}
                                    </>
                                  )}
                                  {section === 'care' && (
                                    <p>{currentVariant?.washing_instructions || 'Care instructions not available.'}</p>
                                  )}
                                  {section === 'sizing' && (
                                    <>
                                      <p><span className="text-white/50">Size Range:</span> {productGroup.size_range}</p>
                                      {currentVariant?.sizing_to_fit && (
                                        <p><span className="text-white/50">Sizing:</span> {currentVariant.sizing_to_fit}</p>
                                      )}
                                    </>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>

                  </div>
              )}
            </div>

            {/* Action Buttons - Fixed at bottom of sheet */}
            {!showQuoteModal && (
              <div className="flex-shrink-0 p-3 space-y-2 border-t border-white/10" style={{ backgroundColor: colors.dark }}>
                <button
                  onClick={() => setShowQuoteModal(true)}
                  className="w-full py-3 rounded-lg text-white font-bold text-base transition-all active:scale-[0.98]"
                  style={{ backgroundColor: colors.accent }}
                >
                  Start Order
                </button>
                <button
                  onClick={() => setShowHowItWorksModal(true)}
                  className="w-full py-2 rounded-lg text-white/80 font-medium text-sm border border-white/20 flex items-center justify-center gap-2"
                >
                  <Info className="w-4 h-4" />
                  How does it work?
                </button>
              </div>
            )}
          </motion.div>

          {/* Image Zoom Modal */}
          <AnimatePresence>
            {zoomedImageSrc && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
                onClick={() => setZoomedImageSrc(null)}
              >
                <button
                  onClick={() => setZoomedImageSrc(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white z-10"
                >
                  <X className="w-6 h-6" />
                </button>
                <motion.img
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  src={zoomedImageSrc}
                  alt={productGroup.style_name}
                  className="max-w-full max-h-full object-contain p-4"
                  onClick={(e) => e.stopPropagation()}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileProductSheet;
