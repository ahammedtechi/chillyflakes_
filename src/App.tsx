import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ShopByCategory } from './components/ShopByCategory';
import { FeaturedProducts } from './components/FeaturedProducts';
import { ServicesSection } from './components/ServicesSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { LoginModal } from './components/LoginModal';
import { ToastContainer } from './components/ToastContainer';
import { ProductDetailPage } from './components/ProductDetailPage';

const MainAppContent: React.FC = () => {
  const { selectedProduct, closeProductPage, openProductPage } = useStore();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#223B28] flex flex-col font-sans selection:bg-[#2E4D34] selection:text-white">
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Main Navigation Header with custom ChillyFlakes logo and search bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow">
        {selectedProduct ? (
          <ProductDetailPage
            product={selectedProduct}
            onBack={closeProductPage}
            onSelectProduct={openProductPage}
          />
        ) : (
          <>
            {/* 3. Hero Section: Natural Products Handmade with Love */}
            <HeroSection />

            {/* 4. Shop by Category: 7 Circular Categories */}
            <ShopByCategory />

            {/* 5. Featured Products: 5 Cards Grid */}
            <FeaturedProducts />

            {/* 6. Our Services: 4 Skilled Professional Services */}
            <ServicesSection />

            {/* 7. Why Choose ChillyFlakes: 5 Trust Badges */}
            <WhyChooseUs />
          </>
        )}
      </main>

      {/* 8. Deep Forest Green Footer */}
      <Footer />

      {/* Interactive Overlays & Drawers */}
      <CartDrawer />
      <QuickViewModal />
      <LoginModal />
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
};

export default App;
