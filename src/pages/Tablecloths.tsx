import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { CheckCircle2, Mail, Palette, Ruler, Sparkles, Table2, XCircle, RectangleHorizontal, Presentation, Building2, ImageIcon } from 'lucide-react';
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

          {/* Hero Image */}
          <div className="absolute top-20 right-8 md:right-16 lg:right-24 w-[300px] md:w-[400px] lg:w-[500px] h-[400px] md:h-[500px] lg:h-[600px] hidden md:block">
            {/* IMAGE: Branded tablecloth on exhibition stand table */}
            <div className="w-full h-full rounded-3xl bg-white/[0.03] frosted-glass border-2 border-dashed border-white/20 flex flex-col items-center justify-center">
              <ImageIcon className="w-16 h-16 text-white/30 mb-4" />
              <span className="text-white/40 text-sm text-center px-4">Hero Image: Branded table at event</span>
            </div>
          </div>

          {/* Main content */}
          <div className="relative z-10 h-full flex items-center px-6 md:px-12 lg:px-24 pt-32 pb-20">
            <div className="max-w-5xl">
              <div ref={headingRef}>
                <p className="neuzeit-font text-[#908d9a] uppercase tracking-[0.3em] text-sm mb-6">
                  Branded Tablecloths & Runners
                </p>
                <h1 className="hearns-font text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-[0.95] mb-8">
                  Professional<br />
                  <span className="gradient-text">Presentation</span>
                </h1>
              </div>

              <div ref={subtitleRef} className="max-w-xl mb-12">
                <p className="text-xl md:text-2xl text-[#c1c6c8] font-light leading-relaxed">
                  Dress any table in event-ready style – branded tablecloths give your stand that professional finish.
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
                  Get a Quote
                </a>
              </div>
            </div>
          </div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        </section>

        {/* Perfect For Section */}
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-white relative overflow-hidden">
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

            <div className="grid md:grid-cols-12 gap-8 md:gap-12">
              <motion.div variants={fadeInUp} className="md:col-span-5">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#383349] to-[#221c35] flex items-center justify-center flex-shrink-0">
                    <Presentation className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-3">Exhibitions & Trade Shows</h3>
                    <p className="text-lg text-[#383349]/80 leading-relaxed">
                      Transform ordinary trestle tables into professional branded displays that attract visitors to your stand.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="md:col-span-5 md:col-start-7 md:mt-24">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#908d9a] to-[#383349] flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-3">Corporate Events</h3>
                    <p className="text-lg text-[#383349]/80 leading-relaxed">
                      Registration desks, product launches, and conferences. Add instant professionalism to any event space.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="md:col-span-6 md:col-start-4 md:mt-12">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#c1c6c8] to-[#908d9a] flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-10 h-10 text-[#221c35]" />
                  </div>
                  <div>
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-3">Markets & Pop-Ups</h3>
                    <p className="text-lg text-[#383349]/80 leading-relaxed">
                      Craft markets, pop-up shops, and outdoor events. Stand out from neighbouring stalls with branded table covers.
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
          subtitle="Choose from conference cloths, box fitted covers, or table runners. Add your branding and we'll deliver event-ready table covers."
        />

        {/* Select Your Tablecloth Section */}
        <section id="options" className="py-24 px-6 md:px-12 lg:px-24 bg-[#f8f8f8] relative overflow-hidden">
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
                Select Your Tablecloth
              </h2>
              <p className="text-xl text-[#383349]/70 max-w-3xl mx-auto">
                Choose from three styles to suit your setup and budget. All options available for 4ft, 6ft, and 8ft trestle tables.
              </p>
            </motion.div>

            {/* Conference Cloth */}
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-[#221c35] to-[#383349] rounded-3xl p-10 md:p-14 text-white relative overflow-hidden mb-8"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />

              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  {/* IMAGE: Conference cloth draped over table */}
                  <div className="h-48 mb-6 rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-white/30 mb-2" />
                    <span className="text-white/40 text-sm">Conference cloth</span>
                  </div>
                  <Table2 className="w-12 h-12 text-[#908d9a] mb-6" />
                  <h3 className="hearns-font text-4xl md:text-5xl mb-2">Conference Cloth (Throw)</h3>
                  <p className="text-3xl font-bold text-[#908d9a] mb-6">From £17 + VAT</p>
                  <p className="text-white/80 text-lg leading-relaxed mb-6">
                    The conference cloth is a flat piece of fabric designed to drape over your table. Our simplest option for covering a table – offers less of a tailored look, but will still give your table a professional finish.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-[#908d9a] mb-2">Available Sizes</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-white/10 text-sm">4ft trestle table</span>
                      <span className="px-3 py-1 rounded-full bg-white/10 text-sm">6ft trestle table</span>
                      <span className="px-3 py-1 rounded-full bg-white/10 text-sm">8ft trestle table</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#908d9a] mb-2">Features</h4>
                    <ul className="space-y-1 text-white/80 text-sm">
                      <li>• Drapes over the table for quick setup</li>
                      <li>• Can cover 3 or 4 sides depending on access needs</li>
                      <li>• Box pleats or rounded corners available</li>
                      <li>• Wrinkle-resistant fabric</li>
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4">
                    <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Most affordable</span>
                    <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Quick setup</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Box Fitted Tablecloth */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-3xl p-10 md:p-14 border border-[#c1c6c8]/30 relative overflow-hidden mb-8"
            >
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  {/* IMAGE: Box fitted tablecloth on exhibition table */}
                  <div className="h-48 mb-6 rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-[#f8f8f8]">
                    <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                    <span className="text-[#383349]/40 text-sm">Box fitted tablecloth</span>
                  </div>
                  <Sparkles className="w-12 h-12 text-[#908d9a] mb-6" />
                  <h3 className="hearns-font text-4xl md:text-5xl text-[#221c35] mb-2">Box Fitted Tablecloth</h3>
                  <p className="text-3xl font-bold text-[#908d9a] mb-6">From £29.50 + VAT</p>
                  <p className="text-[#383349]/80 text-lg leading-relaxed mb-6">
                    A fitted table cover that sits snugly over your table. For a more tailored look when multiple sides of the table will be visible – ideal for retail or exhibition pods where audiences see all angles.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-[#908d9a] mb-2">Available Sizes</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#221c35]/10 text-sm text-[#221c35]">4ft trestle table</span>
                      <span className="px-3 py-1 rounded-full bg-[#221c35]/10 text-sm text-[#221c35]">6ft trestle table</span>
                      <span className="px-3 py-1 rounded-full bg-[#221c35]/10 text-sm text-[#221c35]">8ft trestle table</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#908d9a] mb-2">Features</h4>
                    <ul className="space-y-1 text-[#383349]/80 text-sm">
                      <li>• Sewn corners for a crisp silhouette</li>
                      <li>• Sits snugly over your table</li>
                      <li>• Professional tailored appearance</li>
                      <li>• Perfect when all sides are visible</li>
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4">
                    <span className="px-4 py-2 rounded-full bg-[#221c35] text-white text-sm">Tailored look</span>
                    <span className="px-4 py-2 rounded-full bg-[#221c35]/10 text-[#221c35] text-sm">Most professional</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Table Runner */}
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-r from-[#908d9a]/10 via-[#908d9a]/5 to-transparent rounded-3xl p-10 mb-8"
            >
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="flex items-start gap-6">
                  <RectangleHorizontal className="w-12 h-12 text-[#383349] flex-shrink-0" />
                  <div>
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-2">Table Runner</h3>
                    <p className="text-2xl font-bold text-[#908d9a] mb-4">From £27 + VAT</p>

                    {/* IMAGE: Branded table runner */}
                    <div className="h-32 mb-4 rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-white">
                      <ImageIcon className="w-8 h-8 text-[#908d9a]/40 mb-1" />
                      <span className="text-[#383349]/40 text-xs">Table runner</span>
                    </div>

                    <p className="text-[#383349]/70 text-lg leading-relaxed">
                      Our most affordable way to add instant impact to an everyday table. Standard 30cm drop (alternative options available). Perfect for adding branding to tables you already have.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#221c35]/10 text-sm text-[#221c35]">4ft trestle table</span>
                    <span className="px-3 py-1 rounded-full bg-[#221c35]/10 text-sm text-[#221c35]">6ft trestle table</span>
                    <span className="px-3 py-1 rounded-full bg-[#221c35]/10 text-sm text-[#221c35]">8ft trestle table</span>
                  </div>
                  <p className="text-sm text-[#383349]/60">Standard 30cm drop • Custom drops available</p>
                </div>
              </div>
            </motion.div>

            {/* Custom Sizing */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-3xl p-10 border border-[#c1c6c8]/30 flex flex-col md:flex-row items-center gap-8"
            >
              <Ruler className="w-16 h-16 text-[#383349] flex-shrink-0" />
              <div>
                <h3 className="hearns-font text-3xl text-[#221c35] mb-2">Custom Sizing Available</h3>
                <p className="text-[#383349]/70 text-lg leading-relaxed">
                  Need something for a reception desk, counter, or non-standard table? We can create custom measurements to fit your exact requirements.
                </p>
              </div>
              <a href="/contact" className="flex-shrink-0 px-6 py-3 rounded-full bg-[#383349] text-white font-medium hover:bg-[#221c35] transition-colors">
                Get Quote
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* Customisation Pricing Section */}
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-white relative overflow-hidden">
          <motion.div
            className="max-w-7xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="text-center mb-20">
              <h2 className="hearns-font text-5xl md:text-7xl text-[#221c35] mb-4">
                Choose Your Customisation
              </h2>
              <p className="text-xl text-[#383349]/70 max-w-3xl mx-auto">
                Add your branding to any tablecloth or runner. Pricing is per customisation area.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-[#f8f8f8] rounded-3xl p-10 md:p-14 max-w-2xl mx-auto"
            >
              <h3 className="hearns-font text-2xl text-[#221c35] mb-8 text-center">Customisation Pricing</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-[#c1c6c8]/30">
                  <span className="text-[#221c35]">Up to 500 × 500mm</span>
                  <span className="font-bold text-[#908d9a]">£50 + VAT</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-[#221c35]">Up to 1000 × 500mm</span>
                  <span className="font-bold text-[#908d9a]">£75 + VAT</span>
                </div>
              </div>

              <p className="text-center text-[#383349]/60 mt-8 text-sm">
                Larger customisation areas available – contact us for a quote
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* Types of Customisation - DTF vs HTV */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[#221c35]" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#383349] transform skew-x-12 origin-top-right hidden md:block" />

          <motion.div
            className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 lg:px-24"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#908d9a]/20 text-[#908d9a] text-sm font-medium mb-6">
                <Palette className="w-4 h-4" />
                High Performance Materials
              </div>
              <h2 className="hearns-font text-4xl md:text-6xl text-white mb-6">
                Types of Customisation
              </h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Both of our customisation methods are cost-effective ways to transfer high quality designs onto fabric. When looked after, the customisation will last a long time.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* DTF */}
              <div className="bg-white/5 frosted-glass rounded-3xl p-8 md:p-10 border border-white/10">
                <h3 className="hearns-font text-3xl text-white mb-4">Direct to Film (DTF)</h3>

                {/* IMAGE: DTF customisation example on tablecloth */}
                <div className="h-36 mb-6 rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-white/30 mb-2" />
                  <span className="text-white/40 text-sm">DTF example</span>
                </div>

                <p className="text-white/70 mb-6">DTF is great for multiple colours & small details. Gives a similar finish to screen printing but without the set up fees!</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a]" />
                    <span className="text-white/80">Very small text and fine lines</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a]" />
                    <span className="text-white/80">Gradients</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a]" />
                    <span className="text-white/80">Photos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a]" />
                    <span className="text-white/80">Grunge / stamp effects</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a]" />
                    <span className="text-white/80">Fluorescent / neon colours</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a]" />
                    <span className="text-white/80">Metallic finishes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a]" />
                    <span className="text-white/80">Glitter + holographic</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-sm text-white/80">No set-up fee</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-sm text-white/80">No minimum order</span>
                </div>
              </div>

              {/* HTV */}
              <div className="bg-white/5 frosted-glass rounded-3xl p-8 md:p-10 border border-white/10">
                <h3 className="hearns-font text-3xl text-white mb-4">Heat Transfer Vinyl (HTV)</h3>

                {/* IMAGE: HTV customisation example on tablecloth */}
                <div className="h-36 mb-6 rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-white/30 mb-2" />
                  <span className="text-white/40 text-sm">HTV example</span>
                </div>

                <p className="text-white/70 mb-6">HTV is best suited to simple designs, logos and lettering. Artwork is cut, rather than printed, so the edges are super sharp and crisp.</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a]" />
                    <span className="text-white/80">Fluorescent / neon colours</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a]" />
                    <span className="text-white/80">Metallic finishes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a]" />
                    <span className="text-white/80">Glitter + holographic</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-white/40" />
                    <span className="text-white/50">Very small text and fine lines</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-white/40" />
                    <span className="text-white/50">Gradients</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-white/40" />
                    <span className="text-white/50">Photos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-white/40" />
                    <span className="text-white/50">Grunge / stamp effects</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-sm text-white/80">No set-up fee</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-sm text-white/80">No minimum order</span>
                </div>
              </div>
            </div>

            <p className="text-center text-white/60 mt-8">
              Chat to our team who can advise on the best type of customisation for your business.
            </p>
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
              <h2 className="smilecake-font text-5xl md:text-6xl text-[#221c35] mb-4">Event Ready</h2>
              <p className="text-xl text-[#383349]/70 max-w-2xl mx-auto">
                See how branded tablecloths elevate event presentations.
              </p>
            </motion.div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <motion.div variants={fadeInUp} className="aspect-[4/3] rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-[#f8f8f8]">
                {/* IMAGE: Exhibition stand table */}
                <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                <span className="text-[#383349]/40 text-xs text-center px-2">Exhibition stand</span>
              </motion.div>
              <motion.div variants={fadeInUp} className="aspect-[4/3] rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-[#f8f8f8]">
                {/* IMAGE: Trade show booth */}
                <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                <span className="text-[#383349]/40 text-xs text-center px-2">Trade show</span>
              </motion.div>
              <motion.div variants={fadeInUp} className="aspect-[4/3] rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-[#f8f8f8]">
                {/* IMAGE: Market stall table */}
                <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                <span className="text-[#383349]/40 text-xs text-center px-2">Market stall</span>
              </motion.div>
              <motion.div variants={fadeInUp} className="aspect-[4/3] rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-[#f8f8f8]">
                {/* IMAGE: Registration desk */}
                <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                <span className="text-[#383349]/40 text-xs text-center px-2">Registration desk</span>
              </motion.div>
              <motion.div variants={fadeInUp} className="aspect-[4/3] rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-[#f8f8f8]">
                {/* IMAGE: Corporate event */}
                <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                <span className="text-[#383349]/40 text-xs text-center px-2">Corporate event</span>
              </motion.div>
              <motion.div variants={fadeInUp} className="aspect-[4/3] rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-[#f8f8f8]">
                {/* IMAGE: Pop-up shop */}
                <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                <span className="text-[#383349]/40 text-xs text-center px-2">Pop-up shop</span>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Care Tips & CTA Section */}
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
                Care &<br />
                <span className="text-[#908d9a]">Maintenance</span>
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                  <span className="text-[#383349]/80">Machine wash on cool with mild detergent</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                  <span className="text-[#383349]/80">Avoid bleach or fabric softener</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                  <span className="text-[#383349]/80">Air-dry or tumble-dry low</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                  <span className="text-[#383349]/80">Store folded in supplied bags</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                  <span className="text-[#383349]/80">Steam or lightly iron before events</span>
                </div>
              </div>
            </motion.div>

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
