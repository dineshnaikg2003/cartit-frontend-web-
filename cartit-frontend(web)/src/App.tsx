import React, { useState, useMemo, useEffect } from 'react';
import { 
  CartProvider, useCart 
} from './context/CartContext';
import { 
  AuthProvider, useAuth 
} from './context/AuthContext';
import { 
  LocationProvider, useLocation 
} from './context/LocationContext';
import { Navbar } from './components/Navbar';
import { CategoryBar } from './components/CategoryBar';
import { HeroBanners } from './components/HeroBanners';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { LiveTrackingModal } from './components/LiveTrackingModal';
import { AuthModal } from './components/AuthModal';
import { AddressModal } from './components/AddressModal';
import { Footer } from './components/Footer';
import { products as mockProducts, categories as mockCategories } from './data/mockData';
import { productsApi, categoriesApi } from './services/api';
import { Product, Category } from './types';
import { 
  Sparkles, Flame, ShieldCheck, ShoppingBag, 
  ArrowRight, Search, SlidersHorizontal, ChevronRight 
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { cart, billDetails } = useCart();
  const { user } = useAuth();
  const { activeAddress } = useLocation();

  // State controls for UI modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  // Live products & categories state
  const [productsList, setProductsList] = useState<Product[]>(mockProducts);
  const [categoriesList, setCategoriesList] = useState<Category[]>(mockCategories);

  useEffect(() => {
    const loadBackendData = async () => {
      try {
        const catRes = await categoriesApi.getAll();
        if (Array.isArray(catRes) && catRes.length > 0) {
          const mappedCats: Category[] = catRes.map((c: any) => ({
            id: String(c.id),
            name: c.name,
            icon: 'Grid',
            image: c.imageUrl || c.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300',
            itemCount: c.productCount || 10,
          }));
          setCategoriesList([{ id: 'all', name: 'All Products', icon: 'Grid', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300', itemCount: 24 }, ...mappedCats]);
        }

        const prodRes = await productsApi.getAll();
        const contentList = prodRes?.content || prodRes;
        if (Array.isArray(contentList) && contentList.length > 0) {
          const mappedProds: Product[] = contentList.map((p: any) => ({
            id: String(p.id),
            name: p.name,
            category: p.categoryName || String(p.categoryId || 'veg'),
            price: p.discountedPrice || p.price || 49,
            originalPrice: p.price || 59,
            unit: p.unit || '500g',
            imageUrl: p.imageUrl || p.primaryImageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=500',
            discountPercent: p.discountPercentage || 10,
            isOrganic: p.organic || true,
            isExpress: true,
            rating: p.averageRating || 4.8,
            ratingCount: p.reviewCount || 120,
            description: p.description || p.name,
            stock: p.stockQuantity || 50,
          }));
          setProductsList(mappedProds);
        }
      } catch (e) {
        console.log('Backend catalog API offline or empty, rendering standard catalog.');
      }
    };

    loadBackendData();
  }, []);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return productsList.filter((product: Product) => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory || product.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.tags && product.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCategory && matchesSearch;
    });
  }, [productsList, selectedCategory, searchQuery]);

  // Featured / Hot Deals subsection
  const bestSellers = useMemo(() => {
    return productsList.filter((p: Product) => p.isBestSeller || p.rating >= 4.8);
  }, [productsList]);

  const handleOrderPlaced = (orderId: string) => {
    setActiveOrderId(orderId);
    setIsTrackingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f7fbf0] font-sans text-gray-900 flex flex-col selection:bg-emerald-200">
      {/* 1. Header Navigation Bar */}
      <Navbar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAddress={() => setIsAddressOpen(true)}
        onSelectProduct={(product) => setSelectedProduct(product)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-4 pb-20 space-y-8">
        {/* 2. Hero Banner Carousel */}
        <HeroBanners 
          onBannerClick={() => {
            setSelectedCategory('all');
            window.scrollTo({ top: 450, behavior: 'smooth' });
          }} 
        />

        {/* 3. Horizontal Category Filter Chips Bar */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-lg font-black font-sans text-emerald-950 flex items-center gap-2">
              <span>Explore Categories</span>
            </h2>
            <span className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer">
              {categoriesList.length} Categories
            </span>
          </div>

          <CategoryBar 
            categories={categoriesList}
            selectedCategory={selectedCategory}
            onSelectCategory={(id) => setSelectedCategory(id)}
          />
        </div>

        {/* 4. Best Sellers / Hot Deals Carousel Section */}
        {selectedCategory === 'all' && !searchQuery && (
          <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/5 to-emerald-700/10 p-6 rounded-3xl border border-amber-500/20 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">10-Minute Best Sellers</h3>
                  <p className="text-xs text-gray-600">Most ordered items in your neighborhood</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {bestSellers.map((product: Product) => (
                <ProductCard 
                  key={`bestseller-${product.id}`}
                  product={product}
                  onOpenDetail={setSelectedProduct}
                />
              ))}
            </div>
          </div>
        )}

        {/* 5. Main Product Catalog Grid */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-900/10 pb-3">
            <div>
              <h2 className="text-xl font-black font-sans text-emerald-950 tracking-tight flex items-center gap-2">
                {selectedCategory === 'all' ? (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span>All Express Groceries</span>
                  </>
                ) : (
                  <span>{categoriesList.find((c: Category) => c.id === selectedCategory)?.name || 'Category'}</span>
                )}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Showing {filteredProducts.length} items available for instant delivery
              </p>
            </div>

            {searchQuery && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Search results for "{searchQuery}"</span>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-bold text-emerald-700 underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
              {filteredProducts.map((product: Product) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  onOpenDetail={setSelectedProduct}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300 p-8">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">No items found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                We couldn't find any products matching your search or category filter. Try clearing your search term.
              </p>
              <button 
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                className="mt-4 bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs hover:bg-emerald-800 transition"
              >
                Reset Catalog Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* 6. Floating Mobile Express Bottom Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 sm:hidden">
          <div 
            onClick={() => setIsCartOpen(true)}
            className="bg-emerald-900 text-white rounded-2xl p-3.5 shadow-2xl flex items-center justify-between border border-emerald-700 cursor-pointer animate-slideUp"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 font-black text-sm flex items-center justify-center shadow-xs">
                {cart.reduce((a: number, b) => a + b.quantity, 0)}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block">CartIT Express</span>
                <div className="flex items-center gap-1.5 text-sm font-black">
                  <span>₹{billDetails.toPay}</span>
                  <span className="text-xs text-emerald-300 font-normal">({cart.length} items)</span>
                </div>
              </div>
            </div>

            <button className="flex items-center gap-1 bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs">
              <span>View Cart</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 7. Footer */}
      <Footer />

      {/* 8. Modals */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderPlaced={handleOrderPlaced}
        onOpenAddressModal={() => setIsAddressOpen(true)}
        onOpenAuthModal={() => setIsAuthOpen(true)}
      />

      <LiveTrackingModal 
        isOpen={isTrackingOpen}
        orderId={activeOrderId}
        onClose={() => setIsTrackingOpen(false)}
      />

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <AddressModal 
        isOpen={isAddressOpen}
        onClose={() => setIsAddressOpen(false)}
      />

      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <LocationProvider>
        <CartProvider>
          <MainContent />
        </CartProvider>
      </LocationProvider>
    </AuthProvider>
  );
};

export default App;
