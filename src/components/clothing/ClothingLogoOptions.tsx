import React from 'react';
import { motion } from 'motion/react';
import { Upload, Eye, Palette, Calendar, ArrowRight, Check, Shirt } from 'lucide-react';

export type LogoOptionPath = 'upload' | 'preview' | 'help' | 'consult';

interface LogoOption {
  id: LogoOptionPath;
  title: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  cta: string;
  recommended?: boolean;
}

interface ClothingLogoOptionsProps {
  onSelectPath: (path: LogoOptionPath) => void;
  productName?: string;
  productImage?: string;
  onPreviewLogo?: () => void;
}

// Theme colors - matching clothing pages
const clothingColors = {
  accent: '#64a70b',
  dark: '#183028',
  secondary: '#1e3a2f',
};

const ClothingLogoOptions: React.FC<ClothingLogoOptionsProps> = ({
  onSelectPath,
  productName = 'workwear',
  productImage,
  onPreviewLogo,
}) => {
  const options: LogoOption[] = [
    {
      id: 'upload',
      title: 'I have my logo ready',
      tagline: 'Quick & easy',
      description: 'Upload your logo and we\'ll create a mockup showing placement options.',
      icon: Upload,
      features: ['PNG, JPG, PDF, AI accepted', 'Free mockup included', 'Preview on garment'],
      cta: 'Upload Logo',
      recommended: true,
    },
    {
      id: 'help',
      title: 'I need design help',
      tagline: 'From £25',
      description: 'Don\'t have a logo? Our in-house design team can create one for you.',
      icon: Palette,
      features: ['Professional designers', 'Logo digitisation', 'Unlimited revisions'],
      cta: 'Get Design Help',
    },
    {
      id: 'consult',
      title: 'Let\'s discuss my project',
      tagline: 'Free consultation',
      description: 'Book a call to discuss uniforms, quantities, and customisation options.',
      icon: Calendar,
      features: ['No obligation', 'Bulk pricing advice', 'Same-day availability'],
      cta: 'Book a Call',
    },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8 md:mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 mb-4"
        >
          <Shirt className="w-4 h-4" style={{ color: clothingColors.accent }} />
          <span className="neuzeit-font text-sm text-white/70">Customise Your {productName}</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="hearns-font text-3xl md:text-4xl text-white mb-3"
        >
          Do you have a logo?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="neuzeit-light-font text-base text-white/60 max-w-lg mx-auto"
        >
          Let us know where you are and we'll guide you through the process
        </motion.p>
      </div>

      {/* Main Options */}
      <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-8">
        {options.map((option, index) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + index * 0.1 }}
            onClick={() => onSelectPath(option.id)}
            className="group relative text-left"
          >
            {/* Card */}
            <div
              className={`
                relative h-full p-5 md:p-6 rounded-[15px] border-2 transition-all duration-300
                ${option.recommended
                  ? 'border-[#64a70b] bg-[#64a70b]/10'
                  : 'border-white/20 hover:border-[#64a70b]/50 bg-white/5'
                }
                group-hover:shadow-xl group-hover:shadow-[#64a70b]/10
                group-hover:-translate-y-1
              `}
            >
              {/* Recommended badge */}
              {option.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold neuzeit-font"
                    style={{ backgroundColor: clothingColors.accent, color: 'white' }}
                  >
                    Most Popular
                  </span>
                </div>
              )}

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-[10px] flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: option.recommended ? clothingColors.accent : `${clothingColors.accent}25`,
                }}
              >
                <option.icon
                  className="w-6 h-6 transition-colors"
                  style={{ color: option.recommended ? 'white' : clothingColors.accent }}
                />
              </div>

              {/* Tagline */}
              <span
                className="embossing-font text-sm block mb-1.5 tracking-wide"
                style={{ color: clothingColors.accent }}
              >
                {option.tagline}
              </span>

              {/* Title */}
              <h3 className="hearns-font text-xl md:text-2xl text-white mb-2 leading-tight">
                {option.title}
              </h3>

              {/* Description */}
              <p className="neuzeit-light-font text-white/60 text-sm mb-5 leading-relaxed">
                {option.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-5">
                {option.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: clothingColors.accent }}
                    />
                    <span className="neuzeit-font text-sm text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div
                className={`
                  inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px]
                  neuzeit-font text-sm font-semibold transition-all duration-300
                  ${option.recommended
                    ? 'bg-[#64a70b] text-white group-hover:bg-[#578f09]'
                    : 'bg-white/10 text-white group-hover:bg-[#64a70b]'
                  }
                `}
              >
                {option.cta}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Preview Logo Option - Highlighted separately */}
      {onPreviewLogo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <button
            onClick={onPreviewLogo}
            className="w-full p-4 rounded-[15px] border-2 border-dashed border-white/30 hover:border-[#64a70b] bg-white/5 hover:bg-[#64a70b]/10 transition-all duration-300 flex items-center justify-center gap-4 group"
          >
            {productImage && (
              <div className="w-16 h-16 rounded-[10px] overflow-hidden bg-white flex-shrink-0">
                <img src={productImage} alt="" className="w-full h-full object-contain p-2" />
              </div>
            )}
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="w-5 h-5" style={{ color: clothingColors.accent }} />
                <span className="hearns-font text-lg text-white group-hover:text-[#64a70b] transition-colors">
                  Preview Your Logo First
                </span>
              </div>
              <p className="neuzeit-light-font text-sm text-white/50">
                Upload your logo and see how it looks on this garment before ordering
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-[#64a70b] transition-all group-hover:translate-x-1" />
          </button>
        </motion.div>
      )}

      {/* Trust indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="pt-6 border-t border-white/10"
      >
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-xs md:text-sm text-white/50">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" style={{ color: clothingColors.accent }} />
            <span className="neuzeit-font">Free mockup on all orders</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" style={{ color: clothingColors.accent }} />
            <span className="neuzeit-font">No payment until you approve</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" style={{ color: clothingColors.accent }} />
            <span className="neuzeit-font">5-10 working day turnaround</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ClothingLogoOptions;
