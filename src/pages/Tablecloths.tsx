import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CheckCircle2, Frame, Ruler, Eye, Shield, Mail, Palette, Package, Table2 } from 'lucide-react'
import SlimGridMotion from '../components/SlimGridMotion';
import { usePageTheme } from '../contexts/ThemeContext';
import HowItWorksSection from '../components/HowItWorksSection';

const Tablecloths: React.FC = () => {
  // Set purple theme for this page
  usePageTheme('purple');
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const tableclothImages = Array.from({ length: 21 }, (_, index) => {
    const imageNum = (index % 4) + 1;
    return `/tablecloths/tablecloth${imageNum}.jpg`;
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
      `}</style>

      <div className="min-h-screen bg-white">
        {/* Hero Section - Palette A */}
        <section className="relative h-[70vh] w-full overflow-hidden bg-[#333333]">
          <div className="absolute inset-0">
            <SlimGridMotion items={tableclothImages} gradientColor="#333333" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#333333]/80 via-[#333333]/50 to-transparent z-[5]" />

          <div className="relative z-10 h-full flex items-center px-6 md:px-12 lg:px-24">
            <div className="max-w-6xl mx-auto w-full">
              <div ref={headingRef} className="mb-8">
                <h1 className="hearns-font text-6xl md:text-7xl lg:text-8xl tracking-tight text-white mb-6 leading-tight">
                  Branded<br />Tablecloths
                </h1>
                <div className="h-1.5 w-24 bg-[#908d9a] rounded-full" />
              </div>
              <div ref={contentRef} className="max-w-2xl mb-10">
                <p className="text-2xl md:text-3xl text-[#c1c6c8] font-light leading-relaxed">
                  Custom table covers for exhibitions, events, and trade shows
                </p>
              </div>
              <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#fabric-options"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#908d9a] text-white font-semibold text-base hover:bg-[#4a4460] transition-all duration-300 shadow-lg"
                >
                  View Options
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-white bg-transparent text-white font-semibold text-base hover:bg-white/10 transition-all duration-300"
                >
                  Free Quote
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Overview Section */}
        <section className="py-20 px-6 md:px-12 lg:px-24 bg-white relative">
          <div className="absolute top-10 left-10 opacity-10 pointer-events-none">
            <img src="/Website Assets/Arrow_Green.png" alt="" className="w-32 h-32 rotate-45" />
          </div>
          <div className="max-w-5xl mx-auto">
            <h2 className="smilecake-font text-5xl md:text-6xl text-[#333333] mb-8 text-center">
              Professional Event Presentation
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#908d9a]/10 flex items-center justify-center">
                  <Table2 className="w-8 h-8 text-[#908d9a]" />
                </div>
                <p className="text-lg text-[#333333]">
                  Dress trestle tables, registration desks, or merch counters
                </p>
              </div>
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#908d9a]/10 flex items-center justify-center">
                  <Palette className="w-8 h-8 text-[#908d9a]" />
                </div>
                <p className="text-lg text-[#333333]">
                  Highlight logos, slogans, or campaign artwork
                </p>
              </div>
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#908d9a]/10 flex items-center justify-center">
                  <Ruler className="w-8 h-8 text-[#908d9a]" />
                </div>
                <p className="text-lg text-[#333333]">
                  Standard or custom sizes to fit any table
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How's it work? Section with Brush Stroke Animation */}
        <HowItWorksSection
          serviceType="tablecloths"
          subtitle="Our custom tablecloths transform ordinary tables into branded display spaces. Choose from polyester throw, fitted, or stretch styles."
        />

        {/* Fabric & Style Options */}
        <section id="fabric-options" className="py-24 px-6 md:px-12 lg:px-24 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="hearns-font text-5xl md:text-6xl text-[#333333] mb-4">
                Fabric & Style Options
              </h2>
              <div className="h-1 w-24 bg-[#908d9a] mx-auto" />
            </div>

            <div className="space-y-8">
              {/* Polyester Throw */}
              <div className="bg-gradient-to-br from-[#f8f8f8] to-white rounded-3xl p-8 md:p-12 border-2 border-[#c1c6c8]/30">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="smilecake-font text-4xl text-[#333333] mb-4">
                      Polyester Throw
                    </h3>
                    <p className="text-xl font-semibold text-[#908d9a] mb-6">Most Versatile</p>
                    <p className="text-[#333333] mb-6 leading-relaxed">
                      Drapes over the table with box pleats or rounded corners; can cover 3 or 4 sides depending on access needs.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                        <span className="text-[#333333]">Wrinkle-resistant polyester blends</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                        <span className="text-[#333333]">Suited for dye-sublimation printing</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                        <span className="text-[#333333]">Fire-retardant fabrics available on request</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full bg-[#908d9a]/10 flex items-center justify-center border-4 border-[#908d9a]/20">
                      <Table2 className="w-32 h-32 text-[#908d9a]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Fitted Cover */}
                <div className="bg-gradient-to-br from-[#f8f8f8] to-white rounded-3xl p-8 border-2 border-[#c1c6c8]/30">
                  <h3 className="smilecake-font text-3xl text-[#333333] mb-4">
                    Fitted Cover
                  </h3>
                  <p className="text-lg font-semibold text-[#908d9a] mb-4">Crisp Silhouette</p>
                  <p className="text-[#333333] mb-6 leading-relaxed">
                    Sewn corners for a crisp silhouette; ideal for retail or exhibition pods where audiences see multiple sides.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                      <span className="text-[#333333]">Professional appearance</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                      <span className="text-[#333333]">Custom fit to table dimensions</span>
                    </div>
                  </div>
                </div>

                {/* Stretch Fabric */}
                <div className="bg-gradient-to-br from-[#f8f8f8] to-white rounded-3xl p-8 border-2 border-[#c1c6c8]/30">
                  <h3 className="smilecake-font text-3xl text-[#333333] mb-4">
                    Stretch Fabric
                  </h3>
                  <p className="text-lg font-semibold text-[#908d9a] mb-4">Outdoor Ready</p>
                  <p className="text-[#333333] mb-6 leading-relaxed">
                    Elasticated edges hug cocktail tables or tall displays; works well outdoors in breezy conditions.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                      <span className="text-[#333333]">Wind-resistant design</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                      <span className="text-[#333333]">Snug fit prevents shifting</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sizing */}
              <div className="bg-gradient-to-br from-[#f8f8f8] to-white rounded-3xl p-8 md:p-12 border-2 border-[#c1c6c8]/30">
                <h3 className="smilecake-font text-3xl text-[#333333] mb-6 text-center">
                  Standard & Custom Sizing
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-white rounded-2xl border border-[#908d9a]/20">
                    <div className="text-2xl font-bold text-[#908d9a] mb-2">4 ft</div>
                    <p className="text-[#333333]">Standard trestle</p>
                  </div>
                  <div className="text-center p-6 bg-white rounded-2xl border border-[#908d9a]/20">
                    <div className="text-2xl font-bold text-[#908d9a] mb-2">6 ft</div>
                    <p className="text-[#333333]">Standard trestle</p>
                  </div>
                  <div className="text-center p-6 bg-white rounded-2xl border border-[#908d9a]/20">
                    <div className="text-2xl font-bold text-[#908d9a] mb-2">8 ft</div>
                    <p className="text-[#333333]">Standard trestle</p>
                  </div>
                </div>
                <p className="text-center text-[#333333] mt-6 italic">
                  Custom measurements available for reception desks or counters
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Branding Methods - Textured Background */}
        <section
          className="py-24 px-6 md:px-12 lg:px-24 bg-cover bg-center relative"
          style={{ backgroundImage: 'url(/Website Assets/BlackTextureBackground.jpg)' }}
        >
          <div className="absolute inset-0 bg-black/85" />
          <div className="relative z-10 max-w-6xl mx-auto">
            <h2 className="hearns-font text-5xl md:text-6xl text-white mb-16 text-center">
              Branding Methods
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center">
                <h3 className="smilecake-font text-3xl text-white mb-4">Dye Sublimation</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Best for all-over coverage, gradients, patterns, and photography.
                </p>
                <p className="text-[#908d9a] font-semibold">Long-lasting, saturated colour</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center">
                <h3 className="smilecake-font text-3xl text-white mb-4">Heat-Applied Vinyl</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Cost-effective for spot logos on stock-colour cloths.
                </p>
                <p className="text-[#908d9a] font-semibold">Single or dual colour designs</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center">
                <h3 className="smilecake-font text-3xl text-white mb-4">Mixed Approach</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Combine base colour panels with vinyl overlays.
                </p>
                <p className="text-[#908d9a] font-semibold">Seasonal messaging flexibility</p>
              </div>
            </div>
          </div>
        </section>

        {/* Care Instructions */}
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#f8f8f8]">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="hearns-font text-4xl md:text-5xl text-[#333333] mb-6">
                  Care Instructions
                </h2>
                <p className="text-lg text-[#333333] leading-relaxed mb-6">
                  Keep your tablecloths looking professional event after event with proper care and storage.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#908d9a]/20">
                <h3 className="smilecake-font text-3xl text-[#908d9a] mb-6">Care Tips</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#333333]">Machine wash on cool with mild detergent</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#333333]">Avoid bleach or fabric softener</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#333333]">Air-dry or tumble-dry low</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#333333]">Store folded in supplied bags</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#333333]">Steam or lightly iron before events if required</span>
                  </li>
                </ul>
                <a
                  href="/contact"
                  className="mt-8 w-full inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#908d9a] text-white font-semibold hover:bg-[#4a4460] transition-all duration-300"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Get Free Quote
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Tablecloths;
