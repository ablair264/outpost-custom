import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
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
  
  // Convert "Sto3XL" to "S to 3XL"
  return sizeRange
    .replace(/to/gi, ' to ')
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')
    .replace(/(\d)([a-zA-Z])/g, '$1$2')
    .trim();
};

const formatPrice = (priceRange?: { min: number; max: number }): string => {
  if (!priceRange) return '';
  
  if (priceRange.min === priceRange.max) {
    return `£${priceRange.min.toFixed(2)}`;
  }
  
  return `£${priceRange.min.toFixed(2)} - £${priceRange.max.toFixed(2)}`;
};

const ProductCard: React.FC<ProductCardProps> = ({ productGroup, viewMode = 'grid' }) => {
  const [selectedColor, setSelectedColor] = useState(0);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const navigate = useNavigate();
  
  const currentVariant = productGroup.variants.find(v => 
    v.colour_code === productGroup.colors[selectedColor]?.code
  ) || productGroup.variants[0];
  
  const currentImage = productGroup.colors[selectedColor]?.image || 
    currentVariant?.colour_image || 
    currentVariant?.primary_product_image_url;

  return (
    <div className={`product-card ${viewMode}`}>
      <div className="product-image-wrapper">
        <img
          src={currentImage !== 'Not available' 
            ? currentImage 
            : 'https://via.placeholder.com/400x400/1a1a1a/78BE20?text=' + encodeURIComponent(productGroup.style_name?.slice(0, 2) || 'P')
          }
          alt={productGroup.style_name}
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x400/1a1a1a/78BE20?text=' + encodeURIComponent(productGroup.style_name?.slice(0, 2) || 'P');
          }}
          loading="lazy"
        />
        
        {/* Sustainability Badge */}
        {currentVariant?.sustainable_organic === 'Yes' && (
          <div className="sustainability-badge">
            <span>♻️ Sustainable</span>
          </div>
        )}

        {/* View More Button - Fixed Position */}
        <button 
          className="view-more-btn-fixed"
          onClick={() => navigate(`/products/${productGroup.style_code}`)}
        >
          View More
        </button>
      </div>
      
      <div className="product-info">
        <div className="product-header">
          <h3 className="product-name">{productGroup.style_name}</h3>
          <p className="product-brand">{productGroup.brand}</p>
        </div>
        
        {/* Price */}
        {productGroup.price_range && (
          <div className="product-price">
            {formatPrice(productGroup.price_range)}
          </div>
        )}
        
        {/* Color Dropdown */}
        {productGroup.colors.length > 1 && (
          <div className={`color-dropdown-container ${showColorDropdown ? 'open' : ''}`}>
            <button 
              className="color-dropdown-trigger"
              onClick={() => setShowColorDropdown(!showColorDropdown)}
              onBlur={() => setTimeout(() => setShowColorDropdown(false), 150)}
            >
              <span className="selected-color-text">
                {productGroup.colors[selectedColor]?.name || 'Select Color'}
              </span>
              <ChevronDown size={16} className="dropdown-arrow" />
            </button>
            
            {showColorDropdown && (
              <div className="color-dropdown-menu">
                {productGroup.colors.map((color, index) => (
                  <button
                    key={color.code}
                    className={`color-dropdown-option ${selectedColor === index ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedColor(index);
                      setShowColorDropdown(false);
                    }}
                  >
                    <span 
                      className="color-indicator" 
                      style={{ backgroundColor: color.rgb }}
                    />
                    <span className="color-name">{color.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
        {viewMode === 'list' && (
          <div className="product-details">
            <div className="product-meta">
              <span className="product-sku">SKU: {currentVariant?.sku_code}</span>
              <span className="product-sizes">{formatSizeRange(productGroup.size_range)}</span>
            </div>
            
            {currentVariant?.specification && (
              <p className="product-description">
                {currentVariant.specification.slice(0, 120)}...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;