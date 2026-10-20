import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  ChevronDown, 
  Menu, 
  X 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const { 
    cartCount, 
    setIsCartOpen, 
    products, 
    setSelectedCategory,
    openProductPage,
    closeProductPage
  } = useStore();

  const [searchInput, setSearchInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchSuggestions = searchInput.trim() === ''
    ? []
    : products.filter(p => 
        p.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        p.category.toLowerCase().includes(searchInput.toLowerCase())
      ).slice(0, 5);

  const handleSelectProduct = (product: any) => {
    openProductPage(product);
    setShowSuggestions(false);
    setSearchInput('');
  };

  const handleCategoryNav = (cat: string) => {
    closeProductPage();
    setSelectedCategory(cat);
    setShowShopDropdown(false);
    setMobileMenuOpen(false);
    const shopEl = document.getElementById('featured-products-section');
    if (shopEl) shopEl.scrollIntoView({ behavior: 'smooth' });
  };

  const handleServicesNav = (serviceName?: string) => {
    setShowServicesDropdown(false);
    setMobileMenuOpen(false);
    const servicesEl = document.getElementById('services-section');
    if (servicesEl) {
      servicesEl.scrollIntoView({ behavior: 'smooth' });
      if (serviceName) {
        // highlight or inform
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#ECE7DD] shadow-[0_2px_12px_rgba(46,77,52,0.04)]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 gap-4 lg:gap-8">
          
          {/* Mobile hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-[#2E4D34] hover:bg-[#F2F5F0] rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Left: Custom ChillyFlakes Logo (Curved red chilly in plate like a smile + green tail) */}
          <div className="flex items-center flex-shrink-0">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                closeProductPage();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group py-1"
            >
              <Logo variant="dark" size="md" showTagline={true} />
            </a>
          </div>

          {/* Center: Search Bar with Integrated Forest Green Button */}
          <div ref={searchRef} className="relative flex-1 max-w-xl mx-2 sm:mx-6 hidden sm:block">
            <div className="relative flex items-center bg-white rounded-full border border-[#B6C6B5] focus-within:border-[#2E4D34] focus-within:ring-2 focus-within:ring-[#2E4D34]/15 transition-all pl-4 pr-1 py-1 shadow-xs">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search for products, sellers, or services..."
                className="w-full py-1.5 pr-3 text-xs sm:text-sm text-[#223B28] placeholder-[#7E8F80] bg-transparent focus:outline-none"
              />

              {searchInput && (
                <button 
                  onClick={() => setSearchInput('')} 
                  className="pr-2 text-[#7E8F80] hover:text-[#223B28]"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Integrated Forest Green Search Button matching screenshot */}
              <button 
                onClick={() => {
                  if (searchSuggestions.length > 0) {
                    handleSelectProduct(searchSuggestions[0]);
                  }
                }}
                className="w-9 h-9 rounded-full bg-[#2E4D34] hover:bg-[#233B27] flex items-center justify-center text-white flex-shrink-0 transition-transform active:scale-95 shadow-xs"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Instant Search Suggestions Dropdown */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-[#ECE7DD] overflow-hidden z-50 text-[#223B28]">
                <div className="px-4 py-2 text-[11px] font-semibold text-[#5E6D60] uppercase border-b border-[#F4EFE6] bg-[#FAF7F2]">
                  Products & Suggestions
                </div>
                {searchSuggestions.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => handleSelectProduct(prod)}
                    className="flex items-center justify-between p-3 hover:bg-[#FAF7F2] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] p-1 flex items-center justify-center border border-[#ECE7DD]">
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-contain rounded-md" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#223B28] line-clamp-1">{prod.name}</p>
                        <p className="text-[10px] text-[#5E6D60]">{prod.category}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#2E4D34]">CAD ${prod.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Navigation Links matching screenshot */}
          <nav className="flex items-center gap-6 lg:gap-8">
            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#2D3A2F]">
              
              {/* Home - Active with green bottom border indicator */}
              <a 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-[#2E4D34] font-semibold border-b-2 border-[#2E4D34] pb-1 transition-colors"
              >
                Home
              </a>

              {/* Shop ▾ with Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setShowShopDropdown(true)}
                onMouseLeave={() => setShowShopDropdown(false)}
              >
                <button 
                  onClick={() => {
                    const el = document.getElementById('shop-category-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1 hover:text-[#2E4D34] transition-colors py-2"
                >
                  <span>Shop</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#7E8F80]" />
                </button>

                {showShopDropdown && (
                  <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border border-[#ECE7DD] py-2 z-50">
                    {['Natural Products', 'Handmade Products', 'Jewelry', 'Clothes & Fashion', 'Home & Living', 'Retail Products'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryNav(cat)}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-[#2D3A2F] hover:bg-[#FAF7F2] hover:text-[#2E4D34] transition-colors"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Services ▾ with Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setShowServicesDropdown(true)}
                onMouseLeave={() => setShowServicesDropdown(false)}
              >
                <button 
                  onClick={() => handleServicesNav()}
                  className="flex items-center gap-1 hover:text-[#2E4D34] transition-colors py-2"
                >
                  <span>Services</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#7E8F80]" />
                </button>

                {showServicesDropdown && (
                  <div className="absolute left-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-[#ECE7DD] py-2 z-50">
                    {['Massage Therapy', 'Beauty & Skincare', 'Tutoring', 'Home Cleaning'].map((service) => (
                      <button
                        key={service}
                        onClick={() => handleServicesNav(service)}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-[#2D3A2F] hover:bg-[#FAF7F2] hover:text-[#2E4D34] transition-colors"
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* About Us */}
              <a 
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('why-choose-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-[#2E4D34] transition-colors"
              >
                About Us
              </a>

              {/* Contact */}
              <a 
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('footer-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-[#2E4D34] transition-colors"
              >
                Contact
              </a>
            </div>

            {/* Cart Icon (0) */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 text-[#2E4D34] hover:text-[#233B27] font-medium transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 text-[#2E4D34]" />
              <span className="text-sm font-semibold">({cartCount})</span>
            </button>

          </nav>

        </div>

        {/* Mobile Search Bar visible on small devices */}
        <div className="pb-3 sm:hidden">
          <div className="relative flex items-center bg-white rounded-full border border-[#B6C6B5] pl-4 pr-1 py-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="w-full py-1 pr-3 text-xs text-[#223B28] placeholder-[#7E8F80] bg-transparent focus:outline-none"
            />
            <button 
              onClick={() => {
                if (searchSuggestions.length > 0) handleSelectProduct(searchSuggestions[0]);
              }}
              className="w-8 h-8 rounded-full bg-[#2E4D34] flex items-center justify-center text-white"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl p-6 flex flex-col justify-between z-50">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#ECE7DD]">
                <Logo variant="dark" size="sm" showTagline={false} />
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full text-[#7E8F80] hover:text-[#223B28]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 space-y-4 text-sm font-medium text-[#2D3A2F]">
                <button 
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-1 text-[#2E4D34] font-semibold"
                >
                  Home
                </button>
                <button 
                  onClick={() => {
                    const el = document.getElementById('shop-category-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-1 hover:text-[#2E4D34]"
                >
                  Shop by Category
                </button>
                <button 
                  onClick={() => {
                    const el = document.getElementById('featured-products-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-1 hover:text-[#2E4D34]"
                >
                  Featured Products
                </button>
                <button 
                  onClick={() => handleServicesNav()}
                  className="w-full text-left py-1 hover:text-[#2E4D34]"
                >
                  Our Services
                </button>
                <button 
                  onClick={() => {
                    const el = document.getElementById('why-choose-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-1 hover:text-[#2E4D34]"
                >
                  Why Choose Us
                </button>
                <button 
                  onClick={() => {
                    const el = document.getElementById('footer-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-1 hover:text-[#2E4D34]"
                >
                  Contact
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-[#ECE7DD]">
              <p className="text-xs text-[#7E8F80]">
                Natural • Handmade • Unique
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
