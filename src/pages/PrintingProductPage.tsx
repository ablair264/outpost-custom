import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ChevronRight,
  Home,
  FileText,
  Mail,
  ExternalLink,
  Check,
  Sparkles,
  Clock,
  Shield,
  ArrowRight,
  Upload,
  Calendar,
} from 'lucide-react';
import PrintingFontStyles from '../components/printing/PrintingFontStyles';
import ProductCard from '../components/printing/ProductCard';
import { ArtworkSubmissionFlow } from '../components/printing/artwork-submission';
import { printingColors } from '../lib/printing-theme';
import {
  getProductBySlug,
  getRelatedProducts,
  extractUseCases,
  getCategoryBySlug,
} from '../lib/printing-products';

const PrintingProductPage: React.FC = () => {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);

  const product = getProductBySlug(slug || '');
  const relatedProducts = getRelatedProducts(slug || '', 4);
  const categoryInfo = getCategoryBySlug(category || '');

  // Redirect if product not found
  if (!product) {
    return <Navigate to="/printing" replace />;
  }

  const useCases = extractUseCases(product);
  const imageUrl = product.images[0] || '/printing/placeholder.jpg';
  const categoryName = categoryInfo?.title || category?.replace(/-/g, ' ') || 'Products';

  // Parse specifications from description
  const parseSpecs = () => {
    const desc = product.full_description;
    const specs: { label: string; items: string[] }[] = [];

    // Sizes
    const sizes: string[] = [];
    if (desc.includes('85mm x 55mm')) sizes.push('85 x 55mm');
    if (desc.includes('A4')) sizes.push('A4');
    if (desc.includes('A5')) sizes.push('A5');
    if (desc.includes('A6')) sizes.push('A6');
    if (desc.includes('DL')) sizes.push('DL');
    if (desc.includes('A3')) sizes.push('A3');
    if (desc.includes('A2')) sizes.push('A2');
    if (sizes.length > 0) specs.push({ label: 'Sizes', items: sizes });

    // Paper
    const paper: string[] = [];
    const gsmMatches = desc.match(/\d+gsm/gi);
    if (gsmMatches) paper.push(...Array.from(new Set(gsmMatches)));
    if (desc.toLowerCase().includes('uncoated')) paper.push('Uncoated');
    if (desc.toLowerCase().includes('silk')) paper.push('Silk');
    if (paper.length > 0) specs.push({ label: 'Paper', items: paper });

    // Finishing
    const finishing: string[] = [];
    if (desc.toLowerCase().includes('matt lamination')) finishing.push('Matt');
    if (desc.toLowerCase().includes('gloss lamination')) finishing.push('Gloss');
    if (desc.toLowerCase().includes('rounded corner')) finishing.push('Rounded');
    if (finishing.length > 0) specs.push({ label: 'Finish', items: finishing });

    return specs;
  };

  const specs = parseSpecs();

  // Default print dimensions for the product (can be expanded to be product-specific)
  const getPrintDimensions = () => {
    // A5 default - 148mm x 210mm
    // In a real implementation, this would come from product data
    return { width: 148, height: 210 };
  };

  // Get clean description
  const getCleanDescription = () => {
    return product.full_description
      .split(/(?:Description|Artwork)/i)[0]
      .split('.')
      .filter((s: string) => s.trim().length > 20)
      .slice(0, 2)
      .map((s: string) => s.trim())
      .join('. ') + '.';
  };

  return (
    <>
      <PrintingFontStyles />

      <div className="min-h-screen bg-white">
        {/* Hero Section - Full width image with overlay content */}
        <section className="relative min-h-[70vh] w-full overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={imageUrl}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${printingColors.dark}f0 0%, ${printingColors.dark}90 50%, transparent 100%)`
              }}
            />
          </div>

          {/* Breadcrumb */}
          <div className="absolute top-0 left-0 right-0 z-20">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-6">
              <nav className="flex items-center gap-2 text-sm text-white/60">
                <Link to="/" className="hover:text-white transition-colors">
                  <Home className="w-4 h-4" />
                </Link>
                <ChevronRight className="w-3 h-3" />
                <Link to="/printing" className="hover:text-white transition-colors">
                  Printing
                </Link>
                <ChevronRight className="w-3 h-3" />
                <Link
                  to={`/printing/${category}`}
                  className="hover:text-white transition-colors capitalize"
                >
                  {categoryName}
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-white truncate max-w-[200px]">{product.title}</span>
              </nav>
            </div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 h-full flex items-center px-6 md:px-12 lg:px-20 py-32">
            <div className="max-w-7xl mx-auto w-full">
              <div className="max-w-2xl">
                {/* Title with scribble */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative inline-block mb-6"
                >
                  <h1 className="hearns-font text-5xl md:text-6xl lg:text-7xl text-white leading-tight">
                    {product.title}
                  </h1>
                  <img
                    src="/images/Scribble_Green.png"
                    alt=""
                    className="absolute -bottom-2 left-0 w-32 md:w-40 h-auto opacity-70"
                  />
                </motion.div>

                {/* Perfect for tagline */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="smilecake-font text-xl md:text-2xl mb-4"
                  style={{ color: printingColors.accent }}
                >
                  Perfect for...
                </motion.p>

                {/* Use cases */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex flex-wrap gap-2 mb-8"
                >
                  {useCases.map((useCase, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm text-white border border-white/20"
                    >
                      <Check className="w-4 h-4" style={{ color: printingColors.accent }} />
                      {useCase}
                    </span>
                  ))}
                </motion.div>

                {/* Quick specs pills */}
                {specs.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-wrap gap-4 mb-10"
                  >
                    {specs.map((spec, i) => (
                      <div key={i} className="text-white">
                        <span className="text-white/50 text-xs uppercase tracking-wider block mb-1">
                          {spec.label}
                        </span>
                        <span className="font-semibold">
                          {spec.items.slice(0, 3).join(' / ')}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <a
                    href="#artwork"
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-[15px] text-white font-semibold transition-all duration-300 hover:scale-[1.02]"
                    style={{ backgroundColor: printingColors.accent }}
                  >
                    <FileText className="w-5 h-5" />
                    Submit Artwork
                  </a>
                  <a
                    href={`mailto:info@outpostcustom.co.uk?subject=Price List - ${product.title}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-[15px] border-2 border-white/50 text-white font-semibold transition-all duration-300 hover:bg-white/10"
                  >
                    <Mail className="w-5 h-5" />
                    Request Price List
                  </a>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronRight className="w-6 h-6 text-white/50 rotate-90" />
          </motion.div>
        </section>

        {/* Trust Badges */}
        <section className="py-8 px-6 md:px-12 lg:px-20 bg-[#f8f8f8] border-b border-gray-200">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-3 gap-8">
              <div className="flex items-center justify-center gap-3 text-center">
                <Clock className="w-5 h-5" style={{ color: printingColors.accent }} />
                <span className="text-sm font-medium text-gray-700">4-7 Day Turnaround</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-center">
                <Sparkles className="w-5 h-5" style={{ color: printingColors.accent }} />
                <span className="text-sm font-medium text-gray-700">FREE Artwork Check</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-center">
                <Shield className="w-5 h-5" style={{ color: printingColors.accent }} />
                <span className="text-sm font-medium text-gray-700">Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </section>

        {/* About Product Section */}
        <section className="py-16 md:py-20 px-6 md:px-12 lg:px-20">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Description */}
              <div>
                <h2
                  className="hearns-font text-3xl md:text-4xl mb-6"
                  style={{ color: printingColors.dark }}
                >
                  About This Product
                </h2>
                <p className="neuzeit-light-font text-lg text-gray-600 leading-relaxed">
                  {getCleanDescription()}
                </p>

                {/* Design consultation link */}
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 mt-6 text-sm font-medium transition-colors hover:underline"
                  style={{ color: printingColors.accent }}
                >
                  <Calendar className="w-4 h-4" />
                  Book a Free Design Consultation
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Specs Card */}
              <div
                className="rounded-2xl p-6 border-2"
                style={{ borderColor: `${printingColors.accent}30`, backgroundColor: `${printingColors.accent}05` }}
              >
                <h3 className="font-bold text-lg mb-4" style={{ color: printingColors.dark }}>
                  Specifications
                </h3>
                <div className="space-y-4">
                  {specs.length > 0 ? (
                    specs.map((spec, i) => (
                      <div key={i}>
                        <span className="text-xs uppercase tracking-wider text-gray-500 block mb-2">
                          {spec.label}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {spec.items.map((item, j) => (
                            <span
                              key={j}
                              className="px-3 py-1.5 rounded-full text-sm bg-white border border-gray-200"
                              style={{ color: printingColors.dark }}
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Contact us for detailed specifications and custom options.
                    </p>
                  )}
                </div>

                {/* Request more info */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <a
                    href={`mailto:info@outpostcustom.co.uk?subject=Specifications - ${product.title}`}
                    className="text-sm font-medium flex items-center gap-1"
                    style={{ color: printingColors.accent }}
                  >
                    Need more details? Get in touch
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Artwork Submission Section */}
        <section
          id="artwork"
          className="relative py-20 md:py-28 px-6 md:px-12 lg:px-20 overflow-hidden"
          style={{ backgroundColor: printingColors.dark }}
        >
          {/* Texture overlay */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'url(/ConcreteTexture.jpg)',
              backgroundSize: 'cover',
              mixBlendMode: 'overlay',
            }}
          />

          {/* Decorative elements */}
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{ backgroundColor: printingColors.accent }}
          />

          <div className="max-w-4xl mx-auto relative z-10 text-center">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="hearns-font text-4xl md:text-5xl lg:text-6xl text-white mb-4">
                Ready to get started?
              </h2>
              <p className="smilecake-font text-xl md:text-2xl mb-3" style={{ color: printingColors.accent }}>
                We make it easy
              </p>
              <p className="neuzeit-light-font text-lg text-white/70 max-w-xl mx-auto mb-10">
                Whether you have artwork ready or need help creating something, we'll guide you through.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <button
                onClick={() => setIsSubmissionOpen(true)}
                className="group inline-flex items-center justify-center gap-3 px-8 py-5 rounded-[15px] text-white neuzeit-font text-lg font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#64a70b]/30"
                style={{ backgroundColor: printingColors.accent }}
              >
                <Upload className="w-5 h-5" />
                Submit Artwork
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href={`mailto:info@outpostcustom.co.uk?subject=Quote Request - ${product.title}`}
                className="inline-flex items-center justify-center gap-3 px-8 py-5 rounded-[15px] border-2 border-white/30 text-white neuzeit-font text-lg font-semibold transition-all duration-300 hover:bg-white/10 hover:border-white/50"
              >
                <Mail className="w-5 h-5" />
                Request Quote
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-6 md:gap-10"
            >
              {[
                { icon: Sparkles, text: 'Free artwork check' },
                { icon: Clock, text: '4-7 day turnaround' },
                { icon: Calendar, text: 'Free consultations' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-white/60">
                  <item.icon className="w-4 h-4" />
                  <span className="neuzeit-font text-sm">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Artwork Submission Modal */}
        <ArtworkSubmissionFlow
          isOpen={isSubmissionOpen}
          onClose={() => setIsSubmissionOpen(false)}
          serviceType="printing"
          productTitle={product.title}
          productSlug={slug}
          printDimensions={{ width: 148, height: 210 }}
        />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="py-16 md:py-20 px-6 md:px-12 lg:px-20 bg-[#f8f8f8]">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h3
                    className="hearns-font text-3xl md:text-4xl"
                    style={{ color: printingColors.dark }}
                  >
                    You may also like
                  </h3>
                </div>
                <Link
                  to={`/printing/${category}`}
                  className="hidden md:flex items-center gap-1 text-sm font-medium"
                  style={{ color: printingColors.accent }}
                >
                  View all in {categoryName}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct, index) => (
                  <ProductCard
                    key={relatedProduct.slug}
                    product={relatedProduct}
                    categorySlug={category || 'all'}
                    view="grid"
                    index={index}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Back navigation */}
        <section className="py-8 px-6 md:px-12 lg:px-20 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto flex flex-wrap gap-4 justify-center">
            <Link
              to={`/printing/${category}`}
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: printingColors.dark }}
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to {categoryName}
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              to="/printing"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: printingColors.accent }}
            >
              View all printing products
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default PrintingProductPage;
