import React from 'react';
import ShopHero from '../components/shop/ShopHero';
import ShopProductCarousel from '../components/shop/ShopProductCarousel';
import ShopBentoGrid from '../components/shop/ShopBentoGrid';
import FAQ from '../components/shop/FAQ';

const ShopFrontPage = () => {
  return (
    <div className="min-h-screen" style={{ background: '#ffffff' }}>
      {/* Hero Section with GridMotion */}
      <section>
        <ShopHero />
      </section>

      {/* Product Carousel */}
      <section id="special-offers">
        <ShopProductCarousel />
      </section>

      {/* Categories + How It Works */}
      <section id="how-to-order">
        <ShopBentoGrid />
      </section>

      {/* FAQ Section */}
      <section id="faq">
        <FAQ />
      </section>
    </div>
  );
};

export default ShopFrontPage;
