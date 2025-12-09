import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Send } from 'lucide-react'

const instagramPosts = [
  {
    image: '/hero-images/Frame 7.png',
    caption:
      'Custom vehicle wrap for a local business. Full coverage print with matte finish and branding details.',
  },
  {
    image: '/images/MIMAKI-UCJV150-160.png',
    caption:
      'Our Mimaki UCJV150-160 printer in action. Capable of vibrant, consistent colour across large runs.',
  },
  {
    image: '/hero-images/beanie1.jpg',
    caption: 'Detailed embroidery for branded beanies – perfect for merch and team uniforms.',
  },
]

const PrintAndInstagram: React.FC = () => {
  return (
    <section className="w-full">
      <style>{`
        @font-face {
          font-family: 'EmbossT';
          src: url('/fonts/embossing_tape/embosst3.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'NeuzeitGroteskCustom';
          src: url('/fonts/font/NeuzeitGro-Reg.ttf') format('truetype');
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
        .emboss-font { font-family: 'EmbossT', 'Arial Black', sans-serif; letter-spacing: 0.3em; }
        .grotesk-font { font-family: 'NeuzeitGroteskCustom', 'Helvetica Neue', sans-serif; }
        .smilecake-font { font-family: 'Smilecake', 'Comic Sans MS', cursive; letter-spacing: 0.1em; }
      `}</style>

      {/* Printing Section */}
      <div className="relative overflow-hidden bg-[#333333CC] text-[#C1C6C8]">
        <div className="absolute inset-0">
          <img
            src="/images/MIMAKI-UCJV150-160.png"
            alt="Large format printer"
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-[#000000]/70" />
        </div>
        <div className="relative mx-auto flex max-w-[1450px] flex-col items-center gap-4 sm:gap-5 md:gap-6 px-4 py-12 sm:py-16 md:py-20 text-center sm:px-6 md:px-12">
          <p className="emboss-font text-xl sm:text-2xl md:text-[32px] lg:text-[40px] uppercase tracking-[0.06em] sm:tracking-[0.08em] text-[#64A70B] px-2 md:px-12">
            Bring your artwork to life
          </p>
          <p className="emboss-font text-lg sm:text-xl md:text-[26px] lg:text-[32px] text-[#C1C6C8] px-2 md:px-12 tracking-[0.06em] sm:tracking-[0.08em]">
            with our in-house Digital Printing.
          </p>
          <img src="/images/Scribble_Green.png" alt="Green scribble" className="w-[160px] sm:w-[220px] md:w-[260px] lg:w-[317px]" />
          <p className="grotesk-font w-full max-w-[820px] px-2 sm:px-4 md:px-6 text-sm sm:text-base md:text-lg lg:text-[24px] leading-relaxed text-[#C1C6C8]">
            We've got in-house printers so we can deliver a speedy, reliable service. Our production team can manage the demanding deadlines and technical challenges to ensure you get printed products that reflect your business in the best possible way.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-[#64a70b] px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#111a09] shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition-all hover:bg-[#79c826] hover:shadow-[0_14px_28px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            Contact
            <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.4} />
          </a>
        </div>
      </div>

      {/* Instagram Section */}
      <div className="bg-[#64A70B] text-[#221C35]">
        <div className="mx-auto flex max-w-[1450px] flex-col gap-5 sm:gap-6 md:gap-8 px-4 py-10 sm:py-12 md:py-16 sm:px-6 md:px-12">
          <div className="flex flex-col gap-2 sm:gap-3 text-center">
            <p className="smilecake-font text-base sm:text-lg md:text-xl uppercase">Instagram</p>
            <h3 className="smilecake-font text-xl sm:text-2xl md:text-3xl uppercase">Behind the scenes @outpostcustom</h3>
            <p className="grotesk-font text-sm sm:text-base">
              Fresh projects, installs, and shop-floor shots. Tap through for daily updates.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 md:gap-6">
            {instagramPosts.map((post, index) => (
              <motion.div
                key={post.image}
                className="rounded-xl sm:rounded-2xl md:rounded-3xl bg-white/85 p-3 sm:p-4 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl border border-[#221C35]/10">
                  <img src={post.image} alt="Instagram post" className="h-40 sm:h-44 md:h-48 w-full object-cover" />
                </div>
                <p className="grotesk-font mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed">{post.caption}</p>
                <a
                  href="https://instagram.com/outpostcustom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="smilecake-font mt-2 sm:mt-3 inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em]"
                >
                  View post
                  <ArrowRight size={12} className="sm:w-[14px] sm:h-[14px]" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PrintAndInstagram
