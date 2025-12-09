import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, CheckCircle } from 'lucide-react';
import { printingColors } from '../../../lib/printing-theme';
import { analyzeImageFile, createPreviewUrl, revokePreviewUrl } from '../../../lib/artwork-analysis';
import { ENHANCEMENT_MESSAGES } from '../../../lib/artwork-constants';
import type {
  WizardState,
  WizardStep,
  PrintDimensions,
  ApprovedArtwork,
  ArtworkAnalysis,
} from '../../../lib/artwork-types';
import ArtworkDropzone from './ArtworkDropzone';
import ArtworkAnalyzer from './ArtworkAnalyzer';
import ArtworkEnhancer from './ArtworkEnhancer';

interface ArtworkUploadWizardProps {
  productSlug: string;
  productTitle: string;
  printDimensions: PrintDimensions;
  onArtworkApproved: (artwork: ApprovedArtwork) => void;
  onClose?: () => void;
  isOpen?: boolean;
}

const initialState: WizardState = {
  step: 'upload',
  originalFile: null,
  originalPreviewUrl: null,
  analysis: null,
  enhancedUrl: null,
  enhancedAnalysis: null,
  selectedVersion: 'original',
  importSource: 'upload',
  error: null,
};

const ArtworkUploadWizard: React.FC<ArtworkUploadWizardProps> = ({
  productSlug,
  productTitle,
  printDimensions,
  onArtworkApproved,
  onClose,
  isOpen = true,
}) => {
  const [state, setState] = useState<WizardState>(initialState);

  const updateState = useCallback((updates: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetWizard = useCallback(() => {
    if (state.originalPreviewUrl) {
      revokePreviewUrl(state.originalPreviewUrl);
    }
    setState(initialState);
  }, [state.originalPreviewUrl]);

  // Handle file selection
  const handleFileSelect = useCallback(async (file: File) => {
    try {
      const previewUrl = createPreviewUrl(file);
      updateState({
        step: 'analyzing',
        originalFile: file,
        originalPreviewUrl: previewUrl,
        importSource: 'upload',
        error: null,
      });

      // Analyze the file
      const analysis = await analyzeImageFile(file, printDimensions);

      // If good quality, go straight to success
      if (analysis.qualityTier === 'good') {
        updateState({
          step: 'success',
          analysis,
        });
      } else {
        updateState({
          step: 'results',
          analysis,
        });
      }
    } catch (error) {
      updateState({
        step: 'upload',
        error: 'Failed to analyze file. Please try again.',
      });
    }
  }, [printDimensions, updateState]);

  // Handle enhancement request
  const handleEnhance = useCallback(async () => {
    updateState({ step: 'enhancing' });

    // Simulate enhancement (in real implementation, this calls the Replicate API)
    // For now, we'll simulate an improved result
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Simulated enhanced analysis
    const enhancedAnalysis: ArtworkAnalysis = {
      ...state.analysis!,
      qualityScore: Math.min(100, state.analysis!.qualityScore + 35),
      qualityTier: 'good',
      dpiAtPrint: 300,
      issues: [],
    };

    updateState({
      step: 'enhanced-preview',
      enhancedUrl: state.originalPreviewUrl, // In real impl, this would be the enhanced image URL
      enhancedAnalysis,
    });
  }, [state.analysis, state.originalPreviewUrl, updateState]);

  // Handle using enhanced version
  const handleUseEnhanced = useCallback(() => {
    updateState({
      step: 'success',
      selectedVersion: 'enhanced',
    });
  }, [updateState]);

  // Handle upload new file
  const handleUploadNew = useCallback(() => {
    if (state.originalPreviewUrl) {
      revokePreviewUrl(state.originalPreviewUrl);
    }
    updateState({
      step: 'upload',
      originalFile: null,
      originalPreviewUrl: null,
      analysis: null,
      enhancedUrl: null,
      enhancedAnalysis: null,
      error: null,
    });
  }, [state.originalPreviewUrl, updateState]);

  // Handle proceed anyway (for borderline quality)
  const handleProceedAnyway = useCallback(() => {
    updateState({ step: 'success' });
  }, [updateState]);

  // Handle continue from success
  const handleContinue = useCallback(() => {
    const analysis = state.selectedVersion === 'enhanced' ? state.enhancedAnalysis : state.analysis;
    const fileUrl = state.selectedVersion === 'enhanced' ? state.enhancedUrl : state.originalPreviewUrl;

    if (analysis && fileUrl && state.originalFile) {
      onArtworkApproved({
        fileUrl,
        fileName: state.originalFile.name,
        version: state.selectedVersion,
        qualityScore: analysis.qualityScore,
        analysis,
      });
    }
  }, [state, onArtworkApproved]);

  // Handle help request
  const handleRequestHelp = useCallback((method: 'form' | 'whatsapp' | 'phone') => {
    switch (method) {
      case 'whatsapp':
        window.open('https://wa.me/447123456789', '_blank');
        break;
      case 'phone':
        window.location.href = 'tel:+441onal234567';
        break;
      case 'form':
        // In real impl, this would open a modal or navigate to a form
        console.log('Open enquiry form');
        break;
    }
  }, []);

  // Canva import handler (placeholder)
  const handleCanvaImport = useCallback(() => {
    console.log('Open Canva picker');
    // In real implementation, this would use the Canva Connect API
  }, []);

  if (!isOpen) return null;

  return (
    <div className="w-full bg-white rounded-[15px] border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="hearns-font text-xl text-gray-900">Add Your Artwork</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-[10px] hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* Upload step */}
          {state.step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ArtworkDropzone
                onFileSelect={handleFileSelect}
                onCanvaImport={handleCanvaImport}
                onGoogleDriveImport={() => console.log('Google Drive')}
                onDropboxImport={() => console.log('Dropbox')}
              />
            </motion.div>
          )}

          {/* Analyzing step */}
          {state.step === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: printingColors.accent }} />
              <p className="neuzeit-font text-lg text-gray-800">Checking your artwork...</p>
              <p className="neuzeit-light-font text-sm text-gray-500 mt-1">This only takes a moment</p>
            </motion.div>
          )}

          {/* Results step */}
          {state.step === 'results' && state.analysis && state.originalPreviewUrl && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ArtworkAnalyzer
                analysis={state.analysis}
                previewUrl={state.originalPreviewUrl}
                productTitle={productTitle}
                onEnhance={handleEnhance}
                onUploadNew={handleUploadNew}
                onRequestHelp={handleRequestHelp}
                onProceedAnyway={state.analysis.qualityTier === 'borderline' ? handleProceedAnyway : undefined}
              />
            </motion.div>
          )}

          {/* Enhancing step */}
          {state.step === 'enhancing' && (
            <motion.div
              key="enhancing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <div className="relative w-24 h-24 mb-6">
                {/* Spinning ring */}
                <motion.div
                  className="absolute inset-0 border-4 rounded-full"
                  style={{ borderColor: `${printingColors.accent}30`, borderTopColor: printingColors.accent }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                {/* Preview thumbnail */}
                {state.originalPreviewUrl && (
                  <img
                    src={state.originalPreviewUrl}
                    alt="Enhancing"
                    className="absolute inset-2 w-20 h-20 object-cover rounded-full"
                  />
                )}
              </div>
              <p className="neuzeit-font text-lg text-gray-800">{ENHANCEMENT_MESSAGES.processing.title}</p>
              <p className="neuzeit-light-font text-sm text-gray-500 mt-1">{ENHANCEMENT_MESSAGES.processing.subtitle}</p>
            </motion.div>
          )}

          {/* Enhanced preview step */}
          {state.step === 'enhanced-preview' && state.analysis && state.enhancedAnalysis && state.originalPreviewUrl && state.enhancedUrl && (
            <motion.div
              key="enhanced-preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ArtworkEnhancer
                originalUrl={state.originalPreviewUrl}
                enhancedUrl={state.enhancedUrl}
                originalAnalysis={state.analysis}
                enhancedAnalysis={state.enhancedAnalysis}
                onUseEnhanced={handleUseEnhanced}
                onRequestHelp={handleRequestHelp}
              />
            </motion.div>
          )}

          {/* Success step */}
          {state.step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: `${printingColors.accent}15` }}
              >
                <CheckCircle className="w-10 h-10" style={{ color: printingColors.accent }} />
              </motion.div>

              <h3 className="hearns-font text-2xl text-gray-900 mb-2">Looking Great!</h3>
              <p className="neuzeit-light-font text-gray-600 mb-6">Your artwork is ready for print</p>

              {/* Preview */}
              {state.originalPreviewUrl && (
                <div className="max-w-xs mx-auto mb-6">
                  <img
                    src={state.selectedVersion === 'enhanced' ? state.enhancedUrl! : state.originalPreviewUrl}
                    alt="Final artwork"
                    className="w-full rounded-[15px] shadow-lg"
                  />
                </div>
              )}

              {/* Quality badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 mb-6">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: printingColors.accent }} />
                <span className="neuzeit-font text-sm text-gray-700">
                  Quality Score: {state.selectedVersion === 'enhanced' ? state.enhancedAnalysis?.qualityScore : state.analysis?.qualityScore}/100
                </span>
              </div>

              {/* Continue button */}
              <button
                onClick={handleContinue}
                className="w-full max-w-sm mx-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-[15px] text-white neuzeit-font text-sm font-medium transition-all hover:opacity-90"
                style={{ backgroundColor: printingColors.accent }}
              >
                <CheckCircle className="w-5 h-5" />
                Continue to Order
              </button>

              {/* Upload different */}
              <button
                onClick={handleUploadNew}
                className="block w-full text-center mt-4 neuzeit-light-font text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Upload different artwork
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ArtworkUploadWizard;
