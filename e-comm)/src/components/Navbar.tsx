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
  Layers,
  User as UserIcon,
  Briefcase
} from 'lucide-react';
import { User } from '../types';

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
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
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
  currentUser,
  onOpenAuth,
  onOpenProfile,
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
      
      {/* Top Luxury Announcement Banner & Dual-Portal Switcher */}
      <div className="bg-[#12151f] border-b border-[#1f2433] py-2 px-4 text-xs text-[#a1a7b8]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#c5a880] animate-pulse"></span>
            <span className="text-white font-medium">Complimentary Worldwide Insured Delivery</span>
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-400">Swiss Calibre Standards</span>
          </div>

          {/* Dedicated Portal Selector Switcher */}
          <div className="flex items-center gap-1 bg-[#090b10] p-1 rounded-full border border-[#273043] shadow-inner">
            <button
              onClick={() => {
                onNavigate('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeView !== 'admin'
                  ? 'bg-[#c5a880] text-black font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3 h-3" />
              <span>User Portal (Collector)</span>
            </button>

            <button
              onClick={() => {
                onNavigate('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeView === 'admin'
                  ? 'bg-amber-400 text-black font-bold shadow'
                  : 'text-neutral-400 hover:text-amber-300'
              }`}
            >
              <Briefcase className="w-3 h-3" />
              <span>Admin Portal (Manager)</span>
              {currentUser?.role === 'manager' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Manager session active"></span>
              )}
            </button>
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
                : currentUser?.role === 'manager'
                ? 'text-amber-300 bg-amber-950/30 border border-amber-800/40 hover:bg-amber-950/50'
                : 'text-[#c5c8d6] hover:text-white hover:bg-[#151922]'
            }`}
          >
            {currentUser?.role === 'manager' ? (
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Layers className="w-3.5 h-3.5 text-[#c5a880]" />
            )}
            <span>{currentUser?.role === 'manager' ? 'Manager Portal' : 'Admin'}</span>
          </button>
        </nav>

        {/* Right Actions: Search, Wishlist, User Account & Cart Bag */}
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
              className="w-52 lg:w-60 bg-[#151922] border border-[#2d3345] rounded-full py-2 pl-9 pr-8 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880] transition-all"
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

          {/* User Account / Sign In Trigger */}
          {currentUser ? (
            <button
              onClick={onOpenProfile}
              className="p-2 sm:px-3 sm:py-2 text-xs rounded-full border border-[#c5a880]/40 bg-[#161a25] hover:border-[#c5a880] transition-all flex items-center gap-2 text-neutral-200 hover:text-white"
              title="My Account & Profile"
            >
              <div className="w-6 h-6 rounded-full bg-[#c5a880]/20 text-[#c5a880] flex items-center justify-center font-bold text-[11px]">
                {currentUser.name.charAt(0)}
              </div>
              <span className="hidden sm:inline font-medium text-xs max-w-[90px] truncate">
                {currentUser.name.split(' ')[0]}
              </span>
              {currentUser.role === 'manager' && (
                <span className="hidden md:inline text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded font-mono font-bold uppercase">
                  Mgr
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="p-2 sm:px-3.5 sm:py-2 text-xs font-semibold rounded-full border border-[#30384d] bg-[#161a25] hover:border-[#c5a880] hover:text-[#c5a880] transition-all flex items-center gap-1.5 text-neutral-300"
            >
              <UserIcon className="w-3.5 h-3.5 text-[#c5a880]" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

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
            className="relative p-2.5 px-3.5 sm:px-4 text-neutral-200 hover:text-[#c5a880] hover:bg-[#151922] border border-[#2d3345] rounded-full transition-all flex items-center gap-2"
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
          
          {/* Mobile User Profile Row */}
          <div className="p-3 mb-2 rounded-xl bg-[#161a25] border border-[#272e40] flex items-center justify-between">
            {currentUser ? (
              <div 
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenProfile();
                }}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#c5a880]/20 border border-[#c5a880]/40 text-[#c5a880] flex items-center justify-center font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{currentUser.name}</span>
                    {currentUser.role === 'manager' && (
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 py-0.2 rounded font-mono uppercase">
                        Manager
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-[#9fa6b9]">{currentUser.email}</div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2 bg-[#c5a880] text-black font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In / Create Account</span>
              </button>
            )}

            {currentUser && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenProfile();
                }}
                className="text-xs text-[#c5a880] font-semibold hover:underline"
              >
                Profile →
              </button>
            )}
          </div>

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
