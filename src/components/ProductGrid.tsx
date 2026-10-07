import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { useStore } from '../context/StoreContext';

export const ProductGrid: React.FC = () => {
  const { products, selectedCategory, setSelectedCategory } = useStore();
  const [activeTab, setActiveTab] = useState<string>('All');
  const [sortOption, setSortOption] = useState<string>('popularity');

  const filterTabs = [
    { label: 'All Items', value: 'All' },
    { label: '⚡ Pre-Owned Super Deals', value: 'Pre-Owned' },
    { label: 'Kitchen Utensils', value: 'Kitchen Utensils' },
    { label: 'Cutlery & Spoons', value: 'Cutlery & Spoons' },
    { label: 'Plates & Bowls', value: 'Plates & Bowls' },
    { label: 'Storage & Jars', value: 'Storage & Jars' },
    { label: 'Cookware & Pans', value: 'Cookware & Pans' },
  ];

  // Filtering products
  const filteredProducts = products.filter((item) => {
    const categoryMatches =
      selectedCategory === 'All' ||
      item.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === 'Pre-Owned Deals' && item.condition === 'Pre-Owned');

    const tabMatches =
      activeTab === 'All' ||
      (activeTab === 'Pre-Owned' && item.condition === 'Pre-Owned') ||
      item.category.toLowerCase().includes(activeTab.toLowerCase());

    return categoryMatches && tabMatches;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price-low') return a.price - b.price;
    if (sortOption === 'price-high') return b.price - a.price;
    if (sortOption === 'discount') return b.discount - a.discount;
    if (sortOption === 'rating') return b.rating - a.rating;
    return b.reviewsCount - a.reviewsCount;
  });

  return (
    <section id="shop-section" className="max-w-[1360px] mx-auto px-3 sm:px-6 py-4 sm:py-6 text-[#1D251E]">
      <div className="bg-white rounded-3xl shadow-soft border border-[#E2E7DF] p-5 sm:p-8">
        
        {/* Header & Filter Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#EEF2EB] gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1D251E]">
                Top Selection in Kitchen & Homeware
              </h2>
              <span className="text-xs text-[#5F6D61] font-mono bg-[#F4F6F2] px-2 py-0.5 rounded-full border border-[#DFE6DD]">
                {sortedProducts.length} items
              </span>
            </div>
            <p className="text-xs text-[#5F6D61] mt-1 font-normal">
              Explore curated offers, pre-owned verified finds, and daily kitchen essentials.
            </p>
          </div>

          {/* Sort Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 text-xs overflow-x-auto no-scrollbar">
            <span className="font-semibold text-[#7C8B7E] mr-1 hidden sm:inline uppercase text-[11px] tracking-wider">Sort By</span>
            {[
              { id: 'popularity', label: 'Popularity' },
              { id: 'price-low', label: 'Price -- Low to High' },
              { id: 'price-high', label: 'Price -- High to Low' },
              { id: 'discount', label: 'Discount' },
              { id: 'rating', label: 'Customer Rating' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSortOption(opt.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  sortOption === opt.id
                    ? 'text-[#3C4A3E] bg-[#F0F4EE] border border-[#D5E1D3] font-bold'
                    : 'text-[#7C8B7E] hover:text-[#1D251E]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 no-scrollbar border-b border-[#EEF2EB]">
          {filterTabs.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => {
                  setActiveTab(tab.value);
                  setSelectedCategory('All');
                }}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                  tab.value === 'Pre-Owned'
                    ? isActive
                      ? 'bg-[#D82C20] text-white border-[#D82C20] font-semibold shadow-xs'
                      : 'bg-[#FDECEB] text-[#D82C20] border-[#FAC7C3] hover:bg-[#FCD8D5] font-semibold'
                    : isActive
                      ? 'bg-[#3C4A3E] text-white border-[#3C4A3E] font-semibold shadow-xs'
                      : 'bg-[#F4F6F2] text-[#2C382E] border-[#DFE6DD] hover:border-[#3C4A3E] hover:bg-[#EAEFE8]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 4-Column Product Grid */}
        <div className="pt-6">
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-[#5F6D61]">
              <p className="text-sm font-semibold text-[#1D251E]">No products found</p>
              <p className="text-xs mt-1">Please try changing the filter or sorting options.</p>
              <button
                onClick={() => { setActiveTab('All'); setSelectedCategory('All'); }}
                className="mt-4 px-5 py-2 bg-[#3C4A3E] hover:bg-[#2C372D] text-white rounded-full text-xs font-semibold transition-colors shadow-xs"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
