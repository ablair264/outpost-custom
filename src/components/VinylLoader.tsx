import React, { useState, useEffect } from 'react';

interface VinylLoaderProps {
  size?: number;
  className?: string;
}

const VinylLoader: React.FC<VinylLoaderProps> = ({
  size = 200,
  className = ''
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsAnimating(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`vinyl-loader ${className}`} style={{ width: size, height: size * 0.64 }}>
      {/* Vinyl Application Container */}
      <div className="vinyl-container">
        {/* The SVG Logo with Progressive Reveal */}
        <div className={`vinyl-decal ${isAnimating ? 'animating' : ''}`}>
          <img
            src="/logo-spinner.svg"
            alt="Loading"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>

        {/* Squeegee Shine Effect */}
        <div className={`squeegee-shine ${isAnimating ? 'animating' : ''}`} />

        {/* Air Bubbles Effect */}
        <div className="air-bubbles">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bubble"
              style={{
                left: `${10 + i * 12}%`,
                top: `${25 + (i % 3) * 20}%`,
                animationDelay: `${0.5 + i * 0.12}s`,
                width: `${6 + (i % 3) * 2}px`,
                height: `${6 + (i % 3) * 2}px`
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        .vinyl-loader {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .vinyl-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: transparent;
        }

        /* The Decal with Progressive Reveal */
        .vinyl-decal {
          position: relative;
          width: 100%;
          height: 100%;
          opacity: 0.3;
          filter: blur(1px);
          clip-path: inset(0 100% 0 0);
          transition: opacity 0.3s ease, filter 0.3s ease;
        }

        .vinyl-decal.animating {
          animation:
            vinylReveal 2.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s forwards,
            finalCrisp 0.4s ease-out 2.5s forwards;
        }

        @keyframes vinylReveal {
          0% {
            clip-path: inset(0 100% 0 0);
            opacity: 0.3;
          }
          5% {
            opacity: 0.5;
          }
          100% {
            clip-path: inset(0 0 0 0);
            opacity: 0.95;
          }
        }

        @keyframes finalCrisp {
          to {
            opacity: 1;
            filter: blur(0px);
          }
        }

        /* Squeegee Shine Effect */
        .squeegee-shine {
          position: absolute;
          top: 0;
          left: -15%;
          width: 15%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.4) 40%,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(255, 255, 255, 0.4) 60%,
            transparent 100%
          );
          pointer-events: none;
          z-index: 3;
          filter: blur(8px);
          opacity: 0;
        }

        .squeegee-shine.animating {
          animation: shineMove 2.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s forwards;
        }

        @keyframes shineMove {
          0% {
            left: -15%;
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }

        /* Air Bubbles */
        .air-bubbles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
        }

        .bubble {
          position: absolute;
          background: radial-gradient(
            circle at 30% 30%,
            rgba(255, 255, 255, 0.9),
            rgba(200, 200, 200, 0.5),
            rgba(150, 150, 150, 0.2)
          );
          border-radius: 50%;
          opacity: 0;
          box-shadow:
            inset -2px -2px 4px rgba(0, 0, 0, 0.2),
            0 2px 4px rgba(0, 0, 0, 0.1);
          animation: bubblePop 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes bubblePop {
          0% {
            opacity: 0;
            transform: scale(1.8);
          }
          40% {
            opacity: 0.7;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.2) translateY(-10px);
          }
        }


        /* Edge Lift Effect */
        .vinyl-decal::before {
          content: '';
          position: absolute;
          top: -2px;
          right: -2px;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.15) 100%);
          opacity: 0;
          animation: edgeLift 0.5s ease-out 2.3s forwards;
          pointer-events: none;
        }

        @keyframes edgeLift {
          0% {
            opacity: 0;
            transform: scale(0.8) translate(2px, 2px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translate(0, 0);
          }
        }

        /* Final Glossy Finish */
        .vinyl-decal::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent 30%,
            rgba(255, 255, 255, 0.15) 48%,
            rgba(255, 255, 255, 0.25) 50%,
            rgba(255, 255, 255, 0.15) 52%,
            transparent 70%
          );
          opacity: 0;
          animation: finalGloss 1.2s ease-out 2.7s forwards;
          pointer-events: none;
        }

        @keyframes finalGloss {
          0% {
            opacity: 0;
            transform: translateX(-30%) translateY(-30%) rotate(45deg);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateX(30%) translateY(30%) rotate(45deg);
          }
        }

        /* Continuous subtle pulse while loading */
        @keyframes gentlePulse {
          0%, 100% {
            transform: scale(1);
            filter: blur(0px);
          }
          50% {
            transform: scale(1.01);
            filter: blur(0px);
          }
        }

        .vinyl-decal.animating {
          animation:
            vinylReveal 2.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s forwards,
            finalCrisp 0.4s ease-out 2.5s forwards,
            gentlePulse 3s ease-in-out 3.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default VinylLoader;
