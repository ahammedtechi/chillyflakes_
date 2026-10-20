import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AnnouncementBar: React.FC = () => {
  const { cartCount, setIsCartOpen, setIsLoginOpen, user } = useStore();

  return (
    <div className="bg-[#243F29] text-[#E8ECE6] text-[10px] sm:text-[11px] font-normal py-1.5 px-3 sm:px-4 border-b border-[#1C3320] relative z-40">
      <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-2">
        {/* Left Side: Tagline with Leaf Icon */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <Sprout className="w-3.5 h-3.5 text-[#A3C4A5] flex-shrink-0" />
          <span className="tracking-wide text-white/90 hidden sm:inline">
            Support Handmade &bull; Choose Natural &bull; Shop Local
          </span>
          <span className="tracking-wide text-white/90 sm:hidden">
            Support Handmade &bull; Shop Local
          </span>
        </div>

        {/* Right Side: Auth Links & Mini Cart */}
        <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-[#E2ECE0]/90 flex-shrink-0">
          {user?.isLoggedIn ? (
            <span className="text-white font-medium truncate max-w-[100px]">Hello, {user.name}</span>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="hover:text-white transition-colors hover:underline"
              >
                Login
              </button>
              <span className="text-[#527357]">|</span>
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="hover:text-white transition-colors hover:underline"
              >
                Register
              </button>
              <span className="text-[#527357] hidden md:inline">|</span>
              <Link 
                to="/vendor/register" 
                className="hover:text-white transition-colors hover:underline hidden md:inline"
              >
                Become a Seller
              </Link>
            </div>
          )}

          {/* Cart Counter */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-1 hover:text-white transition-colors pl-1.5 sm:pl-2 border-l border-[#527357]"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#A3C4A5]" />
            <span className="font-semibold text-white">({cartCount})</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
