import React from 'react';
import { motion } from 'motion/react';
import { printingColors } from '../../../lib/printing-theme';

interface QualityScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

const sizes = {
  sm: { ring: 60, stroke: 4, fontSize: 'text-lg' },
  md: { ring: 90, stroke: 6, fontSize: 'text-2xl' },
  lg: { ring: 120, stroke: 8, fontSize: 'text-3xl' },
};

function getScoreColor(score: number): string {
  if (score >= 75) return printingColors.accent;
  if (score >= 50) return '#f59e0b'; // amber
  return '#dc2626'; // red
}

const QualityScoreRing: React.FC<QualityScoreRingProps> = ({
  score,
  size = 'md',
  showLabel = true,
  animated = true,
}) => {
  const { ring, stroke, fontSize } = sizes[size];
  const radius = (ring - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: ring, height: ring }}>
        <svg
          width={ring}
          height={ring}
          viewBox={`0 0 ${ring} ${ring}`}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={ring / 2}
            cy={ring / 2}
            r={radius}
            fill="none"
            stroke={printingColors.neutralLight}
            strokeWidth={stroke}
          />
          {/* Progress circle */}
          <motion.circle
            cx={ring / 2}
            cy={ring / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={animated ? { strokeDashoffset: circumference } : { strokeDashoffset: circumference - progress }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: animated ? 1 : 0, ease: [0.32, 0.72, 0, 1] }}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className={`neuzeit-font font-bold ${fontSize}`}
            style={{ color }}
            initial={animated ? { opacity: 0 } : { opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
        </div>
      </div>
      {showLabel && (
        <span className="neuzeit-light-font text-sm text-gray-500">
          out of 100
        </span>
      )}
    </div>
  );
};

export default QualityScoreRing;
