import React from 'react';
import { ArrowRight, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const DealsBanner: React.FC = () => {
  const { setSelectedCategory, showToast } = useStore();

  const handleShop = () => {
    setSelectedCategory('All');
    const shopEl = document.getElementById('shop-section');
    if (shopEl) {
      shopEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText('EARTHY10');
    showToast('Code EARTHY10 copied for 10% off at checkout', 'success');
  };

  return (
    <section id="deals-section" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Large Green Wooden Banner */}
      <div className="relative rounded-2xl overflow-hidden wood-green-surface border border-[#355247] shadow-forest-lg">
        
        {/* Subtle Dark Forest Green Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#172421]/94 via-[#233733]/88 to-[#1E2D2A]/85 pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 px-8 sm:px-14 lg:px-20 py-16 sm:py-20 text-[#F1EFE5] flex flex-col lg:flex-row items-center justify-between gap-10">
          
          <div className="max-w-xl text-center lg:text-left space-y-5">
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-editorial text-[#8A9C82] border border-[#8A9C82]/30 px-3 py-1 rounded-full bg-[#172421]/60">
              <Tag className="w-3 h-3 text-[#8A9C82]" />
              <span>SPECIAL PROMOTION</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-[#F1EFE5] leading-[1.1] tracking-tight">
              SMALL THINGS. <br />
              <span className="font-serif italic font-normal text-[#F7F5ED]">BIG DIFFERENCE.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#F1EFE5]/85 font-light leading-relaxed max-w-md">
              From kitchen spoons to everyday household essentials, discover useful finds 
              at prices that make sense. Simple items that bring lasting rhythm to your day.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                onClick={handleShop}
                className="px-8 py-3.5 bg-[#F1EFE5] hover:bg-[#F7F5ED] text-[#172421] text-xs font-semibold tracking-luxury uppercase transition-all duration-300 shadow-forest hover:-translate-y-0.5 flex items-center gap-2 group"
              >
                <span>SHOP THE COLLECTION</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleCopyCode}
                className="px-5 py-3.5 border border-[#8A9C82]/40 text-[#8A9C82] hover:text-[#F1EFE5] hover:border-[#F1EFE5] text-xs uppercase tracking-luxury font-medium transition-colors"
                title="Copy code EARTHY10"
              >
                USE CODE: <strong className="font-mono text-[#F1EFE5]">EARTHY10</strong>
              </button>
            </div>
          </div>

          {/* Right Spotlight Detail Card */}
          <div className="w-full max-w-sm bg-[#1E2D2A]/90 backdrop-blur-md rounded-xl p-6 border border-[#355247] shadow-forest space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#355247] text-[10px] uppercase tracking-luxury text-[#8A9C82]">
              <span>CURATOR'S DAILY PICK</span>
              <span className="text-[#F1EFE5]">№ 08</span>
            </div>

            <div className="flex gap-4 items-center">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#F7F5ED] p-2 flex-shrink-0 border border-[#355247]">
                <img
                  src="https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=300&q=80"
                  alt="Wooden Cooking Spoon"
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>

              <div>
                <span className="text-[9px] font-mono uppercase text-[#8A9C82] bg-[#172421] px-1.5 py-0.5 rounded">
                  PRE-OWNED
                </span>
                <h4 className="font-serif font-light text-base text-[#F1EFE5] mt-1">
                  Wooden Cooking Spoon
                </h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-serif text-base text-[#F1EFE5]">₹189</span>
                  <span className="text-xs text-[#8A9C82]/60 line-through">₹320</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleShop}
              className="w-full py-2.5 rounded-lg bg-[#355247] hover:bg-[#436558] text-[#F1EFE5] text-xs uppercase tracking-luxury font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <span>CLAIM TODAY'S PIECE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
