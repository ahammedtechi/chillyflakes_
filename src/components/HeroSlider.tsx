import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface BannerSlide {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  ctaText: string;
  discount: string;
  bgGradient: string;
  image: string;
  category: string;
}

const slides: BannerSlide[] = [
  {
    id: 'slide-1',
    tag: 'BIG KITCHEN BONANZA',
    title: 'Everyday Kitchen Essentials',
    subtitle: 'Wooden Spoons, Stoneware Plates & Stainless Steel Utensils',
    ctaText: 'Shop Now',
    discount: 'UP TO 70% OFF',
    bgGradient: 'from-[#172421] via-[#233733] to-[#263936]',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80',
    category: 'Kitchen Utensils',
  },
  {
    id: 'slide-2',
    tag: 'CERTIFIED CIRCULAR SALE',
    title: 'Pre-Owned & Inspected Homeware',
    subtitle: 'Individually sanitized, tested and backed by 7-day doorstep replacement',
    ctaText: 'Explore Pre-Owned',
    discount: 'FLAT 45% OFF',
    bgGradient: 'from-[#1a2825] via-[#263936] to-[#2d403d]',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
    category: 'Pre-Owned Deals',
  },
  {
    id: 'slide-3',
    tag: 'PANTRY ORGANISER SPECIAL',
    title: 'Airtight Glass Jars & Containers',
    subtitle: 'Borosilicate glass canisters with natural acacia wood seals',
    ctaText: 'Grab Deal',
    discount: 'STARTING AT ₹189',
    bgGradient: 'from-[#1f302d] via-[#283e39] to-[#355247]',
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=1000&q=80',
    category: 'Storage & Jars',
  },
];

export const HeroSlider: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const { setSelectedCategory } = useStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => setCurrentIdx((prev) => (prev + 1) % slides.length);
  const handlePrev = () => setCurrentIdx((prev) => (prev - 1 + slides.length) % slides.length);

  const handleBannerClick = (cat: string) => {
    setSelectedCategory(cat);
    const shopEl = document.getElementById('shop-section');
    if (shopEl) shopEl.scrollIntoView({ behavior: 'smooth' });
  };

  const slide = slides[currentIdx];

  return (
    <section className="max-w-[1360px] mx-auto px-2 sm:px-4 py-3 sm:py-4">
      <div className="relative rounded-xl overflow-hidden shadow-forest border border-[#355247] group wood-green-surface">
        
        {/* Banner Content Container */}
        <div 
          onClick={() => handleBannerClick(slide.category)}
          className={`cursor-pointer bg-gradient-to-r ${slide.bgGradient} text-[#F1EFE5] flex flex-col md:flex-row items-center justify-between min-h-[260px] sm:min-h-[320px] p-6 sm:p-10 relative transition-all duration-700`}
        >
          {/* Left Text Banner */}
          <div className="max-w-xl z-10 space-y-3 sm:space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#172421]/70 backdrop-blur-xs border border-[#8A9C82]/30 text-[#8A9C82] text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{slide.tag}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-light tracking-tight leading-tight text-[#F1EFE5]">
              {slide.title}
            </h1>

            <p className="text-xs sm:text-sm text-[#F1EFE5]/85 font-light max-w-md">
              {slide.subtitle}
            </p>

            <div className="pt-2 flex items-center justify-center md:justify-start gap-4">
              <div className="px-4 py-2 bg-[#F1EFE5] text-[#172421] rounded font-bold text-xs uppercase tracking-wide shadow-md">
                {slide.discount}
              </div>

              <button className="px-6 py-2 bg-[#2D403D] border border-[#355247] hover:border-[#8A9C82] text-[#F1EFE5] rounded font-medium text-xs uppercase tracking-wider transition-colors shadow-sm">
                {slide.ctaText}
              </button>
            </div>
          </div>

          {/* Right Product Image with subtle shadow */}
          <div className="z-10 mt-6 md:mt-0 flex-shrink-0">
            <div className="w-64 sm:w-80 h-44 sm:h-56 rounded-lg overflow-hidden border border-[#355247] shadow-2xl">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Assured seal watermark */}
          <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-[#172421]/60 border border-[#355247] backdrop-blur-xs text-xs font-bold text-[#8A9C82]">
            <ShieldCheck className="w-4 h-4 text-[#8A9C82]" />
            <span>Chilly Flakes Assured</span>
          </div>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <button
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-16 bg-[#172421]/80 hover:bg-[#172421] text-[#F1EFE5] border border-[#355247] rounded-r shadow-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20"
          aria-label="Previous banner"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-16 bg-[#172421]/80 hover:bg-[#172421] text-[#F1EFE5] border border-[#355247] rounded-l shadow-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20"
          aria-label="Next banner"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Indicator Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrentIdx(i); }}
              className={`h-1.5 rounded-full transition-all ${
                currentIdx === i ? 'w-6 bg-[#8A9C82]' : 'w-1.5 bg-white/40'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
