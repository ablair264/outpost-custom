import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CheckCircle2, Hammer, Shield, Mail, Palette, Package } from 'lucide-react';
import SlimGridMotion from '../components/SlimGridMotion';
import { usePageTheme } from '../contexts/ThemeContext';
import HowItWorksSection from '../components/HowItWorksSection';

const Signboards: React.FC = () => {
  // Set purple theme for this page
  usePageTheme('purple');
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const signboardImages = Array.from({ length: 21 }, (_, index) => {
    const imageNum = (index % 4) + 1;
    return `/signboards/signboard${imageNum}.jpg`;
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
            <SlimGridMotion items={signboardImages} gradientColor="#221c35" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#221c35]/80 via-[#221c35]/50 to-transparent z-[5]" />

          <div className="relative z-10 h-full flex items-center px-6 md:px-12 lg:px-24">
            <div className="max-w-6xl mx-auto w-full">
              <div ref={headingRef} className="mb-8">
                <h1 className="hearns-font text-6xl md:text-7xl lg:text-8xl tracking-tight text-white mb-6 leading-tight">
                  Custom<br />Signboards
                </h1>
                <div className="h-1.5 w-24 bg-[#908d9a] rounded-full" />
              </div>
              <div ref={contentRef} className="max-w-2xl mb-10">
                <p className="text-2xl md:text-3xl text-white/90 font-light leading-relaxed">
                  Premium flat-panel signage for interior and exterior use
                </p>
              </div>
              <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#workflow"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#908d9a] text-white font-semibold text-base hover:bg-[#a39fa8] transition-all duration-300 shadow-lg"
                >
                  How It Works
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
          <div className="absolute bottom-10 right-10 opacity-10 pointer-events-none">
            <img src="/Website Assets/Circle_Grey.png" alt="" className="w-40 h-40" />
          </div>
          <div className="max-w-5xl mx-auto">
            <h2 className="smilecake-font text-5xl md:text-6xl text-[#221c35] mb-8 text-center">
              Tailored to Your Business
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#908d9a]/10 flex items-center justify-center">
                  <Palette className="w-8 h-8 text-[#908d9a]" />
                </div>
                <p className="text-lg text-[#333333]">
                  Design team tailors artwork, sizing, and finishes to match branding
                </p>
              </div>
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#908d9a]/10 flex items-center justify-center">
                  <Package className="w-8 h-8 text-[#908d9a]" />
                </div>
                <p className="text-lg text-[#333333]">
                  Multiple materials for interior or exterior use
                </p>
              </div>
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#908d9a]/10 flex items-center justify-center">
                  <Hammer className="w-8 h-8 text-[#908d9a]" />
                </div>
                <p className="text-lg text-[#333333]">
                  Production typically 5–10 working days
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How's it work? Section with Brush Stroke Animation */}
        <HowItWorksSection
          serviceType="signboards"
          sectionId="workflow"
          subtitle="Our custom signboards are available in a range of materials and finishes to suit any application. From durable outdoor aluminium to premium acrylic for interior spaces."
        />

        {/* Material Options */}
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="hearns-font text-5xl md:text-6xl text-[#221c35] mb-4">
                Material Options
              </h2>
              <div className="h-1 w-24 bg-[#908d9a] mx-auto mb-6" />
              <p className="text-lg text-[#333333]">Choose the right substrate for your application</p>
            </div>

            <div className="space-y-8">
              {/* Aluminium Composite */}
              <div className="bg-gradient-to-br from-[#f8f8f8] to-white rounded-3xl p-8 md:p-12 border border-[#908d9a]/20">
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                  <div>
                    <h3 className="smilecake-font text-4xl text-[#221c35] mb-4">
                      Aluminium Composite
                    </h3>
                    <p className="text-xl font-semibold text-[#908d9a] mb-6">Durable Exterior Board</p>
                    <p className="text-[#333333] mb-6 leading-relaxed">
                      Twin coated aluminium skins with solid polyethylene core. The go-to choice for outdoor signage.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                        <span className="text-[#333333]">Up to 8 × 4 ft (2440 × 1220 mm)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                        <span className="text-[#333333]">3mm thick with 0.15mm aluminium skin</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                        <span className="text-[#333333]">White matt finish for vinyl wrap or decals</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                        <span className="text-[#333333]">Drillable with colour-matched screwcaps</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full bg-[#908d9a]/10 flex items-center justify-center border-4 border-[#908d9a]/20">
                      <Shield className="w-32 h-32 text-[#908d9a]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Perspex Acrylic */}
              <div className="bg-gradient-to-br from-[#f8f8f8] to-white rounded-3xl p-8 md:p-12 border border-[#908d9a]/20">
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                  <div className="order-2 lg:order-1 flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full bg-[#908d9a]/10 flex items-center justify-center border-4 border-[#908d9a]/20">
                      <Palette className="w-32 h-32 text-[#908d9a]" />
                    </div>
                  </div>
                  <div className="order-1 lg:order-2">
                    <h3 className="smilecake-font text-4xl text-[#221c35] mb-4">
                      Perspex Acrylic
                    </h3>
                    <p className="text-xl font-semibold text-[#908d9a] mb-6">Luxury Interior or Exterior</p>
                    <p className="text-[#333333] mb-6 leading-relaxed">
                      Premium building signage or wall art where a high-end finish is required.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                        <span className="text-[#333333]">Custom clear or 35 opaque colours</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                        <span className="text-[#333333]">Thickness: 3, 5, 8, or 10mm</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                        <span className="text-[#333333]">Square or rounded corners</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                        <span className="text-[#333333]">Metal stand-offs in chrome or satin</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Aluminium Sign Tray */}
              <div className="bg-gradient-to-br from-[#f8f8f8] to-white rounded-3xl p-8 md:p-12 border border-[#908d9a]/20">
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                  <div>
                    <h3 className="smilecake-font text-4xl text-[#221c35] mb-4">
                      Aluminium Sign Tray
                    </h3>
                    <p className="text-xl font-semibold text-[#908d9a] mb-6">Robust Exterior Sign</p>
                    <p className="text-[#333333] mb-6 leading-relaxed">
                      3mm aluminium composite folded into a pan tray; multiple colours and finishes.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                        <span className="text-[#333333]">Up to 3000 × 1460mm (standard colours)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                        <span className="text-[#333333]">Matt or gloss finishes available</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                        <span className="text-[#333333]">Multiple colours: White, Black, Anthracite, Grey, and more</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                        <span className="text-[#333333]">Delivered with wall mounting hardware</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full bg-[#908d9a]/10 flex items-center justify-center border-4 border-[#908d9a]/20">
                      <Hammer className="w-32 h-32 text-[#908d9a]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Lightweight Options Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Foamex */}
                <div className="bg-gradient-to-br from-[#f8f8f8] to-white rounded-3xl p-8 border border-[#908d9a]/20">
                  <h3 className="smilecake-font text-3xl text-[#221c35] mb-4">
                    Foamex
                  </h3>
                  <p className="text-lg font-semibold text-[#908d9a] mb-4">Lightweight Interior Board</p>
                  <p className="text-[#333333] mb-6 leading-relaxed">
                    Perfect for exhibitions, indoor signage, and short-term exterior messaging.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                      <span className="text-[#333333]">Up to 8 × 4 ft</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                      <span className="text-[#333333]">Thickness: 3, 5, 10, or 19mm</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                      <span className="text-[#333333]">Tape, Velcro, or screw mounting</span>
                    </div>
                  </div>
                </div>

                {/* Correx */}
                <div className="bg-gradient-to-br from-[#f8f8f8] to-white rounded-3xl p-8 border border-[#908d9a]/20">
                  <h3 className="smilecake-font text-3xl text-[#221c35] mb-4">
                    Correx
                  </h3>
                  <p className="text-lg font-semibold text-[#908d9a] mb-4">Temporary Exterior Board</p>
                  <p className="text-[#333333] mb-6 leading-relaxed">
                    Waterproof corrugated plastic ideal for temporary outdoor signage.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                      <span className="text-[#333333]">Up to 1230 × 1000mm</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                      <span className="text-[#333333]">6 colours available</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                      <span className="text-[#333333]">Cable tie or tape mounting</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Customisation & Finishing - Textured Background */}
        <section
          className="py-24 px-6 md:px-12 lg:px-24 bg-cover bg-center relative"
          style={{ backgroundImage: 'url(/Website Assets/ConcreteTexture.jpg)' }}
        >
          <div className="absolute inset-0 bg-[#221c35]/90" />
          <div className="relative z-10 max-w-6xl mx-auto">
            <h2 className="hearns-font text-5xl md:text-6xl text-white mb-16 text-center">
              Customisation & Finishing
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <h3 className="smilecake-font text-3xl text-white mb-4">Printed Vinyl</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Handle complex art, gradients, photographs, metallics, fluorescent, glitter, or holographic effects.
                </p>
                <p className="text-[#908d9a] font-semibold">Full-colour printing capabilities</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <h3 className="smilecake-font text-3xl text-white mb-4">Cut Vinyl</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Delivers crisp lettering/logos without a background and excels for solid colours.
                </p>
                <p className="text-[#908d9a] font-semibold">Clean, professional finish</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <h3 className="smilecake-font text-3xl text-white mb-4">Lamination</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Upgrades improve durability (e.g., anti-graffiti or dry-wipe for menu boards).
                </p>
                <p className="text-[#908d9a] font-semibold">Extended lifespan options</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <h3 className="smilecake-font text-3xl text-white mb-4">Design Support</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Covers everything from layout tweaks to full creative direction or logo development.
                </p>
                <p className="text-[#908d9a] font-semibold">In-house design team</p>
              </div>
            </div>
          </div>
        </section>

        {/* Installation & Support */}
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#f8f8f8]">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="hearns-font text-4xl md:text-5xl text-[#221c35] mb-6">
                  Built to Specification
                </h2>
                <p className="text-lg text-[#333333] leading-relaxed mb-4">
                  Panels built using premium materials and high manufacturing standards.
                </p>
                <p className="text-lg text-[#333333] leading-relaxed mb-6">
                  Professional installation available across the Midlands including drilling, screwcaps, and access equipment.
                </p>
                <p className="text-base text-[#666] italic">
                  Self-install kits include pre-drilled holes and fixings on request.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#908d9a]/20">
                <h3 className="smilecake-font text-3xl text-[#908d9a] mb-6">Care Tips</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#333333]">Wipe surfaces with mild soapy water</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#333333]">Use non-abrasive cloths only</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#333333]">Inspect exterior hardware periodically</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#333333]">Check multi-panel joins in high-wind sites</span>
                  </li>
                </ul>
                <a
                  href="/contact"
                  className="mt-8 w-full inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#908d9a] text-white font-semibold hover:bg-[#a39fa8] transition-all duration-300"
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

export default Signboards;
