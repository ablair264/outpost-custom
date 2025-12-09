import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'motion/react';
import { Award, Zap, Layers, GraduationCap, Palette, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PrintingFontStyles from '../components/printing/PrintingFontStyles';
import PrintingImageAccordion from '../components/printing/PrintingImageAccordion';
import PrintingHowItWorks from '../components/printing/PrintingHowItWorks';
import SlimGridMotion from '../components/SlimGridMotion';
import {
  printingColors,
  printingFeatures,
} from '../lib/printing-theme';
import { productTypes } from '../lib/printing-products';

// Icon mapping for features
const featureIconMap: Record<string, React.FC<{ className?: string; strokeWidth?: number }>> = {
  Award,
  Zap,
  Layers,
  GraduationCap,
};

// Placeholder images for hero grid
const heroGridImages = [
  'https://outpostcustom.co.uk/wp-content/uploads/2023/10/OP-Business-Card-Mockup2-600x600.jpg',
  'https://outpostcustom.co.uk/wp-content/uploads/2023/10/OP-Flyer-Mockup2-600x600.jpg',
  'https://outpostcustom.co.uk/wp-content/uploads/2024/02/OP_SquareBooklet-Mockup-600x600.jpg',
  'https://outpostcustom.co.uk/wp-content/uploads/2023/10/OP-Poster-Mockup-600x600.jpg',
  'https://outpostcustom.co.uk/wp-content/uploads/2023/10/OP-Greetings-Card-Mockup_1Sided-600x600.jpg',
  'https://outpostcustom.co.uk/wp-content/uploads/2023/10/OP-Loyalty-Card-Mockup-600x600.jpg',
  'https://outpostcustom.co.uk/wp-content/uploads/2024/02/OP_BellyBands_3-600x600.jpg',
  'https://outpostcustom.co.uk/wp-content/uploads/2023/10/OP-Calendar-Mockup-600x600.jpg',
  'https://outpostcustom.co.uk/wp-content/uploads/2024/08/OP-Notepad-600x600.jpg',
];

// Repeat images for grid
const gridImages = [...heroGridImages, ...heroGridImages, ...heroGridImages].slice(0, 21);

// Product type images (maps to productTypes from printing-products.ts)
const productTypeImages: Record<string, string> = {
  'cards': 'https://outpostcustom.co.uk/wp-content/uploads/2023/10/OP-Business-Card-Mockup2-600x600.jpg',
  'flyers': 'https://outpostcustom.co.uk/wp-content/uploads/2023/10/OP-Flyer-Mockup2-600x600.jpg',
  'booklets': 'https://outpostcustom.co.uk/wp-content/uploads/2024/02/OP_SquareBooklet-Mockup-600x600.jpg',
  'posters': 'https://outpostcustom.co.uk/wp-content/uploads/2023/10/OP-Poster-Mockup-600x600.jpg',
  'stationery': 'https://outpostcustom.co.uk/wp-content/uploads/2024/08/OP-Notepad-600x600.jpg',
  'stickers': 'https://outpostcustom.co.uk/wp-content/uploads/2023/10/OP-Sticker-Mockup-600x600.jpg',
  'calendars': 'https://outpostcustom.co.uk/wp-content/uploads/2023/10/OP-Calendar-Mockup-600x600.jpg',
  'packaging': 'https://outpostcustom.co.uk/wp-content/uploads/2024/02/OP_BellyBands_3-600x600.jpg',
  'specialty': 'https://outpostcustom.co.uk/wp-content/uploads/2024/02/OP_4pp_OSS-mockup-600x600.jpg',
};

// Product type descriptions
const productTypeDescriptions: Record<string, string> = {
  'cards': 'Business cards, loyalty cards, appointment cards & more',
  'flyers': 'Promote events, products & services with quality flyers',
  'booklets': 'Brochures, catalogues, presentations & wire-bound docs',
  'posters': 'Eye-catching posters & art prints in various sizes',
  'stationery': 'Letterheads, compliment slips, certificates & notepads',
  'stickers': 'Custom stickers, product labels & sticker sheets',
  'calendars': 'Desk calendars, wall calendars & planners',
  'packaging': 'Swing tags, belly bands, backing cards & bookmarks',
  'specialty': 'Funeral stationery, table talkers, postcards & more',
};

// Popular products for the image accordion
const popularProducts = [
  {
    id: 'flyers',
    title: 'Flyers',
    description: 'Promote your business, event, charity or product with our range of printed Flyers. Available in multiple sizes with matt or gloss lamination.',
    imageUrl: 'https://outpostcustom.co.uk/wp-content/uploads/2023/10/OP-Flyer-Mockup2-600x600.jpg',
    linkUrl: '/printing/promotional-marketing/flyers',
    tagline: 'Perfect for events & promotions',
    features: ['A4, A5, A6, DL sizes', 'Matt or Gloss', 'From 50 copies'],
  },
  {
    id: 'business-cards',
    title: 'Business Cards',
    description: 'Make a lasting impression with premium business cards. Choose from various paper stocks and finishes to match your brand.',
    imageUrl: 'https://outpostcustom.co.uk/wp-content/uploads/2023/10/OP-Business-Card-Mockup2-600x600.jpg',
    linkUrl: '/printing/business-stationery/business-cards',
    tagline: 'First impressions matter',
    features: ['85 x 55mm', '400gsm', 'Lamination options'],
  },
  {
    id: 'booklets',
    title: 'Booklets',
    description: 'Saddle-stitched or wire-bound booklets perfect for brochures, catalogues, and presentations. Professional finish guaranteed.',
    imageUrl: 'https://outpostcustom.co.uk/wp-content/uploads/2024/02/OP_SquareBooklet-Mockup-600x600.jpg',
    linkUrl: '/printing/promotional-marketing/booklets',
    tagline: 'Tell your story',
    features: ['A4, A5, Square', 'Saddle stitch', '8-64 pages'],
  },
  {
    id: 'posters',
    title: 'Posters',
    description: 'Eye-catching posters in various sizes. Perfect for events, retail displays, and promotional campaigns.',
    imageUrl: 'https://outpostcustom.co.uk/wp-content/uploads/2023/10/OP-Poster-Mockup-600x600.jpg',
    linkUrl: '/printing/promotional-marketing/posters',
    tagline: 'Get noticed',
    features: ['A3, A2, A1, A0', 'Matt or Gloss', 'Indoor/Outdoor'],
  },
  {
    id: 'greetings-cards',
    title: 'Greetings Cards',
    description: 'Beautiful greetings cards for resale or personal use. Includes envelopes and cellophane bags.',
    imageUrl: 'https://outpostcustom.co.uk/wp-content/uploads/2023/10/OP-Greetings-Card-Mockup_1Sided-600x600.jpg',
    linkUrl: '/printing/resale-gifting/greetings-cards',
    tagline: 'Create memories',
    features: ['A5, A6, Square', 'With envelopes', 'Cello wrapped'],
  },
];

const PrintingLandingPage: React.FC = () => {
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(headingRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, delay: 0.3 })
      .fromTo(contentRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9 }, '-=0.6')
      .fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.4');
  }, []);

  return (
    <>
      <PrintingFontStyles />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative min-h-[75vh] w-full overflow-hidden" style={{ backgroundColor: printingColors.dark }}>
          {/* Background grid */}
          <div className="absolute inset-0">
            <SlimGridMotion items={gridImages} gradientColor={printingColors.dark} />
          </div>

          {/* Texture overlays */}
          <div
            className="absolute inset-0 z-[2] opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'url(/ConcreteTexture.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              mixBlendMode: 'overlay',
            }}
          />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0 z-[5]"
            style={{
              background: `linear-gradient(to bottom, ${printingColors.dark}ee 0%, ${printingColors.dark}99 40%, ${printingColors.dark}ee 100%)`
            }}
          />

          {/* Hero content */}
          <div className="relative z-10 h-full flex items-center px-6 md:px-12 lg:px-24 py-24 md:py-32">
            <div className="max-w-6xl mx-auto w-full">
              <div ref={headingRef} className="mb-8">
                <h1 className="hearns-font text-6xl md:text-7xl lg:text-8xl xl:text-9xl tracking-tight text-white mb-4 leading-none">
                  Printing
                </h1>
                <div className="h-1.5 w-24 rounded-full" style={{ backgroundColor: printingColors.accent }} />
              </div>

              <div ref={contentRef} className="max-w-2xl mb-10">
                <p className="neuzeit-font text-xl md:text-2xl lg:text-3xl text-white/90 leading-relaxed">
                  Business cards to booklets, flyers to funeral stationery – quality printing with fast turnaround from our in-house team.
                </p>
              </div>

              <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#categories"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-[15px] text-white font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                  style={{ backgroundColor: printingColors.accent }}
                >
                  Browse Products
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-[15px] border-2 border-white/80 bg-transparent text-white font-semibold text-base hover:bg-white/10 transition-all duration-300"
                >
                  Get a Quote
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Product Types Section */}
        <section id="categories" className="py-20 md:py-28 px-6 md:px-12 lg:px-24 bg-[#f8f8f8]">
          <div className="max-w-7xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-14">
              <h2 className="hearns-font text-4xl md:text-5xl lg:text-6xl mb-4" style={{ color: printingColors.dark }}>
                What do we print?
              </h2>
              <p className="neuzeit-light-font text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Click a category to browse, or view all products
              </p>
            </div>

            {/* Product types grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {productTypes
                .filter(type => type.id !== 'all')
                .map((type, index) => (
                  <motion.div
                    key={type.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link
                      to={`/printing/all?type=${type.id}`}
                      className="group block"
                    >
                      <div className="relative aspect-square rounded-[15px] overflow-hidden bg-gray-200 mb-3">
                        <img
                          src={productTypeImages[type.id] || gridImages[0]}
                          alt={type.label}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ backgroundColor: `${printingColors.accent}30` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: printingColors.accent }}
                          >
                            <ArrowRight className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                      <h3
                        className="neuzeit-font text-base md:text-lg font-semibold text-center group-hover:text-[#64a70b] transition-colors"
                        style={{ color: printingColors.dark }}
                      >
                        {type.label}
                      </h3>
                      <p className="neuzeit-light-font text-xs md:text-sm text-gray-500 text-center mt-1 line-clamp-2">
                        {productTypeDescriptions[type.id]}
                      </p>
                    </Link>
                  </motion.div>
                ))}

              {/* Browse All Products - last card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: 0.45 }}
              >
                <Link
                  to="/printing/all"
                  className="group block"
                >
                  <div
                    className="relative aspect-square rounded-[15px] overflow-hidden mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-[1.02]"
                    style={{ backgroundColor: printingColors.accent }}
                  >
                    <div className="text-center p-4">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-white/30 transition-colors">
                        <ArrowRight className="w-8 h-8 text-white group-hover:translate-x-1 transition-transform" />
                      </div>
                      <span className="hearns-font text-xl md:text-2xl text-white">
                        View All
                      </span>
                    </div>
                  </div>
                  <h3 className="neuzeit-font text-base md:text-lg font-semibold text-center text-[#64a70b]">
                    Browse All Products
                  </h3>
                  <p className="neuzeit-light-font text-xs md:text-sm text-gray-500 text-center mt-1">
                    See our complete range
                  </p>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section - Why Choose Us */}
        <section
          className="relative py-20 md:py-28 overflow-hidden"
          style={{ backgroundColor: printingColors.dark }}
        >
          {/* Texture background */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: 'url(/BlackTextureBackground.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'url(/ConcreteTexture.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              mixBlendMode: 'overlay',
            }}
          />

          <div className="max-w-6xl mx-auto px-6 md:px-10 relative z-10">
            {/* Section header */}
            <div className="text-center mb-16">
              <p className="smilecake-font text-2xl md:text-3xl text-white/80 mb-2">Why choose us?</p>
              <h2 className="hearns-font text-4xl md:text-5xl text-white">
                In-house printing excellence
              </h2>
            </div>

            {/* Features grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
              {printingFeatures.map((feature, index) => {
                const Icon = featureIconMap[feature.icon];
                return (
                  <motion.div
                    key={feature.title}
                    className="text-center text-white flex flex-col items-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                      style={{ backgroundColor: `${printingColors.accent}30` }}
                    >
                      <Icon className="h-8 w-8 text-white" strokeWidth={1.5} />
                    </div>
                    <h3 className="embossing-font text-xl md:text-2xl uppercase text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="neuzeit-light-font text-base leading-relaxed text-white/80 max-w-xs">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom text */}
            <motion.p
              className="neuzeit-font text-center text-white/90 text-lg md:text-xl max-w-3xl mx-auto mt-16 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              We've got in-house printers so we can deliver a speedy, reliable service. Our production team can manage demanding deadlines and technical challenges to ensure you get printed products that reflect your business in the best possible way.
            </motion.p>
          </div>
        </section>

        {/* How It Works Section */}
        <PrintingHowItWorks
          title="How's it work?"
          subtitle="From concept to collection, we make the printing process simple and stress-free."
          backgroundColor="white"
        />

        {/* Popular Products - Image Accordion */}
        <PrintingImageAccordion
          items={popularProducts}
          title="Popular Products"
          subtitle="Explore our most requested printing solutions"
        />

        {/* Design Help CTA Section */}
        <section className="py-20 md:py-28 px-6 md:px-12 lg:px-24 bg-white overflow-hidden">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Header with scribble underline */}
              <div className="relative inline-block mb-6">
                <h2 className="hearns-font text-4xl md:text-5xl lg:text-6xl" style={{ color: printingColors.dark }}>
                  Need help with the design first?
                </h2>
                <img
                  src="/images/Scribble_Green.png"
                  alt=""
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-48 md:w-64 h-auto opacity-80"
                />
              </div>

              <div className="flex items-center justify-center gap-3 my-8">
                <Palette className="w-8 h-8" style={{ color: printingColors.accent }} />
              </div>

              <p className="neuzeit-light-font text-lg md:text-xl text-gray-600 mb-6 leading-relaxed max-w-2xl mx-auto">
                Our in-house designer has over 15 years designing commercially for print and is on hand to check your artwork and give any advice to make sure your printing is exactly how you imagine.
              </p>

              <p className="neuzeit-font text-lg text-gray-700 mb-10">
                We also offer a <strong>bespoke design service</strong> from scratch.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              >
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-10 py-4 rounded-[15px] text-white font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                  style={{
                    backgroundColor: printingColors.accent,
                    boxShadow: `0 10px 40px ${printingColors.accent}40`,
                  }}
                >
                  Book a Free Design Consultation
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section
          className="py-16 px-6 md:px-12 lg:px-24"
          style={{ backgroundColor: printingColors.neutral }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="hearns-font text-3xl md:text-4xl mb-4" style={{ color: printingColors.dark }}>
              Ready to get started?
            </h3>
            <p className="neuzeit-font text-lg text-gray-700 mb-8">
              Get a free quote or browse our full range of printing products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/printing/all"
                className="inline-flex items-center justify-center px-8 py-3 rounded-[15px] text-white font-semibold transition-all duration-300"
                style={{ backgroundColor: printingColors.dark }}
              >
                Browse All Products
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-3 rounded-[15px] border-2 font-semibold transition-all duration-300"
                style={{ borderColor: printingColors.dark, color: printingColors.dark }}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PrintingLandingPage;
