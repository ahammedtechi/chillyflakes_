import React, { useState } from 'react';
import { categories } from '../data/categories';
import { useStore } from '../context/StoreContext';
import { ChevronDown } from 'lucide-react';

export const CategoryBar: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useStore();
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    const shopEl = document.getElementById('shop-section');
    if (shopEl) {
      shopEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-[#263936] border-b border-[#355247] shadow-forest py-3 sm:py-3.5 relative z-30 text-[#F1EFE5]">
      <div className="max-w-[1360px] mx-auto px-2 sm:px-4">
        
        {/* Horizontal Category Strip */}
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-4 sm:gap-6 lg:gap-8 px-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;

            return (
              <div
                key={cat.id}
                className="relative flex-shrink-0 group"
                onMouseEnter={() => setHoveredCat(cat.id)}
                onMouseLeave={() => setHoveredCat(null)}
              >
                <button
                  onClick={() => handleCategoryClick(cat.name)}
                  className="flex flex-col items-center gap-1.5 focus:outline-none"
                >
                  {/* Category Image Circle */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden p-1 bg-[#1E2D2A] border border-[#355247] group-hover:border-[#8A9C82] transition-colors flex items-center justify-center shadow-forest-sm">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                    />
                  </div>

                  {/* Title & Dropdown Caret */}
                  <div className="flex items-center gap-0.5">
                    <span className={`text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-colors ${
                      isSelected ? 'text-[#8A9C82]' : 'text-[#F1EFE5] group-hover:text-[#8A9C82]'
                    }`}>
                      {cat.name}
                    </span>
                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <ChevronDown className="w-3 h-3 text-[#8A9C82] group-hover:text-[#F1EFE5] group-hover:rotate-180 transition-transform duration-200" />
                    )}
                  </div>
                </button>

                {/* Subcategories Hover Dropdown Menu */}
                {hoveredCat === cat.id && cat.subcategories && cat.subcategories.length > 0 && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-[#1E2D2A] rounded-md shadow-forest-lg border border-[#355247] py-2 z-50 text-xs text-[#F1EFE5]">
                    <div className="px-3 py-1 text-[10px] font-bold text-[#8A9C82] uppercase border-b border-[#2D403D]">
                      {cat.name} Subcategories
                    </div>
                    {cat.subcategories.map((sub, i) => (
                      <button
                        key={i}
                        onClick={() => handleCategoryClick(cat.name)}
                        className="w-full text-left px-3 py-2 hover:bg-[#2D403D] hover:text-[#8A9C82] font-medium text-[#F1EFE5] transition-colors block"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
