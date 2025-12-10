import React from 'react';
import { motion } from 'motion/react';
import { Upload, Palette, Calendar, ArrowRight, Check, Shirt } from 'lucide-react';

export type ClothingSubmissionPath = 'ready' | 'help' | 'consult';

interface PathOption {
  id: ClothingSubmissionPath;
  title: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  cta: string;
  recommended?: boolean;
}

interface ClothingPathSelectorProps {
  onSelectPath: (path: ClothingSubmissionPath) => void;
  productName?: string;
  recommendedPath?: ClothingSubmissionPath;
}

// Theme colors - matching clothing pages
const clothingColors = {
  accent: '#64a70b',
  dark: '#183028',
  secondary: '#1e3a2f',
};

const ClothingPathSelector: React.FC<ClothingPathSelectorProps> = ({
  onSelectPath,
  productName = 'workwear',
  recommendedPath = 'ready',
}) => {
  const paths: PathOption[] = [
    {
      id: 'ready',
      title: 'I have my logo ready',
      tagline: 'Quick & easy',
      description: 'Upload your logo and we\'ll show you embroidery & print options.',
      icon: Upload,
      features: ['PNG, JPG, PDF, AI accepted', 'See placement preview', 'Free mockup included'],
      cta: 'Upload Logo',
      recommended: recommendedPath === 'ready',
    },
    {
      id: 'help',
      title: 'I need design help',
      tagline: 'From £25',
      description: 'Send us your ideas and our team will create your branded workwear design.',
      icon: Palette,
      features: ['Professional designers', 'Logo digitisation', 'Unlimited revisions'],
      cta: 'Get Design Help',
      recommended: recommendedPath === 'help',
    },
    {
      id: 'consult',
      title: 'Let\'s discuss my project',
      tagline: 'Free consultation',
      description: 'Book a call to discuss uniforms, quantities, and customisation options.',
      icon: Calendar,
      features: ['No obligation', 'Bulk pricing advice', 'Same-day availability'],
      cta: 'Book a Call',
      recommended: recommendedPath === 'consult',
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
          How can we help?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="neuzeit-light-font text-base text-white/60 max-w-lg mx-auto"
        >
          Choose the option that best fits where you are with your branding project
        </motion.p>
      </div>

      {/* Path Cards */}
      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        {paths.map((path, index) => (
          <motion.button
            key={path.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + index * 0.1 }}
            onClick={() => onSelectPath(path.id)}
            className="group relative text-left"
          >
            {/* Card */}
            <div
              className={`
                relative h-full p-5 md:p-6 rounded-[15px] border-2 transition-all duration-300
                ${path.recommended
                  ? 'border-[#64a70b] bg-[#64a70b]/10'
                  : 'border-white/20 hover:border-[#64a70b]/50 bg-white/5'
                }
                group-hover:shadow-xl group-hover:shadow-[#64a70b]/10
                group-hover:-translate-y-1
              `}
            >
              {/* Recommended badge */}
              {path.recommended && (
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
                  backgroundColor: path.recommended ? clothingColors.accent : `${clothingColors.accent}25`,
                }}
              >
                <path.icon
                  className="w-6 h-6 transition-colors"
                  style={{ color: path.recommended ? 'white' : clothingColors.accent }}
                />
              </div>

              {/* Tagline */}
              <span
                className="embossing-font text-sm block mb-1.5 tracking-wide"
                style={{ color: clothingColors.accent }}
              >
                {path.tagline}
              </span>

              {/* Title */}
              <h3 className="hearns-font text-xl md:text-2xl text-white mb-2 leading-tight">
                {path.title}
              </h3>

              {/* Description */}
              <p className="neuzeit-light-font text-white/60 text-sm mb-5 leading-relaxed">
                {path.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-5">
                {path.features.map((feature, i) => (
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
                  ${path.recommended
                    ? 'bg-[#64a70b] text-white group-hover:bg-[#578f09]'
                    : 'bg-white/10 text-white group-hover:bg-[#64a70b]'
                  }
                `}
              >
                {path.cta}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Trust indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 pt-6 border-t border-white/10"
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

export default ClothingPathSelector;
