import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Heart, Send, ChevronDown, Sparkles, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import CartDrawer from './CartDrawer';
import WishlistDrawer from './WishlistDrawer';

interface MegaMenuLink {
  label: string;
  href: string;
  children?: MegaMenuLink[];
}

interface MegaMenuSection {
  title?: string;
  items: MegaMenuLink[];
}

interface NavigationItem {
  label: string;
  href?: string;
  megaSections?: MegaMenuSection[];
  customMegaMenu?: 'clothing' | 'signage' | 'printing' | 'vehicle';
}

// Clothing mega menu - Use cases
const clothingUseCases = [
  { label: 'Workwear', href: '/categories/workwear' },
  { label: 'Sports Teams', href: '/categories/sports-teams' },
  { label: 'Merch', href: '/categories/merch' },
  { label: 'Weddings', href: '/categories/weddings' },
  { label: 'Events', href: '/categories/events' },
  { label: 'Unique Gifts', href: '/categories/unique-gifts' }
];

// Clothing mega menu - Product categories (condensed)
const clothingCategories = [
  { label: 'T-Shirts & Vests', href: '/products?category=t-shirts' },
  { label: 'Hoodies & Sweatshirts', href: '/products?category=hoodies' },
  { label: 'Polos & Casual', href: '/products?category=polos' },
  { label: 'Jackets & Outerwear', href: '/products?category=jackets' },
  { label: 'Trousers & Shorts', href: '/products?category=trousers' },
  { label: 'Workwear & Safety', href: '/products?category=workwear' },
  { label: 'Sportswear', href: '/products?category=sportswear' },
  { label: 'Bags & Accessories', href: '/products?category=bags' },
  { label: 'Headwear', href: '/products?category=headwear' },
  { label: 'Sustainable & Organic', href: '/products?category=organic' }
];

// Signage mega menu data
const signageIndoor = [
  { label: 'Glass Manifestation', href: '/services/all-signage' },
  { label: 'Window Privacy Film', href: '/services/all-signage' },
  { label: 'Wall Graphics', href: '/services/all-signage' },
  { label: 'Floor Graphics', href: '/services/all-signage' },
  { label: 'Poster Frames', href: '/services/all-signage' }
];

const signageOutdoor = [
  { label: 'Signboards', href: '/services/pavement-signs' },
  { label: 'Pavement Signs', href: '/services/pavement-signs' },
  { label: 'Projecting Signs', href: '/services/projecting-signs' },
  { label: 'Fascia Signs', href: '/services/all-signage' },
  { label: 'Banner Stands', href: '/services/all-signage' }
];

const signageEvents = [
  { label: 'Gazebos', href: '/services/all-signage' },
  { label: 'Parasols', href: '/services/all-signage' },
  { label: 'Tablecloths', href: '/services/all-signage' },
  { label: 'Flags & Banners', href: '/services/all-signage' },
  { label: 'Pop-up Displays', href: '/services/all-signage' }
];

// Printing mega menu data
const printingMarketing = [
  { label: 'Business Cards', href: '/printing/business-cards' },
  { label: 'Flyers', href: '/printing/flyers' },
  { label: 'Posters', href: '/printing/posters' },
  { label: 'Table Talkers', href: '/printing/table-talkers' },
  { label: 'Scratch Cards', href: '/printing/scratch-cards' }
];

const printingStationery = [
  { label: 'Appointment Cards', href: '/printing/appointment-cards' },
  { label: 'Loyalty Cards', href: '/printing/loyalty-cards' },
  { label: 'Gift Vouchers', href: '/printing/gift-vouchers' },
  { label: 'Greetings Cards', href: '/printing/greetings-cards' },
  { label: 'Funeral Order of Service', href: '/printing/funeral-booklets' }
];

const printingProducts = [
  { label: 'Booklets and Brochures', href: '/printing/booklets' },
  { label: 'Art Prints', href: '/printing/art-prints' },
  { label: 'Product Labels', href: '/printing/labels' },
  { label: 'Round Sticker Sheets', href: '/printing/stickers' }
];

// Vehicle Graphics mega menu data
const vehicleServices = [
  { label: 'Vehicle Signwriting', href: '/services/vehicle-signwriting' },
  { label: 'Magnetic Signs', href: '/services/vehicle-signwriting' }
];

const navigationItems: NavigationItem[] = [
  { label: 'HOME', href: '/' },
  {
    label: 'CLOTHING',
    href: '/shop',
    customMegaMenu: 'clothing',
    megaSections: [
      {
        title: 'Shop Clothing',
        items: [
          { label: 'Custom Clothing', href: '/shop' },
          { label: 'Customisable Garments', href: '/categories' },
          { label: 'Collections', href: '/collections' }
        ]
      },
      {
        title: 'Guides',
        items: [
          {
            label: 'Guides',
            href: '/collections',
            children: [
              { label: 'Summer Uniforms', href: '/collections/Summer%20Uniforms' },
              { label: 'Hospitality Garments', href: '/collections/Hospitality%20Garments' }
            ]
          },
          { label: 'Product Browser', href: '/products' }
        ]
      }
    ]
  },
  {
    label: 'SIGNAGE',
    href: '/services/all-signage',
    customMegaMenu: 'signage'
  },
  {
    label: 'VEHICLE GRAPHICS',
    href: '/services/vehicle-signwriting',
    customMegaMenu: 'vehicle'
  },
  {
    label: 'PRINTING',
    customMegaMenu: 'printing'
  }
];

const getGridColsClass = (count: number) => {
  if (count >= 4) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
  if (count === 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  if (count === 2) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2';
  return 'grid-cols-1';
};

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileMenuState, setMobileMenuState] = useState<Record<string, boolean>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  const { cart } = useCart();
  const { wishlist } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  useEffect(() => {
    document.body.style.paddingTop = headerHeight ? `${headerHeight}px` : '';
    return () => {
      document.body.style.paddingTop = '';
    };
  }, [headerHeight]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMobileSubmenu = (key: string) => {
    setMobileMenuState((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderMegaMenu = (sections: MegaMenuSection[], parentLabel: string) => (
    <div className="absolute left-1/2 top-full z-50 w-screen max-w-[1100px] -translate-x-1/2 pt-4 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-950/95 to-black/95 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.65)] backdrop-blur">
        <div className={`grid gap-8 ${getGridColsClass(sections.length)}`}>
          {sections.map((section, sectionIndex) => (
            <div key={`${parentLabel}-${section.title ?? sectionIndex}`} className="space-y-3">
              {section.title && (
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-lime-400">
                  {section.title}
                </p>
              )}
              <ul className="space-y-1.5">
                {section.items.map((item) => (
                  <li key={`${parentLabel}-${item.label}`}>
                    <a
                      href={item.href}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      {item.label}
                    </a>
                    {item.children && (
                      <ul className="mt-2 space-y-1 border-l border-white/10 pl-4">
                        {item.children.map((child) => (
                          <li key={`${parentLabel}-${item.label}-${child.label}`}>
                            <a
                              href={child.href}
                              className="block rounded px-2 py-1 text-xs font-medium text-white/70 transition-colors hover:text-white"
                            >
                              {child.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrintingMegaMenu = () => (
    <div className="absolute left-1/2 top-full z-50 w-screen max-w-[900px] -translate-x-1/2 pt-3 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out">
      <div className="rounded-xl border border-white/15 bg-[#0a0a0a] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">

        <div className="grid grid-cols-[1fr_1fr_1fr] divide-x divide-white/10">

          {/* Column 1 - Marketing Materials */}
          <div className="p-6">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6da71d] mb-4">Marketing Materials</h3>
            <ul className="space-y-1">
              {printingMarketing.map((item, index) => (
                <li
                  key={item.label}
                  className="opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <a
                    href={item.href}
                    className="group/link flex items-center justify-between py-2 px-3 -mx-3 rounded-lg text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-white/0 group-hover/link:text-[#6da71d] group-hover/link:translate-x-0.5 transition-all" strokeWidth={2} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 - Stationery & Cards */}
          <div className="p-6">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6da71d] mb-4">Stationery & Cards</h3>
            <ul className="space-y-1">
              {printingStationery.map((item, index) => (
                <li
                  key={item.label}
                  className="opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <a
                    href={item.href}
                    className="group/link flex items-center justify-between py-2 px-3 -mx-3 rounded-lg text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-white/0 group-hover/link:text-[#6da71d] group-hover/link:translate-x-0.5 transition-all" strokeWidth={2} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Print Products */}
          <div className="p-6">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6da71d] mb-4">Print Products</h3>
            <ul className="space-y-1">
              {printingProducts.map((item, index) => (
                <li
                  key={item.label}
                  className="opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <a
                    href={item.href}
                    className="group/link flex items-center justify-between py-2 px-3 -mx-3 rounded-lg text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-white/0 group-hover/link:text-[#6da71d] group-hover/link:translate-x-0.5 transition-all" strokeWidth={2} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom CTAs Bar */}
        <div className="border-t border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center gap-3">
            <a
              href="/contact"
              className="flex-1 group/quote block rounded-lg bg-gradient-to-br from-[#6da71d] to-[#5a8a18] p-3 transition-all duration-200 hover:shadow-[0_4px_20px_rgba(109,167,29,0.3)] opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
              style={{ animationDelay: '200ms' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/90">Custom Printing</span>
              </div>
              <p className="text-xs font-semibold text-white">Request a quote</p>
            </a>

            <a
              href="/printing"
              className="flex-1 group/all flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 hover:border-white/20 hover:text-white transition-all opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
              style={{ animationDelay: '250ms' }}
            >
              <span>View All Printing</span>
              <ArrowRight className="h-4 w-4 group-hover/all:translate-x-0.5 transition-transform" strokeWidth={2} />
            </a>
          </div>
        </div>

      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );

  const renderVehicleMegaMenu = () => (
    <div className="absolute left-1/2 top-full z-50 w-screen max-w-[700px] -translate-x-1/2 pt-3 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out">
      <div className="rounded-xl border border-white/15 bg-[#0a0a0a] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">

        <div className="grid grid-cols-2 gap-4 p-4">

          {/* Card 1 - Vehicle Signwriting */}
          <a
            href="/services/vehicle-signwriting"
            className="group/card relative h-[240px] rounded-lg overflow-hidden opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
            style={{ animationDelay: '0ms' }}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover/card:scale-110"
              style={{ backgroundImage: 'url(/vehicle-signwriting/vehicle1.jpg)' }}
            />

            {/* Black Overlay */}
            <div className="absolute inset-0 bg-black/60 transition-all duration-300 group-hover/card:bg-black/50" />

            {/* Content */}
            <div className="relative h-full p-6 flex flex-col justify-between">
              {/* Top Badge */}
              <div className="inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Sparkles className="h-3 w-3 text-[#6da71d]" strokeWidth={2.5} />
                <span className="text-[9px] font-bold uppercase tracking-wider text-white">Premium</span>
              </div>

              {/* Bottom Text */}
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Vehicle Signwriting</h3>
                <p className="text-xs text-white/80 mb-3">Professional custom graphics for your fleet</p>

                {/* Arrow Button */}
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#6da71d] group-hover/card:gap-3 transition-all">
                  <span>Learn More</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </a>

          {/* Card 2 - Magnetic Signs */}
          <a
            href="/services/vehicle-signwriting"
            className="group/card relative h-[240px] rounded-lg overflow-hidden opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
            style={{ animationDelay: '100ms' }}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover/card:scale-110"
              style={{ backgroundImage: 'url(/vehicle-signwriting/vehicle5.jpg)' }}
            />

            {/* Black Overlay */}
            <div className="absolute inset-0 bg-black/60 transition-all duration-300 group-hover/card:bg-black/50" />

            {/* Content */}
            <div className="relative h-full p-6 flex flex-col justify-between">
              {/* Top Badge */}
              <div className="inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Sparkles className="h-3 w-3 text-[#6da71d]" strokeWidth={2.5} />
                <span className="text-[9px] font-bold uppercase tracking-wider text-white">Flexible</span>
              </div>

              {/* Bottom Text */}
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Magnetic Vehicle Signs</h3>
                <p className="text-xs text-white/80 mb-3">Easy to apply, remove and reuse</p>

                {/* Arrow Button */}
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#6da71d] group-hover/card:gap-3 transition-all">
                  <span>Learn More</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </a>

        </div>

        {/* Bottom CTA Bar */}
        <div className="border-t border-white/10 bg-white/[0.02] p-4">
          <a
            href="/contact"
            className="group/quote flex items-center justify-between rounded-lg bg-gradient-to-br from-[#6da71d] to-[#5a8a18] p-3 transition-all duration-200 hover:shadow-[0_4px_20px_rgba(109,167,29,0.3)] opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
            style={{ animationDelay: '200ms' }}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/90">Get A Quote</span>
              </div>
              <p className="text-xs font-semibold text-white">Free vehicle graphics consultation</p>
            </div>
            <ArrowRight className="h-5 w-5 text-white group-hover/quote:translate-x-1 transition-transform" strokeWidth={2.5} />
          </a>
        </div>

      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );

  const renderSignageMegaMenu = () => (
    <div className="absolute left-1/2 top-full z-50 w-screen max-w-[900px] -translate-x-1/2 pt-3 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out">
      <div className="rounded-xl border border-white/15 bg-[#0a0a0a] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">

        <div className="grid grid-cols-[1fr_1fr_1fr] divide-x divide-white/10">

          {/* Column 1 - Indoor Signage */}
          <div className="p-6">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6da71d] mb-4">Indoor Signage</h3>
            <ul className="space-y-1">
              {signageIndoor.map((item, index) => (
                <li
                  key={item.label}
                  className="opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <a
                    href={item.href}
                    className="group/link flex items-center justify-between py-2 px-3 -mx-3 rounded-lg text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-white/0 group-hover/link:text-[#6da71d] group-hover/link:translate-x-0.5 transition-all" strokeWidth={2} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 - Outdoor Signage */}
          <div className="p-6">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6da71d] mb-4">Outdoor Signage</h3>
            <ul className="space-y-1">
              {signageOutdoor.map((item, index) => (
                <li
                  key={item.label}
                  className="opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <a
                    href={item.href}
                    className="group/link flex items-center justify-between py-2 px-3 -mx-3 rounded-lg text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-white/0 group-hover/link:text-[#6da71d] group-hover/link:translate-x-0.5 transition-all" strokeWidth={2} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Event Signage */}
          <div className="p-6">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6da71d] mb-4">Event Signage</h3>
            <ul className="space-y-1">
              {signageEvents.map((item, index) => (
                <li
                  key={item.label}
                  className="opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <a
                    href={item.href}
                    className="group/link flex items-center justify-between py-2 px-3 -mx-3 rounded-lg text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-white/0 group-hover/link:text-[#6da71d] group-hover/link:translate-x-0.5 transition-all" strokeWidth={2} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom CTAs Bar */}
        <div className="border-t border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center gap-3">
            <a
              href="/contact"
              className="flex-1 group/quote block rounded-lg bg-gradient-to-br from-[#6da71d] to-[#5a8a18] p-3 transition-all duration-200 hover:shadow-[0_4px_20px_rgba(109,167,29,0.3)] opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
              style={{ animationDelay: '200ms' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/90">Get A Quote</span>
              </div>
              <p className="text-xs font-semibold text-white">Free design consultation</p>
            </a>

            <a
              href="/services/all-signage"
              className="flex-1 group/all flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 hover:border-white/20 hover:text-white transition-all opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
              style={{ animationDelay: '250ms' }}
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4 group-hover/all:translate-x-0.5 transition-transform" strokeWidth={2} />
            </a>
          </div>
        </div>

      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );

  const renderClothingMegaMenu = () => (
    <div className="absolute left-1/2 top-full z-50 w-screen max-w-[900px] -translate-x-1/2 pt-3 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out">
      <div className="rounded-xl border border-white/15 bg-[#0a0a0a] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">

        <div className="grid grid-cols-[1fr_1fr_1fr] divide-x divide-white/10">

          {/* Column 1 - Shop For */}
          <div className="p-6">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6da71d] mb-4">Shop For</h3>
            <ul className="space-y-1">
              {clothingUseCases.map((item, index) => (
                <li
                  key={item.label}
                  className="opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <a
                    href={item.href}
                    className="group/link flex items-center justify-between py-2 px-3 -mx-3 rounded-lg text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-white/0 group-hover/link:text-[#6da71d] group-hover/link:translate-x-0.5 transition-all" strokeWidth={2} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 - Browse By Category */}
          <div className="p-6">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50 mb-4">Browse Categories</h3>

            {/* Featured - All Categories Link */}
            <a
              href="/categories"
              className="group/cat flex items-center justify-between mb-4 px-3 py-2.5 -mx-3 rounded-lg bg-[#6da71d]/10 border border-[#6da71d]/20 hover:bg-[#6da71d]/20 hover:border-[#6da71d]/30 transition-all opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
              style={{ animationDelay: '80ms' }}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-[#6da71d]" strokeWidth={2.5} />
                <span className="text-sm font-semibold text-[#6da71d]">All Categories</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-[#6da71d] group-hover/cat:translate-x-0.5 transition-transform" strokeWidth={2} />
            </a>

            <ul className="space-y-0.5">
              {clothingCategories.map((item, index) => (
                <li
                  key={item.label}
                  className="opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
                  style={{ animationDelay: `${100 + index * 40}ms` }}
                >
                  <a
                    href={item.href}
                    className="block py-1.5 text-[13px] text-white/60 hover:text-[#6da71d] transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - CTAs */}
          <div className="p-6 bg-white/[0.02] space-y-4">
            {/* Special Offers */}
            <a
              href="/shop#special-offers"
              className="group/offer block rounded-lg bg-gradient-to-br from-[#6da71d] to-[#5a8a18] p-4 transition-all duration-200 hover:shadow-[0_4px_20px_rgba(109,167,29,0.3)] opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
              style={{ animationDelay: '150ms' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/90">Special Offers</span>
              </div>
              <p className="text-sm font-semibold text-white">Bundle & save on bulk orders</p>
            </a>

            {/* Smart Search */}
            <a
              href="/products"
              className="group/search block rounded-lg border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:border-[#6da71d]/50 hover:bg-white/10 opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
              style={{ animationDelay: '200ms' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-[#6da71d]" strokeWidth={2} />
                <span className="text-[9px] font-semibold uppercase tracking-wider text-white/50">Smart Search</span>
              </div>
              <p className="text-sm text-white/80">Find the perfect product</p>
            </a>

            {/* View All Products */}
            <a
              href="/products"
              className="group/all flex items-center justify-between rounded-lg border border-white/10 px-4 py-3 text-sm text-white/70 hover:border-white/20 hover:text-white transition-all opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
              style={{ animationDelay: '250ms' }}
            >
              <span>View All Products</span>
              <ArrowRight className="h-4 w-4 group-hover/all:translate-x-0.5 transition-transform" strokeWidth={2} />
            </a>
          </div>

        </div>

      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );

  return (
    <>
      <div ref={headerRef} className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
        <div className="border-b border-black/40 bg-[#6da71d] text-white">
          <div className="max-w-[1600px] mx-auto flex flex-col items-center justify-center gap-2 px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.25em] sm:flex-row sm:gap-4">
            <p className="text-[9px] tracking-[0.3em] sm:text-[10px]">
              - HAVE A QUESTION? GET IN TOUCH AND ONE OF OUR TEAM WILL BE THERE TO HELP
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] tracking-[0.3em]">
              <a href="mailto:info@outpostcustom.co.uk" className="hover:text-black/80 transition-colors">
                info@outpostcustom.co.uk
              </a>
              <span className="opacity-70">|</span>
              <a href="tel:01562227117" className="hover:text-black/80 transition-colors">
                01562 227 117
              </a>
            </div>
          </div>
        </div>
        {/* Compact Single-Line Header */}
        <header className={`bg-black border-b border-white/10 transition-all ${isScrolled ? 'bg-black/95 backdrop-blur-md' : ''}`}>
          <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between h-14">

            {/* Left: Logo */}
            <a href="/" className="flex-shrink-0 relative group">
              <img
                src="/images/outpost-logo.png"
                alt="Outpost Custom"
                className="h-8 w-auto transition-transform group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const textLogo = document.createElement('span');
                    textLogo.textContent = 'OUTPOST';
                    textLogo.className = 'text-xl font-bold tracking-tight';
                    textLogo.style.color = '#6da71d';
                    parent.appendChild(textLogo);
                  }
                }}
              />
            </a>

            {/* Center: Navigation */}
            <nav className="hidden lg:flex flex-1 justify-center">
              <ul className="flex items-center gap-5 text-[11px] font-semibold tracking-[0.12em] text-white/65">
                {navigationItems.map((item) => (
                  <li key={item.label} className="relative group">
                    <a
                      href={item.href || '#'}
                      className="flex items-center gap-1.5 border-b border-transparent pb-1 text-white/70 transition-colors hover:border-lime-400/70 hover:text-white"
                    >
                      <span>{item.label}</span>
                      {(item.megaSections || item.customMegaMenu) && (
                        <ChevronDown className="h-3 w-3 text-white/50 transition-transform duration-200 group-hover:rotate-180" strokeWidth={2.5} />
                      )}
                    </a>
                    {item.customMegaMenu === 'clothing'
                      ? renderClothingMegaMenu()
                      : item.customMegaMenu === 'signage'
                      ? renderSignageMegaMenu()
                      : item.customMegaMenu === 'printing'
                      ? renderPrintingMegaMenu()
                      : item.customMegaMenu === 'vehicle'
                      ? renderVehicleMegaMenu()
                      : item.megaSections && renderMegaMenu(item.megaSections, item.label)}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right: Contact Info + Icons */}
            <div className="flex items-center gap-3">

              {/* Wishlist & Cart */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsWishlistOpen(true)}
                  className="relative p-2 hover:bg-white/5 rounded-lg transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 transition-colors ${wishlist.length > 0 ? 'text-[#6da71d] fill-current' : 'text-white/50'}`} />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#6da71d] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 hover:bg-white/5 rounded-lg transition-colors"
                  aria-label="Cart"
                >
                  <ShoppingCart className={`w-5 h-5 transition-colors ${cart.length > 0 ? 'text-[#6da71d]' : 'text-white/50'}`} />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#6da71d] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Contact CTA */}
              <a
                href="/contact"
                className="hidden lg:inline-flex items-center gap-2 rounded-[5px] border border-[#4a6c17] bg-gradient-to-b from-[#8ad33b] via-[#6fb125] to-[#4d7311] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-white shadow-[0_6px_16px_rgba(0,0,0,0.45)] transition-all hover:from-[#9fe84a] hover:via-[#7ec632] hover:to-[#5d8e19] hover:shadow-[0_10px_22px_rgba(0,0,0,0.55)] active:translate-y-[1px]"
              >
                CONTACT
                <Send className="h-3.5 w-3.5" strokeWidth={2.5} />
              </a>

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
                aria-label="Menu"
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span className={`block h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                  <span className={`block h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block h-0.5 bg-white transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>

      {/* Mobile Navigation */}
      <nav className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
        <ul className="mobile-menu">
          {navigationItems.map((item) => (
            <li key={`mobile-${item.label}`} className={item.megaSections ? 'has-submenu' : ''}>
              {item.megaSections ? (
                <button
                  type="button"
                  className={`submenu-toggle ${mobileMenuState[item.label] ? 'active' : ''}`}
                  onClick={() => toggleMobileSubmenu(item.label)}
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${mobileMenuState[item.label] ? 'rotate-180' : ''}`}
                    strokeWidth={2.5}
                  />
                </button>
              ) : (
                <a href={item.href || '#'}>{item.label}</a>
              )}

              {item.megaSections && (
                <div className={`submenu ${mobileMenuState[item.label] ? 'active' : ''}`}>
                  {item.megaSections.map((section, index) => (
                    <div key={`${item.label}-section-${section.title ?? index}`} className="py-2">
                      {section.title && <p className="mobile-submenu-title">{section.title}</p>}
                      <ul>
                        {section.items.map((link) => (
                          <li key={`${item.label}-${link.label}`}>
                            <a href={link.href}>{link.label}</a>
                            {link.children && (
                              <ul className="nested-list">
                                {link.children.map((child) => (
                                  <li key={`${item.label}-${link.label}-${child.label}`}>
                                    <a href={child.href}>{child.label}</a>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
          <li className="pt-4">
            <a
              href="/contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#4a6c17] bg-gradient-to-b from-[#8ad33b] via-[#6fb125] to-[#4d7311] px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_12px_28px_rgba(0,0,0,0.45)] transition-all hover:from-[#9fe84a] hover:via-[#7ec632] hover:to-[#5d8e19] active:translate-y-[1px]"
            >
              CONTACT
              <Send className="h-4 w-4" strokeWidth={2.5} />
            </a>
          </li>
        </ul>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Wishlist Drawer */}
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </>
  );
};

export default Header;
