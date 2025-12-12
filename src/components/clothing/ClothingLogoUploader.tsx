import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  FileImage,
  CheckCircle,
  X,
  ArrowLeft,
  Loader2,
  Shirt,
} from 'lucide-react';

// Theme colors - matching clothing pages
const clothingColors = {
  accent: '#64a70b',
  dark: '#183028',
  secondary: '#1e3a2f',
};

interface LogoPreviewData {
  logoSrc: string;
  x: number;
  y: number;
  size: number;
  colorIndex: number;
}

interface ClothingLogoUploaderProps {
  onBack: () => void;
  onComplete: (logoUrl?: string) => void;
  productTitle?: string;
  productImage?: string;
  onPreviewLogo?: () => void;
  initialLogoData?: LogoPreviewData;
  isMobile?: boolean;
}

type UploadState = 'idle' | 'uploading' | 'processing' | 'complete';

// Import source configurations
const importSources = [
  { image: '/images/canva.png', label: 'Canva', tip: 'Export as PNG for best quality' },
  { image: '/images/drive.png', label: 'Google Drive', tip: 'Import directly from your Drive' },
  { image: '/images/dropbox.webp', label: 'Dropbox', tip: 'Sync files from Dropbox' },
];

const ClothingLogoUploader: React.FC<ClothingLogoUploaderProps> = ({
  onBack,
  onComplete,
  productTitle = 'your workwear',
  productImage,
  onPreviewLogo,
  initialLogoData,
  isMobile = false,
}) => {
  // If initialLogoData is provided, start in processing state
  const [uploadState, setUploadState] = useState<UploadState>(initialLogoData ? 'processing' : 'idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialLogoData?.logoSrc || null);
  const [error, setError] = useState<string | null>(null);

  // Handle initial logo data - auto-process on mount
  React.useEffect(() => {
    if (initialLogoData && uploadState === 'processing') {
      // Simulate processing delay for already-uploaded logo
      const timer = setTimeout(() => {
        setUploadState('complete');
        // Auto-proceed after showing success
        setTimeout(() => {
          onComplete(previewUrl || undefined);
        }, 2500);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [initialLogoData, uploadState, onComplete, previewUrl]);

  const processFile = useCallback(async (file: File) => {
    setSelectedFile(file);
    setUploadState('processing');
    setError(null);

    // Create local preview for immediate display
    let localPreviewUrl: string | null = null;
    if (file.type.startsWith('image/')) {
      localPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(localPreviewUrl);
    }

    try {
      // Actually upload the logo to R2 storage
      let uploadedUrl: string | null = null;

      if (file.type.startsWith('image/')) {
        // Convert file to base64
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            const base64Data = result.split(',')[1];
            resolve(base64Data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Upload to R2
        try {
          const response = await fetch('/.netlify/functions/storage/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: `logo-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
              folder: 'logos',
              data: base64,
              contentType: file.type,
            }),
          });

          const result = await response.json();
          if (result.success && result.publicUrl) {
            uploadedUrl = result.publicUrl;
          } else {
            console.warn('R2 upload response:', result);
          }
        } catch (uploadErr) {
          console.warn('R2 upload failed, using local preview:', uploadErr);
        }
      }

      setUploadState('complete');

      // Auto-proceed after a moment - use R2 URL or fallback to local preview
      // Always pass a URL to ensure logo preview step is shown
      const finalUrl = uploadedUrl || localPreviewUrl;
      setTimeout(() => {
        onComplete(finalUrl || undefined);
      }, 2500);
    } catch (err) {
      console.error('Logo upload error:', err);
      setError('Something went wrong. Please try again.');
      setUploadState('idle');
    }
  }, [onComplete]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processFile(acceptedFiles[0]);
    }
  }, [processFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/pdf': ['.pdf'],
      'image/svg+xml': ['.svg'],
      'application/illustrator': ['.ai'],
      'application/eps': ['.eps'],
    },
    maxSize: 50 * 1024 * 1024,
    multiple: false,
    disabled: uploadState !== 'idle',
  });

  const resetUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(initialLogoData?.logoSrc || null);
    setUploadState(initialLogoData ? 'processing' : 'idle');
    setError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className={`flex items-center gap-2 ${isMobile ? 'mb-3' : 'mb-8'} text-white/60 hover:text-white transition-colors`}
      >
        <ArrowLeft className="w-4 h-4" />
        <span className={`neuzeit-font ${isMobile ? 'text-xs' : 'text-sm'}`}>Back to options</span>
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-center ${isMobile ? 'mb-4' : 'mb-8'}`}
      >
        <div
          className={`inline-flex items-center gap-2 ${isMobile ? 'px-3 py-1' : 'px-4 py-1.5'} rounded-full ${isMobile ? 'mb-2' : 'mb-4'}`}
          style={{ backgroundColor: `${clothingColors.accent}20` }}
        >
          <Shirt className={isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} style={{ color: clothingColors.accent }} />
          <span className={`neuzeit-font ${isMobile ? 'text-xs' : 'text-sm'}`} style={{ color: clothingColors.accent }}>
            Logo Upload
          </span>
        </div>
        <h2 className={`hearns-font ${isMobile ? 'text-xl' : 'text-3xl md:text-4xl'} text-white ${isMobile ? 'mb-1' : 'mb-3'}`}>
          Upload your logo
        </h2>
        <p className={`neuzeit-light-font ${isMobile ? 'text-sm' : ''} text-white/60`}>
          We'll create a mockup showing how it looks on {productTitle}
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {uploadState === 'idle' && (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`
                relative border-2 border-dashed rounded-[15px] ${isMobile ? 'p-5' : 'p-10'} text-center cursor-pointer
                transition-all duration-300 ease-out
                ${isDragActive
                  ? 'border-[#64a70b] bg-[#64a70b]/10 scale-[1.02]'
                  : 'border-white/20 hover:border-[#64a70b]/50 hover:bg-white/5'
                }
              `}
            >
              <input {...getInputProps()} />

              <motion.div
                animate={{ scale: isDragActive ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
                className={`${isMobile ? 'w-14 h-14' : 'w-20 h-20'} rounded-full mx-auto ${isMobile ? 'mb-3' : 'mb-6'} flex items-center justify-center`}
                style={{ backgroundColor: isDragActive ? `${clothingColors.accent}30` : 'rgba(255,255,255,0.1)' }}
              >
                {isDragActive ? (
                  <FileImage className={isMobile ? 'w-7 h-7' : 'w-10 h-10'} style={{ color: clothingColors.accent }} />
                ) : (
                  <Upload className={`${isMobile ? 'w-7 h-7' : 'w-10 h-10'} text-white/60`} />
                )}
              </motion.div>

              <p className={`neuzeit-font ${isMobile ? 'text-base' : 'text-xl'} text-white mb-2`}>
                {isDragActive ? (
                  <span style={{ color: clothingColors.accent }}>Drop it here!</span>
                ) : (
                  <>Drag & drop your logo</>
                )}
              </p>
              <p className={`neuzeit-light-font text-white/60 ${isMobile ? 'text-sm' : ''} mb-1`}>
                or click to browse
              </p>
              <p className={`neuzeit-light-font ${isMobile ? 'text-xs' : 'text-sm'} text-white/40`}>
                PNG, JPG, PDF, SVG, AI, EPS up to 50MB
              </p>
            </div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`${isMobile ? 'mt-3 p-3' : 'mt-6 p-4'} rounded-[10px] bg-white/5 border border-white/10`}
            >
              <p className={`neuzeit-font ${isMobile ? 'text-xs' : 'text-sm'} font-medium text-white/80 mb-2`}>
                Tips for best results:
              </p>
              <ul className={`space-y-1 ${isMobile ? 'text-xs' : 'text-sm'} text-white/60`}>
                <li className="neuzeit-light-font">- PNG with transparent background works best</li>
                <li className="neuzeit-light-font">- Vector files (AI, EPS, SVG) give the sharpest results</li>
                {!isMobile && <li className="neuzeit-light-font">- Higher resolution = better embroidery detail</li>}
              </ul>
            </motion.div>

            {/* Import sources */}
            <div className={isMobile ? 'mt-4' : 'mt-8'}>
              <div className={`flex items-center gap-4 ${isMobile ? 'mb-3' : 'mb-5'}`}>
                <div className="flex-1 h-px bg-white/20" />
                <span className={`embossing-font ${isMobile ? 'text-xs' : 'text-sm'} text-white/50 tracking-wider`}>or import from</span>
                <div className="flex-1 h-px bg-white/20" />
              </div>

              <div className={`flex justify-center ${isMobile ? 'gap-4' : 'gap-6'}`}>
                {importSources.map((source) => (
                  <div key={source.label} className="group relative flex flex-col items-center">
                    <button className={`relative ${isMobile ? 'p-2' : 'p-3'} rounded-[12px] bg-white/10 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:scale-105`}>
                      <img
                        src={source.image}
                        alt={source.label}
                        className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} object-contain`}
                      />
                      {source.tip && !isMobile && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-10">
                          <span className="neuzeit-font">{source.tip}</span>
                        </div>
                      )}
                    </button>
                    <span className={`neuzeit-font ${isMobile ? 'text-[10px]' : 'text-xs'} text-white/60 mt-2`}>
                      {source.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview Logo Option */}
            {onPreviewLogo && productImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <button
                  onClick={onPreviewLogo}
                  className="w-full p-4 rounded-[12px] border-2 border-dashed border-white/20 hover:border-[#64a70b] bg-white/5 hover:bg-[#64a70b]/10 transition-all duration-300 flex items-center justify-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-[8px] overflow-hidden bg-white flex-shrink-0">
                    <img src={productImage} alt="" className="w-full h-full object-contain p-1" />
                  </div>
                  <div className="text-left">
                    <span className="neuzeit-font text-sm font-medium text-white group-hover:text-[#64a70b] transition-colors">
                      Preview your logo first?
                    </span>
                    <p className="neuzeit-light-font text-xs text-white/50">
                      See how it looks on the garment before submitting
                    </p>
                  </div>
                </button>
              </motion.div>
            )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-[10px] bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center neuzeit-font"
              >
                {error}
              </motion.div>
            )}
          </motion.div>
        )}

        {(uploadState === 'processing' || uploadState === 'complete') && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            {/* Preview with product image mockup */}
            <div className="flex justify-center items-center gap-4 mb-8">
              {/* Product image */}
              {productImage && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative w-32 h-32 rounded-[15px] overflow-hidden shadow-xl bg-white"
                >
                  <img
                    src={productImage}
                    alt="Product"
                    className="w-full h-full object-contain p-2"
                  />
                </motion.div>
              )}

              {/* Plus sign */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/30 text-3xl font-light"
              >
                +
              </motion.div>

              {/* Logo preview */}
              {previewUrl && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative w-32 h-32 rounded-[15px] overflow-hidden shadow-xl"
                  style={{ backgroundColor: clothingColors.secondary }}
                >
                  <img
                    src={previewUrl}
                    alt="Logo preview"
                    className="w-full h-full object-contain p-3"
                  />
                  {uploadState === 'complete' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center"
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: clothingColors.accent }}
                      >
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Status */}
            {uploadState === 'processing' && (
              <>
                <Loader2
                  className="w-8 h-8 mx-auto mb-4 animate-spin"
                  style={{ color: clothingColors.accent }}
                />
                <h3 className="hearns-font text-2xl mb-2 text-white">
                  {initialLogoData ? 'Saving your preview...' : 'Processing your logo...'}
                </h3>
                <p className="neuzeit-light-font text-white/60">
                  {initialLogoData ? 'Including your placement preferences' : 'Preparing your mockup'}
                </p>
              </>
            )}

            {uploadState === 'complete' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="hearns-font text-2xl mb-2 text-white">
                  Looking great!
                </h3>
                <p className="embossing-font text-lg mb-2" style={{ color: clothingColors.accent }}>
                  We'll create your mockup
                </p>
                <p className="neuzeit-light-font text-white/60 text-sm">
                  Our team will send you a preview within 24 hours
                </p>
              </motion.div>
            )}

            {/* Cancel button */}
            {uploadState === 'processing' && (
              <button
                onClick={resetUpload}
                className="mt-8 flex items-center gap-2 mx-auto text-white/50 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="neuzeit-font text-sm">Cancel</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trust message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`text-center ${isMobile ? 'mt-4' : 'mt-8'} neuzeit-light-font ${isMobile ? 'text-xs' : 'text-sm'} text-white/40`}
      >
        Free mockup included - no payment until you approve the design
      </motion.p>
    </div>
  );
};

export default ClothingLogoUploader;
