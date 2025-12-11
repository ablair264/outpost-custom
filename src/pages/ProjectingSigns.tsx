import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { CheckCircle2, CircleDot, Square, Lightbulb, Palette, Mail, Wrench, MoveHorizontal, XCircle } from 'lucide-react';
import { usePageTheme } from '../contexts/ThemeContext';
import HowItWorksSection from '../components/HowItWorksSection';

const ProjectingSigns: React.FC = () => {
  usePageTheme('purple');
  const headingRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(headingRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.2, delay: 0.2 })
      .fromTo(subtitleRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1 }, '-=0.7')
      .fromTo(ctaRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5');
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.15 } }
  };

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
          font-family: 'Neuzeit';
          src: url('/fonts/font/NeuzeitOffice-Regular.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        .hearns-font {
          font-family: 'Hearns', Georgia, serif;
        }
        .smilecake-font {
          font-family: 'Smilecake', cursive;
        }
        .neuzeit-font {
          font-family: 'Neuzeit', sans-serif;
        }
        .frosted-glass {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        @keyframes lightRay {
          0%, 100% { opacity: 0.3; transform: translateX(-100%) skewX(-15deg); }
          50% { opacity: 0.6; transform: translateX(200%) skewX(-15deg); }
        }
        .light-ray {
          animation: lightRay 8s ease-in-out infinite;
        }
        .gradient-text {
          background: linear-gradient(135deg, #ffffff 0%, #c1c6c8 50%, #908d9a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <div className="min-h-screen bg-[#221c35]">

        {/* Hero Section */}
        <section className="relative min-h-[90vh] w-full overflow-hidden bg-gradient-to-br from-[#221c35] via-[#2a2442] to-[#383349]">
          <div className="absolute inset-0 overflow-hidden">
            <div className="light-ray absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <div className="light-ray absolute top-0 left-1/4 w-1/4 h-full bg-gradient-to-r from-transparent via-white/3 to-transparent" style={{ animationDelay: '2s' }} />
            <div className="light-ray absolute top-0 right-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/4 to-transparent" style={{ animationDelay: '4s' }} />
          </div>

          <div className="absolute top-20 right-10 md:right-20 w-64 h-96 rounded-3xl bg-white/[0.03] frosted-glass border border-white/10 transform rotate-6 hidden lg:block" />
          <div className="absolute top-40 right-40 md:right-60 w-48 h-72 rounded-2xl bg-white/[0.05] frosted-glass border border-white/5 transform -rotate-3 hidden lg:block" />

          <div className="relative z-10 h-full flex items-center px-6 md:px-12 lg:px-24 pt-32 pb-20">
            <div className="max-w-5xl">
              <div ref={headingRef}>
                <p className="neuzeit-font text-[#908d9a] uppercase tracking-[0.3em] text-sm mb-6">
                  Projecting Signs & Brackets
                </p>
                <h1 className="hearns-font text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-[0.95] mb-8">
                  Be Seen From<br />
                  <span className="gradient-text">Every Angle</span>
                </h1>
              </div>

              <div ref={subtitleRef} className="max-w-xl mb-12">
                <p className="text-xl md:text-2xl text-[#c1c6c8] font-light leading-relaxed">
                  Wall-mounted brackets and customisable panels – an excellent way to create signage visible from all angles.
                </p>
              </div>

              <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#brackets"
                  className="group inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-[#221c35] font-semibold text-base hover:bg-[#c1c6c8] transition-all duration-300"
                >
                  Choose Your Bracket
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-white/30 text-white font-semibold text-base hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                >
                  Get a Quote
                </a>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        </section>

        {/* Intro Section */}
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-white relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#908d9a]/5" />

          <motion.div
            className="max-w-7xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="mb-12">
              <h2 className="smilecake-font text-5xl md:text-7xl text-[#221c35] mb-4">
                Choose Your Bracket
              </h2>
              <p className="text-xl text-[#383349]/70 max-w-3xl">
                Our brackets come in a range of styles and sizes. Mix and match with customisable panels to improve high-street visibility.
              </p>
              <div className="w-24 h-1 bg-[#908d9a] mt-6" />
            </motion.div>
          </motion.div>
        </section>

        {/* How It Works */}
        <HowItWorksSection
          serviceType="projecting-signs"
          sectionId="how-it-works"
          subtitle="From selecting your bracket style to installation, we make the process simple."
        />

        {/* Blade/Flange Sign */}
        <section id="brackets" className="py-24 px-6 md:px-12 lg:px-24 bg-[#f8f8f8]">
          <motion.div
            className="max-w-7xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-[#221c35] to-[#383349] rounded-3xl p-10 md:p-14 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />

              <div className="grid lg:grid-cols-2 gap-12 items-start">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#908d9a]/20 text-[#908d9a] text-sm font-medium mb-6">
                    Our Cheapest Option!
                  </div>
                  <h3 className="hearns-font text-4xl md:text-5xl mb-4">Blade / Flange Sign</h3>
                  <p className="text-3xl font-bold text-[#908d9a] mb-6">From £52 + VAT</p>
                  <p className="text-white/80 text-lg leading-relaxed mb-8">
                    All-in-one projecting sign solution – just add decals! Our most affordable way to get noticed from the street.
                  </p>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-white mb-3">Sizes Available</h4>
                      <div className="flex flex-wrap gap-3">
                        <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Circular: 47.5cm</span>
                        <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Square: 40cm & 50cm</span>
                        <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Oval: 40 x 55cm (portrait & landscape)</span>
                        <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Rectangle: 55 x 40cm landscape</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 frosted-glass rounded-2xl p-8 border border-white/10">
                  <h4 className="smilecake-font text-2xl text-white mb-6">Specifications</h4>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                      <span className="text-white/80">Laser cut from 2mm thick aluminium</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                      <span className="text-white/80">50mm x 200mm fixing plate</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                      <span className="text-white/80">Stands off the wall by 50mm</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                      <span className="text-white/80">Powder coated white as standard</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                      <span className="text-white/80">Can be wrapped in a range of vinyl colours and finishes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Modern Swing Sign Bracket */}
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-white">
          <motion.div
            className="max-w-7xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <motion.div variants={fadeInUp} className="bg-[#f8f8f8] rounded-3xl p-8 md:p-10 border border-[#c1c6c8]/30">
                <h4 className="smilecake-font text-2xl text-[#221c35] mb-6">Specifications</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#383349]">Heavy duty steel construction</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#383349]">Zinc plated & powder coated</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#383349]">Supplied with FREE wall fixings & hanger bolts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#383349]">Black or White as standard</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#383349]">Other stock colours available</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#383349]">Custom colours in all RAL colours</span>
                  </li>
                </ul>

                <div className="mt-8 pt-6 border-t border-[#c1c6c8]/30">
                  <h5 className="font-semibold text-[#221c35] mb-3">Works With:</h5>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#908d9a]/10 text-[#383349] text-sm">Aluminium Composite Panels</span>
                    <span className="px-3 py-1 rounded-full bg-[#908d9a]/10 text-[#383349] text-sm">Traditional Aluminium Framed Panels</span>
                    <span className="px-3 py-1 rounded-full bg-[#908d9a]/10 text-[#383349] text-sm">PVC Foam Panels</span>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <MoveHorizontal className="w-12 h-12 text-[#908d9a] mb-6" />
                <h3 className="hearns-font text-4xl md:text-5xl text-[#221c35] mb-4">Modern Swing Sign Bracket</h3>
                <p className="text-3xl font-bold text-[#908d9a] mb-4">From £105 + VAT</p>
                <p className="text-[#383349]/70 text-sm mb-6">Traditional bracket styles also available on request.</p>
                <p className="text-[#383349]/80 text-lg leading-relaxed mb-8">
                  A versatile bracket solution that works with multiple panel types. Available in 5 lengths to suit your requirements.
                </p>

                <div>
                  <h4 className="font-semibold text-[#221c35] mb-4">Available Lengths</h4>
                  <div className="grid grid-cols-5 gap-3">
                    {['60cm', '75cm', '85cm', '100cm', '120cm'].map((size) => (
                      <div key={size} className="text-center p-4 rounded-2xl bg-[#f8f8f8] border border-[#c1c6c8]/30">
                        <span className="text-xl font-bold text-[#221c35]">{size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Rigid Projecting Sign */}
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#f8f8f8]">
          <motion.div
            className="max-w-7xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <motion.div variants={fadeInUp}>
                <Square className="w-12 h-12 text-[#908d9a] mb-6" />
                <h3 className="hearns-font text-4xl md:text-5xl text-[#221c35] mb-4">Rigid Projecting Sign</h3>
                <p className="text-3xl font-bold text-[#908d9a] mb-6">From £110 + VAT</p>
                <p className="text-[#383349]/80 text-lg leading-relaxed mb-8">
                  Works with Aluminium Composite Panels for a solid, professional appearance.
                </p>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-[#221c35] mb-3">Square Sizes</h4>
                    <div className="flex flex-wrap gap-2">
                      {['30cm', '40cm', '45cm', '50cm', '55cm', '60cm', '70cm', '75cm', '80cm'].map((size) => (
                        <span key={size} className="px-3 py-1 rounded-full bg-white border border-[#c1c6c8]/30 text-[#383349] text-sm">{size}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#221c35] mb-3">Rectangle Sizes (portrait & landscape)</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-white border border-[#c1c6c8]/30 text-[#383349] text-sm">60 x 40cm</span>
                      <span className="px-3 py-1 rounded-full bg-white border border-[#c1c6c8]/30 text-[#383349] text-sm">90 x 60cm</span>
                      <span className="px-3 py-1 rounded-full bg-white border border-[#c1c6c8]/30 text-[#383349] text-sm">115 x 55cm</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="bg-white rounded-3xl p-8 md:p-10 border border-[#c1c6c8]/30">
                <h4 className="smilecake-font text-2xl text-[#221c35] mb-6">Specifications</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#383349]">Heavy duty steel construction</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#383349]">Zinc plated & powder coated</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#383349]">Supplied with FREE wall fixings</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#383349]">Available in Black or White as standard</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#383349]">Other stock colours available</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-[#383349]">Custom colours in all RAL colours</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Framed Rigid & Illuminated Signs */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[#221c35]" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#383349] transform skew-x-12 origin-top-right hidden md:block" />

          <motion.div
            className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <div className="grid md:grid-cols-2 gap-12">
              {/* Framed Rigid Sign */}
              <motion.div variants={fadeInUp} className="bg-white/5 frosted-glass rounded-3xl p-8 md:p-10 border border-white/10">
                <Wrench className="w-10 h-10 text-[#908d9a] mb-4" />
                <h3 className="hearns-font text-3xl text-white mb-2">Framed Rigid Sign</h3>
                <p className="text-xl text-[#908d9a] font-semibold mb-4">Contact us for a quote</p>
                <p className="text-white/70 leading-relaxed mb-6">
                  A copy of an old style traditional wooden frame but in long-lasting aluminium. This style is more in-keeping with the character of listed properties and is designed to help keep the planners happy!
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                    <span className="text-white/80 text-sm">Custom made to any size</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                    <span className="text-white/80 text-sm">55 x 65mm aluminium frame</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                    <span className="text-white/80 text-sm">Designed to take a 10mm thick panel</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                    <span className="text-white/80 text-sm">Works with PVC Foam Panels</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                    <span className="text-white/80 text-sm">FREE wall mounting brackets & ankerbolt fixings</span>
                  </li>
                </ul>
                <p className="text-white/60 text-sm">Black as standard • Custom RAL colours available</p>
              </motion.div>

              {/* Illuminated Sign */}
              <motion.div variants={fadeInUp} className="bg-white/5 frosted-glass rounded-3xl p-8 md:p-10 border border-white/10">
                <Lightbulb className="w-10 h-10 text-[#908d9a] mb-4" />
                <h3 className="hearns-font text-3xl text-white mb-2">Rigid Illuminated Round Projecting Sign</h3>
                <p className="text-xl text-[#908d9a] font-semibold mb-4">Contact us for a price</p>
                <p className="text-white/70 leading-relaxed mb-6">
                  Make sure your sign is visible at all times of the day and night, especially during the darker months of the year. All-in-one solution – just add decals!
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                    <span className="text-white/80 text-sm">Size: 80 x 80cm (Overall: 80 x 14 x 94cm)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                    <span className="text-white/80 text-sm">Aluminium frame</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                    <span className="text-white/80 text-sm">Face panel: 3mm Acrylic (both sides)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                    <span className="text-white/80 text-sm">Pre-installed energy-saving LED module lights</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-0.5" />
                    <span className="text-white/80 text-sm">FREE wall fixings included</span>
                  </li>
                </ul>
                <p className="text-white/60 text-sm">Note: Supplied pre-wired but will need to be installed or have a plug attached by an electrician</p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Customisation Types */}
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-white">
          <motion.div
            className="max-w-7xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="hearns-font text-5xl md:text-6xl text-[#221c35] mb-4">Types of Customisation</h2>
              <p className="text-xl text-[#383349]/70 max-w-2xl mx-auto">
                We believe in always using high performance materials. Chat to our team for advice on the best option.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Printed Vinyl */}
              <motion.div variants={fadeInUp} className="bg-[#f8f8f8] rounded-3xl p-8 md:p-10 border border-[#c1c6c8]/30">
                <Palette className="w-10 h-10 text-[#908d9a] mb-4" />
                <h3 className="hearns-font text-2xl text-[#221c35] mb-4">Printed Vinyl</h3>
                <p className="text-[#383349]/70 leading-relaxed mb-6">
                  Great for multiple colours & small details. Inks are printed onto clear or white vinyl – ideal for gradients, photographs and complex illustrations. Due to the ink being on the surface, colour can fade quicker than cut vinyl.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#908d9a]" />
                    <span className="text-[#383349] text-sm">Very small text and fine lines</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#908d9a]" />
                    <span className="text-[#383349] text-sm">Gradients & photos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#908d9a]" />
                    <span className="text-[#383349] text-sm">Grunge / stamp effects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#908d9a]" />
                    <span className="text-[#383349] text-sm">Fluorescent / neon colours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#908d9a]" />
                    <span className="text-[#383349] text-sm">Metallic finishes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#908d9a]" />
                    <span className="text-[#383349] text-sm">Glitter + holographic</span>
                  </div>
                </div>
              </motion.div>

              {/* Cut Vinyl */}
              <motion.div variants={fadeInUp} className="bg-[#f8f8f8] rounded-3xl p-8 md:p-10 border border-[#c1c6c8]/30">
                <CircleDot className="w-10 h-10 text-[#908d9a] mb-4" />
                <h3 className="hearns-font text-2xl text-[#221c35] mb-4">Cut Vinyl</h3>
                <p className="text-[#383349]/70 leading-relaxed mb-6">
                  Best suited to simple designs, logos and lettering. A specialist machine cuts shapes from pre-coloured vinyl, giving a sharper edge than printed graphics. Cut vinyl has no background – the background is what you install it onto.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#908d9a]" />
                    <span className="text-[#383349] text-sm">Fluorescent / neon colours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#908d9a]" />
                    <span className="text-[#383349] text-sm">Metallic finishes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#908d9a]" />
                    <span className="text-[#383349] text-sm">Glitter + holographic</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#383349]/50">
                    <XCircle className="w-4 h-4" />
                    <span className="text-sm">Very small text and fine lines</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#383349]/50">
                    <XCircle className="w-4 h-4" />
                    <span className="text-sm">Gradients</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#383349]/50">
                    <XCircle className="w-4 h-4" />
                    <span className="text-sm">Photos</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Installation & CTA */}
        <section className="bg-white">
          <div className="grid md:grid-cols-2">
            <motion.div
              className="py-24 px-6 md:px-12 lg:px-16 bg-[#f8f8f8]"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="hearns-font text-4xl md:text-5xl text-[#221c35] mb-8">
                Our Installation<br />
                <span className="text-[#908d9a]">Team</span>
              </h2>
              <p className="text-[#383349]/80 text-lg leading-relaxed mb-6">
                Our professional install team has years of experience installing signage and is available to fit projecting signs throughout the Midlands.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-0.5" />
                  <span className="text-[#383349]">All access equipment, scaffolding towers and platforms organised</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-0.5" />
                  <span className="text-[#383349]">Fully insured, health & safety and first aid trained</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-0.5" />
                  <span className="text-[#383349]">Risk assessments supplied on request</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-0.5" />
                  <span className="text-[#383349]">Want to install yourself? We supply with all fixings needed</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              className="py-24 px-6 md:px-12 lg:px-16 bg-[#221c35]"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="smilecake-font text-4xl text-white mb-8">
                Ready to Stand Out?
              </h2>
              <p className="text-white/80 text-lg leading-relaxed mb-8">
                Contact us for advice on selecting your bracket, panel & customisation style, design, installation or any other questions you may have.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#908d9a]" />
                  <span className="text-white/80">Free design consultation</span>
                </li>
                <li className="flex items-center gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#908d9a]" />
                  <span className="text-white/80">Professional mockups</span>
                </li>
                <li className="flex items-center gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#908d9a]" />
                  <span className="text-white/80">Expert installation available</span>
                </li>
              </ul>

              <a
                href="/contact"
                className="w-full inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-[#221c35] font-semibold hover:bg-[#c1c6c8] transition-all duration-300"
              >
                <Mail className="w-5 h-5 mr-2" />
                Get a Quote
              </a>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ProjectingSigns;
