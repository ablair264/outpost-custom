import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CheckCircle2, Umbrella, Mail, Palette, Package } from 'lucide-react';
import SlimGridMotion from '../components/SlimGridMotion';
import { usePageTheme } from '../contexts/ThemeContext';
import HowItWorksSection from '../components/HowItWorksSection';

const Parasols: React.FC = () => {
  // Set purple theme for this page
  usePageTheme('purple');
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const parasolImages = Array.from({ length: 21 }, (_, index) => {
    const imageNum = (index % 4) + 1;
    return `/parasols/parasol${imageNum}.jpg`;
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
          font-family: 'Embossing Tape';
          src: url('/fonts/embossing_tape/embosst3.ttf') format('truetype');
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
        .embossing-tape {
          font-family: 'Embossing Tape', monospace;
          font-weight: normal;
        }
      `}</style>

      <div className="min-h-screen bg-white">
        {/* Hero Section - Purple Palette */}
        <section className="relative h-[70vh] w-full overflow-hidden bg-[#221c35]">
          <div className="absolute inset-0">
            <SlimGridMotion items={parasolImages} gradientColor="#221c35" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#221c35]/80 via-[#221c35]/50 to-transparent z-[5]" />

          <div className="relative z-10 h-full flex items-center px-6 md:px-12 lg:px-24">
            <div className="max-w-6xl mx-auto w-full">
              <div ref={headingRef} className="mb-8">
                <h1 className="hearns-font text-6xl md:text-7xl lg:text-8xl tracking-tight text-white mb-6 leading-tight">
                  Branded<br />Parasols
                </h1>
                <div className="h-1.5 w-24 bg-[#908d9a] rounded-full" />
              </div>
              <div ref={contentRef} className="max-w-2xl mb-10">
                <p className="text-2xl md:text-3xl text-white/90 font-light leading-relaxed">
                  High-visibility branding for outdoor markets, hospitality terraces, and events
                </p>
              </div>
              <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#options"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#908d9a] text-white font-semibold text-base hover:bg-[#a39fa8] transition-all duration-300 shadow-lg"
                >
                  View Sizes
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-white bg-transparent text-white font-semibold text-base hover:bg-white/10 transition-all duration-300"
                >
                  Free Mockup
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Overview Section */}
        <section className="py-20 px-6 md:px-12 lg:px-24 bg-white relative">
          <div className="absolute bottom-10 left-10 opacity-10 pointer-events-none">
            <img src="/Website Assets/Circle_Grey.png" alt="" className="w-40 h-40" />
          </div>
          <div className="max-w-5xl mx-auto">
            <h2 className="smilecake-font text-5xl md:text-6xl text-[#221c35] mb-8 text-center">
              Shade Plus Branding
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#908d9a]/10 flex items-center justify-center">
                  <Umbrella className="w-8 h-8 text-[#908d9a]" />
                </div>
                <p className="text-lg text-[#333333]">
                  Supply your own parasol or select from vetted models
                </p>
              </div>
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#908d9a]/10 flex items-center justify-center">
                  <Palette className="w-8 h-8 text-[#908d9a]" />
                </div>
                <p className="text-lg text-[#333333]">
                  Custom printing on up to 6 panels per parasol
                </p>
              </div>
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#908d9a]/10 flex items-center justify-center">
                  <Package className="w-8 h-8 text-[#908d9a]" />
                </div>
                <p className="text-lg text-[#333333]">
                  Replacement canopies for refreshes or seasonal campaigns
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How's it work? Section with Brush Stroke Animation */}
        <HowItWorksSection
          serviceType="parasols"
          subtitle="Our branded parasols combine practical shade with high-visibility marketing. Available in multiple sizes with custom printing on up to 6 panels."
        />

        {/* Parasol Options */}
        <section id="options" className="py-24 px-6 md:px-12 lg:px-24 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="hearns-font text-5xl md:text-6xl text-[#221c35] mb-4">
                Parasol Options
              </h2>
              <div className="h-1 w-24 bg-[#908d9a] mx-auto" />
            </div>

            <div className="space-y-8">
              {/* 2.1m Parasols */}
              <div className="bg-gradient-to-br from-[#f8f8f8] to-white rounded-3xl p-8 md:p-12 border border-[#908d9a]/20">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="smilecake-font text-4xl text-[#221c35] mb-4">
                      2.1m Parasols
                    </h3>
                    <p className="text-xl font-semibold text-[#908d9a] mb-6">From £80 + VAT</p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                        <span className="text-[#333333]">Aluminium mast with crank-handle operation</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                        <span className="text-[#333333]">Six ribs for stability</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                        <span className="text-[#333333]">15kg base recommended (sold separately)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                        <span className="text-[#333333]">Colours: Black, Natural, Plum, Green (subject to availability)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                        <span className="text-[#333333]">Replacement canopies offered</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full bg-[#908d9a]/10 flex items-center justify-center border-4 border-[#908d9a]/20">
                      <Umbrella className="w-32 h-32 text-[#908d9a]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2.5m Parasols */}
              <div className="bg-gradient-to-br from-[#f8f8f8] to-white rounded-3xl p-8 md:p-12 border border-[#908d9a]/20">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="order-2 lg:order-1 flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full bg-[#908d9a]/10 flex items-center justify-center border-4 border-[#908d9a]/20">
                      <Package className="w-32 h-32 text-[#908d9a]" />
                    </div>
                  </div>
                  <div className="order-1 lg:order-2">
                    <h3 className="smilecake-font text-4xl text-[#221c35] mb-4">
                      2.5m Parasols
                    </h3>
                    <p className="text-xl font-semibold text-[#908d9a] mb-6">From £170 Round / £180 Square + VAT</p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                        <span className="text-[#333333]">Push-up mechanism</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                        <span className="text-[#333333]">38mm anodised aluminium pole</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                        <span className="text-[#333333]">19mm ribs for durability</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                        <span className="text-[#333333]">30kg base recommended</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                        <span className="text-[#333333]">Colours: Black, Natural, Green, Blue, Burgundy</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Customisation Pricing */}
        <section
          className="py-24 px-6 md:px-12 lg:px-24 bg-cover bg-center relative"
          style={{ backgroundImage: 'url(/Website Assets/ConcreteTexture.jpg)' }}
        >
          <div className="absolute inset-0 bg-[#221c35]/90" />
          <div className="relative z-10 max-w-6xl mx-auto">
            <h2 className="hearns-font text-5xl md:text-6xl text-white mb-16 text-center">
              Customisation Pricing
            </h2>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 mb-8">
              <p className="text-lg text-white/80 mb-8 text-center">
                Up to 500 × 300mm artwork per panel. Discounts for multiple panels:
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { panels: '1 panel', price: '£50', each: '£50 each' },
                  { panels: '2 panels', price: '£60', each: '£30 each' },
                  { panels: '3 panels', price: '£75', each: '£25 each' },
                  { panels: '4 panels', price: '£80', each: '£20 each' },
                  { panels: '6 panels', price: '£90', each: '£15 each' }
                ].map((option, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                    <div className="text-3xl font-bold text-[#908d9a] mb-2">{option.panels}</div>
                    <div className="text-2xl text-white mb-1">{option.price} + VAT</div>
                    <div className="text-white/60">{option.each}</div>
                  </div>
                ))}
              </div>

              <p className="text-white/80 mt-8 text-center italic">
                Bulk discounts available for multi-parasol orders
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <h3 className="smilecake-font text-3xl text-white mb-4">Printed Vinyl</h3>
                <p className="text-white/80 leading-relaxed">
                  Multicolour logos, gradients, detailed graphics with full-colour printing.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <h3 className="smilecake-font text-3xl text-white mb-4">Cut Vinyl</h3>
                <p className="text-white/80 leading-relaxed">
                  Sharp lettering or simple shapes without background for clean branding.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mix and Match */}
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#f8f8f8]">
          <div className="max-w-5xl mx-auto">
            <h2 className="hearns-font text-4xl md:text-5xl text-[#221c35] mb-6 text-center">
              Mix-and-Match Strategy
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#908d9a]/20">
                <h3 className="smilecake-font text-2xl text-[#908d9a] mb-4">Multiple Canopies</h3>
                <p className="text-[#333333] leading-relaxed">
                  Swap-out sets let you adjust branding per event or promotion, keeping your outdoor space fresh.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#908d9a]/20">
                <h3 className="smilecake-font text-2xl text-[#908d9a] mb-4">Custom Sizes</h3>
                <p className="text-[#333333] leading-relaxed">
                  Team can source alternative sizes/styles if you have specific requirements beyond standard options.
                </p>
              </div>
            </div>
            <div className="mt-12 text-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-10 py-4 rounded-lg bg-[#908d9a] text-white font-semibold text-lg hover:bg-[#a39fa8] transition-all duration-300 shadow-lg"
              >
                <Mail className="w-5 h-5 mr-2" />
                Get Free Quote & Mockup
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Parasols;
