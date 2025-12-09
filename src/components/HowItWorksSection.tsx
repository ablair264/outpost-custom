import React from 'react';
import { LucideIcon, Mail, Palette, CheckCircle2, Package, Truck, Camera, FileText, Scissors } from 'lucide-react';
import BrushStrokeCircle from './BrushStrokeCircle';

// Pre-defined step configurations for different service types
export type ServiceType =
  | 'pavement-signs'
  | 'vehicle-signwriting'
  | 'window-film'
  | 'gazebos'
  | 'tablecloths'
  | 'parasols'
  | 'glass-manifestation'
  | 'signboards'
  | 'projecting-signs'
  | 'generic';

export interface Step {
  title: string;
  description: string;
  icon: LucideIcon;
}

// Default steps that work for most signage services
const defaultSteps: Step[] = [
  {
    title: 'Get a FREE quote',
    description: 'Share your requirements and receive a no-obligation quote within 24 hours.',
    icon: Mail,
  },
  {
    title: 'Design Stage',
    description: 'Submit your artwork or let our design team create eye-catching visuals for you.',
    icon: Palette,
  },
  {
    title: 'Approve your order',
    description: 'Review mockups, sign off on the design, and confirm pricing to begin production.',
    icon: CheckCircle2,
  },
  {
    title: 'Order up!',
    description: 'Collect from our Kidderminster unit or arrange delivery from just £10.',
    icon: Package,
  },
];

// Service-specific step configurations
const serviceSteps: Record<ServiceType, Step[]> = {
  'pavement-signs': defaultSteps,
  'glass-manifestation': defaultSteps,
  'signboards': defaultSteps,
  'projecting-signs': defaultSteps,
  'vehicle-signwriting': [
    {
      title: 'FREE consultation',
      description: 'For standard vehicles, we use our library of scaled drawings. For custom vehicles, visit our Kidderminster unit for measurements.',
      icon: Camera,
    },
    {
      title: 'FREE quote + mockup',
      description: 'Send us your logo and our design team will create a visual of how your vehicle could look.',
      icon: Palette,
    },
    {
      title: 'Approve your order',
      description: 'After approval, book a slot. We have late nights on Wednesdays or midday Saturdays. We can also come to you.',
      icon: CheckCircle2,
    },
    {
      title: 'Order up!',
      description: 'Bring your vehicle to our unit, or our professional installation team will meet you at your location.',
      icon: Truck,
    },
  ],
  'window-film': [
    {
      title: 'Measure your windows',
      description: 'Measure the glass area you want covered - we recommend measuring twice to be sure.',
      icon: FileText,
    },
    {
      title: 'Design consultation',
      description: 'Choose from standard frosted patterns or submit custom artwork for branded privacy film.',
      icon: Palette,
    },
    {
      title: 'Approve your order',
      description: 'Review your mockup and measurements, then confirm to begin production.',
      icon: CheckCircle2,
    },
    {
      title: 'Collect or install',
      description: 'Collect for DIY application or book our professional fitting service.',
      icon: Package,
    },
  ],
  'gazebos': [
    {
      title: 'Choose your gazebo',
      description: 'Select from our range of sizes: 3x3m, 3x4.5m, or 3x6m premium pop-up gazebos.',
      icon: FileText,
    },
    {
      title: 'Design your branding',
      description: 'Full-colour dye-sublimation printing means no limits on your design. We can match any Pantone.',
      icon: Palette,
    },
    {
      title: 'Approve your mockup',
      description: 'Review your branded gazebo mockup from every angle before we begin production.',
      icon: CheckCircle2,
    },
    {
      title: 'Ready for events',
      description: 'Your branded gazebo ships fully assembled with carry bag and stakes included.',
      icon: Package,
    },
  ],
  'tablecloths': [
    {
      title: 'Select your size',
      description: 'Choose from standard 6ft or 8ft tablecloth sizes, or provide custom dimensions.',
      icon: Scissors,
    },
    {
      title: 'Design your cover',
      description: 'Full-wrap printing available. Submit your design or work with our team on layout.',
      icon: Palette,
    },
    {
      title: 'Approve the proof',
      description: 'Check colours and positioning on your digital proof before production.',
      icon: CheckCircle2,
    },
    {
      title: 'Event ready',
      description: 'Machine-washable fabric arrives folded with care instructions included.',
      icon: Package,
    },
  ],
  'parasols': [
    {
      title: 'Choose your style',
      description: 'Select from cantilever, centre-pole, or wall-mounted parasol designs.',
      icon: FileText,
    },
    {
      title: 'Brand your canopy',
      description: 'Full-colour printing on waterproof fabric. Add your logo, colours, and messaging.',
      icon: Palette,
    },
    {
      title: 'Approve the design',
      description: 'Review your parasol mockup and confirm specifications before we proceed.',
      icon: CheckCircle2,
    },
    {
      title: 'Delivery & setup',
      description: 'Parasols ship with bases and hardware. Installation service available on request.',
      icon: Truck,
    },
  ],
  'generic': defaultSteps,
};

interface HowItWorksSectionProps {
  serviceType?: ServiceType;
  customSteps?: Step[];
  title?: string;
  subtitle?: string;
  sectionId?: string;
  backgroundColor?: 'white' | 'light' | 'dark';
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  serviceType = 'generic',
  customSteps,
  title = "How's it work?",
  subtitle = "From concept to completion, we make the process simple and stress-free.",
  sectionId = 'how-it-works',
  backgroundColor = 'white',
}) => {
  const steps = customSteps || serviceSteps[serviceType];

  // Purple theme colors
  const colors = {
    primary: '#221c35',      // Deep purple
    secondary: '#383349',    // Medium purple
    accent: '#908d9a',       // Light purple/grey
    muted: '#c1c6c8',        // Muted grey
  };

  // Background styles based on variant
  const bgStyles = {
    white: 'bg-white',
    light: 'bg-gray-50',
    dark: 'bg-[#221c35]',
  };

  const textStyles = {
    white: { title: 'text-[#221c35]', subtitle: 'text-gray-600', step: 'text-gray-900', desc: 'text-gray-600' },
    light: { title: 'text-[#221c35]', subtitle: 'text-gray-600', step: 'text-gray-900', desc: 'text-gray-600' },
    dark: { title: 'text-white', subtitle: 'text-white/70', step: 'text-white', desc: 'text-white/70' },
  };

  const currentTextStyle = textStyles[backgroundColor];

  return (
    <>
      {/* Custom fonts */}
      <style>{`
        @font-face {
          font-family: 'Hearns';
          src: url('/fonts/Hearns/Hearns.woff') format('woff');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        .hearns-font {
          font-family: 'Hearns', Georgia, serif;
        }
      `}</style>

      <section
        id={sectionId}
        className={`relative py-24 px-6 md:px-12 lg:px-24 overflow-hidden ${bgStyles[backgroundColor]}`}
      >
        {/* Decorative background elements */}
        {backgroundColor !== 'dark' && (
          <>
            <div
              className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-[0.03]"
              style={{ background: `radial-gradient(circle, ${colors.secondary} 0%, transparent 70%)` }}
            />
            <div
              className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-[0.02]"
              style={{ background: `radial-gradient(circle, ${colors.accent} 0%, transparent 70%)` }}
            />
          </>
        )}

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className={`hearns-font text-5xl md:text-6xl lg:text-7xl ${currentTextStyle.title} mb-6`}>
              {title}
            </h2>
            <p className={`text-lg md:text-xl ${currentTextStyle.subtitle} max-w-2xl mx-auto leading-relaxed`}>
              {subtitle}
            </p>
            {/* Decorative line */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="w-12 h-[2px] bg-[#908d9a] rounded-full" />
              <div className="w-3 h-3 rounded-full bg-[#383349]" />
              <div className="w-12 h-[2px] bg-[#908d9a] rounded-full" />
            </div>
          </div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Brush Stroke Circle with Step Number */}
                  <BrushStrokeCircle
                    delay={idx * 200}
                    size={160}
                    strokeColor={colors.secondary}
                    progress={((idx + 1) / steps.length) * 100}
                    className="mb-8"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Icon
                        className="w-10 h-10 mb-1"
                        style={{ color: colors.secondary }}
                        strokeWidth={1.5}
                      />
                      <span
                        className="text-2xl font-black"
                        style={{ color: colors.primary }}
                      >
                        {idx + 1}
                      </span>
                    </div>
                  </BrushStrokeCircle>

                  {/* Step Title */}
                  <h3 className={`text-xl font-bold ${currentTextStyle.step} mb-3 group-hover:text-[#383349] transition-colors`}>
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p className={`${currentTextStyle.desc} leading-relaxed text-base`}>
                    {step.description}
                  </p>

                  {/* Connecting line (hidden on last item and mobile) */}
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-[80px] left-full w-full">
                      <div
                        className="h-[2px] w-[calc(100%-160px)] mx-auto opacity-20"
                        style={{
                          background: `linear-gradient(90deg, ${colors.secondary}, ${colors.accent})`,
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-10 py-4 rounded-lg text-white font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: colors.secondary,
                boxShadow: `0 10px 40px ${colors.secondary}40`,
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
    </>
  );
};

export default HowItWorksSection;
