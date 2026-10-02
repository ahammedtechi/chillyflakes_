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
    <section id="shop-section" className="max-w-[1360px] mx-auto px-2 sm:px-4 py-4 sm:py-6 text-[#F1EFE5]">
      <div className="bg-[#263936] rounded-xl shadow-forest border border-[#355247] p-4 sm:p-6">
        
        {/* Header & Filter Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#355247] gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-serif font-light text-[#F1EFE5]">
                Top Selection in Kitchen & Homeware
              </h2>
              <span className="text-xs text-[#8A9C82] font-mono">
                ({sortedProducts.length} items)
              </span>
            </div>
            <p className="text-xs text-[#F1EFE5]/75 mt-0.5 font-light">
              Explore curated offers, pre-owned verified finds, and daily kitchen essentials.
            </p>
          </div>

          {/* Sort Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 text-xs overflow-x-auto no-scrollbar">
            <span className="font-semibold text-[#8A9C82] mr-1 hidden sm:inline uppercase text-[11px] tracking-wider">Sort By</span>
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
                className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                  sortOption === opt.id
                    ? 'text-[#F1EFE5] border-b-2 border-[#8A9C82] font-bold'
                    : 'text-[#8A9C82] hover:text-[#F1EFE5]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto py-3.5 no-scrollbar border-b border-[#355247]">
          {filterTabs.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => {
                  setActiveTab(tab.value);
                  setSelectedCategory('All');
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
                  isActive
                    ? 'bg-[#F1EFE5] text-[#172421] border-[#F1EFE5] font-bold shadow-xs'
                    : 'bg-[#1E2D2A] text-[#F1EFE5] border-[#355247] hover:border-[#8A9C82]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 4-Column Product Grid */}
        <div className="pt-5">
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-[#8A9C82]">
              <p className="text-sm font-semibold text-[#F1EFE5]">No products found</p>
              <p className="text-xs mt-1">Please try changing the filter or sorting options.</p>
              <button
                onClick={() => { setActiveTab('All'); setSelectedCategory('All'); }}
                className="mt-4 px-4 py-2 bg-[#355247] hover:bg-[#436558] text-[#F1EFE5] rounded-lg text-xs font-bold"
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
