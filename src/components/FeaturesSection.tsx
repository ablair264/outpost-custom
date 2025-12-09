import React from 'react';
import { Leaf, Paintbrush, Palette, Timer } from 'lucide-react';

const featureItems = [
  {
    icon: Paintbrush,
    title: 'MADE TO ORDER',
    body: 'Our business is founded on manufacturing products that are exactly to your specification. Mix and match products with bespoke customisation and creative design.',
  },
  {
    icon: Timer,
    title: 'FAST TURNAROUND',
    body: 'With a dedicated in-house production team specialising in each stage of customisation, we have the ability to meet your deadlines with express service when needed.',
  },
  {
    icon: Palette,
    title: 'IN-HOUSE DESIGN',
    body: 'With all orders we offer an initial design consultation and give you an idea of how your customisation will look. Our qualified graphic designers can also provide a full design service.',
  },
  {
    icon: Leaf,
    title: 'TRUSTED MATERIALS',
    body: 'We use trusted brands to make sure our customers only get the best that is available.',
    note: 'Recycled & Sustainable options are available across all our products & services',
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="bg-[#183028] py-8 sm:py-12 md:py-24">
      <style>{`
        @font-face {
          font-family: 'Embossing Tape';
          src: url('/fonts/embossing_tape/embosst3.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Neuzeit Grotesk';
          src: url('/fonts/font/NeuzeitGro-Reg.woff') format('woff');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
        .embossing-font {
          font-family: 'Embossing Tape', monospace;
          letter-spacing: 0.12em;
        }
        @media (min-width: 640px) {
          .embossing-font {
            letter-spacing: 0.2em;
          }
        }
        .body-font {
          font-family: 'Neuzeit Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-3 sm:px-6 md:px-10">
        {/* Mobile: Compact 2x2 grid | Tablet+: Standard layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-5 sm:gap-8 md:gap-12">
          {featureItems.map(({ icon: Icon, title, body, note }) => (
            <div key={title} className="text-center text-white flex flex-col items-center">
              {/* Icon: Small on mobile */}
              <Icon className="h-6 w-6 sm:h-10 sm:w-10 md:h-12 md:w-12 text-white" strokeWidth={1.5} />

              {/* Title: Compact on mobile */}
              <h3 className="embossing-font text-[13px] sm:text-xl md:text-2xl lg:text-[26px] uppercase mt-2 sm:mt-4 md:mt-5 text-white leading-tight">
                {title}
              </h3>

              {/* Description: Hidden on mobile, visible on sm+ */}
              <p className="body-font hidden sm:block text-sm md:text-base leading-relaxed mt-3 md:mt-4 max-w-xs text-white">
                {body}
              </p>

              {/* Mobile-only: Shortened description */}
              <p className="body-font sm:hidden text-[11px] leading-snug mt-1.5 text-white/80 line-clamp-2 px-1">
                {body.split('.')[0]}.
              </p>

              {note && (
                <p className="body-font hidden sm:block text-sm md:text-base font-semibold leading-relaxed mt-3 md:mt-4 max-w-xs text-white">
                  {note}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
