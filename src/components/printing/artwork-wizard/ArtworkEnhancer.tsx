import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle,
  ArrowRight,
  FileText,
  MessageCircle,
  Phone,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';
import { printingColors } from '../../../lib/printing-theme';
import { ENHANCEMENT_MESSAGES } from '../../../lib/artwork-constants';
import type { ArtworkAnalysis } from '../../../lib/artwork-types';
import QualityScoreRing from './QualityScoreRing';

interface ArtworkEnhancerProps {
  originalUrl: string;
  enhancedUrl: string;
  originalAnalysis: ArtworkAnalysis;
  enhancedAnalysis: ArtworkAnalysis;
  onUseEnhanced: () => void;
  onRequestHelp: (method: 'form' | 'whatsapp' | 'phone') => void;
}

const ArtworkEnhancer: React.FC<ArtworkEnhancerProps> = ({
  originalUrl,
  enhancedUrl,
  originalAnalysis,
  enhancedAnalysis,
  onUseEnhanced,
  onRequestHelp,
}) => {
  const [helpExpanded, setHelpExpanded] = useState(false);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${printingColors.accent}15` }}
        >
          <CheckCircle className="w-6 h-6" style={{ color: printingColors.accent }} />
        </div>
        <div>
          <h3 className="hearns-font text-2xl text-gray-900">{ENHANCEMENT_MESSAGES.complete.title}</h3>
          <p className="smilecake-font text-lg mt-1" style={{ color: printingColors.accent }}>
            {ENHANCEMENT_MESSAGES.complete.subtitle}
          </p>
        </div>
      </div>

      {/* Before/After comparison */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Before */}
        <div className="flex flex-col">
          <div className="aspect-square rounded-[15px] overflow-hidden bg-gray-100 mb-3">
            <img
              src={originalUrl}
              alt="Original"
              className="w-full h-full object-contain p-4"
            />
          </div>
          <div className="text-center">
            <p className="neuzeit-font text-sm text-gray-500">Before</p>
            <div className="flex items-center justify-center gap-2 mt-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: originalAnalysis.qualityScore < 50 ? '#dc2626' : '#f59e0b',
                }}
              />
              <span className="neuzeit-font text-lg text-gray-700">
                {originalAnalysis.qualityScore}
              </span>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg z-10">
          <ArrowRight className="w-5 h-5" style={{ color: printingColors.accent }} />
        </div>

        {/* After */}
        <div className="flex flex-col">
          <div className="aspect-square rounded-[15px] overflow-hidden bg-gray-100 mb-3 relative">
            <img
              src={enhancedUrl}
              alt="Enhanced"
              className="w-full h-full object-contain p-4"
            />
            <div
              className="absolute top-3 right-3 px-2 py-1 rounded-[10px] text-xs font-medium text-white"
              style={{ backgroundColor: printingColors.accent }}
            >
              Enhanced
            </div>
          </div>
          <div className="text-center">
            <p className="neuzeit-font text-sm text-gray-500">After</p>
            <div className="flex items-center justify-center gap-2 mt-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: printingColors.accent }}
              />
              <span className="neuzeit-font text-lg" style={{ color: printingColors.accent }}>
                {enhancedAnalysis.qualityScore}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quality improvement summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-4 p-4 rounded-[15px] mb-6"
        style={{ backgroundColor: `${printingColors.accent}10` }}
      >
        <div className="flex items-center gap-2">
          <span className="neuzeit-font text-gray-600">Quality:</span>
          <span className="neuzeit-font text-lg text-gray-400">{originalAnalysis.qualityScore}</span>
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <span className="neuzeit-font text-lg font-medium" style={{ color: printingColors.accent }}>
            {enhancedAnalysis.qualityScore}/100
          </span>
          <CheckCircle className="w-5 h-5" style={{ color: printingColors.accent }} />
        </div>
      </motion.div>

      {/* Use enhanced button */}
      <button
        onClick={onUseEnhanced}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-[15px] text-white neuzeit-font text-sm font-medium transition-all hover:opacity-90"
        style={{ backgroundColor: printingColors.accent }}
      >
        <CheckCircle className="w-5 h-5" />
        Use Enhanced Version
      </button>

      {/* Help section */}
      <div className="mt-6 border-t border-gray-200 pt-6">
        <button
          onClick={() => setHelpExpanded(!helpExpanded)}
          className="w-full flex items-center justify-between"
        >
          <span className="neuzeit-light-font text-sm text-gray-500">
            Not quite right? Our team can help.
          </span>
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
    </div>
  );
};

export default ArtworkEnhancer;
