import React from 'react';

interface IconProps {
  className?: string;
}

export const TopsIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6.5 3L2 7v5l4-1v10h12V11l4 1V7l-4.5-4H14l-2 3-2-3H6.5z" />
  </svg>
);

export const OuterwearIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6.5 3L2 7v5l4-1v10h12V11l4 1V7l-4.5-4H14l-2 3-2-3H6.5z" />
    <path d="M9 13v4M12 13v4M15 13v4" opacity="0.5" />
  </svg>
);

export const BottomsIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 3h12v5l-1 13h-4l-1-10-1 10H7L6 8V3z" />
  </svg>
);

export const WorkwearIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 3h14l1 5v13H4V8l1-5z" />
    <path d="M4 8h16" />
    <path d="M9 3v5M15 3v5" />
    <rect x="8" y="12" width="8" height="5" rx="0.5" />
  </svg>
);

export const HeadwearIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 15c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    <path d="M2 15h20v2c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-2z" />
  </svg>
);

export const FootwearIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 17h18c1.1 0 2-.9 2-2v-1c0-2.2-2-4-6-4l-2-5H6v7c-2 0-4 2-4 4v1h1z" />
    <path d="M8 17v-3" />
  </svg>
);

export const BagsIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="7" width="18" height="14" rx="2" />
    <path d="M8 7V5c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v2" />
    <path d="M3 11h18" />
  </svg>
);

export const AccessoriesIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 4v2M12 18v2M4 12h2M18 12h2" />
  </svg>
);

export const UnderwearIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 5h14v5c0 2-1 4-3 5l-1 6h-6l-1-6c-2-1-3-3-3-5V5z" />
    <path d="M12 10v6" />
  </svg>
);

export const HomeGiftsIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="8" width="18" height="13" rx="1" />
    <path d="M12 8v13" />
    <path d="M3 12h18" />
    <path d="M7.5 8C6 6 6.5 4 8 3.5S11 4 12 8c1-4 2.5-5 4-4.5S18 6 16.5 8" />
  </svg>
);
