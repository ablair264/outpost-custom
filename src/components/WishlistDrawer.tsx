import { Heart, ShoppingBag, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { getGroupedProductsByType } from '../lib/supabase';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);

  // Load similar products when wishlist changes
  useEffect(() => {
    const loadSimilarProducts = async () => {
      if (wishlist.length === 0) {
        setSimilarProducts([]);
        return;
      }

      try {
        // Get categories from wishlist items
        const categories = Array.from(new Set(wishlist.map(item => item.productType)));

        // Fetch products from these categories (limit to first category for performance)
        if (categories[0]) {
          const products = await getGroupedProductsByType(categories[0]);

          // Filter out products already in wishlist and limit to 4
          const wishlistIds = wishlist.map(item => item.styleCode);
          const filtered = products
            .filter(product => !wishlistIds.includes(product.style_code))
            .slice(0, 4);

          setSimilarProducts(filtered);
        }
      } catch (error) {
        console.error('Error loading similar products:', error);
      }
    };

    if (isOpen) {
      loadSimilarProducts();
    }
  }, [wishlist, isOpen]);

  const handleAddToCart = (item: any) => {
    // For wishlist items, we need to convert them to the format addToCart expects
    const productData = {
      style_code: item.styleCode,
      style_name: item.name,
      brand: item.brand,
      price_range: { min: item.price, max: item.price },
      primary_product_image_url: item.image,
      product_type: item.productType,
      colors: [],
      sizes: [],
      variants: [],
      gender: '',
      categorisation: '',
      size_range: '',
    };
    addToCart(productData, 1);
  };

  const handleViewProduct = (styleCode: string) => {
    navigate(`/products/${styleCode}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full sm:max-w-xl bg-gradient-to-br from-[#1a1a1a] to-[#252525] border-l border-gray-800 z-50 overflow-y-auto shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6" style={{ color: '#6da71d' }} />
              <h2 className="text-2xl font-bold text-white">
                My Wishlist ({wishlist.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {wishlist.length === 0 ? (
            /* Empty Wishlist State */
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(109, 167, 29, 0.1)' }}
              >
                <Heart className="w-12 h-12" style={{ color: '#6da71d' }} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Your wishlist is empty</h3>
              <p className="text-gray-400 mb-6 max-w-sm">
                Save items you love to your wishlist and easily find them later!
              </p>
              <Button
                onClick={onClose}
                className="text-white font-semibold"
                style={{ background: '#6da71d' }}
              >
                Start Browsing
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Wishlist Items */}
              <div className="space-y-4">
                {wishlist.map((item) => (
                  <WishlistItemCard
                    key={item.id}
                    item={item}
                    onRemove={() => removeFromWishlist(item.styleCode)}
                    onAddToCart={() => handleAddToCart(item)}
                    onView={() => handleViewProduct(item.styleCode)}
                  />
                ))}
              </div>

              {/* Similar Products Section */}
              {similarProducts.length > 0 && (
                <>
                  <div className="border-t border-gray-800 pt-8">
                    <h3 className="text-lg font-bold text-white mb-4">
                      You Might Also Like
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      {similarProducts.map((product) => (
                        <SimilarProductCard
                          key={product.style_code}
                          product={product}
                          onView={() => handleViewProduct(product.style_code)}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

interface WishlistItemCardProps {
  item: {
    id: string;
    styleCode: string;
    name: string;
    brand: string;
    price: number;
    image: string;
    productType: string;
  };
  onRemove: () => void;
  onAddToCart: () => void;
  onView: () => void;
}

const WishlistItemCard: React.FC<WishlistItemCardProps> = ({ item, onRemove, onAddToCart, onView }) => {
  return (
    <div className="flex gap-4 p-4 rounded-xl bg-gradient-to-br from-[#252525] to-[#2a2a2a] border border-gray-800 transition-all hover:border-gray-700">
      {/* Product Image */}
      <button
        onClick={onView}
        className="w-24 h-24 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://via.placeholder.com/96x96/1a1a1a/6da71d?text=${encodeURIComponent(item.name.slice(0, 2))}`;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <ShoppingBag className="w-10 h-10" />
          </div>
        )}
      </button>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <button
            onClick={onView}
            className="text-left hover:opacity-80 transition-opacity"
          >
            <h4 className="text-base font-semibold text-white mb-1 truncate">
              {item.name}
            </h4>
          </button>
          <p className="text-xs text-gray-400 mb-2">
            {item.brand} • {item.productType}
          </p>
          <p className="text-lg font-bold text-white">
            £{item.price.toFixed(2)}
          </p>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Button
            onClick={onAddToCart}
            size="sm"
            className="flex-1 text-white h-8 text-xs font-semibold"
            style={{ background: '#6da71d' }}
          >
            <ShoppingBag className="w-3 h-3 mr-1" />
            Add to Cart
          </Button>
          <button
            onClick={onRemove}
            className="p-2 hover:bg-red-900/20 rounded-lg transition-colors group"
            aria-label="Remove from wishlist"
          >
            <X className="w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface SimilarProductCardProps {
  product: {
    style_code: string;
    style_name: string;
    brand: string;
    primary_product_image_url: string;
    price_range: { min: number; max: number };
  };
  onView: () => void;
}

const SimilarProductCard: React.FC<SimilarProductCardProps> = ({ product, onView }) => {
  return (
    <button
      onClick={onView}
      className="group relative rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-105"
    >
      {/* Product Image */}
      <div className="aspect-square bg-gray-900">
        <img
          src={product.primary_product_image_url}
          alt={product.style_name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = `https://via.placeholder.com/200x200/1a1a1a/6da71d?text=${encodeURIComponent(product.style_name.slice(0, 2))}`;
          }}
        />
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

      {/* Product Info */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-xs text-gray-200 mb-1 truncate">{product.brand}</p>
        <p className="text-sm font-semibold text-white truncate mb-1">{product.style_name}</p>
        <p className="text-base font-bold text-white">£{product.price_range.min.toFixed(2)}</p>
      </div>

      {/* Hover overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        style={{ background: 'rgba(109, 167, 29, 0.2)' }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: '#6da71d' }}
        >
          <Heart className="w-6 h-6 text-white" />
        </div>
      </div>
    </button>
  );
};

export default WishlistDrawer;
