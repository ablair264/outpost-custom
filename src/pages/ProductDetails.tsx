import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../lib/supabase';
import { supabase } from '../lib/supabase';
import './ProductDetails.css';
import LogoCustomizerModal, { LogoOverlayConfig } from '../components/LogoCustomizerModal';
import ImageModal from '../components/ImageModal';

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

const ProductDetails: React.FC = () => {
  const { styleCode } = useParams<{ styleCode: string }>();
  const navigate = useNavigate();
  const [productGroup, setProductGroup] = useState<ProductGroup | null>(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [logoOverlay, setLogoOverlay] = useState<LogoOverlayConfig | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageModalIndex, setImageModalIndex] = useState(0);

  useEffect(() => {
    if (!styleCode) return;
    
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('product_data')
          .select('*')
          .eq('style_code', styleCode);

        if (error) throw error;
        if (!data || data.length === 0) {
          setError('Product not found');
          return;
        }

        // Group variants by style
        const variants = data as Product[];
        console.log('Variants data:', variants); // Debug log
        
        const colors = Array.from(new Set(variants.map(v => v.colour_code)))
          .map(code => {
            const variant = variants.find(v => v.colour_code === code)!;
            console.log('Processing color:', variant.colour_name, 'RGB:', variant.rgb, 'Code:', code); // Debug log
            
            // Always use color name mapping for better accuracy
            const colorName = variant.colour_name.toLowerCase();
            let displayColor = variant.rgb;
            
            // Map color names to appropriate colors
            if (colorName.includes('black')) displayColor = '#000000';
            else if (colorName.includes('white')) displayColor = '#ffffff';
            else if (colorName.includes('red')) displayColor = '#dc3545';
            else if (colorName.includes('blue')) displayColor = '#007bff';
            else if (colorName.includes('green')) displayColor = '#28a745';
            else if (colorName.includes('yellow')) displayColor = '#ffc107';
            else if (colorName.includes('grey') || colorName.includes('gray')) displayColor = '#6c757d';
            else if (colorName.includes('navy')) displayColor = '#001f3f';
            else if (colorName.includes('orange')) displayColor = '#ff6b35';
            else if (colorName.includes('purple')) displayColor = '#6f42c1';
            else if (colorName.includes('pink')) displayColor = '#e83e8c';
            else if (colorName.includes('brown')) displayColor = '#8b4513';
            else if (!displayColor || displayColor === 'Not available' || displayColor === '' || displayColor === '#') {
              displayColor = '#cccccc'; // Default fallback color
            }
            
            console.log('Final color for', variant.colour_name, ':', displayColor); // Debug log
            
            return {
              code,
              name: variant.colour_name,
              rgb: displayColor,
              image: variant.colour_image || variant.primary_product_image_url
            };
          });

        const prices = variants
          .map(v => parseFloat(v.single_price))
          .filter(p => !isNaN(p));
        
        const priceRange = prices.length > 0 ? {
          min: Math.min(...prices),
          max: Math.max(...prices)
        } : undefined;

        setProductGroup({
          style_code: variants[0].style_code,
          style_name: variants[0].style_name,
          brand: variants[0].brand,
          variants,
          colors,
          size_range: variants[0].size_range,
          price_range: priceRange
        });

        // Set the initial selected color to match the first variant's color
        const firstVariantColorIndex = colors.findIndex(color => 
          color.code === variants[0].colour_code
        );
        if (firstVariantColorIndex !== -1) {
          setSelectedColor(firstVariantColorIndex);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [styleCode]);

  if (loading) {
    return (
      <div className="product-details-loading">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !productGroup) {
    return (
      <div className="product-details-error">
        <h2>Product Not Found</h2>
        <p>{error || 'The product you are looking for does not exist.'}</p>
        <button onClick={() => navigate(-1)} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  const currentVariant = productGroup.variants.find(v => 
    v.colour_code === productGroup.colors[selectedColor]?.code
  ) || productGroup.variants[0];

  const availableSizes = productGroup.variants
    .filter(v => v.colour_code === productGroup.colors[selectedColor]?.code)
    .map(v => ({ code: v.size_code, name: v.size_name }))
    .filter((size, index, self) => 
      index === self.findIndex(s => s.code === size.code)
    );

  const currentImages = [
    productGroup.colors[selectedColor]?.image || currentVariant?.primary_product_image_url,
    currentVariant?.colour_image,
    currentVariant?.primary_product_image_url
  ].filter((img, index, self) => 
    img && img !== 'Not available' && self.indexOf(img) === index
  );

  const formatPrice = (priceRange?: { min: number; max: number }): string => {
    if (!priceRange) return '';
    
    if (priceRange.min === priceRange.max) {
      return `£${priceRange.min.toFixed(2)}`;
    }
    
    return `£${priceRange.min.toFixed(2)} - £${priceRange.max.toFixed(2)}`;
  };

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', {
      product: currentVariant,
      quantity,
      selectedSize
    });
  };

  const handleApplyLogo = (config: LogoOverlayConfig) => {
    setLogoOverlay(config);
    setShowLogoModal(false);
  };

  return (
    <div className="product-details">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <button onClick={() => navigate('/')} className="breadcrumb-link">Home</button>
          <span className="breadcrumb-separator">/</span>
          <button onClick={() => navigate('/products')} className="breadcrumb-link">Products</button>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{productGroup.style_name}</span>
        </nav>

        <div className="product-details-content">
          {/* Product Images */}
          <div className="product-images">
            <div className="image-thumbnails">
              {currentImages.map((image, index) => (
                <button
                  key={index}
                  className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                  onClick={() => {
                    setImageModalIndex(index);
                    setShowImageModal(true);
                  }}
                >
                  <img
                    src={image}
                    alt={`${productGroup.style_name} view ${index + 1}`}
                    className="thumbnail-image"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/100x100/1a1a1a/78BE20?text=' +
                        encodeURIComponent(productGroup.style_name?.slice(0, 2) || 'P');
                    }}
                  />
                </button>
              ))}
            </div>
            <div className="main-image" onClick={() => {
              setImageModalIndex(selectedImageIndex);
              setShowImageModal(true);
            }}>
              <img
                src={currentImages[selectedImageIndex] || 'https://via.placeholder.com/600x600/1a1a1a/78BE20?text=' +
                  encodeURIComponent(productGroup.style_name?.slice(0, 2) || 'P')}
                alt={productGroup.style_name}
                className="main-product-image"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/600x600/1a1a1a/78BE20?text=' +
                    encodeURIComponent(productGroup.style_name?.slice(0, 2) || 'P');
                }}
              />
              {logoOverlay && (
                <img
                  src={logoOverlay.src}
                  alt="Applied logo"
                  className="logo-overlay-img"
                  style={{
                    left: `${logoOverlay.x}%`,
                    top: `${logoOverlay.y}%`,
                    width: `${logoOverlay.sizePct}%`,
                    opacity: logoOverlay.opacity,
                    transform: `translate(-50%, -50%) rotate(${logoOverlay.rotation}deg)`
                  }}
                />
              )}
              {currentVariant?.sustainable_organic === 'Yes' && (
                <div className="sustainability-badge">
                  <span>♻️ Sustainable</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              <p className="product-brand">{productGroup.brand}</p>
              <h1 className="product-title">{productGroup.style_name}</h1>
              <p className="product-sku">SKU: {currentVariant?.sku_code}</p>
            </div>

            <div className="product-price">
              {formatPrice(productGroup.price_range)}
            </div>

            {/* Color Selection */}
            <div className="product-options">
              <div className="option-group">
                <label className="option-label">
                  Color: <span className="selected-option">{productGroup.colors[selectedColor]?.name}</span>
                </label>
                <div className="color-swatches">
                  {productGroup.colors.map((color, index) => (
                    <button
                      key={color.code}
                      className={`color-swatch ${selectedColor === index ? 'active' : ''}`}
                      style={{ backgroundColor: color.rgb }}
                      onClick={() => {
                        setSelectedColor(index);
                        setSelectedSize('');
                        setSelectedImageIndex(0);
                      }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              {availableSizes.length > 0 && (
                <div className="option-group">
                  <label className="option-label">Size:</label>
                  <div className="size-options">
                    {availableSizes.map(size => (
                      <button
                        key={size.code}
                        className={`size-option ${selectedSize === size.code ? 'active' : ''}`}
                        onClick={() => setSelectedSize(size.code)}
                      >
                        {size.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="option-group">
                <label className="option-label">Quantity:</label>
                <div className="quantity-selector">
                  <button 
                    className="quantity-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="product-actions">
              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={availableSizes.length > 0 && !selectedSize}
              >
                Add to Cart
              </button>
              <div style={{ height: 12 }} />
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  className="try-logo-btn"
                  onClick={() => setShowLogoModal(true)}
                >
                  Try your logo on this
                </button>
                {logoOverlay && (
                  <button
                    className="clear-btn"
                    onClick={() => setLogoOverlay(null)}
                  >
                    Remove logo
                  </button>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="product-details-info">
              {currentVariant?.specification && (
                <div className="detail-section">
                  <h3>Description</h3>
                  <p>{currentVariant.specification}</p>
                </div>
              )}

              {currentVariant?.fabric && (
                <div className="detail-section">
                  <h3>Fabric</h3>
                  <p>{currentVariant.fabric}</p>
                </div>
              )}

              {currentVariant?.accreditations && (
                <div className="detail-section">
                  <h3>Accreditations</h3>
                  <p>{currentVariant.accreditations}</p>
                </div>
              )}

              <div className="detail-section">
                <h3>Product Information</h3>
                <ul>
                  <li><strong>Brand:</strong> {productGroup.brand}</li>
                  <li><strong>Type:</strong> {currentVariant?.product_type}</li>
                  <li><strong>Gender:</strong> {currentVariant?.gender}</li>
                  {currentVariant?.age_group && (
                    <li><strong>Age Group:</strong> {currentVariant.age_group}</li>
                  )}
                  <li><strong>Size Range:</strong> {productGroup.size_range}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showLogoModal && (
        <LogoCustomizerModal
          isOpen={showLogoModal}
          onClose={() => setShowLogoModal(false)}
          onApply={(cfg, selectedColorIndex) => {
            if (
              typeof selectedColorIndex === 'number' &&
              selectedColorIndex >= 0 &&
              selectedColorIndex < productGroup.colors.length
            ) {
              setSelectedColor(selectedColorIndex);
              setSelectedImageIndex(0);
            }
            handleApplyLogo(cfg);
          }}
          baseImageUrl={currentImages[selectedImageIndex]}
          productColors={productGroup.colors}
          initialColorIndex={selectedColor}
          initialConfig={logoOverlay ?? undefined}
        />
      )}

      {/* Image Modal */}
      <ImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        images={currentImages}
        initialIndex={imageModalIndex}
        alt={productGroup.style_name}
      />
    </div>
  );
};

export default ProductDetails;
