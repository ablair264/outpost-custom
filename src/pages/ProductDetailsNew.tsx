import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Check, ChevronRight, ChevronLeft, Ruler, Sparkles, Shirt, Droplets, Award, Info, ZoomIn, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, ColorVariant, getProductsByStyleCode, getRgbValues } from '../lib/supabase';
import { cartUtils } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import LogoCustomizerModal, { LogoOverlayConfig } from '../components/LogoCustomizerModal';
import ImageModal from '../components/ImageModal';
import VinylLoader from '../components/VinylLoader';
import { ImageZoom, Image as ZoomImage } from '../components/animate-ui/primitives/effects/image-zoom';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '../components/ui/carousel';
import ClothingOrderWizard, { LogoPreviewData, ContactFormData } from '../components/clothing/ClothingOrderWizard';
import ClothingLogoUploader from '../components/clothing/ClothingLogoUploader';
import ClothingHelpRequestForm from '../components/clothing/ClothingHelpRequestForm';
import ClothingConsultationBooker from '../components/clothing/ClothingConsultationBooker';
import ClothingHowItWorks from '../components/clothing/ClothingHowItWorks';
import { submitClothingEnquiry } from '../lib/enquiry-service';
import { sendEnquiryEmails } from '../lib/email-service';

// Design system colors matching printing pages
const colors = {
  dark: '#183028',
  darkLight: '#234a3a',
  accent: '#64a70b',
  accentHover: '#578f09',
  neutral: '#c1c6c8',
  neutralLight: '#e8eaeb',
  offWhite: '#f8f8f8',
  white: '#ffffff',
  textDark: '#333333',
  textMuted: '#666666',
};

interface ProductGroup {
  style_code: string;
  style_name: string;
  brand: string;
  variants: Product[];
  colors: ColorVariant[];
  size_range: string;
  price_range?: { min: number; max: number };
}

const ProductDetailsNew: React.FC = () => {
  const { styleCode } = useParams<{ styleCode: string }>();
  const navigate = useNavigate();
  const [productGroup, setProductGroup] = useState<ProductGroup | null>(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [logoOverlay, setLogoOverlay] = useState<LogoOverlayConfig | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'care' | 'sizing'>('overview');
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageModalIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentViewIndex, setCurrentViewIndex] = useState(0); // Track which view (front/back/side) is shown
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [quoteStep, setQuoteStep] = useState<'logo-options' | 'upload' | 'help' | 'consult' | 'success' | 'submitting'>('logo-options');
  const [savedLogoData, setSavedLogoData] = useState<LogoPreviewData | null>(null);
  const [enquiryRef, setEnquiryRef] = useState<string>('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const imageSectionRef = useRef<HTMLElement>(null);

  // Max colors to show before switching to dropdown
  const MAX_COLORS_DISPLAY = 20;

  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    if (!styleCode) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);

        // Fetch product data via API
        const data = await getProductsByStyleCode(styleCode);

        if (!data || data.length === 0) {
          setError('Product not found');
          return;
        }

        // Fetch hex color lookup table via API
        const hexLookup = await getRgbValues();

        const allVariants = data as Product[];
        // Filter out discontinued items
        const variants = allVariants.filter(v => v.sku_status !== 'Discontinued');

        // If all variants are discontinued, product is not available
        if (variants.length === 0) {
          setError('This product is no longer available');
          return;
        }

        const colors: ColorVariant[] = Array.from(new Set(variants.map(v => v.colour_code))).map(code => {
          const variant = variants.find(v => v.colour_code === code)!;

          // Try to get hex from the lookup table first
          const getHexColor = (rgbString: string): string | null => {
            if (!rgbString || rgbString === 'Not available') return null;

            // Handle multi-color values like "255 255 255|0 0 0" - take the first color
            const firstColor = rgbString.split('|')[0].trim();
            const normalized = firstColor.replace(/\s+/g, ' ').trim();

            // Look up in pre-converted table
            if (hexLookup.has(normalized)) {
              return hexLookup.get(normalized)!;
            }

            // Fallback: Convert RGB string "R G B" to hex "#RRGGBB"
            const parts = normalized.split(' ').map(n => parseInt(n, 10));
            if (parts.length >= 3 && parts.every(n => !isNaN(n) && n >= 0 && n <= 255)) {
              return `#${parts[0].toString(16).padStart(2, '0')}${parts[1].toString(16).padStart(2, '0')}${parts[2].toString(16).padStart(2, '0')}`;
            }
            return null;
          };

          // Try to get hex from the RGB field
          let displayColor = getHexColor(variant.rgb);

          // Fallback to color name matching if RGB conversion failed
          if (!displayColor) {
            const colorName = variant.colour_name.toLowerCase();
            if (colorName.includes('black')) displayColor = '#000000';
            else if (colorName.includes('white')) displayColor = '#ffffff';
            else if (colorName.includes('red')) displayColor = '#dc3545';
            else if (colorName.includes('blue')) displayColor = '#007bff';
            else if (colorName.includes('green')) displayColor = '#28a745';
            else if (colorName.includes('yellow')) displayColor = '#ffc107';
            else if (colorName.includes('grey') || colorName.includes('gray')) displayColor = '#6c757d';
            else if (colorName.includes('navy')) displayColor = '#001f3f';
            else if (colorName.includes('orange')) displayColor = '#fd7e14';
            else if (colorName.includes('purple') || colorName.includes('violet')) displayColor = '#6f42c1';
            else if (colorName.includes('pink')) displayColor = '#e83e8c';
            else if (colorName.includes('brown')) displayColor = '#795548';
            else if (colorName.includes('beige') || colorName.includes('cream') || colorName.includes('sand')) displayColor = '#f5f5dc';
            else if (colorName.includes('khaki') || colorName.includes('olive')) displayColor = '#6b8e23';
            else displayColor = '#cccccc';
          }

          return {
            colour_code: code,
            colour_name: variant.colour_name,
            colour_image: variant.colour_image || variant.primary_product_image_url,
            rgb: displayColor,
            colour_shade: variant.colour_shade,
            back_image_url: variant.back_image_url,
            side_image_url: variant.side_image_url,
            additional_image_url: variant.additional_image_url,
          };
        });

        const prices = variants.map(v => parseFloat(v.single_price)).filter(p => !isNaN(p) && p > 0);
        const priceRange = prices.length ? { min: Math.min(...prices), max: Math.max(...prices) } : undefined;

        setProductGroup({
          style_code: variants[0].style_code,
          style_name: variants[0].style_name,
          brand: variants[0].brand,
          variants,
          colors,
          size_range: variants[0].size_range,
          price_range: priceRange,
        });
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [styleCode]);

  // Preload images
  useEffect(() => {
    if (!productGroup) return;

    const imageUrls = Array.from(
      new Set(
        productGroup.variants
          .map(v => v.colour_image || v.primary_product_image_url)
          .filter((url): url is string => Boolean(url))
      )
    );

    const preloaded: HTMLImageElement[] = imageUrls.map(url => {
      const img = new Image();
      img.src = url;
      return img;
    });

    return () => {
      preloaded.forEach(img => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [productGroup]);

  // Sync carousel with selected color
  useEffect(() => {
    if (carouselApi && productGroup) {
      // Check if current color has multiple views (back, side, additional images)
      const currentColorData = productGroup.colors[selectedColor];
      const colorHasMultipleViews = !!(
        currentColorData?.back_image_url ||
        currentColorData?.side_image_url ||
        currentColorData?.additional_image_url
      );

      if (colorHasMultipleViews) {
        // When showing multiple views of same color, reset to first view (Front)
        carouselApi.scrollTo(0);
        setCurrentViewIndex(0);
      } else {
        // When showing all colors in carousel (single view per color),
        // scroll to the selected color's position
        carouselApi.scrollTo(selectedColor);
        setCurrentViewIndex(selectedColor);
      }
    }
  }, [carouselApi, selectedColor, productGroup]);

  // Listen to carousel slide changes to update currentViewIndex
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      const index = carouselApi.selectedScrollSnap();
      setCurrentViewIndex(index);
    };

    carouselApi.on('select', onSelect);
    return () => {
      carouselApi.off('select', onSelect);
    };
  }, [carouselApi]);

  // Handle thumbnail click - scroll to top and change color
  const handleThumbnailClick = useCallback((colorIndex: number) => {
    setSelectedColor(colorIndex);
    if (imageSectionRef.current) {
      // Calculate scroll position with offset for fixed header (approx 80px)
      const headerOffset = 100;
      const elementPosition = imageSectionRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.dark }}>
        <VinylLoader size={250} />
      </div>
    );

  if (error || !productGroup)
    return (
      <div className="min-h-screen flex items-center justify-center text-center" style={{ backgroundColor: colors.dark }}>
        <div>
          <h1 className="hearns-font text-4xl text-white mb-4">Product Not Found</h1>
          <p className="neuzeit-font text-white/70 mb-8">{error || 'The product you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/clothing')}
            className="px-8 py-3 rounded-[15px] text-white font-semibold transition-all duration-300"
            style={{ backgroundColor: colors.accent }}
          >
            Browse Clothing
          </button>
        </div>
      </div>
    );

  // Find variant matching both color and size (if size selected), otherwise just color
  const currentVariant = selectedSize
    ? productGroup.variants.find(
        v => v.colour_code === productGroup.colors[selectedColor]?.colour_code && v.size_code === selectedSize
      ) || productGroup.variants.find(v => v.colour_code === productGroup.colors[selectedColor]?.colour_code) || productGroup.variants[0]
    : productGroup.variants.find(v => v.colour_code === productGroup.colors[selectedColor]?.colour_code) || productGroup.variants[0];

  // Get the current price - specific variant price if size selected, otherwise show range for selected color
  const getCurrentPrice = (): { specific: number } | { min: number; max: number } | null => {
    if (selectedSize && currentVariant) {
      const price = parseFloat(currentVariant.single_price);
      if (!isNaN(price) && price > 0) {
        return { specific: price };
      }
    }
    // Show price range for the selected color
    const colorVariants = productGroup.variants.filter(
      v => v.colour_code === productGroup.colors[selectedColor]?.colour_code
    );
    const prices = colorVariants.map(v => parseFloat(v.single_price)).filter(p => !isNaN(p) && p > 0);
    if (prices.length === 0) return productGroup.price_range ? { min: productGroup.price_range.min, max: productGroup.price_range.max } : null;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? { specific: min } : { min, max };
  };

  const currentPrice = getCurrentPrice();

  const getColorImage = (colorIndex: number): string | undefined => {
    const color = productGroup.colors[colorIndex];
    if (!color) return undefined;

    if (color.colour_image) return color.colour_image;

    const variantWithImage = productGroup.variants.find(
      v => v.colour_code === color.colour_code && (v.colour_image || v.primary_product_image_url)
    );

    return variantWithImage?.colour_image || variantWithImage?.primary_product_image_url;
  };

  const availableSizes = productGroup.variants
    .filter(v => v.colour_code === productGroup.colors[selectedColor]?.colour_code)
    .map(v => ({ code: v.size_code, name: v.size_name }))
    .filter((size, i, self) => i === self.findIndex(s => s.code === size.code));

  const mainImage = getColorImage(selectedColor) || currentVariant?.primary_product_image_url;

  // Build gallery images for the selected color - showing front, back, side, additional
  const currentColor = productGroup.colors[selectedColor];
  const galleryImagesForColor: { src: string; label: string }[] = [];

  // Front image (primary)
  const frontImage = currentColor?.colour_image || currentVariant?.primary_product_image_url;
  if (frontImage) {
    galleryImagesForColor.push({ src: frontImage, label: 'Front' });
  }

  // Back image
  if (currentColor?.back_image_url) {
    galleryImagesForColor.push({ src: currentColor.back_image_url, label: 'Back' });
  }

  // Side image
  if (currentColor?.side_image_url) {
    galleryImagesForColor.push({ src: currentColor.side_image_url, label: 'Side' });
  }

  // Additional image
  if (currentColor?.additional_image_url) {
    galleryImagesForColor.push({ src: currentColor.additional_image_url, label: 'Detail' });
  }

  // If no additional images exist for this color, fall back to showing all colors (old behavior)
  const hasMultipleViews = galleryImagesForColor.length > 1;

  const galleryImages = hasMultipleViews
    ? galleryImagesForColor.map((img, idx) => ({ src: img.src, colorIndex: selectedColor, viewIndex: idx, label: img.label }))
    : productGroup.colors
        .map((_, idx) => {
          const src = getColorImage(idx) || currentVariant?.primary_product_image_url;
          return src ? { src, colorIndex: idx, viewIndex: 0, label: 'Front' } : null;
        })
        .filter((img): img is { src: string; colorIndex: number; viewIndex: number; label: string } => Boolean(img));

  const modalImages = galleryImages.map(img => img.src);

  const logoModalColors = productGroup.colors.map(color => ({
    name: color.colour_name,
    rgb: color.rgb,
    image: color.colour_image,
    code: color.colour_code,
  }));

  const inWishlist = isInWishlist(productGroup.style_code);

  const handleWishlistToggle = () => {
    const groupedProduct = {
      style_code: productGroup.style_code,
      style_name: productGroup.style_name,
      brand: productGroup.brand,
      product_type: currentVariant.product_type,
      gender: currentVariant.gender,
      categorisation: currentVariant.categorisation,
      primary_product_image_url: currentVariant.primary_product_image_url,
      price_range: productGroup.price_range || { min: 0, max: 0 },
      size_range: productGroup.size_range,
      colors: productGroup.colors,
      sizes: availableSizes.map(s => s.name),
      variants: productGroup.variants,
    };
    toggleWishlist(groupedProduct);
  };

  const handleApplyLogo = (config: LogoOverlayConfig) => {
    setLogoOverlay(config);
    setShowLogoModal(false);
  };

  return (
    <>
      {/* Font styles */}
      <style>{`
        @font-face {
          font-family: 'Hearns';
          src: url('/fonts/Hearns/Hearns.woff') format('woff'),
               url('/fonts/Hearns/Hearns.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Embossing Tape';
          src: url('/fonts/embossing_tape/embosst3.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Neuzeit Grotesk';
          src: url('/fonts/neuzeit-grotesk-regular_freefontdownload_org/neuzeit-grotesk-regular.woff2') format('woff2'),
               url('/fonts/neuzeit-grotesk-regular_freefontdownload_org/neuzeit-grotesk-regular.woff') format('woff');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Neuzeit Grotesk Light';
          src: url('/fonts/font/NeuzeitGro-Lig.ttf') format('truetype');
          font-weight: 300;
          font-style: normal;
          font-display: swap;
        }
        .hearns-font { font-family: 'Hearns', Georgia, serif; }
        .embossing-font { font-family: 'Embossing Tape', monospace; letter-spacing: 0.15em; }
        .neuzeit-font { font-family: 'Neuzeit Grotesk', 'Helvetica Neue', sans-serif; }
        .neuzeit-light-font { font-family: 'Neuzeit Grotesk Light', 'Helvetica Neue', sans-serif; font-weight: 300; }
      `}</style>

      <div className="min-h-screen relative" style={{ backgroundColor: colors.dark }}>
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: 'url(/BlackTextureBackground.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'url(/ConcreteTexture.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'overlay',
          }}
        />

        {/* Main content - minimal top padding since header adds body padding */}
        <main className="relative z-10 px-6 md:px-12 lg:px-24 pt-4 pb-8">
          {/* Breadcrumb row */}
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 mb-4">
            <nav className="flex items-center gap-1.5 text-[11px]">
              <button
                onClick={() => navigate('/')}
                className="neuzeit-font text-white/35 hover:text-white transition-colors"
              >
                Home
              </button>
              <ChevronRight className="w-3 h-3 text-white/20" />
              <button
                onClick={() => navigate('/clothing')}
                className="neuzeit-font text-white/35 hover:text-white transition-colors"
              >
                Clothing
              </button>
              <ChevronRight className="w-3 h-3 text-white/20" />
              <span className="neuzeit-font text-white/50 truncate max-w-[200px]">
                {productGroup.style_name}
              </span>
            </nav>

            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-white/10 text-white/40 neuzeit-font text-[11px] transition-all hover:border-white/25 hover:text-white/70"
            >
              <ArrowLeft className="w-3 h-3" />
              Back
            </button>
          </div>
          <div className="max-w-7xl mx-auto">
            {/* Mobile: 3 sections (header, gallery, options). Desktop: 2 columns */}
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-16 items-start">

              {/* Mobile Header: Brand/Name/Price - only visible on mobile, first */}
              <div className="lg:hidden order-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <p
                    className="embossing-font text-xs uppercase tracking-[0.2em] mb-2"
                    style={{ color: colors.accent }}
                  >
                    {productGroup.brand}
                  </p>
                  <h1 className="embossing-font text-2xl leading-tight mb-3 text-white uppercase tracking-wide">
                    {productGroup.style_name}
                  </h1>
                  <div className="h-0.5 w-12 rounded-full mb-4" style={{ backgroundColor: colors.accent }} />
                  <div className="flex items-baseline gap-2">
                    {currentPrice && 'specific' in currentPrice ? (
                      <span className="neuzeit-font text-2xl font-semibold" style={{ color: colors.accent }}>
                        {cartUtils.formatPrice(currentPrice.specific)}
                      </span>
                    ) : currentPrice ? (
                      <>
                        <span className="neuzeit-font text-2xl font-semibold" style={{ color: colors.accent }}>
                          {cartUtils.formatPrice(currentPrice.min)}
                        </span>
                        {currentPrice.max !== currentPrice.min && (
                          <span className="neuzeit-light-font text-base text-white/50">
                            – {cartUtils.formatPrice(currentPrice.max)}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="neuzeit-font text-2xl font-semibold text-white/50">
                        Price on request
                      </span>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Image Gallery - order-2 on mobile, first column on desktop */}
              <section ref={imageSectionRef} className="space-y-4 lg:space-y-6 order-2 lg:order-1">
                {/* Main Image with Carousel */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <Carousel
                    setApi={setCarouselApi}
                    opts={{ loop: true, align: 'center' }}
                    className="w-full"
                  >
                    <CarouselContent className="ml-0">
                      {galleryImages.map((img, i) => (
                        <CarouselItem key={`carousel-${img.src}-${i}`} className="pl-0">
                          <div className="relative rounded-[16px] lg:rounded-[20px] overflow-hidden aspect-[4/3] lg:aspect-square bg-white shadow-xl lg:shadow-2xl">
                            <ImageZoom
                              zoomScale={2.5}
                              zoomOnHover={false}
                              zoomOnClick={true}
                              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            >
                              <ZoomImage
                                src={img.src}
                                alt={`${productGroup.style_name} - ${productGroup.colors[img.colorIndex]?.colour_name || ''}`}
                                objectFit="contain"
                                style={{ padding: '2rem', backgroundColor: 'white' }}
                              />
                            </ImageZoom>
                            {logoOverlay && selectedColor === img.colorIndex && (
                              <img
                                src={logoOverlay.src}
                                alt="Logo overlay"
                                className="absolute transition-all duration-300 pointer-events-none"
                                style={{
                                  left: `${logoOverlay.x}%`,
                                  top: `${logoOverlay.y}%`,
                                  width: `${logoOverlay.sizePct}%`,
                                  opacity: logoOverlay.opacity,
                                  transform: `translate(-50%, -50%) rotate(${logoOverlay.rotation}deg)`,
                                }}
                              />
                            )}

                            {/* Zoom hint - smaller on mobile */}
                            <div className="absolute bottom-2 right-2 lg:bottom-4 lg:right-4 px-2 py-1 lg:px-3 lg:py-1.5 rounded-full bg-black/50 backdrop-blur-sm flex items-center gap-1.5 lg:gap-2 text-white text-[10px] lg:text-xs neuzeit-font">
                              <ZoomIn className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                              <span className="hidden sm:inline">Click to zoom</span>
                              <span className="sm:hidden">Tap</span>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>

                    {/* Navigation Arrows - smaller on mobile */}
                    {galleryImages.length > 1 && (
                      <>
                        <button
                          onClick={() => carouselApi?.scrollPrev()}
                          className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-white transition-all shadow-lg"
                          style={{ backgroundColor: colors.dark }}
                        >
                          <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
                        </button>
                        <button
                          onClick={() => carouselApi?.scrollNext()}
                          className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-white transition-all shadow-lg"
                          style={{ backgroundColor: colors.dark }}
                        >
                          <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
                        </button>
                      </>
                    )}
                  </Carousel>

                  {/* Dot indicators - with view labels when showing multiple views */}
                  {galleryImages.length > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                      {galleryImages.map((img, i) => {
                        const isActive = hasMultipleViews ? currentViewIndex === i : selectedColor === img.colorIndex;
                        return (
                          <button
                            key={`dot-${i}`}
                            onClick={() => {
                              if (hasMultipleViews) {
                                carouselApi?.scrollTo(i);
                              } else {
                                handleThumbnailClick(img.colorIndex);
                              }
                            }}
                            className="flex flex-col items-center gap-1"
                          >
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                isActive ? 'w-8' : 'w-2 hover:bg-gray-400'
                              }`}
                              style={{
                                backgroundColor: isActive ? colors.accent : colors.neutral,
                              }}
                            />
                            {hasMultipleViews && (
                              <span className="text-[9px] text-white/50 neuzeit-font">{img.label}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>

                {/* Thumbnail Grid - hidden on mobile */}
                {galleryImages.length > 1 && (
                  <div className="hidden md:grid grid-cols-5 gap-3">
                    {galleryImages.slice(0, 5).map((img, i) => {
                      const isActive = hasMultipleViews ? currentViewIndex === i : selectedColor === img.colorIndex;
                      return (
                        <button
                          key={`thumb-${img.src}-${i}`}
                          onClick={() => {
                            if (hasMultipleViews) {
                              carouselApi?.scrollTo(i);
                            } else {
                              handleThumbnailClick(img.colorIndex);
                            }
                          }}
                          className={`aspect-square rounded-[12px] overflow-hidden border-2 transition-all duration-200 bg-white relative ${
                            isActive ? 'border-[#64a70b] shadow-lg' : 'border-transparent hover:border-gray-300'
                          }`}
                        >
                          <img src={img.src} alt={img.label} className="object-contain w-full h-full p-2" />
                          {hasMultipleViews && (
                            <span className="absolute bottom-1 left-1 right-1 text-[8px] text-center bg-black/50 text-white py-0.5 rounded neuzeit-font">
                              {img.label}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Right: Product Info - order-3 on mobile (after gallery), second column on desktop */}
              <section className="space-y-5 order-3 lg:order-2">
                {/* Desktop only: Brand/Name/Price header (hidden on mobile as it's shown above) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="hidden lg:block"
                >
                  {/* Brand */}
                  <p
                    className="embossing-font text-xs uppercase tracking-[0.2em] mb-2"
                    style={{ color: colors.accent }}
                  >
                    {productGroup.brand}
                  </p>

                  {/* Product Name */}
                  <h1 className="embossing-font text-2xl md:text-3xl leading-tight mb-3 text-white uppercase tracking-wide">
                    {productGroup.style_name}
                  </h1>

                  {/* Accent line */}
                  <div className="h-0.5 w-12 rounded-full mb-4" style={{ backgroundColor: colors.accent }} />

                  {/* Price - Dynamic based on selection */}
                  <div className="flex items-baseline gap-2">
                    {currentPrice && 'specific' in currentPrice ? (
                      <span
                        className="neuzeit-font text-2xl font-semibold"
                        style={{ color: colors.accent }}
                      >
                        {cartUtils.formatPrice(currentPrice.specific)}
                      </span>
                    ) : currentPrice ? (
                      <>
                        <span
                          className="neuzeit-font text-2xl font-semibold"
                          style={{ color: colors.accent }}
                        >
                          {cartUtils.formatPrice(currentPrice.min)}
                        </span>
                        {currentPrice.max !== currentPrice.min && (
                          <span className="neuzeit-light-font text-base text-white/50">
                            – {cartUtils.formatPrice(currentPrice.max)}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="neuzeit-font text-2xl font-semibold text-white/50">
                        Price on request
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* Color Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-2"
                >
                  <p className="embossing-font text-[10px] uppercase tracking-[0.15em] text-white/70">
                    Colour{' '}
                    <span className="neuzeit-font normal-case tracking-normal text-white/50 ml-2">
                      {productGroup.colors[selectedColor]?.colour_name}
                    </span>
                  </p>

                  {/* Use dropdown if more than 20 colors, otherwise show color swatches */}
                  {productGroup.colors.length > MAX_COLORS_DISPLAY ? (
                    <div className="relative">
                      <select
                        value={selectedColor}
                        onChange={(e) => handleThumbnailClick(parseInt(e.target.value))}
                        className="w-full h-12 px-4 pr-10 rounded-[10px] border border-white/20 bg-white/5 text-white neuzeit-font text-sm appearance-none cursor-pointer hover:border-[#64a70b]/50 focus:border-[#64a70b] focus:outline-none transition-all"
                        style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                      >
                        {productGroup.colors.map((c, i) => (
                          <option key={c.colour_code} value={i} className="bg-[#183028] text-white">
                            {c.colour_name}
                          </option>
                        ))}
                      </select>
                      {/* Color swatch preview next to dropdown */}
                      <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-white/30"
                          style={{ backgroundColor: productGroup.colors[selectedColor]?.rgb }}
                        />
                      </div>
                      {/* Dropdown arrow */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ChevronRight className="w-4 h-4 text-white/50 rotate-90" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {productGroup.colors.map((c, i) => (
                        <button
                          key={c.colour_code}
                          onClick={() => handleThumbnailClick(i)}
                          className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                            selectedColor === i
                              ? 'scale-110'
                              : 'hover:scale-105'
                          }`}
                          style={{
                            backgroundColor: c.rgb,
                            borderColor: selectedColor === i ? colors.accent : 'rgba(255,255,255,0.15)',
                            boxShadow: selectedColor === i ? `0 0 0 2px ${colors.dark}, 0 0 0 3px ${colors.accent}` : undefined,
                          }}
                          title={c.colour_name}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Size Selection */}
                {availableSizes.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="space-y-2"
                  >
                    <p className="embossing-font text-[10px] uppercase tracking-[0.15em] text-white/70">
                      Size
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {availableSizes.map(s => (
                        <button
                          key={s.code}
                          onClick={() => setSelectedSize(s.code)}
                          className={`px-3 py-1.5 rounded-[8px] border neuzeit-font text-sm transition-all duration-200 ${
                            selectedSize === s.code
                              ? ''
                              : 'hover:border-[#64a70b]'
                          }`}
                          style={{
                            backgroundColor: selectedSize === s.code ? colors.accent : 'transparent',
                            borderColor: selectedSize === s.code ? colors.accent : 'rgba(255,255,255,0.15)',
                            color: colors.white,
                          }}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="space-y-3 pt-2"
                >
                  {/* Primary CTA - Start Order */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowQuoteModal(true)}
                      className="flex-1 h-12 rounded-[10px] neuzeit-font font-semibold text-sm text-white transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-xl hover:scale-[1.01]"
                      style={{
                        backgroundColor: colors.accent,
                        boxShadow: `0 6px 20px ${colors.accent}30`,
                      }}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Start Order
                    </button>
                    <button
                      onClick={() => setShowHowItWorksModal(true)}
                      className="h-12 px-4 rounded-[10px] border border-white/20 neuzeit-font text-sm text-white/80 transition-all duration-200 hover:border-[#64a70b] hover:text-white flex items-center justify-center gap-2"
                    >
                      <Info className="w-4 h-4" />
                      How Does it Work?
                    </button>
                  </div>

                  {/* Save to wishlist */}
                  <button
                    onClick={handleWishlistToggle}
                    className="w-full h-10 rounded-[8px] border border-white/15 neuzeit-font text-sm text-white/70 flex items-center justify-center gap-2 transition-all duration-200 hover:border-[#64a70b] hover:text-white"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${inWishlist ? 'fill-[#64a70b] text-[#64a70b]' : ''}`}
                    />
                    {inWishlist ? 'Saved' : 'Save'}
                  </button>
                </motion.div>

                {/* Product Details Tabs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="pt-8 border-t border-white/10"
                >
                  {/* Tab Navigation */}
                  <div className="flex gap-1 p-1 rounded-[12px] mb-6 bg-white/5">
                    {[
                      { id: 'overview', label: 'Overview', icon: Sparkles },
                      { id: 'details', label: 'Details', icon: Shirt },
                      { id: 'care', label: 'Care', icon: Droplets },
                      { id: 'sizing', label: 'Sizing', icon: Ruler },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-[10px] neuzeit-font text-sm font-medium transition-all duration-200 ${
                          activeTab === tab.id
                            ? 'shadow-md'
                            : 'hover:bg-white/10 text-white/50'
                        }`}
                        style={{
                          backgroundColor: activeTab === tab.id ? colors.accent : 'transparent',
                          color: activeTab === tab.id ? colors.white : undefined,
                        }}
                      >
                        <tab.icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="min-h-[200px]"
                    >
                      {/* Overview Tab */}
                      {activeTab === 'overview' && (
                        <div className="space-y-6">
                          {(currentVariant?.retail_description || currentVariant?.specification) && (
                            <p className="neuzeit-light-font text-base leading-relaxed text-white/80">
                              {currentVariant?.retail_description || currentVariant?.specification}
                            </p>
                          )}

                          {(currentVariant?.product_feature_1 || currentVariant?.product_feature_2 || currentVariant?.product_feature_3) && (
                            <div className="space-y-3">
                              <p className="embossing-font text-xs uppercase tracking-[0.15em] text-white/50">
                                Key Features
                              </p>
                              <ul className="space-y-2">
                                {[currentVariant?.product_feature_1, currentVariant?.product_feature_2, currentVariant?.product_feature_3]
                                  .filter(Boolean)
                                  .map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                      <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: colors.accent }} />
                                      <span className="neuzeit-font text-sm text-white/80">{feature}</span>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          )}

                          {currentVariant?.accreditations && (
                            <div className="space-y-3">
                              <p className="embossing-font text-xs uppercase tracking-[0.15em] flex items-center gap-2 text-white/50">
                                <Award className="w-4 h-4" /> Certifications
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {currentVariant.accreditations.split('|').map((cert, i) => (
                                  <span
                                    key={i}
                                    className="px-3 py-1.5 text-xs neuzeit-font rounded-full"
                                    style={{
                                      backgroundColor: `${colors.accent}25`,
                                      color: colors.accent,
                                      border: `1px solid ${colors.accent}40`,
                                    }}
                                  >
                                    {cert.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Details Tab */}
                      {activeTab === 'details' && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            {[
                              { label: 'Brand', value: productGroup.brand },
                              { label: 'Product Type', value: currentVariant?.product_type },
                              { label: 'Gender', value: currentVariant?.gender },
                              { label: 'Age Group', value: currentVariant?.age_group },
                            ].filter(item => item.value).map(item => (
                              <div
                                key={item.label}
                                className="p-4 rounded-[12px] bg-white/5"
                              >
                                <p className="embossing-font text-[10px] uppercase tracking-[0.12em] mb-1 text-white/40">
                                  {item.label}
                                </p>
                                <p className="neuzeit-font text-sm font-medium text-white">
                                  {item.value}
                                </p>
                              </div>
                            ))}
                          </div>

                          {(currentVariant?.fabric || currentVariant?.weight_gsm) && (
                            <div className="pt-4 border-t border-white/10">
                              <p className="embossing-font text-xs uppercase tracking-[0.15em] mb-3 text-white/50">
                                Material
                              </p>
                              {currentVariant?.fabric && (
                                <p className="neuzeit-font text-sm mb-2 text-white/80">{currentVariant.fabric}</p>
                              )}
                              {currentVariant?.weight_gsm && (
                                <p className="neuzeit-font text-sm text-white/50">Weight: {currentVariant.weight_gsm}</p>
                              )}
                            </div>
                          )}

                          {currentVariant?.sustainable_organic === 'Yes' && (
                            <div className="flex items-center gap-2 p-4 rounded-[12px]" style={{ backgroundColor: `${colors.accent}20` }}>
                              <Sparkles className="w-5 h-5" style={{ color: colors.accent }} />
                              <span className="neuzeit-font text-sm font-medium" style={{ color: colors.accent }}>
                                Sustainable / Organic Product
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Care Tab */}
                      {activeTab === 'care' && (
                        <div className="space-y-6">
                          {currentVariant?.washing_instructions ? (
                            <div>
                              <p className="embossing-font text-xs uppercase tracking-[0.15em] mb-3 text-white/50">
                                Washing Instructions
                              </p>
                              <p className="neuzeit-font text-sm leading-relaxed text-white/80">
                                {currentVariant.washing_instructions}
                              </p>
                            </div>
                          ) : (
                            <div>
                              <p className="embossing-font text-xs uppercase tracking-[0.15em] mb-3 text-white/50">
                                General Care Guidelines
                              </p>
                              <ul className="space-y-2">
                                {[
                                  'Follow care label instructions on the garment',
                                  'Wash similar colors together',
                                  'Turn garment inside out before washing if decorated',
                                  'Store in a cool, dry place',
                                ].map((tip, i) => (
                                  <li key={i} className="flex items-start gap-3">
                                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: colors.accent }} />
                                    <span className="neuzeit-font text-sm text-white/80">{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="p-4 rounded-[12px] flex items-start gap-3 bg-amber-500/10 border border-amber-500/20">
                            <Info className="w-5 h-5 mt-0.5 flex-shrink-0 text-amber-400" />
                            <p className="neuzeit-font text-sm text-amber-200">
                              <strong>Decorated items:</strong> Do not iron directly onto print or embroidery. Wash inside out on a gentle cycle.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Sizing Tab */}
                      {activeTab === 'sizing' && (
                        <div className="space-y-6">
                          <div>
                            <p className="embossing-font text-xs uppercase tracking-[0.15em] mb-3 text-white/50">
                              Available Sizes
                            </p>
                            <p className="neuzeit-font text-base font-medium text-white">
                              {productGroup.size_range || 'See size options above'}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-white/10">
                            <p className="embossing-font text-xs uppercase tracking-[0.15em] mb-3 text-white/50">
                              How to Measure
                            </p>
                            <ul className="space-y-2">
                              {[
                                { label: 'Chest', desc: 'Measure around the fullest part of your chest' },
                                { label: 'Waist', desc: 'Measure around your natural waistline' },
                                { label: 'Length', desc: 'Measure from shoulder to hem' },
                              ].map(item => (
                                <li key={item.label} className="neuzeit-font text-sm text-white/80">
                                  <strong className="text-white">{item.label}:</strong> {item.desc}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {currentVariant?.size_exclusions && (
                            <div className="p-4 rounded-[12px] flex items-start gap-3 bg-blue-500/10 border border-blue-500/20">
                              <Info className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-400" />
                              <p className="neuzeit-font text-sm text-blue-200">
                                {currentVariant.size_exclusions}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </section>
            </div>
          </div>
        </main>
      </div>

      {/* Logo Modal */}
      {showLogoModal && (
        <LogoCustomizerModal
          isOpen={showLogoModal}
          onClose={() => setShowLogoModal(false)}
          onApply={handleApplyLogo}
          baseImageUrl={mainImage}
          productColors={logoModalColors}
          initialColorIndex={selectedColor}
          initialConfig={logoOverlay ?? undefined}
        />
      )}

      {/* Image Modal */}
      <ImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        images={modalImages}
        initialIndex={imageModalIndex}
        alt={productGroup.style_name}
      />

      {/* How It Works Modal */}
      <ClothingHowItWorks
        isOpen={showHowItWorksModal}
        onClose={() => setShowHowItWorksModal(false)}
        onStartOrder={() => {
          setShowHowItWorksModal(false);
          setShowQuoteModal(true);
        }}
      />

      {/* Quote Modal - Start Order Flow */}
      <AnimatePresence>
        {showQuoteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowQuoteModal(false);
                setQuoteStep('logo-options');
                setSavedLogoData(null); // Clear any saved logo data
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl max-h-[90vh] mx-4 rounded-2xl overflow-hidden shadow-2xl"
              style={{ backgroundColor: colors.dark }}
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
                onClick={() => {
                  setShowQuoteModal(false);
                  setQuoteStep('logo-options');
                }}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-white rotate-180" />
              </button>

              {/* Content */}
              <div className="relative z-10 p-6 md:p-10 overflow-y-auto max-h-[90vh] scrollbar-clothing">
                {/* Error message */}
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 rounded-[12px] bg-red-500/10 border border-red-500/20 text-center"
                  >
                    <p className="neuzeit-font text-sm text-red-400">{submitError}</p>
                    <button
                      onClick={() => setSubmitError(null)}
                      className="neuzeit-font text-xs text-red-300 hover:text-red-200 mt-2 underline"
                    >
                      Dismiss
                    </button>
                  </motion.div>
                )}

                <AnimatePresence mode="wait">
                  {quoteStep === 'logo-options' && (
                    <motion.div
                      key="logo-options"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ClothingOrderWizard
                        onSelectPath={async (path, logoData, contactData) => {
                          // Save logo data if provided from preview
                          if (logoData) {
                            setSavedLogoData(logoData);
                          }

                          // Handle upload path with contact data - submit to backend
                          if (path === 'upload' && contactData && logoData) {
                            setSubmitError(null);
                            setQuoteStep('submitting');

                            try {
                              // Submit enquiry to Supabase
                              const result = await submitClothingEnquiry({
                                customerName: contactData.name,
                                customerEmail: contactData.email,
                                customerPhone: contactData.phone,
                                productId: productGroup?.style_code,
                                productName: productGroup?.style_name || '',
                                productStyleCode: productGroup?.style_code,
                                productColor: productGroup?.colors[logoData.colorIndex]?.colour_name,
                                productColorCode: productGroup?.colors[logoData.colorIndex]?.colour_code,
                                productImageUrl: productGroup?.colors[logoData.colorIndex]?.colour_image,
                                logoData: logoData.logoSrc,
                                logoAnalysis: logoData.analysis,
                                logoPositionX: logoData.x,
                                logoPositionY: logoData.y,
                                logoSizePercent: logoData.size,
                                estimatedQuantity: contactData.quantity,
                                additionalNotes: contactData.notes,
                                enquiryType: 'upload',
                              });

                              if (result.success && result.enquiryId && result.enquiryRef) {
                                setEnquiryRef(result.enquiryRef);

                                // Send email notifications (don't fail submission if emails fail)
                                sendEnquiryEmails({
                                  customerEmail: contactData.email,
                                  customerName: contactData.name,
                                  customerPhone: contactData.phone,
                                  enquiryId: result.enquiryId,
                                  enquiryRef: result.enquiryRef,
                                  productName: productGroup?.style_name || '',
                                  enquiryType: 'upload',
                                  estimatedQuantity: contactData.quantity,
                                  additionalNotes: contactData.notes,
                                  logoQuality: logoData.analysis?.qualityTier,
                                }).catch(console.error);

                                setQuoteStep('success');
                              } else {
                                setSubmitError(result.error || 'Something went wrong. Please try again.');
                                setQuoteStep('logo-options');
                              }
                            } catch (error) {
                              console.error('Submission error:', error);
                              setSubmitError('Something went wrong. Please try again.');
                              setQuoteStep('logo-options');
                            }
                            return;
                          }

                          // Handle other paths (help, consult)
                          switch (path) {
                            case 'upload':
                              // Legacy path without contact data - shouldn't happen now
                              setQuoteStep('upload');
                              break;
                            case 'help':
                              setQuoteStep('help');
                              break;
                            case 'consult':
                              setQuoteStep('consult');
                              break;
                          }
                        }}
                        productName={productGroup.style_name}
                        productImage={mainImage}
                        productColors={logoModalColors}
                        initialColorIndex={selectedColor}
                      />
                    </motion.div>
                  )}

                  {quoteStep === 'upload' && (
                    <motion.div
                      key="upload"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ClothingLogoUploader
                        onBack={() => {
                          setQuoteStep('logo-options');
                          setSavedLogoData(null); // Clear saved logo when going back
                        }}
                        onComplete={() => setQuoteStep('success')}
                        productTitle={productGroup.style_name}
                        productImage={mainImage}
                        initialLogoData={savedLogoData || undefined}
                      />
                    </motion.div>
                  )}

                  {quoteStep === 'help' && (
                    <motion.div
                      key="help"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ClothingHelpRequestForm
                        onBack={() => setQuoteStep('logo-options')}
                        onComplete={() => setQuoteStep('success')}
                        productTitle={productGroup.style_name}
                      />
                    </motion.div>
                  )}

                  {quoteStep === 'consult' && (
                    <motion.div
                      key="consult"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ClothingConsultationBooker
                        onBack={() => setQuoteStep('logo-options')}
                        onComplete={() => setQuoteStep('success')}
                        productName={productGroup.style_name}
                      />
                    </motion.div>
                  )}

                  {quoteStep === 'submitting' && (
                    <motion.div
                      key="submitting"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full max-w-xl mx-auto text-center py-16"
                    >
                      <div className="w-16 h-16 mx-auto mb-6">
                        <div
                          className="w-full h-full rounded-full border-4 border-t-transparent animate-spin"
                          style={{ borderColor: `${colors.accent} transparent ${colors.accent} ${colors.accent}` }}
                        />
                      </div>
                      <h2 className="hearns-font text-2xl text-white mb-2">
                        Submitting your request...
                      </h2>
                      <p className="neuzeit-light-font text-white/60">
                        Please wait while we process your enquiry
                      </p>
                    </motion.div>
                  )}

                  {quoteStep === 'success' && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full max-w-xl mx-auto text-center py-12"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.2 }}
                        className="w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center"
                        style={{ backgroundColor: `${colors.accent}25` }}
                      >
                        <Check className="w-12 h-12" style={{ color: colors.accent }} />
                      </motion.div>

                      <h2 className="hearns-font text-3xl text-white mb-3">
                        Request Received!
                      </h2>

                      {enquiryRef && (
                        <div className="inline-block px-4 py-2 rounded-lg bg-white/10 border border-white/20 mb-4">
                          <p className="embossing-font text-xs text-white/50 uppercase tracking-wide mb-1">
                            Your Reference
                          </p>
                          <p className="neuzeit-font text-xl font-bold" style={{ color: colors.accent }}>
                            {enquiryRef}
                          </p>
                        </div>
                      )}

                      <p className="embossing-font text-xl mb-4" style={{ color: colors.accent }}>
                        We'll be in touch soon
                      </p>
                      <p className="neuzeit-light-font text-white/70 max-w-md mx-auto mb-8">
                        Our team will review your request and get back to you within 24 hours with a mockup and quote.
                        {enquiryRef && ' Keep your reference number handy for any enquiries.'}
                      </p>

                      <button
                        onClick={() => {
                          setShowQuoteModal(false);
                          setQuoteStep('logo-options');
                          setEnquiryRef('');
                          setSavedLogoData(null);
                        }}
                        className="px-6 py-3 rounded-xl neuzeit-font font-semibold text-black transition-all hover:opacity-90"
                        style={{ backgroundColor: colors.accent }}
                      >
                        Continue Browsing
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductDetailsNew;
