import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchAdvertisementSlides, AdSlide } from '../../utils/supabase';

interface AdvertisementCarouselProps {
  autoPlayInterval?: number;
}

const AdvertisementCarousel: React.FC<AdvertisementCarouselProps> = ({
  autoPlayInterval = 5000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [slides, setSlides] = useState<AdSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSlides = async () => {
      try {
        const data = await fetchAdvertisementSlides();
        setSlides(data);
      } catch (error) {
        console.error('Error loading advertisement slides:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSlides();
  }, []);

  const sortedSlides = [...slides].sort((a, b) => a.order_position - b.order_position);

  useEffect(() => {
    if (!isHovered && sortedSlides.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % sortedSlides.length);
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [isHovered, sortedSlides.length, autoPlayInterval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? sortedSlides.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      (prev + 1) % sortedSlides.length
    );
  };

  const handleSlideClick = () => {
    const currentSlide = sortedSlides[currentIndex];
    if (currentSlide.link_url) {
      window.location.href = currentSlide.link_url;
    }
  };

  if (loading) {
    return (
      <div className="relative w-full h-[350px] md:h-[420px] bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!sortedSlides.length) {
    return null;
  }

  const getPrevIndex = () => (currentIndex === 0 ? sortedSlides.length - 1 : currentIndex - 1);
  const getNextIndex = () => (currentIndex + 1) % sortedSlides.length;

  return (
    <div
      className="relative w-full py-6 md:py-8 bg-[#0a0a0a] overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides Container */}
      <div className="relative w-full max-w-[1200px] mx-auto px-4">
        <div className="relative flex items-center justify-center gap-3">

          {/* Previous Slide Preview (Blurred) */}
          {sortedSlides.length > 1 && (
            <div className="hidden lg:block w-1/6 opacity-40 hover:opacity-60 transition-opacity cursor-pointer" onClick={goToPrevious}>
              <div className="relative aspect-[3/1] rounded-lg overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center blur-sm scale-95"
                  style={{
                    backgroundImage: `url(${sortedSlides[getPrevIndex()].image_url})`
                  }}
                />
              </div>
            </div>
          )}

          {/* Main Active Slide */}
          <div className="w-full lg:w-2/3 relative">
            <div className="relative aspect-[3/1] rounded-lg overflow-hidden shadow-2xl">
              {sortedSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    index === currentIndex
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-105'
                  }`}
                  style={{
                    pointerEvents: index === currentIndex ? 'auto' : 'none'
                  }}
                >
                  <div
                    className={`w-full h-full bg-cover bg-center ${
                      slide.link_url ? 'cursor-pointer' : ''
                    }`}
                    style={{
                      backgroundImage: `url(${slide.image_url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                    onClick={handleSlideClick}
                    role={slide.link_url ? 'button' : undefined}
                    aria-label={slide.alt_text || `Slide ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Next Slide Preview (Blurred) */}
          {sortedSlides.length > 1 && (
            <div className="hidden lg:block w-1/6 opacity-40 hover:opacity-60 transition-opacity cursor-pointer" onClick={goToNext}>
              <div className="relative aspect-[3/1] rounded-lg overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center blur-sm scale-95"
                  style={{
                    backgroundImage: `url(${sortedSlides[getNextIndex()].image_url})`
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      {sortedSlides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/50 hover:bg-[#78BE20] backdrop-blur-sm flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/50 hover:bg-[#78BE20] backdrop-blur-sm flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {sortedSlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {sortedSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-8 h-2 bg-[#78BE20]'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      {sortedSlides.length > 1 && (
        <div className="absolute top-6 right-6 z-10 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <span className="text-white text-sm font-medium">
            {currentIndex + 1} / {sortedSlides.length}
          </span>
        </div>
      )}
    </div>
  );
};

export default AdvertisementCarousel;
