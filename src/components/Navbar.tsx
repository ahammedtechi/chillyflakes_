import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Store, 
  MoreVertical, 
  ChevronDown, 
  User, 
  Package, 
  Heart, 
  Award, 
  CreditCard, 
  Bell, 
  Headphones, 
  LogOut, 
  X, 
  Menu 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Navbar: React.FC = () => {
  const { 
    cartCount, 
    wishlist, 
    setIsCartOpen, 
    setIsLoginOpen, 
    user, 
    logoutUser,
    products, 
    setQuickViewProduct,
    setSelectedCategory
  } = useStore();

  const [searchInput, setSearchInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLoginMenu, setShowLoginMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
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
    setQuickViewProduct(product);
    setShowSuggestions(false);
    setSearchInput('');
  };

  return (
    <header className="sticky top-0 z-50 bg-white text-[#1D251E] shadow-sm border-b border-[#E5EAE2]">
      <div className="max-w-[1360px] mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          
          {/* Mobile hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 text-[#3C4A3E] hover:bg-[#F2F5F0] rounded-full transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand Logo - Inspired by O-SHOP Minimal Olive Aesthetic */}
          <div className="flex items-center flex-shrink-0">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 group py-1"
            >
              <div className="w-8 h-8 rounded-full bg-[#3C4A3E] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <span className="text-xs">🌿</span>
              </div>
              <span className="font-serif font-bold text-xl sm:text-2xl tracking-tight text-[#1D251E] group-hover:text-[#3C4A3E] transition-colors">
                ChillyFlakes
              </span>
            </a>
          </div>

          {/* Search Bar with Dropdown */}
          <div ref={searchRef} className="relative flex-1 max-w-2xl mx-1 sm:mx-4">
            <div className="relative flex items-center bg-[#F4F6F2] rounded-full border border-[#DFE6DD] focus-within:border-[#3C4A3E] focus-within:bg-white transition-all shadow-xs">
              <button className="pl-4 pr-2 text-[#6A786C] hover:text-[#3C4A3E]">
                <Search className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search cookware, ceramics, vintage items..."
                className="w-full py-2.5 pr-4 text-xs sm:text-sm text-[#1D251E] placeholder-[#7F8F81] bg-transparent focus:outline-none"
              />
              {searchInput && (
                <button 
                  onClick={() => setSearchInput('')} 
                  className="pr-4 text-[#7F8F81] hover:text-[#1D251E]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Instant Search Suggestions Dropdown */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-[#E2E7DF] overflow-hidden z-50 text-[#1D251E]">
                <div className="px-4 py-2 text-[11px] font-semibold text-[#5F6D61] uppercase border-b border-[#EEF2EB] bg-[#F9FAF8]">
                  Products & Suggestions
                </div>
                {searchSuggestions.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => handleSelectProduct(prod)}
                    className="flex items-center justify-between p-3 hover:bg-[#F4F6F2] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#F4F6F2] p-1 flex items-center justify-center border border-[#E5EAE2]">
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#1D251E] line-clamp-1">{prod.name}</p>
                        <p className="text-[10px] text-[#5F6D61]">{prod.category}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#3C4A3E]">₹{prod.price}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Options */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Login / User Dropdown - Outline pill button matching screenshot */}
            <div 
              className="relative"
              onMouseEnter={() => setShowLoginMenu(true)}
              onMouseLeave={() => setShowLoginMenu(false)}
            >
              {user?.isLoggedIn ? (
                <button 
                  onClick={() => setShowLoginMenu(!showLoginMenu)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#1D251E] hover:text-[#3C4A3E] bg-[#F4F6F2] hover:bg-[#EAEFE8] transition-colors rounded-full border border-[#DFE6DD]"
                >
                  <User className="w-3.5 h-3.5 text-[#3C4A3E]" />
                  <span className="hidden sm:inline capitalize">{user.name}</span>
                  <ChevronDown className="w-3 h-3 text-[#5F6D61]" />
                </button>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="flex items-center gap-1.5 px-5 py-2 border border-[#3C4A3E] text-[#3C4A3E] hover:bg-[#3C4A3E] hover:text-white text-xs font-semibold transition-all rounded-full"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </button>
              )}

              {/* Login Hover Menu */}
              {showLoginMenu && (
                <div className="absolute right-0 sm:left-0 top-full mt-2 w-64 bg-white text-[#1D251E] rounded-2xl shadow-xl border border-[#E2E7DF] py-2 z-50 text-xs">
                  {!user?.isLoggedIn && (
                    <div className="px-4 py-3 border-b border-[#EEF2EB] flex items-center justify-between bg-[#F9FAF8]">
                      <span className="font-medium text-[#5F6D61]">New customer?</span>
                      <button 
                        onClick={() => setIsLoginOpen(true)}
                        className="text-[#3C4A3E] font-bold hover:underline"
                      >
                        Sign Up
                      </button>
                    </div>
                  )}

                  <a 
                    href="#profile" 
                    onClick={(e) => { e.preventDefault(); alert("My Profile: Active account"); }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F4F6F2] text-[#1D251E] transition-colors"
                  >
                    <User className="w-4 h-4 text-[#3C4A3E]" />
                    <span>My Profile</span>
                  </a>
                  <a 
                    href="#plus" 
                    onClick={(e) => { e.preventDefault(); alert("Plus Zone: Active member"); }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F4F6F2] text-[#1D251E] transition-colors"
                  >
                    <Award className="w-4 h-4 text-[#3C4A3E]" />
                    <span>Chilly Flakes Club</span>
                  </a>
                  <a 
                    href="#orders" 
                    onClick={(e) => { e.preventDefault(); alert("Orders: Track and manage your shipments"); }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F4F6F2] text-[#1D251E] transition-colors"
                  >
                    <Package className="w-4 h-4 text-[#3C4A3E]" />
                    <span>Orders</span>
                  </a>
                  <button 
                    onClick={() => {
                      const el = document.getElementById('shop-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                      setShowLoginMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F4F6F2] text-[#1D251E] transition-colors text-left"
                  >
                    <Heart className="w-4 h-4 text-[#3C4A3E]" />
                    <span>Wishlist ({wishlist.length})</span>
                  </button>
                  <a 
                    href="#rewards" 
                    onClick={(e) => { e.preventDefault(); alert("Coupons: Flat 10% off with code EARTHY10"); }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F4F6F2] text-[#1D251E] transition-colors"
                  >
                    <CreditCard className="w-4 h-4 text-[#3C4A3E]" />
                    <span>Rewards & Offers</span>
                  </a>

                  {user?.isLoggedIn && (
                    <button 
                      onClick={() => { logoutUser(); setShowLoginMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 border-t border-[#EEF2EB] transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Cart Button - Solid Olive Pill matching screenshot "Shop Now" */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-5 py-2 bg-[#3C4A3E] text-white hover:bg-[#2C372D] text-xs font-semibold rounded-full shadow-sm transition-all hover:shadow"
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 min-w-[16px] h-[16px] bg-[#E2C8B8] text-[#3D2C24] text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </button>

            {/* More Menu */}
            <div 
              className="relative hidden md:block"
              onMouseEnter={() => setShowMoreMenu(true)}
              onMouseLeave={() => setShowMoreMenu(false)}
            >
              <button 
                className="p-2 text-[#5F6D61] hover:text-[#1D251E] hover:bg-[#F4F6F2] rounded-full transition-colors"
                aria-label="More options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white text-[#1D251E] rounded-2xl shadow-xl border border-[#E2E7DF] py-2 z-50 text-xs">
                  <a 
                    href="#seller" 
                    onClick={(e) => { e.preventDefault(); alert("Sell with Us: Join our artisan seller family"); }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F4F6F2] text-[#1D251E]"
                  >
                    <Store className="w-4 h-4 text-[#3C4A3E]" />
                    <span>Become a Seller</span>
                  </a>
                  <a 
                    href="#support" 
                    onClick={(e) => { e.preventDefault(); alert("Customer Support: help@chillyflakes.in"); }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F4F6F2] text-[#1D251E]"
                  >
                    <Headphones className="w-4 h-4 text-[#3C4A3E]" />
                    <span>Support Center</span>
                  </a>
                  <a 
                    href="#notifications" 
                    onClick={(e) => { e.preventDefault(); alert("Notification settings"); }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F4F6F2] text-[#1D251E]"
                  >
                    <Bell className="w-4 h-4 text-[#3C4A3E]" />
                    <span>Notifications</span>
                  </a>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-72 bg-white text-[#1D251E] p-6 shadow-2xl flex flex-col justify-between border-r border-[#E2E7DF]">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-[#EEF2EB]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#3C4A3E] flex items-center justify-center text-white text-xs">🌿</div>
                  <span className="font-serif font-bold text-lg text-[#1D251E]">Chilly Flakes</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 hover:bg-[#F4F6F2] rounded-full">
                  <X className="w-5 h-5 text-[#5F6D61]" />
                </button>
              </div>
              <div className="space-y-2 text-xs font-medium">
                <button 
                  onClick={() => { setIsLoginOpen(true); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 px-4 bg-[#3C4A3E] text-white rounded-full text-center font-semibold shadow-xs"
                >
                  {user?.isLoggedIn ? `Logged in: ${user.name}` : 'Log In / Sign Up'}
                </button>
                <button 
                  onClick={() => { setSelectedCategory('All'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 px-4 hover:bg-[#F4F6F2] rounded-xl text-left text-[#1D251E] transition-colors"
                >
                  All Categories
                </button>
                <button 
                  onClick={() => { setSelectedCategory('Pre-Owned Deals'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 px-4 hover:bg-[#F4F6F2] rounded-xl text-left text-[#3C4A3E] font-semibold transition-colors"
                >
                  ⚡ Pre-Owned Super Deals
                </button>
                <button 
                  onClick={() => { setIsCartOpen(true); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 px-4 hover:bg-[#F4F6F2] rounded-xl text-left text-[#1D251E] transition-colors"
                >
                  My Cart ({cartCount})
                </button>
              </div>
            </div>
            <div className="pt-4 border-t border-[#EEF2EB] text-xs text-[#5F6D61]">
              <span>Customer Care • 1800-CHILLY-HELP</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
