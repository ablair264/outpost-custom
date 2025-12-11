import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { CheckCircle2, Frame, Ruler, Eye, Shield, Mail, Palette, Package, ImageIcon } from 'lucide-react';
import { usePageTheme } from '../contexts/ThemeContext';
import HowItWorksSection from '../components/HowItWorksSection';

const GlassManifestation: React.FC = () => {
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

        /* Frosted glass effect */
        .frosted-glass {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        /* Light ray animation */
        @keyframes lightRay {
          0%, 100% { opacity: 0.3; transform: translateX(-100%) skewX(-15deg); }
          50% { opacity: 0.6; transform: translateX(200%) skewX(-15deg); }
        }
        .light-ray {
          animation: lightRay 8s ease-in-out infinite;
        }

        /* Gradient text */
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
          {/* Animated light rays */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="light-ray absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <div className="light-ray absolute top-0 left-1/4 w-1/4 h-full bg-gradient-to-r from-transparent via-white/3 to-transparent" style={{ animationDelay: '2s' }} />
            <div className="light-ray absolute top-0 right-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/4 to-transparent" style={{ animationDelay: '4s' }} />
          </div>

          {/* Hero Image */}
          <div className="absolute top-20 right-8 md:right-16 lg:right-24 w-[300px] md:w-[400px] lg:w-[500px] h-[400px] md:h-[500px] lg:h-[600px] hidden md:block">
            {/* IMAGE: Glass door/partition with frosted manifestation pattern, showing safety compliance */}
            <div className="w-full h-full rounded-3xl bg-white/[0.03] frosted-glass border-2 border-dashed border-white/20 flex flex-col items-center justify-center">
              <ImageIcon className="w-16 h-16 text-white/30 mb-4" />
              <span className="text-white/40 text-sm text-center px-4">Hero Image: Glass with manifestation pattern</span>
            </div>
          </div>

          {/* Main content */}
          <div className="relative z-10 h-full flex items-center px-6 md:px-12 lg:px-24 pt-32 pb-20">
            <div className="max-w-5xl">
              <div ref={headingRef}>
                <p className="neuzeit-font text-[#908d9a] uppercase tracking-[0.3em] text-sm mb-6">
                  Glass Manifestation
                </p>
                <h1 className="hearns-font text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-[0.95] mb-8">
                  Safety Meets<br />
                  <span className="gradient-text">Style</span>
                </h1>
              </div>

              <div ref={subtitleRef} className="max-w-xl mb-12">
                <p className="text-xl md:text-2xl text-[#c1c6c8] font-light leading-relaxed">
                  Compliant frosted graphics for commercial glazing that prevent accidents and elevate your space.
                </p>
              </div>

              <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#how-it-works"
                  className="group inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-[#221c35] font-semibold text-base hover:bg-[#c1c6c8] transition-all duration-300"
                >
                  See How It Works
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-white/30 text-white font-semibold text-base hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                >
                  Free Site Survey
                </a>
              </div>
            </div>
          </div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        </section>

        {/* Perfect For Section - Editorial staggered layout */}
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-white relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#908d9a]/5" />

          <motion.div
            className="max-w-7xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="mb-20">
              <h2 className="smilecake-font text-5xl md:text-7xl text-[#221c35] mb-4">
                Why It Matters
              </h2>
              <div className="w-24 h-1 bg-[#908d9a]" />
            </motion.div>

            {/* Staggered layout */}
            <div className="grid md:grid-cols-12 gap-8 md:gap-12">
              {/* Compliance */}
              <motion.div variants={fadeInUp} className="md:col-span-5">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#383349] to-[#221c35] flex items-center justify-center flex-shrink-0">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-3">Building Regulations</h3>
                    <p className="text-lg text-[#383349]/80 leading-relaxed">
                      Complies with K5.2 and DDA guidance, ensuring safe transparent glazing in commercial and public spaces.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Visibility - offset */}
              <motion.div variants={fadeInUp} className="md:col-span-5 md:col-start-7 md:mt-24">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#908d9a] to-[#383349] flex items-center justify-center flex-shrink-0">
                    <Eye className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-3">Light & Privacy</h3>
                    <p className="text-lg text-[#383349]/80 leading-relaxed">
                      Frosted film provides visibility while allowing natural light through. Standard film allows up to 80% light transmission.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Customisation - centered */}
              <motion.div variants={fadeInUp} className="md:col-span-6 md:col-start-4 md:mt-12">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#c1c6c8] to-[#908d9a] flex items-center justify-center flex-shrink-0">
                    <Palette className="w-10 h-10 text-[#221c35]" />
                  </div>
                  <div>
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-3">Design Options</h3>
                    <p className="text-lg text-[#383349]/80 leading-relaxed">
                      Choose from 16 stock patterns or create bespoke designs that incorporate your branding and wayfinding elements.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <HowItWorksSection
          serviceType="glass-manifestation"
          sectionId="how-it-works"
          subtitle="Our glass manifestation service ensures compliance with building regulations while maintaining style. From free site surveys to professional installation."
        />

        {/* Customisation Options - Asymmetric grid */}
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#f8f8f8] relative overflow-hidden">
          {/* Background texture */}
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'url(/ConcreteTexture.webp)', backgroundSize: 'cover' }} />

          <motion.div
            className="max-w-7xl mx-auto relative z-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="text-center mb-20">
              <h2 className="hearns-font text-5xl md:text-7xl text-[#221c35] mb-4">
                Make It Yours
              </h2>
              <p className="text-xl text-[#383349]/70 max-w-2xl mx-auto">
                Every space is different. That's why we offer complete customisation.
              </p>
            </motion.div>

            {/* Asymmetric masonry-style layout */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Patterns - Large */}
              <motion.div
                variants={fadeInUp}
                className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-[#221c35] to-[#383349] rounded-3xl p-10 md:p-14 text-white relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div>
                    <Frame className="w-12 h-12 text-[#908d9a] mb-6" />
                    <h3 className="hearns-font text-4xl md:text-5xl mb-4">Patterns & Designs</h3>
                    <p className="text-white/80 text-lg leading-relaxed mb-8">
                      Choose from 16 stock designs or request bespoke motifs. From subtle dots to geometric patterns, we have options to match any aesthetic.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Dots & circles</span>
                      <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Stripes & bands</span>
                      <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Geometric</span>
                      <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Custom artwork</span>
                    </div>
                  </div>
                  {/* IMAGE: Various manifestation patterns on glass */}
                  <div className="h-64 md:h-full min-h-[200px] rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-white/30 mb-3" />
                    <span className="text-white/40 text-sm text-center px-4">Pattern samples on glass</span>
                  </div>
                </div>
              </motion.div>

              {/* Text & Wayfinding */}
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-3xl p-8 border border-[#c1c6c8]/30 hover:border-[#908d9a]/50 transition-colors"
              >
                <Mail className="w-10 h-10 text-[#908d9a] mb-4" />
                <h3 className="hearns-font text-2xl text-[#221c35] mb-3">Text & Wayfinding</h3>
                <p className="text-[#383349]/70 leading-relaxed">
                  Integrate directional text or notices that double as visibility strips. Functional and compliant.
                </p>
              </motion.div>

              {/* Logos & Branding */}
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-3xl p-8 border border-[#c1c6c8]/30 hover:border-[#908d9a]/50 transition-colors"
              >
                <Palette className="w-10 h-10 text-[#908d9a] mb-4" />
                <h3 className="hearns-font text-2xl text-[#221c35] mb-3">Logos & Branding</h3>
                <p className="text-[#383349]/70 leading-relaxed">
                  Embed your logo into the etched film for consistent corporate identity throughout your space.
                </p>
              </motion.div>

              {/* Opacity - Wide */}
              <motion.div
                variants={fadeInUp}
                className="md:col-span-3 bg-gradient-to-r from-[#908d9a]/10 via-[#908d9a]/5 to-transparent rounded-3xl p-10 flex flex-col md:flex-row items-center gap-8"
              >
                <Eye className="w-16 h-16 text-[#383349] flex-shrink-0" />
                <div>
                  <h3 className="hearns-font text-3xl text-[#221c35] mb-2">Opacity Choices</h3>
                  <p className="text-[#383349]/70 text-lg leading-relaxed">
                    Standard film allows 80% light through. We also offer lighter and heavier frost options, plus coloured films to match your interior scheme.
                  </p>
                </div>
                <a href="/contact" className="flex-shrink-0 px-6 py-3 rounded-full bg-[#383349] text-white font-medium hover:bg-[#221c35] transition-colors">
                  Explore Options
                </a>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Compliance Section */}
        <section className="relative py-32 overflow-hidden">
          {/* Diagonal background */}
          <div className="absolute inset-0 bg-[#221c35]" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#383349] transform skew-x-12 origin-top-right hidden md:block" />

          <motion.div
            className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 lg:px-24"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#908d9a]/20 text-[#908d9a] text-sm font-medium mb-6">
                  <Shield className="w-4 h-4" />
                  Building Regulation K5.2
                </div>
                <h2 className="hearns-font text-4xl md:text-6xl text-white mb-6">
                  Legal<br />Requirements
                </h2>
                <p className="text-xl text-white/80 leading-relaxed mb-8">
                  Transparent glazing that people may contact must include <strong className="text-[#908d9a]">permanent markers</strong> to make it apparent.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a]" />
                    <span className="text-white/90">850-1000mm from floor</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a]" />
                    <span className="text-white/90">1400-1600mm from floor</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 frosted-glass rounded-3xl p-8 md:p-10 border border-white/10">
                <h3 className="smilecake-font text-3xl text-white mb-6">Who Needs It?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-white/80">Offices with glass partitions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-white/80">Retail fronts and doors</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-white/80">Meeting rooms</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-white/80">Bathrooms and kitchens</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Gallery Section */}
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-white">
          <motion.div
            className="max-w-7xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="smilecake-font text-5xl md:text-6xl text-[#221c35] mb-4">Our Work</h2>
              <p className="text-xl text-[#383349]/70 max-w-2xl mx-auto">
                Browse examples of glass manifestation installed for our commercial clients.
              </p>
            </motion.div>

            {/* Masonry Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {/* Row 1 */}
              <motion.div variants={fadeInUp} className="aspect-[4/5] rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-[#f8f8f8]">
                {/* IMAGE: Office glass partition with dot pattern */}
                <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                <span className="text-[#383349]/40 text-xs text-center px-2">Office partition</span>
              </motion.div>
              <motion.div variants={fadeInUp} className="aspect-square rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-[#f8f8f8]">
                {/* IMAGE: Retail storefront with branded manifestation */}
                <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                <span className="text-[#383349]/40 text-xs text-center px-2">Retail storefront</span>
              </motion.div>
              <motion.div variants={fadeInUp} className="aspect-[4/5] rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-[#f8f8f8]">
                {/* IMAGE: Meeting room with frosted bands */}
                <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                <span className="text-[#383349]/40 text-xs text-center px-2">Meeting room</span>
              </motion.div>
              {/* Row 2 */}
              <motion.div variants={fadeInUp} className="aspect-square rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-[#f8f8f8]">
                {/* IMAGE: Glass door with company logo */}
                <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                <span className="text-[#383349]/40 text-xs text-center px-2">Branded door</span>
              </motion.div>
              <motion.div variants={fadeInUp} className="aspect-[4/5] rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-[#f8f8f8]">
                {/* IMAGE: Geometric pattern on internal glass */}
                <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                <span className="text-[#383349]/40 text-xs text-center px-2">Geometric pattern</span>
              </motion.div>
              <motion.div variants={fadeInUp} className="aspect-square rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-[#f8f8f8]">
                {/* IMAGE: Full height frosted privacy glass */}
                <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                <span className="text-[#383349]/40 text-xs text-center px-2">Privacy glass</span>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Installation & Care - Split screen */}
        <section className="bg-white">
          <div className="grid md:grid-cols-2">
            {/* Installation */}
            <motion.div
              className="py-24 px-6 md:px-12 lg:px-16 bg-[#f8f8f8]"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="hearns-font text-4xl md:text-5xl text-[#221c35] mb-8">
                Professional<br />
                <span className="text-[#908d9a]">Installation</span>
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#221c35] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#221c35] text-lg mb-1">Free Site Survey</h3>
                    <p className="text-[#383349]/70">We'll assess your glazing and recommend the best solution.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#908d9a] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#221c35] text-lg mb-1">Expert Fitting</h3>
                    <p className="text-[#383349]/70">Experienced technicians provide bubble-free application with access equipment included.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Care */}
            <motion.div
              className="py-24 px-6 md:px-12 lg:px-16 bg-[#221c35]"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="smilecake-font text-4xl text-white mb-8">
                Care & Maintenance
              </h2>
              <ul className="space-y-5 mb-8">
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Wait 3 weeks after fitting before first clean</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Use mild soapy water with soft cloth</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Avoid abrasive pads on cut edges</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Never use ammonia-based cleaning products</span>
                </li>
              </ul>

              <a
                href="/contact"
                className="w-full inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-[#221c35] font-semibold hover:bg-[#c1c6c8] transition-all duration-300"
              >
                <Mail className="w-5 h-5 mr-2" />
                Book Free Survey
              </a>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default GlassManifestation;
