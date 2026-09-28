import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Zap,
  ShoppingBag,
  Tag,
  ArrowRight,
  CheckCircle2,
  BellOff,
  DoorOpen,
  PhoneOff,
} from 'lucide-react';

interface CartDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  onProceedToCheckout?: () => void;
  onCheckout?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen: propIsOpen, 
  onClose: propOnClose, 
  onProceedToCheckout, 
  onCheckout 
}) => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    itemTotal,
    deliveryFee,
    handlingFee,
    appliedDiscount,
    grandTotal,
    totalItemCount,
    isCartOpen: contextIsOpen,
    setIsCartOpen,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { selectedAddress, estimatedTimeMinutes } = useLocation();

  const isOpen = propIsOpen !== undefined ? propIsOpen : contextIsOpen;
  const handleClose = propOnClose || (() => setIsCartOpen(false));
  const handleCheckout = onProceedToCheckout || onCheckout || (() => {});

  if (!isOpen) return null;

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [instructions, setInstructions] = useState<{ [key: string]: boolean }>({
    door: false,
    bell: false,
    call: false,
  });

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!couponCode.trim()) return;

    const success = applyCoupon(couponCode);
    if (success) {
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon code or minimum order value not met.');
    }
  };

  const freeDeliveryThreshold = 199;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - itemTotal);
  const freeDeliveryProgress = Math.min(100, (itemTotal / freeDeliveryThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#f7fbf0] shadow-2xl flex flex-col justify-between border-l border-[#e0e4da] relative z-10">
          
          {/* Drawer Header */}
          <div className="bg-white p-5 border-b border-[#e0e4da] flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#e6f4e8] text-[#0d631b] flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-[#181d17]">My Shopping Cart</h2>
                <div className="text-xs font-semibold text-[#0d631b] flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-[#0d631b]" />
                  <span>Delivery to {selectedAddress.label} in {estimatedTimeMinutes} mins</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#707a6c] hover:text-[#181d17] rounded-xl hover:bg-[#f7fbf0] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content / Scrollable Items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            
            {/* Free Delivery Meter */}
            {itemTotal > 0 && (
              <div className="bg-white p-3.5 rounded-2xl border border-[#e0e4da] shadow-xs">
                {remainingForFreeDelivery > 0 ? (
                  <div className="text-xs font-bold text-[#40493d] mb-2 flex justify-between">
                    <span>Add <strong className="text-[#0d631b]">₹{remainingForFreeDelivery}</strong> more for FREE delivery</span>
                    <span>{Math.round(freeDeliveryProgress)}%</span>
                  </div>
                ) : (
                  <div className="text-xs font-black text-[#0d631b] mb-2 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-[#0d631b]" />
                    <span>Yay! You unlocked FREE 10-Min Delivery 🎉</span>
                  </div>
                )}
                <div className="w-full bg-[#f1f5eb] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0d631b] h-full transition-all duration-500 rounded-full"
                    style={{ width: `${freeDeliveryProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Cart Items */}
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-24 h-24 rounded-full bg-[#e6f4e8] text-[#0d631b] flex items-center justify-center mb-4">
                  <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-black text-[#181d17] mb-1">Your cart is empty</h3>
                <p className="text-xs font-medium text-[#707a6c] max-w-xs mb-6">
                  Good food is waiting for you! Explore farm fresh vegetables, dairy and daily essentials.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-[#0d631b] hover:bg-[#074712] text-white px-6 py-3 rounded-2xl text-xs font-black shadow-md transition-all cursor-pointer"
                >
                  Shop Essentials Now
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="bg-white p-3.5 rounded-2xl border border-[#e0e4da] flex items-center justify-between gap-3 shadow-xs"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-14 h-14 object-contain rounded-xl bg-[#f7fbf0] p-1 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#181d17] truncate">{product.name}</h4>
                      <div className="text-[11px] font-medium text-[#707a6c] mb-1">{product.unit}</div>
                      <div className="text-xs font-black text-[#0d631b]">₹{product.price * quantity}</div>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-2 bg-[#0d631b] text-white px-2 py-1.5 rounded-xl shadow-xs shrink-0">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="p-0.5 hover:bg-[#074712] rounded-md transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                      <span className="text-xs font-black min-w-[14px] text-center">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="p-0.5 hover:bg-[#074712] rounded-md transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-[#707a6c] hover:text-[#ba1a1a] p-1 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Coupons Section */}
            {cartItems.length > 0 && (
              <div className="bg-white p-4 rounded-2xl border border-[#e0e4da] shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#181d17]">
                    <Tag className="w-4 h-4 text-[#0d631b]" />
                    <span>Apply Coupon Code</span>
                  </div>
                  {appliedCoupon && (
                    <button
                      onClick={removeCoupon}
                      className="text-[11px] font-bold text-[#ba1a1a] hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {appliedCoupon ? (
                  <div className="bg-[#e6f4e8] border border-[#abf4ac] p-2.5 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-black text-[#0d631b] uppercase">'{appliedCoupon}' APPLIED</div>
                      <div className="text-[11px] text-[#286b33]">You saved ₹{appliedDiscount} on this order</div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-[#0d631b]" />
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Try 'CARTIT100' or 'FRESH50'"
                      className="flex-1 px-3 py-2 bg-[#f7fbf0] border border-[#e0e4da] rounded-xl text-xs font-semibold uppercase focus:outline-none focus:border-[#0d631b]"
                    />
                    <button
                      type="submit"
                      className="bg-[#0d631b] hover:bg-[#074712] text-white px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && (
                  <div className="text-[11px] font-semibold text-[#ba1a1a] mt-2">{couponError}</div>
                )}
              </div>
            )}

            {/* Delivery Instructions */}
            {cartItems.length > 0 && (
              <div className="bg-white p-4 rounded-2xl border border-[#e0e4da] shadow-xs">
                <div className="text-xs font-bold text-[#181d17] mb-2.5">Delivery Instructions</div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setInstructions(p => ({ ...p, door: !p.door }))}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-[10px] font-bold gap-1 transition-all ${
                      instructions.door
                        ? 'bg-[#e6f4e8] border-[#0d631b] text-[#0d631b]'
                        : 'bg-[#f7fbf0] border-[#e0e4da] text-[#707a6c]'
                    }`}
                  >
                    <DoorOpen className="w-4 h-4" />
                    <span>Leave at door</span>
                  </button>

                  <button
                    onClick={() => setInstructions(p => ({ ...p, bell: !p.bell }))}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-[10px] font-bold gap-1 transition-all ${
                      instructions.bell
                        ? 'bg-[#e6f4e8] border-[#0d631b] text-[#0d631b]'
                        : 'bg-[#f7fbf0] border-[#e0e4da] text-[#707a6c]'
                    }`}
                  >
                    <BellOff className="w-4 h-4" />
                    <span>Don't ring bell</span>
                  </button>

                  <button
                    onClick={() => setInstructions(p => ({ ...p, call: !p.call }))}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-[10px] font-bold gap-1 transition-all ${
                      instructions.call
                        ? 'bg-[#e6f4e8] border-[#0d631b] text-[#0d631b]'
                        : 'bg-[#f7fbf0] border-[#e0e4da] text-[#707a6c]'
                    }`}
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>Avoid calling</span>
                  </button>
                </div>
              </div>
            )}

            {/* Bill Summary */}
            {cartItems.length > 0 && (
              <div className="bg-white p-4 rounded-2xl border border-[#e0e4da] shadow-xs space-y-2 text-xs font-medium">
                <div className="text-xs font-black text-[#181d17] pb-2 border-b border-[#f1f5eb]">
                  Bill Breakdown
                </div>
                <div className="flex justify-between text-[#40493d]">
                  <span>Item Total ({totalItemCount} items)</span>
                  <span>₹{itemTotal}</span>
                </div>
                <div className="flex justify-between text-[#40493d]">
                  <span>Delivery Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="text-[#0d631b] font-bold">FREE</span>
                  ) : (
                    <span>₹{deliveryFee}</span>
                  )}
                </div>
                <div className="flex justify-between text-[#40493d]">
                  <span>Handling & Packaging Fee</span>
                  <span>₹{handlingFee}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-[#0d631b] font-bold">
                    <span>Coupon Savings</span>
                    <span>-₹{appliedDiscount}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#e0e4da] flex justify-between text-sm font-black text-[#181d17]">
                  <span>To Pay</span>
                  <span className="text-[#0d631b]">₹{grandTotal}</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer Checkout CTA */}
          {cartItems.length > 0 && (
            <div className="bg-white p-4 border-t border-[#e0e4da] shadow-lg">
              <button
                onClick={() => {
                  handleClose();
                  handleCheckout();
                }}
                className="w-full bg-[#0d631b] hover:bg-[#074712] text-white p-4 rounded-2xl flex items-center justify-between font-black text-sm shadow-md transition-all active:scale-98 cursor-pointer group"
              >
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-extrabold text-[#cbffc2] uppercase">
                    PROCEED TO CHECKOUT
                  </span>
                  <span>₹{grandTotal} • {totalItemCount} ITEMS</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#2e7d32] px-3 py-1.5 rounded-xl text-xs">
                  <span>Pay & Order</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
