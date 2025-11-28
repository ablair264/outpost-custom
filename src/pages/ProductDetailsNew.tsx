import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Check, ChevronRight } from 'lucide-react';
import { Product } from '../lib/supabase';
import { supabase } from '../lib/supabase';
import { useCart, cartUtils } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { Button } from '../components/ui/button';
import LogoCustomizerModal, { LogoOverlayConfig } from '../components/LogoCustomizerModal';

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

const ProductDetailsNew: React.FC = () => {
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
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'care'>('overview');

  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

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

        const variants = data as Product[];
        const colors = Array.from(new Set(variants.map(v => v.colour_code)))
          .map(code => {
            const variant = variants.find(v => v.colour_code === code)!;
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
            else if (!displayColor || displayColor === 'Not available') displayColor = '#cccccc';

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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !productGroup) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-400 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
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

  const inCart = isInCart(productGroup.style_code);
  const inWishlist = isInWishlist(productGroup.style_code);

  const handleAddToCart = () => {
    const productData = {
      style_code: productGroup.style_code,
      style_name: productGroup.style_name,
      brand: productGroup.brand,
      product_type: currentVariant.product_type,
      gender: currentVariant.gender,
      categorisation: currentVariant.categorisation,
      primary_product_image_url: currentImages[selectedImageIndex],
      price_range: productGroup.price_range || { min: 0, max: 0 },
      size_range: productGroup.size_range,
      colors: productGroup.colors.map(c => ({
        colour_code: c.code,
        colour_name: c.name,
        colour_image: c.image,
        rgb: c.rgb,
      })),
      sizes: availableSizes.map(s => s.name),
      variants: productGroup.variants,
    };

    addToCart(productData, quantity, productGroup.colors[selectedColor]?.name, selectedSize);
    setAddedToCart(true);
    setQuantity(1);

    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  const handleWishlistToggle = () => {
    const productData = {
      style_code: productGroup.style_code,
      style_name: productGroup.style_name,
      brand: productGroup.brand,
      product_type: currentVariant.product_type,
      gender: currentVariant.gender,
      categorisation: currentVariant.categorisation,
      primary_product_image_url: currentImages[selectedImageIndex],
      price_range: productGroup.price_range || { min: 0, max: 0 },
      size_range: productGroup.size_range,
      colors: productGroup.colors.map(c => ({
        colour_code: c.code,
        colour_name: c.name,
        colour_image: c.image,
        rgb: c.rgb,
      })),
      sizes: availableSizes.map(s => s.name),
      variants: productGroup.variants,
    };
    toggleWishlist(productData);
  };

  const handleApplyLogo = (config: LogoOverlayConfig) => {
    setLogoOverlay(config);
    setShowLogoModal(false);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Full-Page Image */}
      <div className="relative min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={currentImages[selectedImageIndex]}
            alt={productGroup.style_name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://via.placeholder.com/1920x1080/1a1a1a/6da71d?text=${encodeURIComponent(productGroup.style_name.slice(0, 2))}`;
            }}
          />
          {/* Logo Overlay */}
          {logoOverlay && (
            <img
              src={logoOverlay.src}
              alt="Applied logo"
              className="absolute"
              style={{
                left: `${logoOverlay.x}%`,
                top: `${logoOverlay.y}%`,
                width: `${logoOverlay.sizePct}%`,
                opacity: logoOverlay.opacity,
                transform: `translate(-50%, -50%) rotate(${logoOverlay.rotation}deg)`
              }}
            />
          )}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black" />
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-20 flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-sm px-3 py-2 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Product Information - Overlaid at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="container mx-auto px-4 md:px-8 lg:px-16 pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Product Info */}
              <div className="lg:col-span-2 space-y-4">
                {/* Brand Badge */}
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
                  <span className="text-white text-sm font-semibold">{productGroup.brand}</span>
                  {currentVariant?.sustainable_organic === 'Yes' && (
                    <>
                      <span className="text-white/50">•</span>
                      <span className="text-white text-sm">♻️ Sustainable</span>
                    </>
                  )}
                </div>

                {/* Product Name */}
                <h1 className="text-5xl lg:text-6xl font-bold text-white">
                  {productGroup.style_name}
                </h1>

                {/* Pricing */}
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-bold text-white">
                    {productGroup.price_range && cartUtils.formatPrice(productGroup.price_range.min)}
                  </span>
                  {productGroup.price_range && productGroup.price_range.min !== productGroup.price_range.max && (
                    <span className="text-2xl text-white/70">
                      - {cartUtils.formatPrice(productGroup.price_range.max)}
                    </span>
                  )}
                </div>

                {/* Image Gallery */}
                {currentImages.length > 1 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-white">Gallery</h3>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {currentImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`aspect-square rounded-xl overflow-hidden transition-all ${selectedImageIndex === index
                            ? 'ring-4 ring-[#6da71d] ring-offset-4 ring-offset-black'
                            : 'hover:opacity-75'
                            }`}
                        >
                          <img
                            src={image}
                            alt={`${productGroup.style_name} ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = `https://via.placeholder.com/400x400/1a1a1a/6da71d?text=${index + 1}`;
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tabs */}
                <div className="space-y-4">
                  <div className="flex gap-2 bg-white/10 backdrop-blur-md rounded-lg p-1">
                    {['overview', 'details', 'care'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab
                          ? 'bg-white/20 text-white'
                          : 'text-white/70 hover:text-white'
                          }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="bg-white/5 backdrop-blur-md rounded-lg p-6">
                    {activeTab === 'overview' && (
                      <div className="space-y-4">
                        <p className="text-white/90 text-lg leading-relaxed">
                          {currentVariant?.retail_description || currentVariant?.specification}
                        </p>
                        <ul className="space-y-3 text-white/80">
                          <li className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: '#6da71d' }} />
                            Premium materials and construction
                          </li>
                          {currentVariant?.fabric && (
                            <li className="flex items-start gap-3">
                              <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: '#6da71d' }} />
                              {currentVariant.fabric}
                            </li>
                          )}
                          {currentVariant?.accreditations && (
                            <li className="flex items-start gap-3">
                              <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: '#6da71d' }} />
                              Accredited: {currentVariant.accreditations}
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                    {activeTab === 'details' && (
                      <div className="space-y-3 text-white/80">
                        <div className="flex justify-between py-2 border-b border-white/10">
                          <span>Brand</span>
                          <span className="font-semibold text-white">{productGroup.brand}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-white/10">
                          <span>Type</span>
                          <span className="font-semibold text-white">{currentVariant?.product_type}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-white/10">
                          <span>Gender</span>
                          <span className="font-semibold text-white">{currentVariant?.gender}</span>
                        </div>
                        {currentVariant?.age_group && (
                          <div className="flex justify-between py-2 border-b border-white/10">
                            <span>Age Group</span>
                            <span className="font-semibold text-white">{currentVariant.age_group}</span>
                          </div>
                        )}
                      </div>
                    )}
                    {activeTab === 'care' && (
                      <div className="space-y-3 text-white/80">
                        <p>To maintain the quality of your product:</p>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: '#6da71d' }} />
                            Follow care label instructions
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: '#6da71d' }} />
                            Wash similar colors together
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: '#6da71d' }} />
                            Store in a cool, dry place
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Select Options */}
              <div className="lg:col-span-1">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 space-y-4">
                  <h3 className="text-lg font-bold text-white">
                    Select Options
                  </h3>

                  {/* Color Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">
                      Color: <span className="text-white/70">{productGroup.colors[selectedColor]?.name}</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {productGroup.colors.filter(c => c.rgb).map((color, index) => (
                        <button
                          key={color.code}
                          className={`w-12 h-12 rounded-full border-2 transition-all ${selectedColor === index
                            ? 'border-white ring-2 ring-white/50 ring-offset-2 ring-offset-black scale-110'
                            : 'border-white/30 hover:border-white/60'
                            }`}
                          style={{ backgroundColor: color.rgb }}
                          onClick={() => {
                            const actualIndex = productGroup.colors.findIndex(c => c.code === color.code);
                            setSelectedColor(actualIndex);
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
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Size</label>
                      <div className="grid grid-cols-3 gap-2">
                        {availableSizes.map(size => (
                          <button
                            key={size.code}
                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${selectedSize === size.code
                              ? 'border-white bg-white/20 text-white'
                              : 'border-white/30 text-white/70 hover:bg-white/10'
                              }`}
                            onClick={() => setSelectedSize(size.code)}
                          >
                            {size.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white">Quantity</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-all"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center text-white font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-all"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4"></div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleAddToCart}
                      disabled={availableSizes.length > 0 && !selectedSize}
                      className={`w-full h-12 text-base font-semibold rounded-xl transition-all ${addedToCart
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : inCart
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'text-white'
                        }`}
                      style={{ background: addedToCart || inCart ? undefined : '#6da71d' }}
                    >
                      {addedToCart ? (
                        <>
                          <Check className="w-5 h-5 mr-2" />
                          Added to Cart!
                        </>
                      ) : inCart ? (
                        <>
                          <Check className="w-5 h-5 mr-2" />
                          In Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          Add to Cart
                        </>
                      )}
                    </Button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setShowLogoModal(true)}
                        className="w-full h-10 text-sm font-semibold rounded-xl border-2 border-white/30 bg-transparent text-white hover:bg-white/10 transition-all"
                      >
                        Try Your Logo
                      </button>
                      <button
                        onClick={handleWishlistToggle}
                        className="w-full h-10 text-sm font-semibold rounded-xl border-2 border-white/30 bg-transparent text-white hover:bg-white/10 transition-all flex items-center justify-center"
                      >
                        <Heart className={`w-4 h-4 mr-1 ${inWishlist ? 'fill-current' : ''}`} />
                        {inWishlist ? 'Saved' : 'Save'}
                      </button>
                    </div>

                    {logoOverlay && (
                      <button
                        onClick={() => setLogoOverlay(null)}
                        className="w-full h-10 text-sm font-semibold rounded-xl border-2 border-red-400/50 bg-transparent text-red-300 hover:bg-red-900/20 transition-all"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>

                  <div className="border-t border-white/10 pt-4"></div>

                  {/* Expandable Information */}
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-between py-3 text-white hover:opacity-80 transition-opacity">
                      <span className="font-medium text-sm">Shipping Information</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="border-t border-white/10"></div>
                    <button className="w-full flex items-center justify-between py-3 text-white hover:opacity-80 transition-opacity">
                      <span className="font-medium text-sm">Return Policy</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="border-t border-white/10"></div>
                    <button className="w-full flex items-center justify-between py-3 text-white hover:opacity-80 transition-opacity">
                      <span className="font-medium text-sm">Size Guide</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo Customizer Modal */}
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
    </div>
  );
};

export default ProductDetailsNew;
