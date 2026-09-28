import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface BillDetails {
  itemTotal: number;
  deliveryFee: number;
  handlingFee: number;
  couponDiscount: number;
  toPay: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cart: CartItem[]; // alias
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  itemTotal: number;
  deliveryFee: number;
  handlingFee: number;
  appliedDiscount: number;
  grandTotal: number;
  totalItemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  billDetails: BillDetails;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cartit_web_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);

  useEffect(() => {
    try {
      localStorage.setItem('cartit_web_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    setAppliedDiscount(0);
  };

  const getItemQuantity = (productId: string): number => {
    const item = cartItems.find(i => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  const itemTotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  // Delivery Fee logic: FREE if itemTotal >= 199 or empty, else ₹29
  const deliveryFee = itemTotal === 0 ? 0 : (itemTotal >= 199 ? 0 : 29);
  
  // Platform handling fee: ₹5
  const handlingFee = itemTotal === 0 ? 0 : 5;

  const applyCoupon = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'CARTIT100' && itemTotal >= 299) {
      setAppliedCoupon('CARTIT100');
      setAppliedDiscount(100);
      return true;
    } else if (clean === 'FRESH50' && itemTotal >= 149) {
      setAppliedCoupon('FRESH50');
      setAppliedDiscount(50);
      return true;
    } else if (clean === 'EXPRESS' && itemTotal >= 99) {
      setAppliedCoupon('EXPRESS');
      setAppliedDiscount(25);
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setAppliedDiscount(0);
  };

  const grandTotal = Math.max(0, itemTotal + deliveryFee + handlingFee - appliedDiscount);

  const billDetails: BillDetails = {
    itemTotal,
    deliveryFee,
    handlingFee,
    couponDiscount: appliedDiscount,
    toPay: grandTotal,
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cart: cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        itemTotal,
        deliveryFee,
        handlingFee,
        appliedDiscount,
        grandTotal,
        totalItemCount,
        isCartOpen,
        setIsCartOpen,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        billDetails,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
