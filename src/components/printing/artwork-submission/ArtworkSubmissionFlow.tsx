import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { printingColors } from '../../../lib/printing-theme';
import type { PrintDimensions, ArtworkAnalysis } from '../../../lib/artwork-types';
import PathSelector, { SubmissionPath } from './PathSelector';
import SimpleUploader from './SimpleUploader';
import HelpRequestForm from './HelpRequestForm';
import ConsultationBooker from './ConsultationBooker';

export type ServiceType = 'printing' | 'signage' | 'vehicle' | 'clothing';

interface ArtworkSubmissionFlowProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType?: ServiceType;
  productTitle?: string;
  productSlug?: string;
  printDimensions?: PrintDimensions;
  recommendedPath?: SubmissionPath;
  onComplete?: (data: SubmissionResult) => void;
}

export interface SubmissionResult {
  path: SubmissionPath;
  file?: File;
  analysis?: ArtworkAnalysis;
  formData?: {
    name: string;
    email: string;
    description: string;
  };
}

// Service-specific configuration
const serviceConfig: Record<ServiceType, {
  name: string;
  defaultPath: SubmissionPath;
  showUploader: boolean;
}> = {
  printing: {
    name: 'printing',
    defaultPath: 'ready',
    showUploader: true,
  },
  signage: {
    name: 'signage',
    defaultPath: 'ready',
    showUploader: true,
  },
  vehicle: {
    name: 'vehicle graphics',
    defaultPath: 'consult',
    showUploader: false,
  },
  clothing: {
    name: 'clothing',
    defaultPath: 'ready',
    showUploader: true,
  },
};

const ArtworkSubmissionFlow: React.FC<ArtworkSubmissionFlowProps> = ({
  isOpen,
  onClose,
  serviceType = 'printing',
  productTitle,
  productSlug,
  printDimensions = { width: 148, height: 210 },
  recommendedPath,
  onComplete,
}) => {
  const [currentPath, setCurrentPath] = useState<SubmissionPath | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const config = serviceConfig[serviceType];
  const effectiveRecommendedPath = recommendedPath || config.defaultPath;

  const handleSelectPath = useCallback((path: SubmissionPath) => {
    setCurrentPath(path);
  }, []);

  const handleBack = useCallback(() => {
    setCurrentPath(null);
  }, []);

  const handleUploadComplete = useCallback((file: File, analysis: ArtworkAnalysis) => {
    setIsCompleted(true);
    onComplete?.({
      path: 'ready',
      file,
      analysis,
    });
  }, [onComplete]);

  const handleHelpComplete = useCallback(() => {
    setIsCompleted(true);
    onComplete?.({
      path: 'help',
    });
  }, [onComplete]);

  const handleConsultComplete = useCallback(() => {
    setIsCompleted(true);
    onComplete?.({
      path: 'consult',
    });
  }, [onComplete]);

  const handleClose = useCallback(() => {
    // Reset state when closing
    setCurrentPath(null);
    setIsCompleted(false);
    onClose();
  }, [onClose]);

  // Auto-close the modal after completion (let the child component show its confirmation first)
  useEffect(() => {
    if (isCompleted) {
      const timeout = setTimeout(() => {
        handleClose();
      }, 500); // Short delay after child's confirmation
      return () => clearTimeout(timeout);
    }
  }, [isCompleted, handleClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 flex items-center justify-center pointer-events-none"
          >
            <div
              className="relative w-full max-w-4xl max-h-full overflow-auto rounded-[20px] shadow-2xl pointer-events-auto"
              style={{ backgroundColor: printingColors.dark }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>

              {/* Decorative header bar */}
              <div
                className="h-2 rounded-t-[20px]"
                style={{ backgroundColor: printingColors.accent }}
              />

              {/* Content */}
              <div className="p-6 md:p-10 lg:p-12">
                <AnimatePresence mode="wait">
                  {!currentPath && !isCompleted && (
                    <motion.div
                      key="selector"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -50 }}
                    >
                      <PathSelector
                        onSelectPath={handleSelectPath}
                        serviceName={config.name}
                        recommendedPath={effectiveRecommendedPath}
                      />
                    </motion.div>
                  )}

                  {currentPath === 'ready' && !isCompleted && (
                    <motion.div
                      key="uploader"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                    >
                      <SimpleUploader
                        onBack={handleBack}
                        onComplete={handleUploadComplete}
                        productTitle={productTitle || config.name}
                        printDimensions={printDimensions}
                      />
                    </motion.div>
                  )}

                  {currentPath === 'help' && !isCompleted && (
                    <motion.div
                      key="help"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                    >
                      <HelpRequestForm
                        onBack={handleBack}
                        onComplete={handleHelpComplete}
                        productTitle={productTitle}
                        serviceName={config.name}
                      />
                    </motion.div>
                  )}

                  {currentPath === 'consult' && !isCompleted && (
                    <motion.div
                      key="consult"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                    >
                      <ConsultationBooker
                        onBack={handleBack}
                        onComplete={handleConsultComplete}
                        serviceName={config.name}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Texture overlay for depth */}
              <div
                className="absolute inset-0 pointer-events-none opacity-5 rounded-[20px]"
                style={{
                  backgroundImage: 'url(/ConcreteTexture.webp)',
                  backgroundSize: 'cover',
                  mixBlendMode: 'overlay',
                }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ArtworkSubmissionFlow;
