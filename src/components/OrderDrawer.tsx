import React, { useState, useRef, useEffect } from 'react';
import { Minus, Plus, X, ShoppingBag, Sparkles, ChevronLeft, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart, cartUtils } from '../contexts/CartContext';
import { Button } from './ui/button';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import ClothingOrderWizard from './clothing/ClothingOrderWizard';
import ClothingLogoUploader from './clothing/ClothingLogoUploader';
import ClothingHelpRequestForm from './clothing/ClothingHelpRequestForm';
import ClothingConsultationBooker from './clothing/ClothingConsultationBooker';
import ClothingHowItWorks from './clothing/ClothingHowItWorks';

// Design system colors
const colors = {
  dark: '#183028',
  darkLight: '#234a3a',
  accent: '#64a70b',
  accentHover: '#578f09',
  neutral: '#c1c6c8',
  neutralLight: '#e8eaeb',
  white: '#ffffff',
  textDark: '#333333',
  textMuted: '#666666',
};

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

type QuoteStep = 'cart' | 'path-selector' | 'upload' | 'help' | 'consult' | 'success' | 'how-it-works';

const OrderDrawer: React.FC<OrderDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    subtotal,
    tax,
    shipping,
    total,
  } = useCart();
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [quoteStep, setQuoteStep] = useState<QuoteStep>('cart');
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Reset quote step when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setQuoteStep('cart');
      setShowQuoteModal(false);
    }
  }, [isOpen]);

  const handleBrowseProducts = () => {
    onClose();
    navigate('/clothing');
  };

  const handleStartOrder = () => {
    if (isMobile) {
      // On mobile, transition the sheet to show the path selector
      setQuoteStep('path-selector');
    } else {
      // On desktop, show modal and close drawer
      setShowQuoteModal(true);
      onClose();
    }
  };

  // Handle drag to dismiss (mobile)
  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  // Get first cart item for quote flow context
  const firstCartItem = cart[0];

  // Render quote flow content for mobile sheet
  const renderMobileQuoteContent = () => {
    switch (quoteStep) {
      case 'how-it-works':
        return (
          <div className="px-4 py-3">
            <button
              onClick={() => setQuoteStep('path-selector')}
              className="mb-3 text-white/70 flex items-center gap-1.5 text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <ClothingHowItWorks
              isOpen={true}
              onClose={() => setQuoteStep('path-selector')}
              onStartOrder={() => setQuoteStep('path-selector')}
            />
          </div>
        );
      case 'path-selector':
        return (
          <div className="px-4 py-3">
            <button
              onClick={() => setQuoteStep('cart')}
              className="mb-3 text-white/70 flex items-center gap-1.5 text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Order
            </button>
            <ClothingOrderWizard
              productName={cart.length > 1 ? `${cart.length} items in your order` : firstCartItem?.name || 'Your Order'}
              productImage={firstCartItem?.image}
              productColors={[]}
              initialColorIndex={0}
              onSelectPath={(path) => {
                if (path === 'upload') setQuoteStep('upload');
                else if (path === 'help') setQuoteStep('help');
                else if (path === 'consult') setQuoteStep('consult');
              }}
              isMobile={true}
            />
            <button
              onClick={() => setQuoteStep('how-it-works')}
              className="w-full mt-4 py-2 rounded-lg text-white/80 font-medium text-sm border border-white/20 flex items-center justify-center gap-2"
            >
              <Info className="w-4 h-4" />
              How does it work?
            </button>
          </div>
        );
      case 'upload':
        return (
          <div className="px-4 py-3">
            <ClothingLogoUploader
              productTitle={cart.length > 1 ? `${cart.length} items` : firstCartItem?.name || 'Your Order'}
              productImage={firstCartItem?.image}
              onBack={() => setQuoteStep('path-selector')}
              onComplete={() => setQuoteStep('success')}
              isMobile={true}
            />
          </div>
        );
      case 'help':
        return (
          <div className="px-4 py-3">
            <ClothingHelpRequestForm
              productTitle={cart.length > 1 ? `${cart.length} items` : firstCartItem?.name || 'Your Order'}
              onBack={() => setQuoteStep('path-selector')}
              onComplete={() => setQuoteStep('success')}
              isMobile={true}
            />
          </div>
        );
      case 'consult':
        return (
          <div className="px-4 py-3">
            <ClothingConsultationBooker
              productName={cart.length > 1 ? `${cart.length} items` : firstCartItem?.name || 'Your Order'}
              onBack={() => setQuoteStep('path-selector')}
              onComplete={() => setQuoteStep('success')}
              isMobile={true}
            />
          </div>
        );
      case 'success':
        return (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Enquiry Submitted!</h3>
            <p className="text-white/70 text-sm mb-6">
              We'll be in touch within 24 hours to discuss your order.
            </p>
            <button
              onClick={() => {
                setQuoteStep('cart');
                onClose();
              }}
              className="px-6 py-3 rounded-lg text-white font-semibold"
              style={{ backgroundColor: colors.accent }}
            >
              Continue Browsing
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen && !showQuoteModal) return null;

  // Desktop Quote Modal (separate from drawer)
  if (showQuoteModal && !isMobile) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/70 z-50 transition-opacity"
          onClick={() => setShowQuoteModal(false)}
        />
        {/* Modal */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
            style={{ backgroundColor: colors.dark }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowQuoteModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>

            {/* Modal Content */}
            <div className="p-6">
              {quoteStep === 'cart' || quoteStep === 'path-selector' ? (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Start Your Order</h2>
                    <p className="text-white/60">
                      {cart.length} {cart.length === 1 ? 'item' : 'items'} in your order
                    </p>
                  </div>
                  <ClothingOrderWizard
                    productName={cart.length > 1 ? `${cart.length} items in your order` : firstCartItem?.name || 'Your Order'}
                    productImage={firstCartItem?.image}
                    productColors={[]}
                    initialColorIndex={0}
                    onSelectPath={(path) => {
                      if (path === 'upload') setQuoteStep('upload');
                      else if (path === 'help') setQuoteStep('help');
                      else if (path === 'consult') setQuoteStep('consult');
                    }}
                    isMobile={false}
                  />
                </>
              ) : quoteStep === 'upload' ? (
                <ClothingLogoUploader
                  productTitle={cart.length > 1 ? `${cart.length} items` : firstCartItem?.name || 'Your Order'}
                  productImage={firstCartItem?.image}
                  onBack={() => setQuoteStep('path-selector')}
                  onComplete={() => setQuoteStep('success')}
                  isMobile={false}
                />
              ) : quoteStep === 'help' ? (
                <ClothingHelpRequestForm
                  productTitle={cart.length > 1 ? `${cart.length} items` : firstCartItem?.name || 'Your Order'}
                  onBack={() => setQuoteStep('path-selector')}
                  onComplete={() => setQuoteStep('success')}
                  isMobile={false}
                />
              ) : quoteStep === 'consult' ? (
                <ClothingConsultationBooker
                  productName={cart.length > 1 ? `${cart.length} items` : firstCartItem?.name || 'Your Order'}
                  onBack={() => setQuoteStep('path-selector')}
                  onComplete={() => setQuoteStep('success')}
                  isMobile={false}
                />
              ) : quoteStep === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Enquiry Submitted!</h3>
                  <p className="text-white/70 text-sm mb-6">
                    We'll be in touch within 24 hours to discuss your order.
                  </p>
                  <button
                    onClick={() => {
                      setQuoteStep('cart');
                      setShowQuoteModal(false);
                    }}
                    className="px-6 py-3 rounded-lg text-white font-semibold"
                    style={{ backgroundColor: colors.accent }}
                  >
                    Continue Browsing
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!isOpen) return null;

  // Mobile bottom sheet design
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40"
              onClick={onClose}
            />

            {/* Bottom Sheet */}
            <motion.div
              ref={sheetRef}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              drag={quoteStep === 'cart' ? 'y' : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={handleDragEnd}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden"
              style={{
                backgroundColor: colors.dark,
                maxHeight: '95vh',
                height: quoteStep !== 'cart' ? '95vh' : 'auto',
              }}
            >
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-white/30" />
              </div>

              {quoteStep !== 'cart' ? (
                // Quote flow content
                <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(95vh - 40px)' }}>
                  {renderMobileQuoteContent()}
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="px-5 pb-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ShoppingBag className="w-6 h-6" style={{ color: colors.accent }} />
                        <h2 className="text-xl font-bold text-white">
                          Your Order
                        </h2>
                        {cart.length > 0 && (
                          <span className="text-sm font-normal text-white/60">
                            ({cart.length} {cart.length === 1 ? 'item' : 'items'})
                          </span>
                        )}
                      </div>
                      <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-white/60" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto px-5 py-4" style={{ maxHeight: 'calc(90vh - 200px)' }}>
                    {cart.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <ShoppingBag className="w-16 h-16 text-white/30 mb-4" />
                        <p className="text-lg font-medium text-white mb-2">
                          You have not yet started an order
                        </p>
                        <p className="text-sm text-white/60 mb-6">
                          Browse our products to add them to your order
                        </p>
                        <button
                          onClick={handleBrowseProducts}
                          className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all"
                          style={{ backgroundColor: colors.accent }}
                        >
                          Browse Products
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {cart.map((item) => (
                          <CartItemCard
                            key={item.id}
                            item={item}
                            onRemove={() => removeFromCart(item.id)}
                            onIncrement={() => incrementQuantity(item.id)}
                            onDecrement={() => decrementQuantity(item.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {cart.length > 0 && (
                    <div className="px-5 py-4 border-t border-white/10" style={{ backgroundColor: colors.dark }}>
                      {/* Totals */}
                      <div className="space-y-1.5 text-sm mb-4">
                        <div className="flex justify-between text-white/70">
                          <span>Subtotal</span>
                          <span>{cartUtils.formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-white/70">
                          <span>VAT (20%)</span>
                          <span>{cartUtils.formatPrice(tax)}</span>
                        </div>
                        <div className="flex justify-between text-white/70">
                          <span>Shipping</span>
                          <span>{shipping === 0 ? 'FREE' : cartUtils.formatPrice(shipping)}</span>
                        </div>
                        <div className="border-t border-white/10 pt-2 mt-2" />
                        <div className="flex justify-between text-lg font-bold text-white">
                          <span>Total</span>
                          <span>{cartUtils.formatPrice(total)}</span>
                        </div>
                      </div>

                      {/* CTAs */}
                      <div className="space-y-2">
                        <button
                          onClick={handleStartOrder}
                          className="w-full py-3 rounded-lg font-semibold text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                          style={{ backgroundColor: colors.accent }}
                        >
                          <Sparkles className="w-4 h-4" />
                          Start Order
                        </button>
                        <button
                          onClick={handleBrowseProducts}
                          className="w-full py-2.5 rounded-lg font-medium text-white/80 border border-white/20 transition-all active:scale-[0.98]"
                        >
                          Add More Products
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop drawer design
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full sm:max-w-lg bg-gradient-to-br from-[#1a1a1a] to-[#252525] border-l border-gray-800 z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6" style={{ color: '#6da71d' }} />
              <h2 className="text-2xl font-bold text-white">
                Your Order
              </h2>
              {cart.length > 0 && (
                <span className="text-sm font-normal text-gray-400">
                  ({cart.length} {cart.length === 1 ? 'item' : 'items'})
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Cart Items - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-600 mb-4" />
              <p className="text-lg font-medium text-gray-300 mb-2">
                You have not yet started an order
              </p>
              <p className="text-sm text-gray-400 mb-6">
                Browse our products to add them to your order
              </p>
              <Button
                onClick={handleBrowseProducts}
                className="text-white font-semibold"
                style={{ background: '#6da71d' }}
              >
                Browse Products
              </Button>
            </div>
          ) : (
            cart.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onRemove={() => removeFromCart(item.id)}
                onIncrement={() => incrementQuantity(item.id)}
                onDecrement={() => decrementQuantity(item.id)}
              />
            ))
          )}
        </div>

        {/* Footer with totals and CTAs */}
        {cart.length > 0 && (
          <div className="border-t border-gray-800 p-6 space-y-4 bg-[#1a1a1a]">
            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>{cartUtils.formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>VAT (20%)</span>
                <span>{cartUtils.formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : cartUtils.formatPrice(shipping)}</span>
              </div>
              {shipping > 0 && subtotal < 50 && (
                <p className="text-xs" style={{ color: '#6da71d' }}>
                  Add {cartUtils.formatPrice(50 - subtotal)} more for free shipping!
                </p>
              )}
              <div className="border-t border-gray-800 pt-2 mt-2"></div>
              <div className="flex justify-between text-lg font-bold text-white">
                <span>Total</span>
                <span>{cartUtils.formatPrice(total)}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2">
              <Button
                onClick={handleStartOrder}
                className="w-full font-semibold shadow-lg text-white"
                style={{ background: '#6da71d' }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Start Order
              </Button>
              <Button
                onClick={handleBrowseProducts}
                variant="outline"
                className="w-full border-gray-600 text-white hover:bg-gray-800"
              >
                Add More Products
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

interface CartItemCardProps {
  item: {
    id: string;
    name: string;
    brand: string;
    price: number;
    quantity: number;
    image: string;
    selectedColor?: string;
    selectedSize?: string;
  };
  onRemove: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item, onRemove, onIncrement, onDecrement }) => {
  return (
    <div className="flex gap-4 p-4 rounded-lg bg-[#252525] border border-gray-800 transition-all hover:border-gray-700">
      {/* Product Image */}
      <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-900 flex-shrink-0">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://via.placeholder.com/80x80/1a1a1a/6da71d?text=${encodeURIComponent(item.name.slice(0, 2))}`;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <ShoppingBag className="w-8 h-8" />
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2 mb-1">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-white text-sm truncate">
              {item.name}
            </h3>
            <p className="text-xs text-gray-400">
              {item.brand}
              {item.selectedColor && ` • ${item.selectedColor}`}
              {item.selectedSize && ` • ${item.selectedSize}`}
            </p>
          </div>
          <button
            onClick={onRemove}
            className="p-1 hover:bg-red-900/20 rounded transition-colors group flex-shrink-0"
            aria-label="Remove item"
          >
            <X className="w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors" />
          </button>
        </div>

        {/* Price and Quantity */}
        <div className="flex items-center justify-between mt-2">
          <span className="font-semibold text-white">
            {cartUtils.formatPrice(item.price)}
          </span>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-lg p-1">
            <button
              onClick={onDecrement}
              className="p-1 rounded transition-colors hover:bg-[rgba(109,167,29,0.2)]"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3 text-gray-300" />
            </button>
            <span className="w-8 text-center text-sm font-medium text-white">
              {item.quantity}
            </span>
            <button
              onClick={onIncrement}
              className="p-1 rounded transition-colors hover:bg-[rgba(109,167,29,0.2)]"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3 text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDrawer;
