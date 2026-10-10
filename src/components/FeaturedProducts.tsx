import React from 'react';
import { Star, ArrowRight, Eye } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import type { Product } from '../types';

export const FeaturedProducts: React.FC = () => {
  const { products, addToCart, setQuickViewProduct, showToast, selectedCategory, setSelectedCategory } = useStore();

  // Layer 1: First 5 products (Screenshot row)
  const featuredRowProducts = selectedCategory === 'All' || selectedCategory === 'Services'
    ? products.slice(0, 5)
    : products.filter(p => p.category === selectedCategory).slice(0, 5);

  // Layer 2: Second 5 products (Different products, exact same card design)
  const trendingRowProducts = selectedCategory === 'All' || selectedCategory === 'Services'
    ? products.slice(5, 10)
    : products.filter(p => p.category === selectedCategory).slice(5, 10);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product, 1);
    showToast(`Added ${product.name} to your cart!`, 'success');
  };

  const getSubLabel = (product: Product) => {
    if (product.features && product.features.length > 0) {
      return product.features[0];
    }
    if (product.name.includes('Cream')) return '100% Natural | Handmade';
    if (product.name.includes('Soap')) return 'Natural | Vegan';
    if (product.name.includes('Necklace')) return 'Handcrafted Jewelry';
    if (product.name.includes('Dress')) return 'Comfortable | Eco-friendly';
    if (product.name.includes('Hanger')) return 'Handmade | Home Décor';
    if (product.name.includes('Mug')) return 'Artisan Pottery | Stoneware';
    if (product.name.includes('Candle')) return '100% Pure Soy | Aromatherapy';
    if (product.name.includes('Tote')) return 'Handwoven | Eco-friendly';
    if (product.name.includes('Salts')) return 'Organic Mineral | Relaxing';
    if (product.name.includes('Board')) return 'Seasoned Wood | Kitchen & Table';
    return '100% Natural | Handmade';
  };

  const renderProductCard = (product: Product) => {
    const subLabel = getSubLabel(product);

    return (
      <div
        key={product.id}
        onClick={() => setQuickViewProduct(product)}
        className="group bg-white rounded-2xl overflow-hidden border border-[#ECE7DD] hover:border-[#C6D5C5] transition-all duration-300 hover:shadow-lg flex flex-col justify-between cursor-pointer"
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-[#F6F3EC] p-2">
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80';
            }}
            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
          />

          {/* Quick View Button on Hover */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="bg-white/95 text-[#2E4D34] text-xs font-semibold py-1.5 px-3 rounded-full shadow-sm flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> Quick View
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-3.5 sm:p-4 flex flex-col flex-grow justify-between">
          <div>
            {/* Title */}
            <h3 className="font-medium text-xs sm:text-sm text-[#223B28] group-hover:text-[#2E4D34] transition-colors line-clamp-1">
              {product.name}
            </h3>

            {/* Subtitle / Tag */}
            <p className="text-[10px] sm:text-[11px] text-[#6C7B6D] mt-0.5 line-clamp-1">
              {subLabel}
            </p>

            {/* Price */}
            <div className="mt-2 text-xs sm:text-sm font-bold text-[#223B28]">
              CAD ${product.price.toFixed(2)}
            </div>

            {/* Star Rating with Review Count */}
            <div className="flex items-center gap-1 mt-1.5">
              <div className="flex items-center text-[#E5A024]">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-3 h-3 fill-current text-[#E5A024]" 
                  />
                ))}
              </div>
              <span className="text-[10px] text-[#7E8F80]">
                ({product.reviewsCount})
              </span>
            </div>
          </div>

          {/* Deep Green Add to Cart Button matching screenshot */}
          <div className="mt-3.5 sm:mt-4 pt-1">
            <button
              onClick={(e) => handleAddToCart(e, product)}
              className="w-full py-2 bg-[#2E4D34] hover:bg-[#233B27] text-white text-xs font-medium rounded-lg transition-colors duration-200 active:scale-98 shadow-2xs"
            >
              Add to Cart
            </button>
          </div>
        </div>

      </div>
    );
  };

  return (
    <div className="space-y-12 sm:space-y-16">
      
      {/* ========================================================
          LAYER 1: FEATURED PRODUCTS ROW (Matches original screenshot)
          ======================================================== */}
      <section id="featured-products-section" className="pt-12 sm:pt-16 pb-2 bg-[#FAF7F2]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          
          {/* Header 1 */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#223B28] tracking-tight">
                Featured Products
              </h2>
              {selectedCategory !== 'All' && selectedCategory !== 'Services' && (
                <p className="text-xs text-[#556956] mt-1">
                  Showing items in <span className="font-semibold text-[#2E4D34]">{selectedCategory}</span> &bull;{' '}
                  <button 
                    onClick={() => setSelectedCategory('All')} 
                    className="underline hover:text-[#2E4D34]"
                  >
                    View all
                  </button>
                </p>
              )}
            </div>

            <button 
              onClick={() => setSelectedCategory('All')}
              className="group flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#2D3A2F] hover:text-[#2E4D34] transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#2E4D34]" />
            </button>
          </div>

          {/* Layer 1 Grid: 5 Products */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5 md:gap-6">
            {featuredRowProducts.map(renderProductCard)}
          </div>

        </div>
      </section>

      {/* ========================================================
          LAYER 2: SECOND FEATURE LAYER (Requested New Layer)
          - Exactly the same design
          - 5 different products
          ======================================================== */}
      {trendingRowProducts.length > 0 && (
        <section id="trending-products-section" className="pb-12 sm:pb-16 bg-[#FAF7F2] border-b border-[#ECE7DD]">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
            
            {/* Header 2 */}
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#223B28] tracking-tight">
                  Trending Handcrafted Finds
                </h2>
                <p className="text-xs text-[#556956] mt-0.5">
                  Artisan creations loved by our mindful community
                </p>
              </div>

              <button 
                onClick={() => setSelectedCategory('All')}
                className="group flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#2D3A2F] hover:text-[#2E4D34] transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#2E4D34]" />
              </button>
            </div>

            {/* Layer 2 Grid: 5 Different Products with identical design */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5 md:gap-6">
              {trendingRowProducts.map(renderProductCard)}
            </div>

          </div>
        </section>
      )}

    </div>
  );
};

export default FeaturedProducts;
