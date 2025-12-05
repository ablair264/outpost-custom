import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CheckCircle2, XCircle, Mail, Phone, Palette, Package } from 'lucide-react';
import SlimGridMotion from '../components/SlimGridMotion';

const PavementSigns: React.FC = () => {
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
      `}</style>

      <div className="min-h-screen bg-white">
        {/* Hero Section with SlimGridMotion */}
        <section className="relative h-[70vh] w-full overflow-hidden bg-[#333333]">
          <div className="absolute inset-0">
            <SlimGridMotion items={pavementImages} gradientColor="#333333" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent z-[5]" />

          <div className="relative z-10 h-full flex items-center px-6 md:px-12 lg:px-24">
            <div className="max-w-6xl mx-auto w-full">
              <div ref={headingRef} className="mb-8">
                <h1 className="hearns-font text-6xl md:text-7xl lg:text-8xl tracking-tight text-white mb-6 leading-tight">
                  Pavement &<br />Forecourt Signs
                </h1>
                <div className="h-1.5 w-24 bg-[#64a70b] rounded-full" />
              </div>
              <div ref={contentRef} className="max-w-2xl mb-10">
                <p className="text-2xl md:text-3xl text-[#c1c6c8] font-light leading-relaxed">
                  Capture passing footfall with free-standing signs
                </p>
              </div>
              <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#ordering-workflow"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#64a70b] text-white font-semibold text-base hover:bg-[#7dbf23] transition-all duration-300 shadow-lg"
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

        {/* Overview Section */}
        <section className="py-20 px-6 md:px-12 lg:px-24 bg-white relative">
          <div className="absolute top-10 right-10 opacity-10 pointer-events-none">
            <img src="/Website Assets/Arrow_Green.png" alt="" className="w-32 h-32 rotate-45" />
          </div>
          <div className="max-w-5xl mx-auto">
            <h2 className="smilecake-font text-5xl md:text-6xl text-[#333333] mb-8 text-center">
              Stand Out & Get Noticed
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#64a70b]/10 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-[#64a70b]" />
                </div>
                <p className="text-lg text-[#333333]">
                  Multiple styles, colours, and weather ratings
                </p>
              </div>
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#64a70b]/10 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-[#64a70b]" />
                </div>
                <p className="text-lg text-[#333333]">
                  Existing frames can be refurbished with new graphics
                </p>
              </div>
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#64a70b]/10 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-[#64a70b]" />
                </div>
                <p className="text-lg text-[#333333]">
                  5-10 working days typical production
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How's it work? Section - Green Theme */}
        <section id="ordering-workflow" className="py-24 px-6 md:px-12 lg:px-24 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="hearns-font text-5xl md:text-6xl text-[#333333] mb-4">
                How's it work?
              </h2>
              <p className="text-lg text-[#333333] max-w-4xl mx-auto">
                Choose from our standard frames or bring your own for rebranding. Our design team will help create eye-catching graphics to promote your business.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mt-16">
              {[
                {
                  step: '1',
                  title: 'Get a FREE quote',
                  desc: 'Choose from standard frames or bring your own for rebranding.',
                  progress: 25,
                  icon: Mail
                },
                {
                  step: '2',
                  title: 'Design Stage',
                  desc: 'Submit artwork for proofing or brief the design team for new visuals/logos.',
                  progress: 50,
                  icon: Palette
                },
                {
                  step: '3',
                  title: 'Approve your order',
                  desc: 'Sign off mockups and pricing to enter production.',
                  progress: 75,
                  icon: CheckCircle2
                },
                {
                  step: '4',
                  title: 'Order up!',
                  desc: 'Collect locally or arrange delivery (from £10).',
                  progress: 100,
                  icon: Package
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex flex-col items-center text-center">
                    {/* Animated Progress Circle - Green */}
                    <div className="relative w-32 h-32 mb-6">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                        <circle
                          cx="60"
                          cy="60"
                          r="54"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                        />
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
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-[#64a70b] flex items-center justify-center">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-[#333333] mb-3">
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

        {/* Product Highlight: Eco Swing */}
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="hearns-font text-5xl md:text-6xl text-[#333333] mb-4">
                Eco Swing Pavement Sign
              </h2>
              <div className="h-1 w-24 bg-[#64a70b] mx-auto mb-6" />
              <p className="smilecake-font text-2xl text-[#64a70b]">Best for windy locations!</p>
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
                        <CheckCircle2 className="w-6 h-6 text-[#64a70b] flex-shrink-0 mt-0.5" />
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
        <section
          className="py-24 px-6 md:px-12 lg:px-24 bg-cover bg-center relative"
          style={{ backgroundImage: 'url(/Website Assets/BlackTextureBackground.jpg)' }}
        >
          <div className="absolute inset-0 bg-black/75" />
          <div className="relative z-10 max-w-7xl mx-auto">
            <h2 className="hearns-font text-5xl md:text-6xl text-white mb-16 text-center">
              Customisation Options
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Printed Vinyl */}
              <div className="bg-white/95 backdrop-blur rounded-2xl p-8">
                <h3 className="smilecake-font text-3xl text-[#64a70b] mb-6">Printed Vinyl</h3>
                <p className="text-[#333333] mb-6 font-semibold">
                  Ideal for multicolour artwork, gradients, textures, and photos
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    'Detailed campaigns',
                    'Metallic finishes',
                    'Fluorescent effects',
                    'Glitter & holographic',
                    'Complex illustrations',
                    'Photographs'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#64a70b] flex-shrink-0" />
                      <span className="text-[#333333]">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-[#64a70b]/10 p-4 rounded-lg border-l-4 border-[#64a70b]">
                  <p className="text-sm text-[#333333]">
                    <strong>Best for:</strong> Complex art, gradients, and photographs.
                    Inks print onto vinyl for vibrant, detailed graphics.
                  </p>
                </div>
              </div>

              {/* Cut Vinyl */}
              <div className="bg-white/95 backdrop-blur rounded-2xl p-8">
                <h3 className="smilecake-font text-3xl text-[#64a70b] mb-6">Cut Vinyl</h3>
                <p className="text-[#333333] mb-6 font-semibold">
                  Crisp lettering/logos without background
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    'Solid colours',
                    'Simple graphics',
                    'Sharp lettering',
                    'Long-lasting colour',
                    'No background needed'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#64a70b] flex-shrink-0" />
                      <span className="text-[#333333]">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-[#666] mb-4">Not suitable for:</p>
                <ul className="space-y-2 mb-6">
                  {['Very small text', 'Gradients', 'Photos', 'Grunge effects'].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <span className="text-[#666]">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-[#64a70b]/10 p-4 rounded-lg border-l-4 border-[#64a70b]">
                  <p className="text-sm text-[#333333]">
                    <strong>Best for:</strong> Simple, bold designs. Colour runs through
                    the material for superior durability.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="smilecake-font text-2xl text-white mb-4">
                Chalkboard Inserts Available
              </p>
              <p className="text-[#c1c6c8] max-w-2xl mx-auto">
                Optional chalkboard inserts perfect for daily promotions and menu updates
              </p>
            </div>
          </div>
        </section>

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
                <h3 className="smilecake-font text-3xl text-[#64a70b] mb-6">Need Support?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#64a70b] flex-shrink-0 mt-1" />
                    <span className="text-[#333333]">Help selecting frame type & size</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#64a70b] flex-shrink-0 mt-1" />
                    <span className="text-[#333333]">Customisation method advice</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#64a70b] flex-shrink-0 mt-1" />
                    <span className="text-[#333333]">Design assistance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#64a70b] flex-shrink-0 mt-1" />
                    <span className="text-[#333333]">Installation guidance</span>
                  </li>
                </ul>
                <a
                  href="/contact"
                  className="mt-8 w-full inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#64a70b] text-white font-semibold hover:bg-[#7dbf23] transition-all duration-300"
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
