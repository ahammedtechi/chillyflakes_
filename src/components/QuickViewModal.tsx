import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  ShoppingCart, 
  Zap, 
  Star, 
  MapPin, 
  Tag,
  Truck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const QuickViewModal: React.FC = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist,
    setIsCartOpen 
  } = useStore();

  const [selectedImg, setSelectedImg] = useState<string>('');
  const [deliveryPincode, setDeliveryPincode] = useState('110001');

  if (!quickViewProduct) return null;

  const isWishlisted = isInWishlist(quickViewProduct.id);
  const currentImage = selectedImg || quickViewProduct.image;

  const handleBuyNow = () => {
    addToCart(quickViewProduct, 1);
    setQuickViewProduct(null);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setQuickViewProduct(null)}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6">
        <div className="relative transform overflow-hidden rounded-3xl bg-white text-[#1D251E] text-left shadow-2xl transition-all w-full max-w-4xl border border-[#E2E7DF]">
          
          {/* Close button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 text-[#5F6D61] hover:text-[#1D251E] hover:bg-[#F4F6F2] rounded-full z-20 p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 p-6 sm:p-8 gap-6 sm:gap-8">
            
            {/* Left Column: Image Box & Buttons */}
            <div className="md:col-span-5 flex flex-col justify-between space-y-4">
              <div className="relative aspect-square w-full border border-[#F3E7E2] rounded-2xl p-4 flex items-center justify-center bg-[#FAF4F0] overflow-hidden">
                <img
                  src={currentImage}
                  alt={quickViewProduct.name}
                  className="max-h-full max-w-full object-contain mix-blend-multiply"
                />

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(quickViewProduct)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white text-[#1D251E] shadow-xs hover:text-[#D82C20] transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#D82C20] text-[#D82C20]' : 'text-[#8C6D65]'}`} />
                </button>

                {/* Condition tag */}
                <span className={`absolute top-3 left-3 text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs ${
                  quickViewProduct.condition === 'Pre-Owned'
                    ? 'bg-[#D82C20] text-white'
                    : 'bg-[#3C4A3E] text-white'
                }`}>
                  {quickViewProduct.condition}
                </span>
              </div>

              {/* Thumbnails */}
              {quickViewProduct.additionalImages && quickViewProduct.additionalImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {quickViewProduct.additionalImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImg(img)}
                      className={`w-14 h-14 p-1 border rounded-xl bg-[#FAF4F0] flex-shrink-0 transition-all ${
                        currentImage === img ? 'border-[#D82C20] ring-1 ring-[#D82C20]' : 'border-[#F3E7E2]'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-contain mix-blend-multiply" />
                    </button>
                  ))}
                </div>
              )}

              {/* Dual Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    addToCart(quickViewProduct, 1);
                    setQuickViewProduct(null);
                  }}
                  className="py-3 bg-white border border-[#3C4A3E] hover:bg-[#FDECEB] hover:border-[#D82C20] text-[#3C4A3E] hover:text-[#D82C20] text-xs font-semibold rounded-full shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-3 bg-[#3C4A3E] hover:bg-[#D82C20] text-white text-xs font-bold rounded-full shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>

            {/* Right Column: Product Specs, Ratings, Offers & Delivery */}
            <div className="md:col-span-7 space-y-4">
              
              <div>
                <p className="text-xs text-[#8C6D65] uppercase font-bold tracking-wider">
                  {quickViewProduct.category}
                </p>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1D251E] mt-1 leading-snug">
                  {quickViewProduct.name}
                </h3>

                {/* Rating Bar */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 bg-[#FAF0ED] text-[#D82C20] text-xs font-bold px-2 py-0.5 rounded-full border border-[#FAC7C3]">
                    <span>{quickViewProduct.rating}</span>
                    <Star className="w-3 h-3 fill-current text-[#D9A34C]" />
                  </span>
                  <span className="text-xs text-[#5F6D61] font-medium">
                    {quickViewProduct.reviewsCount.toLocaleString()} Ratings & Reviews
                  </span>
                  {quickViewProduct.isAssured && (
                    <span className="ml-2 inline-flex items-center text-xs font-bold text-[#3C4A3E]">
                      <span className="text-sm mr-0.5">🌿</span>
                      <span className="font-semibold text-[10px] uppercase text-[#5F6D61] ml-0.5">Assured</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Special Price Display */}
              <div className="pt-2 border-t border-[#EEF2EB]">
                <div className="text-[11px] text-[#D82C20] font-bold uppercase tracking-wider">Special Price</div>
                <div className="flex items-baseline gap-3 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-bold text-[#1D251E]">
                    ₹{quickViewProduct.price}
                  </span>
                  <span className="text-sm text-[#8A988D] line-through font-mono">
                    ₹{quickViewProduct.originalPrice}
                  </span>
                  <span className="text-xs font-bold text-[#D82C20] bg-[#FDECEB] border border-[#FAC7C3] px-2 py-0.5 rounded-full">
                    {quickViewProduct.discount}% off
                  </span>
                </div>
              </div>

              {/* Available Offers Box */}
              <div className="bg-[#FAFBF9] rounded-2xl p-4 text-xs space-y-2 border border-[#E5EAE2] text-[#1D251E]">
                <div className="font-bold text-[#1D251E] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#3C4A3E]" />
                  <span>Available Offers</span>
                </div>
                <p className="text-[#5F6D61]">
                  • <strong className="text-[#1D251E]">Special Promo:</strong> Extra 10% off with coupon code <strong className="text-[#3C4A3E]">EARTHY10</strong>.
                </p>
                <p className="text-[#5F6D61]">
                  • <strong className="text-[#1D251E]">Assured Quality:</strong> Workshop sanitized, inspected and food-safe finished.
                </p>
                <p className="text-[#5F6D61]">
                  • <strong className="text-[#1D251E]">Easy Returns:</strong> 7-day doorstep replacement guarantee on every piece.
                </p>
              </div>

              {/* Delivery Check Section */}
              <div className="flex items-center gap-3 text-xs pt-2 border-t border-[#EEF2EB] flex-wrap">
                <MapPin className="w-4 h-4 text-[#3C4A3E]" />
                <span className="text-[#5F6D61]">Deliver to</span>
                <input
                  type="text"
                  value={deliveryPincode}
                  onChange={(e) => setDeliveryPincode(e.target.value)}
                  className="w-20 px-2 py-0.5 border-b border-[#3C4A3E] bg-transparent font-mono font-bold text-[#1D251E] focus:outline-none"
                />
                <span className="text-[#3C4A3E] font-semibold flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  Free Delivery by Tomorrow, 11 PM
                </span>
              </div>

              {/* Highlights & Specs */}
              <div className="pt-2 border-t border-[#EEF2EB] space-y-2">
                <div className="text-xs font-bold text-[#1D251E]">Highlights</div>
                <div className="grid grid-cols-2 gap-2 text-xs text-[#5F6D61]">
                  <p>• <strong className="text-[#1D251E]">Condition:</strong> {quickViewProduct.condition}</p>
                  <p>• <strong className="text-[#1D251E]">Material:</strong> {quickViewProduct.material}</p>
                  {quickViewProduct.features.map((feat, i) => (
                    <p key={i}>• {feat}</p>
                  ))}
                </div>

                <div className="mt-2 text-xs text-[#3C4A3E] bg-[#F0F4EE] p-3 rounded-xl border border-[#D5E1D3] font-normal">
                  <strong>Inspection & Hygiene Guarantee:</strong> {quickViewProduct.conditionDetails}
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
