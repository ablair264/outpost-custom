import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Check, ChevronRight } from 'lucide-react';
import { Product, ColorVariant } from '../lib/supabase';
import { supabase } from '../lib/supabase';
import { useCart, cartUtils } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { Button } from '../components/ui/button';
import LogoCustomizerModal, { LogoOverlayConfig } from '../components/LogoCustomizerModal';
import ImageModal from '../components/ImageModal';
import VinylLoader from '../components/VinylLoader';

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
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [logoOverlay, setLogoOverlay] = useState<LogoOverlayConfig | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'care'>('overview');
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageModalIndex, setImageModalIndex] = useState(0);

  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    if (!styleCode) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('product_data').select('*').eq('style_code', styleCode);

        if (error) throw error;
        if (!data || data.length === 0) {
          setError('Product not found');
          return;
        }

        const variants = data as Product[];
        const colors: ColorVariant[] = Array.from(new Set(variants.map(v => v.colour_code))).map(code => {
          const variant = variants.find(v => v.colour_code === code)!;
          const colorName = variant.colour_name.toLowerCase();
          let displayColor = variant.rgb;

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
            colour_code: code,
            colour_name: variant.colour_name,
            colour_image: variant.colour_image || variant.primary_product_image_url,
            rgb: displayColor,
            colour_shade: variant.colour_shade,
          };
        });

        const prices = variants.map(v => parseFloat(v.single_price)).filter(p => !isNaN(p));
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

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <VinylLoader size={250} />
      </div>
    );

  if (error || !productGroup)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-center">
        <div>
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    );

  const currentVariant =
    productGroup.variants.find(v => v.colour_code === productGroup.colors[selectedColor]?.colour_code) ||
    productGroup.variants[0];

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

  const galleryImages = productGroup.colors
    .map((_, idx) => {
      const src = getColorImage(idx) || currentVariant?.primary_product_image_url;
      return src ? { src, colorIndex: idx } : null;
    })
    .filter((img): img is { src: string; colorIndex: number } => Boolean(img));

  const modalImages = galleryImages.map(img => img.src);

  const logoModalColors = productGroup.colors.map(color => ({
    name: color.colour_name,
    rgb: color.rgb,
    image: color.colour_image,
    code: color.colour_code,
  }));

  const inCart = isInCart(productGroup.style_code);
  const inWishlist = isInWishlist(productGroup.style_code);

  const handleAddToCart = () => {
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

    addToCart(groupedProduct, quantity, productGroup.colors[selectedColor]?.colour_name, selectedSize);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

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

  const handleBackNavigation = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const breadcrumbs = [
    { label: 'Home', onClick: () => navigate('/') },
    { label: 'Products', onClick: () => navigate('/products') },
    { label: productGroup.style_name },
  ];

  return (
    <div className="min-h-screen bg-black text-white animate-fadeIn">
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-black/50 backdrop-blur-lg flex items-center justify-between p-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/70 hover:text-white">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <span className="font-semibold tracking-wide">{productGroup.brand}</span>
      </div>

      {/* Main Content */}
      <main className="pt-20 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div className="lg:col-span-2 w-full flex flex-wrap items-center justify-between gap-4 bg-white/5 rounded-2xl px-4 py-3 border border-white/10">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider font-semibold text-white/60">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={`${crumb.label}-${index}`}>
                {crumb.onClick ? (
                  <button
                    onClick={crumb.onClick}
                    className="hover:text-white transition text-left"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className="text-white">{crumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 && <ChevronRight size={14} className="text-white/40" />}
              </React.Fragment>
            ))}
          </div>

          <button
            onClick={handleBackNavigation}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-sm font-semibold text-white hover:bg-white/10 transition"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        {/* Image Section */}
        <section className="space-y-6 animate-fadeUp">
          <div className="relative rounded-2xl overflow-hidden aspect-square bg-neutral-900">
            {mainImage ? (
              <img
                src={mainImage}
                alt={productGroup.style_name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/60">No image</div>
            )}
            {logoOverlay && (
              <img
                src={logoOverlay.src}
                alt="Logo overlay"
                className="absolute transition-all duration-300"
                style={{
                  left: `${logoOverlay.x}%`,
                  top: `${logoOverlay.y}%`,
                  width: `${logoOverlay.sizePct}%`,
                  opacity: logoOverlay.opacity,
                  transform: `translate(-50%, -50%) rotate(${logoOverlay.rotation}deg)`,
                }}
              />
            )}
          </div>

          {/* Gallery */}
          {galleryImages.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {galleryImages.map((img, i) => (
                <button
                  key={`${img.src}-${i}`}
                  onClick={() => setSelectedColor(img.colorIndex)}
                  className={`aspect-square rounded-xl overflow-hidden ring-offset-2 transition-all ${
                    selectedColor === img.colorIndex
                      ? 'ring-4 ring-[#6da71d]'
                      : 'hover:ring-2 hover:ring-white/50'
                  }`}
                >
                  <img src={img.src} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Info Section */}
        <section className="space-y-6 animate-fadeUp delay-200">
          <h1 className="text-4xl lg:text-5xl font-bold">{productGroup.style_name}</h1>

          {/* Price */}
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-[#6da71d]">
              {cartUtils.formatPrice(productGroup.price_range?.min ?? 0)}
            </span>
            {productGroup.price_range?.max !== productGroup.price_range?.min && (
              <span className="text-lg text-white/70">
                – {cartUtils.formatPrice(productGroup.price_range?.max ?? 0)}
              </span>
            )}
          </div>

          {/* Color Selection */}
          <div>
            <p className="text-sm mb-2">
              Color: <span className="text-white/70">{productGroup.colors[selectedColor]?.colour_name}</span>
            </p>
            <div className="flex flex-wrap gap-3">
              {productGroup.colors.map((c, i) => (
                <button
                  key={c.colour_code}
                  onClick={() => setSelectedColor(i)}
                  className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    selectedColor === i ? 'border-[#6da71d] scale-110' : 'border-white/30'
                  }`}
                  style={{ backgroundColor: c.rgb }}
                  title={c.colour_name}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          {availableSizes.length > 0 && (
            <div>
              <p className="text-sm mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map(s => (
                  <button
                    key={s.code}
                    onClick={() => setSelectedSize(s.code)}
                    className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-all ${
                      selectedSize === s.code
                        ? 'bg-[#6da71d] border-[#6da71d]'
                        : 'border-white/30 hover:bg-white/10'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Cart */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 bg-white/10 rounded-lg hover:bg-white/20"
              >
                -
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 bg-white/10 rounded-lg hover:bg-white/20"
              >
                +
              </button>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={availableSizes.length > 0 && !selectedSize}
              className="w-full h-12 text-base font-semibold bg-[#6da71d] hover:bg-[#5b8d1b] rounded-xl transition-all"
            >
              {addedToCart || inCart ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  {addedToCart ? 'Added to Cart' : 'In Cart'}
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>

          {/* Wishlist + Logo */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowLogoModal(true)}
              className="h-10 rounded-lg border border-white/30 hover:bg-white/10 transition"
            >
              Try Logo
            </button>
            <button
              onClick={handleWishlistToggle}
              className="h-10 rounded-lg border border-white/30 hover:bg-white/10 flex items-center justify-center transition"
            >
              <Heart className={`w-4 h-4 mr-1 ${inWishlist ? 'fill-[#6da71d]' : ''}`} />
              {inWishlist ? 'Saved' : 'Save'}
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-6">
            <div className="flex gap-2 bg-white/10 p-1 rounded-lg">
              {['overview', 'details', 'care'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex-1 px-4 py-2 rounded-md text-sm transition-all ${
                    activeTab === tab
                      ? 'bg-[#6da71d]/30 text-white'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="mt-4 bg-white/5 rounded-lg p-4 transition-all duration-300">
              {activeTab === 'overview' && (
                <p className="text-white/80 leading-relaxed">
                  {currentVariant?.retail_description || currentVariant?.specification}
                </p>
              )}
              {activeTab === 'details' && (
                <div className="space-y-2 text-white/80">
                  <div className="flex justify-between">
                    <span>Brand</span>
                    <span>{productGroup.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type</span>
                    <span>{currentVariant?.product_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gender</span>
                    <span>{currentVariant?.gender}</span>
                  </div>
                </div>
              )}
              {activeTab === 'care' && (
                <ul className="list-disc list-inside text-white/80 space-y-1">
                  <li>Follow care label instructions</li>
                  <li>Wash similar colors together</li>
                  <li>Store in a cool, dry place</li>
                </ul>
              )}
            </div>
          </div>
        </section>
      </main>

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
    </div>
  );
};

export default ProductDetailsNew;
