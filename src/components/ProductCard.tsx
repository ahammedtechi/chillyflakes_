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
    <div className="group bg-[#1E2D2A] text-[#F1EFE5] rounded-xl border border-[#355247] hover:border-[#8A9C82]/60 hover:shadow-forest transition-all duration-300 p-3 sm:p-4 flex flex-col justify-between relative">
      
      {/* Top Image Box with Wishlist Button on Warm Cream Surface */}
      <div className="relative aspect-square w-full mb-3 flex items-center justify-center p-3 bg-[#F7F5ED] rounded-lg overflow-hidden border border-[#355247]">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Wishlist Heart Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white text-[#172421] shadow-xs transition-colors z-10"
          title="Wishlist"
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#dfab7e] text-[#dfab7e]' : ''}`} />
        </button>

        {/* Quick View Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setQuickViewProduct(product);
          }}
          className="absolute bottom-2 right-2 p-1.5 rounded-full bg-white text-[#172421] hover:text-[#355247] shadow-sm transition-opacity opacity-0 group-hover:opacity-100 z-10"
          title="Quick View"
          aria-label="Quick View"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>

        {/* Condition Tag on image */}
        <div className="absolute top-2 left-2 z-10">
          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-[#172421] text-[#F1EFE5] border border-[#355247]">
            {product.condition}
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-grow justify-between space-y-2">
        <div>
          {/* Category */}
          <p className="text-[10px] font-semibold text-[#8A9C82] uppercase tracking-wider">
            {product.category}
          </p>

          {/* Title */}
          <h3 
            onClick={() => setQuickViewProduct(product)}
            className="text-xs sm:text-sm font-medium text-[#F1EFE5] group-hover:text-[#8A9C82] transition-colors line-clamp-2 leading-snug cursor-pointer pt-0.5"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Rating Pill + Review Count */}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="inline-flex items-center gap-0.5 bg-[#355247] text-[#F1EFE5] text-[11px] font-bold px-1.5 py-0.5 rounded border border-[#8A9C82]/30">
              <span>{product.rating}</span>
              <Star className="w-2.5 h-2.5 fill-current text-[#dfab7e]" />
            </span>
            <span className="text-xs text-[#8A9C82] font-normal">
              ({product.reviewsCount.toLocaleString()})
            </span>
            
            {/* Assured Badge */}
            {product.isAssured && (
              <span className="ml-auto inline-flex items-center text-[10px] italic font-bold text-[#F1EFE5]">
                <span>f</span>
                <span className="text-[#dfab7e] not-italic">✦</span>
                <span className="font-semibold text-[9px] uppercase tracking-tighter text-[#8A9C82] ml-0.5">Assured</span>
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Offer Section */}
        <div className="pt-2 border-t border-[#355247]">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-serif font-light text-[#F1EFE5]">
              ₹{product.price}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-xs text-[#8A9C82]/70 line-through font-mono">
                  ₹{product.originalPrice}
                </span>
                <span className="text-xs font-bold text-[#dfab7e]">
                  {product.discount}% off
                </span>
              </>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#8A9C82] font-medium mt-1">
            <span>Free delivery</span>
            <span className="text-[#8A9C82]/70 font-normal text-[10px]">
              Daily Essential
            </span>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={() => addToCart(product, 1)}
            className="w-full mt-3 py-2 px-3 rounded-lg bg-[#355247] hover:bg-[#436558] text-[#F1EFE5] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 border border-[#8A9C82]/30 shadow-xs"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>

      </div>

    </div>
  );
};
