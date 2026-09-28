import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  MapPin,
  ChevronDown,
  User as UserIcon,
  Zap,
  X,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { MOCK_PRODUCTS } from '../data/mockData';
import { Product } from '../types';

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenCart?: () => void;
  onOpenAuth?: () => void;
  onOpenAddress?: () => void;
  onSelectProduct?: (product: Product) => void;
  onOpenOrders?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  searchQuery: externalSearchQuery, 
  onSearchChange, 
  onOpenCart, 
  onOpenAuth, 
  onOpenAddress, 
  onSelectProduct, 
  onOpenOrders 
}) => {
  const { totalItemCount, grandTotal, setIsCartOpen } = useCart();
  const { user, isAuthenticated, setIsAuthModalOpen, logout } = useAuth();
  const { selectedAddress, setIsAddressModalOpen, estimatedTimeMinutes } = useLocation();

  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = onSearchChange || setInternalSearchQuery;

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredSearchProducts = searchQuery.trim().length > 0
    ? MOCK_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 glass-header border-b border-[#e0e4da] transition-all shadow-sm">
      {/* Top Banner Ticker */}
      <div className="bg-[#0d631b] text-white text-xs font-semibold py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#f59e0b] animate-pulse" />
        <span>⚡ 10-Minute Delivery Guaranteed | FREE Delivery on orders above ₹199</span>
        <span className="hidden md:inline-block bg-[#2e7d32] text-xs px-2 py-0.5 rounded-full font-bold text-[#cbffc2] ml-2">
          CODE: CARTIT100
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Express Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-11 h-11 bg-[#0d631b] rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-[#0d631b] leading-tight flex items-center gap-1">
                  Cart<span className="text-[#ea580c]">IT</span>
                </span>
                <span className="text-[10px] font-extrabold tracking-widest text-[#286b33] uppercase">
                  INSTANT GROCERY
                </span>
              </div>
            </a>

            {/* Express Delivery Badge */}
            <div className="hidden lg:flex items-center gap-1.5 bg-[#e6f4e8] border border-[#abf4ac] px-3 py-1.5 rounded-full">
              <Zap className="w-4 h-4 text-[#0d631b] fill-[#0d631b] animate-bounce" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-extrabold text-[#0d631b] uppercase leading-none">
                  DELIVERY IN
                </span>
                <span className="text-xs font-black text-[#0d631b] leading-tight">
                  ⚡ {estimatedTimeMinutes} MINS
                </span>
              </div>
            </div>
          </div>

          {/* Location Picker */}
          <button
            onClick={() => setIsAddressModalOpen(true)}
            className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-[#e0e4da] hover:border-[#0d631b] hover:shadow-sm transition-all text-left group shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-[#e6f4e8] flex items-center justify-center text-[#0d631b] group-hover:bg-[#0d631b] group-hover:text-white transition-colors">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex flex-col max-w-[150px] lg:max-w-[200px] truncate">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-[#0d631b]">
                  {selectedAddress.label}
                </span>
                <ChevronDown className="w-3 h-3 text-[#40493d]" />
              </div>
              <span className="text-xs font-medium text-[#40493d] truncate">
                {selectedAddress.houseNo}, {selectedAddress.street}
              </span>
            </div>
          </button>

          {/* Search Bar with Live Suggestions */}
          <div ref={searchRef} className="flex-1 max-w-xl relative">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#707a6c]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search for 'Milk', 'Atta', 'Mangoes' or 'Tomatoes'..."
                className="w-full pl-11 pr-10 py-3 bg-white border border-[#e0e4da] rounded-2xl text-sm font-medium focus:outline-none focus:border-[#0d631b] focus:ring-2 focus:ring-[#0d631b]/20 transition-all shadow-sm placeholder:text-[#707a6c]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#707a6c] hover:text-[#181d17]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Auto-suggest Search Popup */}
            {isSearchFocused && filteredSearchProducts.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#e0e4da] shadow-ambient-lg p-2 z-50">
                <div className="px-3 py-1.5 text-[11px] font-bold text-[#707a6c] uppercase tracking-wider">
                  Matching Products
                </div>
                {filteredSearchProducts.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectProduct?.(p);
                      setIsSearchFocused(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-3 p-2.5 hover:bg-[#f7fbf0] rounded-xl cursor-pointer transition-colors"
                  >
                    <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-contain rounded-lg bg-gray-50" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[#181d17] truncate">{p.name}</div>
                      <div className="text-[11px] text-[#40493d]">{p.unit}</div>
                    </div>
                    <div className="text-xs font-black text-[#0d631b]">₹{p.price}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Right: Auth & Cart Drawer Button */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Auth / Account Button */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white border border-[#e0e4da] hover:border-[#0d631b] transition-all text-xs font-bold"
                >
                  <div className="w-7 h-7 rounded-full bg-[#0d631b] text-white flex items-center justify-center font-bold text-xs">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline-block max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#707a6c]" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-[#e0e4da] shadow-ambient-lg p-1.5 z-50">
                    <div className="px-3 py-2 border-b border-[#e0e4da]">
                      <div className="text-xs font-bold text-[#181d17]">{user?.name}</div>
                      <div className="text-[11px] text-[#707a6c]">{user?.phone}</div>
                    </div>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenOrders?.();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-[#f7fbf0] rounded-xl text-[#181d17] transition-colors"
                    >
                      📦 My Orders & Tracking
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsAddressModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-[#f7fbf0] rounded-xl text-[#181d17] transition-colors"
                    >
                      📍 Saved Addresses
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-red-50 text-red-600 rounded-xl transition-colors mt-1"
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-[#e0e4da] hover:border-[#0d631b] hover:bg-[#f7fbf0] text-xs font-bold text-[#0d631b] transition-all"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#0d631b] hover:bg-[#074712] text-white font-bold text-xs shadow-md transition-all transform active:scale-95 group"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                {totalItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#ea580c] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#0d631b] animate-bounce">
                    {totalItemCount}
                  </span>
                )}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-extrabold text-[#cbffc2] leading-none">
                  {totalItemCount} ITEMS
                </span>
                <span className="text-xs font-black leading-tight">
                  ₹{grandTotal}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
