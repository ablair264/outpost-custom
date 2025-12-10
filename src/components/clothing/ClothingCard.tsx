import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, ZoomIn, Eye, Sparkles, MessageSquare } from 'lucide-react';
import { ProductGroup } from './ClothingBrowser';
import { ImageZoom, Image } from '../animate-ui/primitives/effects/image-zoom';
import ClothingProductDetailModal from './ClothingProductDetailModal';

// Theme colors - Brand palette (matching ClothingBrowser)
const clothingColors = {
  accent: '#64a70b',      // Primary green
  text: '#333333',        // Body text (80%)
  dark: '#183028',        // Dark green
  light: '#c1c6c8',       // Light gray
  secondary: '#1e3a2f',   // Card background (slightly lighter than dark)
};

// Brand name to domain mapping for Brandfetch API
const BRAND_DOMAINS: Record<string, string> = {
  'adidas®': 'adidas.com',
  'Nike': 'nike.com',
  'Under Armour': 'underarmour.com',
  'Under Armour Golf': 'underarmour.com',
  'New Era': 'neweracap.com',
  'Fruit of the Loom': 'fruitoftheloom.com',
  'Gildan': 'gildan.com',
  'Bella Canvas': 'bellacanvas.com',
  'Comfort Colors®': 'comfortcolors.com',
  'Jack Wolfskin': 'jack-wolfskin.com',
  'Craghoppers': 'craghoppers.com',
  'Regatta Professional': 'regatta.com',
  'Regatta Junior': 'regatta.com',
  'Regatta Honestly Made': 'regatta.com',
  'Regatta High Visibility': 'regatta.com',
  'Regatta Safety Footwear': 'regatta.com',
  'Stanley/Stella': 'stanleystella.com',
  'Stormtech': 'stormtech.ca',
  'AWDis': 'awdis.com',
  'AWDis Academy': 'awdis.com',
  'AWDis Ecologie': 'awdis.com',
  'AWDis Just Cool': 'awdis.com',
  'AWDis Just Hoods': 'awdis.com',
  "AWDis Just Polo's": 'awdis.com',
  "AWDis Just T's": 'awdis.com',
  'AWDis So Denim': 'awdis.com',
  'Russell Collection': 'russelleurope.com',
  'Russell Europe': 'russelleurope.com',
  'B&C Collection': 'bc-collection.eu',
  'Callaway': 'callawaygolf.com',
  'OGIO': 'ogio.com',
  'Snickers': 'snickersworkwear.com',
  'Portwest': 'portwest.com',
  'Result': 'resultclothing.com',
  'Result Core': 'resultclothing.com',
  'Result Genuine Recycled': 'resultclothing.com',
  'Result Headwear': 'resultclothing.com',
  'Result Safeguard': 'resultclothing.com',
  'Result Urban Outdoor': 'resultclothing.com',
  'Result Winter Essentials': 'resultclothing.com',
  'Result Workguard': 'resultclothing.com',
  'Nimbus': 'nimbuswear.com',
  'Scruffs': 'scruffs.com',
};

// Get Brandfetch logo URL for a brand
const getBrandLogoUrl = (brandName: string): string | null => {
  const domain = BRAND_DOMAINS[brandName];
  if (!domain) return null;
  // Using Brandfetch CDN - returns WebP by default
  return `https://cdn.brandfetch.io/${domain}/w/128/h/32?c=1idwNSepBcgUb6Y8Sjq`;
};

// Font families
const fonts = {
  heading: "'Hearns', serif",
  subheading: "'Embossing Tape 3', sans-serif",
  body: "'Neuzeit Grotesk', sans-serif",
};

interface ClothingCardProps {
  productGroup: ProductGroup;
  index: number;
  isExpanded: boolean;
  hasExpandedCard: boolean;
  onExpand: () => void;
  onClose: () => void;
  expandedRef?: (node: HTMLDivElement | null) => void;
}

const formatSizeRange = (sizeRange: string): string => {
  if (!sizeRange) return '';
  return sizeRange
    .replace(/to/gi, ' – ')
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')
    .replace(/(\d)([a-zA-Z])/g, '$1$2')
    .trim();
};

const ClothingCard: React.FC<ClothingCardProps> = ({
  productGroup,
  index,
  isExpanded,
  hasExpandedCard,
  onExpand,
  onClose,
  expandedRef,
}) => {
  const navigate = useNavigate();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const currentColor = productGroup.colors[selectedColorIndex];
  const currentImage = currentColor?.image || productGroup.variants[0]?.primary_product_image_url;

  // Determine if this card should be dimmed
  const shouldDim = hasExpandedCard && !isExpanded;

  // Display colors (max 5 in collapsed, all in expanded)
  const displayColors = isExpanded ? productGroup.colors : productGroup.colors.slice(0, 5);
  const remainingColors = productGroup.colors.length - 5;

  // Size ordering for proper range display
  const SIZE_ORDER: Record<string, number> = {
    'XXS': 1, '2XS': 1,
    'XS': 2,
    'S': 3, 'SM': 3, 'Small': 3,
    'M': 4, 'MD': 4, 'Medium': 4,
    'L': 5, 'LG': 5, 'Large': 5,
    'XL': 6,
    'XXL': 7, '2XL': 7,
    'XXXL': 8, '3XL': 8,
    '4XL': 9, 'XXXXL': 9,
    '5XL': 10, 'XXXXXL': 10,
    '6XL': 11,
    '7XL': 12,
    '8XL': 13,
    // One size variants
    'One Size': 100, 'ONESIZE': 100, 'OS': 100, 'O/S': 100,
  };

  // Get size range as a string like "XS - 3XL" or "One Size"
  const getSizeRange = (): string => {
    const sizes = new Set<string>();
    productGroup.variants.forEach(v => {
      if (v.size_name && v.sku_status !== 'Discontinued') {
        sizes.add(v.size_name);
      }
    });

    if (sizes.size === 0) return '';

    const sizeArray = Array.from(sizes);

    // Check for one-size items
    const oneSizeVariants = sizeArray.filter(s =>
      SIZE_ORDER[s] === 100 || s.toLowerCase().includes('one size')
    );
    if (oneSizeVariants.length > 0 && sizeArray.length === 1) {
      return 'One Size';
    }

    // Sort sizes by order
    const sortedSizes = sizeArray
      .filter(s => SIZE_ORDER[s] !== undefined && SIZE_ORDER[s] !== 100)
      .sort((a, b) => (SIZE_ORDER[a] || 50) - (SIZE_ORDER[b] || 50));

    if (sortedSizes.length === 0) {
      // Fallback to first size if no standard sizes found
      return sizeArray[0];
    }

    if (sortedSizes.length === 1) {
      return sortedSizes[0];
    }

    // Return range
    return `${sortedSizes[0]} – ${sortedSizes[sortedSizes.length - 1]}`;
  };

  const sizeRange = getSizeRange();

  return (
    <motion.div
      ref={isExpanded ? expandedRef : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: Math.min(index * 0.02, 0.2),
        layout: {
          duration: 0.25,
          ease: 'easeOut'
        }
      }}
      layout
      className={`
        ${isExpanded ? 'col-span-2 md:col-span-3 lg:col-span-4 z-10' : ''}
      `}
    >
      <motion.div
        layout="position"
        transition={{
          layout: {
            duration: 0.25,
            ease: 'easeOut'
          }
        }}
        className={`group w-full h-full rounded-2xl overflow-hidden border border-white/10 relative ${
          isExpanded
            ? 'shadow-2xl shadow-black/30'
            : 'hover:shadow-lg hover:border-white/20 transition-shadow duration-150'
        }`}
        style={{ backgroundColor: clothingColors.secondary }}
      >
        {/* Dark overlay when another card is expanded */}
        {shouldDim && (
          <div className="absolute inset-0 bg-black/40 z-10 rounded-2xl pointer-events-none transition-opacity duration-200" />
        )}

        {!isExpanded ? (
          /* Collapsed Card */
          <button
            onClick={onExpand}
            className="w-full h-full text-left flex flex-col"
          >
            {/* Image */}
            <div className="aspect-[4/3] overflow-hidden bg-white relative">
              <img
                src={currentImage !== 'Not available'
                  ? currentImage
                  : `https://via.placeholder.com/400x400/ffffff/78BE20?text=${encodeURIComponent(productGroup.style_name?.slice(0, 2) || 'P')}`
                }
                alt={productGroup.style_name}
                className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = `https://via.placeholder.com/400x400/ffffff/78BE20?text=${encodeURIComponent(productGroup.style_name?.slice(0, 2) || 'P')}`;
                }}
                loading="lazy"
              />

              {/* Hover overlay with eye icon */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3 shadow-lg">
                  <Eye className="w-5 h-5 text-gray-800" />
                </div>
              </div>

              {/* Color count badge */}
              {productGroup.colors.length > 1 && (
                <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/70 text-white text-xs font-medium z-10">
                  {productGroup.colors.length} colours
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
              {/* Brand */}
              <p className="text-[11px] font-bold tracking-[0.15em] uppercase mb-1" style={{ color: clothingColors.accent }}>
                {productGroup.brand}
              </p>

              {/* Name */}
              <h3 className="text-sm text-white leading-tight mb-2 line-clamp-2 min-h-[40px]" style={{ fontFamily: fonts.subheading }}>
                {productGroup.style_name}
              </h3>

              {/* Price */}
              {productGroup.price_range && productGroup.price_range.min > 0 && (
                <p className="text-lg font-bold text-white mb-3" style={{ fontFamily: fonts.body }}>
                  From £{productGroup.price_range.min.toFixed(2)}
                </p>
              )}

              {/* Color swatches */}
              {productGroup.colors.length > 0 && (
                <div className="flex items-center gap-1.5 mt-auto">
                  {displayColors.map((color, i) => (
                    <div
                      key={color.code}
                      className="w-5 h-5 rounded-full border border-white/20"
                      style={{ backgroundColor: color.rgb }}
                      title={color.name}
                    />
                  ))}
                  {remainingColors > 0 && (
                    <span className="text-xs text-white/50 ml-1">+{remainingColors}</span>
                  )}
                </div>
              )}
            </div>
          </button>
        ) : (
          /* Expanded Card - Compact single-row layout */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="relative flex cursor-pointer"
            onClick={onClose}
          >
            {/* Image section */}
            <div
              className="w-[140px] bg-white relative flex-shrink-0 rounded-l-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-2 left-2 z-20 p-1 rounded-full bg-black/60 hover:bg-black/80 transition-all"
              >
                <X className="w-3 h-3 text-white" />
              </button>

              <motion.div
                className="absolute bottom-2 right-2 z-20 p-1 rounded-full bg-black/60 pointer-events-none"
                initial={{ opacity: 0.7 }}
                animate={{ opacity: isImageZoomed ? 0 : 0.7 }}
              >
                <ZoomIn className="w-2.5 h-2.5 text-white" />
              </motion.div>

              <ImageZoom
                zoomScale={2.5}
                zoomOnHover={false}
                zoomOnClick={true}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <Image
                  src={currentImage !== 'Not available'
                    ? currentImage
                    : `https://via.placeholder.com/600x600/ffffff/78BE20?text=${encodeURIComponent(productGroup.style_name?.slice(0, 2) || 'P')}`
                  }
                  alt={productGroup.style_name}
                  objectFit="contain"
                  style={{ padding: '0.5rem' }}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.src = `https://via.placeholder.com/600x600/ffffff/78BE20?text=${encodeURIComponent(productGroup.style_name?.slice(0, 2) || 'P')}`;
                  }}
                />
              </ImageZoom>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 flex items-center gap-4 min-w-0">
              {/* Product Info */}
              <div className="w-[180px] flex-shrink-0">
                <p className="text-[9px] font-bold tracking-[0.15em] uppercase mb-0.5" style={{ color: clothingColors.accent }}>
                  {productGroup.brand}
                </p>
                <h3 className="text-sm text-white leading-tight mb-1" style={{ fontFamily: fonts.subheading }}>
                  {productGroup.style_name}
                </h3>
                {productGroup.price_range && productGroup.price_range.min > 0 && (
                  <p className="text-base font-bold text-white" style={{ fontFamily: fonts.body }}>
                    £{productGroup.price_range.min.toFixed(2)}
                    {productGroup.price_range.min !== productGroup.price_range.max && (
                      <span className="text-[10px] font-normal text-white/50 ml-1">
                        – £{productGroup.price_range.max.toFixed(2)}
                      </span>
                    )}
                  </p>
                )}
              </div>

              <div className="w-px h-14 bg-white/10 flex-shrink-0" />

              {/* Colors */}
              {productGroup.colors.length > 0 && (
                <div className="min-w-0 flex-shrink" onClick={(e) => e.stopPropagation()}>
                  <p className="text-[9px] font-semibold text-white/40 uppercase tracking-wider mb-1">
                    {productGroup.colors.length} Colours
                  </p>
                  <div className="flex flex-wrap gap-1 max-w-[140px]">
                    {productGroup.colors.slice(0, 8).map((color, i) => (
                      <button
                        key={color.code}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedColorIndex(i);
                        }}
                        className={`w-5 h-5 rounded-full transition-all ${
                          selectedColorIndex === i
                            ? 'ring-2 ring-offset-1 ring-offset-[#1e3a2f] ring-[#64a70b] scale-110'
                            : 'ring-1 ring-white/20 hover:ring-white/40'
                        }`}
                        style={{ backgroundColor: color.rgb }}
                        title={color.name}
                      />
                    ))}
                    {productGroup.colors.length > 8 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/products/${productGroup.style_code}`);
                        }}
                        className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-[8px] text-white/60 hover:text-white font-medium transition-all flex items-center justify-center"
                        title={`View all ${productGroup.colors.length} colours`}
                      >
                        +{productGroup.colors.length - 8}
                      </button>
                    )}
                  </div>
                  <p className="text-[9px] text-white/40 mt-0.5 truncate max-w-[140px]">{currentColor?.name}</p>
                </div>
              )}

              <div className="w-px h-14 bg-white/10 flex-shrink-0" />

              {/* Size */}
              {sizeRange && (
                <div className="flex-shrink-0">
                  <p className="text-[9px] font-semibold text-white/40 uppercase tracking-wider mb-1">
                    Sizes
                  </p>
                  <p className="text-white text-sm font-medium whitespace-nowrap">
                    {sizeRange}
                  </p>
                </div>
              )}

              <div className="w-px h-14 bg-white/10 flex-shrink-0" />

              {/* Key Features */}
              {(() => {
                const features = [
                  productGroup.variants[0]?.product_feature_1,
                  productGroup.variants[0]?.product_feature_2,
                  productGroup.variants[0]?.product_feature_3,
                ].filter(f => f && f !== 'Not available');

                if (features.length === 0) return null;

                return (
                  <div className="flex-1 min-w-[140px] max-w-[220px]">
                    <p className="text-[9px] font-semibold text-white/40 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      Features
                    </p>
                    <ul className="space-y-0.5">
                      {features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="text-white/70 text-xs leading-snug truncate">
                          • {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })()}

              {/* CTA */}
              <div className="flex-shrink-0 ml-auto flex gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setShowQuoteModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm text-white transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap border-2 border-white/30 hover:border-[#64a70b] hover:bg-[#64a70b]/10"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Get Quote
                </button>
                <button
                  onClick={() => navigate(`/products/${productGroup.style_code}`)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm text-black transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                  style={{
                    backgroundColor: clothingColors.accent,
                    boxShadow: '0 4px 12px rgba(100, 167, 11, 0.25)'
                  }}
                >
                  View Details
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Quote Modal */}
      <ClothingProductDetailModal
        productGroup={productGroup}
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
      />
    </motion.div>
  );
};

export default ClothingCard;
