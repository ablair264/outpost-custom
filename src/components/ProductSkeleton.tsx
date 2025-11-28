import React from 'react';
import './ProductSkeleton.css';

const ProductSkeleton: React.FC = () => {
  return (
    <div className="product-skeleton">
      <div className="skeleton-image">
        <div className="skeleton-shimmer"></div>
      </div>
      <div className="skeleton-content">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-line skeleton-brand"></div>
        <div className="skeleton-line skeleton-price"></div>
        <div className="skeleton-swatches">
          <div className="skeleton-swatch"></div>
          <div className="skeleton-swatch"></div>
          <div className="skeleton-swatch"></div>
          <div className="skeleton-swatch"></div>
        </div>
        <div className="skeleton-line skeleton-meta"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;