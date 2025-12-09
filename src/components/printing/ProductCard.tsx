import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { printingColors } from '../../lib/printing-theme';
import { PrintingProduct, extractKeySpecs } from '../../lib/printing-products';

interface ProductCardProps {
  product: PrintingProduct;
  categorySlug: string;
  view: 'grid' | 'list';
  index?: number;
}

// Animation variants for staggered entry
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.05,
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  categorySlug,
  view,
  index = 0,
}) => {
  const specs = extractKeySpecs(product);
  const productUrl = `/printing/${categorySlug}/${product.slug}`;
  const imageUrl = product.images[0] || '/printing/placeholder.jpg';

  // Extract a short tagline from the description
  const tagline = product.short_description
    .split('.')[0]
    .replace(/From \d+ .+$/, '')
    .trim()
    .slice(0, 80);

  if (view === 'list') {
    return (
      <motion.div
        custom={index}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        layout
      >
        <Link
          to={productUrl}
          className="group flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-5 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200"
        >
          {/* Image */}
          <div className="w-full sm:w-40 md:w-48 h-40 sm:h-32 md:h-36 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
            <img
              src={imageUrl}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div>
              <h3
                className="font-bold text-lg md:text-xl mb-2 group-hover:text-opacity-80 transition-colors line-clamp-1"
                style={{ color: printingColors.dark }}
              >
                {product.title}
              </h3>
              <p className="neuzeit-light-font text-gray-600 text-sm md:text-base leading-relaxed line-clamp-2 mb-3">
                {tagline}
              </p>

              {/* Spec badges */}
              <div className="flex flex-wrap gap-2">
                {specs.slice(0, 3).map((spec, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${printingColors.accent}15`,
                      color: printingColors.dark,
                    }}
                  >
                    {spec.value}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center mt-4 sm:mt-0">
              <span
                className="text-sm font-semibold flex items-center gap-1 transition-colors"
                style={{ color: printingColors.accent }}
              >
                View Details
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      layout
    >
      <Link
        to={productUrl}
        className="group flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200"
      >
        {/* Image */}
        <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
            <span className="text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
              View Details
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>

          {/* Quick spec badge */}
          {specs[0] && (
            <div
              className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: printingColors.accent }}
            >
              {specs[0].value}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col">
          <h3
            className="font-bold text-base md:text-lg mb-2 group-hover:text-opacity-80 transition-colors line-clamp-2"
            style={{ color: printingColors.dark }}
          >
            {product.title}
          </h3>

          <p className="neuzeit-light-font text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1">
            {tagline}
          </p>

          {/* Additional specs */}
          {specs.length > 1 && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
              {specs.slice(1, 3).map((spec, i) => (
                <span
                  key={i}
                  className="text-xs text-gray-500"
                >
                  {spec.value}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
