import React from 'react';
import { Heart, Star, ShoppingCart, Eye } from 'lucide-react';
import type { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useStore();
  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="group bg-[#FFFDFD] text-[#1D251E] rounded-3xl border border-[#EDE3DE] hover:border-[#D82C20]/50 hover:shadow-card-chilly transition-all duration-300 p-3.5 sm:p-4 flex flex-col justify-between relative">
      
      {/* Top Image Box with Subtle Soft Warm Pad */}
      <div className="relative aspect-square w-full mb-3 flex items-center justify-center p-3 bg-[#FAF7F6] rounded-2xl overflow-hidden border border-[#F3EAE8]">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-300"
          loading="lazy"
        />

        {/* Wishlist Heart Icon with Chilly Red accent */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 hover:bg-white text-[#1D251E] shadow-xs transition-colors z-10"
          title="Wishlist"
          aria-label="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#D82C20] text-[#D82C20]' : 'text-[#8C6D65] hover:text-[#D82C20]'}`} />
        </button>

        {/* Quick View Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setQuickViewProduct(product);
          }}
          className="absolute bottom-2.5 right-2.5 p-2 rounded-full bg-white text-[#1D251E] hover:text-[#D82C20] shadow-sm transition-all opacity-0 group-hover:opacity-100 z-10 hover:scale-105"
          title="Quick View"
          aria-label="Quick View"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>

        {/* Condition Tag on image - Chilly Red for Pre-Owned, Deep Olive for other */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className={`text-[9px] font-sans font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs ${
            product.condition === 'Pre-Owned'
              ? 'bg-[#D82C20] text-white'
              : 'bg-[#3C4A3E] text-white'
          }`}>
            {product.condition}
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-grow justify-between space-y-2">
        <div>
          {/* Category */}
          <p className="text-[10px] font-bold text-[#8C6D65] uppercase tracking-wider">
            {product.category}
          </p>

          {/* Title */}
          <h3 
            onClick={() => setQuickViewProduct(product)}
            className="text-xs sm:text-sm font-semibold text-[#1D251E] group-hover:text-[#D82C20] transition-colors line-clamp-2 leading-snug cursor-pointer pt-0.5"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Rating Pill + Review Count */}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="inline-flex items-center gap-1 bg-[#FAF0ED] text-[#D82C20] text-[11px] font-bold px-2 py-0.5 rounded-full border border-[#FAC7C3]">
              <span>{product.rating}</span>
              <Star className="w-2.5 h-2.5 fill-current text-[#D9A34C]" />
            </span>
            <span className="text-[11px] text-[#7C8B7E] font-normal">
              ({product.reviewsCount.toLocaleString()})
            </span>
            
            {/* Assured Badge */}
            {product.isAssured && (
              <span className="ml-auto inline-flex items-center text-[10px] font-bold text-[#3C4A3E]">
                <span className="text-xs mr-0.5">🌿</span>
                <span className="font-semibold text-[9px] uppercase tracking-wider text-[#5F6D61]">Assured</span>
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Offer Section with Chilly Red Highlight */}
        <div className="pt-2.5 border-t border-[#F2E8E4]">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-base sm:text-lg font-bold text-[#1D251E]">
              ₹{product.price}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-xs text-[#8A988D] line-through font-mono">
                  ₹{product.originalPrice}
                </span>
                <span className="text-[11px] font-bold text-[#D82C20] bg-[#FDECEB] border border-[#FAC7C3] px-2 py-0.5 rounded-full">
                  {product.discount}% off
                </span>
              </>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#5F6D61] font-medium mt-1">
            <span>Free delivery</span>
            <span className="text-[#8C6D65] text-[10px]">
              Daily Essential
            </span>
          </div>

          {/* Add to Cart button - Olive with signature Chilly Red hover */}
          <button
            onClick={() => addToCart(product, 1)}
            className="w-full mt-3 py-2.5 px-4 rounded-full bg-[#3C4A3E] hover:bg-[#D82C20] text-white text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-2 shadow-xs hover:shadow-md"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>

      </div>

    </div>
  );
};
