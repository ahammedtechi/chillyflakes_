import React from 'react';
import { categories } from '../data/categories';
import { useStore } from '../context/StoreContext';
import { ArrowUpRight } from 'lucide-react';

export const CategorySection: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useStore();

  const handleCategoryClick = (categoryName: string) => {
    if (categoryName === 'PRE-OWNED FINDS') {
      const el = document.getElementById('pre-owned-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    setSelectedCategory(categoryName);
    const shopEl = document.getElementById('shop-section');
    if (shopEl) {
      shopEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="categories-section" className="py-20 sm:py-28 bg-[#263936] text-[#F1EFE5] border-b border-[#2D403D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 pb-6 border-b border-[#355247]/60 gap-4">
          <div>
            <span className="text-[10px] font-semibold tracking-editorial uppercase text-[#8A9C82] block mb-2">
              CATALOGUE DIRECTORY
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#F1EFE5] tracking-tight">
              EXPLORE THE COLLECTION
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#F1EFE5]/70 max-w-md font-light leading-relaxed">
            From hand-hewn wooden turners to borosilicate jars, browse curated objects 
            ready to bring quiet utility to your cooking space.
          </p>
        </div>

        {/* Large Editorial Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;

            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                className={`group cursor-pointer rounded-xl overflow-hidden wood-green-dark border transition-all duration-500 relative flex flex-col justify-between ${
                  isSelected 
                    ? 'border-[#F1EFE5] shadow-forest-lg ring-1 ring-[#F1EFE5]/40' 
                    : 'border-[#355247] hover:border-[#F1EFE5]/60 hover:shadow-forest'
                }`}
              >
                {/* Large Lifestyle / Product Image Container */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-[#1E2D2A]">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />
                  {/* Subtle dark-green gradient vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a2825] via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-300" />
                  
                  {/* Product Count Pill */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-[#172421]/80 backdrop-blur-xs text-[#8A9C82] text-[10px] font-mono border border-[#355247]">
                    {cat.productCount} pcs
                  </div>
                </div>

                {/* Card Content & Details */}
                <div className="p-5 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="font-serif text-base sm:text-lg font-medium tracking-luxury text-[#F1EFE5] group-hover:text-[#F7F5ED] group-hover:translate-x-1 transition-all duration-300">
                        {cat.name}
                      </h3>
                      <div className="w-7 h-7 rounded-full border border-[#355247] group-hover:border-[#F1EFE5]/60 flex items-center justify-center text-[#8A9C82] group-hover:text-[#F1EFE5] transition-colors flex-shrink-0">
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>

                    <p className="text-xs text-[#F1EFE5]/60 font-light line-clamp-1 group-hover:text-[#F1EFE5]/80 transition-colors">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#355247]/50 flex items-center justify-between text-[10px] uppercase tracking-luxury text-[#8A9C82] group-hover:text-[#F1EFE5] transition-colors">
                    <span>VIEW CATEGORY</span>
                    <span className="font-mono">№ 0{categories.indexOf(cat) + 1}</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
