import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import ServicesIntro from './components/ServicesIntro';
import AboutSection from './components/AboutSection';
import FeaturesSection from './components/FeaturesSection';
import ServicesGrid from './components/ServicesGrid';
import PrintAndInstagram from './components/PrintAndInstagram';
import CategoryGrid from './pages/CategoryGrid';
import AdminCategories from './pages/AdminCategories';
import ProductListing from './pages/ProductListing';
import ProductDetailsNew from './pages/ProductDetailsNew';
import NewShopFrontPage from './pages/NewShopFrontPage';
import Collections from './pages/Collections';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayoutNew from './pages/admin/AdminLayoutNew';
import ShopPageEditor from './pages/admin/ShopPageEditor';
import ClothingEnquiries from './pages/admin/ClothingEnquiries';
import ClothingEnquiryDetail from './pages/admin/ClothingEnquiryDetail';
import AdminUsers from './pages/admin/AdminUsers';
import Collection from './pages/Collection';
import AllSignage from './pages/AllSignage';
import PavementSigns from './pages/PavementSigns';
import ProjectingSigns from './pages/ProjectingSigns';
import VehicleSignwriting from './pages/VehicleSignwriting';
import GlassManifestation from './pages/GlassManifestation';
import WindowPrivacyFilm from './pages/WindowPrivacyFilm';
import Signboards from './pages/Signboards';
import Gazebos from './pages/Gazebos';
import Parasols from './pages/Parasols';
import Tablecloths from './pages/Tablecloths';
import LoaderDemo from './pages/LoaderDemo';
import PrintingLandingPage from './pages/PrintingLandingPage';
import PrintingCategoryPage from './pages/PrintingCategoryPage';
import PrintingProductPage from './pages/PrintingProductPage';
import PrintingBrowserPage from './pages/PrintingBrowserPage';
import { ClothingBrowser } from './components/clothing';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { HeaderFilterProvider } from './contexts/HeaderFilterContext';
import UnifiedChatWidget from './components/UnifiedChatWidget';
import PageLoader from './components/PageLoader';
import ScrollToTop from './components/ScrollToTop';
import Lenis from 'lenis';

function HomePage() {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 0.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Smooth scroll for anchor links
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.href && target.href.includes('#')) {
        e.preventDefault();
        const elementId = target.href.split('#')[1];
        const element = document.getElementById(elementId);
        if (element) {
          lenis.scrollTo(element, { offset: 0 });
        }
      }
    };

    // Add event listeners for anchor links
    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ServicesGrid />
      <AboutSection />
      <PrintAndInstagram />
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <ThemeProvider>
          <CartProvider>
            <WishlistProvider>
              <HeaderFilterProvider>
            <Routes>
              {/* Admin Routes - No Header/Footer */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayoutNew />}>
                <Route path="dashboard" element={<div className="p-8"><h1 className="text-3xl font-black">Dashboard</h1><p className="text-gray-600 mt-2">Welcome to the admin panel</p></div>} />
                <Route path="shop-page" element={<ShopPageEditor />} />
                <Route path="products" element={<div className="p-8"><h1 className="text-3xl font-black">Product Manager</h1><p className="text-gray-600 mt-2">Coming soon</p></div>} />
                <Route path="home-page" element={<div className="p-8"><h1 className="text-3xl font-black">Home Page Editor</h1><p className="text-gray-600 mt-2">Coming soon</p></div>} />
                <Route path="clothing-enquiries" element={<ClothingEnquiries />} />
                <Route path="clothing-enquiries/:id" element={<ClothingEnquiryDetail />} />
                <Route path="enquiries" element={<div className="p-8"><h1 className="text-3xl font-black">General Enquiries</h1><p className="text-gray-600 mt-2">Coming soon</p></div>} />
                <Route path="enquiry-settings" element={<div className="p-8"><h1 className="text-3xl font-black">Enquiry Settings</h1><p className="text-gray-600 mt-2">Coming soon</p></div>} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="*" element={<div className="p-8"><h1 className="text-3xl font-black">Page Not Found</h1></div>} />
              </Route>

            {/* Public Routes - With Header/Footer */}
            <Route path="*" element={
              <div className="App">
                <Header />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<NewShopFrontPage />} />
                  <Route path="/categories" element={<CategoryGrid />} />
                  <Route path="/categories/:categoryId" element={<ProductListing />} />
                  <Route path="/collections" element={<Collections />} />
                  <Route path="/collections/:type" element={<Collection />} />
                  <Route path="/products/:styleCode" element={<ProductDetailsNew />} />
                  <Route path="/admin/categories" element={<AdminCategories />} />
                  <Route path="/services/all-signage" element={<AllSignage />} />
                  <Route path="/services/pavement-signs" element={<PavementSigns />} />
                  <Route path="/services/projecting-signs" element={<ProjectingSigns />} />
                  <Route path="/services/glass-manifestation" element={<GlassManifestation />} />
                  <Route path="/services/window-privacy-film" element={<WindowPrivacyFilm />} />
                  <Route path="/services/signboards" element={<Signboards />} />
                  <Route path="/services/gazebos" element={<Gazebos />} />
                  <Route path="/services/parasols" element={<Parasols />} />
                  <Route path="/services/tablecloths" element={<Tablecloths />} />
                  <Route path="/services/vehicle-signwriting" element={<VehicleSignwriting />} />
                  <Route path="/loader-demo" element={<LoaderDemo />} />
                  {/* Printing Routes */}
                  <Route path="/printing" element={<PrintingLandingPage />} />
                  <Route path="/printing/all" element={<PrintingBrowserPage />} />
                  <Route path="/printing/all/:slug" element={<PrintingBrowserPage />} />
                  <Route path="/printing/:category" element={<PrintingCategoryPage />} />
                  <Route path="/printing/:category/:slug" element={<PrintingProductPage />} />
                  {/* Clothing Routes */}
                  <Route path="/clothing" element={<ClothingBrowser />} />
                  <Route path="/clothing/all" element={<ClothingBrowser />} />
                </Routes>
                <Footer />
                  <UnifiedChatWidget />
                </div>
              } />
            </Routes>
              </HeaderFilterProvider>
            </WishlistProvider>
          </CartProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
