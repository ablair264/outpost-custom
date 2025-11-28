import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import GridMotion from '../GridMotion';
import { Button } from '../ui/button';

const heroSlides = [
  {
    layout: 'centered',
    heading: 'QUALITY GARMENTS',
    subheading: 'EPIC DESIGNS',
    tagline: 'Run by designers, made for you',
    badge: 'Independent UK Printer',
    cta1: 'View All Garments',
    cta2: 'Get a Quote',
  },
  {
    layout: 'product',
    heading: 'PERSONALISED',
    subheading: 'PRINTING',
    tagline: 'Hoodies, T-shirts, Uniforms & More',
    description: 'High quality vinyl transfer process - low setup costs, fantastic finish. Based in Kidderminster, UK.',
    cta1: 'Browse Products',
    cta2: 'Contact Us',
  },
  {
    layout: 'promo',
    heading: 'NO MINIMUM',
    subheading: 'ORDER',
    tagline: 'Discounts available for larger orders',
    badge: 'BULK DISCOUNTS',
    cta1: 'Get Started',
    cta2: 'View Catalogue',
  },
];

const ShopHero = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const headingRef = useRef<HTMLDivElement>(null);
  const subheadingRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Grid items - you can replace these with actual product images
  const baseImages = [
    '/hero-images/beanie1.jpg',
    '/hero-images/gillet1.jpg',
    '/hero-images/hoodie1.jpg',
    '/hero-images/hoodie2.jpg',
    '/hero-images/jacket1.jpg',
  ];

  const gridItems = Array.from({ length: 28 }, (_, index) => {
    return baseImages[index % baseImages.length];
  });

  // Initial animation on mount
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      headingRef.current,
      { opacity: 0, y: 50, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, delay: 0.5 }
    )
      .fromTo(
        subheadingRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1 },
        '-=0.6'
      )
      .fromTo(
        taglineRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1 },
        '-=0.6'
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.4'
      );
  }, []);

  // Cycling animation
  useEffect(() => {
    const interval = setInterval(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        },
      });

      tl.to([headingRef.current, subheadingRef.current, taglineRef.current, ctaRef.current], {
        opacity: 0,
        y: -30,
        duration: 0.6,
        ease: 'power2.in',
        stagger: 0.1,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Fade in when slide changes
  useEffect(() => {
    if (currentSlide === 0) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      headingRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8 }
    )
      .fromTo(
        subheadingRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.6'
      )
      .fromTo(
        taglineRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.6'
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.6'
      );
  }, [currentSlide]);

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section className="relative h-[75vh] w-full overflow-hidden" style={{ background: '#000000' }}>
      {/* GridMotion Background */}
      <div className="absolute inset-0">
        <GridMotion items={gridItems} gradientColor="#1a1a1a" />
      </div>

      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-black/60 z-[5]" />

      {/* Top Blur Overlay for Navbar Readability */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/40 via-black/20 to-transparent backdrop-blur-sm z-[5]" />

      {/* Overlay Content - Different Layouts */}
      <div className="relative z-10 h-full flex items-center px-8 md:px-16 lg:px-24">
        {/* Layout 1: Centered */}
        {currentSlideData.layout === 'centered' && (
          <div className="max-w-5xl mx-auto w-full text-center">
            {currentSlideData.badge && (
              <div ref={headingRef} className="mb-6">
                <span className="inline-block px-6 py-2 rounded-full text-white text-sm font-bold uppercase tracking-wider" style={{ background: '#6da71d' }}>
                  {currentSlideData.badge}
                </span>
              </div>
            )}

            <div ref={subheadingRef} className="space-y-4 mb-8">
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-white">
                {currentSlideData.heading}
              </h1>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight" style={{ color: '#6da71d' }}>
                {currentSlideData.subheading}
              </h2>
            </div>

            <p ref={taglineRef} className="text-xl md:text-2xl text-white/80 font-light mb-10">
              {currentSlideData.tagline}
            </p>

            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="rounded-full px-12 py-6 text-black hover:bg-white/90 transition-all duration-300 font-semibold text-lg"
                style={{ background: '#6da71d' }}
                onClick={() => window.location.href = '/products'}
              >
                {currentSlideData.cta1}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-12 py-6 border-2 border-white bg-transparent text-white hover:bg-white/10 transition-all duration-300 font-semibold text-lg"
              >
                {currentSlideData.cta2}
              </Button>
            </div>
          </div>
        )}

        {/* Layout 2: Product */}
        {currentSlideData.layout === 'product' && (
          <div className="max-w-7xl mx-auto w-full">
            <div className="space-y-6">
              <div ref={headingRef} className="space-y-3">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
                  {currentSlideData.heading}
                </h1>
                <div className="h-px w-24" style={{ background: '#6da71d' }} />
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-widest" style={{ color: '#6da71d' }}>
                  {currentSlideData.subheading}
                </h2>
              </div>

              <p ref={subheadingRef} className="text-2xl md:text-3xl text-white font-semibold">
                {currentSlideData.tagline}
              </p>

              <p ref={taglineRef} className="text-base md:text-lg text-white/80 font-light leading-relaxed max-w-2xl">
                {currentSlideData.description}
              </p>

              <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="rounded-full px-10 text-black transition-all duration-300 font-medium"
                  style={{ background: '#6da71d' }}
                  onClick={() => window.location.href = '/products'}
                >
                  {currentSlideData.cta1}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-10 border-white bg-transparent text-white hover:bg-white/10 transition-all duration-300 font-medium"
                >
                  {currentSlideData.cta2}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Layout 3: Promo */}
        {currentSlideData.layout === 'promo' && (
          <div className="max-w-4xl mx-auto w-full text-center">
            <div ref={headingRef} className="mb-8">
              <div className="inline-block relative">
                <div className="absolute inset-0 rounded-full blur-2xl opacity-50" style={{ background: '#6da71d' }} />
                <div className="relative text-white px-12 py-6 rounded-full" style={{ background: '#6da71d' }}>
                  <span className="text-6xl md:text-7xl font-bold">{currentSlideData.badge}</span>
                </div>
              </div>
            </div>

            <div ref={subheadingRef} className="space-y-4 mb-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
                {currentSlideData.heading}
              </h1>
              <h2 className="text-3xl md:text-4xl font-light text-white/90">
                {currentSlideData.subheading}
              </h2>
            </div>

            <p ref={taglineRef} className="text-lg md:text-xl text-white/80 font-light mb-10">
              {currentSlideData.tagline}
            </p>

            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="rounded-full px-12 py-6 text-white transition-all duration-300 font-semibold text-lg shadow-lg"
                style={{ background: '#6da71d', boxShadow: '0 10px 40px rgba(109, 167, 29, 0.3)' }}
                onClick={() => window.location.href = '/products'}
              >
                {currentSlideData.cta1}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-12 py-6 border-2 border-white bg-transparent text-white hover:bg-white/10 transition-all duration-300 font-semibold text-lg"
              >
                {currentSlideData.cta2}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-8'
                : 'w-1.5 bg-white/40 hover:bg-white/60'
            }`}
            style={index === currentSlide ? { background: '#6da71d' } : {}}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Bottom Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-black/40 z-[6]" />
    </section>
  );
};

export default ShopHero;
