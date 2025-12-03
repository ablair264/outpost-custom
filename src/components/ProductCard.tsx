import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Heart, ShoppingBag, Leaf } from 'lucide-react';
import { Product } from '../lib/supabase';

interface ProductGroup {
  style_code: string;
  style_name: string;
  brand: string;
  variants: Product[];
  colors: Array<{
    code: string;
    name: string;
    rgb: string;
    image: string;
  }>;
  size_range: string;
  price_range?: { min: number; max: number };
}

interface ProductCardProps {
  productGroup: ProductGroup;
  viewMode?: 'grid' | 'list';
}

const formatSizeRange = (sizeRange: string): string => {
  if (!sizeRange) return '';
  return sizeRange
    .replace(/to/gi, ' – ')
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')
    .replace(/(\d)([a-zA-Z])/g, '$1$2')
    .trim();
};

const ProductCard: React.FC<ProductCardProps> = ({ productGroup, viewMode = 'grid' }) => {
  const [selectedColor, setSelectedColor] = useState(0);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  
  const currentVariant = productGroup.variants.find(v => 
    v.colour_code === productGroup.colors[selectedColor]?.code
  ) || productGroup.variants[0];
  
  const currentImage = productGroup.colors[selectedColor]?.image || 
    currentVariant?.colour_image || 
    currentVariant?.primary_product_image_url;

  const isSustainable = currentVariant?.sustainable_organic === 'Yes';
  const hasMultipleColors = productGroup.colors.length > 1;

  if (viewMode === 'list') {
    return (
      <div className="group bg-[#161616] border border-white/[0.08] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#78BE20]/30 hover:bg-[#1a1a1a] hover:shadow-xl hover:shadow-[#78BE20]/5">
        <div className="flex">
          {/* Image */}
          <div className="relative w-48 h-48 flex-shrink-0 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d]">
            <img
              className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
              src={currentImage !== 'Not available' 
                ? currentImage 
                : `https://via.placeholder.com/400x400/1a1a1a/78BE20?text=${encodeURIComponent(productGroup.style_name?.slice(0, 2) || 'P')}`
              }
              alt={productGroup.style_name}
              onError={(e) => {
                e.currentTarget.src = `https://via.placeholder.com/400x400/1a1a1a/78BE20?text=${encodeURIComponent(productGroup.style_name?.slice(0, 2) || 'P')}`;
              }}
              loading="lazy"
            />
            {isSustainable && (
              <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-[#78BE20]/15 text-[#78BE20] backdrop-blur-sm">
                <Leaf size={10} />
                Eco
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-5 flex flex-col">
            <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#666] mb-1">
              {productGroup.brand}
            </p>
            <h3 className="text-[15px] font-semibold text-white mb-2 leading-snug">
              {productGroup.style_name}
            </h3>
            
            {currentVariant?.specification && (
              <p className="text-xs text-[#888] leading-relaxed mb-3 line-clamp-2">
                {currentVariant.specification.slice(0, 120)}...
              </p>
            )}

            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                {productGroup.size_range && (
                  <span className="text-xs font-medium text-[#888] px-2.5 py-1 bg-white/[0.03] rounded">
                    {formatSizeRange(productGroup.size_range)}
                  </span>
                )}
                <span className="text-xs text-[#555] font-mono">
                  {currentVariant?.sku_code}
                </span>
              </div>
              
              {productGroup.price_range && (
                <span className="text-lg font-bold text-white tracking-tight">
                  {productGroup.price_range.min !== productGroup.price_range.max && (
                    <span className="text-xs font-normal text-[#888] mr-1">From</span>
                  )}
                  £{productGroup.price_range.min.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-[#161616] border border-white/[0.08] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#78BE20]/30 hover:bg-[#1a1a1a] hover:-translate-y-1 hover:shadow-xl hover:shadow-[#78BE20]/10 flex flex-col h-full">
      {/* Image Container - Fixed Height */}
      <div className="relative aspect-square bg-gradient-to-br from-[#1e1e1e] to-[#141414] overflow-hidden">
        <img
          className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
          src={currentImage !== 'Not available' 
            ? currentImage 
            : `https://via.placeholder.com/400x400/1a1a1a/78BE20?text=${encodeURIComponent(productGroup.style_name?.slice(0, 2) || 'P')}`
          }
          alt={productGroup.style_name}
          onError={(e) => {
            e.currentTarget.src = `https://via.placeholder.com/400x400/1a1a1a/78BE20?text=${encodeURIComponent(productGroup.style_name?.slice(0, 2) || 'P')}`;
          }}
          loading="lazy"
        />
        
        {/* Badges */}
        {isSustainable && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-[#78BE20]/15 text-[#78BE20] backdrop-blur-sm">
            <Leaf size={10} />
            Sustainable
          </span>
        )}

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
          <button 
            className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-200 ${
              isFavorite 
                ? 'bg-[#78BE20] text-black' 
                : 'bg-black/70 border border-white/10 text-[#888] hover:bg-[#78BE20] hover:border-[#78BE20] hover:text-black hover:scale-110'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
          >
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button 
            className="w-9 h-9 rounded-full bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-[#888] transition-all duration-200 hover:bg-[#78BE20] hover:border-[#78BE20] hover:text-black hover:scale-110"
            onClick={(e) => e.stopPropagation()}
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>
      
      {/* Content - Flex grow to push button down */}
      <div className="p-4 flex flex-col flex-1">
        {/* Brand & Name - Fixed height area */}
        <div className="mb-3">
          <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#666] mb-1">
            {productGroup.brand}
          </p>
          <h3 className="text-[15px] font-semibold text-white leading-snug line-clamp-2 min-h-[40px]">
            {productGroup.style_name}
          </h3>
        </div>
        
        {/* Size & Price Row */}
        <div className="flex items-center justify-between mb-4">
          {productGroup.size_range && (
            <span className="text-xs font-medium text-[#888] px-2.5 py-1 bg-white/[0.03] rounded">
              {formatSizeRange(productGroup.size_range)}
            </span>
          )}
          {productGroup.price_range && (
            <span className="text-lg font-bold text-white tracking-tight">
              {productGroup.price_range.min !== productGroup.price_range.max && (
                <span className="text-xs font-normal text-[#888] mr-1">From</span>
              )}
              £{productGroup.price_range.min.toFixed(2)}
            </span>
          )}
        </div>
        
        {/* Color Selector - Fixed height */}
        <div className="relative mb-4 min-h-[44px]">
          {hasMultipleColors ? (
            <>
              {showColorDropdown && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#1c1c1c] border border-white/[0.12] rounded-xl p-2 max-h-48 overflow-y-auto z-50 shadow-xl shadow-black/40">
                  {productGroup.colors.map((color, index) => (
                    <button
                      key={color.code}
                      className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg transition-colors text-left ${
                        selectedColor === index 
                          ? 'bg-[#78BE20]/10' 
                          : 'hover:bg-white/[0.05]'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedColor(index);
                        setShowColorDropdown(false);
                      }}
                    >
                      <span 
                        className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                          selectedColor === index ? 'border-[#78BE20]' : 'border-white/20'
                        }`}
                        style={{ backgroundColor: color.rgb }}
                      />
                      <span className="text-[13px] font-medium text-white">{color.name}</span>
                    </button>
                  ))}
                </div>
              )}
              
              <button 
                className={`flex items-center justify-between w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/[0.08] rounded-lg transition-all duration-200 hover:border-white/[0.15] hover:bg-white/[0.04] ${
                  showColorDropdown ? 'border-white/[0.15] bg-white/[0.04]' : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowColorDropdown(!showColorDropdown);
                }}
                onBlur={() => setTimeout(() => setShowColorDropdown(false), 200)}
              >
                <div className="flex items-center gap-2.5">
                  <span 
                    className="w-4 h-4 rounded-full border-2 border-white/20 flex-shrink-0"
                    style={{ backgroundColor: productGroup.colors[selectedColor]?.rgb }}
                  />
                  <span className="text-[13px] font-medium text-white truncate">
                    {productGroup.colors[selectedColor]?.name}
                  </span>
                  <span className="text-[11px] text-[#666] flex-shrink-0">
                    +{productGroup.colors.length - 1}
                  </span>
                </div>
                <ChevronDown 
                  size={14} 
                  className={`text-[#666] transition-transform duration-200 flex-shrink-0 ${showColorDropdown ? 'rotate-180' : ''}`} 
                />
              </button>
            </>
          ) : productGroup.colors.length === 1 ? (
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white/[0.02] border border-white/[0.08] rounded-lg">
              <span 
                className="w-4 h-4 rounded-full border-2 border-white/20 flex-shrink-0"
                style={{ backgroundColor: productGroup.colors[0]?.rgb }}
              />
              <span className="text-[13px] font-medium text-white truncate">
                {productGroup.colors[0]?.name}
              </span>
            </div>
          ) : (
            <div className="h-[44px]" /> 
          )}
        </div>
        
        {/* View Details Button - Always at bottom */}
        <button 
          className="mt-auto w-full py-3 bg-transparent border border-[#78BE20] rounded-lg text-[#78BE20] font-semibold text-xs tracking-wide uppercase transition-all duration-200 hover:bg-[#78BE20] hover:text-black"
          onClick={() => navigate(`/products/${productGroup.style_code}`)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;