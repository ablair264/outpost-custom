import React, { useState } from 'react';

// Types
interface FeatureItem {
  text: string;
  type: 'check' | 'cross';
}

interface VinylCardProps {
  tagline: React.ReactNode;
  title: string;
  features: FeatureItem[];
  imageSrc: string;
  imageAlt: string;
  imagePosition: 'left' | 'right';
  expandedTitle: string;
  expandedContent: React.ReactNode;
}

// Sub-components
function FeatureList({ features }: { features: FeatureItem[] }) {
  return (
    <ul className="space-y-3">
      {features.map((feature, idx) => (
        <li
          key={idx}
          className="flex items-center gap-3 group/item transition-transform duration-200 hover:translate-x-1"
        >
          <span
            className={`
              flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold
              transition-all duration-200
              ${feature.type === 'check'
                ? 'bg-[#64a70b]/10 text-[#64a70b] group-hover/item:bg-[#64a70b]/20'
                : 'bg-red-500/10 text-red-500 group-hover/item:bg-red-500/20'
              }
            `}
          >
            {feature.type === 'check' ? '✓' : '✗'}
          </span>
          <span
            className={`
              neuzeit-font text-base leading-relaxed transition-colors duration-200
              ${feature.type === 'check'
                ? 'text-neutral-800 group-hover/item:text-black'
                : 'text-neutral-400 group-hover/item:text-neutral-500'
              }
            `}
          >
            {feature.text}
          </span>
        </li>
      ))}
    </ul>
  );
}

function TextureOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        backgroundImage: 'url(/ConcreteTexture.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.35,
        mixBlendMode: 'multiply'
      }}
    />
  );
}

function ExpandIcon({ isExpanded }: { isExpanded: boolean }) {
  return (
    <svg
      className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function VinylCard({ tagline, title, features, imageSrc, imageAlt, imagePosition, expandedTitle, expandedContent }: VinylCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const content = (
    <div className="w-1/2 p-10 flex flex-col justify-center gap-6 relative z-20">
      <p className="smilecake-font text-neutral-700 text-2xl leading-snug tracking-wide">
        {tagline}
      </p>
      <h3
        className="aldivaro-font text-[#64a70b] text-3xl tracking-wide leading-[1.1]"
        style={{
          textShadow: '2px 2px 0px rgba(100, 167, 11, 0.15)'
        }}
      >
        {title}
      </h3>
      <FeatureList features={features} />
    </div>
  );

  const image = (
    <div className="w-1/2 min-h-[420px] overflow-hidden relative">
      <img
        src={imageSrc}
        alt={imageAlt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Subtle vignette on image */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)'
        }}
      />
    </div>
  );

  return (
    <div
      className="
        group relative rounded-2xl overflow-hidden bg-white
        shadow-lg shadow-black/20
        transition-all duration-300 ease-out
        hover:shadow-xl hover:shadow-black/30
        border border-neutral-200/50
      "
    >
      <TextureOverlay />

      {/* Subtle green accent line */}
      <div
        className="absolute top-0 h-1 w-full bg-gradient-to-r from-[#64a70b] to-[#7bc916] opacity-80 z-20"
      />

      <div className="relative z-10 flex flex-row">
        {imagePosition === 'left' ? (
          <>
            {image}
            {content}
          </>
        ) : (
          <>
            {content}
            {image}
          </>
        )}
      </div>

      {/* Expand Button */}
      <div className="relative z-20 border-t border-neutral-200/50">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="
            w-full px-10 py-4 flex items-center justify-between
            bg-neutral-50/80 hover:bg-neutral-100/80
            transition-colors duration-200
            group/btn
          "
        >
          <span className="neuzeit-font text-sm font-medium text-neutral-600 group-hover/btn:text-neutral-800 transition-colors">
            {isExpanded ? 'Show less' : 'Learn more'}
          </span>
          <span className="text-[#64a70b]">
            <ExpandIcon isExpanded={isExpanded} />
          </span>
        </button>

        {/* Expandable Content */}
        <div
          className={`
            overflow-hidden transition-all duration-500 ease-out
            ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="px-10 py-8 bg-neutral-50/50 border-t border-neutral-200/30">
            <h4 className="aldivaro-font text-[#64a70b] text-2xl mb-4 leading-tight">
              {expandedTitle}
            </h4>
            <div className="neuzeit-font text-neutral-600 text-sm leading-relaxed space-y-3">
              {expandedContent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Data
const PRINTED_VINYL_FEATURES: FeatureItem[] = [
  { text: 'Very small text and fine lines', type: 'check' },
  { text: 'Gradients', type: 'check' },
  { text: 'Photos', type: 'check' },
  { text: 'Grunge / stamp effects', type: 'check' },
  { text: 'Fluorescent / neon colours', type: 'cross' },
  { text: 'Metallic finishes', type: 'cross' },
  { text: 'Glitter + holographic', type: 'cross' }
];

const CUT_VINYL_FEATURES: FeatureItem[] = [
  { text: 'Fluorescent / neon colours', type: 'check' },
  { text: 'Metallic finishes', type: 'check' },
  { text: 'Glitter + holographic', type: 'check' },
  { text: 'Very small text and fine lines', type: 'cross' },
  { text: 'Gradients', type: 'cross' },
  { text: 'Photos', type: 'cross' },
  { text: 'Grunge / stamp effects', type: 'cross' }
];

const PRINTED_VINYL_EXPANDED = (
  <>
    <p>
      Printed vinyl is exactly what it sounds like: inks are used to print a design onto clear or white vinyl. Printed vinyl is ideal for multiple colours, gradients, shading, photographs and complex illustrations.
    </p>
    <p>
      Due to the ink being on the surface of the vinyl, the colour can fade quicker than cut vinyl which has the colour throughout the material.
    </p>
  </>
);

const CUT_VINYL_EXPANDED = (
  <>
    <p>
      A specialist machine follows the design using a sharp blade, which cuts out shapes and letters from pre-coloured rolls of vinyl. This gives a sharper edge to the artwork than printed graphics.
    </p>
    <p>
      Cut vinyl decals have no background, the background that you see behind the cut vinyl design is what you install it onto, be that a bare coloured surface or pre-applied coloured vinyl.
    </p>
  </>
);

// Main component
const CustomisationOptions: React.FC = () => {
  return (
    <>
      <style>{`
        @font-face {
          font-family: 'Smilecake';
          src: url('/fonts/smilecake/Smilecake.otf') format('opentype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Aldivaro Stamp';
          src: url('/fonts/aldivaro/Aldivaro Stamp Demo.otf') format('opentype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Neuzeit Grotesk';
          src: url('/fonts/neuzeit-grotesk-regular_freefontdownload_org/neuzeit-grotesk-regular.woff2') format('woff2'),
               url('/fonts/neuzeit-grotesk-regular_freefontdownload_org/neuzeit-grotesk-regular.woff') format('woff');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Hearns';
          src: url('/fonts/Hearns/Hearns.woff') format('woff');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        .smilecake-font {
          font-family: 'Smilecake', cursive;
        }
        .aldivaro-font {
          font-family: 'Aldivaro Stamp', serif;
        }
        .neuzeit-font {
          font-family: 'Neuzeit Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .hearns-font {
          font-family: 'Hearns', Georgia, serif;
        }
      `}</style>

      <section className="relative py-16 px-6 md:px-12 bg-[#333333] overflow-hidden">
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-[1600px] mx-auto relative z-10">
          {/* Header */}
          <header className="mb-12">
            <h2
              className="hearns-font text-white text-5xl md:text-6xl lg:text-7xl leading-tight"
              style={{
                textShadow: '3px 3px 6px rgba(0,0,0,0.3)'
              }}
            >
              CUSTOMISATION
            </h2>
            <p
              className="smilecake-font text-[#64a70b] text-4xl md:text-5xl lg:text-6xl -mt-1"
              style={{
                textShadow: '2px 2px 4px rgba(100, 167, 11, 0.3)'
              }}
            >
              OPTIONS
            </p>
          </header>

          {/* Cards */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Card - Printed Vinyl */}
            <div className="flex-1">
              <VinylCard
                tagline={<>for multicolour artwork,<br />gradients, textures, and photos</>}
                title="PRINTED VINYL"
                features={PRINTED_VINYL_FEATURES}
                imageSrc="/images/stroke.jpg"
                imageAlt="Printed Vinyl Example"
                imagePosition="right"
                expandedTitle="What is Printed Vinyl?"
                expandedContent={PRINTED_VINYL_EXPANDED}
              />
            </div>

            {/* Right Card - Cut Vinyl */}
            <div className="flex-1">
              <VinylCard
                tagline="for simple designs, logos and lettering"
                title="CUT VINYL"
                features={CUT_VINYL_FEATURES}
                imageSrc="/images/stroke.jpg"
                imageAlt="Cut Vinyl Example"
                imagePosition="left"
                expandedTitle="What is Cut Vinyl?"
                expandedContent={CUT_VINYL_EXPANDED}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CustomisationOptions;
