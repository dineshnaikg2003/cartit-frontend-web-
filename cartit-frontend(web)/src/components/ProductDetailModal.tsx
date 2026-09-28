import React from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { X, Star, Zap, Leaf, Plus, Minus, ShieldCheck, Truck } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();

  if (!product) return null;

  const qty = getItemQuantity(product.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-ambient-lg border border-[#e0e4da] relative flex flex-col md:flex-row p-6 gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#f7fbf0] hover:bg-[#e0e4da] text-[#181d17] flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Product Image Display */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-[#f7fbf0] rounded-2xl p-6 relative">
          {product.discountPercent > 0 && (
            <span className="absolute top-3 left-3 bg-[#ba1a1a] text-white text-xs font-black px-2.5 py-1 rounded-full shadow-xs">
              {product.discountPercent}% OFF
            </span>
          )}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-48 h-48 md:w-56 md:h-56 object-contain hover:scale-105 transition-transform"
          />
          <div className="flex items-center gap-2 mt-4 text-xs font-bold text-[#0d631b] bg-[#e6f4e8] px-3 py-1.5 rounded-full border border-[#abf4ac]">
            <Zap className="w-4 h-4 fill-[#0d631b]" />
            <span>Delivered in 10 minutes</span>
          </div>
        </div>

        {/* Right Side: Information & Actions */}
        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <div>
            {/* Organic Tag */}
            {product.isOrganic && (
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#0d631b] bg-[#e6f4e8] px-2.5 py-1 rounded-md mb-2">
                <Leaf className="w-3.5 h-3.5 fill-[#0d631b]" />
                100% Certified Organic Farm Product
              </div>
            )}

            <h2 className="text-lg md:text-xl font-black text-[#181d17] leading-snug mb-1">
              {product.name}
            </h2>
            <div className="text-xs font-semibold text-[#707a6c] mb-3">
              Unit Net Weight: <span className="text-[#181d17] font-bold">{product.unit}</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1 bg-[#f59e0b]/15 px-2.5 py-1 rounded-lg text-xs font-bold text-[#f59e0b]">
                <Star className="w-3.5 h-3.5 fill-[#f59e0b]" />
                <span>{product.rating}</span>
              </div>
              <span className="text-xs font-medium text-[#707a6c]">
                ({product.ratingCount} verified ratings)
              </span>
            </div>

            {/* Description */}
            <p className="text-xs font-medium text-[#40493d] leading-relaxed mb-4">
              {product.description}
            </p>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-[#40493d] bg-[#f7fbf0] p-3 rounded-2xl border border-[#e0e4da] mb-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0d631b]" />
                <span>100% Quality Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#0d631b]" />
                <span>Cold-Chain Maintained</span>
              </div>
            </div>
          </div>

          {/* Pricing & Add Stepper */}
          <div className="pt-4 border-t border-[#e0e4da] flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-[#707a6c] font-semibold">Special Price</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#0d631b]">₹{product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-sm font-semibold text-[#707a6c] line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>
            </div>

            {qty === 0 ? (
              <button
                onClick={() => addToCart(product)}
                className="flex items-center gap-2 bg-[#0d631b] hover:bg-[#074712] text-white px-6 py-3 rounded-2xl text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>ADD TO CART</span>
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-[#0d631b] text-white px-3.5 py-2.5 rounded-2xl shadow-md">
                <button
                  onClick={() => updateQuantity(product.id, qty - 1)}
                  className="p-1 hover:bg-[#074712] rounded-xl transition-colors active:scale-90"
                >
                  <Minus className="w-4 h-4 stroke-[3]" />
                </button>
                <span className="text-sm font-black min-w-[20px] text-center">{qty}</span>
                <button
                  onClick={() => updateQuantity(product.id, qty + 1)}
                  className="p-1 hover:bg-[#074712] rounded-xl transition-colors active:scale-90"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
