import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Minus, 
  ShoppingCart, 
  CheckCircle2,
  MapPin,
  Tag
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateQuantity, 
    removeFromCart, 
    cartTotal,
    cartSavings,
    clearCart,
    showToast
  } = useStore();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [pincode, setPincode] = useState('110001');
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderDone, setOrderDone] = useState(false);

  const discountAmount = promoApplied ? Math.round(cartTotal * 0.1) : 0;
  const deliveryCharge = cartTotal >= 499 || cartTotal === 0 ? 0 : 40;
  const finalPayable = Math.max(0, cartTotal - discountAmount + deliveryCharge);
  const totalSaved = cartSavings + discountAmount + (deliveryCharge === 0 && cartTotal > 0 ? 40 : 0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'EARTHY10' || promoCode.trim().toUpperCase() === 'FLIPKART10') {
      setPromoApplied(true);
      showToast('Coupon applied! 10% Extra Savings', 'success');
    } else {
      showToast('Invalid coupon. Try "EARTHY10"', 'warning');
    }
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    setIsOrdering(true);
    setTimeout(() => {
      setIsOrdering(false);
      setOrderDone(true);
      clearCart();
      showToast('Order Placed Successfully! SMS confirmation sent.', 'success');
    }, 1200);
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => { setIsCartOpen(false); setOrderDone(false); }}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-lg bg-white text-[#1D251E] shadow-2xl flex flex-col justify-between border-l border-[#E2E7DF]">
          
          {/* Header */}
          <div className="px-5 py-4 bg-[#F9FAF8] text-[#1D251E] flex items-center justify-between border-b border-[#EEF2EB]">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#3C4A3E]" />
              <h2 className="font-serif font-bold text-base tracking-wide">
                My Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => { setIsCartOpen(false); setOrderDone(false); }}
              className="p-1.5 hover:bg-[#F0F4EE] rounded-full transition-colors text-[#5F6D61]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Address / Pin Strip */}
          <div className="bg-[#F4F6F2] px-5 py-2.5 border-b border-[#E5EAE2] flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[#1D251E]">
              <MapPin className="w-3.5 h-3.5 text-[#3C4A3E]" />
              <span>Deliver to: <strong className="font-semibold text-[#1D251E]">New Delhi - {pincode}</strong></span>
            </div>
            <button 
              onClick={() => {
                const newPin = prompt("Enter 6-digit delivery pincode:", pincode);
                if (newPin && newPin.length === 6) setPincode(newPin);
              }}
              className="px-3 py-1 text-[#3C4A3E] bg-white border border-[#DFE6DD] rounded-full font-semibold hover:bg-[#F0F4EE] transition-colors"
            >
              Change
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {orderDone ? (
              <div className="bg-[#F9FAF8] rounded-3xl p-8 text-center space-y-4 border border-[#E5EAE2]">
                <div className="w-16 h-16 rounded-full bg-[#F0F4EE] border border-[#C4D3C2] text-[#3C4A3E] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif font-bold text-xl text-[#1D251E]">
                  Order Placed Successfully!
                </h3>
                <p className="text-xs text-[#5F6D61] leading-relaxed max-w-xs mx-auto font-normal">
                  Your kitchen essentials are being packed at our certified facility. Estimated delivery: 2 business days.
                </p>
                <button
                  onClick={() => { setOrderDone(false); setIsCartOpen(false); }}
                  className="px-6 py-2.5 bg-[#3C4A3E] hover:bg-[#2C372D] text-white text-xs font-semibold rounded-full shadow-xs uppercase tracking-wider transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="bg-[#F9FAF8] rounded-3xl p-12 text-center space-y-4 border border-[#E5EAE2]">
                <div className="w-20 h-20 rounded-full bg-[#F0F4EE] text-[#3C4A3E] mx-auto flex items-center justify-center text-3xl">
                  🛒
                </div>
                <h3 className="font-serif font-bold text-base text-[#1D251E]">
                  Your cart is empty!
                </h3>
                <p className="text-xs text-[#5F6D61]">
                  Explore our curated pieces and add items to your cart.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-[#3C4A3E] hover:bg-[#2C372D] text-white text-xs font-semibold rounded-full uppercase tracking-wider transition-colors shadow-xs"
                >
                  Shop Now
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-[#FAFBF9] rounded-2xl border border-[#E5EAE2] p-4 flex gap-4"
                >
                  {/* Image */}
                  <div className="w-20 h-20 p-2 flex-shrink-0 flex items-center justify-center bg-[#FAF4F0] rounded-xl border border-[#F3E7E2]">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-[#1D251E] line-clamp-1">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                          item.product.condition === 'Pre-Owned' ? 'bg-[#FCEEEA] text-[#BD4B37] font-bold' : 'bg-[#F0F4EE] text-[#5F6D61]'
                        }`}>
                          {item.product.condition}
                        </span>
                        {item.product.isAssured && (
                          <span className="text-[10px] font-bold text-[#3C4A3E]">
                            <span>🌿</span>
                            <span className="font-semibold text-[9px] uppercase text-[#5F6D61] ml-0.5">Assured</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-sm font-bold text-[#1D251E]">
                        ₹{item.product.price * item.quantity}
                      </span>
                      {item.product.originalPrice > item.product.price && (
                        <>
                          <span className="text-xs text-[#8A988D] line-through font-mono">
                            ₹{item.product.originalPrice * item.quantity}
                          </span>
                          <span className="text-[11px] font-bold text-[#BD4B37] bg-[#FCEEEA] border border-[#F5D5CC] px-1.5 py-0.2 rounded-full">
                            {item.product.discount}% off
                          </span>
                        </>
                      )}
                    </div>

                    {/* Actions & Quantity */}
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#EEF2EB] text-xs">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-[#DFE6DD] rounded-full bg-white overflow-hidden shadow-2xs">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#5F6D61] hover:text-[#1D251E] hover:bg-[#F4F6F2]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-mono font-bold text-xs text-[#1D251E]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#5F6D61] hover:text-[#1D251E] hover:bg-[#F4F6F2]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="font-semibold text-[#7C8B7E] hover:text-[#BD4B37] uppercase text-[11px] transition-colors"
                      >
                        Remove
                      </button>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Price Details & Place Order Bar */}
          {cart.length > 0 && !orderDone && (
            <div className="bg-[#F9FAF8] border-t border-[#EEF2EB] p-4 sm:p-5 space-y-3.5">
              
              {/* Coupon Box */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5F6D61]" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="COUPON: EARTHY10"
                    className="w-full pl-8 pr-3 py-2 text-xs border border-[#DFE6DD] bg-white text-[#1D251E] rounded-full uppercase tracking-wider focus:outline-none focus:border-[#D82C20]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3C4A3E] hover:bg-[#D82C20] text-white text-xs font-semibold rounded-full transition-colors"
                >
                  Apply
                </button>
              </form>

              {/* Price Breakdown */}
              <div className="border border-[#E5EAE2] rounded-2xl p-3.5 bg-white text-xs space-y-2">
                <div className="text-[11px] font-bold text-[#5F6D61] uppercase border-b border-[#EEF2EB] pb-1.5">
                  Price Details
                </div>
                <div className="flex justify-between text-[#5F6D61]">
                  <span>Price ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="text-[#1D251E]">₹{cartTotal}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-[#D82C20] font-semibold">
                    <span>Coupon Discount (10%)</span>
                    <span>- ₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#5F6D61]">
                  <span>Delivery Charges</span>
                  <span>
                    {deliveryCharge === 0 ? (
                      <span className="text-[#3C4A3E] font-bold">FREE</span>
                    ) : (
                      `₹${deliveryCharge}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#1D251E] pt-2 border-t border-dashed border-[#E5EAE2]">
                  <span>Total Amount</span>
                  <span>₹{finalPayable}</span>
                </div>
                <p className="text-[11px] font-bold text-[#D82C20] pt-1">
                  You will save ₹{totalSaved} on this order!
                </p>
              </div>

              {/* Bottom Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isOrdering}
                className="w-full py-3.5 bg-[#3C4A3E] hover:bg-[#D82C20] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm transition-all disabled:opacity-50"
              >
                {isOrdering ? 'PROCESSING ORDER...' : `PLACE ORDER (₹${finalPayable})`}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
