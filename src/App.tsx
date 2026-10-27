/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, Category, CartItem, Order, User } from './types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from './data/initialCatalog';
import { api } from './services/api';

import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeatureHighlights } from './components/FeatureHighlights';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrdersTracker } from './components/OrdersTracker';
import { AdminPortal } from './components/AdminPortal';
import { WishlistModal } from './components/WishlistModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { Footer } from './components/Footer';

export default function App() {
  // User Authentication State (Persisted in localStorage)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('sereno_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    // Default initial collector session for quick preview
    return {
      id: 'usr-customer-1',
      name: 'Alexander Vance',
      email: 'alexander@sereno.ch',
      role: 'customer',
      phone: '+41 22 819 4400',
      shippingAddress: 'Rue du Rhône 42',
      city: 'Genève',
      postalCode: '1204',
      country: 'Switzerland',
    };
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [authRedirectNotice, setAuthRedirectNotice] = useState('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [productDetailTab, setProductDetailTab] = useState<'specs' | 'reviews'>('specs');

  // Navigation: 'shop' | 'orders' | 'admin'
  const [activeView, setActiveView] = useState<'shop' | 'orders' | 'admin'>('shop');

  // Catalog State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [isLoading, setIsLoading] = useState(false);

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('newest');
  const [priceRange, setPriceRange] = useState<number>(600);

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('sereno_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
      },
    ];
  });

  // Wishlist State (Persisted in localStorage)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sereno_wishlist');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return ['prod-vanguard-auto'];
  });

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Voucher
  const [appliedCoupon, setAppliedCoupon] = useState('SERENO10');
  const [discountAmount, setDiscountAmount] = useState(22);

  // Save cart & wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sereno_cart', JSON.stringify(cart));
    } catch (e) {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('sereno_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      // ignore
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('sereno_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('sereno_user');
      }
    } catch (e) {
      // ignore
    }
  }, [currentUser]);

  // Fetch live products and categories from backend
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [prodsData, catsData] = await Promise.allSettled([
        api.getProducts({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchQuery.trim() || undefined,
          maxPrice: priceRange,
          sort: sortOption,
        }),
        api.getCategories(),
      ]);

      if (prodsData.status === 'fulfilled' && prodsData.value && prodsData.value.length > 0) {
        setProducts(prodsData.value);
      } else {
        // Fallback filter locally on INITIAL_PRODUCTS
        let filtered = [...INITIAL_PRODUCTS];
        if (selectedCategory !== 'all') {
          filtered = filtered.filter(
            (p) => p.categoryId === selectedCategory || p.category?.id === selectedCategory
          );
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.sku.toLowerCase().includes(q) ||
              p.description?.toLowerCase().includes(q) ||
              p.movement?.toLowerCase().includes(q)
          );
        }
        filtered = filtered.filter((p) => p.price <= priceRange);
        if (sortOption === 'price_asc') filtered.sort((a, b) => a.price - b.price);
        else if (sortOption === 'price_desc') filtered.sort((a, b) => b.price - a.price);
        else if (sortOption === 'rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

        setProducts(filtered);
      }

      if (catsData.status === 'fulfilled' && catsData.value && catsData.value.length > 0) {
        setCategories(catsData.value);
      }
    } catch (err) {
      console.warn('Backend currently connecting, using local catalog cache', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, searchQuery, sortOption, priceRange]);

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist Handler
  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Coupon Handler
  const handleApplyCoupon = (code: string, discount: number) => {
    setAppliedCoupon(code);
    setDiscountAmount(discount);
  };

  // Order Completed
  const handleOrderCompleted = (order: Order) => {
    setCompletedOrder(order);
    setIsCheckoutOpen(false);
    setCart([]);
    loadData();
  };

  const handleOpenAuthModal = (mode: 'login' | 'register' = 'login', notice = '') => {
    setAuthInitialMode(mode);
    setAuthRedirectNotice(notice);
    setIsAuthModalOpen(true);
  };

  const handleProceedToCheckout = () => {
    if (!currentUser) {
      setIsCartOpen(false);
      handleOpenAuthModal(
        'register',
        'Please sign in or create an account to complete your timepiece acquisition.'
      );
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOpenProductReviews = (productId: string) => {
    const found = products.find((p) => p.id === productId) || INITIAL_PRODUCTS.find((p) => p.id === productId);
    if (found) {
      setSelectedProduct(found);
      setProductDetailTab('reviews');
    }
  };

  const featuredProduct = products.find((p) => p.featured) || products[0];

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#e0e2ec] flex flex-col selection:bg-[#c5a880] selection:text-black">
      {/* Luxury Horlogerie Navbar */}
      <Navbar
        activeView={activeView}
        onNavigate={setActiveView}
        onFilterCategory={(catId) => {
          setSelectedCategory(catId);
          setActiveView('shop');
        }}
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentUser={currentUser}
        onOpenAuth={() => handleOpenAuthModal('login')}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'shop' && (
          <>
            {/* Minimal Hero Section */}
            <HeroSection
              featuredProduct={featuredProduct}
              onExplore={() => {
                const el = document.getElementById('collection-grid-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onSelectProduct={(p) => {
                setSelectedProduct(p);
                setProductDetailTab('specs');
              }}
            />

            {/* Concise Feature Highlights */}
            <FeatureHighlights />

            {/* Timepieces Catalog & Filter Grid */}
            <ProductGrid
              products={products}
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortOption={sortOption}
              setSortOption={setSortOption}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              onSelectProduct={(p) => {
                setSelectedProduct(p);
                setProductDetailTab('specs');
              }}
              onAddToCart={(p) => handleAddToCart(p, 1)}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              isLoading={isLoading}
            />
          </>
        )}

        {activeView === 'orders' && (
          <div className="py-6">
            <OrdersTracker
              currentUser={currentUser}
              onOpenAuth={() => handleOpenAuthModal('login', 'Sign in to access your personal timepiece order history.')}
              onSelectProductForReview={handleOpenProductReviews}
            />
          </div>
        )}

        {activeView === 'admin' && (
          <div className="py-6">
            <AdminPortal
              currentUser={currentUser}
              onOpenAuth={() => handleOpenAuthModal('login', 'Sign in as a Store Manager for management access.')}
              onAdminLogin={(user) => {
                setCurrentUser(user);
              }}
              onAdminLogout={() => {
                setCurrentUser(null);
                localStorage.removeItem('sereno_user');
              }}
              onNavigateToUserPortal={() => setActiveView('shop')}
            />
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <Footer onNavigate={setActiveView} />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onProductUpdated={(updated) => {
          setSelectedProduct(updated);
          loadData();
        }}
        currentUser={currentUser}
        onOpenAuth={() => handleOpenAuthModal('login')}
        initialTab={productDetailTab}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOpenCheckout={handleProceedToCheckout}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        products={products}
        wishlistIds={wishlist}
        onToggleWishlist={handleToggleWishlist}
        onSelectProduct={(p) => {
          setSelectedProduct(p);
          setProductDetailTab('specs');
        }}
        onAddToCart={(p) => handleAddToCart(p, 1)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        couponCode={appliedCoupon}
        discountAmount={discountAmount}
        onOrderCompleted={handleOrderCompleted}
        onClearCart={handleClearCart}
        currentUser={currentUser}
      />

      {/* Order Confirmed Success Modal */}
      <OrderSuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
        onViewOrders={() => {
          setCompletedOrder(null);
          setActiveView('orders');
        }}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthModalOpen(false);
        }}
        initialMode={authInitialMode}
        redirectNotice={authRedirectNotice}
      />

      {/* User Profile Modal (View-Only Shipping Details) */}
      {currentUser && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={currentUser}
          onLogout={() => {
            setCurrentUser(null);
            localStorage.removeItem('sereno_user');
          }}
          onNavigateToOrders={() => setActiveView('orders')}
          onNavigateToManagerPortal={() => setActiveView('admin')}
        />
      )}
    </div>
  );
}
