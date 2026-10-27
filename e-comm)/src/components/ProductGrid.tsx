import React from 'react';
import { SlidersHorizontal, ArrowUpDown, Search, RotateCcw, Sparkles } from 'lucide-react';
import { Product, Category } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortOption: string;
  setSortOption: (s: string) => void;
  priceRange: number;
  setPriceRange: (p: number) => void;
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  isLoading: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  setSearchQuery,
  sortOption,
  setSortOption,
  priceRange,
  setPriceRange,
  onSelectProduct,
  onAddToCart,
  wishlist,
  onToggleWishlist,
  isLoading,
}) => {
  const [showFilterDrawer, setShowFilterDrawer] = React.useState(false);

  const resetAllFilters = () => {
    onSelectCategory('all');
    setSearchQuery('');
    setSortOption('newest');
    setPriceRange(600);
  };

  const hasActiveFilters = selectedCategory !== 'all' || searchQuery !== '' || priceRange < 600 || sortOption !== 'newest';

  return (
    <section id="collection-grid-section" className="py-14 bg-[#0b0c10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#c5a880] font-medium mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handcrafted Timepieces</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal">
              Find Your Perfect Watch
            </h2>
            <p className="text-sm text-[#828899] mt-1">
              Explore mechanical calibres, titanium divers, and classic dress watches.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick reset if filtered */}
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-xs text-[#c5a880] hover:text-white flex items-center gap-1 py-1.5 px-3 rounded-lg bg-[#191e2b] border border-[#2c3244] transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}

            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className="md:hidden flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-[#161a25] border border-[#2b3142] text-white"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>Filters</span>
            </button>

            {/* Sort selection dropdown */}
            <div className="relative flex items-center">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#a1a7b8] absolute left-3 pointer-events-none" />
              <select
                id="sort-products-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-[#161a25] border border-[#2b3142] rounded-lg py-2 pl-8 pr-8 text-xs font-medium text-white focus:outline-none focus:border-[#c5a880] cursor-pointer appearance-none"
              >
                <option value="newest">Sort: Newest Arrival</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Pills (Horizontal scrolling bar) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
          <button
            id="filter-cat-all-btn"
            onClick={() => onSelectCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-white text-black shadow-md shadow-white/10'
                : 'bg-[#151924] text-[#a5abbf] border border-[#252a3a] hover:text-white hover:border-[#3a4157]'
            }`}
          >
            All Collections ({categories.reduce((acc, c) => acc + (c.itemCount || 0), 0)})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`filter-cat-${cat.id}-btn`}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-white text-black shadow-md shadow-white/10'
                  : 'bg-[#151924] text-[#a5abbf] border border-[#252a3a] hover:text-white hover:border-[#3a4157]'
              }`}
            >
              {cat.name} {cat.itemCount !== undefined ? `(${cat.itemCount})` : ''}
            </button>
          ))}
        </div>

        {/* Secondary Filter Row: Price Slider & Quick Search */}
        <div className={`mb-8 p-4 rounded-xl bg-[#121622] border border-[#222736] ${showFilterDrawer ? 'block' : 'hidden md:flex'} flex-wrap items-center justify-between gap-4 text-xs`}>
          <div className="flex flex-wrap items-center gap-6">
            {/* Price Filter */}
            <div className="flex items-center gap-3">
              <span className="text-neutral-400 font-medium">Max Price:</span>
              <input
                type="range"
                min={150}
                max={600}
                step={25}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-32 sm:w-44 accent-[#c5a880] cursor-pointer"
              />
              <span className="font-mono text-white font-bold bg-[#1d2333] px-2 py-0.5 rounded border border-[#2c3347]">
                ${priceRange}
              </span>
            </div>

            {/* Active search filter tag */}
            {searchQuery && (
              <div className="flex items-center gap-1.5 bg-[#1d2333] px-2.5 py-1 rounded-md border border-[#2d3448] text-white">
                <Search className="w-3 h-3 text-[#c5a880]" />
                <span>Search: &quot;{searchQuery}&quot;</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-1 text-neutral-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="text-neutral-400">
            Showing <span className="text-white font-bold">{products.length}</span> luxury timepieces
          </div>
        </div>

        {/* Product Cards Grid */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-2 border-[#c5a880] border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-neutral-400">Synchronizing catalog with REST API...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center bg-[#131722] border border-[#232838] rounded-2xl p-8">
            <div className="w-12 h-12 rounded-full bg-[#1e2333] text-[#c5a880] flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No watches match your criteria</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-6">
              Try adjusting your category filter, price slider, or search term to discover available pieces.
            </p>
            <button
              onClick={resetAllFilters}
              className="px-5 py-2.5 rounded-lg bg-[#c5a880] text-black font-semibold text-xs hover:bg-white transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
                onAddToCart={onAddToCart}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
