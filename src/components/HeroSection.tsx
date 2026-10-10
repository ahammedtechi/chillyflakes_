import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroSlide {
  id: string;
  subtitle: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  buttonText: string;
}

const slides: HeroSlide[] = [
  {
    id: 'slide-1',
    subtitle: 'WELCOME TO CHILLYFLAKES',
    titleLine1: 'Natural Products',
    titleLine2: 'Handmade with Love',
    description: 'Discover unique, eco-friendly products, beautiful jewelry, fashionable clothes, home décor and professional services — all from talented local sellers.',
    buttonText: 'Shop Now',
  },
  {
    id: 'slide-2',
    subtitle: 'MINDFUL ARTISAN GOODS',
    titleLine1: 'Artisan Kitchen',
    titleLine2: 'Crafted with Passion',
    description: 'Carefully seasoned cookware, hand-carved teak spoons, and stone ceramics crafted to nourish your everyday home rituals.',
    buttonText: 'Explore Collection',
  },
  {
    id: 'slide-3',
    subtitle: 'PURE BOTANICAL CARE',
    titleLine1: 'Organic Self-Care',
    titleLine2: 'Pure Botanical Touch',
    description: 'Cold-pressed botanical oils, lavender artisanal soaps, and pure soy candles blended with zero toxic additives.',
    buttonText: 'Discover Wellness',
  }
];

export const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = slides[currentSlide];

  const handleShopNow = () => {
    const el = document.getElementById('featured-products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      className="relative min-h-[440px] sm:min-h-[480px] lg:min-h-[510px] w-full flex items-center overflow-hidden border-b border-[#ECE7DD] bg-[#FAF5EE]"
      style={{
        backgroundImage: "url('/hero-banner.jpg')",
        backgroundPosition: 'right 30% center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* 
        Exact Shade Gradient matching reference screenshot:
        - On desktop: Fades from solid warm cream (#FAF5EE) on the left over the text, 
          gently tapering into transparency across the center to reveal the artisan platter,
          burlap jar, lavender soaps, candle and kraft tag on the right.
        - On mobile: Soft overlay ensuring 100% legibility while keeping the goods visible below.
      */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, #FAF5EE 0%, #FAF5EE 32%, rgba(250, 245, 238, 0.94) 44%, rgba(250, 245, 238, 0.68) 56%, rgba(250, 245, 238, 0.2) 72%, transparent 88%)'
        }}
      />

      {/* Mobile-specific additional top-to-bottom soft readability gradient */}
      <div 
        className="absolute inset-0 pointer-events-none md:hidden"
        style={{
          background: 'linear-gradient(to bottom, rgba(250, 245, 238, 0.95) 0%, rgba(250, 245, 238, 0.88) 55%, rgba(250, 245, 238, 0.3) 100%)'
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 w-full py-12 sm:py-16">
        <div className="max-w-xl lg:max-w-lg space-y-4 sm:space-y-5">
          
          {/* Small tracked uppercase subtitle matching screenshot */}
          <div className="text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] text-[#63725F] uppercase">
            {slide.subtitle}
          </div>

          {/* 
            Exact Two-Tone Serif Headline from screenshot:
            - "Natural Products" in deep forest olive green (#203D26)
            - "Handmade with Love" in warm earthy terracotta/amber brown (#7B3F1B)
          */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold leading-[1.14] tracking-tight">
            <span className="text-[#203D26] block">
              {slide.titleLine1}
            </span>
            <span className="text-[#7B3F1B] block mt-1">
              {slide.titleLine2}
            </span>
          </h1>

          {/* Descriptive text matching screenshot */}
          <p className="text-xs sm:text-sm md:text-[14px] text-[#4F5B4E] leading-relaxed max-w-md font-normal">
            {slide.description}
          </p>

          {/* Pill Button: Deep forest green with right arrow */}
          <div className="pt-2">
            <button
              onClick={handleShopNow}
              className="inline-flex items-center gap-2.5 px-7 py-3 bg-[#2D4F32] hover:bg-[#223E27] text-white text-xs sm:text-sm font-medium rounded-full shadow-xs hover:shadow-md transition-all duration-300 group active:scale-98"
            >
              <span>{slide.buttonText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </div>

      {/* 
        Centered Carousel Dots matching screenshot:
        Positioned horizontally in the bottom center of the hero section
      */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'w-3 h-3 bg-[#2D4F32] ring-2 ring-[#2D4F32]/25'
                : 'w-2.5 h-2.5 bg-white/90 border border-[#D5DDD3] hover:bg-[#2D4F32]/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </section>
  );
};

export default HeroSection;
