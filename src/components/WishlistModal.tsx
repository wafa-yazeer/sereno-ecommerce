import React from 'react';
import { X, Heart, Sparkles, Trash2, ArrowRight, Eye } from 'lucide-react';
import { Product } from '../types';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  products,
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="relative bg-[#111520] border border-[#262c3e] rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl text-[#e0e2ec]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#232733] bg-[#141822] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-950/50 border border-rose-800/40 flex items-center justify-center text-rose-400">
              <Heart className="w-4 h-4 fill-rose-400" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-white tracking-wide">
                Saved Horology Wishlist ({wishlistedProducts.length})
              </h3>
              <p className="text-[11px] text-[#8f95a6]">Your curated selection of fine timepieces</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-[#202534] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {wishlistedProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#161a25] border border-[#262c3d] flex items-center justify-center mx-auto text-neutral-500">
                <Heart className="w-6 h-6 text-neutral-600" />
              </div>
              <h4 className="font-serif text-base font-medium text-white">Your wishlist is empty</h4>
              <p className="text-xs text-[#8f95a6] max-w-xs mx-auto">
                Mark timepieces with the heart icon while browsing our catalog to save them for later comparison.
              </p>
            </div>
          ) : (
            wishlistedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-[#151924] border border-[#242938] rounded-xl p-4 flex gap-4 transition-all hover:border-[#c5a880]/30"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-20 h-20 rounded-lg object-cover bg-[#0d1017] border border-[#242938] shrink-0 cursor-pointer"
                  onClick={() => {
                    onClose();
                    onSelectProduct(product);
                  }}
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 
                        className="font-serif text-sm font-semibold text-white truncate cursor-pointer hover:text-[#c5a880] transition-colors"
                        onClick={() => {
                          onClose();
                          onSelectProduct(product);
                        }}
                      >
                        {product.name}
                      </h4>
                      <button
                        onClick={() => onToggleWishlist(product.id)}
                        className="text-neutral-500 hover:text-rose-400 p-1 transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[11px] text-[#9ca3af] mt-0.5">
                      {product.caseSize} • {product.movement}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="font-mono text-sm font-bold text-[#c5a880]">
                      ${product.price}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onClose();
                          onSelectProduct(product);
                        }}
                        className="p-1.5 rounded-lg bg-[#1f2636] text-neutral-300 hover:text-white transition-colors"
                        title="Inspect timepiece details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          onAddToCart(product);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#c5a880] text-black text-xs font-semibold hover:bg-[#d6bc96] transition-colors flex items-center gap-1"
                      >
                        <span>Add to Reserve</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
