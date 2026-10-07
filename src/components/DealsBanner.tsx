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
    <section id="deals-section" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Signature Deep Olive Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#3C4A3E] text-white shadow-soft">
        
        {/* Content Container */}
        <div className="relative z-10 px-8 sm:px-14 lg:px-20 py-14 sm:py-18 flex flex-col lg:flex-row items-center justify-between gap-10">
          
          <div className="max-w-xl text-center lg:text-left space-y-4">
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#C4D3C2] border border-[#526453] px-3.5 py-1 rounded-full bg-[#344136]">
              <Tag className="w-3.5 h-3.5 text-[#C4D3C2]" />
              <span className="font-semibold">SPECIAL PROMOTION</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-[1.1] tracking-tight">
              Small Things. <br />
              <span className="font-serif italic font-normal text-[#ECDBC2]">Big Difference.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#E4EBE2]/90 font-normal leading-relaxed max-w-md">
              From kitchen spoons to everyday household essentials, discover useful finds 
              at prices that make sense. Simple items that bring lasting rhythm to your day.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                onClick={handleShop}
                className="px-8 py-3.5 bg-white hover:bg-[#F4F6F2] text-[#3C4A3E] text-xs font-bold tracking-wider uppercase transition-all duration-300 rounded-full shadow-xs hover:-translate-y-0.5 flex items-center gap-2 group"
              >
                <span>Shop the Collection</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleCopyCode}
                className="px-5 py-3.5 border border-[#647866] text-[#C4D3C2] hover:text-white hover:border-white text-xs uppercase tracking-wider font-semibold transition-colors rounded-full"
                title="Copy code EARTHY10"
              >
                USE CODE: <strong className="font-mono text-white">EARTHY10</strong>
              </button>
            </div>
          </div>

          {/* Right Spotlight Detail Card */}
          <div className="w-full max-w-sm bg-white text-[#1D251E] rounded-3xl p-6 border border-[#E2E7DF] shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEF2EB] text-[10px] uppercase tracking-wider text-[#5F6D61] font-bold">
              <span>CURATOR'S DAILY PICK</span>
              <span className="text-[#3C4A3E]">№ 08</span>
            </div>

            <div className="flex gap-4 items-center">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#F4F6F2] p-2 flex-shrink-0 border border-[#E5EAE2]">
                <img
                  src="https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=300&q=80"
                  alt="Wooden Cooking Spoon"
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>

              <div>
                <span className="text-[9px] font-sans font-bold uppercase text-[#3C4A3E] bg-[#EAF0E6] px-2 py-0.5 rounded-full">
                  PRE-OWNED
                </span>
                <h4 className="font-serif font-bold text-base text-[#1D251E] mt-1">
                  Wooden Cooking Spoon
                </h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-bold text-base text-[#3C4A3E]">₹189</span>
                  <span className="text-xs text-[#8A988D] line-through">₹320</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleShop}
              className="w-full py-3 rounded-full bg-[#3C4A3E] hover:bg-[#2C372D] text-white text-xs uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Claim Today's Piece</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
