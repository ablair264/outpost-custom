import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { CheckCircle2, Umbrella, Mail, Palette, Package, Sun, Repeat } from 'lucide-react';
import { usePageTheme } from '../contexts/ThemeContext';
import HowItWorksSection from '../components/HowItWorksSection';

const Parasols: React.FC = () => {
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
                  Branded Parasols
                </p>
                <h1 className="hearns-font text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-[0.95] mb-8">
                  Shade Plus<br />
                  <span className="gradient-text">Branding</span>
                </h1>
              </div>

              <div ref={subtitleRef} className="max-w-xl mb-12">
                <p className="text-xl md:text-2xl text-[#c1c6c8] font-light leading-relaxed">
                  High-visibility branding for outdoor markets, hospitality terraces, and events.
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
                  Free Mockup
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
                Why Branded Parasols?
              </h2>
              <div className="w-24 h-1 bg-[#908d9a]" />
            </motion.div>

            {/* Staggered layout */}
            <div className="grid md:grid-cols-12 gap-8 md:gap-12">
              {/* Options */}
              <motion.div variants={fadeInUp} className="md:col-span-5">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#383349] to-[#221c35] flex items-center justify-center flex-shrink-0">
                    <Umbrella className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-3">Your Choice</h3>
                    <p className="text-lg text-[#383349]/80 leading-relaxed">
                      Supply your own parasol or select from our vetted models. We'll customise to your specification.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Printing - offset */}
              <motion.div variants={fadeInUp} className="md:col-span-5 md:col-start-7 md:mt-24">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#908d9a] to-[#383349] flex items-center justify-center flex-shrink-0">
                    <Palette className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-3">Custom Printing</h3>
                    <p className="text-lg text-[#383349]/80 leading-relaxed">
                      Print on up to 6 panels per parasol. Multicolour logos, gradients, and detailed graphics available.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Replacements - centered */}
              <motion.div variants={fadeInUp} className="md:col-span-6 md:col-start-4 md:mt-12">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#c1c6c8] to-[#908d9a] flex items-center justify-center flex-shrink-0">
                    <Repeat className="w-10 h-10 text-[#221c35]" />
                  </div>
                  <div>
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-3">Replacement Canopies</h3>
                    <p className="text-lg text-[#383349]/80 leading-relaxed">
                      Refresh your branding or update for seasonal campaigns with replacement canopy panels.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <HowItWorksSection
          serviceType="parasols"
          sectionId="how-it-works"
          subtitle="Our branded parasols combine practical shade with high-visibility marketing. Available in multiple sizes with custom printing on up to 6 panels."
        />

        {/* Parasol Options - Asymmetric grid */}
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
                Parasol Options
              </h2>
              <p className="text-xl text-[#383349]/70 max-w-2xl mx-auto">
                Choose from our range of quality parasols.
              </p>
            </motion.div>

            {/* Asymmetric masonry-style layout */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* 2.1m Parasols - Large */}
              <motion.div
                variants={fadeInUp}
                className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-[#221c35] to-[#383349] rounded-3xl p-10 md:p-14 text-white relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
                <Umbrella className="w-12 h-12 text-[#908d9a] mb-6" />
                <h3 className="hearns-font text-4xl md:text-5xl mb-4">2.1m Parasols</h3>
                <p className="text-xl font-medium text-[#908d9a] mb-4">From £80 + VAT</p>
                <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-md">
                  Aluminium mast with crank-handle operation. Six ribs for stability. 15kg base recommended.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Black</span>
                  <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Natural</span>
                  <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Plum</span>
                  <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Green</span>
                </div>
              </motion.div>

              {/* 2.5m Round */}
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-3xl p-8 border border-[#c1c6c8]/30 hover:border-[#908d9a]/50 transition-colors"
              >
                <Sun className="w-10 h-10 text-[#908d9a] mb-4" />
                <h3 className="hearns-font text-2xl text-[#221c35] mb-2">2.5m Round</h3>
                <p className="text-lg font-semibold text-[#908d9a] mb-3">From £170 + VAT</p>
                <p className="text-[#383349]/70 leading-relaxed">
                  Push-up mechanism, 38mm anodised aluminium pole. 30kg base recommended.
                </p>
              </motion.div>

              {/* 2.5m Square */}
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-3xl p-8 border border-[#c1c6c8]/30 hover:border-[#908d9a]/50 transition-colors"
              >
                <Package className="w-10 h-10 text-[#908d9a] mb-4" />
                <h3 className="hearns-font text-2xl text-[#221c35] mb-2">2.5m Square</h3>
                <p className="text-lg font-semibold text-[#908d9a] mb-3">From £180 + VAT</p>
                <p className="text-[#383349]/70 leading-relaxed">
                  19mm ribs for durability. Colours: Black, Natural, Green, Blue, Burgundy.
                </p>
              </motion.div>

              {/* Custom - Wide */}
              <motion.div
                variants={fadeInUp}
                className="md:col-span-3 bg-gradient-to-r from-[#908d9a]/10 via-[#908d9a]/5 to-transparent rounded-3xl p-10 flex flex-col md:flex-row items-center gap-8"
              >
                <Umbrella className="w-16 h-16 text-[#383349] flex-shrink-0" />
                <div>
                  <h3 className="hearns-font text-3xl text-[#221c35] mb-2">Custom Sizes</h3>
                  <p className="text-[#383349]/70 text-lg leading-relaxed">
                    Need a different size or style? Our team can source alternative models to meet your specific requirements. Replacement canopies available for all sizes.
                  </p>
                </div>
                <a href="/contact" className="flex-shrink-0 px-6 py-3 rounded-full bg-[#383349] text-white font-medium hover:bg-[#221c35] transition-colors">
                  Discuss Options
                </a>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Customisation Pricing */}
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
                  Panel Pricing
                </div>
                <h2 className="hearns-font text-4xl md:text-6xl text-white mb-6">
                  Customisation<br />Pricing
                </h2>
                <p className="text-xl text-white/80 leading-relaxed mb-8">
                  Up to 500 × 300mm artwork per panel. Volume discounts for multiple panels.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-white/90">1 panel</span>
                    <span className="text-[#908d9a] font-semibold">£50 + VAT</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-white/90">2 panels</span>
                    <span className="text-[#908d9a] font-semibold">£60 + VAT (£30 each)</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-white/90">3 panels</span>
                    <span className="text-[#908d9a] font-semibold">£75 + VAT (£25 each)</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-white/90">4 panels</span>
                    <span className="text-[#908d9a] font-semibold">£80 + VAT (£20 each)</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-white/90">6 panels</span>
                    <span className="text-[#908d9a] font-semibold">£90 + VAT (£15 each)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 frosted-glass rounded-3xl p-8 md:p-10 border border-white/10">
                <h3 className="smilecake-font text-3xl text-white mb-6">Vinyl Options</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-white/80"><strong className="text-white">Printed Vinyl:</strong> Multicolour logos, gradients, detailed graphics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-white/80"><strong className="text-white">Cut Vinyl:</strong> Sharp lettering without background</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-white/80">Bulk discounts for multi-parasol orders</span>
                  </li>
                </ul>
              </div>
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
                Mix-and-Match<br />
                <span className="text-[#908d9a]">Strategy</span>
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#221c35] flex items-center justify-center flex-shrink-0">
                    <Repeat className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#221c35] text-lg mb-1">Multiple Canopies</h3>
                    <p className="text-[#383349]/70">Swap-out sets let you adjust branding per event or promotion.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#908d9a] flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#221c35] text-lg mb-1">Custom Sizes</h3>
                    <p className="text-[#383349]/70">We can source alternative sizes and styles for specific requirements.</p>
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
                Get Your Free Quote & Mockup
              </h2>
              <p className="text-white/80 text-lg leading-relaxed mb-8">
                Tell us about your event and we'll recommend the perfect parasol solution. Free mockups to visualise your branding before you commit.
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

export default Parasols;
