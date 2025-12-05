import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CheckCircle2, Hammer, Package, Ruler, Mail, Palette } from 'lucide-react';
import SlimGridMotion from '../components/SlimGridMotion';

const ProjectingSigns: React.FC = () => {
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const projectingImages = Array.from({ length: 21 }, (_, index) => {
    const imageNum = (index % 4) + 1;
    return `/projecting-signs/projecting${imageNum}.jpg`;
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
        {/* Hero Section with SlimGridMotion - Purple Palette */}
        <section className="relative h-[70vh] w-full overflow-hidden bg-[#221c35]">
          <div className="absolute inset-0">
            <SlimGridMotion items={projectingImages} gradientColor="#221c35" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#221c35]/80 via-[#221c35]/50 to-transparent z-[5]" />

          <div className="relative z-10 h-full flex items-center px-6 md:px-12 lg:px-24">
            <div className="max-w-6xl mx-auto w-full">
              <div ref={headingRef} className="mb-8">
                <h1 className="hearns-font text-6xl md:text-7xl lg:text-8xl tracking-tight text-white mb-6 leading-tight">
                  Projecting<br />Signs
                </h1>
                <div className="h-1.5 w-24 bg-[#908d9a] rounded-full" />
              </div>
              <div ref={contentRef} className="max-w-2xl mb-10">
                <p className="text-2xl md:text-3xl text-[#c1c6c8] font-light leading-relaxed">
                  Boost visibility for pedestrians with double-sided signs
                </p>
              </div>
              <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#ordering-workflow"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#908d9a] text-white font-semibold text-base hover:bg-[#a39fa8] transition-all duration-300 shadow-lg"
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
          <div className="absolute bottom-10 left-10 opacity-10 pointer-events-none">
            <img src="/Website Assets/Circle_Grey.png" alt="" className="w-40 h-40" />
          </div>
          <div className="max-w-5xl mx-auto">
            <h2 className="smilecake-font text-5xl md:text-6xl text-[#221c35] mb-8 text-center">
              Extend Perpendicular to the Wall
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#908d9a]/10 flex items-center justify-center">
                  <Package className="w-8 h-8 text-[#908d9a]" />
                </div>
                <p className="text-lg text-[#333333]">
                  Modular approach: choose bracket, panel, then graphics
                </p>
              </div>
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#908d9a]/10 flex items-center justify-center">
                  <Hammer className="w-8 h-8 text-[#908d9a]" />
                </div>
                <p className="text-lg text-[#333333]">
                  Designed for outdoor durability with premium materials
                </p>
              </div>
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#908d9a]/10 flex items-center justify-center">
                  <Ruler className="w-8 h-8 text-[#908d9a]" />
                </div>
                <p className="text-lg text-[#333333]">
                  Standard sizes or request bespoke dimensions
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How's it work? Section */}
        <section id="ordering-workflow" className="py-24 px-6 md:px-12 lg:px-24 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="hearns-font text-5xl md:text-6xl text-[#221c35] mb-4">
                How's it work?
              </h2>
              <p className="text-lg text-[#333333] max-w-4xl mx-auto">
                Our projecting signs come in a range of styles, shapes and sizes. Mix & match your bracket and panel, then chat to our design team who will customise your sign to promote your business in the most eye-catching way.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mt-16">
              {[
                {
                  step: '1',
                  title: 'Get a FREE quote',
                  desc: 'Mix & match one of our bracket styles with one of our standard panel sizes, then add customisation.',
                  progress: 25,
                  icon: Mail
                },
                {
                  step: '2',
                  title: 'Design Stage',
                  desc: 'Already have artwork? Send it to our design team for a proof.\n\nNeed help with the design? Send us your logo and our design team will put together a visual of how your projecting sign could look on your premises.\n\nNeed a logo designed first? Our in-house design team can help with that.',
                  progress: 50,
                  icon: Palette
                },
                {
                  step: '3',
                  title: 'Approve your order',
                  desc: 'After you approve your order, we\'ll get it into production which usually takes 5-10 working days.\n\nYou can also book our installation team to fit your projecting sign.\n\nGot a deadline and need your order sooner? Chat to our team – We\'ll do our best to make sure you\'ve got everything you need in time!',
                  progress: 75,
                  icon: CheckCircle2
                },
                {
                  step: '4',
                  title: 'Order up!',
                  desc: 'We\'ll let you know when your order is ready to collect from our shop in Kidderminster or we can arrange posting your order to you (Delivery from £10).\n\nBooked our installers? Our professional and fully insured installation team will meet you on site to apply your projecting sign.',
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

        {/* Bracket & Panel Options */}
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="hearns-font text-5xl md:text-6xl text-[#221c35] mb-4">
                Bracket & Panel Options
              </h2>
              <div className="h-1 w-24 bg-[#908d9a] mx-auto mb-6" />
              <p className="text-lg text-[#333333]">Choose your bracket style and panel configuration</p>
            </div>

            <div className="space-y-12">
              {/* Blade / Flange Sign */}
              <div className="bg-gradient-to-br from-[#f8f8f8] to-white rounded-3xl p-8 md:p-12 border border-[#908d9a]/20">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="smilecake-font text-4xl text-[#221c35] mb-4">
                      Blade / Flange Sign
                    </h3>
                    <p className="text-xl font-semibold text-[#908d9a] mb-6">From £52 + VAT</p>
                    <p className="text-[#333333] mb-6 leading-relaxed">
                      All-in-one budget-friendly option; simply add decals.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold text-[#221c35] mb-2">Sizes Available:</h4>
                        <ul className="space-y-2 text-[#333333]">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                            <span>Circular 47.5cm</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                            <span>Square 40cm or 50cm</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                            <span>Oval 40x55cm (portrait or landscape)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                            <span>Rectangle 55x40cm (landscape)</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#221c35] mb-2">Specifications:</h4>
                        <ul className="space-y-2 text-[#333333]">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                            <span>Laser-cut 2mm aluminium</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                            <span>50x200mm fixing plate</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                            <span>Projects 50mm from wall (standoff)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                            <span>Powder-coated white (vinyl wraps available)</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full bg-[#908d9a]/10 flex items-center justify-center border-4 border-[#908d9a]/20">
                      <Package className="w-32 h-32 text-[#908d9a]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modern Swing Sign Bracket */}
              <div className="bg-gradient-to-br from-[#f8f8f8] to-white rounded-3xl p-8 md:p-12 border border-[#908d9a]/20">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="order-2 lg:order-1 flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full bg-[#908d9a]/10 flex items-center justify-center border-4 border-[#908d9a]/20">
                      <Hammer className="w-32 h-32 text-[#908d9a]" />
                    </div>
                  </div>
                  <div className="order-1 lg:order-2">
                    <h3 className="smilecake-font text-4xl text-[#221c35] mb-4">
                      Modern Swing Sign Bracket
                    </h3>
                    <p className="text-xl font-semibold text-[#908d9a] mb-6">From £105 + VAT</p>
                    <p className="text-[#333333] mb-6 leading-relaxed">
                      Compatible with Aluminium Composite, Framed Aluminium, or PVC Foam panels.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold text-[#221c35] mb-2">Lengths Available:</h4>
                        <ul className="space-y-2 text-[#333333]">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                            <span>60cm</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                            <span>75cm</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                            <span>85cm</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                            <span>100cm</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                            <span>120cm</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#221c35] mb-2">Specifications:</h4>
                        <ul className="space-y-2 text-[#333333]">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                            <span>Heavy-duty steel, zinc-plated and powder-coated</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                            <span>Black or White standard; custom RAL finishes available</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                            <span>Includes wall fixings and hanger bolts</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rigid Projecting Sign */}
              <div className="bg-gradient-to-br from-[#f8f8f8] to-white rounded-3xl p-8 md:p-12 border border-[#908d9a]/20">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="smilecake-font text-4xl text-[#221c35] mb-4">
                      Rigid Projecting Sign
                    </h3>
                    <p className="text-xl font-semibold text-[#908d9a] mb-6">From £110 + VAT</p>
                    <p className="text-[#333333] mb-6 leading-relaxed">
                      Works with Aluminium Composite Panels. Choose from square or rectangle formats.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold text-[#221c35] mb-2">Sizes Available:</h4>
                        <p className="text-[#333333] mb-2 font-semibold">Square Options:</p>
                        <ul className="space-y-2 text-[#333333] mb-4">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                            <span>30cm, 40cm, 45cm, 50cm, 60cm, 70cm, 80cm</span>
                          </li>
                        </ul>
                        <p className="text-[#333333] mb-2 font-semibold">Rectangle Options:</p>
                        <ul className="space-y-2 text-[#333333]">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                            <span>60x40cm</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                            <span>90x60cm</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                            <span>115x55cm</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full bg-[#908d9a]/10 flex items-center justify-center border-4 border-[#908d9a]/20">
                      <Ruler className="w-32 h-32 text-[#908d9a]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Framed Rigid Sign */}
              <div className="bg-gradient-to-br from-[#f8f8f8] to-white rounded-3xl p-8 md:p-12 border border-[#908d9a]/20">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="order-2 lg:order-1 flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full bg-[#908d9a]/10 flex items-center justify-center border-4 border-[#908d9a]/20">
                      <Package className="w-32 h-32 text-[#908d9a]" />
                    </div>
                  </div>
                  <div className="order-1 lg:order-2">
                    <h3 className="smilecake-font text-4xl text-[#221c35] mb-4">
                      Framed Rigid Sign
                    </h3>
                    <p className="text-xl font-semibold text-[#908d9a] mb-6">Contact for Quote</p>
                    <p className="text-[#333333] mb-6 leading-relaxed">
                      Custom made to any size, perfect for listed properties.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold text-[#221c35] mb-2">Specifications:</h4>
                        <ul className="space-y-2 text-[#333333]">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                            <span>Custom made to any size</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                            <span>55x65mm Aluminium Frame</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                            <span>10mm panel thickness</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                            <span>Listed property friendly</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rigid Illuminated Round Projecting Sign */}
              <div className="bg-gradient-to-br from-[#f8f8f8] to-white rounded-3xl p-8 md:p-12 border border-[#908d9a]/20">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="smilecake-font text-4xl text-[#221c35] mb-4">
                      Rigid Illuminated Round Projecting Sign
                    </h3>
                    <p className="text-xl font-semibold text-[#908d9a] mb-6">Contact for Price</p>
                    <p className="text-[#333333] mb-6 leading-relaxed">
                      Eye-catching illuminated sign with pre-installed LED modules.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold text-[#221c35] mb-2">Specifications:</h4>
                        <ul className="space-y-2 text-[#333333]">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                            <span>Size: 80x80cm</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                            <span>Pre-installed LED modules</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                            <span>3mm Acrylic faces both sides</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                            <span>Requires electrician for installation</span>
                          </li>
                        </ul>
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
            </div>
          </div>
        </section>

        {/* Panels & Customisation */}
        <section
          className="py-24 px-6 md:px-12 lg:px-24 bg-cover bg-center relative"
          style={{ backgroundImage: 'url(/Website Assets/ConcreteTexture.jpg)' }}
        >
          <div className="absolute inset-0 bg-[#221c35]/90" />
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <h2 className="hearns-font text-5xl md:text-6xl text-white mb-8">
              Panels & Customisation
            </h2>
            <div className="space-y-6 text-lg text-[#c1c6c8] leading-relaxed">
              <p>
                Double-sided aluminium composite or other compatible substrates sized to match your chosen bracket.
              </p>
              <p>
                Graphics available in <strong className="text-white">cut vinyl</strong> or{' '}
                <strong className="text-white">printed vinyl</strong> (including metallic, fluorescent, glitter, or gradients).
              </p>
              <p>
                Our design team can create mockups showing real-world placement before approval.
              </p>
            </div>
          </div>
        </section>

        {/* Installation & Support */}
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#f8f8f8]">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="hearns-font text-4xl md:text-5xl text-[#221c35] mb-6">
                  Built for the Long-Term
                </h2>
                <p className="text-lg text-[#333333] leading-relaxed mb-4">
                  Projecting signs are engineered for long-term exterior use.
                </p>
                <p className="text-lg text-[#333333] leading-relaxed mb-6">
                  Specify wind exposure and mounting surface for bracket recommendations.
                </p>
                <p className="text-base text-[#666] italic">
                  Installation service includes insured fitters, access equipment, and wall fixings.
                  DIY packages ship with required hardware.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#908d9a]/20">
                <h3 className="smilecake-font text-3xl text-[#908d9a] mb-6">Need Guidance?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#333333]">Bracket selection advice</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#333333]">Panel sizing recommendations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#333333]">Custom finishes & colours</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#333333]">Accelerated production timelines</span>
                  </li>
                </ul>
                <a
                  href="/contact"
                  className="mt-8 w-full inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#908d9a] text-white font-semibold hover:bg-[#a39fa8] transition-all duration-300"
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

export default ProjectingSigns;
