import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CheckCircle2, Frame, Ruler, Eye, Shield, Mail, Palette, Package } from 'lucide-react';
import SlimGridMotion from '../components/SlimGridMotion';
import { usePageTheme } from '../contexts/ThemeContext';
import HowItWorksSection from '../components/HowItWorksSection';

const GlassManifestation: React.FC = () => {
  // Set purple theme for this page
  usePageTheme('purple');
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const glassImages = Array.from({ length: 21 }, (_, index) => {
    const imageNum = (index % 4) + 1;
    return `/glass-manifestation/glass${imageNum}.jpg`;
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
            <SlimGridMotion items={glassImages} gradientColor="#221c35" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#221c35]/80 via-[#221c35]/50 to-transparent z-[5]" />

          <div className="relative z-10 h-full flex items-center px-6 md:px-12 lg:px-24">
            <div className="max-w-6xl mx-auto w-full">
              <div ref={headingRef} className="mb-8">
                <h1 className="hearns-font text-6xl md:text-7xl lg:text-8xl tracking-tight text-white mb-6 leading-tight">
                  Glass<br />Manifestation
                </h1>
                <div className="h-1.5 w-24 bg-[#908d9a] rounded-full" />
              </div>
              <div ref={contentRef} className="max-w-2xl mb-10">
                <p className="text-2xl md:text-3xl text-white/90 font-light leading-relaxed">
                  Safety-compliant frosted graphics for commercial glazing
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
                  Free Site Survey
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
              Legal Compliance Meets Style
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#908d9a]/10 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-[#908d9a]" />
                </div>
                <p className="text-lg text-[#333333]">
                  Complies with Building Regulations K5.2 and DDA guidance
                </p>
              </div>
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#908d9a]/10 flex items-center justify-center">
                  <Eye className="w-8 h-8 text-[#908d9a]" />
                </div>
                <p className="text-lg text-[#333333]">
                  Frosted film provides visibility while allowing natural light
                </p>
              </div>
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#908d9a]/10 flex items-center justify-center">
                  <Palette className="w-8 h-8 text-[#908d9a]" />
                </div>
                <p className="text-lg text-[#333333]">
                  16 stock patterns or bespoke designs with branding
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why It's Required */}
        <section
          className="py-24 px-6 md:px-12 lg:px-24 bg-cover bg-center relative"
          style={{ backgroundImage: 'url(/Website Assets/MattBlackBackground.jpg)' }}
        >
          <div className="absolute inset-0 bg-[#383349]/85" />
          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="hearns-font text-5xl md:text-6xl text-white mb-8 text-center">
              Building Regulation K5.2
            </h2>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 mb-8">
              <p className="text-xl text-white leading-relaxed mb-6">
                Transparent glazing that people may contact must include <strong className="text-[#908d9a]">permanent markers</strong> to make it apparent.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-1" />
                  <span className="text-white/90">Markers required at two heights: 850–1000mm and 1400–1600mm from floor</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-1" />
                  <span className="text-white/90">Must be visible from both inside and outside in varied lighting</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-1" />
                  <span className="text-white/90">Frosted films provide necessary contrast and permanence</span>
                </div>
              </div>
            </div>

            <p className="text-center text-white/70 italic">
              Suitable for offices, retail fronts, doors, partitions, bathrooms, and kitchens
            </p>
          </div>
        </section>

        {/* How's it work? Section with Brush Stroke Animation */}
        <HowItWorksSection
          serviceType="glass-manifestation"
          sectionId="workflow"
          subtitle="Our glass manifestation service ensures compliance with building regulations while maintaining style. From free site surveys to professional installation."
        />

        {/* Customisation Options - Textured Background */}
<section
  className="py-24 px-6 md:px-12 lg:px-24 bg-cover bg-center relative"
  style={{ backgroundImage: 'url(/Website Assets/ConcreteTexture.jpg)' }}
>
  <div className="absolute inset-0 bg-[#221c35]/90" />
  <div className="relative z-10 max-w-6xl mx-auto">
    
    <div className="text-center mb-20">
      <h2 className="hearns-font text-5xl md:text-6xl text-white mb-4">
        Customisation Options
      </h2>
      <div className="w-16 h-px bg-[#908d9a]/40 mx-auto" />
    </div>

    <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
      {/* Patterns */}
      <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8
        transition-all duration-300 hover:bg-white/[0.07] hover:border-white/15 hover:-translate-y-1">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-px h-8 bg-[#908d9a]/50" />
          <Frame className="w-6 h-6 text-[#908d9a]" />
        </div>
        <h3 className="smilecake-font text-3xl text-white mb-3">Patterns</h3>
        <p className="text-white/70 leading-relaxed">
          Choose from 16 stock designs or request bespoke motifs for subtle markers.
        </p>
        <p className="text-[#908d9a]/80 text-sm font-medium mt-4 tracking-wide uppercase">
          Stock & custom available
        </p>
      </div>

      {/* Text & Wayfinding */}
      <div className="md:mt-12 group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8
        transition-all duration-300 hover:bg-white/[0.07] hover:border-white/15 hover:-translate-y-1">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-px h-8 bg-[#908d9a]/50" />
          <Mail className="w-6 h-6 text-[#908d9a]" />
        </div>
        <h3 className="smilecake-font text-3xl text-white mb-3">Text & Wayfinding</h3>
        <p className="text-white/70 leading-relaxed">
          Integrate directional text or notices that double as visibility strips.
        </p>
        <p className="text-[#908d9a]/80 text-sm font-medium mt-4 tracking-wide uppercase">
          Functional + compliant
        </p>
      </div>

      {/* Logos & Branding */}
      <div className="md:-mt-6 group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8
        transition-all duration-300 hover:bg-white/[0.07] hover:border-white/15 hover:-translate-y-1">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-px h-8 bg-[#908d9a]/50" />
          <Palette className="w-6 h-6 text-[#908d9a]" />
        </div>
        <h3 className="smilecake-font text-3xl text-white mb-3">Logos & Branding</h3>
        <p className="text-white/70 leading-relaxed">
          Embed branding into the etched film for consistent identity.
        </p>
        <p className="text-[#908d9a]/80 text-sm font-medium mt-4 tracking-wide uppercase">
          Logo creation support available
        </p>
      </div>

      {/* Opacity Choices */}
      <div className="md:mt-6 group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8
        transition-all duration-300 hover:bg-white/[0.07] hover:border-white/15 hover:-translate-y-1">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-px h-8 bg-[#908d9a]/50" />
          <Eye className="w-6 h-6 text-[#908d9a]" />
        </div>
        <h3 className="smilecake-font text-3xl text-white mb-3">Opacity Choices</h3>
        <p className="text-white/70 leading-relaxed">
          Standard film allows ~80% of light; lighter or heavier frosts available plus coloured films.
        </p>
        <p className="text-[#908d9a]/80 text-sm font-medium mt-4 tracking-wide uppercase">
          Control light & privacy levels
        </p>
      </div>
    </div>
  </div>
</section>

        {/* Installation & Care */}
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#f8f8f8]">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="hearns-font text-4xl md:text-5xl text-[#221c35] mb-6">
                  Professional Installation
                </h2>
                <p className="text-lg text-[#333333] leading-relaxed mb-4">
                  Experienced technicians cover the Midlands, providing bubble-free application and access equipment.
                </p>
                <p className="text-lg text-[#333333] leading-relaxed mb-6">
                  Optional removal of existing graphics included. DIY customers receive pre-cut panels and fitting guidance.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#908d9a]/20">
                <h3 className="smilecake-font text-3xl text-[#908d9a] mb-6">Care & Maintenance</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#333333]">Wait at least 3 weeks before first clean</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#333333]">Use mild soapy water with soft cloth</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#333333]">Avoid abrasive pads or squeegees on cut edges</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#333333]">Wipe gently around exposed edges to preserve detail</span>
                  </li>
                </ul>
                <a
                  href="/contact"
                  className="mt-8 w-full inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#908d9a] text-white font-semibold hover:bg-[#a39fa8] transition-all duration-300"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Book Free Survey
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default GlassManifestation;
