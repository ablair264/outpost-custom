import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { CheckCircle2, Home, Building2, Sun, Layers, Palette, Mail, Sparkles, Eye, Shield, ImageIcon } from 'lucide-react';
import { usePageTheme } from '../contexts/ThemeContext';
import HowItWorksSection from '../components/HowItWorksSection';

const WindowPrivacyFilm: React.FC = () => {
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

        {/* Hero Section - Light-focused design */}
        <section className="relative min-h-[90vh] w-full overflow-hidden bg-gradient-to-br from-[#221c35] via-[#2a2442] to-[#383349]">
          {/* Animated light rays */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="light-ray absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <div className="light-ray absolute top-0 left-1/4 w-1/4 h-full bg-gradient-to-r from-transparent via-white/3 to-transparent" style={{ animationDelay: '2s' }} />
            <div className="light-ray absolute top-0 right-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/4 to-transparent" style={{ animationDelay: '4s' }} />
          </div>

          {/* Hero Image */}
          <div className="absolute top-20 right-8 md:right-16 lg:right-24 w-[300px] md:w-[400px] lg:w-[500px] h-[400px] md:h-[500px] lg:h-[600px] hidden md:block">
            {/* IMAGE: Window with frosted privacy film, light streaming through, showing the translucent effect */}
            <div className="w-full h-full rounded-3xl bg-white/[0.03] frosted-glass border-2 border-dashed border-white/20 flex flex-col items-center justify-center">
              <ImageIcon className="w-16 h-16 text-white/30 mb-4" />
              <span className="text-white/40 text-sm text-center px-4">Hero Image: Frosted window with light</span>
            </div>
          </div>

          {/* Main content */}
          <div className="relative z-10 h-full flex items-center px-6 md:px-12 lg:px-24 pt-32 pb-20">
            <div className="max-w-5xl">
              <div ref={headingRef}>
                <p className="neuzeit-font text-[#908d9a] uppercase tracking-[0.3em] text-sm mb-6">
                  Window Privacy Film
                </p>
                <h1 className="hearns-font text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-[0.95] mb-8">
                  Privacy That<br />
                  <span className="gradient-text">Still Lets the</span><br />
                  Light In
                </h1>
              </div>

              <div ref={subtitleRef} className="max-w-xl mb-12">
                <p className="text-xl md:text-2xl text-[#c1c6c8] font-light leading-relaxed">
                  Add subtle style and safe visibility without darkening your space.
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
              {/* Home */}
              <motion.div variants={fadeInUp} className="md:col-span-5">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#383349] to-[#221c35] flex items-center justify-center flex-shrink-0">
                    <Home className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-3">Homes</h3>
                    <p className="text-lg text-[#383349]/80 leading-relaxed">
                      The modern alternative to net curtains. Perfect for bathrooms, kitchens, and any room where you want privacy without sacrificing natural light.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Office - offset */}
              <motion.div variants={fadeInUp} className="md:col-span-5 md:col-start-7 md:mt-24">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#908d9a] to-[#383349] flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-3">Offices</h3>
                    <p className="text-lg text-[#383349]/80 leading-relaxed">
                      Create private meeting spaces and partition areas without the need for solid walls. Maintain an open, airy atmosphere.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Light - centered */}
              <motion.div variants={fadeInUp} className="md:col-span-6 md:col-start-4 md:mt-12">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#c1c6c8] to-[#908d9a] flex items-center justify-center flex-shrink-0">
                    <Sun className="w-10 h-10 text-[#221c35]" />
                  </div>
                  <div>
                    <h3 className="hearns-font text-3xl text-[#221c35] mb-3">Light-Filled Spaces</h3>
                    <p className="text-lg text-[#383349]/80 leading-relaxed">
                      Our etched vinyl delivers a beautiful translucent finish while allowing up to 80% of natural light through. No more dark, gloomy rooms.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <HowItWorksSection
          serviceType="window-film"
          sectionId="how-it-works"
          subtitle="From measurement to installation, we make the process simple. Whether you're going DIY or want professional fitting, we've got you covered."
        />

        {/* Customisation Section - Asymmetric grid, not cards */}
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
              {/* Full Coverage - Large */}
              <motion.div
                variants={fadeInUp}
                className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-[#221c35] to-[#383349] rounded-3xl overflow-hidden group"
              >
                {/* IMAGE: Full coverage frosted window showing different light conditions */}
                <div className="h-48 md:h-64 bg-white/5 border-b border-dashed border-white/20 flex flex-col items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-white/30 mb-2" />
                  <span className="text-white/40 text-sm">Full coverage example</span>
                </div>
                <div className="p-10 md:p-14 text-white relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
                  <Layers className="w-12 h-12 text-[#908d9a] mb-6" />
                  <h3 className="hearns-font text-4xl md:text-5xl mb-4">Full Coverage</h3>
                  <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-md">
                    Maximum privacy with various translucency levels. See how shapes appear in different lighting conditions.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Light frost</span>
                    <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Medium frost</span>
                    <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Heavy frost</span>
                    <span className="px-4 py-2 rounded-full bg-white/10 text-sm">Coloured options</span>
                  </div>
                </div>
              </motion.div>

              {/* Cut-Outs */}
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-3xl overflow-hidden border border-[#c1c6c8]/30 hover:border-[#908d9a]/50 transition-colors"
              >
                {/* IMAGE: Window film with logo cut-out */}
                <div className="h-32 bg-[#f8f8f8] border-b border-dashed border-[#c1c6c8]/50 flex flex-col items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-[#908d9a]/40 mb-1" />
                  <span className="text-[#908d9a]/50 text-xs">Cut-out example</span>
                </div>
                <div className="p-6">
                  <Sparkles className="w-10 h-10 text-[#908d9a] mb-4" />
                  <h3 className="hearns-font text-2xl text-[#221c35] mb-3">Cut-Outs & Branding</h3>
                  <p className="text-[#383349]/70 leading-relaxed">
                    Add your logo, text, or directional icons to the frosted surface.
                  </p>
                </div>
              </motion.div>

              {/* Layered Decals */}
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-3xl overflow-hidden border border-[#c1c6c8]/30 hover:border-[#908d9a]/50 transition-colors"
              >
                {/* IMAGE: Layered vinyl showing lightbox effect */}
                <div className="h-32 bg-[#f8f8f8] border-b border-dashed border-[#c1c6c8]/50 flex flex-col items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-[#908d9a]/40 mb-1" />
                  <span className="text-[#908d9a]/50 text-xs">Layered effect</span>
                </div>
                <div className="p-6">
                  <Eye className="w-10 h-10 text-[#908d9a] mb-4" />
                  <h3 className="hearns-font text-2xl text-[#221c35] mb-3">Layered Decals</h3>
                  <p className="text-[#383349]/70 leading-relaxed">
                    Combine coloured vinyl behind etched film for stunning lightbox effects at night.
                  </p>
                </div>
              </motion.div>

              {/* Patterns - Wide */}
              <motion.div
                variants={fadeInUp}
                className="md:col-span-3 bg-gradient-to-r from-[#908d9a]/10 via-[#908d9a]/5 to-transparent rounded-3xl p-10 flex flex-col md:flex-row items-center gap-8"
              >
                <Palette className="w-16 h-16 text-[#383349] flex-shrink-0" />
                <div>
                  <h3 className="hearns-font text-3xl text-[#221c35] mb-2">Patterns & Colours</h3>
                  <p className="text-[#383349]/70 text-lg leading-relaxed">
                    Choose from our stock motifs or submit custom artwork. We offer lighter and heavier opacities, plus coloured frosts to match any interior.
                  </p>
                </div>
                <a href="/contact" className="flex-shrink-0 px-6 py-3 rounded-full bg-[#383349] text-white font-medium hover:bg-[#221c35] transition-colors">
                  Explore Options
                </a>
              </motion.div>
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
              <h2 className="smilecake-font text-5xl md:text-6xl text-[#221c35] mb-4">
                Recent Work
              </h2>
              <p className="text-xl text-[#383349]/70">
                See how our privacy film transforms real spaces
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Gallery Image 1 - Large */}
              <motion.div variants={fadeInUp} className="col-span-2 row-span-2">
                {/* IMAGE: Large showcase - bathroom or office with frosted privacy film */}
                <div className="w-full h-full min-h-[300px] md:min-h-[400px] rounded-2xl bg-[#f8f8f8] border-2 border-dashed border-[#c1c6c8]/50 flex flex-col items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-[#908d9a]/40 mb-2" />
                  <span className="text-[#908d9a]/50 text-sm">Main gallery image</span>
                </div>
              </motion.div>

              {/* Gallery Image 2 */}
              <motion.div variants={fadeInUp}>
                {/* IMAGE: Close-up of frosted pattern */}
                <div className="w-full aspect-square rounded-2xl bg-[#f8f8f8] border-2 border-dashed border-[#c1c6c8]/50 flex flex-col items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-[#908d9a]/40 mb-1" />
                  <span className="text-[#908d9a]/50 text-xs">Detail shot</span>
                </div>
              </motion.div>

              {/* Gallery Image 3 */}
              <motion.div variants={fadeInUp}>
                {/* IMAGE: Window with branded cut-out */}
                <div className="w-full aspect-square rounded-2xl bg-[#f8f8f8] border-2 border-dashed border-[#c1c6c8]/50 flex flex-col items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-[#908d9a]/40 mb-1" />
                  <span className="text-[#908d9a]/50 text-xs">Branded example</span>
                </div>
              </motion.div>

              {/* Gallery Image 4 */}
              <motion.div variants={fadeInUp}>
                {/* IMAGE: Before/after or light effect */}
                <div className="w-full aspect-square rounded-2xl bg-[#f8f8f8] border-2 border-dashed border-[#c1c6c8]/50 flex flex-col items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-[#908d9a]/40 mb-1" />
                  <span className="text-[#908d9a]/50 text-xs">Light effect</span>
                </div>
              </motion.div>

              {/* Gallery Image 5 */}
              <motion.div variants={fadeInUp}>
                {/* IMAGE: Office partition or meeting room */}
                <div className="w-full aspect-square rounded-2xl bg-[#f8f8f8] border-2 border-dashed border-[#c1c6c8]/50 flex flex-col items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-[#908d9a]/40 mb-1" />
                  <span className="text-[#908d9a]/50 text-xs">Office install</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Dual Purpose - Full bleed with diagonal split */}
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
                  Compliance Ready
                </div>
                <h2 className="hearns-font text-4xl md:text-6xl text-white mb-6">
                  Two Jobs,<br />One Solution
                </h2>
                <p className="text-xl text-white/80 leading-relaxed mb-8">
                  Privacy film can double as <strong className="text-[#908d9a]">glass manifestation</strong> when applied at the required heights (850-1000mm and 1400-1600mm).
                </p>
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#908d9a]" />
                  <span className="text-white/90">Meets Building Regulations K5.2</span>
                </div>
              </div>

              <div className="bg-white/5 frosted-glass rounded-3xl p-8 md:p-10 border border-white/10">
                <h3 className="smilecake-font text-3xl text-white mb-6">Why It Matters</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-white/80">Prevents walk-into-glass accidents</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-white/80">DDA compliance for accessibility</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-white/80">Visible from both sides in all lighting</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a] flex-shrink-0 mt-1" />
                    <span className="text-white/80">Privacy and compliance in one install</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Installation Section */}
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-white">
          <motion.div
            className="max-w-7xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="hearns-font text-5xl md:text-6xl text-[#221c35] mb-4">
                We'll Fit It <span className="text-[#908d9a]">Or You Can</span>
              </h2>
              <p className="text-xl text-[#383349]/70 max-w-2xl mx-auto">
                Choose professional installation or confident DIY with our guidance.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Professional Install */}
              <motion.div
                variants={fadeInUp}
                className="bg-gradient-to-br from-[#221c35] to-[#383349] rounded-3xl p-8 md:p-10 text-white"
              >
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="hearns-font text-3xl mb-4">Professional Install</h3>
                <p className="text-white/80 leading-relaxed mb-6">
                  Our experienced team covers the Midlands with bubble-free application. Access equipment and all fittings included.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a]" />
                    <span className="text-white/70">Flawless, bubble-free finish</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a]" />
                    <span className="text-white/70">All access equipment provided</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a]" />
                    <span className="text-white/70">Midlands coverage</span>
                  </li>
                </ul>
              </motion.div>

              {/* DIY Kit */}
              <motion.div
                variants={fadeInUp}
                className="bg-[#f8f8f8] rounded-3xl p-8 md:p-10 border border-[#c1c6c8]/30"
              >
                <div className="w-16 h-16 rounded-full bg-[#908d9a] flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="hearns-font text-3xl text-[#221c35] mb-4">DIY Kit</h3>
                <p className="text-[#383349]/80 leading-relaxed mb-6">
                  Pre-cut panels supplied with fixings and step-by-step guidance for confident self-installation.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a]" />
                    <span className="text-[#383349]/70">Pre-cut to your measurements</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a]" />
                    <span className="text-[#383349]/70">All fixings included</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#908d9a]" />
                    <span className="text-[#383349]/70">Step-by-step instructions</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Care & CTA Section */}
        <section className="bg-[#221c35]">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-24">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Care Instructions */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="smilecake-font text-4xl md:text-5xl text-white mb-8">
                  Looking After Your Film
                </h2>
                <p className="text-white/70 text-lg mb-8">
                  Window film is easy to maintain. Follow these simple guidelines to keep it looking perfect.
                </p>
                <ul className="space-y-5">
                  <li className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Wait 3 weeks after fitting before first clean</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Clean with mild soapy water and soft cloth</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Avoid abrasive cleaners and excessive pressure</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Wipe gently around intricate cut-out edges</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#908d9a] flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Never use ammonia-based cleaning products</span>
                  </li>
                </ul>
              </motion.div>

              {/* CTA Card */}
              <motion.div
                className="bg-white/5 frosted-glass rounded-3xl p-8 md:p-10 border border-white/10"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h3 className="hearns-font text-3xl md:text-4xl text-white mb-4">
                  Ready to Get Started?
                </h3>
                <p className="text-white/70 text-lg mb-8 leading-relaxed">
                  Tell us about your space and we'll recommend the perfect privacy film solution for your needs and budget.
                </p>
                <a
                  href="/contact"
                  className="w-full inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-[#221c35] font-semibold hover:bg-[#c1c6c8] transition-all duration-300"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Get Your Free Quote
                </a>
                <p className="text-white/50 text-sm text-center mt-4">
                  Professional fitting available throughout the Midlands
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default WindowPrivacyFilm;
