import React, { useEffect, useRef } from 'react';

interface LogoCarouselProps {
  speed?: number; // pixels per second
}

// Import all logo images from public/logo-carousel
const LOGO_IMAGES = [
  '/logo-carousel/1.png',
  '/logo-carousel/2.png',
  '/logo-carousel/3.png',
  '/logo-carousel/4.png',
  '/logo-carousel/6.png',
  '/logo-carousel/7.png',
  '/logo-carousel/13.png',
  '/logo-carousel/14.png',
  '/logo-carousel/18.png'
];

const LogoCarousel: React.FC<LogoCarouselProps> = ({ speed = 30 }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    let scrollPosition = 0;

    const animate = () => {
      if (!scrollContainer) return;

      // Calculate scroll speed (pixels per frame at 60fps)
      const pixelsPerFrame = speed / 60;

      scrollPosition += pixelsPerFrame;

      // Reset scroll when we've scrolled through one set of logos
      const scrollWidth = scrollContainer.scrollWidth / 2;
      if (scrollPosition >= scrollWidth) {
        scrollPosition = 0;
      }

      scrollContainer.scrollLeft = scrollPosition;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [speed]);

  return (
    <section className="w-full py-3 bg-[#78BE20] overflow-hidden">
      <div className="w-full">
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-hidden"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {/* First set of logos */}
          {LOGO_IMAGES.map((logo, index) => (
            <div
              key={`logo-1-${index}`}
              className="flex-shrink-0 flex items-center justify-center"
              style={{ width: '100px', height: '40px' }}
            >
              <img
                src={logo}
                alt={`Brand logo ${index + 1}`}
                className="max-w-full max-h-full object-contain filter brightness-0 invert opacity-90"
                loading="lazy"
              />
            </div>
          ))}

          {/* Duplicate set for seamless loop */}
          {LOGO_IMAGES.map((logo, index) => (
            <div
              key={`logo-2-${index}`}
              className="flex-shrink-0 flex items-center justify-center"
              style={{ width: '100px', height: '40px' }}
            >
              <img
                src={logo}
                alt={`Brand logo ${index + 1}`}
                className="max-w-full max-h-full object-contain filter brightness-0 invert opacity-90"
                loading="lazy"
              />
            </div>
          ))}

          {/* Third set for extra smoothness */}
          {LOGO_IMAGES.map((logo, index) => (
            <div
              key={`logo-3-${index}`}
              className="flex-shrink-0 flex items-center justify-center"
              style={{ width: '100px', height: '40px' }}
            >
              <img
                src={logo}
                alt={`Brand logo ${index + 1}`}
                className="max-w-full max-h-full object-contain filter brightness-0 invert opacity-90"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .flex-shrink-0 {
            width: 80px !important;
            height: 32px !important;
          }
        }
      ` }} />
    </section>
  );
};

export default LogoCarousel;
