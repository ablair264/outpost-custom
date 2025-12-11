import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Mail, Eye, Wind, Layers, Palette, Target, Printer, Scissors } from 'lucide-react';
import { usePageTheme } from '../contexts/ThemeContext';
import HowItWorksSection from '../components/HowItWorksSection';

const PavementSigns: React.FC = () => {
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

          {/* Frosted glass panels decoration */}
          <div className="absolute top-20 right-10 md:right-20 w-64 h-96 rounded-3xl bg-white/[0.03] frosted-glass border border-white/10 transform rotate-6 hidden lg:block" />
          <div className="absolute top-40 right-40 md:right-60 w-48 h-72 rounded-2xl bg-white/[0.05] frosted-glass border border-white/5 transform -rotate-3 hidden lg:block" />

          {/* Main content */}
          <div className="relative z-10 h-full flex items-center px-6 md:px-12 lg:px-24 pt-32 pb-20">
            <div className="max-w-5xl">
              <div ref={headingRef}>
                <p className="neuzeit-font text-[#908d9a] uppercase tracking-[0.3em] text-sm mb-6">
                  Pavement & Forecourt Signs
                </p>
                <h1 className="hearns-font text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-[0.95] mb-8">
                  Stand Out,<br />
                  <span className="gradient-text">Get Noticed</span>
                </h1>
              </div>

              <div ref={subtitleRef} className="max-w-xl mb-12">
                <p className="text-xl md:text-2xl text-[#c1c6c8] font-light leading-relaxed">
                  Free-standing signs that capture passing footfall and drive customers through your door.
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
                  Get a Quote
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
                Perfect For
              </h2>
              <div className="w-24 h-1 bg-[#908d9a]" />
            </motion.div>

            {/* Staggered layout - not cards */}
            <div className="grid md:grid-cols-12 gap-8 md:gap-12">
              {/* Retail */}
              <motion.div variants={fadeInUp} className="md:col-span-5">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#383349] to-[#221c35] flex items-center justify-center flex-shrink-0">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-3">Retail Stores</h3>
                    <p className="text-lg text-[#383349]/80 leading-relaxed">
                      Announce promotions, new arrivals, or simply mark your presence on the high street with eye-catching pavement signs.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Hospitality - offset */}
              <motion.div variants={fadeInUp} className="md:col-span-5 md:col-start-7 md:mt-24">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#908d9a] to-[#383349] flex items-center justify-center flex-shrink-0">
                    <Eye className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-3">Cafes & Restaurants</h3>
                    <p className="text-lg text-[#383349]/80 leading-relaxed">
                      Display daily specials, happy hour offers, or menu highlights to entice hungry passersby into your establishment.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Events - centered */}
              <motion.div variants={fadeInUp} className="md:col-span-6 md:col-start-4 md:mt-12">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#c1c6c8] to-[#908d9a] flex items-center justify-center flex-shrink-0">
                    <Wind className="w-10 h-10 text-[#221c35]" />
                  </div>
                  <div>
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-3">Events & Markets</h3>
                    <p className="text-lg text-[#383349]/80 leading-relaxed">
                      Portable and lightweight options perfect for trade shows, farmers markets, and outdoor festivals where you need to grab attention fast.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <HowItWorksSection
          serviceType="pavement-signs"
          sectionId="how-it-works"
          subtitle="Choose from our standard frames or bring your own for rebranding. Our design team will help create eye-catching graphics to promote your business."
        />

        {/* Product Highlight - Eco Swing */}
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
                Eco Swing
              </h2>
              <p className="text-xl text-[#383349]/70 max-w-2xl mx-auto">
                Our bestselling pavement sign, built to handle windy locations.
              </p>
            </motion.div>

            {/* Asymmetric masonry-style layout */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Main Feature - Large */}
              <motion.div
                variants={fadeInUp}
                className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-[#221c35] to-[#383349] rounded-3xl p-10 md:p-14 text-white relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
                <Layers className="w-12 h-12 text-[#908d9a] mb-6" />
                <h3 className="hearns-font text-4xl md:text-5xl mb-4">Best for Windy Locations</h3>
                <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-md">
                  The swinging panel design allows the sign to move with the wind, reducing the chance of toppling. Built with a steel tubing frame and recycled PVC base.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Water-fillable base</span>
                  <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Wheels for easy transport</span>
                  <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Aluminium double-sided panel</span>
                  <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Steel tubing frame</span>
                  <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Black or white frame</span>
                  <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Easily swap out panels</span>
                </div>
              </motion.div>

              {/* Sizes */}
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-3xl p-8 border border-[#c1c6c8]/30 hover:border-[#908d9a]/50 transition-colors"
              >
                <h3 className="hearns-font text-2xl text-[#221c35] mb-4">Panel Sizes</h3>
                <ul className="space-y-2 text-[#383349]/70">
                  <li className="flex justify-between"><span>Small:</span> <span className="font-medium text-[#221c35]">430 x 625mm</span></li>
                  <li className="flex justify-between"><span>Medium:</span> <span className="font-medium text-[#221c35]">500 x 750mm</span></li>
                  <li className="flex justify-between"><span>Large:</span> <span className="font-medium text-[#221c35]">588 x 917mm</span></li>
                </ul>
              </motion.div>

              {/* Weights */}
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-3xl p-8 border border-[#c1c6c8]/30 hover:border-[#908d9a]/50 transition-colors"
              >
                <h3 className="hearns-font text-2xl text-[#221c35] mb-4">Frame Weights</h3>
                <ul className="space-y-2 text-[#383349]/70">
                  <li className="flex justify-between"><span>Small:</span> <span className="font-medium text-[#221c35]">11kg</span></li>
                  <li className="flex justify-between"><span>Medium:</span> <span className="font-medium text-[#221c35]">16kg</span></li>
                  <li className="flex justify-between"><span>Large (empty):</span> <span className="font-medium text-[#221c35]">13kg</span></li>
                  <li className="flex justify-between"><span>Large (with water):</span> <span className="font-medium text-[#221c35]">31kg</span></li>
                </ul>
              </motion.div>

              {/* Features - Wide */}
              <motion.div
                variants={fadeInUp}
                className="md:col-span-3 bg-gradient-to-r from-[#908d9a]/10 via-[#908d9a]/5 to-transparent rounded-3xl p-10 flex flex-col md:flex-row items-center gap-8"
              >
                <Palette className="w-16 h-16 text-[#383349] flex-shrink-0" />
                <div>
                  <h3 className="hearns-font text-3xl text-[#221c35] mb-2">Customisation Options</h3>
                  <p className="text-[#383349]/70 text-lg leading-relaxed">
                    Choose from printed vinyl for full-colour graphics or cut vinyl for clean text and logos. Add guy ropes and stakes for extra stability.
                  </p>
                </div>
                <a href="/contact" className="flex-shrink-0 px-6 py-3 rounded-full bg-[#383349] text-white font-medium hover:bg-[#221c35] transition-colors">
                  Get a Quote
                </a>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Build Quality Section */}
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
                <h2 className="hearns-font text-4xl md:text-6xl text-white mb-6">
                  Built to<br />Last
                </h2>
                <p className="text-xl text-white/80 leading-relaxed mb-8">
                  All frames manufactured from high-quality materials, built to withstand exterior conditions. Specify wind exposure to match the right frame type for your location.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a]" />
                    <span className="text-white/90">Replacement panels available</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a]" />
                    <span className="text-white/90">Reusable across campaigns</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 frosted-glass rounded-3xl p-8 md:p-10 border border-white/10">
                <h3 className="smilecake-font text-3xl text-white mb-6">Need Support?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-white/80">Help selecting frame type & size</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-white/80">Customisation method advice</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-white/80">Design assistance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-white/80">Installation guidance</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Customisation Types Section */}
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-white relative overflow-hidden">
          <motion.div
            className="max-w-7xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="smilecake-font text-5xl md:text-6xl text-[#221c35] mb-4">
                Types of Customisation
              </h2>
              <p className="text-xl text-[#383349]/70 max-w-2xl mx-auto">
                We believe in always using high performance materials. Chat to our team who can advise on the best type of customisation for your business.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Printed Vinyl */}
              <motion.div
                variants={fadeInUp}
                className="bg-gradient-to-br from-[#221c35] to-[#383349] rounded-3xl p-8 md:p-10 text-white"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Printer className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="hearns-font text-3xl">Printed Vinyl</h3>
                </div>
                <p className="text-white/70 mb-6 leading-relaxed">
                  Inks are used to print a design onto clear or white vinyl. Ideal for multiple colours, gradients, shading, photographs and complex illustrations.
                </p>
                <p className="text-[#908d9a] text-sm mb-6">
                  Great for multiple colours & small details
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-white/80">Very small text and fine lines</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-white/80">Gradients and shading</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-white/80">Photos and illustrations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-white/80">Grunge / stamp effects</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-white/80">Fluorescent / neon colours</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-white/80">Metallic finishes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-white/80">Glitter + holographic</span>
                  </div>
                </div>
                <p className="text-white/60 text-sm mt-6 pt-6 border-t border-white/10">
                  Note: Due to ink being on the surface, colour can fade quicker than cut vinyl which has colour throughout the material.
                </p>
              </motion.div>

              {/* Cut Vinyl */}
              <motion.div
                variants={fadeInUp}
                className="bg-[#f8f8f8] rounded-3xl p-8 md:p-10 border border-[#c1c6c8]/30"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#221c35] flex items-center justify-center">
                    <Scissors className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="hearns-font text-3xl text-[#221c35]">Cut Vinyl</h3>
                </div>
                <p className="text-[#383349]/80 mb-6 leading-relaxed">
                  A specialist machine cuts out shapes and letters from pre-coloured rolls of vinyl. This gives a sharper edge to the artwork than printed graphics.
                </p>
                <p className="text-[#908d9a] text-sm mb-6">
                  Best suited to simple designs, logos and lettering
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-[#383349]/80">Fluorescent / neon colours</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-[#383349]/80">Metallic finishes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-[#383349]/80">Glitter + holographic</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-[#383349]/50">Very small text and fine lines</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-[#383349]/50">Gradients</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-[#383349]/50">Photos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-[#383349]/50">Grunge / stamp effects</span>
                  </div>
                </div>
                <p className="text-[#383349]/60 text-sm mt-6 pt-6 border-t border-[#c1c6c8]/30">
                  Cut vinyl decals have no background – the background you see is what you install onto, be that a bare surface or pre-applied coloured vinyl.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* CTA Section - Split screen */}
        <section className="bg-white">
          <div className="grid md:grid-cols-2">
            {/* Left - Info */}
            <motion.div
              className="py-24 px-6 md:px-12 lg:px-16 bg-[#f8f8f8]"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="hearns-font text-4xl md:text-5xl text-[#221c35] mb-8">
                Ready to<br />
                <span className="text-[#908d9a]">Stand Out?</span>
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#221c35] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#221c35] text-lg mb-1">Choose Your Frame</h3>
                    <p className="text-[#383349]/70">Standard sizes available or bring your own for rebranding.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#908d9a] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#221c35] text-lg mb-1">Custom Graphics</h3>
                    <p className="text-[#383349]/70">Our design team creates eye-catching graphics tailored to your brand.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right - CTA */}
            <motion.div
              className="py-24 px-6 md:px-12 lg:px-16 bg-[#221c35]"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="smilecake-font text-4xl text-white mb-8">
                Get Your Free Quote
              </h2>
              <p className="text-white/80 text-lg leading-relaxed mb-8">
                Tell us about your business and we'll recommend the perfect pavement sign solution for your location and budget.
              </p>

              <a
                href="/contact"
                className="w-full inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-[#221c35] font-semibold hover:bg-[#c1c6c8] transition-all duration-300"
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact Our Team
              </a>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PavementSigns;
