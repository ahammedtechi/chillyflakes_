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
  TrendingUp, 
  Smartphone,
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
    <header className="sticky top-0 z-50 bg-[#1E2D2A] text-[#F1EFE5] shadow-forest border-b border-[#2D403D]">
      <div className="max-w-[1360px] mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          
          {/* Mobile hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-1.5 text-[#F1EFE5] hover:text-[#8A9C82]"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Brand Logo */}
          <div className="flex items-center flex-shrink-0">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center group py-1"
            >
              <span className="font-sans font-black italic text-xl sm:text-2xl tracking-tight text-[#F1EFE5] group-hover:text-[#F7F5ED] transition-colors">
                ChillyFlakes
              </span>
            </a>
          </div>

          {/* Search Bar with Dropdown */}
          <div ref={searchRef} className="relative flex-1 max-w-2xl mx-1 sm:mx-4">
            <div className="relative flex items-center bg-[#172421] rounded-lg border border-[#355247] focus-within:border-[#8A9C82] transition-all shadow-inner">
              <button className="pl-3.5 pr-2 text-[#8A9C82] hover:text-[#F1EFE5]">
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
                placeholder="Search for Products, Brands and More"
                className="w-full py-2.5 pr-4 text-xs sm:text-sm text-[#F1EFE5] placeholder-[#8A9C82]/70 bg-transparent focus:outline-none"
              />
              {searchInput && (
                <button 
                  onClick={() => setSearchInput('')} 
                  className="pr-3 text-[#8A9C82] hover:text-[#F1EFE5]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Instant Search Suggestions Dropdown */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-[#1E2D2A] rounded-lg shadow-forest-lg border border-[#355247] overflow-hidden z-50 text-[#F1EFE5]">
                <div className="p-2 text-[11px] font-semibold text-[#8A9C82] uppercase border-b border-[#2D403D]">
                  Products & Suggestions
                </div>
                {searchSuggestions.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => handleSelectProduct(prod)}
                    className="flex items-center justify-between p-2.5 hover:bg-[#2D403D] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#F7F5ED] p-1 flex items-center justify-center">
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#F1EFE5] line-clamp-1">{prod.name}</p>
                        <p className="text-[10px] text-[#8A9C82]">{prod.category}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#dfab7e]">₹{prod.price}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Options */}
          <div className="flex items-center gap-3 sm:gap-6">
            
            {/* Login / User Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setShowLoginMenu(true)}
              onMouseLeave={() => setShowLoginMenu(false)}
            >
              {user?.isLoggedIn ? (
                <button 
                  onClick={() => setShowLoginMenu(!showLoginMenu)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#F1EFE5] hover:text-[#8A9C82] transition-colors rounded-sm"
                >
                  <User className="w-4 h-4 text-[#8A9C82]" />
                  <span className="hidden sm:inline capitalize">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-[#2D403D] border border-[#355247] hover:bg-[#355247] hover:border-[#8A9C82] text-[#F1EFE5] text-xs font-bold transition-all rounded shadow-xs"
                >
                  <User className="w-4 h-4 text-[#8A9C82]" />
                  <span>Login</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Login Hover Menu */}
              {showLoginMenu && (
                <div className="absolute right-0 sm:left-0 top-full mt-1 w-64 bg-[#1E2D2A] text-[#F1EFE5] rounded-md shadow-forest-lg border border-[#355247] py-2 z-50 text-xs">
                  {!user?.isLoggedIn && (
                    <div className="px-4 py-2 border-b border-[#2D403D] flex items-center justify-between">
                      <span className="font-semibold text-[#F1EFE5]">New customer?</span>
                      <button 
                        onClick={() => setIsLoginOpen(true)}
                        className="text-[#8A9C82] font-bold hover:underline"
                      >
                        Sign Up
                      </button>
                    </div>
                  )}

                  <a 
                    href="#profile" 
                    onClick={(e) => { e.preventDefault(); alert("My Profile: Active account"); }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#2D403D] text-[#F1EFE5] transition-colors"
                  >
                    <User className="w-4 h-4 text-[#8A9C82]" />
                    <span>My Profile</span>
                  </a>
                  <a 
                    href="#plus" 
                    onClick={(e) => { e.preventDefault(); alert("Plus Zone: Active member"); }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#2D403D] text-[#F1EFE5] transition-colors"
                  >
                    <Award className="w-4 h-4 text-[#8A9C82]" />
                    <span>Chilly Flakes Plus Zone</span>
                  </a>
                  <a 
                    href="#orders" 
                    onClick={(e) => { e.preventDefault(); alert("Orders: Track and manage your shipments"); }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#2D403D] text-[#F1EFE5] transition-colors"
                  >
                    <Package className="w-4 h-4 text-[#8A9C82]" />
                    <span>Orders</span>
                  </a>
                  <button 
                    onClick={() => {
                      const el = document.getElementById('shop-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                      setShowLoginMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#2D403D] text-[#F1EFE5] transition-colors text-left"
                  >
                    <Heart className="w-4 h-4 text-[#8A9C82]" />
                    <span>Wishlist ({wishlist.length})</span>
                  </button>
                  <a 
                    href="#rewards" 
                    onClick={(e) => { e.preventDefault(); alert("Coupons: Flat 10% off with code EARTHY10"); }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#2D403D] text-[#F1EFE5] transition-colors"
                  >
                    <CreditCard className="w-4 h-4 text-[#8A9C82]" />
                    <span>Rewards & Coupons</span>
                  </a>

                  {user?.isLoggedIn && (
                    <button 
                      onClick={() => { logoutUser(); setShowLoginMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#2D403D] text-red-400 border-t border-[#2D403D] transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 text-xs font-semibold text-[#F1EFE5] hover:text-[#8A9C82] transition-colors relative"
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-[#F1EFE5]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] bg-[#607A69] text-[#F1EFE5] text-[10px] font-bold rounded-full flex items-center justify-center px-1 border border-[#1E2D2A]">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline">Cart</span>
            </button>

            {/* Become a Seller */}
            <a
              href="#seller"
              onClick={(e) => {
                e.preventDefault();
                alert("Become a Seller: List your pre-owned or artisan kitchenware on Chilly Flakes!");
              }}
              className="hidden lg:flex items-center gap-2 text-xs font-semibold text-[#F1EFE5] hover:text-[#8A9C82] transition-colors"
            >
              <Store className="w-4 h-4 text-[#8A9C82]" />
              <span>Become a Seller</span>
            </a>

            {/* More Menu */}
            <div 
              className="relative hidden sm:block"
              onMouseEnter={() => setShowMoreMenu(true)}
              onMouseLeave={() => setShowMoreMenu(false)}
            >
              <button 
                className="p-1 text-[#F1EFE5] hover:text-[#8A9C82] rounded"
                aria-label="More options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-[#1E2D2A] text-[#F1EFE5] rounded-md shadow-forest-lg border border-[#355247] py-2 z-50 text-xs">
                  <a 
                    href="#notif" 
                    onClick={(e) => { e.preventDefault(); alert("Notification Preferences: Enabled."); }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#2D403D] text-[#F1EFE5]"
                  >
                    <Bell className="w-4 h-4 text-[#8A9C82]" />
                    <span>Notification Preferences</span>
                  </a>
                  <a 
                    href="#support" 
                    onClick={(e) => { e.preventDefault(); alert("24x7 Customer Care: Dial 1800-CHILLY-HELP"); }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#2D403D] text-[#F1EFE5]"
                  >
                    <Headphones className="w-4 h-4 text-[#8A9C82]" />
                    <span>24x7 Customer Care</span>
                  </a>
                  <a 
                    href="#advertise" 
                    onClick={(e) => { e.preventDefault(); alert("Advertise with Chilly Flakes Ads Manager"); }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#2D403D] text-[#F1EFE5]"
                  >
                    <TrendingUp className="w-4 h-4 text-[#8A9C82]" />
                    <span>Advertise</span>
                  </a>
                  <a 
                    href="#app" 
                    onClick={(e) => { e.preventDefault(); alert("Download Chilly Flakes App"); }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#2D403D] text-[#F1EFE5]"
                  >
                    <Smartphone className="w-4 h-4 text-[#8A9C82]" />
                    <span>Download App</span>
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
          <div className="fixed inset-0 bg-black/70" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-72 bg-[#1E2D2A] text-[#F1EFE5] p-5 shadow-2xl flex flex-col justify-between border-r border-[#2D403D]">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#2D403D]">
                <span className="font-bold text-lg text-[#F1EFE5]">Chilly Flakes</span>
                <button onClick={() => setMobileMenuOpen(false)}><X className="w-5 h-5 text-[#8A9C82]" /></button>
              </div>
              <div className="space-y-2 text-xs font-semibold">
                <button 
                  onClick={() => { setIsLoginOpen(true); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 px-3 bg-[#355247] text-white rounded text-left font-bold"
                >
                  {user?.isLoggedIn ? `Logged in: ${user.name}` : 'Login & Sign Up'}
                </button>
                <button 
                  onClick={() => { setSelectedCategory('All'); setMobileMenuOpen(false); }}
                  className="w-full py-2 px-3 hover:bg-[#2D403D] text-left"
                >
                  All Categories
                </button>
                <button 
                  onClick={() => { setSelectedCategory('Pre-Owned Deals'); setMobileMenuOpen(false); }}
                  className="w-full py-2 px-3 hover:bg-[#2D403D] text-left text-[#8A9C82]"
                >
                  ⚡ Pre-Owned Super Deals
                </button>
                <button 
                  onClick={() => { setIsCartOpen(true); setMobileMenuOpen(false); }}
                  className="w-full py-2 px-3 hover:bg-[#2D403D] text-left"
                >
                  My Cart ({cartCount})
                </button>
              </div>
            </div>
            <div className="pt-4 border-t border-[#2D403D] text-xs text-[#8A9C82]">
              <span>24x7 Customer Helpline • 1800-CHILLY</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
