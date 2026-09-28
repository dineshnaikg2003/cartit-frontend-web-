import React from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Plus, Minus, Star, Zap, Leaf } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct?: (product: Product) => void;
  onOpenDetail?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onOpenDetail,
}) => {
  const handleSelect = () => {
    if (onOpenDetail) onOpenDetail(product);
    else if (onSelectProduct) onSelectProduct(product);
  };
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const qty = getItemQuantity(product.id);

  return (
    <div className="group bg-white rounded-3xl border border-[#e0e4da] hover:border-[#0d631b] p-3.5 flex flex-col justify-between transition-all duration-300 hover:shadow-ambient hover:-translate-y-1 relative">
      
      {/* Top Tags Overlay */}
      <div className="absolute top-5 left-5 z-10 flex flex-col gap-1.5 items-start">
        {product.discountPercent > 0 && (
          <span className="bg-[#ba1a1a] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
            {product.discountPercent}% OFF
          </span>
        )}
        {product.isOrganic && (
          <span className="bg-[#0d631b] text-[#cbffc2] text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
            <Leaf className="w-2.5 h-2.5 fill-[#cbffc2]" />
            ORGANIC
          </span>
        )}
      </div>

      {/* Express 10 Min Badge */}
      <div className="absolute top-5 right-5 z-10">
        <span className="bg-[#e6f4e8] text-[#0d631b] text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 border border-[#abf4ac]">
          <Zap className="w-2.5 h-2.5 fill-[#0d631b]" />
          10m
        </span>
      </div>

      {/* Product Image (1:1 Aspect Ratio) */}
      <div
        onClick={handleSelect}
        className="w-full aspect-square rounded-2xl bg-[#f7fbf0] overflow-hidden flex items-center justify-center p-3 cursor-pointer mb-3 relative group-hover:bg-[#e6f4e8]/50 transition-colors"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Rating & Details */}
      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-1">
          <Star className="w-3.5 h-3.5 text-[#f59e0b] fill-[#f59e0b]" />
          <span className="text-xs font-bold text-[#181d17]">{product.rating}</span>
          <span className="text-[10px] text-[#707a6c]">({product.ratingCount})</span>
        </div>

        <h3
          onClick={handleSelect}
          className="text-xs sm:text-sm font-extrabold text-[#181d17] line-clamp-2 hover:text-[#0d631b] cursor-pointer transition-colors mb-1 min-h-[36px]"
        >
          {product.name}
        </h3>

        <div className="text-[11px] font-semibold text-[#707a6c] mb-3">
          {product.unit}
        </div>
      </div>

      {/* Price & Quantity Stepper */}
      <div className="flex items-center justify-between pt-2 border-t border-[#f1f5eb] mt-auto">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-base font-black text-[#0d631b]">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs font-medium text-[#707a6c] line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Stepper Logic */}
        {qty === 0 ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="flex items-center justify-center gap-1 bg-white hover:bg-[#0d631b] text-[#0d631b] hover:text-white border-2 border-[#0d631b] px-3.5 py-1.5 rounded-2xl text-xs font-black transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>ADD</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-[#0d631b] text-white px-2 py-1.5 rounded-2xl shadow-md">
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateQuantity(product.id, qty - 1);
              }}
              className="p-1 hover:bg-[#074712] rounded-xl transition-colors active:scale-90"
            >
              <Minus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
            <span className="text-xs font-black min-w-[14px] text-center">{qty}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateQuantity(product.id, qty + 1);
              }}
              className="p-1 hover:bg-[#074712] rounded-xl transition-colors active:scale-90"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
