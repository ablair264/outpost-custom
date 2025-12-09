import React from 'react';
import { motion } from 'motion/react';
import { LayoutGrid, List } from 'lucide-react';
import { cn } from '../../lib/utils';
import { printingColors } from '../../lib/printing-theme';

export type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  className?: string;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  view,
  onViewChange,
  className,
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-center p-1 rounded-lg bg-gray-100',
        className
      )}
    >
      {/* Grid button */}
      <button
        onClick={() => onViewChange('grid')}
        className={cn(
          'relative flex items-center justify-center w-10 h-10 rounded-md transition-colors',
          view === 'grid' ? 'text-white' : 'text-gray-500 hover:text-gray-700'
        )}
        aria-label="Grid view"
        aria-pressed={view === 'grid'}
      >
        {view === 'grid' && (
          <motion.div
            layoutId="view-toggle-indicator"
            className="absolute inset-0 rounded-md"
            style={{ backgroundColor: printingColors.accent }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
        <LayoutGrid className="w-5 h-5 relative z-10" />
      </button>

      {/* List button */}
      <button
        onClick={() => onViewChange('list')}
        className={cn(
          'relative flex items-center justify-center w-10 h-10 rounded-md transition-colors',
          view === 'list' ? 'text-white' : 'text-gray-500 hover:text-gray-700'
        )}
        aria-label="List view"
        aria-pressed={view === 'list'}
      >
        {view === 'list' && (
          <motion.div
            layoutId="view-toggle-indicator"
            className="absolute inset-0 rounded-md"
            style={{ backgroundColor: printingColors.accent }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
        <List className="w-5 h-5 relative z-10" />
      </button>
    </div>
  );
};

export default ViewToggle;
