import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { X, ArrowRight, ZoomIn, Eye, Tag, Shirt } from 'lucide-react';
import { ProductGroup } from './ClothingBrowser';
import { ImageZoom, Image } from '../animate-ui/primitives/effects/image-zoom';

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
              <h3 className="text-sm text-white leading-tight mb-2 line-clamp-3 sm:line-clamp-2 min-h-[48px] sm:min-h-[40px]" style={{ fontFamily: fonts.subheading }}>
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
          /* Expanded Card - Editorial magazine-style layout */
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="relative group"
            onClick={onClose}
          >
            {/* Subtle gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent rounded-2xl pointer-events-none" />

            {/* Close button - minimal, top right */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-20 p-1 rounded-full text-white/40 hover:text-white/80 hover:bg-white/10 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Main content grid */}
            <div className="flex gap-4 p-4">
              {/* Image - larger, more prominent with subtle shadow */}
              <div
                className="relative w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-white to-gray-100 shadow-lg shadow-black/20"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={currentImage !== 'Not available'
                    ? currentImage
                    : `https://via.placeholder.com/300x300/ffffff/78BE20?text=${encodeURIComponent(productGroup.style_name?.slice(0, 2) || 'P')}`
                  }
                  alt={productGroup.style_name}
                  className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.src = `https://via.placeholder.com/300x300/ffffff/78BE20?text=${encodeURIComponent(productGroup.style_name?.slice(0, 2) || 'P')}`;
                  }}
                />
              </div>

              {/* Content - tighter vertical rhythm */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                {/* Header section */}
                <div>
                  {/* Brand with accent underline effect */}
                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase mb-1" style={{ color: clothingColors.accent }}>
                    {productGroup.brand}
                  </p>

                  {/* Product name - more presence */}
                  <h3 className="text-base sm:text-lg font-semibold text-white leading-tight line-clamp-2 mb-1" style={{ fontFamily: fonts.subheading }}>
                    {productGroup.style_name}
                  </h3>

                  {/* Meta info inline */}
                  <div className="flex items-center gap-2 text-[11px] text-white/50">
                    {productGroup.product_type && <span>{productGroup.product_type}</span>}
                    {productGroup.product_type && productGroup.fabric && <span className="text-white/20">·</span>}
                    {productGroup.fabric && <span>{productGroup.fabric.split(' ').slice(0, 2).join(' ')}</span>}
                  </div>
                </div>

                {/* Price - bottom aligned with the image */}
                {productGroup.price_range && productGroup.price_range.min > 0 && (
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-[11px] text-white/40">from</span>
                    <span className="text-xl font-bold text-white tabular-nums" style={{ fontFamily: fonts.body }}>
                      £{productGroup.price_range.min.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom section - colors, sizes, CTA */}
            <div className="px-4 pb-4 space-y-3" onClick={(e) => e.stopPropagation()}>
              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Colors and Sizes row */}
              <div className="flex items-end justify-between gap-4">
                {/* Colors */}
                {productGroup.colors.length > 0 && (
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-white/40 mb-1.5">
                      {productGroup.colors.length} colour{productGroup.colors.length !== 1 ? 's' : ''} available
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {productGroup.colors.slice(0, 10).map((color, i) => (
                        <button
                          key={color.code}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedColorIndex(i);
                          }}
                          className={`w-6 h-6 rounded-md transition-all duration-200 ${
                            selectedColorIndex === i
                              ? 'ring-2 ring-offset-2 ring-offset-[#1a2e1a] ring-[#64a70b] scale-110 shadow-lg'
                              : 'ring-1 ring-white/10 hover:ring-white/30 hover:scale-105'
                          }`}
                          style={{
                            backgroundColor: color.rgb,
                            boxShadow: selectedColorIndex === i ? `0 4px 12px ${color.rgb}40` : undefined
                          }}
                          title={color.name}
                        />
                      ))}
                      {productGroup.colors.length > 10 && (
                        <span className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-[10px] text-white/50 ring-1 ring-white/10">
                          +{productGroup.colors.length - 10}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Sizes - compact pill */}
                {sizeRange && (
                  <div className="flex-shrink-0 text-right">
                    <p className="text-[10px] text-white/40 mb-1.5">Sizes</p>
                    <span className="inline-block px-2.5 py-1 rounded-md bg-white/5 text-sm text-white/90 font-medium ring-1 ring-white/10">
                      {sizeRange}
                    </span>
                  </div>
                )}
              </div>

              {/* CTA Button - refined with hover state */}
              <button
                onClick={() => navigate(`/products/${productGroup.style_code}`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:shadow-xl hover:shadow-[#64a70b]/20 active:scale-[0.98] group/btn"
                style={{
                  backgroundColor: clothingColors.accent,
                  backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)'
                }}
              >
                <span>View Details</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

    </motion.div>
  );
};

export default ClothingCard;
