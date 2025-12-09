import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { cn } from "../../lib/utils"
import { printingColors, printingGradients } from "../../lib/printing-theme"

interface PrintingExpandableCardProps {
  title: string
  src: string
  description?: string
  categoryLink: string
  className?: string
  buttonLabel?: string
  hoverItems?: string[]
  variant?: 'category' | 'browse-all'
}

export function PrintingExpandableCard({
  title,
  src,
  categoryLink,
  className,
  buttonLabel = "Browse",
  hoverItems = [],
  variant = 'category',
}: PrintingExpandableCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  // Browse All variant
  if (variant === 'browse-all') {
    return (
      <Link
        to={categoryLink}
        className={cn(
          "group relative flex h-[300px] sm:h-[340px] w-full cursor-pointer overflow-hidden rounded-[15px] transition-all duration-500",
          className
        )}
        style={{ backgroundColor: printingColors.accent }}
      >
        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative flex h-full w-full flex-col items-center justify-center text-center p-6">
          <motion.div
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="hearns-font text-4xl sm:text-5xl uppercase tracking-wider text-white mb-4">
              Browse All
            </h4>
            <p className="neuzeit-font text-white/80 text-lg mb-6">
              View our complete range
            </p>
          </motion.div>

          <motion.div
            className="flex items-center gap-3 px-6 py-3 rounded-[15px] bg-white text-sm font-semibold transition-all"
            style={{ color: printingColors.accent }}
            whileHover={{ scale: 1.05 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <span className="uppercase tracking-wider">View All Products</span>
            <ArrowRight className="w-5 h-5" />
          </motion.div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={categoryLink}
      className={cn(
        "group relative flex h-[300px] sm:h-[340px] w-full cursor-pointer overflow-hidden rounded-[15px] shadow-lg transition-all duration-500 hover:shadow-2xl",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image with zoom effect */}
      <div className="absolute inset-0">
        <motion.img
          src={src}
          alt={title}
          className="h-full w-full object-cover object-center"
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Base gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: printingGradients.cardOverlay }}
        />
        {/* Hover overlay - darker for better contrast */}
        <motion.div
          className="absolute inset-0"
          style={{ backgroundColor: printingColors.dark }}
          animate={{ opacity: isHovered ? 0.85 : 0 }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Content Container */}
      <div className="relative flex h-full w-full flex-col justify-between p-6">
        {/* Top: Title Area */}
        <div className="relative">
          {/* Title - larger size, animates on hover */}
          <motion.h4
            className="hearns-font uppercase tracking-wider text-white drop-shadow-lg leading-tight"
            animate={{
              fontSize: isHovered ? '28px' : '36px',
            }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {title}
          </motion.h4>

          {/* Accent line under title on hover */}
          <motion.div
            className="h-[3px] rounded-full mt-4"
            style={{ backgroundColor: printingColors.accent }}
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: isHovered ? 50 : 0,
              opacity: isHovered ? 1 : 0
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
          />
        </div>

        {/* Middle: Hover Items - LARGER TEXT */}
        <AnimatePresence>
          {isHovered && hoverItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex items-center py-4"
            >
              <ul className="grid grid-cols-2 gap-x-8 gap-y-3 w-full">
                {hoverItems.slice(0, 6).map((item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.25, delay: index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: printingColors.accent }}
                    />
                    <span className="neuzeit-font text-base text-white">
                      {item}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom: Single CTA Button - 15px rounded corners */}
        <motion.div
          className="flex items-center gap-2 px-5 py-3 rounded-[15px] text-sm font-semibold text-white w-fit"
          style={{ backgroundColor: printingColors.accent }}
          whileHover={{
            backgroundColor: printingColors.accentHover,
            scale: 1.02
          }}
          transition={{ duration: 0.2 }}
        >
          <span className="uppercase tracking-wider text-sm">{buttonLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </motion.div>
      </div>
    </Link>
  )
}

export default PrintingExpandableCard;
