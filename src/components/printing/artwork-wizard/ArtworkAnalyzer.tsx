import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Upload,
  HelpCircle,
  ChevronDown,
  FileText,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { printingColors } from '../../../lib/printing-theme';
import { QUALITY_MESSAGES } from '../../../lib/artwork-constants';
import type { ArtworkAnalysis } from '../../../lib/artwork-types';
import QualityScoreRing from './QualityScoreRing';
import ArtworkPreview from './ArtworkPreview';

interface ArtworkAnalyzerProps {
  analysis: ArtworkAnalysis;
  previewUrl: string;
  productTitle: string;
  onEnhance: () => void;
  onUploadNew: () => void;
  onRequestHelp: (method: 'form' | 'whatsapp' | 'phone') => void;
  onProceedAnyway?: () => void;
  onContinue?: () => void;
}

const ArtworkAnalyzer: React.FC<ArtworkAnalyzerProps> = ({
  analysis,
  previewUrl,
  productTitle,
  onEnhance,
  onUploadNew,
  onRequestHelp,
  onProceedAnyway,
  onContinue,
}) => {
  const [helpExpanded, setHelpExpanded] = useState(false);
  const { qualityTier, qualityScore, issues } = analysis;
  const messages = QUALITY_MESSAGES[qualityTier];

  const StatusIcon = qualityTier === 'good' ? CheckCircle : qualityTier === 'borderline' ? AlertTriangle : AlertCircle;
  const statusColor = qualityTier === 'good' ? printingColors.accent : qualityTier === 'borderline' ? '#f59e0b' : '#dc2626';

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${statusColor}15` }}
        >
          <StatusIcon className="w-6 h-6" style={{ color: statusColor }} />
        </div>
        <div>
          <h3 className="hearns-font text-2xl text-gray-900">{messages.title}</h3>
          <p className="neuzeit-light-font text-gray-600 mt-1">{messages.subtitle}</p>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Preview */}
        <ArtworkPreview
          imageUrl={previewUrl}
          analysis={analysis}
          productTitle={productTitle}
        />

        {/* Analysis details */}
        <div className="flex flex-col">
          {/* Quality score */}
          <div className="flex items-center gap-6 mb-6 p-4 rounded-[15px] bg-gray-50">
            <QualityScoreRing score={qualityScore} size="md" />
            <div>
              <p className="neuzeit-font text-lg text-gray-900">Quality Score</p>
              <p className="neuzeit-light-font text-sm text-gray-500">
                {qualityTier === 'good' && 'Excellent quality for print'}
                {qualityTier === 'borderline' && 'May print with minor issues'}
                {qualityTier === 'severe' && 'Likely to print poorly'}
              </p>
            </div>
          </div>

          {/* Issues list */}
          {issues.length > 0 && (
            <div className="space-y-3 mb-6">
              {issues.map((issue, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-[10px]"
                  style={{
                    backgroundColor: issue.severity === 'error' ? '#fef2f2' : '#fffbeb',
                  }}
                >
                  {issue.severity === 'error' ? (
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p
                      className="neuzeit-font text-sm font-medium"
                      style={{ color: issue.severity === 'error' ? '#dc2626' : '#d97706' }}
                    >
                      {issue.message}
                    </p>
                    <p className="neuzeit-light-font text-xs text-gray-600 mt-1">
                      {issue.recommendation}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* File details */}
          <div className="text-sm text-gray-500 neuzeit-light-font space-y-1 mb-6">
            <p>Format: {analysis.fileFormat}</p>
            <p>Dimensions: {analysis.width} x {analysis.height}px</p>
            <p>Print resolution: {analysis.dpiAtPrint} DPI</p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        {qualityTier === 'good' ? (
          /* Good quality - show continue button */
          <button
            onClick={onContinue}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-[15px] text-white neuzeit-font text-sm font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: printingColors.accent }}
          >
            <CheckCircle className="w-5 h-5" />
            Continue to Order
          </button>
        ) : (
          /* Issues found - show enhance/upload options */
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onEnhance}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-[15px] text-white neuzeit-font text-sm font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: printingColors.accent }}
            >
              <Sparkles className="w-5 h-5" />
              Enhance Image
              <span className="text-xs opacity-80 ml-1">FREE</span>
            </button>
            <button
              onClick={onUploadNew}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-[15px] border-2 neuzeit-font text-sm font-medium transition-all hover:bg-gray-50"
              style={{ borderColor: printingColors.neutral, color: printingColors.textDark }}
            >
              <Upload className="w-5 h-5" />
              Upload Different File
            </button>
          </div>
        )}

        {/* Proceed anyway for borderline */}
        {qualityTier === 'borderline' && onProceedAnyway && (
          <button
            onClick={onProceedAnyway}
            className="w-full text-center neuzeit-light-font text-sm text-gray-500 hover:text-gray-700 transition-colors py-2"
          >
            Continue anyway (not recommended)
          </button>
        )}
      </div>

      {/* Help section */}
      {qualityTier !== 'good' && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <button
            onClick={() => setHelpExpanded(!helpExpanded)}
            className="w-full flex items-center justify-between p-4 rounded-[15px] bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-gray-400" />
              <span className="neuzeit-font text-sm text-gray-700">Need help with your artwork?</span>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${helpExpanded ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {helpExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-3">
                  <button
                    onClick={() => onRequestHelp('form')}
                    className="w-full flex items-center gap-3 p-4 rounded-[15px] border-2 border-gray-200 hover:border-gray-300 transition-colors text-left"
                  >
                    <FileText className="w-5 h-5" style={{ color: printingColors.accent }} />
                    <div>
                      <p className="neuzeit-font text-sm font-medium text-gray-900">Submit Enquiry</p>
                      <p className="neuzeit-light-font text-xs text-gray-500">We'll review and get back within 24hrs</p>
                    </div>
                  </button>

                  <div className="flex gap-3">
                    <button
                      onClick={() => onRequestHelp('whatsapp')}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-[10px] neuzeit-font text-sm transition-colors"
                      style={{ backgroundColor: printingColors.offWhite, color: printingColors.textDark }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </button>
                    <button
                      onClick={() => onRequestHelp('phone')}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-[10px] neuzeit-font text-sm transition-colors"
                      style={{ backgroundColor: printingColors.offWhite, color: printingColors.textDark }}
                    >
                      <Phone className="w-4 h-4" />
                      Call Us
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ArtworkAnalyzer;
