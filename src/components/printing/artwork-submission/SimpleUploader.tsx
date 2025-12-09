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
} from 'lucide-react';
import { printingColors } from '../../../lib/printing-theme';
import { analyzeImageFile } from '../../../lib/artwork-analysis';
import type { PrintDimensions, ArtworkAnalysis } from '../../../lib/artwork-types';

interface SimpleUploaderProps {
  onBack: () => void;
  onComplete: (file: File, analysis: ArtworkAnalysis) => void;
  productTitle?: string;
  printDimensions?: PrintDimensions;
}

type UploadState = 'idle' | 'uploading' | 'processing' | 'complete';

// Import source configurations
const importSources = [
  { image: '/images/canva.png', label: 'Canva', tip: 'Export as "PDF Print" for best quality' },
  { image: '/images/drive.png', label: 'Google Drive', tip: 'Import directly from your Drive' },
  { image: '/images/dropbox.webp', label: 'Dropbox', tip: 'Sync files from Dropbox' },
  { image: '/images/chatgpt.webp', label: 'ChatGPT', tip: 'AI-generated images - we\'ll enhance for print' },
];

const SimpleUploader: React.FC<SimpleUploaderProps> = ({
  onBack,
  onComplete,
  productTitle = 'your project',
  printDimensions = { width: 148, height: 210 },
}) => {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(async (file: File) => {
    setSelectedFile(file);
    setUploadState('processing');
    setError(null);

    // Create preview
    if (file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file));
    }

    try {
      // Analyze silently
      const analysis = await analyzeImageFile(file, printDimensions);

      // Simulate upload delay for UX
      await new Promise(resolve => setTimeout(resolve, 1500));

      setUploadState('complete');

      // Auto-proceed after a moment
      setTimeout(() => {
        onComplete(file, analysis);
      }, 2000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setUploadState('idle');
    }
  }, [printDimensions, onComplete]);

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
    },
    maxSize: 50 * 1024 * 1024,
    multiple: false,
    disabled: uploadState !== 'idle',
  });

  const resetUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadState('idle');
    setError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="flex items-center gap-2 mb-8 text-white/60 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="neuzeit-font text-sm">Back to options</span>
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="hearns-font text-3xl md:text-4xl text-white mb-3">
          Upload your artwork
        </h2>
        <p className="neuzeit-light-font text-white/60">
          We'll check everything looks perfect for {productTitle}
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
                relative border-2 border-dashed rounded-[15px] p-12 text-center cursor-pointer
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
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: isDragActive ? `${printingColors.accent}30` : 'rgba(255,255,255,0.1)' }}
              >
                {isDragActive ? (
                  <FileImage className="w-10 h-10" style={{ color: printingColors.accent }} />
                ) : (
                  <Upload className="w-10 h-10 text-white/60" />
                )}
              </motion.div>

              <p className="neuzeit-font text-xl text-white mb-2">
                {isDragActive ? (
                  <span style={{ color: printingColors.accent }}>Drop it here!</span>
                ) : (
                  <>Drag & drop your file</>
                )}
              </p>
              <p className="neuzeit-light-font text-white/60 mb-1">
                or click to browse
              </p>
              <p className="neuzeit-light-font text-sm text-white/40">
                PDF, PNG, JPG, SVG up to 50MB
              </p>
            </div>

            {/* Import sources */}
            <div className="mt-8">
              <div className="flex items-center gap-4 mb-5">
                <div className="flex-1 h-px bg-white/20" />
                <span className="hearns-font text-lg text-white/50">or import from</span>
                <div className="flex-1 h-px bg-white/20" />
              </div>

              <div className="flex justify-center gap-8">
                {importSources.map((source) => (
                  <div key={source.label} className="group relative flex flex-col items-center">
                    <button className="relative p-4 rounded-[15px] bg-white/10 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:scale-110">
                      <img
                        src={source.image}
                        alt={source.label}
                        className="w-12 h-12 object-contain transition-transform duration-300 group-hover:rotate-6"
                      />
                      {source.tip && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2.5 bg-black/90 text-white text-sm rounded-[10px] opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-10 shadow-lg">
                          <span className="neuzeit-font">{source.tip}</span>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90" />
                        </div>
                      )}
                    </button>
                    <span className="neuzeit-font text-sm text-white/70 mt-3 group-hover:text-white transition-colors">
                      {source.label}
                    </span>
                  </div>
                ))}
              </div>

            </div>

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
            className="text-center py-12"
          >
            {/* Preview */}
            {previewUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-48 h-48 mx-auto mb-8 rounded-[15px] overflow-hidden shadow-xl"
              >
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                {uploadState === 'complete' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center"
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: printingColors.accent }}
                    >
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Status */}
            {uploadState === 'processing' && (
              <>
                <Loader2
                  className="w-8 h-8 mx-auto mb-4 animate-spin"
                  style={{ color: printingColors.accent }}
                />
                <h3 className="hearns-font text-2xl mb-2 text-white">
                  Checking your artwork...
                </h3>
                <p className="neuzeit-light-font text-white/60">
                  This only takes a moment
                </p>
              </>
            )}

            {uploadState === 'complete' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="hearns-font text-2xl mb-2 text-white">
                  Looking good!
                </h3>
                <p className="smilecake-font text-lg mb-2" style={{ color: printingColors.accent }}>
                  We'll take it from here
                </p>
                <p className="neuzeit-light-font text-white/60 text-sm">
                  Our team will review and be in touch shortly
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
        className="text-center mt-8 neuzeit-light-font text-sm text-white/40"
      >
        All artwork receives a free quality check before printing
      </motion.p>
    </div>
  );
};

export default SimpleUploader;
