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
    <section className="bg-white border-b border-[#E5EAE2] shadow-xs py-3 sm:py-3.5 relative z-30 text-[#1D251E]">
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
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden p-1 bg-[#F4F6F2] border transition-all flex items-center justify-center shadow-xs ${
                    isSelected ? 'border-[#3C4A3E] ring-2 ring-[#3C4A3E]/20' : 'border-[#DFE6DD] group-hover:border-[#3C4A3E]'
                  }`}>
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-full group-hover:scale-108 transition-transform duration-300"
                    />
                  </div>

                  {/* Title & Dropdown Caret */}
                  <div className="flex items-center gap-0.5">
                    <span className={`text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-colors ${
                      isSelected ? 'text-[#3C4A3E] font-bold' : 'text-[#2C382E] group-hover:text-[#3C4A3E]'
                    }`}>
                      {cat.name}
                    </span>
                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <ChevronDown className="w-3 h-3 text-[#7F8F81] group-hover:text-[#3C4A3E] group-hover:rotate-180 transition-transform duration-200" />
                    )}
                  </div>
                </button>

                {/* Subcategories Hover Dropdown Menu */}
                {hoveredCat === cat.id && cat.subcategories && cat.subcategories.length > 0 && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#E2E7DF] py-2 z-50 text-xs text-[#1D251E]">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-[#5F6D61] uppercase border-b border-[#EEF2EB] bg-[#F9FAF8]">
                      {cat.name}
                    </div>
                    {cat.subcategories.map((sub, i) => (
                      <button
                        key={i}
                        onClick={() => handleCategoryClick(cat.name)}
                        className="w-full text-left px-3 py-2 hover:bg-[#F4F6F2] hover:text-[#3C4A3E] font-medium text-[#1D251E] transition-colors block"
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
