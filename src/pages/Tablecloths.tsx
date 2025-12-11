import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { CheckCircle2, Mail, Palette, Ruler, Sparkles, Table2 } from 'lucide-react';
import { usePageTheme } from '../contexts/ThemeContext';
import HowItWorksSection from '../components/HowItWorksSection';

const Tablecloths: React.FC = () => {
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
                  Branded Tablecloths
                </p>
                <h1 className="hearns-font text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-[0.95] mb-8">
                  Professional<br />
                  <span className="gradient-text">Presentation</span>
                </h1>
              </div>

              <div ref={subtitleRef} className="max-w-xl mb-12">
                <p className="text-xl md:text-2xl text-[#c1c6c8] font-light leading-relaxed">
                  Custom table covers for exhibitions, events, and trade shows.
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
                Event Ready
              </h2>
              <div className="w-24 h-1 bg-[#908d9a]" />
            </motion.div>

            {/* Staggered layout */}
            <div className="grid md:grid-cols-12 gap-8 md:gap-12">
              {/* Tables */}
              <motion.div variants={fadeInUp} className="md:col-span-5">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#383349] to-[#221c35] flex items-center justify-center flex-shrink-0">
                    <Table2 className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-3">Any Table</h3>
                    <p className="text-lg text-[#383349]/80 leading-relaxed">
                      Dress trestle tables, registration desks, or merch counters with branded covers that elevate your presentation.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Branding - offset */}
              <motion.div variants={fadeInUp} className="md:col-span-5 md:col-start-7 md:mt-24">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#908d9a] to-[#383349] flex items-center justify-center flex-shrink-0">
                    <Palette className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-3">Your Branding</h3>
                    <p className="text-lg text-[#383349]/80 leading-relaxed">
                      Highlight logos, slogans, or campaign artwork with full-colour dye sublimation printing.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Sizing - centered */}
              <motion.div variants={fadeInUp} className="md:col-span-6 md:col-start-4 md:mt-12">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#c1c6c8] to-[#908d9a] flex items-center justify-center flex-shrink-0">
                    <Ruler className="w-10 h-10 text-[#221c35]" />
                  </div>
                  <div>
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-3">Perfect Fit</h3>
                    <p className="text-lg text-[#383349]/80 leading-relaxed">
                      Standard 4ft, 6ft, and 8ft trestle table sizes, plus custom measurements for reception desks or counters.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <HowItWorksSection
          serviceType="tablecloths"
          sectionId="how-it-works"
          subtitle="Our custom tablecloths transform ordinary tables into branded display spaces. Choose from polyester throw, fitted, or stretch styles."
        />

        {/* Fabric & Style Options - Asymmetric grid */}
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
                Fabric & Style
              </h2>
              <p className="text-xl text-[#383349]/70 max-w-2xl mx-auto">
                Choose the right style for your application.
              </p>
            </motion.div>

            {/* Asymmetric masonry-style layout */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Polyester Throw - Large */}
              <motion.div
                variants={fadeInUp}
                className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-[#221c35] to-[#383349] rounded-3xl p-10 md:p-14 text-white relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
                <Table2 className="w-12 h-12 text-[#908d9a] mb-6" />
                <h3 className="hearns-font text-4xl md:text-5xl mb-4">Polyester Throw</h3>
                <p className="text-xl font-medium text-[#908d9a] mb-4">Most Versatile</p>
                <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-md">
                  Drapes over the table with box pleats or rounded corners. Cover 3 or 4 sides depending on access needs.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Wrinkle-resistant</span>
                  <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Dye-sublimation ready</span>
                  <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Fire-retardant option</span>
                </div>
              </motion.div>

              {/* Fitted Cover */}
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-3xl p-8 border border-[#c1c6c8]/30 hover:border-[#908d9a]/50 transition-colors"
              >
                <Sparkles className="w-10 h-10 text-[#908d9a] mb-4" />
                <h3 className="hearns-font text-2xl text-[#221c35] mb-2">Fitted Cover</h3>
                <p className="text-lg font-semibold text-[#908d9a] mb-3">Crisp Silhouette</p>
                <p className="text-[#383349]/70 leading-relaxed">
                  Sewn corners for a crisp silhouette. Ideal for retail or exhibition pods where audiences see multiple sides.
                </p>
              </motion.div>

              {/* Stretch Fabric */}
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-3xl p-8 border border-[#c1c6c8]/30 hover:border-[#908d9a]/50 transition-colors"
              >
                <Ruler className="w-10 h-10 text-[#908d9a] mb-4" />
                <h3 className="hearns-font text-2xl text-[#221c35] mb-2">Stretch Fabric</h3>
                <p className="text-lg font-semibold text-[#908d9a] mb-3">Outdoor Ready</p>
                <p className="text-[#383349]/70 leading-relaxed">
                  Elasticated edges hug cocktail tables or tall displays. Works well outdoors in breezy conditions.
                </p>
              </motion.div>

              {/* Sizing - Wide */}
              <motion.div
                variants={fadeInUp}
                className="md:col-span-3 bg-gradient-to-r from-[#908d9a]/10 via-[#908d9a]/5 to-transparent rounded-3xl p-10 flex flex-col md:flex-row items-center gap-8"
              >
                <Ruler className="w-16 h-16 text-[#383349] flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="hearns-font text-3xl text-[#221c35] mb-2">Standard & Custom Sizing</h3>
                  <p className="text-[#383349]/70 text-lg leading-relaxed">
                    4ft, 6ft, and 8ft trestle table sizes available. Custom measurements for reception desks or unique counter dimensions.
                  </p>
                </div>
                <a href="/contact" className="flex-shrink-0 px-6 py-3 rounded-full bg-[#383349] text-white font-medium hover:bg-[#221c35] transition-colors">
                  Get Quote
                </a>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Branding Methods */}
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
                  Branding Methods
                </div>
                <h2 className="hearns-font text-4xl md:text-6xl text-white mb-6">
                  Make It<br />Yours
                </h2>
                <p className="text-xl text-white/80 leading-relaxed mb-8">
                  Multiple printing methods to suit your design and budget.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a]" />
                    <span className="text-white/90"><strong className="text-white">Dye Sublimation:</strong> All-over coverage, gradients, photography</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a]" />
                    <span className="text-white/90"><strong className="text-white">Heat-Applied Vinyl:</strong> Spot logos on stock-colour cloths</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a]" />
                    <span className="text-white/90"><strong className="text-white">Mixed Approach:</strong> Base colour with vinyl overlays</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 frosted-glass rounded-3xl p-8 md:p-10 border border-white/10">
                <h3 className="smilecake-font text-3xl text-white mb-6">Care Tips</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-white/80">Machine wash on cool with mild detergent</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-white/80">Avoid bleach or fabric softener</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-white/80">Air-dry or tumble-dry low</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-white/80">Store folded in supplied bags</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-white/80">Steam or lightly iron before events</span>
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
                Event<br />
                <span className="text-[#908d9a]">Essentials</span>
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#221c35] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#221c35] text-lg mb-1">Choose Style</h3>
                    <p className="text-[#383349]/70">Throw, fitted, or stretch to suit your setup.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#908d9a] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#221c35] text-lg mb-1">Add Branding</h3>
                    <p className="text-[#383349]/70">Full dye-sublimation or spot vinyl logos.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#383349] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#221c35] text-lg mb-1">Event Ready</h3>
                    <p className="text-[#383349]/70">Reusable across multiple events and campaigns.</p>
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
                Tell us about your event and we'll recommend the perfect tablecloth solution. Standard sizes or custom measurements available.
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

export default Tablecloths;
