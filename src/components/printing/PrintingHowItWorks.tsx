import React from 'react';
import { MessageCircle, Palette, CheckCircle2, Package, LucideIcon } from 'lucide-react';
import BrushStrokeCircle from '../BrushStrokeCircle';
import { printingColors, printingProcessSteps } from '../../lib/printing-theme';

// Icon mapping for the steps
const iconMap: Record<string, LucideIcon> = {
  MessageCircle,
  Palette,
  CheckCircle2,
  Package,
};

interface PrintingHowItWorksProps {
  title?: string;
  subtitle?: string;
  sectionId?: string;
  backgroundColor?: 'white' | 'light' | 'dark';
  compact?: boolean;
}

const PrintingHowItWorks: React.FC<PrintingHowItWorksProps> = ({
  title = "How's it work?",
  subtitle = "From concept to collection, we make the printing process simple and stress-free.",
  sectionId = 'how-it-works',
  backgroundColor = 'white',
  compact = false,
}) => {
  const steps = printingProcessSteps;

  // Background and text styles based on variant
  const bgStyles = {
    white: 'bg-white',
    light: 'bg-[#f8f8f8]',
    dark: `bg-[${printingColors.dark}]`,
  };

  const textStyles = {
    white: {
      title: `text-[${printingColors.dark}]`,
      subtitle: 'text-gray-600',
      step: 'text-gray-900',
      desc: 'text-gray-600',
    },
    light: {
      title: `text-[${printingColors.dark}]`,
      subtitle: 'text-gray-600',
      step: 'text-gray-900',
      desc: 'text-gray-600',
    },
    dark: {
      title: 'text-white',
      subtitle: 'text-white/70',
      step: 'text-white',
      desc: 'text-white/70',
    },
  };

  const currentTextStyle = textStyles[backgroundColor];

  // Compact version for product pages
  if (compact) {
    return (
      <section className="py-12 px-6 md:px-12 bg-[#f8f8f8]">
        <div className="max-w-5xl mx-auto">
          <h3 className="hearns-font text-3xl text-center mb-8" style={{ color: printingColors.dark }}>
            {title}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((step, idx) => {
              const Icon = iconMap[step.icon];
              return (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${printingColors.accent}20` }}
                  >
                    <Icon
                      className="w-7 h-7"
                      style={{ color: printingColors.accent }}
                      strokeWidth={1.5}
                    />
                  </div>
                  <span className="font-semibold text-sm" style={{ color: printingColors.dark }}>
                    {idx + 1}. {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Full version for landing page
  return (
    <section
      id={sectionId}
      className={`relative py-20 md:py-28 px-6 md:px-12 lg:px-24 overflow-hidden ${bgStyles[backgroundColor]}`}
    >
      {/* Decorative background elements */}
      {backgroundColor !== 'dark' && (
        <>
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-[0.04]"
            style={{ background: `radial-gradient(circle, ${printingColors.accent} 0%, transparent 70%)` }}
          />
          <div
            className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-[0.03]"
            style={{ background: `radial-gradient(circle, ${printingColors.dark} 0%, transparent 70%)` }}
          />
        </>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2
            className="hearns-font text-5xl md:text-6xl lg:text-7xl mb-6"
            style={{ color: backgroundColor === 'dark' ? '#fff' : printingColors.dark }}
          >
            {title}
          </h2>
          <p
            className="neuzeit-light-font text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: backgroundColor === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(51,51,51,0.7)' }}
          >
            {subtitle}
          </p>
          {/* Decorative line with green accent */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="w-12 h-[2px] rounded-full" style={{ backgroundColor: printingColors.neutral }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: printingColors.accent }} />
            <div className="w-12 h-[2px] rounded-full" style={{ backgroundColor: printingColors.neutral }} />
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {steps.map((step, idx) => {
            const Icon = iconMap[step.icon];
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center group"
              >
                {/* Brush Stroke Circle with Step Number */}
                <BrushStrokeCircle
                  delay={idx * 200}
                  size={150}
                  strokeColor={printingColors.accent}
                  progress={((idx + 1) / steps.length) * 100}
                  className="mb-6"
                >
                  <div className="flex flex-col items-center justify-center">
                    <Icon
                      className="w-9 h-9 mb-1"
                      style={{ color: printingColors.accent }}
                      strokeWidth={1.5}
                    />
                    <span
                      className="text-2xl font-black"
                      style={{ color: printingColors.dark }}
                    >
                      {idx + 1}
                    </span>
                  </div>
                </BrushStrokeCircle>

                {/* Step Title */}
                <h3
                  className="text-xl font-bold mb-3 transition-colors"
                  style={{ color: backgroundColor === 'dark' ? '#fff' : printingColors.dark }}
                >
                  {step.title}
                </h3>

                {/* Step Description */}
                <p
                  className="neuzeit-light-font leading-relaxed text-base"
                  style={{ color: backgroundColor === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(51,51,51,0.7)' }}
                >
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-10 py-4 rounded-lg text-white font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: printingColors.accent,
              boxShadow: `0 10px 40px ${printingColors.accent}40`,
            }}
          >
            Start Your Project
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default PrintingHowItWorks;
