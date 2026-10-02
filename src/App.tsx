import React from 'react';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { CategoryBar } from './components/CategoryBar';
import { HeroSlider } from './components/HeroSlider';
import { DealsOfTheDay } from './components/DealsOfTheDay';
import { FourGridPromos } from './components/FourGridPromos';
import { ProductGrid } from './components/ProductGrid';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { LoginModal } from './components/LoginModal';
import { ToastContainer } from './components/ToastContainer';

export const App: React.FC = () => {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-[#263936] text-[#F1EFE5] flex flex-col font-sans selection:bg-[#355247] selection:text-[#F1EFE5]">
        
        {/* 1. Flipkart-style Top Header */}
        <Navbar />

        {/* 2. Top Category Icon Strip with Subcategories */}
        <CategoryBar />

        {/* Main Content Area */}
        <main className="flex-grow space-y-2 pb-6">
          
          {/* 3. Hero Carousel Banner Slider */}
          <HeroSlider />

          {/* 4. Deals of the Day with Countdown Clock */}
          <DealsOfTheDay />

          {/* 6. Four-Box Recommendation Shelves */}
          <FourGridPromos />

          {/* 7. Product Catalog Shelf with Filters and f-Assured badges */}
          <ProductGrid />

        </main>

        {/* 8. Flipkart Signature Mega Footer */}
        <Footer />

        {/* Interactive Overlays & Drawers */}
        <CartDrawer />
        <QuickViewModal />
        <LoginModal />
        <ToastContainer />

      </div>
    </StoreProvider>
  );
};

export default App;
