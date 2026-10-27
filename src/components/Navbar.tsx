import React, { useState } from 'react';
import { 
  Watch, 
  ShoppingBag, 
  Search, 
  Heart, 
  ShieldCheck, 
  Sparkles,
  Truck,
  Compass,
  Menu,
  X,
  Layers
} from 'lucide-react';

interface NavbarProps {
  activeView: 'shop' | 'orders' | 'admin';
  onNavigate: (view: 'shop' | 'orders' | 'admin') => void;
  onFilterCategory?: (categoryId: string) => void;
  onOpenAtelier: () => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist?: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onNavigate,
  onFilterCategory,
  onOpenAtelier,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  searchQuery,
  setSearchQuery,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGoToCatalog = (categoryId?: string) => {
    onNavigate('shop');
    if (categoryId && onFilterCategory) {
      onFilterCategory(categoryId);
    }
    setTimeout(() => {
      const el = document.getElementById('collection-grid-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0b0c10]/95 backdrop-blur-md border-b border-[#232733] text-[#e0e2ec]">
      
      {/* Top Luxury Announcement Banner */}
      <div className="bg-[#12151f] border-b border-[#1f2433] py-2 px-4 text-xs text-[#a1a7b8]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#c5a880] animate-pulse"></span>
            <span className="text-white font-medium">Complimentary Worldwide Insured Delivery</span>
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-400">Orders Over $300</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] sm:text-xs text-[#c5a880]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>5-Year Atelier Warranty</span>
            </div>
            <span className="text-neutral-600 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-neutral-400">Swiss Calibre Standards</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => {
            onNavigate('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-full border border-[#c5a880]/40 flex items-center justify-center bg-[#151922] text-[#c5a880] group-hover:border-[#c5a880] transition-colors shadow-inner">
            <Watch className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif text-2xl tracking-[0.25em] font-bold text-white uppercase block">
              SERENO
            </span>
            <span className="text-[9px] tracking-[0.35em] text-[#a1a7b8] uppercase font-sans -mt-1 block">
              GENÈVE • HAUTE HORLOGERIE
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <button
            id="nav-collection-btn"
            onClick={() => handleGoToCatalog('all')}
            className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${
              activeView === 'shop'
                ? 'text-[#c5a880] bg-[#1a1f2c]'
                : 'text-[#c5c8d6] hover:text-white hover:bg-[#151922]'
            }`}
          >
            All Watches
          </button>
          
          <button
            id="nav-chrono-btn"
            onClick={() => handleGoToCatalog('cat-chronograph')}
            className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#c5c8d6] hover:text-[#c5a880] hover:bg-[#151922] rounded-lg transition-colors"
          >
            Chronographs
          </button>

          <button
            id="nav-automatic-btn"
            onClick={() => handleGoToCatalog('cat-automatic')}
            className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#c5c8d6] hover:text-[#c5a880] hover:bg-[#151922] rounded-lg transition-colors"
          >
            Automatic
          </button>

          <button
            id="nav-atelier-btn"
            onClick={onOpenAtelier}
            className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#c5c8d6] hover:text-[#c5a880] hover:bg-[#151922] rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>Atelier & Craft</span>
          </button>

          <button
            id="nav-orders-btn"
            onClick={() => {
              onNavigate('orders');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 ${
              activeView === 'orders'
                ? 'text-[#c5a880] bg-[#1a1f2c]'
                : 'text-[#c5c8d6] hover:text-white hover:bg-[#151922]'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>Track Order</span>
          </button>

          <button
            id="nav-admin-btn"
            onClick={() => {
              onNavigate('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 ${
              activeView === 'admin'
                ? 'text-[#c5a880] bg-[#1a1f2c]'
                : 'text-[#c5c8d6] hover:text-white hover:bg-[#151922]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>Admin</span>
          </button>
        </nav>

        {/* Right Actions: Search, Wishlist & Cart Bag */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Search */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search watches, calibre, SKU..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeView !== 'shop') onNavigate('shop');
              }}
              className="w-56 lg:w-64 bg-[#151922] border border-[#2d3345] rounded-full py-2 pl-9 pr-8 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880] transition-all"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-xs text-neutral-400 hover:text-white p-0.5"
              >
                ✕
              </button>
            )}
          </div>

          {/* Wishlist Indicator */}
          <button
            onClick={() => {
              if (onOpenWishlist) onOpenWishlist();
              else handleGoToCatalog();
            }}
            className="p-2.5 text-neutral-300 hover:text-[#c5a880] hover:bg-[#151922] border border-[#2d3345] rounded-full transition-colors relative"
            title="Saved Favorites"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#23293a] border border-[#c5a880] text-[#c5a880] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Bag Trigger */}
          <button
            id="cart-drawer-trigger-btn"
            onClick={onOpenCart}
            className="relative p-2.5 px-4 text-neutral-200 hover:text-[#c5a880] hover:bg-[#151922] border border-[#2d3345] rounded-full transition-all flex items-center gap-2"
            title="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-semibold text-white">Bag</span>
            {cartCount > 0 && (
              <span className="bg-[#c5a880] text-black text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-300 hover:text-white hover:bg-[#151922] rounded-md transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#11141c] border-b border-[#232733] px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="mb-3">
            <input
              type="text"
              placeholder="Search watches by name, SKU, calibre..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onNavigate('shop');
              }}
              className="w-full bg-[#1a1f2c] border border-[#2d3345] rounded-lg py-2 pl-3 pr-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#c5a880]"
            />
          </div>
          
          <button
            onClick={() => handleGoToCatalog('all')}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
              activeView === 'shop' ? 'text-[#c5a880] bg-[#1a1f2c]' : 'text-neutral-300'
            }`}
          >
            All Watches
          </button>
          
          <button
            onClick={() => handleGoToCatalog('cat-chronograph')}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-md text-neutral-300 hover:text-white"
          >
            Chronograph Collection
          </button>

          <button
            onClick={() => handleGoToCatalog('cat-automatic')}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-md text-neutral-300 hover:text-white"
          >
            Automatic Mechanicals
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAtelier();
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-md text-[#c5a880] hover:text-white flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Master Atelier & Craftsmanship</span>
          </button>

          <button
            onClick={() => {
              onNavigate('orders');
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md flex items-center gap-2 ${
              activeView === 'orders' ? 'text-[#c5a880] bg-[#1a1f2c]' : 'text-neutral-300'
            }`}
          >
            <Truck className="w-4 h-4 text-[#c5a880]" />
            <span>Track Live Order Status</span>
          </button>

          <button
            onClick={() => {
              onNavigate('admin');
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md flex items-center gap-2 ${
              activeView === 'admin' ? 'text-[#c5a880] bg-[#1a1f2c]' : 'text-neutral-300'
            }`}
          >
            <Layers className="w-4 h-4 text-[#c5a880]" />
            <span>Boutique Admin & Order Management</span>
          </button>
        </div>
      )}
    </header>
  );
};
