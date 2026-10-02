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
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={() => setQuickViewProduct(null)}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
        <div className="relative transform overflow-hidden rounded-xl bg-[#263936] text-[#F1EFE5] text-left shadow-forest-lg transition-all w-full max-w-4xl border border-[#355247]">
          
          {/* Close button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-3 right-3 text-[#8A9C82] hover:text-[#F1EFE5] z-20 p-1"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 p-4 sm:p-6 gap-6">
            
            {/* Left Column: Image Box on Warm Cream Surface & Buttons */}
            <div className="md:col-span-5 flex flex-col justify-between space-y-4">
              <div className="relative aspect-square w-full border border-[#355247] rounded-lg p-4 flex items-center justify-center bg-[#F7F5ED] overflow-hidden">
                <img
                  src={currentImage}
                  alt={quickViewProduct.name}
                  className="max-h-full max-w-full object-contain mix-blend-multiply"
                />

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(quickViewProduct)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white text-[#172421] shadow-xs hover:text-[#dfab7e]"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#dfab7e] text-[#dfab7e]' : ''}`} />
                </button>

                {/* Condition tag */}
                <span className="absolute top-2 left-2 text-[10px] font-mono font-bold bg-[#172421] text-[#F1EFE5] border border-[#355247] px-2 py-0.5 rounded uppercase">
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
                      className={`w-14 h-14 p-1 border rounded-lg bg-[#F7F5ED] flex-shrink-0 ${
                        currentImage === img ? 'border-[#8A9C82] ring-1 ring-[#8A9C82]' : 'border-[#355247]'
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
                  className="py-3 bg-[#355247] hover:bg-[#436558] text-[#F1EFE5] text-xs sm:text-sm font-semibold uppercase rounded-lg border border-[#8A9C82]/30 shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>ADD TO CART</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-3 bg-[#F1EFE5] hover:bg-[#F7F5ED] text-[#172421] text-xs sm:text-sm font-bold uppercase rounded-lg shadow-forest flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>BUY NOW</span>
                </button>
              </div>
            </div>

            {/* Right Column: Product Specs, Ratings, Offers & Delivery */}
            <div className="md:col-span-7 space-y-4">
              
              <div>
                <p className="text-xs text-[#8A9C82] uppercase font-semibold">
                  {quickViewProduct.category}
                </p>
                <h3 className="text-lg sm:text-xl font-serif font-light text-[#F1EFE5] mt-1 leading-snug">
                  {quickViewProduct.name}
                </h3>

                {/* Rating Bar */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 bg-[#355247] text-[#F1EFE5] text-xs font-bold px-2 py-0.5 rounded border border-[#8A9C82]/30">
                    <span>{quickViewProduct.rating}</span>
                    <Star className="w-3 h-3 fill-current text-[#dfab7e]" />
                  </span>
                  <span className="text-xs text-[#8A9C82] font-semibold">
                    {quickViewProduct.reviewsCount.toLocaleString()} Ratings & Reviews
                  </span>
                  {quickViewProduct.isAssured && (
                    <span className="ml-2 inline-flex items-center text-xs italic font-bold text-[#F1EFE5]">
                      <span>f</span>
                      <span className="text-[#dfab7e] not-italic">✦</span>
                      <span className="font-semibold text-[10px] uppercase text-[#8A9C82] ml-0.5">Assured</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Special Price Display */}
              <div className="pt-2 border-t border-[#355247]">
                <div className="text-[11px] text-[#dfab7e] font-bold uppercase">Special Price</div>
                <div className="flex items-baseline gap-3 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-serif font-light text-[#F1EFE5]">
                    ₹{quickViewProduct.price}
                  </span>
                  <span className="text-sm text-[#8A9C82]/70 line-through font-mono">
                    ₹{quickViewProduct.originalPrice}
                  </span>
                  <span className="text-sm font-bold text-[#dfab7e]">
                    {quickViewProduct.discount}% off
                  </span>
                </div>
              </div>

              {/* Available Bank Offers List */}
              <div className="bg-[#1E2D2A] rounded-lg p-3 text-xs space-y-1.5 border border-[#355247] text-[#F1EFE5]">
                <div className="font-bold text-[#F1EFE5] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#8A9C82]" />
                  <span>Available Offers</span>
                </div>
                <p className="text-[#F1EFE5]/85">
                  • <strong>Special Promo:</strong> Extra 10% off with coupon code <strong>EARTHY10</strong>.
                </p>
                <p className="text-[#F1EFE5]/85">
                  • <strong>Assured Quality:</strong> Workshop sanitized, inspected and food-safe finished.
                </p>
                <p className="text-[#F1EFE5]/85">
                  • <strong>Easy Returns:</strong> 7-day doorstep replacement guarantee on every piece.
                </p>
              </div>

              {/* Delivery Check Section */}
              <div className="flex items-center gap-3 text-xs pt-1 border-t border-[#355247]">
                <MapPin className="w-4 h-4 text-[#8A9C82]" />
                <span className="text-[#8A9C82]">Deliver to</span>
                <input
                  type="text"
                  value={deliveryPincode}
                  onChange={(e) => setDeliveryPincode(e.target.value)}
                  className="w-24 px-2 py-1 border-b border-[#8A9C82] bg-transparent font-mono font-bold text-[#F1EFE5] focus:outline-none"
                />
                <span className="text-[#8A9C82] font-semibold flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  Free Delivery by Tomorrow, 11 PM
                </span>
              </div>

              {/* Highlights & Specs */}
              <div className="pt-2 border-t border-[#355247] space-y-2">
                <div className="text-xs font-bold text-[#F1EFE5]">Highlights</div>
                <div className="grid grid-cols-2 gap-2 text-xs text-[#F1EFE5]/80">
                  <p>• <strong>Condition:</strong> {quickViewProduct.condition}</p>
                  <p>• <strong>Material:</strong> {quickViewProduct.material}</p>
                  {quickViewProduct.features.map((feat, i) => (
                    <p key={i}>• {feat}</p>
                  ))}
                </div>

                <div className="mt-2 text-xs text-[#8A9C82] bg-[#1E2D2A] p-2.5 rounded border border-[#355247] font-light">
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
