import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBentoTiles, BentoTile as BentoTileData } from '../../utils/supabase';

interface BentoTileProps {
  image_url: string;
  title: string;
  link_url?: string;
  font_size?: string;
  font_position?: string;
  className?: string;
}

const BentoTile: React.FC<BentoTileProps> = ({ image_url, title, link_url, font_size, font_position, className }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (link_url) {
      if (link_url.startsWith('/')) {
        navigate(link_url);
      } else {
        window.location.href = link_url;
      }
    }
  };

  // Helper function to get positioning classes based on font_position
  const getPositionClasses = () => {
    const position = font_position || 'bottom-left';

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

  return (
    <button
      onClick={handleClick}
      className={`group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02] w-full h-full ${className || ''}`}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${image_url})` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-500" />

      {/* Content */}
      <div className={`absolute inset-0 flex ${getPositionClasses()} p-5`}>
        <h3 className={`text-white ${font_size || 'text-xl md:text-2xl lg:text-3xl'} font-bold uppercase tracking-wide drop-shadow-lg`}>
          {title}
        </h3>
      </div>

      {/* Hover shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </button>
  );
};

const BentoGridTwoColumn: React.FC = () => {
  const [leftTiles, setLeftTiles] = useState<BentoTileData[]>([]);
  const [rightTiles, setRightTiles] = useState<BentoTileData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTiles = async () => {
      try {
        const [left, right] = await Promise.all([
          fetchBentoTiles('left'),
          fetchBentoTiles('right')
        ]);
        setLeftTiles(left);
        setRightTiles(right);
      } catch (error) {
        console.error('Error loading bento tiles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTiles();
  }, []);

  // Helper function to get tile style with explicit grid positioning
  const getTileStyle = (tile: BentoTileData) => {
    const cols = 4; // Both grids use 4 columns
    const position = tile.grid_position - 1;

    // Calculate grid position
    const colStart = (position % cols) + 1;
    const rowStart = Math.floor(position / cols) + 1;
    const colEnd = colStart + (tile.span_cols || 1);
    const rowEnd = rowStart + (tile.span_rows || 1);

    return {
      gridColumn: `${colStart} / ${colEnd}`,
      gridRow: `${rowStart} / ${rowEnd}`
    };
  };

  if (loading) {
    return (
      <section className="w-full py-16 md:py-24 px-4 md:px-8 lg:px-16 xl:px-24 bg-[#2a2a2a]">
        <div className="max-w-[1400px] mx-auto flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-8 lg:px-16 xl:px-24 bg-[#2a2a2a]">
      <div className="max-w-[1400px] mx-auto">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">

          {/* ===== LEFT BENTO GRID ===== */}
          <div className="grid grid-cols-4 auto-rows-[100px] gap-3">
            {leftTiles.map((tile) => (
              <div key={tile.id} style={getTileStyle(tile)}>
                <BentoTile
                  image_url={tile.image_url}
                  title={tile.title}
                  link_url={tile.link_url}
                  font_size={tile.font_size}
                  font_position={tile.font_position}
                />
              </div>
            ))}
          </div>

          {/* ===== RIGHT BENTO GRID ===== */}
          <div className="grid grid-cols-4 auto-rows-[100px] gap-3">
            {rightTiles.map((tile) => (
              <div key={tile.id} style={getTileStyle(tile)}>
                <BentoTile
                  image_url={tile.image_url}
                  title={tile.title}
                  link_url={tile.link_url}
                  font_size={tile.font_size}
                  font_position={tile.font_position}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoGridTwoColumn;
