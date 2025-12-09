import React from 'react';
import { motion } from 'motion/react';
import { Upload, Palette, Calendar, ArrowRight, Check } from 'lucide-react';
import { printingColors } from '../../../lib/printing-theme';

export type SubmissionPath = 'ready' | 'help' | 'consult';

interface PathOption {
  id: SubmissionPath;
  title: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  cta: string;
  recommended?: boolean;
}

interface PathSelectorProps {
  onSelectPath: (path: SubmissionPath) => void;
  serviceName?: string;
  recommendedPath?: SubmissionPath;
}

const PathSelector: React.FC<PathSelectorProps> = ({
  onSelectPath,
  serviceName = 'printing',
  recommendedPath = 'ready',
}) => {
  const paths: PathOption[] = [
    {
      id: 'ready',
      title: 'I have artwork ready',
      tagline: 'Quick & easy',
      description: 'Upload your print-ready files and we\'ll take care of the rest.',
      icon: Upload,
      features: ['PDF, PNG, JPG accepted', 'Import from Canva', 'Free artwork check'],
      cta: 'Upload Files',
      recommended: recommendedPath === 'ready',
    },
    {
      id: 'help',
      title: 'I need design help',
      tagline: 'From £25',
      description: 'Send us your logo and ideas - our design team will create your artwork.',
      icon: Palette,
      features: ['Template designs from £25', 'Professional designers', 'Unlimited revisions'],
      cta: 'Get Started',
      recommended: recommendedPath === 'help',
    },
    {
      id: 'consult',
      title: 'Let\'s discuss my project',
      tagline: 'Free consultation',
      description: 'Book a call to talk through your requirements with our team.',
      icon: Calendar,
      features: ['No obligation', 'Expert advice', 'Same-day availability'],
      cta: 'Book a Call',
      recommended: recommendedPath === 'consult',
    },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hearns-font text-4xl md:text-5xl text-white mb-4"
        >
          How can we help?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="neuzeit-light-font text-lg text-white/60 max-w-xl mx-auto"
        >
          Choose the option that best fits where you are with your {serviceName} project
        </motion.p>
      </div>

      {/* Path Cards */}
      <div className="grid md:grid-cols-3 gap-6">
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
                relative h-full p-6 md:p-8 rounded-[15px] border-2 transition-all duration-300
                ${path.recommended
                  ? 'border-[#64a70b] bg-[#64a70b]/10'
                  : 'border-white/20 hover:border-[#64a70b]/50 bg-white/5'
                }
                group-hover:shadow-xl group-hover:shadow-[#64a70b]/10
                group-hover:-translate-y-1
              `}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-[10px] flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: path.recommended ? printingColors.accent : `${printingColors.accent}25`,
                }}
              >
                <path.icon
                  className="w-7 h-7 transition-colors"
                  style={{ color: path.recommended ? 'white' : printingColors.accent }}
                />
              </div>

              {/* Tagline */}
              <span
                className="smilecake-font text-base block mb-2"
                style={{ color: printingColors.accent }}
              >
                {path.tagline}
              </span>

              {/* Title */}
              <h3 className="hearns-font text-2xl text-white mb-3 leading-tight">
                {path.title}
              </h3>

              {/* Description */}
              <p className="neuzeit-light-font text-white/60 text-sm mb-6 leading-relaxed">
                {path.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {path.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: printingColors.accent }}
                    />
                    <span className="neuzeit-font text-sm text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div
                className={`
                  inline-flex items-center gap-2 px-5 py-3 rounded-[10px]
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
        className="mt-10 pt-8 border-t border-white/10"
      >
        <div className="flex flex-wrap justify-center gap-8 text-sm text-white/50">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" style={{ color: printingColors.accent }} />
            <span className="neuzeit-font">Free artwork check on all orders</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" style={{ color: printingColors.accent }} />
            <span className="neuzeit-font">No payment until you approve</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" style={{ color: printingColors.accent }} />
            <span className="neuzeit-font">4-7 day turnaround</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PathSelector;
