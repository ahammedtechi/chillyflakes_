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
    <section id="categories-section" className="py-16 sm:py-24 bg-white text-[#1D251E] border-b border-[#E5EAE2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 pb-6 border-b border-[#EEF2EB] gap-4">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#3C4A3E] block mb-2">
              CATALOGUE DIRECTORY
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1D251E] tracking-tight">
              Explore the Collection
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#5F6D61] max-w-md font-normal leading-relaxed">
            From hand-hewn wooden turners to borosilicate jars, browse curated objects 
            ready to bring quiet utility to your cooking space.
          </p>
        </div>

        {/* Large Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;

            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                className={`group cursor-pointer rounded-3xl overflow-hidden bg-[#FAFBF9] border transition-all duration-500 relative flex flex-col justify-between hover:shadow-card ${
                  isSelected 
                    ? 'border-[#3C4A3E] shadow-card ring-2 ring-[#3C4A3E]/30' 
                    : 'border-[#E5EAE2] hover:border-[#3C4A3E]/50'
                }`}
              >
                {/* Large Lifestyle / Product Image Container */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-[#F4F6F2]">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  
                  {/* Product Count Pill */}
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[#3C4A3E] text-[10px] font-bold border border-[#E5EAE2] shadow-2xs">
                    {cat.productCount} pcs
                  </div>
                </div>

                {/* Card Content & Details */}
                <div className="p-5 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#1D251E] group-hover:text-[#3C4A3E] transition-colors">
                        {cat.name}
                      </h3>
                      <div className="w-8 h-8 rounded-full border border-[#DFE6DD] group-hover:border-[#3C4A3E] group-hover:bg-[#3C4A3E] group-hover:text-white flex items-center justify-center text-[#5F6D61] transition-all flex-shrink-0">
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>

                    <p className="text-xs text-[#5F6D61] font-normal line-clamp-1">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#EEF2EB] flex items-center justify-between text-[10px] uppercase font-bold text-[#7C8B7E] group-hover:text-[#3C4A3E] transition-colors">
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
