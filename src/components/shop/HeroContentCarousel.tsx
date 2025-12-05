import React, { useState, useEffect } from 'react';

interface ContentSlide {
  title: string;
  subtitle: string;
}

const CONTENT_SLIDES: ContentSlide[] = [
  {
    title: "Tailored Designs for Every Occasion",
    subtitle: "Celebrations • Sports Trips • Leavers • Personalized Gifts"
  },
  {
    title: "Professional Branding Solutions",
    subtitle: "Uniforms • Corporate Wear • Custom Logos • In-House Design"
  },
  {
    title: "Quality That Doesn't Break the Bank",
    subtitle: "No Minimum Order • Bulk Discounts • Premium Vinyl Transfer"
  }
];

const HeroContentCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CONTENT_SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

      <div className="w-full max-w-[900px] mx-auto px-6 relative z-10">
        {/* Main Content Slide */}
        <div className="relative text-center">
          {CONTENT_SLIDES.map((slide, index) => (
            <div
              key={index}
              className={`transition-all duration-1000 ${
                index === currentIndex
                  ? 'opacity-100'
                  : 'opacity-0 absolute inset-0 pointer-events-none'
              }`}
            >
              <h1
                className="text-5xl md:text-7xl uppercase text-white mb-6 drop-shadow-2xl"
                style={{
                  fontFamily: "'Hearns', sans-serif",
                  lineHeight: '1.1',
                  letterSpacing: '-0.02em',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale'
                }}
              >
                {slide.title}
              </h1>
              <div className="inline-block">
                <p
                  className="text-xl md:text-2xl text-white font-medium tracking-wide px-6 py-3 bg-[#64a70b] rounded-[5px]"
                  style={{ fontFamily: "'Neuzeit Grotesk', sans-serif" }}
                >
                  {slide.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Dot Indicators */}
        <div className="flex items-center justify-center gap-3 mt-12 pointer-events-auto">
          {CONTENT_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-12 h-3 bg-[#78BE20]'
                  : 'w-3 h-3 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroContentCarousel;
