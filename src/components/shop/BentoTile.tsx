import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface BentoTileData {
  id: string;
  image_url: string;
  title: string;
  link_url?: string;
  span_rows?: number; // How many grid rows to span (1-3)
  span_cols?: number; // How many grid columns to span (1-2)
  font_size?: string; // Tailwind font size class
  font_position?: string; // Text position (top-left, center, bottom-left, etc.)
}

interface BentoTileProps {
  tile: BentoTileData;
  isSpecial?: boolean; // For "VIEW ALL PRODUCTS" style tiles
}

const BentoTile: React.FC<BentoTileProps> = ({ tile, isSpecial = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (tile.link_url) {
      if (tile.link_url.startsWith('/')) {
        navigate(tile.link_url);
      } else {
        window.location.href = tile.link_url;
      }
    }
  };

  const gridSpan = `${tile.span_rows && tile.span_rows > 1 ? `row-span-${tile.span_rows}` : ''} ${
    tile.span_cols && tile.span_cols > 1 ? `col-span-${tile.span_cols}` : ''
  }`;

  if (isSpecial) {
    // Special "VIEW ALL PRODUCTS" tile
    return (
      <button
        onClick={handleClick}
        className={`group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02] ${gridSpan}`}
        style={{
          background: '#78BE20',
          minHeight: '200px'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <h3 className={`${tile.font_size || 'text-3xl md:text-4xl lg:text-5xl'} font-black text-white uppercase tracking-tight leading-none`}>
              {tile.title}
            </h3>
            <div className="w-16 h-1 bg-white mx-auto transform group-hover:w-24 transition-all duration-500" />
          </div>
        </div>

        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_white_1px,_transparent_1px)] bg-[length:24px_24px] group-hover:animate-pulse" />
        </div>
      </button>
    );
  }

  // Helper function to get positioning classes based on font_position
  const getPositionClasses = () => {
    const position = tile.font_position || 'bottom-left';

    // Map position to flex classes
    const positionMap: { [key: string]: string } = {
      'top-left': 'items-start justify-start',
      'top-center': 'items-start justify-center',
      'top-right': 'items-start justify-end',
      'center-left': 'items-center justify-start',
      'center': 'items-center justify-center',
      'center-right': 'items-center justify-end',
      'bottom-left': 'items-end justify-start',
      'bottom-center': 'items-end justify-center',
      'bottom-right': 'items-end justify-end'
    };

    return positionMap[position] || 'items-end justify-start';
  };

  // Regular content tile
  return (
    <button
      onClick={handleClick}
      className={`group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02] ${gridSpan}`}
      style={{
        minHeight: tile.span_rows && tile.span_rows > 1 ? '420px' : '200px'
      }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{
          backgroundImage: `url(${tile.image_url})`
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-500" />

      {/* Content */}
      <div className={`absolute inset-0 flex ${getPositionClasses()} p-6`}>
        <div className="space-y-2 text-left">
          <h3 className={`${tile.font_size || 'text-2xl md:text-3xl'} font-bold text-white uppercase tracking-wide leading-tight group-hover:translate-x-2 transition-transform duration-500`}>
            {tile.title}
          </h3>
          <div className="w-12 h-1 bg-[#78BE20] transform group-hover:w-20 transition-all duration-500" />
        </div>
      </div>

      {/* Hover shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </button>
  );
};

export default BentoTile;
