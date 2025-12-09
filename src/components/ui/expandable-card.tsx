import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Link } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, EffectFade, Pagination } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"
import { X, ChevronLeft, ChevronRight, LucideIcon } from "lucide-react"

import "swiper/css"
import "swiper/css/effect-fade"
import "swiper/css/pagination"

import { cn } from "../../lib/utils"

type ServiceLink = {
  label: string
  href: string
  icon?: LucideIcon
  description?: string
}

type ServiceGroup = {
  title: string
  items: ServiceLink[]
}

interface ExpandableCardProps {
  title: string
  src: string
  serviceGroups: ServiceGroup[]
  className?: string
  overlayGradient?: string
  buttonLabel?: string
  galleryImages?: string[]
  categoryLink?: string
  hoverItems?: string[]
}

const DEFAULT_GRADIENT = "linear-gradient(180deg, rgba(34,28,53,1) 0%, rgba(0,0,0,0.07) 100%)"

// ServicesList component with tap-to-reveal descriptions
function ServicesList({ groups, onClose }: { groups: ServiceGroup[]; onClose: () => void }) {
  const [expandedItem, setExpandedItem] = React.useState<string | null>(null)
  const [expandedGroup, setExpandedGroup] = React.useState<string | null>(groups.length === 1 ? groups[0].title : null)
  const showGroupTitles = groups.length > 1

  const toggleItem = (label: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setExpandedItem(expandedItem === label ? null : label)
  }

  const toggleGroup = (title: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setExpandedGroup(expandedGroup === title ? null : title)
    setExpandedItem(null) // Close any open items when switching groups
  }

  // If only one group, render items directly without accordion
  if (!showGroupTitles) {
    return (
      <div className="space-y-2 mb-6 max-h-[50vh] overflow-y-auto pr-2">
        {groups[0].items.map((item) => {
          const Icon = item.icon
          const isExpanded = expandedItem === item.label
          return (
            <div
              key={item.href}
              className="rounded-lg border border-white/10 overflow-hidden transition-all hover:border-[#908d9a]/50"
            >
              <button
                type="button"
                className="w-full flex items-center gap-3 p-3 text-left"
                onClick={(e) => toggleItem(item.label, e)}
              >
                {Icon && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#383349] flex-shrink-0">
                    <Icon className="h-4 w-4 text-[#c1c6c8]" />
                  </div>
                )}
                <span className="smilecake-font text-lg text-white">
                  {item.label}
                </span>
              </button>
              <AnimatePresence>
                {isExpanded && item.description && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 pt-0">
                      <p className="grotesk-font text-sm text-[#908d9a] leading-relaxed pl-11 mb-2">
                        {item.description}
                      </p>
                      <Link
                        to={item.href}
                        className="inline-flex items-center gap-2 ml-11 text-sm text-[#c1c6c8] hover:text-white transition-colors"
                        onClick={onClose}
                      >
                        Learn more
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    )
  }

  // Multiple groups - render as expandable accordion
  return (
    <div className="space-y-2 mb-6 max-h-[50vh] overflow-y-auto pr-2">
      {groups.map((group) => {
        const isGroupExpanded = expandedGroup === group.title
        return (
          <div
            key={group.title}
            className="rounded-lg border border-white/10 overflow-hidden"
          >
            <button
              type="button"
              className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
              onClick={(e) => toggleGroup(group.title, e)}
            >
              <span className="smilecake-font text-xl text-white">
                {group.title}
              </span>
              <ChevronRight
                className={cn(
                  "h-5 w-5 text-[#908d9a] transition-transform duration-200",
                  isGroupExpanded && "rotate-90"
                )}
              />
            </button>
            <AnimatePresence>
              {isGroupExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-3 pb-3 space-y-2">
                    {group.items.map((item) => {
                      const Icon = item.icon
                      const isExpanded = expandedItem === item.label
                      return (
                        <div
                          key={item.href}
                          className="rounded-lg border border-white/5 bg-white/5 overflow-hidden transition-all hover:border-[#908d9a]/30"
                        >
                          <button
                            type="button"
                            className="w-full flex items-center gap-3 p-3 text-left"
                            onClick={(e) => toggleItem(item.label, e)}
                          >
                            {Icon && (
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#383349] flex-shrink-0">
                                <Icon className="h-3.5 w-3.5 text-[#c1c6c8]" />
                              </div>
                            )}
                            <span className="grotesk-font text-base text-white">
                              {item.label}
                            </span>
                          </button>
                          <AnimatePresence>
                            {isExpanded && item.description && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="px-3 pb-3 pt-0">
                                  <p className="grotesk-font text-sm text-[#908d9a] leading-relaxed pl-10 mb-2">
                                    {item.description}
                                  </p>
                                  <Link
                                    to={item.href}
                                    className="inline-flex items-center gap-2 ml-10 text-sm text-[#c1c6c8] hover:text-white transition-colors"
                                    onClick={onClose}
                                  >
                                    Learn more
                                    <ChevronRight className="h-4 w-4" />
                                  </Link>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

export function ExpandableCard({
  title,
  src,
  serviceGroups,
  className,
  overlayGradient = DEFAULT_GRADIENT,
  buttonLabel = "More Info",
  galleryImages = [],
  categoryLink,
  hoverItems = [],
  ...props
}: ExpandableCardProps) {
  const [active, setActive] = React.useState(false)
  const [lightboxOpen, setLightboxOpen] = React.useState(false)
  const [lightboxIndex, setLightboxIndex] = React.useState(0)
  const [activeSlideIndex, setActiveSlideIndex] = React.useState(0)
  const cardRef = React.useRef<HTMLDivElement>(null)
  const id = React.useId()

  // Lock body scroll when modal or lightbox is open
  React.useEffect(() => {
    if (active || lightboxOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [active, lightboxOpen])

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (lightboxOpen) {
          setLightboxOpen(false)
        } else {
          setActive(false)
        }
      }
      // Lightbox navigation
      if (lightboxOpen && galleryImages.length > 0) {
        if (event.key === "ArrowRight") {
          setLightboxIndex((prev) => (prev + 1) % galleryImages.length)
        } else if (event.key === "ArrowLeft") {
          setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
        }
      }
    }

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node) && !lightboxOpen) {
        setActive(false)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [lightboxOpen, galleryImages.length])

  const groups = serviceGroups ?? []
  const allImages = galleryImages.length > 0 ? galleryImages : [src]

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <>
      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close lightbox"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation()
                    setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
                  }}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation()
                    setLightboxIndex((prev) => (prev + 1) % allImages.length)
                  }}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={allImages[lightboxIndex]}
              alt={`${title} gallery image ${lightboxIndex + 1}`}
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white">
              {lightboxIndex + 1} / {allImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Backdrop */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10 h-full w-full bg-[#0a080f]/80"
          />
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 overflow-y-auto">
            <motion.div
              layoutId={`card-${title}-${id}`}
              ref={cardRef}
              className="relative flex w-full max-w-[550px] flex-col overflow-hidden rounded-2xl bg-[#221C35] text-[#C1C6C8] shadow-2xl my-auto"
              {...props}
            >
              {/* Titlebar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                <motion.h3
                  layoutId={`title-${title}-${id}`}
                  className="hearns-font text-2xl uppercase tracking-[0.12em] text-white"
                >
                  {title}
                </motion.h3>
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#908d9a] transition-colors hover:bg-white/10 hover:text-white"
                  onClick={() => setActive(false)}
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Hero Carousel */}
              <div className="relative h-[200px] md:h-[250px] w-full">
                <Swiper
                  modules={[Autoplay, EffectFade, Pagination]}
                  effect="fade"
                  fadeEffect={{ crossFade: true }}
                  autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    clickable: true,
                    bulletClass: "swiper-pagination-bullet !bg-white/40 !w-2 !h-2 !mx-1",
                    bulletActiveClass: "!bg-white !w-3",
                  }}
                  loop={allImages.length > 1}
                  className="h-full w-full cursor-pointer"
                  onSlideChange={(swiper: SwiperType) => setActiveSlideIndex(swiper.realIndex)}
                  onClick={() => openLightbox(activeSlideIndex)}
                >
                  {allImages.map((image, index) => (
                    <SwiperSlide key={`${title}-slide-${index}`}>
                      <img
                        src={image}
                        alt={`${title} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Click to view hint */}
                <div className="absolute bottom-3 right-3 z-10 rounded-full bg-black/40 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
                  Click to enlarge
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col px-5 py-4 md:px-6">

                {/* Services List with Descriptions */}
                <ServicesList groups={groups} onClose={() => setActive(false)} />

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4 border-t border-white/10">
                  <Link
                    to="/contact"
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#183028] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#1f4038]"
                    onClick={() => setActive(false)}
                  >
                    Get Free Quote
                  </Link>
                  {categoryLink && (
                    <Link
                      to={categoryLink}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg border-2 border-white/20 bg-transparent px-6 py-3 font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5"
                      onClick={() => setActive(false)}
                    >
                      View All {title}
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Card (Closed State) */}
      <motion.div
        role="dialog"
        aria-labelledby={`card-title-${id}`}
        aria-modal="true"
        layoutId={`card-${title}-${id}`}
        onClick={() => setActive(true)}
        className={cn(
          "group relative flex h-[186px] w-full cursor-pointer overflow-hidden rounded-[10px] shadow-lg",
          className
        )}
      >
        <div className="absolute inset-0">
          <img
            src={src}
            alt={title}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          {/* Default gradient overlay */}
          <div
            className="absolute inset-0 transition-all duration-300"
            style={{ background: overlayGradient }}
          />
          {/* Darker overlay on hover for better text contrast */}
          <div className="absolute inset-0 bg-[#221C35]/0 transition-all duration-300 group-hover:bg-[#221C35]/85" />
        </div>
        <div className="relative flex h-full w-full flex-col items-center justify-start text-center px-3">
          <motion.h4
            layoutId={`title-${title}-${id}`}
            className="hearns-font mt-5 sm:mt-7 text-xl sm:text-2xl md:text-[28px] uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[#C1C6C8] drop-shadow-lg"
          >
            {title}
          </motion.h4>

          {/* Hover preview list */}
          {hoverItems.length > 0 && (
            <ul className="mt-2 sm:mt-3 space-y-0.5 sm:space-y-1 opacity-0 transition-all duration-300 group-hover:opacity-100 px-2">
              {hoverItems.map((item) => (
                <li
                  key={item}
                  className="grotesk-font text-xs sm:text-sm md:text-base text-white font-medium drop-shadow-md"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}

          <motion.button
            aria-label={`Open ${title}`}
            layoutId={`button-${title}-${id}`}
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              setActive(true)
            }}
            className="hearns-font absolute bottom-0 left-0 flex h-[32px] sm:h-[37px] w-[100px] sm:w-[120px] items-center justify-center rounded-none rounded-tr-[10px] bg-[#183028] text-[12px] sm:text-[14px] uppercase tracking-[0.06em] sm:tracking-[0.08em] text-white transition-colors duration-300 hover:bg-[#1f4038]"
          >
            {buttonLabel}
          </motion.button>
        </div>
      </motion.div>
    </>
  )
}
