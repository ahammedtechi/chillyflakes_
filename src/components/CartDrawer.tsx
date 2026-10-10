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
    clearCart,
    showToast
  } = useStore();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [postalCode, setPostalCode] = useState('M5V 2T6');
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderDone, setOrderDone] = useState(false);

  const discountAmount = promoApplied ? cartTotal * 0.1 : 0;
  const deliveryCharge = cartTotal >= 35 || cartTotal === 0 ? 0 : 5;
  const finalPayable = Math.max(0, cartTotal - discountAmount + deliveryCharge);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'CHILLY10' || promoCode.trim().toUpperCase() === 'NATURAL10') {
      setPromoApplied(true);
      showToast('Coupon applied! 10% Extra Savings', 'success');
    } else {
      showToast('Invalid coupon. Try "CHILLY10"', 'warning');
    }
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    setIsOrdering(true);
    setTimeout(() => {
      setIsOrdering(false);
      setOrderDone(true);
      clearCart();
      showToast('Order Placed Successfully! Confirmation email sent.', 'success');
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
        <div className="w-screen max-w-lg bg-white text-[#223B28] shadow-2xl flex flex-col justify-between border-l border-[#ECE7DD]">
          
          {/* Header */}
          <div className="px-5 py-4 bg-[#FAF7F2] text-[#223B28] flex items-center justify-between border-b border-[#ECE7DD]">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#2E4D34]" />
              <h2 className="font-serif font-bold text-base tracking-wide">
                My Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => { setIsCartOpen(false); setOrderDone(false); }}
              className="p-1.5 hover:bg-[#EAF1EA] rounded-full transition-colors text-[#506052]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Postal Code Strip */}
          <div className="bg-[#FAF7F2] px-5 py-2.5 border-b border-[#ECE7DD] flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[#223B28]">
              <MapPin className="w-3.5 h-3.5 text-[#2E4D34]" />
              <span>Deliver to: <strong className="font-semibold text-[#223B28]">{postalCode}</strong></span>
            </div>
            <button 
              onClick={() => {
                const newCode = prompt("Enter postal code:", postalCode);
                if (newCode) setPostalCode(newCode.trim());
              }}
              className="px-3 py-1 text-[#2E4D34] bg-white border border-[#D1DDD0] rounded-full font-semibold hover:bg-[#EAF1EA] transition-colors"
            >
              Change
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {orderDone ? (
              <div className="bg-[#FAF7F2] rounded-3xl p-8 text-center space-y-4 border border-[#ECE7DD]">
                <div className="w-16 h-16 rounded-full bg-[#EAF1EA] border border-[#C6D5C5] text-[#2E4D34] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif font-bold text-xl text-[#223B28]">
                  Order Placed Successfully!
                </h3>
                <p className="text-xs text-[#506052] leading-relaxed max-w-xs mx-auto font-normal">
                  Your handcrafted goods are being lovingly packed by our local artisans. Estimated delivery: 2-3 business days.
                </p>
                <button
                  onClick={() => { setOrderDone(false); setIsCartOpen(false); }}
                  className="px-6 py-2.5 bg-[#2E4D34] hover:bg-[#233B27] text-white text-xs font-semibold rounded-full shadow-xs uppercase tracking-wider transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="bg-[#FAF7F2] rounded-3xl p-12 text-center space-y-4 border border-[#ECE7DD]">
                <div className="w-20 h-20 rounded-full bg-[#EAF1EA] text-[#2E4D34] mx-auto flex items-center justify-center text-3xl">
                  🌿
                </div>
                <h3 className="font-serif font-bold text-base text-[#223B28]">
                  Your cart is empty!
                </h3>
                <p className="text-xs text-[#506052]">
                  Explore our curated handmade collection and add items to your cart.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-[#2E4D34] hover:bg-[#233B27] text-white text-xs font-semibold rounded-full uppercase tracking-wider transition-colors shadow-xs"
                >
                  Shop Now
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-[#FAF7F2] rounded-2xl border border-[#ECE7DD] p-4 flex gap-4"
                >
                  {/* Image */}
                  <div className="w-20 h-20 p-1 flex-shrink-0 flex items-center justify-center bg-white rounded-xl border border-[#ECE7DD]">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="max-h-full max-w-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-[#223B28] line-clamp-1">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-sans uppercase px-2 py-0.5 rounded-full bg-[#EAF1EA] text-[#2E4D34] font-semibold">
                          Handmade
                        </span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-sm font-bold text-[#223B28]">
                        CAD ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Actions & Quantity */}
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#E5DDD0] text-xs">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-[#D1DDD0] rounded-full bg-white overflow-hidden shadow-2xs">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#506052] hover:text-[#223B28] hover:bg-[#FAF7F2]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-bold text-xs text-[#223B28]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#506052] hover:text-[#223B28] hover:bg-[#FAF7F2]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="font-semibold text-[#7E8F80] hover:text-[#DC2626] uppercase text-[11px] transition-colors"
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
            <div className="bg-[#FAF7F2] border-t border-[#ECE7DD] p-4 sm:p-5 space-y-3.5">
              
              {/* Coupon Box */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7E8F80]" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter Coupon: CHILLY10"
                    disabled={promoApplied}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-[#ECE7DD] rounded-xl focus:outline-none focus:border-[#2E4D34] uppercase font-mono bg-white text-[#223B28]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={promoApplied}
                  className="px-4 py-2 bg-[#2E4D34] hover:bg-[#233B27] disabled:bg-[#8F9E8F] text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  {promoApplied ? 'Applied' : 'Apply'}
                </button>
              </form>

              {/* Bill Summary */}
              <div className="space-y-1.5 text-xs text-[#506052] pt-2 border-t border-[#E5DDD0]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#223B28]">CAD ${cartTotal.toFixed(2)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-[#2E4D34]">
                    <span>Coupon Discount (10%)</span>
                    <span>- CAD ${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={deliveryCharge === 0 ? "text-[#2E4D34] font-semibold" : "font-semibold text-[#223B28]"}>
                    {deliveryCharge === 0 ? "FREE" : `CAD $${deliveryCharge.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#223B28] pt-2 border-t border-[#E5DDD0]">
                  <span>Total Amount</span>
                  <span>CAD ${finalPayable.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isOrdering}
                className="w-full py-3.5 bg-[#2E4D34] hover:bg-[#233B27] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-98"
              >
                {isOrdering ? 'Processing Order...' : `Proceed to Checkout &bull; CAD $${finalPayable.toFixed(2)}`}
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
