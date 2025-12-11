import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { CheckCircle2, Hammer, Shield, Mail, Palette, Package, Layers, Sparkles, XCircle, Building, Store, MapPin, ImageIcon } from 'lucide-react';
import { usePageTheme } from '../contexts/ThemeContext';
import HowItWorksSection from '../components/HowItWorksSection';

const Signboards: React.FC = () => {
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
            {/* IMAGE: Premium signboard on shopfront or office building */}
            <div className="w-full h-full rounded-3xl bg-white/[0.03] frosted-glass border-2 border-dashed border-white/20 flex flex-col items-center justify-center">
              <ImageIcon className="w-16 h-16 text-white/30 mb-4" />
              <span className="text-white/40 text-sm text-center px-4">Hero Image: Signboard on building</span>
            </div>
          </div>

          {/* Main content */}
          <div className="relative z-10 h-full flex items-center px-6 md:px-12 lg:px-24 pt-32 pb-20">
            <div className="max-w-5xl">
              <div ref={headingRef}>
                <p className="neuzeit-font text-[#908d9a] uppercase tracking-[0.3em] text-sm mb-6">
                  Custom Signboards
                </p>
                <h1 className="hearns-font text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-[0.95] mb-8">
                  Your Brand,<br />
                  <span className="gradient-text">Your Way</span>
                </h1>
              </div>

              <div ref={subtitleRef} className="max-w-xl mb-12">
                <p className="text-xl md:text-2xl text-[#c1c6c8] font-light leading-relaxed">
                  Premium flat-panel signage for interior and exterior use. Multiple materials to suit any application.
                </p>
              </div>

              <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#options"
                  className="group inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-[#221c35] font-semibold text-base hover:bg-[#c1c6c8] transition-all duration-300"
                >
                  View Materials
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
                    <Store className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-3">Shopfronts & Offices</h3>
                    <p className="text-lg text-[#383349]/80 leading-relaxed">
                      Exterior fascia signs, entrance displays, and office branding. Make a lasting first impression with durable, professional signage.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="md:col-span-5 md:col-start-7 md:mt-24">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#908d9a] to-[#383349] flex items-center justify-center flex-shrink-0">
                    <Building className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-3">Interior Wayfinding</h3>
                    <p className="text-lg text-[#383349]/80 leading-relaxed">
                      Reception signs, directional signage, and room identification. Premium acrylic and aluminium options for professional interiors.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="md:col-span-6 md:col-start-4 md:mt-12">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#c1c6c8] to-[#908d9a] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-10 h-10 text-[#221c35]" />
                  </div>
                  <div>
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-3">Events & Temporary</h3>
                    <p className="text-lg text-[#383349]/80 leading-relaxed">
                      Exhibition stands, event signage, and temporary outdoor displays. Lightweight correx and foamex options for easy transport and setup.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <HowItWorksSection
          serviceType="signboards"
          sectionId="how-it-works"
          subtitle="Choose from five material options to suit your application. From durable outdoor aluminium composite to lightweight correx for temporary signage."
        />

        {/* Material Options Section */}
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
                Select Your Material
              </h2>
              <p className="text-xl text-[#383349]/70 max-w-3xl mx-auto">
                Each material has unique properties suited to different applications. Our team can advise on the best choice for your project.
              </p>
            </motion.div>

            {/* Aluminium Composite - Featured */}
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-[#221c35] to-[#383349] rounded-3xl p-10 md:p-14 text-white relative overflow-hidden mb-8"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />

              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  {/* IMAGE: Aluminium composite signboard sample */}
                  <div className="h-48 mb-6 rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-white/30 mb-2" />
                    <span className="text-white/40 text-sm">Aluminium composite board</span>
                  </div>
                  <Shield className="w-12 h-12 text-[#908d9a] mb-6" />
                  <h3 className="hearns-font text-4xl md:text-5xl mb-2">Aluminium Composite</h3>
                  <p className="text-[#908d9a] text-lg mb-6">Durable Exterior Board</p>
                  <p className="text-white/80 text-lg leading-relaxed mb-6">
                    Twin coated aluminium skins with solid polyethylene core. The go-to choice for outdoor signage that needs to withstand the elements.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-[#908d9a] mb-2">Specifications</h4>
                    <ul className="space-y-1 text-white/80 text-sm">
                      <li>• Up to 8 × 4 ft panels</li>
                      <li>• 3mm thickness</li>
                      <li>• White matt finish</li>
                      <li>• Multi-panel system for larger signage</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#908d9a] mb-2">Installation</h4>
                    <ul className="space-y-1 text-white/80 text-sm">
                      <li>• Drillable (pre-drilled or self-drill)</li>
                      <li>• Colour-matched screw caps available</li>
                      <li>• Wall hardware included</li>
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4">
                    <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Exterior use</span>
                    <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Weather resistant</span>
                    <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Long-lasting</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Perspex Acrylic */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-3xl p-10 md:p-14 border border-[#c1c6c8]/30 relative overflow-hidden mb-8"
            >
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  {/* IMAGE: Perspex acrylic sign sample */}
                  <div className="h-48 mb-6 rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-[#f8f8f8]">
                    <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                    <span className="text-[#383349]/40 text-sm">Perspex acrylic sign</span>
                  </div>
                  <Sparkles className="w-12 h-12 text-[#908d9a] mb-6" />
                  <h3 className="hearns-font text-4xl md:text-5xl text-[#221c35] mb-2">Perspex Acrylic</h3>
                  <p className="text-[#908d9a] text-lg mb-6">Luxury Interior & Exterior</p>
                  <p className="text-[#383349]/80 text-lg leading-relaxed mb-6">
                    Premium acrylic panels in clear or 35 opaque colours. Perfect for reception areas, corporate offices, and high-end retail environments.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-[#908d9a] mb-2">Specifications</h4>
                    <ul className="space-y-1 text-[#383349]/80 text-sm">
                      <li>• 3mm – 10mm thickness</li>
                      <li>• Up to 8 × 4 ft panels</li>
                      <li>• Clear or 35 opaque colours</li>
                      <li>• Mirror, coloured mirror & textured options</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#908d9a] mb-2">Mounting Options</h4>
                    <ul className="space-y-1 text-[#383349]/80 text-sm">
                      <li>• Chrome or satin stand-offs</li>
                      <li>• Drillable</li>
                      <li>• Floating effect available</li>
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4">
                    <span className="px-4 py-2 rounded-full bg-[#221c35] text-white text-sm">Premium finish</span>
                    <span className="px-4 py-2 rounded-full bg-[#221c35]/10 text-[#221c35] text-sm">Interior & Exterior</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Aluminium Sign Tray */}
            <motion.div
              variants={fadeInUp}
              className="bg-[#221c35]/5 rounded-3xl p-10 md:p-14 mb-8"
            >
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  {/* IMAGE: Aluminium sign tray product */}
                  <div className="h-48 mb-6 rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-white">
                    <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                    <span className="text-[#383349]/40 text-sm">Aluminium sign tray</span>
                  </div>
                  <Layers className="w-12 h-12 text-[#908d9a] mb-6" />
                  <h3 className="hearns-font text-3xl text-[#221c35] mb-2">Aluminium Sign Tray</h3>
                  <p className="text-[#908d9a] text-lg mb-6">Robust Exterior Option</p>
                  <p className="text-[#383349]/80 text-lg leading-relaxed">
                    Folded pan tray construction for a seamless, professional appearance. Ideal for larger exterior signage that needs to make an impact.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-[#908d9a] mb-2">Specifications</h4>
                    <ul className="space-y-1 text-[#383349]/80 text-sm">
                      <li>• Up to 3000 × 1460mm single panel</li>
                      <li>• Multi-panel system for larger signage</li>
                      <li>• Matt or gloss finish</li>
                      <li>• Wall hardware included</li>
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 rounded-full bg-[#221c35]/10 text-[#221c35] text-sm">Exterior use</span>
                    <span className="px-4 py-2 rounded-full bg-[#221c35]/10 text-[#221c35] text-sm">Seamless finish</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Lightweight Options Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Foamex */}
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-3xl p-8 border border-[#c1c6c8]/30"
              >
                {/* IMAGE: Foamex board product */}
                <div className="h-36 mb-4 rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-[#f8f8f8]">
                  <ImageIcon className="w-8 h-8 text-[#908d9a]/40 mb-2" />
                  <span className="text-[#383349]/40 text-xs">Foamex board</span>
                </div>
                <Package className="w-10 h-10 text-[#908d9a] mb-4" />
                <h3 className="hearns-font text-2xl text-[#221c35] mb-2">Foamex</h3>
                <p className="text-[#908d9a] mb-4">Indoor & Covered Exterior</p>
                <p className="text-[#383349]/80 mb-6">
                  Lightweight foam PVC board. Perfect for exhibitions, events, and indoor signage. Direct printed or vinyl applied.
                </p>
                <ul className="space-y-1 text-[#383349]/70 text-sm mb-6">
                  <li>• 3 – 10mm thickness</li>
                  <li>• Up to 8 × 4 ft</li>
                  <li>• Direct print or vinyl</li>
                  <li>• Ideal for exhibitions</li>
                </ul>
                <span className="px-3 py-1 rounded-full bg-[#221c35]/10 text-sm text-[#221c35]">Lightweight</span>
              </motion.div>

              {/* Correx */}
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-3xl p-8 border border-[#c1c6c8]/30"
              >
                {/* IMAGE: Correx board product */}
                <div className="h-36 mb-4 rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-[#f8f8f8]">
                  <ImageIcon className="w-8 h-8 text-[#908d9a]/40 mb-2" />
                  <span className="text-[#383349]/40 text-xs">Correx board</span>
                </div>
                <Hammer className="w-10 h-10 text-[#908d9a] mb-4" />
                <h3 className="hearns-font text-2xl text-[#221c35] mb-2">Correx</h3>
                <p className="text-[#908d9a] mb-4">Temporary Outdoor</p>
                <p className="text-[#383349]/80 mb-6">
                  Waterproof corrugated plastic. Ideal for temporary outdoor signage, real estate boards, political signs, and events.
                </p>
                <ul className="space-y-1 text-[#383349]/70 text-sm mb-6">
                  <li>• 3mm – 6mm thickness</li>
                  <li>• Up to 8 × 4 ft</li>
                  <li>• Waterproof</li>
                  <li>• Lightweight & portable</li>
                </ul>
                <span className="px-3 py-1 rounded-full bg-[#221c35]/10 text-sm text-[#221c35]">Budget-friendly</span>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Types of Customisation Section */}
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
                Finishing Options
              </div>
              <h2 className="hearns-font text-4xl md:text-6xl text-white mb-6">
                Types of Customisation
              </h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Choose from printed or cut vinyl depending on your design requirements. Additional finishing options available for specific applications.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Printed Vinyl */}
              <div className="bg-white/5 frosted-glass rounded-3xl p-8 md:p-10 border border-white/10">
                <h3 className="hearns-font text-3xl text-white mb-4">Printed Vinyl</h3>
                <p className="text-white/70 mb-6">Full-colour graphics for complex artwork, gradients, photographs, and detailed designs.</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a]" />
                    <span className="text-white/80">Gradients & photographs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a]" />
                    <span className="text-white/80">Fluorescent colours</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a]" />
                    <span className="text-white/80">Metallic finishes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a]" />
                    <span className="text-white/80">Full-colour coverage</span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-white/10 text-sm text-white/80">Best for complex designs</span>
              </div>

              {/* Cut Vinyl */}
              <div className="bg-white/5 frosted-glass rounded-3xl p-8 md:p-10 border border-white/10">
                <h3 className="hearns-font text-3xl text-white mb-4">Cut Vinyl</h3>
                <p className="text-white/70 mb-6">Sharp lettering and logos without background. Perfect for simple, bold designs.</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a]" />
                    <span className="text-white/80">Sharp, crisp edges</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a]" />
                    <span className="text-white/80">Metallic & fluorescent</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a]" />
                    <span className="text-white/80">Glitter finishes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-white/40" />
                    <span className="text-white/50">Gradients & photographs</span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-white/10 text-sm text-white/80">Best for text & logos</span>
              </div>
            </div>

            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h4 className="font-semibold text-white mb-2">Anti-Graffiti Lamination</h4>
                <p className="text-white/60 text-sm">Protective coating that allows graffiti to be wiped clean</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h4 className="font-semibold text-white mb-2">Dry-Wipe Finish</h4>
                <p className="text-white/60 text-sm">Perfect for menu boards and changeable displays</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h4 className="font-semibold text-white mb-2">Matt or Gloss</h4>
                <p className="text-white/60 text-sm">Choose your preferred finish for the final look</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Gallery Section */}
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#f8f8f8]">
          <motion.div
            className="max-w-7xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="smilecake-font text-5xl md:text-6xl text-[#221c35] mb-4">Installed Signage</h2>
              <p className="text-xl text-[#383349]/70 max-w-2xl mx-auto">
                See how our custom signboards transform shopfronts and interiors.
              </p>
            </motion.div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <motion.div variants={fadeInUp} className="aspect-square rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-white">
                {/* IMAGE: Shopfront fascia sign */}
                <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                <span className="text-[#383349]/40 text-xs text-center px-2">Shopfront fascia</span>
              </motion.div>
              <motion.div variants={fadeInUp} className="aspect-square rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-white">
                {/* IMAGE: Reception sign */}
                <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                <span className="text-[#383349]/40 text-xs text-center px-2">Reception sign</span>
              </motion.div>
              <motion.div variants={fadeInUp} className="aspect-square rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-white">
                {/* IMAGE: Wayfinding signage */}
                <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                <span className="text-[#383349]/40 text-xs text-center px-2">Wayfinding</span>
              </motion.div>
              <motion.div variants={fadeInUp} className="aspect-square rounded-2xl border-2 border-dashed border-[#c1c6c8]/40 flex flex-col items-center justify-center bg-white">
                {/* IMAGE: Event signage */}
                <ImageIcon className="w-10 h-10 text-[#908d9a]/40 mb-2" />
                <span className="text-[#383349]/40 text-xs text-center px-2">Event signage</span>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Installation & CTA Section */}
        <section className="bg-white">
          <div className="grid md:grid-cols-2">
            <motion.div
              className="py-24 px-6 md:px-12 lg:px-16 bg-white"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="hearns-font text-4xl md:text-5xl text-[#221c35] mb-8">
                Installation<br />
                <span className="text-[#908d9a]">Options</span>
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#221c35] flex items-center justify-center flex-shrink-0">
                    <Hammer className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#221c35] text-lg mb-1">Professional Installation</h3>
                    <p className="text-[#383349]/70">Our installation team operates throughout the Midlands. We'll handle everything from site survey to final fitting.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#908d9a] flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#221c35] text-lg mb-1">Supply Only</h3>
                    <p className="text-[#383349]/70">Self-install kits with pre-drilled holes and all necessary hardware included. Full fitting instructions provided.</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-6 bg-white rounded-2xl border border-[#c1c6c8]/30">
                <h4 className="font-semibold text-[#221c35] mb-3">Production Timeline</h4>
                <p className="text-[#383349]/70 text-sm">Typically 5–10 working days depending on complexity. Rush orders available on request.</p>
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
                Tell us about your project and we'll recommend the perfect signboard solution. Panels built using premium materials and high manufacturing standards.
              </p>

              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#908d9a]" />
                  <span className="text-white/80">Free design consultation</span>
                </li>
                <li className="flex items-center gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#908d9a]" />
                  <span className="text-white/80">Material recommendations</span>
                </li>
                <li className="flex items-center gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#908d9a]" />
                  <span className="text-white/80">Installation available</span>
                </li>
              </ul>

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

export default Signboards;
