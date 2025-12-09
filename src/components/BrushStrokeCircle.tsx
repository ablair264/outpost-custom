import React, { useEffect, useRef, useState } from 'react';

interface BrushStrokeCircleProps {
  children: React.ReactNode;
  delay?: number;
  size?: number;
  strokeColor?: string;
  className?: string;
  /** Progress percentage (0-100) - determines how much of the circle is drawn */
  progress?: number;
}

/**
 * An animated brush stroke circle (Enso-style) that draws itself on scroll into view.
 * Creates an organic, hand-painted aesthetic with varying stroke thickness.
 * The progress prop controls how much of the circle is drawn (25%, 50%, 75%, 100%).
 */
const BrushStrokeCircle: React.FC<BrushStrokeCircleProps> = ({
  children,
  delay = 0,
  size = 160,
  strokeColor = '#383349',
  className = '',
  progress = 100,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const circleRef = useRef<HTMLDivElement>(null);

  // Total path length for the brush stroke
  const pathLength = 500;

  // Calculate the target dash offset based on progress
  // 0% progress = full offset (500), 100% progress = no offset (0)
  const targetOffset = pathLength * (1 - progress / 100);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setTimeout(() => {
            setIsVisible(true);
            setHasAnimated(true);
          }, delay);
        }
      },
      { threshold: 0.3 }
    );

    if (circleRef.current) {
      observer.observe(circleRef.current);
    }

    return () => observer.disconnect();
  }, [delay, hasAnimated]);

  // SVG path that creates an organic brush stroke circle
  // The path creates varying thickness through multiple overlapping strokes
  const brushPath = `
    M 80 8
    C 120 8, 148 28, 152 70
    C 156 112, 136 148, 95 154
    C 54 160, 16 138, 10 95
    C 4 52, 28 16, 65 10
    C 75 8, 78 8, 80 8
  `;

  // Secondary path for the "ink splatter" effect at the start
  const inkStartPath = `
    M 78 6
    C 82 4, 86 5, 88 8
    C 90 11, 87 14, 83 13
    C 79 12, 76 9, 78 6
  `;

  // Generate a unique ID for this instance's gradient
  const uniqueId = `brush-${delay}-${progress}`;

  return (
    <div
      ref={circleRef}
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Main brush stroke SVG */}
      <svg
        viewBox="0 0 160 160"
        fill="none"
        className="absolute inset-0 w-full h-full"
        style={{
          filter: `url(#brush-texture-${uniqueId})`,
        }}
      >
        <defs>
          {/* Filter for organic brush texture */}
          <filter id={`brush-texture-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="2"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Gradient for depth variation */}
          <linearGradient id={`brush-gradient-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.9" />
            <stop offset="50%" stopColor={strokeColor} stopOpacity="1" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Background track circle - shows the full path faintly */}
        <path
          d={brushPath}
          stroke={strokeColor}
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.08"
        />

        {/* Main brush stroke - thick primary path */}
        <path
          d={brushPath}
          stroke={`url(#brush-gradient-${uniqueId})`}
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{
            strokeDasharray: pathLength,
            strokeDashoffset: isVisible ? targetOffset : pathLength,
            transition: `stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)`,
          }}
        />

        {/* Secondary stroke for thickness variation */}
        <path
          d={brushPath}
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.5"
          style={{
            strokeDasharray: pathLength,
            strokeDashoffset: isVisible ? targetOffset : pathLength,
            transition: `stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)`,
            transitionDelay: '0.1s',
          }}
        />

        {/* Ink start blob - only show when animation begins */}
        <path
          d={inkStartPath}
          fill={strokeColor}
          opacity={isVisible ? 0.8 : 0}
          style={{
            transition: 'opacity 0.3s ease',
            transitionDelay: '0.2s',
          }}
        />

        {/* Progress endpoint indicator - a small dot at the end of the stroke */}
        {progress < 100 && (
          <circle
            cx="80"
            cy="15"
            r="4"
            fill={strokeColor}
            opacity={isVisible ? 0.6 : 0}
            style={{
              transition: 'opacity 0.4s ease',
              transitionDelay: '1s',
              transform: `rotate(${-90 + (progress / 100) * 360}deg)`,
              transformOrigin: '80px 80px',
            }}
          />
        )}
      </svg>

      {/* Content container - centered within the circle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="transform transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'scale(1)' : 'scale(0.8)',
            transitionDelay: '0.4s',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default BrushStrokeCircle;
