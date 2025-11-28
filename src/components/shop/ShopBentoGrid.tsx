import React from 'react';
import { ArrowRight, Sparkles, Users, Shirt, Palette } from 'lucide-react';
import { Button } from '../ui/button';

const ShopBentoGrid = () => {
  return (
    <section className="w-full py-20 px-4 md:px-8 lg:px-16 xl:px-24" style={{ background: '#ffffff' }}>
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#000000' }}>
            What We Do
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From stag dos to staff uniforms, we create stand-out garments for all occasions
          </p>
        </div>

        {/* Square Bento Grid Container - 4x4 Grid */}
        <div className="aspect-square w-full grid grid-cols-4 grid-rows-4 gap-4">

          {/* Card 1: Stag & Hens - Large (2x2) */}
          <div className="relative rounded-3xl overflow-hidden col-span-2 row-span-2" style={{ background: '#1a1a1a' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent" />

            <div className="relative h-full p-8 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 rounded-full backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-wider" style={{ background: 'rgba(109, 167, 29, 0.3)' }}>
                  Popular Choice
                </span>
                <h3 className="text-white text-5xl font-bold leading-tight">
                  Stag & Hen<br />Parties
                </h3>
                <p className="text-gray-200 text-base max-w-sm">
                  Make your celebration unforgettable with custom hoodies and t-shirts. Personalised with nicknames, in-jokes, and epic designs.
                </p>
              </div>
              <Button
                className="self-start rounded-full h-12 px-8 text-black font-semibold hover:opacity-90"
                style={{ background: '#6da71d' }}
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Card 2: Hospitality & Uniforms - Tall (1x2) */}
          <div className="relative rounded-3xl overflow-hidden col-span-1 row-span-2" style={{ background: '#2a2a2a' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="relative h-full p-6 flex flex-col justify-end">
              <div className="space-y-2">
                <Users className="w-8 h-8" style={{ color: '#6da71d' }} />
                <h4 className="text-white text-2xl font-bold">
                  Hospitality<br/>Uniforms
                </h4>
                <p className="text-gray-300 text-sm">
                  Professional staff uniforms that look great
                </p>
              </div>
              <Button
                variant="outline"
                className="mt-4 rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm h-10"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Card 3: Custom Designs - Medium (1x2) */}
          <div className="relative rounded-3xl overflow-hidden col-span-1 row-span-2" style={{ background: 'linear-gradient(135deg, #6da71d 0%, #5a8a18 100%)' }}>
            <div className="relative h-full p-6 flex flex-col justify-between">
              <Palette className="w-10 h-10 text-white/90" />
              <div>
                <h4 className="text-white text-2xl font-bold mb-2">
                  Bespoke<br />Designs
                </h4>
                <p className="text-white/90 text-sm">
                  Our in-house designers create awesome custom designs just for you
                </p>
              </div>
            </div>
          </div>

          {/* Card 4: Group Holidays - Wide (2x1) */}
          <div className="relative rounded-3xl overflow-hidden col-span-2 row-span-1 bg-white p-6 border-2" style={{ borderColor: '#6da71d' }}>
            <div className="h-full flex items-center justify-between">
              <div className="space-y-1">
                <span className="block text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  Perfect For
                </span>
                <h4 className="text-black text-3xl font-bold">
                  Group Holidays & Trips
                </h4>
              </div>
              <Button
                className="rounded-full h-11 px-6 text-white hover:opacity-90"
                style={{ background: '#000000' }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                View Examples
              </Button>
            </div>
          </div>

          {/* Card 5: Sports Teams - Medium (1x1) */}
          <div className="relative rounded-3xl overflow-hidden col-span-1 row-span-1" style={{ background: '#1a1a1a' }}>
            <div className="relative h-full p-5 flex flex-col justify-end">
              <span className="block text-white text-base font-bold">
                Sports<br />Teams
              </span>
            </div>
          </div>

          {/* Card 6: Quality Badge - Medium (1x1) */}
          <div className="relative rounded-3xl overflow-hidden col-span-1 row-span-1 bg-gradient-to-br from-gray-100 to-gray-200 p-5">
            <div className="h-full flex flex-col justify-between">
              <Shirt className="w-7 h-7 text-gray-700" />
              <div>
                <h5 className="text-gray-900 text-sm font-bold leading-tight">
                  High Quality<br/>Garments
                </h5>
              </div>
            </div>
          </div>

          {/* Card 7: Why Choose Us - Extra Wide (4x1) */}
          <div className="relative rounded-3xl overflow-hidden col-span-4 row-span-1 p-6" style={{ background: '#6da71d' }}>
            <div className="h-full flex items-center justify-between">
              <div className="flex-1">
                <h5 className="text-white text-2xl font-bold mb-1">
                  Run by Designers - Every Garment Looks Epic
                </h5>
                <p className="text-white/90 text-sm">
                  No minimum order • Bulk discounts available • 7-10 day turnaround
                </p>
              </div>
              <ArrowRight className="w-6 h-6 text-white ml-4" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ShopBentoGrid;
