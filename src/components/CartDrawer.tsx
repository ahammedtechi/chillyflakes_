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
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={() => { setIsCartOpen(false); setOrderDone(false); }}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-lg bg-[#263936] text-[#F1EFE5] shadow-forest-lg flex flex-col justify-between border-l border-[#355247]">
          
          {/* Header */}
          <div className="px-5 py-4 bg-[#1E2D2A] text-[#F1EFE5] flex items-center justify-between border-b border-[#355247]">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#8A9C82]" />
              <h2 className="font-serif font-light text-base tracking-wide">
                My Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => { setIsCartOpen(false); setOrderDone(false); }}
              className="p-1 hover:bg-[#355247] rounded transition-colors text-[#F1EFE5]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Address / Pin Strip */}
          <div className="bg-[#172421] px-5 py-2.5 border-b border-[#355247] flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[#F1EFE5]">
              <MapPin className="w-3.5 h-3.5 text-[#8A9C82]" />
              <span>Deliver to: <strong className="font-semibold text-[#F7F5ED]">New Delhi - {pincode}</strong></span>
            </div>
            <button 
              onClick={() => {
                const newPin = prompt("Enter 6-digit delivery pincode:", pincode);
                if (newPin && newPin.length === 6) setPincode(newPin);
              }}
              className="px-2 py-1 text-[#8A9C82] border border-[#355247] rounded font-bold hover:bg-[#1E2D2A]"
            >
              Change
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {orderDone ? (
              <div className="bg-[#1E2D2A] rounded-xl p-8 text-center space-y-4 border border-[#355247]">
                <div className="w-16 h-16 rounded-full bg-[#172421] border border-[#8A9C82] text-[#8A9C82] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif font-light text-lg text-[#F1EFE5]">
                  Order Placed Successfully!
                </h3>
                <p className="text-xs text-[#F1EFE5]/75 leading-relaxed max-w-xs mx-auto font-light">
                  Your kitchen essentials are being packed at our certified facility. Estimated delivery: 2 business days.
                </p>
                <button
                  onClick={() => { setOrderDone(false); setIsCartOpen(false); }}
                  className="px-6 py-2 bg-[#F1EFE5] text-[#172421] text-xs font-bold rounded shadow-xs uppercase tracking-wider"
                >
                  Continue Shopping
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="bg-[#1E2D2A] rounded-xl p-12 text-center space-y-4 border border-[#355247]">
                <div className="w-20 h-20 rounded-full bg-[#172421] text-[#8A9C82] mx-auto flex items-center justify-center text-3xl">
                  🛒
                </div>
                <h3 className="font-serif font-light text-base text-[#F1EFE5]">
                  Your cart is empty!
                </h3>
                <p className="text-xs text-[#8A9C82]">
                  Explore our curated pieces and add items to your cart.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-[#355247] hover:bg-[#436558] text-[#F1EFE5] text-xs font-bold rounded uppercase tracking-wider"
                >
                  Shop Now
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-[#1E2D2A] rounded-lg border border-[#355247] p-4 flex gap-4"
                >
                  {/* Image on Warm Cream */}
                  <div className="w-20 h-20 p-2 flex-shrink-0 flex items-center justify-center bg-[#F7F5ED] rounded border border-[#355247]">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-[#F1EFE5] line-clamp-1">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono text-[#8A9C82] uppercase">
                          {item.product.condition}
                        </span>
                        {item.product.isAssured && (
                          <span className="text-[10px] italic font-bold text-[#F1EFE5]">
                            <span>f</span>
                            <span className="text-[#dfab7e] not-italic">✦</span>
                            <span className="font-semibold text-[9px] uppercase text-[#8A9C82] ml-0.5">Assured</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-sm font-serif font-light text-[#F1EFE5]">
                        ₹{item.product.price * item.quantity}
                      </span>
                      {item.product.originalPrice > item.product.price && (
                        <>
                          <span className="text-xs text-[#8A9C82]/70 line-through font-mono">
                            ₹{item.product.originalPrice * item.quantity}
                          </span>
                          <span className="text-xs font-bold text-[#dfab7e]">
                            {item.product.discount}% off
                          </span>
                        </>
                      )}
                    </div>

                    {/* Actions & Quantity */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#355247] text-xs">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-[#355247] rounded bg-[#172421]">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#8A9C82] hover:text-[#F1EFE5]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-mono font-bold text-xs text-[#F1EFE5]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#8A9C82] hover:text-[#F1EFE5]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="font-bold text-[#8A9C82] hover:text-red-400 uppercase text-[11px] transition-colors"
                      >
                        REMOVE
                      </button>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Price Details & Place Order Bar */}
          {cart.length > 0 && !orderDone && (
            <div className="bg-[#1E2D2A] border-t border-[#355247] p-4 space-y-3">
              
              {/* Coupon Box */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A9C82]" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="ENTER COUPON (EARTHY10)"
                    className="w-full pl-8 pr-3 py-2 text-xs border border-[#355247] bg-[#172421] text-[#F1EFE5] rounded uppercase tracking-wider focus:outline-none focus:border-[#8A9C82]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#355247] hover:bg-[#436558] text-[#F1EFE5] text-xs font-bold uppercase rounded transition-colors"
                >
                  Apply
                </button>
              </form>

              {/* Price Breakdown */}
              <div className="border border-[#355247] rounded p-3 bg-[#172421] text-xs space-y-2">
                <div className="text-[11px] font-bold text-[#8A9C82] uppercase border-b border-[#355247] pb-1.5">
                  PRICE DETAILS
                </div>
                <div className="flex justify-between text-[#F1EFE5]">
                  <span>Price ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>₹{cartTotal}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-[#dfab7e] font-semibold">
                    <span>Coupon Discount (10%)</span>
                    <span>- ₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#F1EFE5]">
                  <span>Delivery Charges</span>
                  <span>
                    {deliveryCharge === 0 ? (
                      <span className="text-[#8A9C82] font-bold">FREE</span>
                    ) : (
                      `₹${deliveryCharge}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-serif font-normal text-[#F1EFE5] pt-2 border-t border-dashed border-[#355247]">
                  <span>Total Amount</span>
                  <span>₹{finalPayable}</span>
                </div>
                <p className="text-[11px] font-bold text-[#8A9C82] pt-1">
                  You will save ₹{totalSaved} on this order!
                </p>
              </div>

              {/* Bottom Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isOrdering}
                className="w-full py-3 bg-[#F1EFE5] hover:bg-[#F7F5ED] text-[#172421] text-xs font-bold uppercase tracking-wider rounded shadow-forest transition-colors disabled:opacity-50"
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
