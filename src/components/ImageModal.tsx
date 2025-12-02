import React, { useState, useEffect, useRef, MouseEvent } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  alt?: string;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  alt = 'Product image'
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsAnimatingIn(true);
      document.body.style.overflow = 'hidden';

      // Trigger animation after mount
      setTimeout(() => setIsAnimatingIn(false), 50);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
      style={{
        animation: isAnimatingIn ? 'none' : 'modalFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/95 backdrop-blur-xl"
        style={{
          animation: isAnimatingIn ? 'none' : 'backdropFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 text-white group"
        aria-label="Close modal"
        style={{
          animation: isAnimatingIn ? 'none' : 'fadeInScale 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s backwards',
        }}
      >
        <X className="w-6 h-6 transition-transform group-hover:rotate-90 duration-300" />
      </button>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-6 z-10 p-4 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 text-white hover:scale-110"
            aria-label="Previous image"
            style={{
              animation: isAnimatingIn ? 'none' : 'fadeInSlideRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.15s backwards',
            }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-6 z-10 p-4 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 text-white hover:scale-110"
            aria-label="Next image"
            style={{
              animation: isAnimatingIn ? 'none' : 'fadeInSlideLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.15s backwards',
            }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Image Container */}
      <div
        className="relative max-w-7xl max-h-[90vh] w-full mx-6"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: isAnimatingIn ? 'none' : 'imageScaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          className="relative overflow-hidden rounded-2xl bg-black/20 cursor-zoom-in"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            cursor: isZoomed ? 'zoom-out' : 'zoom-in',
          }}
        >
          <img
            ref={imageRef}
            src={images[currentIndex]}
            alt={`${alt} ${currentIndex + 1}`}
            className="w-full h-full object-contain max-h-[90vh] select-none"
            style={{
              transform: isZoomed ? 'scale(2)' : 'scale(1)',
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            draggable={false}
            onError={(e) => {
              e.currentTarget.src = `https://via.placeholder.com/1920x1080/1a1a1a/6da71d?text=Image`;
            }}
          />
        </div>

        {/* Image Counter */}
        {images.length > 1 && (
          <div
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium"
            style={{
              animation: isAnimatingIn ? 'none' : 'fadeInScale 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s backwards',
            }}
          >
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 px-4"
          style={{
            animation: isAnimatingIn ? 'none' : 'fadeInSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.25s backwards',
          }}
        >
          {images.map((image, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
                setIsZoomed(false);
              }}
              className={`w-16 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                currentIndex === index
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-black/50 scale-110'
                  : 'opacity-60 hover:opacity-100 hover:scale-105'
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://via.placeholder.com/100x100/1a1a1a/6da71d?text=${index + 1}`;
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes backdropFadeIn {
          from {
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          to {
            opacity: 1;
            backdrop-filter: blur(24px);
          }
        }

        @keyframes imageScaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeInSlideRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInSlideLeft {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInSlideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ImageModal;
