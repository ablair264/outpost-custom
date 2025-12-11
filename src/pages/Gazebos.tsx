import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { CheckCircle2, Tent, Palette, Package, Sparkles, Ruler, Mail, Wind, Shield } from 'lucide-react';
import { usePageTheme } from '../contexts/ThemeContext';
import HowItWorksSection from '../components/HowItWorksSection';

const Gazebos: React.FC = () => {
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
                  Custom Gazebos
                </p>
                <h1 className="hearns-font text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-[0.95] mb-8">
                  Turn Shelter<br />
                  <span className="gradient-text">Into Branded</span><br />
                  Marketing Space
                </h1>
              </div>

              <div ref={subtitleRef} className="max-w-xl mb-12">
                <p className="text-xl md:text-2xl text-[#c1c6c8] font-light leading-relaxed">
                  Custom printed gazebos for outdoor events, markets, and branded activations.
                </p>
              </div>

              <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#options"
                  className="group inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-[#221c35] font-semibold text-base hover:bg-[#c1c6c8] transition-all duration-300"
                >
                  View Options
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-white/30 text-white font-semibold text-base hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                >
                  Get Free Mockup
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

            {/* Staggered layout */}
            <div className="grid md:grid-cols-12 gap-8 md:gap-12">
              {/* Markets */}
              <motion.div variants={fadeInUp} className="md:col-span-5">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#383349] to-[#221c35] flex items-center justify-center flex-shrink-0">
                    <Package className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-3">Markets & Fairs</h3>
                    <p className="text-lg text-[#383349]/80 leading-relaxed">
                      Stand out from the crowd at farmers markets, craft fairs, and trade shows with eye-catching branded canopies.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Events - offset */}
              <motion.div variants={fadeInUp} className="md:col-span-5 md:col-start-7 md:mt-24">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#908d9a] to-[#383349] flex items-center justify-center flex-shrink-0">
                    <Tent className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-3">Outdoor Events</h3>
                    <p className="text-lg text-[#383349]/80 leading-relaxed">
                      Corporate events, festivals, and activations. Provide branded shelter that doubles as advertising.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Hospitality - centered */}
              <motion.div variants={fadeInUp} className="md:col-span-6 md:col-start-4 md:mt-12">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#c1c6c8] to-[#908d9a] flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-10 h-10 text-[#221c35]" />
                  </div>
                  <div>
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-3">Pop-Up Spaces</h3>
                    <p className="text-lg text-[#383349]/80 leading-relaxed">
                      Create branded pop-up retail spaces, food stalls, or promotional activations anywhere outdoors.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <HowItWorksSection
          serviceType="gazebos"
          sectionId="how-it-works"
          subtitle="Our custom gazebos provide branded shelter for outdoor events and markets. Choose from mid-range or heavy-duty options, then work with our design team to create eye-catching canopies."
        />

        {/* Gazebo Options Section - Asymmetric grid */}
        <section id="options" className="py-24 px-6 md:px-12 lg:px-24 bg-[#f8f8f8] relative overflow-hidden">
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
                Choose Your Spec
              </h2>
              <p className="text-xl text-[#383349]/70 max-w-2xl mx-auto">
                Supply your own structure or choose from our vetted models with full-colour printing.
              </p>
            </motion.div>

            {/* Asymmetric masonry-style layout */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Mid-Range - Large */}
              <motion.div
                variants={fadeInUp}
                className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-[#221c35] to-[#383349] rounded-3xl p-10 md:p-14 text-white relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
                <Tent className="w-12 h-12 text-[#908d9a] mb-6" />
                <h3 className="hearns-font text-4xl md:text-5xl mb-4">Mid-Range</h3>
                <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-md">
                  Light commercial grade, perfect for market stalls and occasional events.
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a]" />
                    <span className="text-white/90">3×3m: £175 + VAT</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a]" />
                    <span className="text-white/90">3×4.5m: £200 + VAT</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a]" />
                    <span className="text-white/90">3×6m: £265 + VAT</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 rounded-full bg-white/10 text-sm">420D polyester</span>
                  <span className="px-4 py-2 rounded-full bg-white/10 text-sm">PVC-backed</span>
                  <span className="px-4 py-2 rounded-full bg-white/10 text-sm">1-year warranty</span>
                  <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Wheeled carry case</span>
                </div>
              </motion.div>

              {/* Heavy-Duty */}
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-3xl p-8 border border-[#c1c6c8]/30 hover:border-[#908d9a]/50 transition-colors"
              >
                <Package className="w-10 h-10 text-[#908d9a] mb-4" />
                <h3 className="hearns-font text-2xl text-[#221c35] mb-3">Heavy-Duty</h3>
                <p className="text-[#383349]/70 leading-relaxed mb-4">
                  Reinforced construction for frequent outdoor use.
                </p>
                <div className="text-sm text-[#383349]/80 space-y-1">
                  <p>3×3m: £295 + VAT</p>
                  <p>3×4.5m: £365 + VAT</p>
                  <p>3×6m: £455 + VAT</p>
                </div>
              </motion.div>

              {/* Optional Walls */}
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-3xl p-8 border border-[#c1c6c8]/30 hover:border-[#908d9a]/50 transition-colors"
              >
                <Wind className="w-10 h-10 text-[#908d9a] mb-4" />
                <h3 className="hearns-font text-2xl text-[#221c35] mb-3">Optional Walls</h3>
                <p className="text-[#383349]/70 leading-relaxed">
                  Solid, windowed, or zip doorway options available to complete your setup.
                </p>
              </motion.div>

              {/* Replacement Canopies - Wide */}
              <motion.div
                variants={fadeInUp}
                className="md:col-span-3 bg-gradient-to-r from-[#908d9a]/10 via-[#908d9a]/5 to-transparent rounded-3xl p-10 flex flex-col md:flex-row items-center gap-8"
              >
                <Ruler className="w-16 h-16 text-[#383349] flex-shrink-0" />
                <div>
                  <h3 className="hearns-font text-3xl text-[#221c35] mb-2">Replacement Canopies</h3>
                  <p className="text-[#383349]/70 text-lg leading-relaxed">
                    Already have a frame? We can print custom replacement canopies to refresh your existing gazebo with new branding.
                  </p>
                </div>
                <a href="/contact" className="flex-shrink-0 px-6 py-3 rounded-full bg-[#383349] text-white font-medium hover:bg-[#221c35] transition-colors">
                  Get Quote
                </a>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Customisation - Full bleed with diagonal split */}
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
                  <Palette className="w-4 h-4" />
                  Full Customisation
                </div>
                <h2 className="hearns-font text-4xl md:text-6xl text-white mb-6">
                  Make It<br />Unmistakably Yours
                </h2>
                <p className="text-xl text-white/80 leading-relaxed mb-8">
                  Full-colour printing on canopy peaks, valances, and walls. Discounts available for multi-panel packages.
                </p>
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#908d9a]" />
                  <span className="text-white/90">Free design mockups before you commit</span>
                </div>
              </div>

              <div className="bg-white/5 frosted-glass rounded-3xl p-8 md:p-10 border border-white/10">
                <h3 className="smilecake-font text-3xl text-white mb-6">Print Options</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-white/80">Printed vinyl: gradients, photos, fluorescent or metallic</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-white/80">Cut vinyl: sharp logos and lettering, no background</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-white/80">Coverage options for canopy, valances, and walls</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-white/80">Design support for placement and budget optimisation</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features & CTA - Split screen */}
        <section className="bg-white">
          <div className="grid md:grid-cols-2">
            {/* Features */}
            <motion.div
              className="py-24 px-6 md:px-12 lg:px-16 bg-[#f8f8f8]"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="hearns-font text-4xl md:text-5xl text-[#221c35] mb-8">
                Built to<br />
                <span className="text-[#908d9a]">Withstand</span>
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#221c35] flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#221c35] text-lg mb-1">100% Waterproof</h3>
                    <p className="text-[#383349]/70">PVC-backed polyester keeps you dry in any weather.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#908d9a] flex items-center justify-center flex-shrink-0">
                    <Wind className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#221c35] text-lg mb-1">Powder-Coated Frames</h3>
                    <p className="text-[#383349]/70">Steel frames with 32×32mm legs for stability and durability.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              className="py-24 px-6 md:px-12 lg:px-16 bg-[#221c35]"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="smilecake-font text-4xl text-white mb-8">
                Ready to Stand Out at Events?
              </h2>
              <p className="text-white/80 text-lg leading-relaxed mb-8">
                Get help selecting the right spec, planning artwork coverage, or arranging rush jobs for upcoming events.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#908d9a]" />
                  <span className="text-white/80">Free design consultation</span>
                </li>
                <li className="flex items-center gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#908d9a]" />
                  <span className="text-white/80">Quick turnaround available</span>
                </li>
                <li className="flex items-center gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#908d9a]" />
                  <span className="text-white/80">Nationwide delivery</span>
                </li>
              </ul>

              <a
                href="/contact"
                className="w-full inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-[#221c35] font-semibold hover:bg-[#c1c6c8] transition-all duration-300"
              >
                <Mail className="w-5 h-5 mr-2" />
                Get Free Quote & Mockup
              </a>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Gazebos;
