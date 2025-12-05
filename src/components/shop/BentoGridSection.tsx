import React from 'react';
import BentoTile, { BentoTileData } from './BentoTile';

interface BentoGridSectionProps {
  tiles: BentoTileData[];
  layout?: 'layout1' | 'layout2' | 'layout3' | 'layout4';
}

const BentoGridSection: React.FC<BentoGridSectionProps> = ({ tiles, layout = 'layout1' }) => {
  // Tiles are already sorted by grid_position from the database query
  const sortedTiles = [...tiles];

  // Dynamic grid rendering based on tile dimensions
  const renderDynamicGrid = () => {
    // Determine grid structure based on layout type
    let gridClasses = '';

    switch (layout) {
      case 'layout1':
        // Left column - Large tile at top, then smaller tiles
        gridClasses = 'grid grid-rows-[repeat(4,minmax(200px,1fr))] gap-4 h-full';
        break;
      case 'layout2':
        // Right column - 4 equal tiles
        gridClasses = 'grid grid-rows-4 gap-4 h-full';
        break;
      case 'layout3':
        // Left column - 2x2 grid with large tile
        gridClasses = 'grid grid-cols-2 grid-rows-3 gap-4 h-full';
        break;
      case 'layout4':
        // Right column - Mixed grid
        gridClasses = 'grid grid-rows-3 gap-4 h-full';
        break;
      default:
        gridClasses = 'grid gap-4 h-full';
    }

    return (
      <div className={gridClasses}>
        {sortedTiles.map((tile) => {
          // Build dynamic span classes based on tile dimensions
          const spanClasses = [];
          if (tile.span_rows && tile.span_rows > 1) {
            spanClasses.push(`row-span-${tile.span_rows}`);
          }
          if (tile.span_cols && tile.span_cols > 1) {
            spanClasses.push(`col-span-${tile.span_cols}`);
          }

          return (
            <div key={tile.id} className={spanClasses.join(' ')}>
              <BentoTile tile={tile} isSpecial={tile.title.includes('VIEW ALL')} />
            </div>
          );
        })}
      </div>
    );
  };

  return <div className="h-full">{renderDynamicGrid()}</div>;
};

export default BentoGridSection;
