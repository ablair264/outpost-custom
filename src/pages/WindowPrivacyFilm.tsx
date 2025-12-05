import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CheckCircle2, Home, Building2, Sun, Mail, Palette, Package, Layers } from 'lucide-react';
import SlimGridMotion from '../components/SlimGridMotion';

const WindowPrivacyFilm: React.FC = () => {
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const windowImages = Array.from({ length: 21 }, (_, index) => {
    const imageNum = (index % 4) + 1;
    return `/window-privacy/window${imageNum}.jpg`;
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
            <SlimGridMotion items={windowImages} gradientColor="#333333" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#333333]/80 via-[#333333]/50 to-transparent z-[5]" />

          <div className="relative z-10 h-full flex items-center px-6 md:px-12 lg:px-24">
            <div className="max-w-6xl mx-auto w-full">
              <div ref={headingRef} className="mb-8">
                <h1 className="hearns-font text-6xl md:text-7xl lg:text-8xl tracking-tight text-white mb-6 leading-tight">
                  Window<br />Privacy Film
                </h1>
                <div className="h-1.5 w-24 bg-[#64a70b] rounded-full" />
              </div>
              <div ref={contentRef} className="max-w-2xl mb-10">
                <p className="text-2xl md:text-3xl text-[#c1c6c8] font-light leading-relaxed">
                  Frosted vinyl for homes and offices, combining privacy with natural light
                </p>
              </div>
              <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#workflow"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#64a70b] text-white font-semibold text-base hover:bg-[#75b81c] transition-all duration-300 shadow-lg"
                >
                  How It Works
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-white bg-transparent text-white font-semibold text-base hover:bg-white/10 transition-all duration-300"
                >
                  Request Quote
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Overview Section */}
        <section className="py-20 px-6 md:px-12 lg:px-24 bg-white relative">
          <div className="absolute top-10 left-10 opacity-10 pointer-events-none">
            <img src="/Website Assets/Arrow_Green.png" alt="" className="w-32 h-32 rotate-12" />
          </div>
          <div className="max-w-5xl mx-auto">
            <h2 className="smilecake-font text-5xl md:text-6xl text-[#333333] mb-8 text-center">
              Privacy Without Darkness
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#64a70b]/10 flex items-center justify-center">
                  <Home className="w-8 h-8 text-[#64a70b]" />
                </div>
                <p className="text-lg text-[#333333]">
                  Ideal for homes as a net curtain alternative for bathrooms and kitchens
                </p>
              </div>
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#64a70b]/10 flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-[#64a70b]" />
                </div>
                <p className="text-lg text-[#333333]">
                  Perfect for office partitions and meeting rooms
                </p>
              </div>
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#64a70b]/10 flex items-center justify-center">
                  <Sun className="w-8 h-8 text-[#64a70b]" />
                </div>
                <p className="text-lg text-[#333333]">
                  Etched vinyl delivers translucent finish while allowing natural light
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How's it work? Section */}
        <section id="workflow" className="py-24 px-6 md:px-12 lg:px-24 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="hearns-font text-5xl md:text-6xl text-[#221c35] mb-4">
                How's it work?
              </h2>
              <p className="text-lg text-[#333333] max-w-4xl mx-auto">
                Our window privacy film can be customised to suit your space, whether you're looking for full coverage, partial privacy, or branded designs. Our team can visit to measure, or you can provide dimensions yourself.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mt-16">
              {[
                {
                  step: '1',
                  title: 'Site Survey',
                  desc: 'Team can visit to capture measurements/photos, or you can submit your own.',
                  progress: 25,
                  icon: Mail
                },
                {
                  step: '2',
                  title: 'Design + Quote',
                  desc: 'Designers prepare visuals showing coverage, cut-outs, or patterns; logo design available if needed.',
                  progress: 50,
                  icon: Palette
                },
                {
                  step: '3',
                  title: 'Approval',
                  desc: 'Confirm artwork and schedule production/installation.',
                  progress: 75,
                  icon: CheckCircle2
                },
                {
                  step: '4',
                  title: 'Installation',
                  desc: 'Insured installers apply film on-site; DIY supply (roll or cut-to-size with decals) available.',
                  progress: 100,
                  icon: Package
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex flex-col items-center text-center">
                    {/* Animated Progress Circle */}
                    <div className="relative w-32 h-32 mb-6">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                        {/* Background circle */}
                        <circle
                          cx="60"
                          cy="60"
                          r="54"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                        />
                        {/* Animated progress circle */}
                        <circle
                          cx="60"
                          cy="60"
                          r="54"
                          fill="none"
                          stroke="#64a70b"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 54}`}
                          strokeDashoffset={`${2 * Math.PI * 54 * (1 - item.progress / 100)}`}
                          style={{
                            transition: 'stroke-dashoffset 1.5s ease-in-out',
                            transitionDelay: `${idx * 0.2}s`
                          }}
                        />
                      </svg>
                      {/* Icon in center */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-[#64a70b] flex items-center justify-center">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-[#221c35] mb-3">
                      {item.step}. {item.title}
                    </h3>
                    <p className="text-[#333333] leading-relaxed text-sm whitespace-pre-line">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#64a70b] text-white font-semibold text-base hover:bg-[#75b81c] transition-all duration-300 shadow-lg"
              >
                GET SOME ADVICE FROM OUR TEAM
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-[#64a70b] bg-transparent text-[#64a70b] font-semibold text-base hover:bg-[#64a70b] hover:text-white transition-all duration-300"
              >
                BOOK A FREE CONSULTATION
              </a>
            </div>
          </div>
        </section>

        {/* Customisation Options */}
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="hearns-font text-5xl md:text-6xl text-[#333333] mb-4">
                Customisation Options
              </h2>
              <div className="h-1 w-24 bg-[#64a70b] mx-auto" />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Full Coverage */}
              <div className="bg-gradient-to-br from-[#f8f8f8] to-white rounded-3xl p-8 md:p-10 border-2 border-[#c1c6c8]/30">
                <div className="w-14 h-14 rounded-full bg-[#64a70b]/10 flex items-center justify-center mb-6">
                  <Layers className="w-7 h-7 text-[#64a70b]" />
                </div>
                <h3 className="smilecake-font text-3xl text-[#333333] mb-4">Full Coverage</h3>
                <p className="text-[#333333]/80 mb-4 leading-relaxed">
                  Maximizes privacy with various translucency levels demonstrating how shapes appear in different lighting.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#64a70b] flex-shrink-0 mt-0.5" />
                    <span className="text-[#333333]">Light, medium, or heavy opacity</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#64a70b] flex-shrink-0 mt-0.5" />
                    <span className="text-[#333333]">Coloured frosts available</span>
                  </div>
                </div>
              </div>

              {/* Cut-Outs & Branding */}
              <div className="bg-gradient-to-br from-[#f8f8f8] to-white rounded-3xl p-8 md:p-10 border-2 border-[#c1c6c8]/30">
                <div className="w-14 h-14 rounded-full bg-[#64a70b]/10 flex items-center justify-center mb-6">
                  <Palette className="w-7 h-7 text-[#64a70b]" />
                </div>
                <h3 className="smilecake-font text-3xl text-[#333333] mb-4">Cut-Outs & Branding</h3>
                <p className="text-[#333333]/80 mb-4 leading-relaxed">
                  Add branding, text, or directional icons to the frosted surface.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#64a70b] flex-shrink-0 mt-0.5" />
                    <span className="text-[#333333]">Logo integration</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#64a70b] flex-shrink-0 mt-0.5" />
                    <span className="text-[#333333]">Custom patterns and motifs</span>
                  </div>
                </div>
              </div>

              {/* Layered Decals */}
              <div className="bg-gradient-to-br from-[#f8f8f8] to-white rounded-3xl p-8 md:p-10 border-2 border-[#c1c6c8]/30">
                <div className="w-14 h-14 rounded-full bg-[#64a70b]/10 flex items-center justify-center mb-6">
                  <Layers className="w-7 h-7 text-[#64a70b]" />
                </div>
                <h3 className="smilecake-font text-3xl text-[#333333] mb-4">Layered Decals</h3>
                <p className="text-[#333333]/80 leading-relaxed">
                  Combine coloured vinyl behind etched film for illuminated, lightbox-style effects at night.
                </p>
              </div>

              {/* Patterns & Colours */}
              <div className="bg-gradient-to-br from-[#f8f8f8] to-white rounded-3xl p-8 md:p-10 border-2 border-[#c1c6c8]/30">
                <div className="w-14 h-14 rounded-full bg-[#64a70b]/10 flex items-center justify-center mb-6">
                  <Palette className="w-7 h-7 text-[#64a70b]" />
                </div>
                <h3 className="smilecake-font text-3xl text-[#333333] mb-4">Patterns & Colours</h3>
                <p className="text-[#333333]/80 leading-relaxed">
                  Choose from stock motifs or custom artwork; lighter/heavier opacities and coloured frosts offered.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dual Purpose - Textured Background */}
        <section
          className="py-20 px-6 md:px-12 lg:px-24 bg-cover bg-center relative"
          style={{ backgroundImage: 'url(/Website Assets/BlackTextureBackground.jpg)' }}
        >
          <div className="absolute inset-0 bg-black/85" />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h2 className="hearns-font text-5xl md:text-6xl text-white mb-8">
              Dual Purpose Solution
            </h2>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12">
              <p className="text-xl text-white leading-relaxed mb-6">
                Can double as <strong className="text-[#64a70b]">glass manifestation</strong> to meet safety regulations when applied at required heights (850–1000mm and 1400–1600mm).
              </p>
              <p className="text-[#c1c6c8]">
                Privacy and compliance in one solution
              </p>
            </div>
          </div>
        </section>

        {/* Installation & Care */}
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#f8f8f8]">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="hearns-font text-4xl md:text-5xl text-[#333333] mb-6">
                  Installation Support
                </h2>
                <p className="text-lg text-[#333333] leading-relaxed mb-4">
                  Professional team covers Midlands homes and workplaces with bubble-free application and access equipment as required.
                </p>
                <p className="text-lg text-[#333333] leading-relaxed mb-6">
                  DIY kits include pre-cut panels, fixings, and guidance for confident self-installation.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#64a70b]/20">
                <h3 className="smilecake-font text-3xl text-[#64a70b] mb-6">Care Instructions</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#64a70b] flex-shrink-0 mt-1" />
                    <span className="text-[#333333]">Wait 3 weeks after fitting before first clean</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#64a70b] flex-shrink-0 mt-1" />
                    <span className="text-[#333333]">Clean with mild soapy water using soft cloth</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#64a70b] flex-shrink-0 mt-1" />
                    <span className="text-[#333333]">Avoid abrasive cleaners and excessive pressure</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#64a70b] flex-shrink-0 mt-1" />
                    <span className="text-[#333333]">For intricate cut-outs, wipe gently around edges</span>
                  </li>
                </ul>
                <a
                  href="/contact"
                  className="mt-8 w-full inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#64a70b] text-white font-semibold hover:bg-[#75b81c] transition-all duration-300"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default WindowPrivacyFilm;
