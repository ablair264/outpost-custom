import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Move,
  Palette,
  AlertTriangle,
  Check,
  ChevronRight,
  SkipForward,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

// Theme colors
const colors = {
  dark: '#183028',
  darkLight: '#234a3a',
  accent: '#64a70b',
  accentHover: '#578f09',
  white: '#ffffff',
  textMuted: '#666666',
};

interface LogoPreviewCapture {
  cartItemId: string;
  productName: string;
  selectedColor: string;
  colorChanged: boolean;
  originalColor: string;
  logoPosition: { x: number; y: number; scale: number };
  previewImageUrl: string;
}

interface CartItemWithColors {
  id: string;
  name: string;
  brand: string;
  image: string;
  selectedColor?: string;
  styleCode: string;
  availableColors?: Array<{
    name: string;
    hex: string;
    image?: string;
  }>;
}

interface OrderLogoPreviewProps {
  logoUrl: string;
  onBack: () => void;
  onComplete: (captures: LogoPreviewCapture[]) => void;
  onSkip: () => void;
  isMobile?: boolean;
}

const OrderLogoPreview: React.FC<OrderLogoPreviewProps> = ({
  logoUrl,
  onBack,
  onComplete,
  onSkip,
  isMobile = false,
}) => {
  const { cart } = useCart();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // State
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [logoPosition, setLogoPosition] = useState({ x: 50, y: 35 }); // Percentage position
  const [logoScale, setLogoScale] = useState(20); // Percentage of container width
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [previewColor, setPreviewColor] = useState<string | null>(null);
  const [interactedItems, setInteractedItems] = useState<Set<string>>(new Set());
  const [captures, setCaptures] = useState<Map<string, LogoPreviewCapture>>(new Map());
  const [showColorWarning, setShowColorWarning] = useState(false);
  const [pendingProceed, setPendingProceed] = useState(false);

  // Sample colors for items (in reality, this would come from product data)
  const sampleColors = [
    { name: 'Black', hex: '#1a1a1a' },
    { name: 'Navy', hex: '#1e3a5f' },
    { name: 'White', hex: '#ffffff' },
    { name: 'Grey', hex: '#6b7280' },
    { name: 'Red', hex: '#dc2626' },
    { name: 'Green', hex: '#16a34a' },
  ];

  const cartItems: CartItemWithColors[] = cart.map(item => ({
    ...item,
    availableColors: sampleColors,
  }));

  const currentItem = cartItems[selectedItemIndex];
  const originalColor = currentItem?.selectedColor || 'Black';
  const currentColor = previewColor || originalColor;
  const hasColorChanged = previewColor !== null && previewColor !== originalColor;

  // Track interaction with current item
  useEffect(() => {
    if (currentItem) {
      setInteractedItems(prev => new Set([...prev, currentItem.id]));
    }
  }, [currentItem?.id]);

  // Reset preview color when switching items
  useEffect(() => {
    const item = cartItems[selectedItemIndex];
    if (item) {
      // Check if we have a saved capture for this item
      const savedCapture = captures.get(item.id);
      if (savedCapture) {
        setLogoPosition({ x: savedCapture.logoPosition.x, y: savedCapture.logoPosition.y });
        setLogoScale(savedCapture.logoPosition.scale);
        setPreviewColor(savedCapture.colorChanged ? savedCapture.selectedColor : null);
      } else {
        // Reset to defaults
        setLogoPosition({ x: 50, y: 35 });
        setLogoScale(20);
        setPreviewColor(null);
      }
    }
  }, [selectedItemIndex]);

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    setDragStart({
      x: clientX - (logoPosition.x / 100) * (containerRef.current?.clientWidth || 0),
      y: clientY - (logoPosition.y / 100) * (containerRef.current?.clientHeight || 0),
    });
  };

  // Handle drag move
  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging || !containerRef.current) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const container = containerRef.current;
    const newX = ((clientX - dragStart.x) / container.clientWidth) * 100;
    const newY = ((clientY - dragStart.y) / container.clientHeight) * 100;

    // Constrain to container bounds
    setLogoPosition({
      x: Math.max(10, Math.min(90, newX)),
      y: Math.max(10, Math.min(90, newY)),
    });
  }, [isDragging, dragStart]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global event listeners for drag
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('touchend', handleDragEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Capture preview image using canvas
  const capturePreview = async (): Promise<string> => {
    const canvas = canvasRef.current;
    if (!canvas || !currentItem) return '';

    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Set canvas size
    canvas.width = 400;
    canvas.height = 400;

    // Draw product image
    const productImg = new Image();
    productImg.crossOrigin = 'anonymous';

    return new Promise((resolve) => {
      productImg.onload = async () => {
        ctx.drawImage(productImg, 0, 0, canvas.width, canvas.height);

        // Draw logo
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';

        logoImg.onload = () => {
          const logoWidth = (logoScale / 100) * canvas.width;
          const logoHeight = logoWidth; // Assuming square logo
          const logoX = (logoPosition.x / 100) * canvas.width - logoWidth / 2;
          const logoY = (logoPosition.y / 100) * canvas.height - logoHeight / 2;

          ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);

          // Get data URL
          resolve(canvas.toDataURL('image/png'));
        };

        logoImg.onerror = () => resolve('');
        logoImg.src = logoUrl;
      };

      productImg.onerror = () => resolve('');

      // Use the color-specific image if available, otherwise use default
      const colorData = currentItem.availableColors?.find(c => c.name === currentColor);
      productImg.src = colorData?.image || currentItem.image;
    });
  };

  // Save current preview state
  const saveCurrentCapture = async () => {
    if (!currentItem) return;

    const previewImageUrl = await capturePreview();

    const capture: LogoPreviewCapture = {
      cartItemId: currentItem.id,
      productName: currentItem.name,
      selectedColor: currentColor,
      colorChanged: hasColorChanged,
      originalColor,
      logoPosition: { x: logoPosition.x, y: logoPosition.y, scale: logoScale },
      previewImageUrl,
    };

    setCaptures(prev => new Map(prev).set(currentItem.id, capture));
  };

  // Handle item selection
  const handleSelectItem = async (index: number) => {
    // Save current state before switching
    await saveCurrentCapture();
    setSelectedItemIndex(index);
  };

  // Handle proceed
  const handleProceed = async () => {
    // Check for any color changes
    const hasAnyColorChange = Array.from(captures.values()).some(c => c.colorChanged) || hasColorChanged;

    if (hasAnyColorChange) {
      setShowColorWarning(true);
      setPendingProceed(true);
      return;
    }

    await completeProceed();
  };

  const completeProceed = async () => {
    // Save final capture for current item
    await saveCurrentCapture();

    // Filter to only items that were interacted with
    const finalCaptures = Array.from(captures.values()).filter(c =>
      interactedItems.has(c.cartItemId)
    );

    onComplete(finalCaptures);
  };

  const handleColorWarningConfirm = async () => {
    setShowColorWarning(false);
    if (pendingProceed) {
      await completeProceed();
    }
  };

  const handleColorWarningCancel = () => {
    setShowColorWarning(false);
    setPendingProceed(false);
  };

  // Reset position
  const handleReset = () => {
    setLogoPosition({ x: 50, y: 35 });
    setLogoScale(20);
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/60">No items in your order to preview.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 text-white/80 hover:text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Hidden canvas for capturing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className={`flex items-center gap-2 ${isMobile ? 'mb-3' : 'mb-6'} text-white/60 hover:text-white transition-colors`}
      >
        <ArrowLeft className="w-4 h-4" />
        <span className={`neuzeit-font ${isMobile ? 'text-xs' : 'text-sm'}`}>Back</span>
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-center ${isMobile ? 'mb-4' : 'mb-6'}`}
      >
        <h2 className={`hearns-font ${isMobile ? 'text-xl' : 'text-2xl'} text-white mb-1`}>
          Preview Your Logo
        </h2>
        <p className={`neuzeit-light-font ${isMobile ? 'text-sm' : ''} text-white/60`}>
          Position your logo on each item
        </p>
      </motion.div>

      {/* Item Thumbnails Selector */}
      {cartItems.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`flex gap-2 overflow-x-auto pb-2 ${isMobile ? 'mb-3' : 'mb-4'}`}
        >
          {cartItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleSelectItem(index)}
              className={`flex-shrink-0 relative rounded-lg overflow-hidden transition-all ${
                selectedItemIndex === index
                  ? 'ring-2 ring-[#64a70b] scale-105'
                  : 'ring-1 ring-white/20 hover:ring-white/40'
              }`}
              style={{ width: isMobile ? 48 : 60, height: isMobile ? 48 : 60 }}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              {interactedItems.has(item.id) && captures.has(item.id) && (
                <div className="absolute bottom-0 right-0 p-0.5 bg-[#64a70b] rounded-tl">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </motion.div>
      )}

      {/* Preview Area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative rounded-xl overflow-hidden bg-white/10 ${isMobile ? 'mb-4' : 'mb-6'}`}
        style={{ aspectRatio: '1/1' }}
        ref={containerRef}
      >
        {/* Product Image */}
        <img
          src={currentItem?.image}
          alt={currentItem?.name}
          className="w-full h-full object-contain"
        />

        {/* Draggable Logo */}
        <div
          className={`absolute cursor-move transition-shadow ${isDragging ? 'shadow-2xl' : 'shadow-lg'}`}
          style={{
            left: `${logoPosition.x}%`,
            top: `${logoPosition.y}%`,
            transform: 'translate(-50%, -50%)',
            width: `${logoScale}%`,
          }}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <img
            src={logoUrl}
            alt="Your logo"
            className="w-full h-auto"
            draggable={false}
          />
          {/* Drag indicator */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 text-white/60 text-xs">
            <Move className="w-3 h-3" />
            <span className="neuzeit-font">Drag to position</span>
          </div>
        </div>

        {/* Color Changed Badge */}
        {hasColorChanged && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-amber-500/90 rounded-full flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-white" />
            <span className="text-xs text-white neuzeit-font">Color changed</span>
          </div>
        )}
      </motion.div>

      {/* Scale Controls */}
      <div className={`flex items-center justify-center gap-4 ${isMobile ? 'mb-4' : 'mb-6'}`}>
        <button
          onClick={() => setLogoScale(s => Math.max(10, s - 5))}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          title="Make smaller"
        >
          <ZoomOut className="w-4 h-4 text-white" />
        </button>

        <div className="flex items-center gap-2 text-white/60 text-sm">
          <span className="neuzeit-font">{logoScale}%</span>
        </div>

        <button
          onClick={() => setLogoScale(s => Math.min(50, s + 5))}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          title="Make larger"
        >
          <ZoomIn className="w-4 h-4 text-white" />
        </button>

        <button
          onClick={handleReset}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors ml-2"
          title="Reset position"
        >
          <RotateCcw className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Color Swatches */}
      <div className={`${isMobile ? 'mb-4' : 'mb-6'}`}>
        <div className="flex items-center gap-2 mb-2">
          <Palette className="w-4 h-4 text-white/60" />
          <span className={`neuzeit-font ${isMobile ? 'text-xs' : 'text-sm'} text-white/60`}>
            Preview on different colors
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {sampleColors.map((color) => (
            <button
              key={color.name}
              onClick={() => setPreviewColor(color.name === originalColor ? null : color.name)}
              className={`relative w-8 h-8 rounded-full transition-all ${
                currentColor === color.name
                  ? 'ring-2 ring-[#64a70b] ring-offset-2 ring-offset-[#183028] scale-110'
                  : 'ring-1 ring-white/20 hover:ring-white/40'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {currentColor === color.name && (
                <Check className={`w-4 h-4 absolute inset-0 m-auto ${
                  color.hex === '#ffffff' || color.hex === '#1a1a1a'
                    ? color.hex === '#ffffff' ? 'text-black' : 'text-white'
                    : 'text-white'
                }`} />
              )}
            </button>
          ))}
        </div>
        {hasColorChanged && (
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-amber-400 mt-2 neuzeit-font`}>
            Color changed from {originalColor} to {currentColor} (for preview only)
          </p>
        )}
      </div>

      {/* Item Info */}
      <div className={`p-3 rounded-lg bg-white/5 border border-white/10 ${isMobile ? 'mb-4' : 'mb-6'}`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-white flex-shrink-0">
            <img
              src={currentItem?.image}
              alt={currentItem?.name}
              className="w-full h-full object-contain p-1"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white text-sm font-medium truncate neuzeit-font">
              {currentItem?.name}
            </h4>
            <p className="text-white/60 text-xs neuzeit-light-font">
              {currentItem?.brand} • {currentColor}
            </p>
          </div>
          <div className="text-right">
            <span className="text-white/40 text-xs neuzeit-font">
              {selectedItemIndex + 1} of {cartItems.length}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onSkip}
          className={`flex-1 ${isMobile ? 'py-2.5' : 'py-3'} rounded-lg border border-white/20 text-white/80 font-medium transition-all hover:bg-white/5 flex items-center justify-center gap-2`}
        >
          <SkipForward className="w-4 h-4" />
          <span className="neuzeit-font">Skip Preview</span>
        </button>

        <button
          onClick={handleProceed}
          className={`flex-1 ${isMobile ? 'py-2.5' : 'py-3'} rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2`}
          style={{ backgroundColor: colors.accent }}
        >
          <span className="neuzeit-font">Continue</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Color Change Warning Modal */}
      <AnimatePresence>
        {showColorWarning && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50"
              onClick={handleColorWarningCancel}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className="w-full max-w-md rounded-xl p-6 shadow-2xl"
                style={{ backgroundColor: colors.dark }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white hearns-font">
                    Color Change Detected
                  </h3>
                </div>

                <p className="text-white/70 mb-4 neuzeit-light-font">
                  You've changed the color on some items for preview purposes.
                  Would you like to update your order to use the new colors?
                </p>

                <div className="bg-white/5 rounded-lg p-3 mb-6">
                  <p className="text-white/60 text-sm neuzeit-font">
                    Note: This is just for visualization. Your actual order
                    will keep the original colors unless you update them.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleColorWarningCancel}
                    className="flex-1 py-2.5 rounded-lg border border-white/20 text-white/80 font-medium transition-all hover:bg-white/5 neuzeit-font"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={handleColorWarningConfirm}
                    className="flex-1 py-2.5 rounded-lg font-semibold text-white transition-all neuzeit-font"
                    style={{ backgroundColor: colors.accent }}
                  >
                    Continue Anyway
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderLogoPreview;
