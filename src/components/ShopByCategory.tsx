import React, { useState, useEffect } from 'react';
import { categories as initialCategories } from '../data/categories';
import { useStore } from '../context/StoreContext';
import { categoriesApi } from '../api';
import type { Category } from '../types';

export const ShopByCategory: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useStore();
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  useEffect(() => {
    categoriesApi.getCategories().then((res) => {
      if (res.data && res.data.length > 0) {
        setCategories(res.data);
      }
    });
  }, []);

  const handleCategoryClick = (catName: string) => {
    setSelectedCategory(catName);
    if (catName === 'Services') {
      const el = document.getElementById('services-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      const el = document.getElementById('featured-products-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="shop-category-section" className="py-10 sm:py-16 bg-[#FAF7F2] border-b border-[#ECE7DD]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        
        {/* Centered Serif Section Heading matching screenshot */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#223B28] tracking-tight">
            Shop by Category
          </h2>
        </div>

        {/* 8 Circular Category Items:
            - On Desktop: Clean row of 8 columns
            - On Mobile: Smooth swipeable row with scrollbar hidden
        */}
        <div className="flex md:grid md:grid-cols-8 overflow-x-auto no-scrollbar gap-4 sm:gap-5 md:gap-3 lg:gap-5 pb-2 md:pb-0 justify-start md:justify-center px-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                className="group flex flex-col items-center text-center flex-shrink-0 focus:outline-none transition-transform hover:-translate-y-1 w-[82px] sm:w-[98px] md:w-auto"
              >
                {/* Circular Photo Container with subtle border matching screenshot */}
                <div 
                  className={`w-18 h-18 sm:w-22 sm:h-22 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden p-1 bg-[#F4EFE6] border-2 transition-all duration-300 flex items-center justify-center shadow-2xs ${
                    isSelected 
                      ? 'border-[#2E4D34] ring-2 ring-[#2E4D34]/30 scale-105 shadow-md' 
                      : 'border-[#E5DDD0] group-hover:border-[#2E4D34] group-hover:shadow-md'
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.endsWith('/botanical-care-banner.jpg')) {
                        target.src = '/botanical-care-banner.jpg';
                      }
                    }}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Category Label matching screenshot */}
                <span 
                  className={`mt-2.5 sm:mt-3 text-[11px] sm:text-xs md:text-sm font-semibold leading-tight transition-colors line-clamp-2 max-w-[90px] sm:max-w-[110px] ${
                    isSelected 
                      ? 'text-[#2E4D34] font-bold' 
                      : 'text-[#2D3A2F] group-hover:text-[#2E4D34]'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ShopByCategory;
