import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

// Theme colors - Brand palette (matching ClothingBrowser)
const colors = {
  accent: '#64a70b',
  text: '#333333',
  dark: '#183028',
  light: '#c1c6c8',
  secondary: '#1e3a2f',
};

const fonts = {
  heading: "'Hearns', serif",
  subheading: "'Embossing Tape 3', sans-serif",
  body: "'Neuzeit Grotesk', sans-serif",
};

export interface SearchProduct {
  id: string;
  sku?: string;
  title: string;
  supplier_name?: string;
  category?: string;
  base_price?: number;
  max_price?: number;
  primary_image_url?: string;
  color_count?: number;
  size_range?: string;
}

interface SmartSearchProductCardProps {
  product: SearchProduct;
  onClose?: () => void;
}

const SmartSearchProductCard: React.FC<SmartSearchProductCardProps> = ({
  product,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClose) onClose();
    navigate(`/product/${product.sku || product.id}`);
  };

  const formatPrice = (price?: number) => {
    if (!price) return '';
    return `$${price.toFixed(2)}`;
  };

  const getPriceDisplay = () => {
    if (!product.base_price) return 'Price on request';
    if (product.max_price && product.max_price !== product.base_price) {
      return `${formatPrice(product.base_price)} - ${formatPrice(product.max_price)}`;
    }
    return formatPrice(product.base_price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
      className="cursor-pointer group"
      style={{
        backgroundColor: colors.secondary,
        borderRadius: '12px',
        overflow: 'hidden',
        border: `1px solid rgba(255, 255, 255, 0.08)`,
      }}
    >
      {/* Product Image */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: '1 / 1' }}
      >
        {product.primary_image_url ? (
          <img
            src={product.primary_image_url}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
          >
            <span style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '12px' }}>
              No image
            </span>
          </div>
        )}

        {/* Color count badge */}
        {product.color_count && product.color_count > 1 && (
          <div
            className="absolute bottom-2 right-2 px-2 py-1 rounded-full text-xs"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              fontFamily: fonts.body,
            }}
          >
            {product.color_count} colors
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        {/* Brand */}
        {product.supplier_name && (
          <p
            className="text-xs uppercase tracking-wider mb-1 truncate"
            style={{
              color: colors.accent,
              fontFamily: fonts.subheading,
              letterSpacing: '0.1em',
            }}
          >
            {product.supplier_name}
          </p>
        )}

        {/* Title */}
        <h4
          className="text-sm font-medium mb-1 line-clamp-2"
          style={{
            color: 'white',
            fontFamily: fonts.body,
            lineHeight: 1.3,
          }}
        >
          {product.title}
        </h4>

        {/* Category */}
        {product.category && (
          <p
            className="text-xs mb-2 truncate"
            style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontFamily: fonts.body,
            }}
          >
            {product.category}
          </p>
        )}

        {/* Price */}
        <p
          className="text-sm font-semibold"
          style={{
            color: 'white',
            fontFamily: fonts.body,
          }}
        >
          {getPriceDisplay()}
        </p>
      </div>
    </motion.div>
  );
};

export default SmartSearchProductCard;
