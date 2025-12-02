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
import ProductBrowser from './pages/ProductBrowser';
import ProductDetailsNew from './pages/ProductDetailsNew';
import ShopFrontPage from './pages/ShopFrontPage';
import Collections from './pages/Collections';
import Collection from './pages/Collection';
import AllSignage from './pages/AllSignage';
import PavementSigns from './pages/PavementSigns';
import ProjectingSigns from './pages/ProjectingSigns';
import VehicleSignwriting from './pages/VehicleSignwriting';
import LoaderDemo from './pages/LoaderDemo';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';

function HomePage() {
  useEffect(() => {
    // Smooth scroll for anchor links
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.href && target.href.includes('#')) {
        e.preventDefault();
        const elementId = target.href.split('#')[1];
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    };

    // Add event listeners for anchor links
    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <>
      <HeroSection />
      <ServicesIntro />
      <AboutSection />
      <FeaturesSection />
      <ServicesGrid />
      <PrintAndInstagram />
    </>
  );
}

function App() {
  return (
    <Router>
      <CartProvider>
        <WishlistProvider>
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopFrontPage />} />
              <Route path="/categories" element={<CategoryGrid />} />
              <Route path="/categories/:categoryId" element={<ProductListing />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/collections/:type" element={<Collection />} />
              <Route path="/products" element={<ProductBrowser />} />
              <Route path="/products/:styleCode" element={<ProductDetailsNew />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/services/all-signage" element={<AllSignage />} />
              <Route path="/services/pavement-signs" element={<PavementSigns />} />
              <Route path="/services/projecting-signs" element={<ProjectingSigns />} />
              <Route path="/services/vehicle-signwriting" element={<VehicleSignwriting />} />
              <Route path="/loader-demo" element={<LoaderDemo />} />
            </Routes>
            <Footer />
          </div>
        </WishlistProvider>
      </CartProvider>
    </Router>
  );
}

export default App;
