import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { printingColors } from '../../lib/printing-theme';

export interface PrintingAccordionItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  features?: string[];
  tagline?: string;
}

interface PrintingImageAccordionProps {
  items: PrintingAccordionItem[];
  title?: string;
  subtitle?: string;
}

const PrintingImageAccordion: React.FC<PrintingImageAccordionProps> = ({
  items,
  title = "Popular Products",
  subtitle = "Explore our most requested printing solutions"
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="w-full py-16 md:py-24 px-0 bg-[#0a0a0a]">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-10">
        <h2 className="hearns-font text-4xl md:text-5xl text-white mb-3">
          {title}
        </h2>
        <p className="neuzeit-light-font text-lg text-white/60">
          {subtitle}
        </p>
      </div>

      {/* Accordion Container */}
      <div className="flex flex-col md:flex-row w-full h-[500px] md:h-[550px] gap-1">
        {items.map((item, index) => {
          const isActive = activeIndex === index;
          const isAnyActive = activeIndex !== null;

          return (
            <motion.article
              key={item.id}
              className="relative cursor-pointer overflow-hidden"
              initial={false}
              animate={{
                flex: isActive ? 4 : isAnyActive ? 0.5 : 1,
              }}
              transition={{
                duration: 0.5,
                ease: [0.32, 0.72, 0, 1],
              }}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {/* Background Image */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  scale: isActive ? 1.05 : 1,
                }}
                transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Dark Overlay - always present, stronger on inactive */}
              <motion.div
                className="absolute inset-0"
                style={{ backgroundColor: printingColors.dark }}
                animate={{
                  opacity: isActive ? 0.7 : 0.85,
                }}
                transition={{ duration: 0.4 }}
              />

              {/* Gradient from bottom for text readability */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
                }}
              />

              {/* Content Container */}
              <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8">
                {/* Top: Title - Always visible */}
                <div>
                  <motion.h3
                    className="hearns-font text-white uppercase tracking-wider leading-tight"
                    animate={{
                      fontSize: isActive ? '32px' : '24px',
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    {item.title}
                  </motion.h3>

                  {/* Accent line */}
                  <motion.div
                    className="h-[3px] rounded-full mt-3"
                    style={{ backgroundColor: printingColors.accent }}
                    animate={{
                      width: isActive ? 60 : 30,
                      opacity: isActive ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Expanded Content - Only when active */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="flex-1 flex flex-col justify-end"
                    >
                      {/* Tagline */}
                      {item.tagline && (
                        <p
                          className="smilecake-font text-lg mb-3"
                          style={{ color: printingColors.accent }}
                        >
                          {item.tagline}
                        </p>
                      )}

                      {/* Description */}
                      <p className="neuzeit-light-font text-white/80 text-base leading-relaxed mb-5 max-w-md">
                        {item.description}
                      </p>

                      {/* Features */}
                      {item.features && item.features.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {item.features.slice(0, 4).map((feature, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-white/10 text-white/90"
                            >
                              <Check
                                className="w-3.5 h-3.5"
                                style={{ color: printingColors.accent }}
                              />
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* CTA Button */}
                      <Link
                        to={item.linkUrl}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-[15px] text-white text-sm font-semibold w-fit transition-all hover:scale-[1.02]"
                        style={{ backgroundColor: printingColors.accent }}
                      >
                        <span className="uppercase tracking-wider">View Product</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Collapsed hint - when not active but others are */}
                <AnimatePresence>
                  {!isActive && isAnyActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center flex-1"
                    >
                      <span
                        className="text-white/40 text-xs uppercase tracking-widest"
                        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                      >
                        Hover to explore
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};

export default PrintingImageAccordion;
