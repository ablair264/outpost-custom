import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Image, ZoomIn, GitCompare } from 'lucide-react';
import { printingColors } from '../../../lib/printing-theme';
import type { ArtworkAnalysis } from '../../../lib/artwork-types';

interface ArtworkPreviewProps {
  imageUrl: string;
  analysis: ArtworkAnalysis;
  productTitle?: string;
}

type PreviewTab = 'preview' | 'zoom' | 'compare';

const ArtworkPreview: React.FC<ArtworkPreviewProps> = ({
  imageUrl,
  analysis,
  productTitle = 'Product',
}) => {
  const [activeTab, setActiveTab] = useState<PreviewTab>('preview');

  const tabs = [
    { id: 'preview' as const, label: 'Preview', icon: Image },
    { id: 'zoom' as const, label: 'Zoom Detail', icon: ZoomIn },
    { id: 'compare' as const, label: 'Quality Compare', icon: GitCompare },
  ];

  return (
    <div className="w-full">
      {/* Tab buttons */}
      <div className="flex gap-1 p-1 rounded-[10px] bg-gray-100 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-[10px]
              neuzeit-font text-sm font-medium transition-all duration-200
            `}
            style={{
              backgroundColor: activeTab === tab.id ? printingColors.accent : 'transparent',
              color: activeTab === tab.id ? 'white' : printingColors.textMuted,
            }}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Preview content */}
      <div className="relative aspect-[4/3] rounded-[15px] overflow-hidden bg-gray-100">
        {activeTab === 'preview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex items-center justify-center p-4"
          >
            <img
              src={imageUrl}
              alt="Artwork preview"
              className="max-w-full max-h-full object-contain rounded-[10px] shadow-lg"
            />
          </motion.div>
        )}

        {activeTab === 'zoom' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full relative overflow-hidden"
          >
            {/* Zoomed in view showing pixelation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: '400%',
                  backgroundPosition: 'center',
                  imageRendering: 'pixelated',
                }}
              />
            </div>
            {/* Info overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/70 backdrop-blur-sm rounded-[10px] px-4 py-3">
                <p className="neuzeit-font text-white text-sm">
                  <span className="font-medium">Actual print resolution:</span>{' '}
                  {analysis.dpiAtPrint} DPI
                  {analysis.dpiAtPrint < 300 && (
                    <span className="text-amber-400 ml-2">(300 DPI recommended)</span>
                  )}
                </p>
                {analysis.dpiAtPrint < 150 && (
                  <p className="neuzeit-light-font text-white/70 text-xs mt-1">
                    This preview shows how pixelation may appear at print size
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'compare' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex"
          >
            {/* Side by side comparison */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 border-r border-gray-200">
              <img
                src={imageUrl}
                alt="Your artwork"
                className="max-w-full max-h-[70%] object-contain rounded-[10px]"
                style={{ imageRendering: 'pixelated' }}
              />
              <div className="mt-3 text-center">
                <p className="neuzeit-font text-sm text-gray-800">Your File</p>
                <p className="neuzeit-light-font text-xs text-gray-500">
                  {analysis.dpiAtPrint} DPI
                </p>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <img
                src={imageUrl}
                alt="Recommended quality"
                className="max-w-full max-h-[70%] object-contain rounded-[10px] blur-0"
              />
              <div className="mt-3 text-center">
                <p className="neuzeit-font text-sm text-gray-800">Recommended</p>
                <p className="neuzeit-light-font text-xs" style={{ color: printingColors.accent }}>
                  300 DPI
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ArtworkPreview;
