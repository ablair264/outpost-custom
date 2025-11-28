import React from 'react';
import ShopHero from '../components/shop/ShopHero';
import ShopProductCarousel from '../components/shop/ShopProductCarousel';
import ShopBentoGrid from '../components/shop/ShopBentoGrid';
import HowToOrder from '../components/shop/HowToOrder';
import FAQ from '../components/shop/FAQ';

const ShopFrontPage = () => {
  return (
    <div className="min-h-screen" style={{ background: '#ffffff' }}>
      {/* Hero Section with GridMotion */}
      <ShopHero />

      {/* Product Carousel */}
      <ShopProductCarousel />

      {/* Bento Grid Section - What We Do */}
      <ShopBentoGrid />

      {/* How to Order Process */}
      <HowToOrder />

      {/* FAQ Section */}
      <FAQ />
    </div>
  );
};

export default ShopFrontPage;
