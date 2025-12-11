import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { CheckCircle2, Tent, Palette, Package, Sparkles, Ruler, Mail, Wind, Shield, XCircle, Layers, Settings, ImageIcon } from 'lucide-react';
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

          {/* Hero Image */}
          <div className="absolute top-20 right-8 md:right-16 lg:right-24 w-[300px] md:w-[400px] lg:w-[500px] h-[400px] md:h-[500px] lg:h-[600px] hidden md:block">
            {/* IMAGE: Branded gazebo at outdoor event/market with customised canopy */}
            <div className="w-full h-full rounded-3xl bg-white/[0.03] frosted-glass border-2 border-dashed border-white/20 flex flex-col items-center justify-center">
              <ImageIcon className="w-16 h-16 text-white/30 mb-4" />
              <span className="text-white/40 text-sm text-center px-4">Hero Image: Branded gazebo at event</span>
            </div>
          </div>

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
                  We take the guesswork out of selecting a gazebo – two tried and tested brands that reflect our quality and suit your budget.
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
                    <Package className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-3">Markets & Exhibitions</h3>
                    <p className="text-lg text-[#383349]/80 leading-relaxed">
                      An excellent choice for light commercial, exhibitions and outdoor markets. Stand out from the crowd with eye-catching branded canopies.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="md:col-span-5 md:col-start-7 md:mt-24">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#908d9a] to-[#383349] flex items-center justify-center flex-shrink-0">
                    <Tent className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-3">Building Sites</h3>
                    <p className="text-lg text-[#383349]/80 leading-relaxed">
                      Ideal for commercial customers who require a stronger frame for outdoor events where the gazebo will be regularly exposed to the elements.
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
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-3">Pop-Up & Hospitality</h3>
                    <p className="text-lg text-[#383349]/80 leading-relaxed">
                      Create branded pop-up retail spaces, food stalls, corporate events, festivals, and promotional activations anywhere outdoors.
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
          subtitle="Choose from our vetted gazebo models, select your customisation options, and we'll create branded canopies that make your business stand out."
        />

        {/* Select Your Gazebo Section */}
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
                Select Your Gazebo
              </h2>
              <p className="text-xl text-[#383349]/70 max-w-3xl mx-auto">
                Choose one of our tried and tested gazebos or supply your own for customisation. Already got a frame but the canopy needs a refresh? We also supply replacement canopies and walls for existing frames.
              </p>
            </motion.div>

            {/* Mid-Range Gazebo */}
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-[#221c35] to-[#383349] rounded-3xl p-10 md:p-14 text-white relative overflow-hidden mb-8"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />

              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  {/* IMAGE: Mid-range gazebo product shot */}
                  <div className="h-48 mb-6 rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-white/30 mb-2" />
                    <span className="text-white/40 text-sm">Mid-range gazebo</span>
                  </div>
                  <Tent className="w-12 h-12 text-[#908d9a] mb-6" />
                  <h3 className="hearns-font text-4xl md:text-5xl mb-2">Mid-Range</h3>
                  <p className="text-[#908d9a] text-lg mb-6">An excellent choice for light commercial, exhibitions and outdoor markets</p>

                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span>3m × 3m Frame with canopy</span>
                      <span className="font-bold text-[#908d9a]">£175 + VAT</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span>3m × 4.5m Frame with canopy</span>
                      <span className="font-bold text-[#908d9a]">£200 + VAT</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span>3m × 6m Frame with canopy</span>
                      <span className="font-bold text-[#908d9a]">£265 + VAT</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Add Walls:</h4>
                    <p className="text-white/70 text-sm mb-2">1 × solid plain panel, 2 × with windows, 1 with twin zipped doorway</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-white/10 text-sm">3×3m: £45 +VAT</span>
                      <span className="px-3 py-1 rounded-full bg-white/10 text-sm">3×4.5m: £50 +VAT</span>
                      <span className="px-3 py-1 rounded-full bg-white/10 text-sm">3×6m: £65 +VAT</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-[#908d9a] mb-2">Canopy Spec</h4>
                    <ul className="space-y-1 text-white/80 text-sm">
                      <li>• 100% Waterproof 420D Polyester PVC Backed Fabric</li>
                      <li>• 10 Colours: Black, Pink, Tan, Blue, Red, Grey, Brown, White & Purple</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#908d9a] mb-2">Frame Spec</h4>
                    <ul className="space-y-1 text-white/80 text-sm">
                      <li>• Powder Coated Steel Frame</li>
                      <li>• 32mm × 32mm Box Section Legs</li>
                      <li>• 1.2mm gauge framework with high quality nylon plastic joints</li>
                      <li>• 3 Height Settings from 1400mm – 2100mm</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#908d9a] mb-2">Includes</h4>
                    <ul className="space-y-1 text-white/80 text-sm">
                      <li>• FREE Heavy-Duty Wheeled Carry Case with storage compartments</li>
                      <li>• Guy ropes & Stakes</li>
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4">
                    <span className="px-4 py-2 rounded-full bg-white/10 text-sm">1-year warranty</span>
                    <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Spare parts available</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Heavy-Duty Gazebo */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-3xl p-10 md:p-14 border border-[#c1c6c8]/30 relative overflow-hidden mb-8"
            >
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  {/* IMAGE: Heavy-duty gazebo product shot */}
                  <div className="h-48 mb-6 rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-[#f8f8f8]">
                    <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                    <span className="text-[#383349]/40 text-sm">Heavy-duty gazebo</span>
                  </div>
                  <Shield className="w-12 h-12 text-[#908d9a] mb-6" />
                  <h3 className="hearns-font text-4xl md:text-5xl text-[#221c35] mb-2">Heavy-Duty</h3>
                  <p className="text-[#383349]/70 text-lg mb-6">Ideal for commercial customers who require a stronger frame for regular outdoor events</p>

                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between items-center py-2 border-b border-[#c1c6c8]/30">
                      <span className="text-[#221c35]">3m × 3m Frame with canopy</span>
                      <span className="font-bold text-[#908d9a]">£295 + VAT</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#c1c6c8]/30">
                      <span className="text-[#221c35]">3m × 4.5m Frame with canopy</span>
                      <span className="font-bold text-[#908d9a]">£365 + VAT</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#c1c6c8]/30">
                      <span className="text-[#221c35]">3m × 6m Frame with canopy</span>
                      <span className="font-bold text-[#908d9a]">£455 + VAT</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-[#221c35] mb-3">Add Walls:</h4>
                    <p className="text-[#383349]/70 text-sm mb-2">1 × solid plain panel, 2 × with windows, 1 with twin zipped doorway</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#221c35]/10 text-sm text-[#221c35]">3×3m: £120 +VAT</span>
                      <span className="px-3 py-1 rounded-full bg-[#221c35]/10 text-sm text-[#221c35]">3×4.5m: £140 +VAT</span>
                      <span className="px-3 py-1 rounded-full bg-[#221c35]/10 text-sm text-[#221c35]">3×6m: £180 +VAT</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-[#908d9a] mb-2">Canopy Spec</h4>
                    <ul className="space-y-1 text-[#383349]/80 text-sm">
                      <li>• 100% Waterproof 600D Polyester PVC Backed Fabric</li>
                      <li>• 14 Colours: White, Black, Navy Blue, Green, Red, Black/White, Red/White, Green/White, Blue/White, Purple, Pink, Grey, Orange and Yellow</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#908d9a] mb-2">Frame Spec</h4>
                    <ul className="space-y-1 text-[#383349]/80 text-sm">
                      <li>• 6061/T6 Aluminium Frame</li>
                      <li>• 40mm × 40mm Hexagonal Legs – Stronger than square leg frames</li>
                      <li>• Carbon Fibre reinforced plastic joints – Lightweight without compromising strength</li>
                      <li>• 5 Height Settings from 1400mm – 2100mm</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#908d9a] mb-2">Includes</h4>
                    <ul className="space-y-1 text-[#383349]/80 text-sm">
                      <li>• FREE Heavy-Duty Wheeled Carry Case with storage compartments</li>
                      <li>• Guy ropes & Stakes</li>
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4">
                    <span className="px-4 py-2 rounded-full bg-[#221c35] text-white text-sm">2-year warranty</span>
                    <span className="px-4 py-2 rounded-full bg-[#221c35]/10 text-[#221c35] text-sm">Spare parts available</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Replacement Canopies */}
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-r from-[#908d9a]/10 via-[#908d9a]/5 to-transparent rounded-3xl p-10 flex flex-col md:flex-row items-center gap-8"
            >
              <Ruler className="w-16 h-16 text-[#383349] flex-shrink-0" />
              <div>
                <h3 className="hearns-font text-3xl text-[#221c35] mb-2">Replacement Canopies & Walls</h3>
                <p className="text-[#383349]/70 text-lg leading-relaxed">
                  Already got a frame but the canopy needs a refresh? We also supply replacement canopies and walls for existing frames. Perfect for seasonal updates or when your branding changes.
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
                All over printed gazebos look good… but they can be expensive when you're just starting out. Our gazebo customisation comes in a selection of sizes which you can mix & match to create an eye-catching branded gazebo.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Roof Panels */}
              <motion.div variants={fadeInUp} className="bg-[#f8f8f8] rounded-3xl p-8">
                <Layers className="w-10 h-10 text-[#908d9a] mb-4" />
                <h3 className="hearns-font text-2xl text-[#221c35] mb-6">Roof Panels</h3>

                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-[#383349]/60 mb-3">500 × 500mm</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>1 Panel</span><span className="font-semibold">£50 +VAT</span></div>
                      <div className="flex justify-between"><span>2 Panels</span><span className="font-semibold">£80 +VAT <span className="text-[#908d9a]">(£40 each)</span></span></div>
                      <div className="flex justify-between"><span>4 Panels</span><span className="font-semibold">£120 +VAT <span className="text-[#908d9a]">(£30 each)</span></span></div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-[#383349]/60 mb-3">1000 × 500mm</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>1 Panel</span><span className="font-semibold">£75 +VAT</span></div>
                      <div className="flex justify-between"><span>2 Panels</span><span className="font-semibold">£120 +VAT <span className="text-[#908d9a]">(£60 each)</span></span></div>
                      <div className="flex justify-between"><span>4 Panels</span><span className="font-semibold">£180 +VAT <span className="text-[#908d9a]">(£45 each)</span></span></div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Valance Panels */}
              <motion.div variants={fadeInUp} className="bg-[#f8f8f8] rounded-3xl p-8">
                <Settings className="w-10 h-10 text-[#908d9a] mb-4" />
                <h3 className="hearns-font text-2xl text-[#221c35] mb-6">Valance Panels</h3>

                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-[#383349]/60 mb-3">1.5m wide</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>1 Side</span><span className="font-semibold">£50 +VAT</span></div>
                      <div className="flex justify-between"><span>2 Sides</span><span className="font-semibold">£80 +VAT <span className="text-[#908d9a]">(£40 each)</span></span></div>
                      <div className="flex justify-between"><span>4 Sides</span><span className="font-semibold">£120 +VAT <span className="text-[#908d9a]">(£30 each)</span></span></div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-[#383349]/60 mb-3">3m wide</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>1 Side</span><span className="font-semibold">£75 +VAT</span></div>
                      <div className="flex justify-between"><span>2 Sides</span><span className="font-semibold">£120 +VAT <span className="text-[#908d9a]">(£60 each)</span></span></div>
                      <div className="flex justify-between"><span>4 Sides</span><span className="font-semibold">£180 +VAT <span className="text-[#908d9a]">(£45 each)</span></span></div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Wall Panels */}
              <motion.div variants={fadeInUp} className="bg-[#f8f8f8] rounded-3xl p-8">
                <Wind className="w-10 h-10 text-[#908d9a] mb-4" />
                <h3 className="hearns-font text-2xl text-[#221c35] mb-6">Wall Panels</h3>

                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-[#383349]/60 mb-3">Per Panel</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>500 × 500mm</span><span className="font-semibold">£50 +VAT</span></div>
                      <div className="flex justify-between"><span>1000 × 500mm</span><span className="font-semibold">£75 +VAT</span></div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-[#221c35]/5 rounded-xl">
                  <p className="text-sm text-[#383349]/80">
                    <strong>Pro tip:</strong> Mix & match roof, valance, and wall customisation to create maximum impact within your budget.
                  </p>
                </div>
              </motion.div>
            </div>
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
              <h2 className="smilecake-font text-5xl md:text-6xl text-[#221c35] mb-4">Gazebos In Action</h2>
              <p className="text-xl text-[#383349]/70 max-w-2xl mx-auto">
                See how our branded gazebos help businesses stand out at events.
              </p>
            </motion.div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <motion.div variants={fadeInUp} className="aspect-[4/3] rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-[#f8f8f8]">
                {/* IMAGE: Market stall gazebo with branding */}
                <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                <span className="text-[#383349]/40 text-xs text-center px-2">Market stall</span>
              </motion.div>
              <motion.div variants={fadeInUp} className="aspect-[4/3] rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-[#f8f8f8]">
                {/* IMAGE: Festival/event gazebo */}
                <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                <span className="text-[#383349]/40 text-xs text-center px-2">Festival booth</span>
              </motion.div>
              <motion.div variants={fadeInUp} className="aspect-[4/3] rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-[#f8f8f8]">
                {/* IMAGE: Corporate event gazebo */}
                <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                <span className="text-[#383349]/40 text-xs text-center px-2">Corporate event</span>
              </motion.div>
              <motion.div variants={fadeInUp} className="aspect-[4/3] rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-[#f8f8f8]">
                {/* IMAGE: Food stall gazebo */}
                <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                <span className="text-[#383349]/40 text-xs text-center px-2">Food stall</span>
              </motion.div>
              <motion.div variants={fadeInUp} className="aspect-[4/3] rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-[#f8f8f8]">
                {/* IMAGE: Pop-up retail gazebo */}
                <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                <span className="text-[#383349]/40 text-xs text-center px-2">Pop-up retail</span>
              </motion.div>
              <motion.div variants={fadeInUp} className="aspect-[4/3] rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-[#f8f8f8]">
                {/* IMAGE: Building site gazebo */}
                <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                <span className="text-[#383349]/40 text-xs text-center px-2">Building site</span>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Features & CTA */}
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
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#221c35] text-lg mb-1">Spare Parts Available</h3>
                    <p className="text-[#383349]/70">Foot plates, frame brackets, full legs and more – save you buying a whole new gazebo.</p>
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
                Ready to Stand Out?
              </h2>
              <p className="text-white/80 text-lg leading-relaxed mb-8">
                Get help selecting the right spec, planning artwork coverage, or arranging rush jobs for upcoming events.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#908d9a]" />
                  <span className="text-white/80">Free design mockups</span>
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
