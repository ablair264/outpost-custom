import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import CartDrawer from './CartDrawer';
import WishlistDrawer from './WishlistDrawer';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const { cart } = useCart();
  const { wishlist } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSubmenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const submenu = e.currentTarget.nextElementSibling as HTMLElement;
    if (submenu) {
      submenu.classList.toggle('active');
    }
  };

  return (
    <>
      {/* Compact Single-Line Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10 transition-all ${isScrolled ? 'bg-black/95 backdrop-blur-md' : ''}`}>
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
            <nav className="hidden lg:flex items-center gap-1">
              <a href="/" className="px-3 py-1.5 text-[13px] font-medium text-white/70 hover:text-white transition-colors tracking-wide">
                HOME
              </a>

              <div className="relative group">
                <a href="/shop" className="px-3 py-1.5 text-[13px] font-medium text-white/70 hover:text-white transition-colors tracking-wide flex items-center gap-1">
                  SHOP
                  <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
                <div className="absolute top-full left-0 mt-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-black/95 backdrop-blur-md border border-white/10 rounded-lg shadow-xl py-2 min-w-[180px]">
                    <a href="/products" className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">All Products</a>
                    <a href="/collections" className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">Collections</a>
                    <div className="border-t border-white/10 my-1"></div>
                    <a href="/collections/T-Shirts" className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">T-Shirts</a>
                    <a href="/collections/Hoodies" className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">Hoodies</a>
                    <a href="/collections/Caps" className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">Caps & Hats</a>
                    <a href="/collections/Bags" className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">Bags</a>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <a href="#" className="px-3 py-1.5 text-[13px] font-medium text-white/70 hover:text-white transition-colors tracking-wide flex items-center gap-1">
                  SERVICES
                  <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
                <div className="absolute top-full left-0 mt-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-black/95 backdrop-blur-md border border-white/10 rounded-lg shadow-xl py-2 min-w-[200px]">
                    <a href="/services/all-signage" className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">All Signage Services</a>
                    <div className="border-t border-white/10 my-1"></div>
                    <a href="/services/pavement-signs" className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">Pavement Signs</a>
                    <a href="/services/projecting-signs" className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">Projecting Signs</a>
                    <a href="/services/vehicle-signwriting" className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">Vehicle Signwriting</a>
                  </div>
                </div>
              </div>

              <a href="#" className="px-3 py-1.5 text-[13px] font-medium text-white/70 hover:text-white transition-colors tracking-wide">
                ABOUT
              </a>

              <a href="#" className="px-3 py-1.5 text-[13px] font-medium text-white/70 hover:text-white transition-colors tracking-wide">
                CONTACT
              </a>
            </nav>

            {/* Right: Contact Info + Icons */}
            <div className="flex items-center gap-4">
              {/* Contact Info - Hidden on mobile */}
              <div className="hidden xl:flex items-center gap-4 text-[11px] text-white/50">
                <a href="mailto:info@outpostcustom.co.uk" className="hover:text-white/70 transition-colors">
                  info@outpostcustom.co.uk
                </a>
                <span className="text-white/20">|</span>
                <a href="tel:01562227117" className="hover:text-white/70 transition-colors">
                  01562 227 117
                </a>
              </div>

              {/* Wishlist & Cart */}
              <div className="flex items-center gap-2">
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

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-14"></div>

      {/* Mobile Navigation */}
      <nav className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
        <ul className="mobile-menu">
          <li><a href="/">HOME</a></li>
          <li className="has-submenu">
            <a href="/shop" onClick={toggleSubmenu}>SHOP</a>
            <ul className="submenu">
              <li><a href="/products">All Products</a></li>
              <li><a href="/collections">Collections</a></li>
              <li><a href="/collections/T-Shirts">T-Shirts</a></li>
              <li><a href="/collections/Hoodies">Hoodies</a></li>
              <li><a href="/collections/Caps">Caps & Hats</a></li>
              <li><a href="/collections/Bags">Bags</a></li>
            </ul>
          </li>
          <li className="has-submenu">
            <a href="#" onClick={toggleSubmenu}>SERVICES</a>
            <ul className="submenu">
              <li><a href="/services/all-signage">All Signage Services</a></li>
              <li><a href="/services/pavement-signs">Pavement Signs</a></li>
              <li><a href="/services/projecting-signs">Projecting Signs</a></li>
              <li><a href="/services/vehicle-signwriting">Vehicle Signwriting</a></li>
            </ul>
          </li>
          <li><a href="#">ABOUT</a></li>
          <li><a href="#">CONTACT</a></li>
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