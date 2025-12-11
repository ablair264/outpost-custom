import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { CheckCircle2, Umbrella, Mail, Palette, Package, Sun, Repeat, XCircle, Coffee, Utensils, PartyPopper, Building2, ImageIcon } from 'lucide-react';
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

          {/* Hero Image */}
          <div className="absolute top-20 right-8 md:right-16 lg:right-24 w-[300px] md:w-[400px] lg:w-[500px] h-[400px] md:h-[500px] lg:h-[600px] hidden md:block">
            {/* IMAGE: Branded parasol at outdoor cafe/pub setting */}
            <div className="w-full h-full rounded-3xl bg-white/[0.03] frosted-glass border-2 border-dashed border-white/20 flex flex-col items-center justify-center">
              <ImageIcon className="w-16 h-16 text-white/30 mb-4" />
              <span className="text-white/40 text-sm text-center px-4">Hero Image: Branded parasol at outdoor venue</span>
            </div>
          </div>

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
                  We take the guesswork out of selecting a parasol – two vetted brands that reflect our quality and suit your budget.
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
                  Free Mockup
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
                    <Coffee className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-3">Pubs & Cafes</h3>
                    <p className="text-lg text-[#383349]/80 leading-relaxed">
                      Create branded outdoor seating areas that attract attention and provide comfortable shade for your customers.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="md:col-span-5 md:col-start-7 md:mt-24">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#908d9a] to-[#383349] flex items-center justify-center flex-shrink-0">
                    <Utensils className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-3">Food Festivals</h3>
                    <p className="text-lg text-[#383349]/80 leading-relaxed">
                      Stand out at food festivals and outdoor markets with high-visibility branded parasols that draw in customers.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="md:col-span-6 md:col-start-4 md:mt-12">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#c1c6c8] to-[#908d9a] flex items-center justify-center flex-shrink-0">
                    <PartyPopper className="w-10 h-10 text-[#221c35]" />
                  </div>
                  <div>
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-3">Corporate Events & Weddings</h3>
                    <p className="text-lg text-[#383349]/80 leading-relaxed">
                      Add elegance and branding to wedding venues, corporate events, and private functions with customised parasols.
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
          subtitle="Choose from our vetted parasol models, select your customisation options, and we'll create branded canopies that make your business stand out."
        />

        {/* Select Your Parasol Section */}
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
                Select Your Parasol
              </h2>
              <p className="text-xl text-[#383349]/70 max-w-3xl mx-auto">
                Choose one of our tried and tested parasols or supply your own for customisation. Got a specific colour or style in mind? Our team can help source the perfect parasols for your space.
              </p>
            </motion.div>

            {/* 2.1m Parasols */}
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-[#221c35] to-[#383349] rounded-3xl p-10 md:p-14 text-white relative overflow-hidden mb-8"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />

              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  {/* IMAGE: 2.1m round parasol product shot */}
                  <div className="h-48 mb-6 rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-white/30 mb-2" />
                    <span className="text-white/40 text-sm">2.1m parasol</span>
                  </div>
                  <Umbrella className="w-12 h-12 text-[#908d9a] mb-6" />
                  <h3 className="hearns-font text-4xl md:text-5xl mb-2">2.1m Parasols</h3>
                  <p className="text-3xl font-bold text-[#908d9a] mb-6">From £80 + VAT</p>
                  <p className="text-white/80 text-lg leading-relaxed mb-6">
                    Round parasol – perfect for smaller spaces and single tables.
                  </p>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Available Colours:</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-white/10 text-sm">Black</span>
                      <span className="px-3 py-1 rounded-full bg-white/10 text-sm">Natural</span>
                      <span className="px-3 py-1 rounded-full bg-white/10 text-sm">Plum</span>
                      <span className="px-3 py-1 rounded-full bg-white/10 text-sm">Green</span>
                    </div>
                    <p className="text-white/60 text-sm mt-2">Subject to availability</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-[#908d9a] mb-2">Canopy</h4>
                    <p className="text-white/80 text-sm">Replacement canopies are available</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#908d9a] mb-2">Frame Spec</h4>
                    <ul className="space-y-1 text-white/80 text-sm">
                      <li>• Crank handle operation</li>
                      <li>• Aluminium mast</li>
                      <li>• Six aluminium ribs</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#908d9a] mb-2">Base</h4>
                    <p className="text-white/80 text-sm">Bases available separately – 15kg recommended</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 2.5m Parasols */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-3xl p-10 md:p-14 border border-[#c1c6c8]/30 relative overflow-hidden mb-8"
            >
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  {/* IMAGE: 2.5m parasol product shot (round or square) */}
                  <div className="h-48 mb-6 rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-[#f8f8f8]">
                    <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                    <span className="text-[#383349]/40 text-sm">2.5m parasol</span>
                  </div>
                  <Sun className="w-12 h-12 text-[#908d9a] mb-6" />
                  <h3 className="hearns-font text-4xl md:text-5xl text-[#221c35] mb-2">2.5m Parasols</h3>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div>
                      <p className="text-2xl font-bold text-[#908d9a]">Round from £170 + VAT</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#908d9a]">Square from £180 + VAT</p>
                    </div>
                  </div>
                  <p className="text-[#383349]/80 text-lg leading-relaxed mb-6">
                    Larger parasol for bigger tables and more coverage area.
                  </p>

                  <div className="mb-6">
                    <h4 className="font-semibold text-[#221c35] mb-3">Available Colours:</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#221c35]/10 text-sm text-[#221c35]">Black</span>
                      <span className="px-3 py-1 rounded-full bg-[#221c35]/10 text-sm text-[#221c35]">Natural</span>
                      <span className="px-3 py-1 rounded-full bg-[#221c35]/10 text-sm text-[#221c35]">Green</span>
                      <span className="px-3 py-1 rounded-full bg-[#221c35]/10 text-sm text-[#221c35]">Blue</span>
                      <span className="px-3 py-1 rounded-full bg-[#221c35]/10 text-sm text-[#221c35]">Burgundy</span>
                    </div>
                    <p className="text-[#383349]/60 text-sm mt-2">Subject to availability</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-[#908d9a] mb-2">Canopy</h4>
                    <p className="text-[#383349]/80 text-sm">Replacement canopies are available</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#908d9a] mb-2">Frame Spec</h4>
                    <ul className="space-y-1 text-[#383349]/80 text-sm">
                      <li>• Push Up mechanism</li>
                      <li>• 38mm anodised aluminium single pole mast</li>
                      <li>• 19mm aluminium ribs</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#908d9a] mb-2">Base</h4>
                    <p className="text-[#383349]/80 text-sm">Bases available separately – 30kg recommended</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Replacement Canopies */}
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-r from-[#908d9a]/10 via-[#908d9a]/5 to-transparent rounded-3xl p-10 flex flex-col md:flex-row items-center gap-8"
            >
              <Repeat className="w-16 h-16 text-[#383349] flex-shrink-0" />
              <div>
                <h3 className="hearns-font text-3xl text-[#221c35] mb-2">Replacement Canopies</h3>
                <p className="text-[#383349]/70 text-lg leading-relaxed">
                  Want to mix it up sometimes? We also supply replacement canopies for our parasols, which are easy to switch out. So you could have different branding on multiple canopies, depending on your event or promotion.
                </p>
              </div>
              <a href="/contact" className="flex-shrink-0 px-6 py-3 rounded-full bg-[#383349] text-white font-medium hover:bg-[#221c35] transition-colors">
                Get Quote
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* Customisation Pricing */}
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
                Our parasol customisation can be applied to as many panels as you require. Discounts available for multiple parasols.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-[#f8f8f8] rounded-3xl p-10 md:p-14 max-w-2xl mx-auto"
            >
              <h3 className="hearns-font text-2xl text-[#221c35] mb-2 text-center">Up to 500 × 300mm Customisation</h3>
              <p className="text-[#383349]/60 text-center mb-8">Per panel pricing</p>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-[#c1c6c8]/30">
                  <span className="text-[#221c35]">1 Panel</span>
                  <span className="font-bold text-[#908d9a]">£50 + VAT</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-[#c1c6c8]/30">
                  <span className="text-[#221c35]">2 Panels</span>
                  <span className="font-bold text-[#908d9a]">£60 + VAT <span className="font-normal text-[#383349]/60">(£30 each)</span></span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-[#c1c6c8]/30">
                  <span className="text-[#221c35]">3 Panels</span>
                  <span className="font-bold text-[#908d9a]">£75 + VAT <span className="font-normal text-[#383349]/60">(£25 each)</span></span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-[#c1c6c8]/30">
                  <span className="text-[#221c35]">4 Panels</span>
                  <span className="font-bold text-[#908d9a]">£80 + VAT <span className="font-normal text-[#383349]/60">(£20 each)</span></span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-[#221c35]">6 Panels</span>
                  <span className="font-bold text-[#908d9a]">£90 + VAT <span className="font-normal text-[#383349]/60">(£15 each)</span></span>
                </div>
              </div>

              <p className="text-center text-[#383349]/60 mt-8 text-sm">
                Discounts available for multiple parasols
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

                {/* IMAGE: DTF customisation example on parasol */}
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

                {/* IMAGE: HTV customisation example on parasol */}
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
              <h2 className="smilecake-font text-5xl md:text-6xl text-[#221c35] mb-4">Parasols In Action</h2>
              <p className="text-xl text-[#383349]/70 max-w-2xl mx-auto">
                See how our branded parasols create inviting outdoor spaces.
              </p>
            </motion.div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <motion.div variants={fadeInUp} className="aspect-square rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-[#f8f8f8]">
                {/* IMAGE: Pub garden parasols */}
                <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                <span className="text-[#383349]/40 text-xs text-center px-2">Pub garden</span>
              </motion.div>
              <motion.div variants={fadeInUp} className="aspect-square rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-[#f8f8f8]">
                {/* IMAGE: Cafe terrace */}
                <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                <span className="text-[#383349]/40 text-xs text-center px-2">Cafe terrace</span>
              </motion.div>
              <motion.div variants={fadeInUp} className="aspect-square rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-[#f8f8f8]">
                {/* IMAGE: Food festival */}
                <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                <span className="text-[#383349]/40 text-xs text-center px-2">Food festival</span>
              </motion.div>
              <motion.div variants={fadeInUp} className="aspect-square rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-[#f8f8f8]">
                {/* IMAGE: Corporate event */}
                <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                <span className="text-[#383349]/40 text-xs text-center px-2">Corporate event</span>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
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
                Mix & Match<br />
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
                    <h3 className="font-semibold text-[#221c35] text-lg mb-1">Custom Sourcing</h3>
                    <p className="text-[#383349]/70">Got a specific colour or style in mind? We can source alternative parasols for your space.</p>
                  </div>
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
