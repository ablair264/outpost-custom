import React from 'react';
import CategoryNavigationBar from '../components/shop/CategoryNavigationBar';
import AdvertisementCarousel from '../components/shop/AdvertisementCarousel';
import LogoCarousel from '../components/shop/LogoCarousel';
import ImageAccordionDB from '../components/shop/ImageAccordionDB';
import ShopProductCarousel from '../components/shop/ShopProductCarousel';
import ShopBentoGrid from '../components/shop/ShopBentoGrid';
import FAQ from '../components/shop/FAQ';
import SlimGridMotionDB from '../components/SlimGridMotionDB';
import HeroContentCarousel from '../components/shop/HeroContentCarousel';

const NewShopFrontPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Category Navigation Bar */}
      <CategoryNavigationBar />

      {/* SlimGridMotion Hero with Content Carousel Overlay */}
      <div className="relative w-full h-[500px] md:h-[600px] bg-black overflow-hidden">
        <SlimGridMotionDB gradientColor="rgba(120, 190, 32, 0.15)" />
        <HeroContentCarousel />
      </div>

      {/* Image Accordion Section */}
      <ImageAccordionDB />

      {/* Special Offers - Product Carousel */}
      <ShopProductCarousel />

      {/* Logo Carousel */}
      <LogoCarousel speed={50} />

      {/* Advertisement Carousel */}
      <AdvertisementCarousel />

      {/* How It Works & FAQ Sections */}
      <ShopBentoGrid />
      <FAQ />
    </div>
  );
};

export default NewShopFrontPage;
