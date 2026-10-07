import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FeaturedHeroItem {
  id: string;
  tag: string;
  italicHeading: string;
  mainHeading: string;
  description: string;
  badge: string;
  category: string;
  productName: string;
  price: string;
  image: string;
}

const heroSlides: FeaturedHeroItem[] = [
  {
    id: 'hero-1',
    tag: 'ORGANIC LIVING',
    italicHeading: 'Hear Every Detail.',
    mainHeading: 'Feel Every Beat of the Home.',
    description: 'Experience mindful living with enduring cookware, cast-iron essentials, and pre-owned treasures curated for modern sustainable homes.',
    badge: 'UP TO 50% OFF',
    category: 'Kitchen Utensils',
    productName: 'Handmade Acacia & Stoneware Collection',
    price: '₹549',
    image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'hero-2',
    tag: 'CERTIFIED CIRCULAR',
    italicHeading: 'Timeless Quality.',
    mainHeading: 'Give Great Goods a Second Life.',
    description: 'Ultrasonic sanitized, structurally inspected homeware backed by 7-day doorstep guarantee. Better for your wallet and the earth.',
    badge: 'FLAT 40% OFF',
    category: 'Pre-Owned Deals',
    productName: 'Vintage Teak Wood Serving Platter',
    price: '₹349',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'hero-3',
    tag: 'PANTRY HARMONY',
    italicHeading: 'Simple Storage.',
    mainHeading: 'Pure Glass & Natural Wood.',
    description: 'Airtight borosilicate glass canisters designed to keep grains, spices, and tea leaves fresh while elevating your countertop.',
    badge: 'STARTING AT ₹199',
    category: 'Storage & Jars',
    productName: 'Borosilicate Bamboo Canister Set',
    price: '₹289',
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=700&q=80',
  },
];

export const HeroSlider: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const { setSelectedCategory } = useStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => setCurrentIdx((prev) => (prev + 1) % heroSlides.length);
  const handlePrev = () => setCurrentIdx((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    const shopEl = document.getElementById('shop-section');
    if (shopEl) shopEl.scrollIntoView({ behavior: 'smooth' });
  };

  const slide = heroSlides[currentIdx];

  return (
    <section className="max-w-[1360px] mx-auto px-3 sm:px-6 py-4 sm:py-6">
      
      {/* 2-Column Hero Structure Matching the Reference Image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Left Editorial Card - Pale Stone/Sage Neutral */}
        <div className="lg:col-span-7 bg-[#EFF2EB] rounded-3xl p-6 sm:p-10 border border-[#DEE5DC] flex flex-col justify-between shadow-soft relative overflow-hidden">
          
          {/* Top Headline & Description */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-[#D5E0D2] text-[#3C4A3E] text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#3C4A3E]" />
              <span>{slide.tag}</span>
            </div>

            <div>
              <p className="font-serif italic text-2xl sm:text-3xl text-[#3C4A3E] font-normal leading-tight">
                {slide.italicHeading}
              </p>
              <h1 className="font-sans font-extrabold text-3xl sm:text-5xl text-[#1D251E] tracking-tight leading-[1.1] mt-1">
                {slide.mainHeading}
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-[#5F6D61] leading-relaxed max-w-xl font-normal">
              {slide.description}
            </p>

            {/* Circular Arrow Action Button (cutout style inspired by design) */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => handleCategoryClick(slide.category)}
                className="w-12 h-12 rounded-full bg-[#3C4A3E] hover:bg-[#2C372D] text-white flex items-center justify-center transition-all hover:scale-105 shadow-sm group"
                aria-label="Explore Collection"
              >
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <span className="text-xs font-semibold text-[#3C4A3E]">
                Explore Collection
              </span>
            </div>
          </div>

          {/* Bottom Dual Promo Cards: Warm Sand & Soft Terracotta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-8 pt-6 border-t border-[#DFE7DB]/60">
            
            {/* Promo Card 1: Warm Sand / Wheat */}
            <div 
              onClick={() => handleCategoryClick('Kitchen Utensils')}
              className="bg-[#ECDBC2] rounded-2xl p-3.5 sm:p-4 border border-[#DECBB0] flex items-center justify-between cursor-pointer group hover:shadow-sm transition-all"
            >
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-semibold text-[#665135] tracking-wider block">
                  Artisan Wood
                </span>
                <p className="text-xs sm:text-sm font-bold text-[#2A2014] leading-tight">
                  Handcrafted Spoon Sets
                </p>
                <button className="mt-1 px-3 py-1 bg-[#3C4A3E] text-white text-[10px] font-semibold rounded-full group-hover:bg-[#2C372D] transition-colors shadow-2xs">
                  Shop Now
                </button>
              </div>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white/60 p-1 flex-shrink-0 flex items-center justify-center ml-2 border border-[#E0D0B6]">
                <img
                  src="https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=250&q=80"
                  alt="Artisan Wood"
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Promo Card 2: Warm Reddish Terracotta / Clay */}
            <div 
              onClick={() => handleCategoryClick('Pre-Owned Deals')}
              className="bg-[#E8C2B4] rounded-2xl p-3.5 sm:p-4 border border-[#DBA696] flex items-center justify-between cursor-pointer group hover:shadow-card-warm transition-all"
            >
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-[#8C3423] tracking-wider block">
                  Verified Finds
                </span>
                <p className="text-xs sm:text-sm font-bold text-[#35150F] leading-tight">
                  Pre-Owned Stoneware
                </p>
                <button className="mt-1 px-3 py-1 bg-[#3C4A3E] text-white text-[10px] font-semibold rounded-full group-hover:bg-[#D82C20] transition-colors shadow-2xs">
                  Shop Now
                </button>
              </div>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white/70 p-1 flex-shrink-0 flex items-center justify-center ml-2 border border-[#DBBCA8]">
                <img
                  src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=250&q=80"
                  alt="Pre-Owned Deals"
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>

          </div>

        </div>

        {/* Right Hero Card - Soft Pastel Sage Green with warm badge */}
        <div className="lg:col-span-5 bg-[#C4D3C2] rounded-3xl p-6 sm:p-8 border border-[#B4C5B1] flex flex-col justify-between items-center relative overflow-hidden shadow-soft min-h-[360px] sm:min-h-[460px]">
          
          {/* Top Badge with Chilly Red accent & Indicator */}
          <div className="w-full flex items-center justify-between z-10">
            <span className="px-3.5 py-1 rounded-full bg-[#FFF7F6] text-[#D82C20] text-[11px] font-bold border border-[#FAC7C3] shadow-2xs">
              {slide.badge}
            </span>
            <div className="flex items-center gap-1.5">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  className={`h-2 rounded-full transition-all ${
                    currentIdx === i ? 'w-6 bg-[#3C4A3E]' : 'w-2 bg-white/60'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Central Featured Product Display */}
          <div 
            onClick={() => handleCategoryClick(slide.category)}
            className="my-auto py-4 cursor-pointer group flex flex-col items-center z-10 w-full"
          >
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 flex items-center justify-center">
              {/* Subtle background glow */}
              <div className="absolute inset-0 bg-white/30 rounded-full blur-2xl transform scale-75 group-hover:scale-90 transition-transform duration-500" />
              
              <img
                src={slide.image}
                alt={slide.productName}
                className="max-w-full max-h-full object-contain rounded-2xl drop-shadow-xl group-hover:scale-105 transition-transform duration-500 relative z-10"
              />
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#3C4A3E]/80">
                Featured Special
              </p>
              <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1D251E] mt-0.5">
                {slide.productName}
              </h3>
              <p className="text-sm font-sans font-extrabold text-[#3C4A3E] mt-1">
                From {slide.price}
              </p>
            </div>
          </div>

          {/* Bottom Slider Nav Arrows */}
          <div className="w-full flex items-center justify-between z-10 pt-2">
            <button
              onClick={handlePrev}
              className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#3C4A3E] flex items-center justify-center shadow-xs transition-colors"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-[11px] font-medium text-[#3C4A3E]/90 tracking-wide">
              {currentIdx + 1} / {heroSlides.length}
            </span>
            <button
              onClick={handleNext}
              className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#3C4A3E] flex items-center justify-center shadow-xs transition-colors"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>

    </section>
  );
};
