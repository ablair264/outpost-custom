import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Palette, Download, Mail, ExternalLink } from 'lucide-react';
import { printingColors } from '../../lib/printing-theme';

type TabId = 'have-artwork' | 'need-help';

interface ArtworkSubmissionTabsProps {
  className?: string;
}

const tabs: { id: TabId; label: string }[] = [
  { id: 'have-artwork', label: 'I have artwork ready' },
  { id: 'need-help', label: 'I need help' },
];

export const ArtworkSubmissionTabs: React.FC<ArtworkSubmissionTabsProps> = ({
  className,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>('have-artwork');

  return (
    <div className={className}>
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative flex-1 py-4 px-4 text-sm md:text-base font-medium transition-colors"
            style={{
              color: activeTab === tab.id ? printingColors.accent : '#666',
            }}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="artwork-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full"
                style={{ backgroundColor: printingColors.accent }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="py-6"
        >
          {activeTab === 'have-artwork' ? (
            <HaveArtworkContent />
          ) : (
            <NeedHelpContent />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// "I have artwork ready" tab content
const HaveArtworkContent: React.FC = () => (
  <div className="space-y-4">
    <p className="text-gray-600 text-sm mb-6">
      Great! Here's how to submit your artwork for a FREE artwork check:
    </p>

    <div className="space-y-3">
      {/* Email PDF option */}
      <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${printingColors.accent}20` }}
        >
          <Mail className="w-5 h-5" style={{ color: printingColors.accent }} />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1" style={{ color: printingColors.dark }}>
            Email your PDF artwork
          </h4>
          <p className="text-gray-500 text-sm mb-2">
            Send your print-ready PDF files directly to our team.
          </p>
          <a
            href="mailto:info@outpostcustom.co.uk?subject=Artwork Submission"
            className="inline-flex items-center gap-1 text-sm font-medium"
            style={{ color: printingColors.accent }}
          >
            info@outpostcustom.co.uk
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Canva option */}
      <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${printingColors.accent}20` }}
        >
          <FileText className="w-5 h-5" style={{ color: printingColors.accent }} />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1" style={{ color: printingColors.dark }}>
            Share from Canva
          </h4>
          <p className="text-gray-500 text-sm">
            Designed in Canva? Share your project directly to{' '}
            <span className="font-medium">info@outpostcustom.co.uk</span>
          </p>
        </div>
      </div>

      {/* Download template option */}
      <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${printingColors.accent}20` }}
        >
          <Download className="w-5 h-5" style={{ color: printingColors.accent }} />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1" style={{ color: printingColors.dark }}>
            Download InDesign Template
          </h4>
          <p className="text-gray-500 text-sm mb-2">
            Use our FREE template to ensure your artwork is set up correctly.
          </p>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: printingColors.accent }}
          >
            <Download className="w-4 h-4" />
            Download Template
          </button>
        </div>
      </div>
    </div>

    <div className="mt-6 p-4 rounded-xl border-2 border-dashed" style={{ borderColor: `${printingColors.accent}40` }}>
      <p className="text-sm text-center" style={{ color: printingColors.dark }}>
        <span className="font-semibold">FREE artwork check</span> on all supplied artwork
      </p>
    </div>
  </div>
);

// "I need help" tab content
const NeedHelpContent: React.FC = () => (
  <div className="space-y-4">
    <p className="text-gray-600 text-sm mb-6">
      No worries! Our design team can help you create the perfect design:
    </p>

    <div className="space-y-3">
      {/* Template design option */}
      <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${printingColors.accent}20` }}
        >
          <FileText className="w-5 h-5" style={{ color: printingColors.accent }} />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1" style={{ color: printingColors.dark }}>
            Template Design Service
          </h4>
          <p className="text-gray-500 text-sm mb-2">
            Submit your text and logo – we'll create your design using our standard template.
          </p>
          <div className="flex items-center justify-between">
            <span
              className="text-sm font-semibold"
              style={{ color: printingColors.accent }}
            >
              From £25 + VAT
            </span>
            <a
              href="mailto:info@outpostcustom.co.uk?subject=Design Request - Template Design"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-gray-50"
              style={{ borderColor: printingColors.accent, color: printingColors.accent }}
            >
              Get Started
            </a>
          </div>
        </div>
      </div>

      {/* Bespoke design option */}
      <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${printingColors.accent}20` }}
        >
          <Palette className="w-5 h-5" style={{ color: printingColors.accent }} />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1" style={{ color: printingColors.dark }}>
            Bespoke Design
          </h4>
          <p className="text-gray-500 text-sm mb-2">
            Need something unique? Our design team can create a completely custom design from scratch.
          </p>
          <a
            href="mailto:info@outpostcustom.co.uk?subject=Design Request - Bespoke Design Quote"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: printingColors.accent }}
          >
            Request a Quote
          </a>
        </div>
      </div>
    </div>

    {/* Designer info */}
    <div
      className="mt-6 p-4 rounded-xl"
      style={{ backgroundColor: `${printingColors.dark}08` }}
    >
      <p className="text-sm" style={{ color: printingColors.dark }}>
        Our in-house designer has <span className="font-semibold">over 15 years</span> of commercial print design experience and is ready to help bring your vision to life.
      </p>
    </div>
  </div>
);

export default ArtworkSubmissionTabs;
