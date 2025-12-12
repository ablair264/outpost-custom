import React from 'react';
import { ExpandableCard } from './ui/expandable-card';

import { Shirt, Users, Gift, Palette, Frame, Shield, Map, ArrowUpRight, Umbrella, Table, Car, FileText, CreditCard, Ticket, BookOpen, Image, Tag, Circle } from 'lucide-react';

const serviceCards = [
  {
    title: 'Clothing',
    image: '/what-we-do/beanie1.jpg',
    galleryImages: ['/images/beanie1.jpg', '/hero-images/hoodie1.jpg', '/images/sticker.webp', '/hero-images/gillet1.jpg', '/hero-images/jacket1.jpg', '/images/mask.webp'],
    categoryLink: '/shop',
    hoverItems: ['Workwear', 'Sports Teams', 'Merch & Retail'],
    serviceGroups: [
      {
        title: 'Clothing',
        items: [
          { label: 'Workwear', href: '/shop#how-to-order', icon: Shirt, description: 'Custom uniforms, branded workwear and corporate clothing for your team.' },
          { label: 'Sports Teams', href: '/shop#special-offers', icon: Users, description: 'Match kits, trainingwear and teamwear for clubs of all sizes.' },
          { label: 'Merch & Retail', href: '/shop', icon: Palette, description: 'Create your own merchandise line with custom printed apparel.' },
          { label: 'Events & Gifts', href: '/shop#faq', icon: Gift, description: 'Personalised clothing for weddings, events and unique gifts.' },
        ],
      },
    ],
  },
  {
    title: 'Signage',
    image: '/what-we-do/signage.webp',
    galleryImages: ['/signboards/signboard1.jpg', '/pavement-signs/pavement1.jpg', '/projecting-signs/projecting2.jpg', '/signboards/signboard4.jpg', '/pavement-signs/pavement3.jpg', '/projecting-signs/projecting4.jpg'],
    categoryLink: '/services/all-signage',
    hoverItems: ['Indoor', 'Outdoor', 'Events'],
    serviceGroups: [
      {
        title: 'Signage',
        items: [
          { label: 'Glass Manifestation', href: '/services/glass-manifestation', icon: Frame, description: 'Frosted, etched-effect or decorative graphics for glass surfaces.' },
          { label: 'Window Privacy Film', href: '/services/window-privacy-film', icon: Shield, description: 'Control visibility and light levels with decorative frosted film.' },
          { label: 'Signboards', href: '/services/signboards', icon: Map, description: 'Premium flat-panel signage for building facades.' },
          { label: 'Pavement Signs', href: '/services/pavement-signs', icon: Frame, description: 'Free-standing A-boards to catch attention of passers-by.' },
          { label: 'Projecting Signs', href: '/services/projecting-signs', icon: ArrowUpRight, description: 'Wall-mounted brackets with custom panels, visible from all angles.' },
        ],
      },
    ],
  },
  {
    title: 'Vehicle GFX',
    image: '/what-we-do/vehicle.webp',
    galleryImages: ['/vehicle-signwriting/vehicle1.jpg', '/vehicle-signwriting/vehicle2.jpg', '/vehicle-signwriting/vehicle3.jpg', '/vehicle-signwriting/vehicle4.jpg', '/vehicle-signwriting/vehicle5.jpg'],
    categoryLink: '/services/vehicle-signwriting',
    hoverItems: ['Vehicle Signwriting', 'Fleet Branding'],
    serviceGroups: [
      {
        title: 'Vehicle GFX',
        items: [
          { label: 'Vehicle Signwriting', href: '/services/vehicle-signwriting', icon: Car, description: 'Transform your vehicle into a mobile billboard with custom graphics.' },
          { label: 'Fleet Branding', href: '/services/vehicle-signwriting', icon: Users, description: 'Consistent branding across your entire fleet of vehicles.' },
        ],
      },
    ],
  },
  {
    title: 'Printing',
    image: '/what-we-do/printing.webp',
    galleryImages: ['/pavement-signs/pavement2.jpg', '/signboards/signboard2.jpg', '/pavement-signs/pavement4.jpg', '/signboards/signboard3.jpg'],
    categoryLink: '/services/printing',
    hoverItems: ['Business Cards', 'Flyers & Posters', 'Booklets'],
    serviceGroups: [
      {
        title: 'Marketing Materials',
        items: [
          { label: 'Business Cards', href: '/services/printing#business-cards', icon: CreditCard, description: 'Professional business cards in various finishes and stocks.' },
          { label: 'Flyers', href: '/services/printing#flyers', icon: FileText, description: 'Eye-catching flyers for promotions, events and campaigns.' },
          { label: 'Posters', href: '/services/printing#posters', icon: Image, description: 'High-quality posters in all sizes for maximum impact.' },
          { label: 'Table Talkers', href: '/services/printing#table-talkers', icon: Frame, description: 'Tabletop displays perfect for restaurants and retail.' },
          { label: 'Scratch Cards', href: '/services/printing#scratch-cards', icon: Ticket, description: 'Custom scratch cards for promotions and competitions.' },
        ],
      },
      {
        title: 'Stationery & Cards',
        items: [
          { label: 'Appointment Cards', href: '/services/printing#appointment-cards', icon: CreditCard, description: 'Branded appointment cards for salons, clinics and more.' },
          { label: 'Loyalty Cards', href: '/services/printing#loyalty-cards', icon: CreditCard, description: 'Custom loyalty cards to reward your customers.' },
          { label: 'Gift Vouchers', href: '/services/printing#gift-vouchers', icon: Gift, description: 'Beautifully designed gift vouchers for your business.' },
          { label: 'Greetings Cards', href: '/services/printing#greetings-cards', icon: FileText, description: 'Personalised greetings cards for any occasion.' },
          { label: 'Funeral Order of Service', href: '/services/printing#funeral', icon: BookOpen, description: 'Respectful, professionally printed memorial booklets.' },
        ],
      },
      {
        title: 'Print Products',
        items: [
          { label: 'Booklets & Brochures', href: '/services/printing#booklets', icon: BookOpen, description: 'Multi-page booklets and brochures for catalogues and guides.' },
          { label: 'Art Prints', href: '/services/printing#art-prints', icon: Image, description: 'High-quality giclée prints on premium papers.' },
          { label: 'Product Labels', href: '/services/printing#labels', icon: Tag, description: 'Custom labels and stickers for products and packaging.' },
          { label: 'Round Sticker Sheets', href: '/services/printing#stickers', icon: Circle, description: 'Die-cut round stickers on easy-peel sheets.' },
        ],
      },
    ],
  },
];

const ServicesGrid: React.FC = () => {
  return (
    <section id="services" className="relative bg-[#183028] py-12 sm:py-16 md:py-20">
      <div className="mx-auto w-full max-w-[1450px] rounded-[10px] bg-[#234a3a] px-4 pt-8 pb-12 shadow-[0_35px_80px_rgba(24,48,40,0.25)] sm:px-8 sm:pt-10 sm:pb-16 md:px-10 md:pt-[47px] md:pb-[96px] lg:px-[74px]">
        <style>{`
          @font-face {
            font-family: 'Hearns';
            src: url('/fonts/Hearns/Hearns.woff') format('woff');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: 'Aldivaro';
            src: url('/fonts/aldivaro/Aldivaro Stamp Demo.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: 'Neuzeit Grotesk';
            src: url('/fonts/neuzeit-grotesk-regular_freefontdownload_org/neuzeit-grotesk-regular.woff2') format('woff2'),
                 url('/fonts/neuzeit-grotesk-regular_freefontdownload_org/neuzeit-grotesk-regular.woff') format('woff');
            font-weight: 400;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: 'Smilecake';
            src: url('/fonts/smilecake/Smilecake.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
          .hearns-font { font-family: 'Hearns', Georgia, serif; letter-spacing: 0.16em; }
          .aldivaro-font { font-family: 'Aldivaro', 'Times New Roman', serif; }
          .grotesk-font { font-family: 'Neuzeit Grotesk', 'Helvetica Neue', sans-serif; }
          .smilecake-font { font-family: 'Smilecake', 'Comic Sans MS', cursive; letter-spacing: 0.06em; }
        `}</style>

        <div className="flex flex-col gap-6 sm:gap-8 md:gap-10">
          {/* Header - Stacked on mobile, side-by-side on desktop */}
          <div className="flex flex-col gap-3 sm:gap-4 text-white lg:flex-row lg:items-end lg:justify-between">
            {/* Title + Scribble */}
            <div className="flex flex-col items-center lg:items-start">
              <p className="hearns-font text-[28px] tracking-[0.04em] sm:text-[36px] md:text-[48px] lg:text-[60px]">
                WHAT WE DO
              </p>
              <div className="h-[3px] rounded-full mt-2 sm:mt-3 w-[100px] sm:w-[140px] md:w-[180px] lg:w-[220px]" style={{ backgroundColor: '#64a70b' }} />
            </div>

            {/* Tagline - inline on mobile, separate on desktop */}
            <p className="grotesk-font text-center text-sm sm:text-base md:text-lg lg:text-[20px] leading-relaxed text-white/70 max-w-[320px] mx-auto lg:mx-0 lg:text-right lg:max-w-[260px]">
              We're here to help you promote your business, build your brand or simply show your individuality.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-4">
            {serviceCards.map((category) => (
              <div key={category.title} className="h-[200px] sm:h-[250px] md:h-[300px]">
                <ExpandableCard
                  title={category.title}
                  src={category.image}
                  serviceGroups={category.serviceGroups}
                  galleryImages={category.galleryImages || []}
                  categoryLink={category.categoryLink}
                  hoverItems={category.hoverItems}
                  className="h-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
