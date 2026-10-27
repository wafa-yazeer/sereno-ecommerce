import React from 'react';
import { Eye, ShoppingBag, Heart, Star, AlertCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 8;

  return (
    <div className="group relative bg-[#131722] border border-[#232838] rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:border-[#c5a880]/50 hover:shadow-xl hover:shadow-black/60">
      {/* Image Container with Badges and Overlays */}
      <div className="relative aspect-square w-full bg-[#171b26] overflow-hidden flex items-center justify-center p-6">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.badge && (
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider backdrop-blur-md ${
                product.badge.includes('50%') || product.badge.includes('20%')
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-700/50'
                  : product.badge === 'New Arrival'
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50'
                  : 'bg-[#c5a880]/20 text-[#c5a880] border border-[#c5a880]/40'
              }`}
            >
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
            isWishlisted
              ? 'bg-rose-500/20 border-rose-500 text-rose-400'
              : 'bg-[#121620]/80 border-[#2d3345] text-neutral-400 hover:text-white'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-400' : ''}`} />
        </button>

        {/* Watch Image */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-contain filter contrast-105 group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          onClick={() => onSelect(product)}
        />

        {/* Quick View overlay on hover */}
        <div className="absolute inset-x-4 bottom-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
          <button
            onClick={() => onSelect(product)}
            className="flex-1 py-2 rounded-lg bg-[#1a1f2e]/90 hover:bg-[#252c40] text-xs font-medium text-white border border-[#373f55] backdrop-blur-md transition-colors flex items-center justify-center gap-1.5 shadow-md"
          >
            <Eye className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & SKU */}
          <div className="flex items-center justify-between text-[11px] text-[#787f94] mb-1.5">
            <span className="uppercase tracking-wider font-semibold text-[#a6adb8]">{product.categoryName}</span>
            <span className="font-mono text-[10px] text-neutral-500">{product.sku}</span>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onSelect(product)}
            className="font-serif text-base font-semibold text-white group-hover:text-[#c5a880] transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Case Diameter & Movement spec hint */}
          <p className="text-xs text-[#8f96aa] mt-0.5 mb-2 font-mono">
            {product.caseSize} • {product.dialColor}
          </p>

          {/* Star Ratings */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-semibold text-neutral-300">{product.rating}</span>
            <span className="text-[11px] text-neutral-500">({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing, Stock status, and Action */}
        <div className="pt-3 border-t border-[#1f2433]">
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-lg font-bold text-white">${product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-neutral-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            {/* Stock status indicator */}
            {isOutOfStock ? (
              <span className="text-[10px] text-rose-400 font-medium">Sold Out</span>
            ) : isLowStock ? (
              <span className="text-[10px] text-amber-400 flex items-center gap-0.5">
                <AlertCircle className="w-3 h-3" /> Only {product.stock} left
              </span>
            ) : (
              <span className="text-[10px] text-emerald-400 font-medium">{product.stock} in stock</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            id={`add-to-cart-${product.id}`}
            disabled={isOutOfStock}
            onClick={() => onAddToCart(product)}
            className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              isOutOfStock
                ? 'bg-[#1c202d] text-neutral-500 cursor-not-allowed border border-[#272c3d]'
                : 'bg-[#c5a880] text-black hover:bg-white active:scale-[0.98] shadow'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Out of Stock' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
