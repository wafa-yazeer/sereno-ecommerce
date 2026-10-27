import React, { useState } from 'react';
import { 
  Watch, 
  ShoppingBag, 
  Search, 
  Heart, 
  Truck,
  Menu,
  X,
  User as UserIcon,
  Briefcase
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeView: 'shop' | 'orders' | 'admin';
  onNavigate: (view: 'shop' | 'orders' | 'admin') => void;
  onFilterCategory?: (categoryId: string) => void;
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
      
      {/* Top Bar with Dual-Portal Switcher */}
      <div className="bg-[#12151f] border-b border-[#1f2433] py-2 px-4 text-xs text-[#a1a7b8]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#c5a880] animate-pulse"></span>
            <span className="text-white font-medium">Insured Swiss Delivery Worldwide</span>
          </div>

          {/* User vs Admin Portal Switcher */}
          <div className="flex items-center gap-1 bg-[#090b10] p-1 rounded-full border border-[#273043]">
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
              <span>User Portal</span>
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
              <span>Admin Portal</span>
              {currentUser?.role === 'manager' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Active manager session"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => {
            onNavigate('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-9 h-9 rounded-full border border-[#c5a880]/50 flex items-center justify-center bg-[#151922] text-[#c5a880]">
            <Watch className="w-4 h-4" />
          </div>
          <div>
            <span className="font-serif text-xl sm:text-2xl tracking-[0.2em] font-bold text-white uppercase block leading-tight">
              SERENO
            </span>
            <span className="text-[8px] tracking-[0.3em] text-[#a1a7b8] uppercase font-sans block">
              GENÈVE
            </span>
          </div>
        </div>

        {/* Desktop Nav Links (Minimal, without Atelier & Craft) */}
        <nav className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => handleGoToCatalog('all')}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
              activeView === 'shop'
                ? 'text-[#c5a880] bg-[#1a1f2c]'
                : 'text-[#c5c8d6] hover:text-white hover:bg-[#151922]'
            }`}
          >
            All Watches
          </button>
          
          <button
            onClick={() => handleGoToCatalog('cat-chronograph')}
            className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#c5c8d6] hover:text-[#c5a880] hover:bg-[#151922] rounded-lg transition-colors cursor-pointer"
          >
            Chronographs
          </button>

          <button
            onClick={() => handleGoToCatalog('cat-automatic')}
            className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#c5c8d6] hover:text-[#c5a880] hover:bg-[#151922] rounded-lg transition-colors cursor-pointer"
          >
            Automatic
          </button>

          <button
            onClick={() => {
              onNavigate('orders');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeView === 'orders'
                ? 'text-[#c5a880] bg-[#1a1f2c]'
                : 'text-[#c5c8d6] hover:text-white hover:bg-[#151922]'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>Track Order</span>
          </button>
        </nav>

        {/* Right Actions: Search, Wishlist, User Account & Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Search */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search timepieces..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeView !== 'shop') onNavigate('shop');
              }}
              className="w-48 lg:w-56 bg-[#151922] border border-[#2d3345] rounded-full py-1.5 pl-8 pr-7 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#c5a880]"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-xs text-neutral-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Wishlist */}
          {onOpenWishlist && (
            <button
              onClick={onOpenWishlist}
              className="relative p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-[#151922] transition-colors cursor-pointer"
              title="Saved Pieces"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
          )}

          {/* User Account / Sign In */}
          {currentUser ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-[#151922] hover:bg-[#1e2330] border border-[#2d3345] transition-colors cursor-pointer"
              title="Account Details"
            >
              <div className="w-6 h-6 rounded-full bg-[#202737] flex items-center justify-center text-[#c5a880]">
                <UserIcon className="w-3.5 h-3.5" />
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-white max-w-[100px] truncate">
                {currentUser.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 rounded-full bg-[#151922] hover:bg-[#202638] border border-[#2d3345] text-xs font-semibold text-[#c5a880] transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}

          {/* Cart Bag */}
          <button
            onClick={onOpenCart}
            className="relative px-3.5 py-1.5 rounded-full bg-[#c5a880] hover:bg-white text-black font-semibold text-xs flex items-center gap-1.5 transition-colors shadow cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Bag</span>
            {cartCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-black text-[#c5a880] text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-neutral-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e111a] border-b border-[#232733] px-4 py-4 space-y-2 text-xs">
          <button
            onClick={() => handleGoToCatalog('all')}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-[#161a25] text-white"
          >
            All Watches
          </button>
          <button
            onClick={() => handleGoToCatalog('cat-chronograph')}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-[#161a25] text-white"
          >
            Chronographs
          </button>
          <button
            onClick={() => handleGoToCatalog('cat-automatic')}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-[#161a25] text-white"
          >
            Automatic
          </button>
          <button
            onClick={() => {
              onNavigate('orders');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-[#161a25] text-white flex items-center gap-2"
          >
            <Truck className="w-4 h-4 text-[#c5a880]" />
            <span>Track Order</span>
          </button>
        </div>
      )}
    </header>
  );
};
