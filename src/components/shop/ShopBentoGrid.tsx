import React, { useState, useEffect, useRef } from 'react';
import {
  HardHat,
  Shirt,
  ShoppingBag,
  Heart,
  Calendar,
  Gift,
  Star,
  Send,
  ThumbsUp,
  Hand,
  ArrowRight
} from 'lucide-react';
import { Button } from '../ui/button';

const steps = [
  {
    icon: Star,
    number: '1',
    title: 'Choose your garments',
    description: 'Browse our garment catalogue online, pop into our shop to try on some garments or chat to our team who will advise on the best garment for you.',
    progress: 25
  },
  {
    icon: Send,
    number: '2',
    title: 'Get a FREE quote + mockup',
    description: 'Send us your logo and our design team will put together a visual of how your clothing could look.',
    extra: 'Need a logo designed first? Our in-house design team can help with that.',
    progress: 50
  },
  {
    icon: ThumbsUp,
    number: '3',
    title: 'Approve your order',
    description: 'After you approve your order, we\'ll get it into production, which usually takes 5-10 working days.',
    extra: 'Got an event and need your order sooner? Chat to our team – if we have your garment in stock, we\'ll do our best to make sure you\'ve got everything you need!',
    progress: 75
  },
  {
    icon: Hand,
    number: '4',
    title: 'Order up!',
    description: 'We\'ll let you know when your order is ready to collect from our shop in Kidderminster or we can arrange posting your order to you (Delivery from £2.50).',
    progress: 95
  }
];

// Progress ring component with animation
const ProgressRing = ({
  progress,
  size = 96,
  strokeWidth = 4,
  isVisible = false,
  delay = 0
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  isVisible?: boolean;
  delay?: number;
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  useEffect(() => {
    if (isVisible) {
      // Delay the animation start for staggered effect
      const timer = setTimeout(() => {
        setAnimatedProgress(progress);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setAnimatedProgress(0);
    }
  }, [isVisible, progress, delay]);

  return (
    <svg
      width={size}
      height={size}
      className="absolute inset-0 -rotate-90"
    >
      {/* Background circle (gray track) */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
      />
      {/* Progress circle (green) */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#6da71d"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        style={{
          transition: 'stroke-dashoffset 1.2s ease-out'
        }}
      />
    </svg>
  );
};

const ShopBentoGrid = () => {
  const [isStepsVisible, setIsStepsVisible] = useState(false);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsStepsVisible(true);
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% visible
        rootMargin: '0px'
      }
    );

    if (stepsRef.current) {
      observer.observe(stepsRef.current);
    }

    return () => {
      if (stepsRef.current) {
        observer.unobserve(stepsRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Bento Grid Categories Section */}
      <section className="w-full py-20 px-4 md:px-8 lg:px-16 xl:px-24" style={{ background: '#000000' }}>
        <div className="max-w-[1200px] mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold italic text-white">
              We produce customised clothing for...
            </h2>
          </div>

          {/* Bento Grid - 4x3 Layout */}
          <div className="grid grid-cols-4 grid-rows-3 gap-4 aspect-[4/3]">

            {/* Card 1: Workwear - Large (2x2) */}
            <div className="relative rounded-3xl overflow-hidden col-span-2 row-span-2 group cursor-pointer" style={{ background: '#1a1a1a' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-transparent group-hover:from-[#6da71d]/20 transition-all duration-300" />
              <div className="relative h-full p-8 flex flex-col justify-between">
                <HardHat className="w-12 h-12 text-white/80 group-hover:text-[#6da71d] transition-colors" strokeWidth={1.5} />
                <div>
                  <h3 className="text-[#6da71d] text-3xl font-bold mb-3">Workwear</h3>
                  <p className="text-white/70 text-base max-w-xs">
                    Durable garments & safetywear to promote your business and identify your team
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Sports Teams - Tall (1x2) */}
            <div className="relative rounded-3xl overflow-hidden col-span-1 row-span-2 group cursor-pointer" style={{ background: '#2a2a2a' }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-[#6da71d]/20 transition-all duration-300" />
              <div className="relative h-full p-6 flex flex-col justify-between">
                <Shirt className="w-10 h-10 text-white/80 group-hover:text-[#6da71d] transition-colors" strokeWidth={1.5} />
                <div>
                  <h4 className="text-[#6da71d] text-2xl font-bold mb-2">Sports Teams</h4>
                  <p className="text-white/70 text-sm">
                    Add your team logo, names and sponsorship to sportswear
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Merch - Green accent (1x2) */}
            <div className="relative rounded-3xl overflow-hidden col-span-1 row-span-2 group cursor-pointer" style={{ background: 'linear-gradient(135deg, #6da71d 0%, #5a8a18 100%)' }}>
              <div className="relative h-full p-6 flex flex-col justify-between">
                <ShoppingBag className="w-10 h-10 text-white/90" strokeWidth={1.5} />
                <div>
                  <h4 className="text-white text-2xl font-bold mb-2">Merch</h4>
                  <p className="text-white/90 text-sm">
                    Build your brand with customised items for resale or promotional freebies
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4: Weddings - Wide (2x1) */}
            <div className="relative rounded-3xl overflow-hidden col-span-2 row-span-1 group cursor-pointer bg-white border-2" style={{ borderColor: '#6da71d' }}>
              <div className="h-full p-6 flex items-center gap-6">
                <Heart className="w-10 h-10 text-[#6da71d] flex-shrink-0" strokeWidth={1.5} />
                <div className="flex-1">
                  <h4 className="text-[#6da71d] text-2xl font-bold mb-1">Weddings</h4>
                  <p className="text-gray-600 text-sm">
                    Personalised clothing and sashes for Stag & Hen parties
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-[#6da71d] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 5: Events - Small (1x1) */}
            <div className="relative rounded-3xl overflow-hidden col-span-1 row-span-1 group cursor-pointer" style={{ background: '#1a1a1a' }}>
              <div className="relative h-full p-5 flex flex-col justify-between">
                <Calendar className="w-8 h-8 text-white/80 group-hover:text-[#6da71d] transition-colors" strokeWidth={1.5} />
                <div>
                  <h5 className="text-[#6da71d] text-lg font-bold">Events</h5>
                  <p className="text-white/60 text-xs mt-1">Marathons, fun runs & corporate</p>
                </div>
              </div>
            </div>

            {/* Card 6: Unique Gifts - Small (1x1) */}
            <div className="relative rounded-3xl overflow-hidden col-span-1 row-span-1 group cursor-pointer" style={{ background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)' }}>
              <div className="relative h-full p-5 flex flex-col justify-between">
                <Gift className="w-8 h-8 text-white/80 group-hover:text-[#6da71d] transition-colors" strokeWidth={1.5} />
                <div>
                  <h5 className="text-[#6da71d] text-lg font-bold">Unique Gifts</h5>
                  <p className="text-white/60 text-xs mt-1">One-off customised garments</p>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom CTA Bar */}
          <div className="mt-8 rounded-3xl p-6" style={{ background: '#6da71d' }}>
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-white text-xl font-bold mb-1">
                  Run by Designers – Every Garment Looks Epic
                </h5>
                <p className="text-white/90 text-sm">
                  No minimum order • Bulk discounts available • 7-10 day turnaround
                </p>
              </div>
              <Button
                className="rounded-full h-11 px-6 text-[#6da71d] font-semibold hover:opacity-90"
                style={{ background: '#ffffff' }}
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works Section - Light Background */}
      <section className="w-full py-20 px-4 md:px-8" style={{ background: '#f5f5f5' }}>
        <div className="max-w-[1200px] mx-auto">
          {/* Section Header */}
          <div className="text-center mb-6">
            <h2 className="text-4xl md:text-5xl font-bold text-black">
              How's it work?
            </h2>
          </div>

          <p className="text-center text-gray-600 text-base max-w-3xl mx-auto mb-16">
            Chat to our team who can advise on the best garments and type of customisation for your personalised clothing and branded workwear.
          </p>

          {/* Steps Grid */}
          <div ref={stepsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 mb-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="text-center">
                  {/* Circular Icon with Progress Ring */}
                  <div className="mb-6 flex justify-center">
                    <div className="relative w-24 h-24">
                      {/* Progress Ring SVG - animates on scroll into view */}
                      <ProgressRing
                        progress={step.progress}
                        size={96}
                        strokeWidth={4}
                        isVisible={isStepsVisible}
                        delay={index * 200} // Stagger animation: 0ms, 200ms, 400ms, 600ms
                      />
                      {/* Inner white circle with icon */}
                      <div className="absolute inset-1 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <Icon
                          className="w-10 h-10 text-[#6da71d]"
                          strokeWidth={2}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-black font-bold text-lg mb-4">
                    {step.number}. {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    {step.description}
                  </p>

                  {/* Extra text if present */}
                  {step.extra && (
                    <p className="text-gray-600 text-sm leading-relaxed">
                      <span className="font-semibold text-gray-800">{step.extra.split('?')[0]}?</span>
                      {step.extra.split('?')[1]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/categories"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-lg font-bold text-white text-sm uppercase tracking-wide transition-all hover:opacity-90"
              style={{ background: '#6da71d' }}
            >
              <ShoppingBag className="w-5 h-5" />
              Browse Our Garment Catalogue
            </a>

            <a
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-lg font-bold text-white text-sm uppercase tracking-wide transition-all hover:opacity-90"
              style={{ background: '#6da71d' }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              How To Find Us
            </a>

            <a
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-lg font-bold text-white text-sm uppercase tracking-wide transition-all hover:opacity-90"
              style={{ background: '#6da71d' }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Get Some Advice From Our Team
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopBentoGrid;
