import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CheckCircle2, XCircle, Mail} from 'lucide-react';
import SlimGridMotion from '../components/SlimGridMotion';
import CustomisationOptions from '../components/CustomisationOptions';
import { usePageTheme } from '../contexts/ThemeContext';
import HowItWorksSection from '../components/HowItWorksSection';

const PavementSigns: React.FC = () => {
  // Set purple theme for this page
  usePageTheme('purple');
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const pavementImages = Array.from({ length: 21 }, (_, index) => {
    const imageNum = (index % 4) + 1;
    return `/pavement-signs/pavement${imageNum}.jpg`;
  });

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(headingRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, delay: 0.3 })
    .fromTo(contentRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9 }, '-=0.6')
    .fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.4');
  }, []);

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'Hearns';
          src: url('/fonts/Hearns/Hearns.woff') format('woff');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
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
        .hearns-font {
          font-family: 'Hearns', Georgia, serif;
          font-weight: normal;
        }
        .smilecake-font {
          font-family: 'Smilecake', cursive;
          font-weight: normal;
        }
        .aldivaro-stamp {
          font-family: 'Aldivaro Stamp', serif;
          font-weight: normal;
        }
        @font-face {
          font-family: 'Embossing Tape';
          src: url('/fonts/embossing_tape/embosst3.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        .embossing-font {
          font-family: 'Embossing Tape', monospace;
        }
        @font-face {
          font-family: 'Neuzeit Grotesk';
          src: url('/fonts/neuzeit-grotesk-regular_freefontdownload_org/neuzeit-grotesk-regular.woff2') format('woff2'),
               url('/fonts/neuzeit-grotesk-regular_freefontdownload_org/neuzeit-grotesk-regular.woff') format('woff');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        .neuzeit-font {
          font-family: 'Neuzeit Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      <div className="min-h-screen bg-white">
        {/* Hero Section with SlimGridMotion */}
        <section className="relative h-[70vh] w-full overflow-hidden bg-[#221c35]">
          <div className="absolute inset-0">
            <SlimGridMotion items={pavementImages} gradientColor="#221c35" />
          </div>
          <div className="absolute inset-0 bg-black/50 z-[4]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent z-[5]" />

          <div className="relative z-10 h-full flex items-center px-6 md:px-12 lg:px-24">
            <div className="max-w-6xl mx-auto w-full">
              <div ref={headingRef} className="mb-8">
                <h1 className="hearns-font text-6xl md:text-7xl lg:text-8xl tracking-tight text-white mb-6 leading-tight">
                  Pavement &<br />Forecourt Signs
                </h1>
                <div className="h-1.5 w-24 bg-[#908d9a] rounded-full" />
              </div>
              <div ref={contentRef} className="max-w-2xl mb-10">
                <p className="text-2xl md:text-3xl text-[#c1c6c8] font-light leading-relaxed">
                  Capture passing footfall with free-standing signs
                </p>
              </div>
              <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#ordering-workflow"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#383349] text-white font-semibold text-base hover:bg-[#4a4460] transition-all duration-300 shadow-lg"
                >
                  How It Works
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-white bg-transparent text-white font-semibold text-base hover:bg-white/10 transition-all duration-300"
                >
                  Get Free Quote
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Stand Out & Get Noticed Section */}
        <section
          className="relative py-8 overflow-hidden"
          style={{
            backgroundImage: 'url(/BlackTextureBackground.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Secondary texture overlay */}
          <div
            className="absolute inset-0 z-[1] opacity-[0.19] pointer-events-none"
            style={{
              backgroundImage: 'url(/ConcreteTexture.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          <div className="max-w-[1600px] mx-auto px-8 md:px-16 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_0.5fr_1fr] gap-0 items-center min-h-[240px]">
              {/* Left Column - Stand Out / Get Noticed */}
              <div className="flex flex-col items-center justify-center text-center py-6">
                <h2 className="embossing-font text-[#908d9a] text-4xl md:text-5xl lg:text-6xl leading-tight tracking-wide">
                  STAND OUT
                </h2>
                <p className="embossing-font text-[#c1c6c8] text-3xl md:text-4xl lg:text-5xl leading-tight tracking-wide mt-1">
                  GET NOTICED
                </p>
              </div>

              {/* Middle Column - Pavement Sign Image */}
              <div className="flex items-center justify-center py-4">
                <img
                  src="/pavement-signs/Pavement-Sign-Mockup.webp"
                  alt="Pavement Sign Mockup"
                  className="w-auto h-[200px] md:h-[220px] object-contain"
                />
              </div>

              {/* Right Column - Description */}
              <div className="flex items-center justify-start py-6 md:pl-8">
                <p className="neuzeit-font text-white text-lg md:text-xl lg:text-2xl leading-[1.5] max-w-[500px]">
                  Free-standing pavement signs are an excellent way of catching the attention of passers by and increasing footfall.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How's it work? Section with Brush Stroke Animation */}
        <HowItWorksSection
          serviceType="pavement-signs"
          sectionId="ordering-workflow"
          subtitle="Choose from our standard frames or bring your own for rebranding. Our design team will help create eye-catching graphics to promote your business."
        />

        {/* Product Highlight: Eco Swing */}
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="hearns-font text-5xl md:text-6xl text-[#333333] mb-4">
                Eco Swing Pavement Sign
              </h2>
              <div className="h-1 w-24 bg-[#908d9a] mx-auto mb-6" />
              <p className="smilecake-font text-2xl text-[#908d9a]">Best for windy locations!</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center bg-[#f5f5f5] rounded-3xl p-8 md:p-12">
              <div>
                <img
                  src="/pavement-signs/pavement1.jpg"
                  alt="Eco Swing Pavement Sign"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="smilecake-font text-3xl text-[#333333] mb-4">Features</h3>
                  <ul className="space-y-3">
                    {[
                      'Water-fillable base with wheels',
                      'Frame available in black or white',
                      'Base made from recycled black PVC',
                      'Steel tubing construction',
                      'Double-sided aluminium panel',
                      'Easily swap out panels'
                    ].map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-0.5" />
                        <span className="text-[#333333]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl">
                    <h4 className="font-bold text-[#333333] mb-3">Panel Sizes</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">Small:</span> 430 × 625 mm</p>
                      <p><span className="font-semibold">Medium:</span> 500 × 750 mm</p>
                      <p><span className="font-semibold">Large:</span> 588 × 917 mm</p>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl">
                    <h4 className="font-bold text-[#333333] mb-3">Weights</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">Small:</span> 11 kg</p>
                      <p><span className="font-semibold">Medium:</span> 16 kg</p>
                      <p><span className="font-semibold">Large:</span> 13 kg / 31 kg filled</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[#666] italic">
                  Includes guy ropes, stakes (where applicable), and optional add-on panels with windows/doors.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Customisation Options */}
        <CustomisationOptions />

        {/* Build Quality & Support */}
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#f8f8f8]">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="hearns-font text-4xl md:text-5xl text-[#333333] mb-6">
                  Built to Last
                </h2>
                <p className="text-lg text-[#333333] leading-relaxed mb-4">
                  All frames manufactured from high-quality materials, built to withstand
                  exterior conditions.
                </p>
                <p className="text-lg text-[#333333] leading-relaxed mb-6">
                  Specify wind exposure to match the right frame type for your location.
                </p>
                <p className="text-base text-[#666] italic">
                  Replacement panels or graphics available so frames can be reused across campaigns.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="smilecake-font text-3xl text-[#908d9a] mb-6">Need Support?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#333333]">Help selecting frame type & size</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#333333]">Customisation method advice</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#333333]">Design assistance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#333333]">Installation guidance</span>
                  </li>
                </ul>
                <a
                  href="/contact"
                  className="mt-8 w-full inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#383349] text-white font-semibold hover:bg-[#4a4460] transition-all duration-300"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Our Team
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PavementSigns;
