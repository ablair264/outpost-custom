import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Eye, Palette, Calendar, ArrowRight, ArrowLeft, Check, Shirt, Move, FileImage, User, Mail, Phone, Hash, MessageSquare, RotateCw, AlertTriangle } from 'lucide-react';

export type WizardStep = 'has-logo' | 'upload-logo' | 'needs-help-options' | 'preview' | 'contact-form';

export interface LogoAnalysis {
  fileName: string;
  fileSize: number;
  fileSizeFormatted: string;
  format: string;
  width: number;
  height: number;
  hasTransparency: boolean;
  qualityTier: 'excellent' | 'good' | 'acceptable' | 'low';
  qualityNotes: string[];
}

export interface LogoPreviewData {
  logoSrc: string;
  x: number;
  y: number;
  size: number;
  colorIndex: number;
  analysis?: LogoAnalysis;
}

// For multi-item orders (cart)
export interface CartItemPreview {
  itemId: string;
  itemName: string;
  itemImage: string;
  logoX: number;
  logoY: number;
  logoSize: number;
  interacted: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  image: string;
  brand?: string;
  selectedColor?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  quantity: string;
  notes: string;
}

interface ClothingOrderWizardProps {
  onSelectPath: (path: 'upload' | 'help' | 'consult', logoData?: LogoPreviewData, contactData?: ContactFormData, cartItemPreviews?: CartItemPreview[]) => void;
  productName?: string;
  productImage?: string;
  productColors?: Array<{
    name: string;
    rgb?: string;
    image?: string;
    code?: string;
  }>;
  initialColorIndex?: number;
  isMobile?: boolean;
  // For multi-item orders from cart
  cartItems?: CartItem[];
}

// Theme colors - matching clothing pages
const clothingColors = {
  accent: '#64a70b',
  dark: '#183028',
  secondary: '#1e3a2f',
};

// Import source configurations
const importSources = [
  { image: '/images/canva.png', label: 'Canva', tip: 'Export as PNG for best quality' },
  { image: '/images/drive.png', label: 'Google Drive', tip: 'Import directly from your Drive' },
  { image: '/images/dropbox.webp', label: 'Dropbox', tip: 'Sync files from Dropbox' },
];

const ClothingOrderWizard: React.FC<ClothingOrderWizardProps> = ({
  onSelectPath,
  productName = 'workwear',
  productImage,
  productColors = [],
  initialColorIndex = 0,
  isMobile = false,
  cartItems = [],
}) => {
  const [step, setStep] = useState<WizardStep>('has-logo');

  // Logo state
  const [logoSrc, setLogoSrc] = useState<string>('');
  const [logoX, setLogoX] = useState(50);
  const [logoY, setLogoY] = useState(50);
  const [logoSize, setLogoSize] = useState(35);
  const [logoRotation, setLogoRotation] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(initialColorIndex);
  const [originalColorIndex] = useState(initialColorIndex);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [logoAnalysis, setLogoAnalysis] = useState<LogoAnalysis | null>(null);
  const [showColorWarning, setShowColorWarning] = useState(false);
  const [pendingColorIndex, setPendingColorIndex] = useState<number | null>(null);

  // Multi-item cart state
  const [selectedCartItemIndex, setSelectedCartItemIndex] = useState(0);
  const [cartItemPreviews, setCartItemPreviews] = useState<Map<string, CartItemPreview>>(new Map());
  const hasMultipleItems = cartItems.length > 1;

  // Contact form state
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    quantity: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<ContactFormData>>({});

  const wrapRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const draggingRef = useRef(false);
  const dragOffsetRef = useRef({ dxPct: 0, dyPct: 0 });
  const posPctRef = useRef({ x: logoX, y: logoY });

  // Get current product image - from cart items if multiple, or single product otherwise
  const currentCartItem = hasMultipleItems ? cartItems[selectedCartItemIndex] : null;
  const currentProductImage = currentCartItem?.image || productColors[selectedColorIndex]?.image || productImage;
  const currentProductName = currentCartItem?.name || productName;

  // Save current item's preview state before switching
  const saveCurrentItemPreview = () => {
    if (hasMultipleItems && currentCartItem) {
      setCartItemPreviews(prev => {
        const newMap = new Map(prev);
        newMap.set(currentCartItem.id, {
          itemId: currentCartItem.id,
          itemName: currentCartItem.name,
          itemImage: currentCartItem.image,
          logoX,
          logoY,
          logoSize,
          interacted: true,
        });
        return newMap;
      });
    }
  };

  // Handle cart item selection
  const handleSelectCartItem = (index: number) => {
    if (index === selectedCartItemIndex) return;

    // Save current item's state
    saveCurrentItemPreview();

    // Load new item's state if previously interacted
    const newItem = cartItems[index];
    const savedPreview = cartItemPreviews.get(newItem.id);

    if (savedPreview) {
      setLogoX(savedPreview.logoX);
      setLogoY(savedPreview.logoY);
      setLogoSize(savedPreview.logoSize);
    } else {
      // Reset to defaults for new item
      setLogoX(50);
      setLogoY(50);
      setLogoSize(35);
    }

    setSelectedCartItemIndex(index);
  };

  // Get all interacted cart item previews for submission
  const getCartItemPreviewsForSubmission = (): CartItemPreview[] => {
    // Save current item first
    if (hasMultipleItems && currentCartItem) {
      const currentPreview: CartItemPreview = {
        itemId: currentCartItem.id,
        itemName: currentCartItem.name,
        itemImage: currentCartItem.image,
        logoX,
        logoY,
        logoSize,
        interacted: true,
      };
      const allPreviews = new Map(cartItemPreviews);
      allPreviews.set(currentCartItem.id, currentPreview);
      return Array.from(allPreviews.values()).filter(p => p.interacted);
    }
    return [];
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileFormat = (file: File): string => {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const formatMap: Record<string, string> = {
      jpg: 'JPEG',
      jpeg: 'JPEG',
      png: 'PNG',
      svg: 'SVG',
      pdf: 'PDF',
      ai: 'Adobe Illustrator',
      eps: 'EPS',
    };
    return formatMap[extension] || extension.toUpperCase();
  };

  const analyzeImage = (file: File, img: HTMLImageElement): LogoAnalysis => {
    const { width, height } = img;
    const format = getFileFormat(file);
    const isPng = file.type.includes('png');
    const isSvg = file.type.includes('svg');

    // Quality assessment
    const qualityNotes: string[] = [];
    let qualityTier: LogoAnalysis['qualityTier'] = 'excellent';

    // Check dimensions - for embroidery/printing, we want decent resolution
    const minDimension = Math.min(width, height);
    const maxDimension = Math.max(width, height);

    if (isSvg) {
      qualityNotes.push('Vector format - excellent for any size');
      qualityTier = 'excellent';
    } else {
      // Resolution checks for raster images
      if (minDimension >= 1000) {
        qualityNotes.push('High resolution - excellent quality');
        qualityTier = 'excellent';
      } else if (minDimension >= 500) {
        qualityNotes.push('Good resolution for most applications');
        qualityTier = 'good';
      } else if (minDimension >= 200) {
        qualityNotes.push('Acceptable resolution - may need enhancement');
        qualityTier = 'acceptable';
      } else {
        qualityNotes.push('Low resolution - may affect print quality');
        qualityTier = 'low';
      }

      // Aspect ratio note
      const aspectRatio = maxDimension / minDimension;
      if (aspectRatio > 3) {
        qualityNotes.push('Very wide/tall aspect ratio');
      }
    }

    // Format notes
    if (isPng) {
      qualityNotes.push('PNG format - supports transparency');
    } else if (file.type.includes('jpeg')) {
      qualityNotes.push('JPEG format - no transparency support');
    }

    // File size notes
    if (file.size > 5 * 1024 * 1024) {
      qualityNotes.push('Large file size - high detail preserved');
    } else if (file.size < 50 * 1024 && !isSvg) {
      qualityNotes.push('Small file size - may be compressed');
    }

    return {
      fileName: file.name,
      fileSize: file.size,
      fileSizeFormatted: formatFileSize(file.size),
      format,
      width,
      height,
      hasTransparency: isPng || isSvg,
      qualityTier,
      qualityNotes,
    };
  };

  const handleFileUpload = (file: File) => {
    setLogoError(null);
    setLogoAnalysis(null);
    if (!file) return;

    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > 10) {
      setLogoError('File too large. Max 10MB.');
      return;
    }

    const type = file.type.toLowerCase();
    const isValid = type.includes('png') || type.includes('jpeg') || type.includes('jpg') || type.includes('svg');
    if (!isValid) {
      setLogoError('Please use PNG, JPG or SVG format.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setLogoSrc(dataUrl);

      // Analyze the image
      const img = new Image();
      img.onload = () => {
        const analysis = analyzeImage(file, img);
        setLogoAnalysis(analysis);
      };
      img.src = dataUrl;
    };
    reader.onerror = () => setLogoError('Failed to read file.');
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Drag handlers for logo positioning in preview
  const startDrag = (e: React.PointerEvent) => {
    if (!wrapRef.current) return;
    draggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const rect = wrapRef.current.getBoundingClientRect();
    const centerX = rect.left + (logoX / 100) * rect.width;
    const centerY = rect.top + (logoY / 100) * rect.height;
    const dxPct = ((e.clientX - centerX) / rect.width) * 100;
    const dyPct = ((e.clientY - centerY) / rect.height) * 100;
    dragOffsetRef.current = { dxPct, dyPct };
  };

  const onDrag = (e: React.PointerEvent) => {
    if (!draggingRef.current || !wrapRef.current || !logoRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const { dxPct, dyPct } = dragOffsetRef.current;
    const nx = ((e.clientX - rect.left) / rect.width) * 100 - dxPct;
    const ny = ((e.clientY - rect.top) / rect.height) * 100 - dyPct;
    const clampedX = Math.max(0, Math.min(100, nx));
    const clampedY = Math.max(0, Math.min(100, ny));
    posPctRef.current = { x: clampedX, y: clampedY };
    logoRef.current.style.left = `${clampedX}%`;
    logoRef.current.style.top = `${clampedY}%`;
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    setLogoX(posPctRef.current.x);
    setLogoY(posPctRef.current.y);
  };

  // Handle color selection with warning
  const handleColorSelect = (idx: number) => {
    if (idx === selectedColorIndex) return;

    // If changing from original color, show warning
    if (selectedColorIndex === originalColorIndex && idx !== originalColorIndex) {
      setPendingColorIndex(idx);
      setShowColorWarning(true);
    } else {
      setSelectedColorIndex(idx);
    }
  };

  const confirmColorChange = () => {
    if (pendingColorIndex !== null) {
      setSelectedColorIndex(pendingColorIndex);
    }
    setShowColorWarning(false);
    setPendingColorIndex(null);
  };

  const cancelColorChange = () => {
    setShowColorWarning(false);
    setPendingColorIndex(null);
  };

  // Rotation handlers
  const rotateLeft = () => setLogoRotation((r) => (r - 15 + 360) % 360);
  const rotateRight = () => setLogoRotation((r) => (r + 15) % 360);
  const resetRotation = () => setLogoRotation(0);

  const validateForm = (): boolean => {
    const errors: Partial<ContactFormData> = {};

    if (!contactForm.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!contactForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!contactForm.phone.trim()) {
      errors.phone = 'Phone number is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Get cart item previews for multi-item orders
      const itemPreviews = hasMultipleItems ? getCartItemPreviewsForSubmission() : undefined;

      onSelectPath('upload', {
        logoSrc,
        x: logoX,
        y: logoY,
        size: logoSize,
        colorIndex: selectedColorIndex,
        analysis: logoAnalysis || undefined,
      }, contactForm, itemPreviews);
    }
  };

  const renderStep = () => {
    switch (step) {
      // Step 1: Do you have a logo?
      case 'has-logo':
        return (
          <motion.div
            key="has-logo"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            {/* Header */}
            <div className={`text-center ${isMobile ? 'mb-4' : 'mb-8 md:mb-10'}`}>
              <div className={`inline-flex items-center gap-2 ${isMobile ? 'px-3 py-1' : 'px-4 py-1.5'} rounded-full bg-white/10 ${isMobile ? 'mb-2' : 'mb-4'}`}>
                <Shirt className={isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} style={{ color: clothingColors.accent }} />
                <span className={`neuzeit-font ${isMobile ? 'text-xs' : 'text-sm'} text-white/70`}>Customise Your {productName}</span>
              </div>
              <h2 className={`hearns-font ${isMobile ? 'text-xl' : 'text-3xl md:text-4xl'} text-white ${isMobile ? 'mb-1' : 'mb-3'}`}>
                Do you have a logo?
              </h2>
              <p className={`neuzeit-light-font ${isMobile ? 'text-sm' : 'text-base'} text-white/60 max-w-lg mx-auto`}>
                Let us know and we'll guide you through the next steps
              </p>
            </div>

            {/* Two options */}
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'md:grid-cols-2 gap-4 md:gap-6'} max-w-2xl mx-auto`}>
              <button
                onClick={() => setStep('upload-logo')}
                className={`group relative text-left ${isMobile ? 'p-3' : 'p-6'} rounded-[15px] border-2 border-white/20 hover:border-[#64a70b]/50 bg-white/5 hover:bg-white/10 transition-all duration-300 ${!isMobile && 'hover:-translate-y-1'}`}
              >
                <div className={`flex ${isMobile ? 'items-center gap-3' : 'flex-col'}`}>
                  <div className={`${isMobile ? 'w-10 h-10' : 'w-14 h-14'} rounded-[12px] flex items-center justify-center ${isMobile ? '' : 'mb-4'} bg-white/10 flex-shrink-0`}>
                    <Check className={isMobile ? 'w-5 h-5' : 'w-7 h-7'} style={{ color: clothingColors.accent }} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`embossing-font ${isMobile ? 'text-sm' : 'text-lg'} text-white ${isMobile ? 'mb-0.5' : 'mb-2'} uppercase tracking-wide`}>Yes, I have a logo</h3>
                    <p className={`neuzeit-light-font text-white/60 ${isMobile ? 'text-xs' : 'text-sm mb-4'}`}>
                      I have my logo file ready to upload
                    </p>
                  </div>
                  {!isMobile && (
                    <div className="inline-flex items-center gap-2 text-white/70 group-hover:text-[#64a70b] neuzeit-font text-sm font-semibold transition-colors">
                      Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                  {isMobile && (
                    <ArrowRight className="w-4 h-4 text-white/40 flex-shrink-0" />
                  )}
                </div>
              </button>

              <button
                onClick={() => setStep('needs-help-options')}
                className={`group relative text-left ${isMobile ? 'p-3' : 'p-6'} rounded-[15px] border-2 border-white/20 hover:border-[#64a70b]/50 bg-white/5 hover:bg-white/10 transition-all duration-300 ${!isMobile && 'hover:-translate-y-1'}`}
              >
                <div className={`flex ${isMobile ? 'items-center gap-3' : 'flex-col'}`}>
                  <div className={`${isMobile ? 'w-10 h-10' : 'w-14 h-14'} rounded-[12px] flex items-center justify-center ${isMobile ? '' : 'mb-4'} bg-white/10 flex-shrink-0`}>
                    <Palette className={isMobile ? 'w-5 h-5' : 'w-7 h-7'} style={{ color: clothingColors.accent }} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`embossing-font ${isMobile ? 'text-sm' : 'text-lg'} text-white ${isMobile ? 'mb-0.5' : 'mb-2'} uppercase tracking-wide`}>No, I need help</h3>
                    <p className={`neuzeit-light-font text-white/60 ${isMobile ? 'text-xs' : 'text-sm mb-4'}`}>
                      I need a logo designed or want to discuss options
                    </p>
                  </div>
                  {!isMobile && (
                    <div className="inline-flex items-center gap-2 text-white/70 group-hover:text-[#64a70b] neuzeit-font text-sm font-semibold transition-colors">
                      Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                  {isMobile && (
                    <ArrowRight className="w-4 h-4 text-white/40 flex-shrink-0" />
                  )}
                </div>
              </button>
            </div>
          </motion.div>
        );

      // Step 2a: Upload logo screen
      case 'upload-logo':
        return (
          <motion.div
            key="upload-logo"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            {/* Back button */}
            <button
              onClick={() => {
                setStep('has-logo');
                setLogoSrc('');
                setLogoError(null);
              }}
              className={`flex items-center gap-2 ${isMobile ? 'mb-3' : 'mb-6'} text-white/60 hover:text-white transition-colors`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className={`neuzeit-font ${isMobile ? 'text-xs' : 'text-sm'}`}>Back</span>
            </button>

            {/* Header */}
            <div className={`text-center ${isMobile ? 'mb-4' : 'mb-8'}`}>
              <h2 className={`hearns-font ${isMobile ? 'text-xl' : 'text-3xl md:text-4xl'} text-white ${isMobile ? 'mb-1' : 'mb-3'}`}>
                Upload Your Logo
              </h2>
              <p className={`neuzeit-light-font ${isMobile ? 'text-sm' : 'text-base'} text-white/60 max-w-lg mx-auto`}>
                We'll create a professional mockup showing how it looks on your garment
              </p>
            </div>

            <div className="max-w-xl mx-auto">
              {/* Dropzone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
                  relative border-2 border-dashed rounded-[15px] ${isMobile ? 'p-5' : 'p-10'} text-center cursor-pointer
                  transition-all duration-300 ease-out
                  ${isDragging
                    ? 'border-[#64a70b] bg-[#64a70b]/10 scale-[1.02]'
                    : logoSrc
                      ? 'border-[#64a70b] bg-[#64a70b]/5'
                      : 'border-white/20 hover:border-[#64a70b]/50 hover:bg-white/5'
                  }
                `}
              >
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                {logoSrc ? (
                  <div className={isMobile ? 'space-y-2' : 'space-y-4'}>
                    <div className={`${isMobile ? 'w-16 h-16' : 'w-24 h-24'} mx-auto rounded-[12px] overflow-hidden bg-white/10 p-2`}>
                      <img src={logoSrc} alt="Logo preview" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <p className={`neuzeit-font ${isMobile ? 'text-sm' : 'text-lg'} text-white mb-1`}>Logo uploaded!</p>
                      <p className={`neuzeit-light-font ${isMobile ? 'text-xs' : 'text-sm'} text-white/50`}>Click to change</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <motion.div
                      animate={{ scale: isDragging ? 1.1 : 1 }}
                      transition={{ duration: 0.2 }}
                      className={`${isMobile ? 'w-14 h-14' : 'w-20 h-20'} rounded-full mx-auto ${isMobile ? 'mb-3' : 'mb-6'} flex items-center justify-center`}
                      style={{ backgroundColor: isDragging ? `${clothingColors.accent}30` : 'rgba(255,255,255,0.1)' }}
                    >
                      {isDragging ? (
                        <FileImage className={isMobile ? 'w-7 h-7' : 'w-10 h-10'} style={{ color: clothingColors.accent }} />
                      ) : (
                        <Upload className={`${isMobile ? 'w-7 h-7' : 'w-10 h-10'} text-white/60`} />
                      )}
                    </motion.div>

                    <p className={`neuzeit-font ${isMobile ? 'text-base' : 'text-xl'} text-white mb-2`}>
                      {isDragging ? (
                        <span style={{ color: clothingColors.accent }}>Drop it here!</span>
                      ) : (
                        <>Drag & drop your logo</>
                      )}
                    </p>
                    <p className={`neuzeit-light-font text-white/60 ${isMobile ? 'text-sm' : ''} mb-1`}>
                      or click to browse
                    </p>
                    <p className={`neuzeit-light-font ${isMobile ? 'text-xs' : 'text-sm'} text-white/40`}>
                      PNG, JPG, SVG up to 10MB
                    </p>
                  </>
                )}
              </div>

              {logoError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-[10px] bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center neuzeit-font"
                >
                  {logoError}
                </motion.div>
              )}

              {/* Logo Analysis Display */}
              {logoSrc && logoAnalysis && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-[12px] bg-white/5 border border-white/10"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="neuzeit-font text-sm text-white truncate max-w-[200px]" title={logoAnalysis.fileName}>
                        {logoAnalysis.fileName}
                      </p>
                      <p className="neuzeit-light-font text-xs text-white/50">
                        {logoAnalysis.format} • {logoAnalysis.fileSizeFormatted} • {logoAnalysis.width}×{logoAnalysis.height}px
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium neuzeit-font ${
                      logoAnalysis.qualityTier === 'excellent' ? 'bg-green-500/20 text-green-400' :
                      logoAnalysis.qualityTier === 'good' ? 'bg-[#64a70b]/20 text-[#64a70b]' :
                      logoAnalysis.qualityTier === 'acceptable' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {logoAnalysis.qualityTier === 'excellent' ? 'Excellent' :
                       logoAnalysis.qualityTier === 'good' ? 'Good' :
                       logoAnalysis.qualityTier === 'acceptable' ? 'Acceptable' : 'Low Quality'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    {logoAnalysis.qualityNotes.map((note, i) => (
                      <p key={i} className="neuzeit-light-font text-xs text-white/60 flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          note.includes('excellent') || note.includes('High') || note.includes('supports') ? 'bg-green-400' :
                          note.includes('Good') || note.includes('good') ? 'bg-[#64a70b]' :
                          note.includes('Low') || note.includes('compressed') || note.includes('no transparency') ? 'bg-amber-400' :
                          'bg-white/40'
                        }`} />
                        {note}
                      </p>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Import sources */}
              {!logoSrc && (
                <div className="mt-8">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex-1 h-px bg-white/20" />
                    <span className="embossing-font text-sm text-white/50 tracking-wider">or import from</span>
                    <div className="flex-1 h-px bg-white/20" />
                  </div>

                  <div className="flex justify-center gap-6">
                    {importSources.map((source) => (
                      <div key={source.label} className="group relative flex flex-col items-center">
                        <button className="relative p-3 rounded-[12px] bg-white/10 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:scale-105">
                          <img
                            src={source.image}
                            alt={source.label}
                            className="w-10 h-10 object-contain"
                          />
                          {source.tip && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-10">
                              <span className="neuzeit-font">{source.tip}</span>
                            </div>
                          )}
                        </button>
                        <span className="neuzeit-font text-xs text-white/60 mt-2">
                          {source.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions - only show after logo uploaded */}
              {logoSrc && (
                <div className="mt-8 space-y-3">
                  {/* Continue to form */}
                  <button
                    onClick={() => setStep('contact-form')}
                    className="w-full h-12 rounded-[10px] neuzeit-font font-semibold text-sm text-white transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-xl"
                    style={{
                      backgroundColor: clothingColors.accent,
                      boxShadow: `0 6px 20px ${clothingColors.accent}30`,
                    }}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Preview option */}
                  <button
                    onClick={() => setStep('preview')}
                    className="w-full h-12 rounded-[10px] border-2 border-white/20 hover:border-[#64a70b] bg-white/5 hover:bg-[#64a70b]/10 neuzeit-font font-semibold text-sm text-white transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Preview on Garment First
                  </button>
                </div>
              )}

              {/* Tips */}
              {!logoSrc && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 p-4 rounded-[10px] bg-white/5 border border-white/10"
                >
                  <p className="neuzeit-font text-sm font-medium text-white/80 mb-2">
                    Tips for best results:
                  </p>
                  <ul className="space-y-1 text-sm text-white/60">
                    <li className="neuzeit-light-font">• PNG with transparent background works best</li>
                    <li className="neuzeit-light-font">• Higher resolution = better embroidery detail</li>
                    <li className="neuzeit-light-font">• We accept vector files too (AI, EPS, PDF)</li>
                  </ul>
                </motion.div>
              )}
            </div>
          </motion.div>
        );

      // Step 2b: Needs help - what kind?
      case 'needs-help-options':
        return (
          <motion.div
            key="needs-help-options"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            {/* Back button */}
            <button
              onClick={() => setStep('has-logo')}
              className={`flex items-center gap-2 ${isMobile ? 'mb-3' : 'mb-6'} text-white/60 hover:text-white transition-colors`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className={`neuzeit-font ${isMobile ? 'text-xs' : 'text-sm'}`}>Back</span>
            </button>

            {/* Header */}
            <div className={`text-center ${isMobile ? 'mb-4' : 'mb-8'}`}>
              <h2 className={`hearns-font ${isMobile ? 'text-xl' : 'text-3xl md:text-4xl'} text-white ${isMobile ? 'mb-1' : 'mb-3'}`}>
                How can we help?
              </h2>
              <p className={`neuzeit-light-font ${isMobile ? 'text-sm' : 'text-base'} text-white/60 max-w-lg mx-auto`}>
                Our team can design your logo or discuss your project in detail
              </p>
            </div>

            {/* Two options */}
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'md:grid-cols-2 gap-4 md:gap-6'} max-w-2xl mx-auto`}>
              <button
                onClick={() => onSelectPath('help')}
                className={`group relative text-left ${isMobile ? 'p-3' : 'p-6'} rounded-[15px] border-2 border-white/20 hover:border-[#64a70b]/50 bg-white/5 hover:bg-white/10 transition-all duration-300 ${!isMobile && 'hover:-translate-y-1'}`}
              >
                {isMobile ? (
                  // Mobile compact layout
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[12px] flex items-center justify-center bg-white/10 flex-shrink-0">
                      <Palette className="w-5 h-5" style={{ color: clothingColors.accent }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="embossing-font text-sm text-white uppercase tracking-wide">Design a logo for me</h3>
                        <span className="embossing-font text-xs tracking-wide" style={{ color: clothingColors.accent }}>
                          FROM £25
                        </span>
                      </div>
                      <p className="neuzeit-light-font text-white/60 text-xs">
                        Professional designers • Unlimited revisions
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/40 flex-shrink-0" />
                  </div>
                ) : (
                  // Desktop layout
                  <>
                    <div className="w-14 h-14 rounded-[12px] flex items-center justify-center mb-4 bg-white/10">
                      <Palette className="w-7 h-7" style={{ color: clothingColors.accent }} />
                    </div>
                    <span className="embossing-font text-sm tracking-wide" style={{ color: clothingColors.accent }}>
                      FROM £25
                    </span>
                    <h3 className="embossing-font text-lg text-white mb-2 mt-1 uppercase tracking-wide">Design a logo for me</h3>
                    <p className="neuzeit-light-font text-white/60 text-sm mb-4">
                      Our in-house designers will create a professional logo for your business
                    </p>
                    <ul className="space-y-2 mb-4">
                      {['Professional designers', 'Logo digitisation', 'Unlimited revisions'].map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-4 h-4 flex-shrink-0" style={{ color: clothingColors.accent }} />
                          <span className="neuzeit-font text-sm text-white/80">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-white/10 text-white group-hover:bg-[#64a70b] neuzeit-font text-sm font-semibold transition-colors">
                      Get Design Help <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </>
                )}
              </button>

              <button
                onClick={() => onSelectPath('consult')}
                className={`group relative text-left ${isMobile ? 'p-3' : 'p-6'} rounded-[15px] border-2 border-white/20 hover:border-[#64a70b]/50 bg-white/5 hover:bg-white/10 transition-all duration-300 ${!isMobile && 'hover:-translate-y-1'}`}
              >
                {isMobile ? (
                  // Mobile compact layout
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[12px] flex items-center justify-center bg-white/10 flex-shrink-0">
                      <Calendar className="w-5 h-5" style={{ color: clothingColors.accent }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="embossing-font text-sm text-white uppercase tracking-wide">Let's discuss my project</h3>
                        <span className="embossing-font text-xs tracking-wide" style={{ color: clothingColors.accent }}>
                          FREE
                        </span>
                      </div>
                      <p className="neuzeit-light-font text-white/60 text-xs">
                        No obligation • Same-day availability
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/40 flex-shrink-0" />
                  </div>
                ) : (
                  // Desktop layout
                  <>
                    <div className="w-14 h-14 rounded-[12px] flex items-center justify-center mb-4 bg-white/10">
                      <Calendar className="w-7 h-7" style={{ color: clothingColors.accent }} />
                    </div>
                    <span className="embossing-font text-sm tracking-wide" style={{ color: clothingColors.accent }}>
                      FREE CONSULTATION
                    </span>
                    <h3 className="embossing-font text-lg text-white mb-2 mt-1 uppercase tracking-wide">Let's discuss my project</h3>
                    <p className="neuzeit-light-font text-white/60 text-sm mb-4">
                      Book a call to discuss uniforms, quantities, and customisation options
                    </p>
                    <ul className="space-y-2 mb-4">
                      {['No obligation', 'Bulk pricing advice', 'Same-day availability'].map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-4 h-4 flex-shrink-0" style={{ color: clothingColors.accent }} />
                          <span className="neuzeit-font text-sm text-white/80">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-white/10 text-white group-hover:bg-[#64a70b] neuzeit-font text-sm font-semibold transition-colors">
                      Book a Call <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        );

      // Preview step - logo positioning
      case 'preview':
        return (
          <motion.div
            key="preview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            {/* Back button */}
            <button
              onClick={() => setStep('upload-logo')}
              className="flex items-center gap-2 mb-6 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="neuzeit-font text-sm">Back</span>
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="hearns-font text-2xl md:text-3xl text-white mb-2">
                Preview Your Logo
              </h2>
              <p className="neuzeit-light-font text-sm text-white/60 max-w-lg mx-auto">
                {hasMultipleItems
                  ? `Position your logo on each item. Click an item below to preview.`
                  : `This is just an illustration to help you visualise placement. Our team will create a professional mockup.`
                }
              </p>
            </div>

            {/* Cart Item Thumbnails - only show for multi-item orders */}
            {hasMultipleItems && (
              <div className="mb-6">
                <label className="embossing-font text-xs uppercase tracking-wide text-white/70 block mb-3">
                  Items in your order ({cartItems.length})
                </label>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {cartItems.map((item, index) => {
                    const isSelected = index === selectedCartItemIndex;
                    const hasInteracted = cartItemPreviews.has(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectCartItem(index)}
                        className={`relative flex-shrink-0 rounded-[12px] overflow-hidden transition-all ${
                          isSelected
                            ? 'ring-2 ring-[#64a70b] scale-105'
                            : 'ring-1 ring-white/20 hover:ring-white/40'
                        }`}
                        style={{ width: 72, height: 72 }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover bg-white"
                        />
                        {hasInteracted && (
                          <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#64a70b] flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#64a70b]/10" />
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="neuzeit-font text-xs text-white/50 mt-2">
                  {currentProductName}
                  {currentCartItem?.selectedColor && (
                    <span className="ml-2 text-white/70">• {currentCartItem.selectedColor}</span>
                  )}
                </p>
                <p className="neuzeit-light-font text-[11px] text-white/40 mt-1">
                  To change colours, edit items in your cart
                </p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Preview area */}
              <div className="relative">
                <div
                  ref={wrapRef}
                  className="relative rounded-[15px] overflow-hidden bg-white aspect-square"
                >
                  {currentProductImage ? (
                    <>
                      <img
                        src={currentProductImage}
                        alt="Product"
                        className="w-full h-full object-contain p-4"
                      />
                      {logoSrc && (
                        <img
                          ref={logoRef}
                          src={logoSrc}
                          alt="Logo preview"
                          className="absolute cursor-move select-none"
                          draggable={false}
                          style={{
                            left: `${logoX}%`,
                            top: `${logoY}%`,
                            width: `${logoSize}%`,
                            transform: `translate(-50%, -50%) rotate(${logoRotation}deg)`,
                            pointerEvents: 'auto',
                          }}
                          onPointerDown={startDrag}
                          onPointerMove={onDrag}
                          onPointerUp={endDrag}
                          onPointerCancel={endDrag}
                        />
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No product image available
                    </div>
                  )}
                </div>

                {/* Illustration disclaimer */}
                <div className="mt-3 p-3 rounded-[10px] bg-amber-500/10 border border-amber-500/20">
                  <p className="neuzeit-font text-xs text-amber-200 text-center">
                    This is a rough illustration only. Actual placement and sizing will be confirmed by our team.
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-5">
                {/* Logo thumbnail */}
                <div>
                  <label className="embossing-font text-xs uppercase tracking-wide text-white/70 block mb-2">
                    Your Logo
                  </label>
                  <div className="flex items-center gap-3 p-3 rounded-[10px] bg-white/5 border border-white/10">
                    <div className="w-12 h-12 rounded-[8px] overflow-hidden bg-white/10 p-1 flex-shrink-0">
                      <img src={logoSrc} alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <p className="neuzeit-font text-sm text-white">Logo uploaded</p>
                      <button
                        onClick={() => setStep('upload-logo')}
                        className="neuzeit-font text-xs text-white/50 hover:text-[#64a70b] transition-colors"
                      >
                        Change logo
                      </button>
                    </div>
                  </div>
                </div>

                {/* Size slider */}
                <div>
                  <label className="embossing-font text-xs uppercase tracking-wide text-white/70 block mb-2">
                    Logo Size ({Math.round(logoSize)}%)
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={70}
                    step={1}
                    value={logoSize}
                    onChange={(e) => setLogoSize(parseFloat(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#64a70b] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>

                {/* Rotation controls */}
                <div>
                  <label className="embossing-font text-xs uppercase tracking-wide text-white/70 block mb-2">
                    Rotation ({logoRotation}°)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={rotateLeft}
                      className="flex-1 h-10 rounded-[8px] bg-white/10 hover:bg-white/15 flex items-center justify-center gap-2 text-white/80 transition-colors"
                    >
                      <RotateCw className="w-4 h-4 transform -scale-x-100" />
                      <span className="neuzeit-font text-xs">-15°</span>
                    </button>
                    <button
                      onClick={resetRotation}
                      className="h-10 px-3 rounded-[8px] bg-white/10 hover:bg-white/15 text-white/60 neuzeit-font text-xs transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      onClick={rotateRight}
                      className="flex-1 h-10 rounded-[8px] bg-white/10 hover:bg-white/15 flex items-center justify-center gap-2 text-white/80 transition-colors"
                    >
                      <span className="neuzeit-font text-xs">+15°</span>
                      <RotateCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Color swatches */}
                {productColors.length > 1 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="embossing-font text-xs uppercase tracking-wide text-white/70">
                        Product Colour
                      </label>
                      {selectedColorIndex !== originalColorIndex && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs neuzeit-font">
                          <AlertTriangle className="w-3 h-3" />
                          Changed
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {productColors.map((c, idx) => (
                        <button
                          key={c.code || c.name + idx}
                          onClick={() => handleColorSelect(idx)}
                          className={`relative p-2 rounded-[10px] transition-all ${
                            idx === selectedColorIndex
                              ? 'bg-[#64a70b]/20 ring-2 ring-[#64a70b]'
                              : 'bg-white/5 hover:bg-white/10 ring-1 ring-white/10'
                          }`}
                        >
                          <div
                            className={`w-full aspect-square rounded-full border-2 mb-1.5 ${
                              idx === selectedColorIndex
                                ? 'border-[#64a70b]'
                                : 'border-white/20'
                            }`}
                            style={{ backgroundColor: c.rgb || '#cccccc' }}
                          />
                          <span className={`block text-center text-[10px] truncate ${
                            idx === selectedColorIndex ? 'text-white' : 'text-white/60'
                          } neuzeit-font`}>
                            {c.name}
                          </span>
                          {idx === originalColorIndex && idx !== selectedColorIndex && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[8px] text-white/60">
                              ✓
                            </span>
                          )}
                          {idx === selectedColorIndex && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#64a70b] flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    {selectedColorIndex !== originalColorIndex && (
                      <p className="mt-2 text-xs text-amber-400/80 neuzeit-light-font">
                        Original colour: {productColors[originalColorIndex]?.name}
                      </p>
                    )}
                  </div>
                )}

                {/* Drag hint */}
                <div className="flex items-center gap-2 p-3 rounded-[10px] bg-white/5 border border-white/10">
                  <Move className="w-4 h-4 text-white/50" />
                  <p className="neuzeit-font text-xs text-white/50">
                    Drag the logo to reposition it on the garment
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-4 space-y-3">
                  <button
                    onClick={() => setStep('contact-form')}
                    className="w-full h-12 rounded-[10px] neuzeit-font font-semibold text-sm text-white transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-xl"
                    style={{
                      backgroundColor: clothingColors.accent,
                      boxShadow: `0 6px 20px ${clothingColors.accent}30`,
                    }}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );

      // Contact form step
      case 'contact-form':
        return (
          <motion.div
            key="contact-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            {/* Back button */}
            <button
              onClick={() => setStep('upload-logo')}
              className="flex items-center gap-2 mb-6 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="neuzeit-font text-sm">Back</span>
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="hearns-font text-3xl md:text-4xl text-white mb-3">
                Almost there!
              </h2>
              <p className="neuzeit-light-font text-base text-white/60 max-w-lg mx-auto">
                Enter your details and we'll send you a free mockup and quote
              </p>
            </div>

            <div className="max-w-lg mx-auto">
              {/* Logo preview summary */}
              <div className="flex items-center gap-4 p-4 rounded-[12px] bg-white/5 border border-white/10 mb-6">
                <div className="w-16 h-16 rounded-[10px] overflow-hidden bg-white/10 p-1 flex-shrink-0">
                  <img src={logoSrc} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <p className="neuzeit-font text-sm text-white mb-1">Your logo is ready</p>
                  <p className="neuzeit-light-font text-xs text-white/50">
                    We'll create a professional mockup with your logo on {productName}
                  </p>
                </div>
                <Check className="w-6 h-6 flex-shrink-0" style={{ color: clothingColors.accent }} />
              </div>

              {/* Form */}
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="embossing-font text-xs uppercase tracking-wide text-white/70 block mb-2">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="John Smith"
                      className={`w-full h-12 pl-12 pr-4 rounded-[10px] bg-white/5 border ${
                        formErrors.name ? 'border-red-500' : 'border-white/20 focus:border-[#64a70b]'
                      } text-white placeholder-white/30 neuzeit-font text-sm outline-none transition-colors`}
                    />
                  </div>
                  {formErrors.name && (
                    <p className="neuzeit-font text-xs text-red-400 mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="embossing-font text-xs uppercase tracking-wide text-white/70 block mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="john@company.com"
                      className={`w-full h-12 pl-12 pr-4 rounded-[10px] bg-white/5 border ${
                        formErrors.email ? 'border-red-500' : 'border-white/20 focus:border-[#64a70b]'
                      } text-white placeholder-white/30 neuzeit-font text-sm outline-none transition-colors`}
                    />
                  </div>
                  {formErrors.email && (
                    <p className="neuzeit-font text-xs text-red-400 mt-1">{formErrors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="embossing-font text-xs uppercase tracking-wide text-white/70 block mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      placeholder="07123 456789"
                      className={`w-full h-12 pl-12 pr-4 rounded-[10px] bg-white/5 border ${
                        formErrors.phone ? 'border-red-500' : 'border-white/20 focus:border-[#64a70b]'
                      } text-white placeholder-white/30 neuzeit-font text-sm outline-none transition-colors`}
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="neuzeit-font text-xs text-red-400 mt-1">{formErrors.phone}</p>
                  )}
                </div>

                {/* Quantity */}
                <div>
                  <label className="embossing-font text-xs uppercase tracking-wide text-white/70 block mb-2">
                    Estimated Quantity
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="text"
                      value={contactForm.quantity}
                      onChange={(e) => setContactForm({ ...contactForm, quantity: e.target.value })}
                      placeholder="e.g. 20-50 items"
                      className="w-full h-12 pl-12 pr-4 rounded-[10px] bg-white/5 border border-white/20 focus:border-[#64a70b] text-white placeholder-white/30 neuzeit-font text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="embossing-font text-xs uppercase tracking-wide text-white/70 block mb-2">
                    Additional Notes
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-white/40" />
                    <textarea
                      value={contactForm.notes}
                      onChange={(e) => setContactForm({ ...contactForm, notes: e.target.value })}
                      placeholder="Any specific requirements, colours, sizes, or questions..."
                      rows={3}
                      className="w-full pl-12 pr-4 py-3 rounded-[10px] bg-white/5 border border-white/20 focus:border-[#64a70b] text-white placeholder-white/30 neuzeit-font text-sm outline-none transition-colors resize-none"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  className="w-full h-14 mt-4 rounded-[12px] neuzeit-font font-semibold text-base text-white transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-xl hover:scale-[1.01]"
                  style={{
                    backgroundColor: clothingColors.accent,
                    boxShadow: `0 8px 25px ${clothingColors.accent}40`,
                  }}
                >
                  Submit for Free Quote
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Trust message */}
                <p className="text-center neuzeit-light-font text-xs text-white/40 mt-4">
                  Free mockup included • No payment until you approve • Usually within 24 hours
                </p>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  // Progress steps configuration - adapts based on current path
  const getProgressSteps = () => {
    // First step - generic, don't assume path yet
    if (step === 'has-logo') {
      return [
        { key: 'start', label: 'Start', completed: false, active: true },
        { key: 'next', label: 'Next Steps', completed: false },
        { key: 'submit', label: 'Submit', completed: false },
      ];
    }

    // "No, I need help" path
    if (step === 'needs-help-options') {
      return [
        { key: 'start', label: 'Start', completed: true },
        { key: 'options', label: 'Options', completed: false, active: true },
        { key: 'submit', label: 'Submit', completed: false },
      ];
    }

    // Logo upload path (upload-logo, preview, contact-form)
    return [
      { key: 'start', label: 'Start', completed: true },
      { key: 'upload', label: 'Upload', completed: ['preview', 'contact-form'].includes(step), active: step === 'upload-logo' },
      { key: 'preview', label: 'Preview', completed: step === 'contact-form', active: step === 'preview', optional: true },
      { key: 'details', label: 'Details', completed: false, active: step === 'contact-form' },
    ];
  };

  const progressSteps = getProgressSteps();

  return (
    <div className="w-full">
      {/* Slim Progress Indicator */}
      <div className={isMobile ? 'mb-4' : 'mb-8'}>
        <div className={`flex items-center justify-center ${isMobile ? 'gap-1.5' : 'gap-2 md:gap-3'}`}>
          {progressSteps.map((progressStep, index) => (
            <React.Fragment key={progressStep.key}>
              {/* Step */}
              <div className="flex items-center gap-1.5">
                <div
                  className={`
                    ${isMobile ? 'w-5 h-5 text-[10px]' : 'w-6 h-6 text-xs'} rounded-full flex items-center justify-center font-semibold neuzeit-font
                    transition-all duration-300
                    ${progressStep.completed
                      ? 'bg-[#64a70b] text-white'
                      : progressStep.active
                        ? 'bg-[#64a70b]/20 text-[#64a70b] ring-2 ring-[#64a70b]'
                        : 'bg-white/10 text-white/40'
                    }
                  `}
                >
                  {progressStep.completed ? (
                    <Check className={isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
                  ) : (
                    index + 1
                  )}
                </div>
                {!isMobile && (
                  <span className={`hidden md:block text-xs neuzeit-font ${
                    progressStep.active ? 'text-white' : progressStep.completed ? 'text-white/60' : 'text-white/40'
                  }`}>
                    {progressStep.label}
                    {progressStep.optional && <span className="text-white/30 ml-1">(optional)</span>}
                  </span>
                )}
              </div>

              {/* Connector line */}
              {index < progressSteps.length - 1 && (
                <div
                  className={`${isMobile ? 'w-4' : 'w-6 md:w-10'} h-0.5 rounded-full transition-all duration-300 ${
                    progressStep.completed ? 'bg-[#64a70b]' : 'bg-white/10'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>

      {/* Trust indicators - only show on first steps */}
      {(step === 'has-logo' || step === 'needs-help-options') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`${isMobile ? 'mt-4 pt-3' : 'mt-8 pt-6'} border-t border-white/10`}
        >
          <div className={`flex flex-wrap justify-center ${isMobile ? 'gap-2 text-[10px]' : 'gap-4 md:gap-8 text-xs md:text-sm'} text-white/50`}>
            <div className="flex items-center gap-1.5">
              <Check className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} style={{ color: clothingColors.accent }} />
              <span className="neuzeit-font">Free mockup</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} style={{ color: clothingColors.accent }} />
              <span className="neuzeit-font">No payment until approved</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} style={{ color: clothingColors.accent }} />
              <span className="neuzeit-font">5-10 day turnaround</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Color Change Warning Modal */}
      <AnimatePresence>
        {showColorWarning && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50"
              onClick={cancelColorChange}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className="w-full max-w-md rounded-xl p-6 shadow-2xl"
                style={{ backgroundColor: clothingColors.dark }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white hearns-font">
                    Change Colour?
                  </h3>
                </div>

                <p className="text-white/70 mb-4 neuzeit-light-font">
                  You're about to change the product colour from{' '}
                  <strong className="text-white">{productColors[originalColorIndex]?.name}</strong> to{' '}
                  <strong className="text-white">{productColors[pendingColorIndex || 0]?.name}</strong>.
                </p>

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 p-3 rounded-lg bg-white/5 text-center">
                    <div
                      className="w-10 h-10 rounded-full mx-auto mb-2 border-2 border-white/20"
                      style={{ backgroundColor: productColors[originalColorIndex]?.rgb || '#ccc' }}
                    />
                    <span className="text-xs text-white/60 neuzeit-font">Current</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/40" />
                  <div className="flex-1 p-3 rounded-lg bg-[#64a70b]/10 text-center ring-2 ring-[#64a70b]">
                    <div
                      className="w-10 h-10 rounded-full mx-auto mb-2 border-2 border-[#64a70b]"
                      style={{ backgroundColor: productColors[pendingColorIndex || 0]?.rgb || '#ccc' }}
                    />
                    <span className="text-xs text-white neuzeit-font">New</span>
                  </div>
                </div>

                <p className="text-white/50 text-sm mb-6 neuzeit-light-font">
                  This will update the colour for your order. You can always change it back.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={cancelColorChange}
                    className="flex-1 py-2.5 rounded-lg border border-white/20 text-white/80 font-medium transition-all hover:bg-white/5 neuzeit-font"
                  >
                    Keep Original
                  </button>
                  <button
                    onClick={confirmColorChange}
                    className="flex-1 py-2.5 rounded-lg font-semibold text-white transition-all neuzeit-font"
                    style={{ backgroundColor: clothingColors.accent }}
                  >
                    Change Colour
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

export default ClothingOrderWizard;
