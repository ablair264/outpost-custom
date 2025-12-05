import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CheckCircle2, Tent, Package, Palette, Mail } from 'lucide-react';
import SlimGridMotion from '../components/SlimGridMotion';

const Gazebos: React.FC = () => {
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const gazeboImages = Array.from({ length: 21 }, (_, index) => {
    const imageNum = (index % 4) + 1;
    return `/gazebos/gazebo${imageNum}.jpg`;
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
            <SlimGridMotion items={gazeboImages} gradientColor="#333333" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#333333]/80 via-[#333333]/50 to-transparent z-[5]" />

          <div className="relative z-10 h-full flex items-center px-6 md:px-12 lg:px-24">
            <div className="max-w-6xl mx-auto w-full">
              <div ref={headingRef} className="mb-8">
                <h1 className="hearns-font text-6xl md:text-7xl lg:text-8xl tracking-tight text-white mb-6 leading-tight">
                  Custom<br />Gazebos
                </h1>
                <div className="h-1.5 w-24 bg-[#64a70b] rounded-full" />
              </div>
              <div ref={contentRef} className="max-w-2xl mb-10">
                <p className="text-2xl md:text-3xl text-[#c1c6c8] font-light leading-relaxed">
                  Turn outdoor shelters into branded marketing space
                </p>
              </div>
              <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#options"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#64a70b] text-white font-semibold text-base hover:bg-[#75b81c] transition-all duration-300 shadow-lg"
                >
                  View Options
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-white bg-transparent text-white font-semibold text-base hover:bg-white/10 transition-all duration-300"
                >
                  Get Free Mockup
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Overview Section */}
        <section className="py-20 px-6 md:px-12 lg:px-24 bg-white relative">
          <div className="absolute top-10 right-10 opacity-10 pointer-events-none">
            <img src="/Website Assets/Arrow_Green.png" alt="" className="w-32 h-32 -rotate-12" />
          </div>
          <div className="max-w-5xl mx-auto">
            <h2 className="smilecake-font text-5xl md:text-6xl text-[#333333] mb-8 text-center">
              Events & Outdoor Markets
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#64a70b]/10 flex items-center justify-center">
                  <Tent className="w-8 h-8 text-[#64a70b]" />
                </div>
                <p className="text-lg text-[#333333]">
                  Supply your own structure or choose from vetted models
                </p>
              </div>
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#64a70b]/10 flex items-center justify-center">
                  <Palette className="w-8 h-8 text-[#64a70b]" />
                </div>
                <p className="text-lg text-[#333333]">
                  Custom canopies and walls with full-colour printing
                </p>
              </div>
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#64a70b]/10 flex items-center justify-center">
                  <Package className="w-8 h-8 text-[#64a70b]" />
                </div>
                <p className="text-lg text-[#333333]">
                  Replacement canopies available to refresh existing frames
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How's it work? Section */}
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="hearns-font text-5xl md:text-6xl text-[#221c35] mb-4">
                How's it work?
              </h2>
              <p className="text-lg text-[#333333] max-w-4xl mx-auto">
                Our custom gazebos provide branded shelter for outdoor events and markets. Choose from mid-range or heavy-duty options, then work with our design team to create eye-catching canopies and walls that showcase your brand.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mt-16">
              {[
                {
                  step: '1',
                  title: 'Select Canvas',
                  desc: 'Drop off an existing gazebo or pick from vetted models.',
                  progress: 25,
                  icon: Mail
                },
                {
                  step: '2',
                  title: 'Free Mockup',
                  desc: 'Send logos for visual concepts; in-house designers can build artwork or logos if needed.',
                  progress: 50,
                  icon: Palette
                },
                {
                  step: '3',
                  title: 'Approval',
                  desc: 'Upon sign-off, production typically takes 5–10 working days (rush timelines on request).',
                  progress: 75,
                  icon: CheckCircle2
                },
                {
                  step: '4',
                  title: 'Fulfilment',
                  desc: 'Collect from Kidderminster or request delivery.',
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

        {/* Gazebo Options */}
        <section id="options" className="py-24 px-6 md:px-12 lg:px-24 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="hearns-font text-5xl md:text-6xl text-[#333333] mb-4">
                Gazebo Options
              </h2>
              <div className="h-1 w-24 bg-[#64a70b] mx-auto" />
            </div>

            <div className="space-y-12">
              {/* Mid-Range */}
              <div className="bg-gradient-to-br from-[#f8f8f8] to-white rounded-3xl p-8 md:p-12 border-2 border-[#c1c6c8]/30">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="smilecake-font text-4xl text-[#333333] mb-4">
                      Mid-Range Gazebos
                    </h3>
                    <p className="text-xl font-semibold text-[#64a70b] mb-6">Light Commercial / Markets</p>
                    <div className="space-y-4 mb-6">
                      <div>
                        <h4 className="font-bold text-[#333333] mb-2">Sizes & Pricing:</h4>
                        <ul className="space-y-2 text-[#333333]">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#64a70b] flex-shrink-0 mt-0.5" />
                            <span>3×3m: £175 + VAT</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#64a70b] flex-shrink-0 mt-0.5" />
                            <span>3×4.5m: £200 + VAT</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#64a70b] flex-shrink-0 mt-0.5" />
                            <span>3×6m: £265 + VAT</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#333333] mb-2">Features:</h4>
                        <ul className="space-y-2 text-[#333333]">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#64a70b] flex-shrink-0 mt-0.5" />
                            <span>100% waterproof 420D polyester PVC-backed fabric</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#64a70b] flex-shrink-0 mt-0.5" />
                            <span>Powder-coated steel frame with 32×32mm legs</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#64a70b] flex-shrink-0 mt-0.5" />
                            <span>Heavy-duty wheeled carry case included</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#64a70b] flex-shrink-0 mt-0.5" />
                            <span>Optional walls available (solid, windowed, zip doorway)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#64a70b] flex-shrink-0 mt-0.5" />
                            <span>1-year manufacturer warranty</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full bg-[#64a70b]/10 flex items-center justify-center border-4 border-[#64a70b]/20">
                      <Tent className="w-32 h-32 text-[#64a70b]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Heavy-Duty */}
              <div className="bg-gradient-to-br from-[#f8f8f8] to-white rounded-3xl p-8 md:p-12 border-2 border-[#c1c6c8]/30">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="order-2 lg:order-1 flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full bg-[#64a70b]/10 flex items-center justify-center border-4 border-[#64a70b]/20">
                      <Package className="w-32 h-32 text-[#64a70b]" />
                    </div>
                  </div>
                  <div className="order-1 lg:order-2">
                    <h3 className="smilecake-font text-4xl text-[#333333] mb-4">
                      Heavy-Duty Gazebos
                    </h3>
                    <p className="text-xl font-semibold text-[#64a70b] mb-6">Frequent Outdoor Use</p>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold text-[#333333] mb-2">Sizes & Pricing:</h4>
                        <ul className="space-y-2 text-[#333333]">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#64a70b] flex-shrink-0 mt-0.5" />
                            <span>3×3m: £295 + VAT</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#64a70b] flex-shrink-0 mt-0.5" />
                            <span>3×4.5m: £365 + VAT</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#64a70b] flex-shrink-0 mt-0.5" />
                            <span>3×6m: £455 + VAT</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#333333] mb-2">Features:</h4>
                        <ul className="space-y-2 text-[#333333]">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#64a70b] flex-shrink-0 mt-0.5" />
                            <span>100% waterproof 600D polyester PVC-backed fabric</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#64a70b] flex-shrink-0 mt-0.5" />
                            <span>Reinforced construction for regular exposure</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#64a70b] flex-shrink-0 mt-0.5" />
                            <span>Spare parts available on request</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Customisation - Textured Background */}
        <section
          className="py-24 px-6 md:px-12 lg:px-24 bg-cover bg-center relative"
          style={{ backgroundImage: 'url(/Website Assets/BlackTextureBackground.jpg)' }}
        >
          <div className="absolute inset-0 bg-black/85" />
          <div className="relative z-10 max-w-6xl mx-auto">
            <h2 className="hearns-font text-5xl md:text-6xl text-white mb-16 text-center">
              Customisation Options
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <h3 className="smilecake-font text-3xl text-white mb-4">Printed Vinyl</h3>
                <p className="text-white/80 leading-relaxed">
                  Multicolour artwork, gradients, photos, fluorescent or metallic finishes.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <h3 className="smilecake-font text-3xl text-white mb-4">Cut Vinyl</h3>
                <p className="text-white/80 leading-relaxed">
                  Sharp logos and lettering with no background for clean branding.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <h3 className="smilecake-font text-3xl text-white mb-4">Panel Coverage</h3>
                <p className="text-white/80 leading-relaxed">
                  Canopy peaks, valances, walls can be wrapped individually. Discounts for multi-panel packages.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <h3 className="smilecake-font text-3xl text-white mb-4">Design Support</h3>
                <p className="text-white/80 leading-relaxed">
                  Team can advise on placement, budget-friendly coverage, and matching event collateral.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="hearns-font text-5xl md:text-6xl text-[#333333] mb-6 leading-tight">
              Ready to Stand Out at Events?
            </h2>
            <p className="text-xl text-[#333333]/70 mb-10">
              Get help selecting the right spec, planning artwork coverage, or arranging rush jobs
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-10 py-4 rounded-lg bg-[#64a70b] text-white font-semibold text-lg hover:bg-[#75b81c] transition-all duration-300 shadow-lg"
            >
              <Mail className="w-5 h-5 mr-2" />
              Get Free Quote & Mockup
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default Gazebos;
