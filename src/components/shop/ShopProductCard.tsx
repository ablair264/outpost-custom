import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, X, ShoppingBag } from 'lucide-react';
import { Button } from '../ui/button';
import { GroupedProduct } from '../../lib/supabase';

interface ShopProductCardProps {
  product: GroupedProduct;
  isExpanded?: boolean;
  onToggleExpand?: (shouldExpand: boolean) => void;
}

const ShopProductCard: React.FC<ShopProductCardProps> = ({
  product,
  isExpanded = false,
  onToggleExpand
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    if (onToggleExpand) {
      onToggleExpand(!isExpanded);
    }
  };

  const handleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleExpand) {
      onToggleExpand(false);
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigate using style_code only
    navigate(`/products/${product.style_code}`);
  };

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-out flex-shrink-0 ${
        isExpanded
          ? 'w-[calc(100vw-2rem)] min-w-[calc(100vw-2rem)] h-auto min-h-[500px] max-h-[90vh] md:w-[800px] md:min-w-[800px]'
          : 'w-full min-w-[280px] max-w-[280px] h-[400px]'
      }`}
      onClick={handleCardClick}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => !isExpanded && setIsHovered(false)}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-500"
        style={{
          backgroundImage: `url(${product.primary_product_image_url})`,
          transform: isHovered ? 'scale(1.05)' : 'scale(1)'
        }}
      />

      {/* Overlay gradient - darker when expanded */}
      <div className={`absolute inset-0 transition-all duration-500 ${
        isExpanded
          ? 'bg-black/70 backdrop-blur-sm'
          : 'bg-gradient-to-b from-black/30 via-transparent to-black/70'
      }`} />

      {/* Content */}
      <div className={`relative w-full h-full flex flex-col justify-between ${
        isExpanded ? 'p-6 md:p-8' : 'p-5'
      }`}>
        {!isExpanded ? (
          <>
            {/* Collapsed View - Top Section - Brand & Product Name */}
            <div className="space-y-1">
              <span className="block text-white/90 text-sm font-semibold tracking-wide drop-shadow-lg uppercase">
                {product.brand}
              </span>
              <span className="block text-white text-lg font-bold drop-shadow-lg leading-tight line-clamp-2">
                {product.style_name}
              </span>
              {product.colors && product.colors.length > 0 && (
                <span className="block text-white/80 text-xs drop-shadow-lg">
                  {product.colors.length} {product.colors.length === 1 ? 'Color' : 'Colors'} Available
                </span>
              )}
            </div>

            {/* Collapsed View - Bottom Section - Price & Action */}
            <div className="flex justify-between items-center">
              {/* Price */}
              <span className="text-white text-2xl font-bold drop-shadow-lg" style={{ color: '#6da71d' }}>
                {product.price_range.min === product.price_range.max
                  ? `£${product.price_range.min.toFixed(2)}`
                  : `£${product.price_range.min.toFixed(2)} - £${product.price_range.max.toFixed(2)}`}
              </span>

              {/* View Details Button */}
              <button
                onClick={handleViewDetails}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all group/btn"
                style={{ background: '#6da71d' }}
                aria-label="View details"
              >
                <Eye className="w-4 h-4 text-white transition-all group-hover/btn:scale-110" strokeWidth={2} />
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Expanded View */}
            <div className="relative w-full h-full flex flex-col gap-5 overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={handleCollapse}
                className="absolute top-0 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all backdrop-blur-sm z-10"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Header */}
              <div className="space-y-2">
                <span className="block text-white/90 text-base font-semibold tracking-wide drop-shadow-lg uppercase">
                  {product.brand}
                </span>
                <h2 className="text-white text-2xl md:text-3xl font-bold drop-shadow-lg leading-tight">
                  {product.style_name}
                </h2>
                <div className="pt-1">
                  <span className="text-3xl md:text-4xl font-bold drop-shadow-lg" style={{ color: '#6da71d' }}>
                    {product.price_range.min === product.price_range.max
                      ? `£${product.price_range.min.toFixed(2)}`
                      : `£${product.price_range.min.toFixed(2)} - £${product.price_range.max.toFixed(2)}`}
                  </span>
                </div>
              </div>

              {/* Description & Materials */}
              <div className="space-y-3 flex-1">
                {product.retail_description && (
                  <div className="space-y-1.5">
                    <h3 className="text-white text-xs font-semibold uppercase tracking-wider">Description</h3>
                    <p className="text-gray-200 text-sm leading-relaxed line-clamp-3">
                      {product.retail_description.length > 150
                        ? `${product.retail_description.substring(0, 150)}...`
                        : product.retail_description}
                    </p>
                  </div>
                )}

                {product.fabric && (
                  <div className="space-y-1.5">
                    <h3 className="text-white text-xs font-semibold uppercase tracking-wider">Material</h3>
                    <p className="text-gray-200 text-sm">
                      {product.fabric}
                    </p>
                  </div>
                )}

                {product.colors && product.colors.filter(c => c.rgb).length > 0 && (
                  <div className="space-y-1.5">
                    <h3 className="text-white text-xs font-semibold uppercase tracking-wider">
                      Available Colors ({product.colors.filter(c => c.rgb).length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.filter(c => c.rgb).map((color) => (
                        <div
                          key={color.colour_code}
                          className="group/color relative"
                          title={color.colour_name}
                        >
                          <div
                            className="w-8 h-8 rounded-full border-2 border-white/20 hover:border-white/40 transition-all cursor-pointer"
                            style={{
                              backgroundColor: `rgb(${color.rgb})`
                            }}
                          />
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover/color:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {color.colour_name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {product.sizes && product.sizes.length > 0 && (
                  <div className="space-y-1.5">
                    <h3 className="text-white text-xs font-semibold uppercase tracking-wider">
                      Available Sizes ({product.sizes.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <span
                          key={size}
                          className="px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded text-gray-100 text-xs font-medium"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions Section */}
              <div className="flex items-center gap-3">
                <Button
                  className="flex-1 rounded-full h-11 text-white font-semibold transition-all"
                  style={{ background: '#6da71d' }}
                  onClick={handleViewDetails}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  View Full Details
                </Button>
                <button
                  onClick={handleViewDetails}
                  className="w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all backdrop-blur-sm flex-shrink-0"
                  aria-label="View product page"
                >
                  <Eye className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Hover overlay - only when not expanded */}
      {!isExpanded && (
        <div
          className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(109, 167, 29, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)',
            opacity: isHovered ? 1 : 0
          }}
        />
      )}
    </div>
  );
};

export default ShopProductCard;
