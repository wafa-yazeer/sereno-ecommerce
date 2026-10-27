import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Clock, 
  Droplets, 
  Layers, 
  ShoppingBag, 
  Check, 
  MessageSquare,
  Sparkles,
  Lock,
  AlertCircle
} from 'lucide-react';
import { Product, Review, User, Order } from '../types';
import { api } from '../services/api';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onProductUpdated?: (updatedProduct: Product) => void;
  currentUser?: User | null;
  onOpenAuth?: () => void;
  initialTab?: 'specs' | 'reviews';
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onProductUpdated,
  currentUser,
  onOpenAuth,
  initialTab = 'specs',
}) => {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>(initialTab);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [hasPurchasedProduct, setHasPurchasedProduct] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(false);

  // Review form state
  const [reviewName, setReviewName] = useState(currentUser?.name || '');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    if (currentUser?.name) {
      setReviewName(currentUser.name);
    }
  }, [currentUser]);

  // Check if current user has purchased this specific product
  useEffect(() => {
    const verifyPurchase = async () => {
      if (!currentUser || !product) {
        setHasPurchasedProduct(false);
        return;
      }

      try {
        setCheckingPurchase(true);
        const userOrders = await api.getOrders({ email: currentUser.email });
        const purchased = userOrders.some((order: Order) =>
          order.items?.some((item) => item.productId === product.id)
        );
        setHasPurchasedProduct(purchased);
      } catch (err) {
        console.warn('Could not verify purchase history', err);
        setHasPurchasedProduct(false);
      } finally {
        setCheckingPurchase(false);
      }
    };

    verifyPurchase();
  }, [currentUser, product]);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.imageUrl);
      setQuantity(1);
      fetchReviews(product.id);
      setReviewSuccess('');
      setReviewError('');
      if (initialTab) setActiveTab(initialTab);
    }
  }, [product, initialTab]);

  const fetchReviews = async (productId: string) => {
    try {
      setLoadingReviews(true);
      const data = await api.getReviews(productId);
      setReviews(data);
    } catch (err) {
      console.error('Failed to load reviews', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPurchasedProduct) {
      setReviewError('Only customers who have ordered this timepiece can submit feedback.');
      return;
    }

    if (!reviewName.trim() || !reviewTitle.trim() || !reviewComment.trim()) {
      setReviewError('Please complete all review fields.');
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewError('');
      const newReview = await api.createReview({
        productId: product.id,
        customerName: reviewName,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });

      setReviews([newReview, ...reviews]);
      setReviewSuccess('Thank you! Your verified feedback has been published.');
      setReviewTitle('');
      setReviewComment('');
      setReviewRating(5);

      const updated = await api.getProductById(product.id);
      if (onProductUpdated) {
        onProductUpdated(updated);
      }
    } catch (err: any) {
      setReviewError(err.message || 'Failed to submit feedback');
    } finally {
      setSubmittingReview(false);
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-[#11141c] border border-[#2b3142] rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl text-[#e0e2ec]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#232733] bg-[#141822]">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-[#c5a880] font-semibold">
              {product.categoryName}
            </span>
            <span className="text-neutral-500">•</span>
            <span className="text-xs font-mono text-neutral-400">SKU: {product.sku}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-[#232733] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left: Watch Visual */}
            <div className="md:col-span-6 space-y-3">
              <div className="aspect-square bg-[#161a25] rounded-xl border border-[#252b3b] overflow-hidden p-6 flex items-center justify-center relative">
                {product.badge && (
                  <span className="absolute top-4 left-4 text-[10px] font-bold px-2 py-0.5 rounded bg-[#c5a880]/20 text-[#c5a880] border border-[#c5a880]/40 uppercase tracking-wider">
                    {product.badge}
                  </span>
                )}
                <img
                  src={selectedImage || product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain filter contrast-105"
                />
              </div>

              {/* Specs Pills */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-lg bg-[#151924] border border-[#242938]">
                  <Clock className="w-3.5 h-3.5 text-[#c5a880] mx-auto mb-1" />
                  <span className="text-[10px] text-neutral-400 block">Case</span>
                  <span className="font-semibold text-white text-[11px]">{product.caseSize}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#151924] border border-[#242938]">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400 mx-auto mb-1" />
                  <span className="text-[10px] text-neutral-400 block">Water</span>
                  <span className="font-semibold text-white text-[11px]">{product.waterResistance?.split(' ')[0] || '10 ATM'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#151924] border border-[#242938]">
                  <Layers className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
                  <span className="text-[10px] text-neutral-400 block">Dial</span>
                  <span className="font-semibold text-white text-[11px] truncate block">{product.dialColor?.split(' ')[0] || 'Sunburst'}</span>
                </div>
              </div>
            </div>

            {/* Right: Info & Purchase Controls */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-4">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-white">
                  {product.name}
                </h1>

                {/* Rating & Reviews summary */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                  </div>
                  <span className="text-xs font-semibold text-white">{product.rating}</span>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="text-xs text-[#c5a880] hover:underline cursor-pointer"
                  >
                    ({reviews.length} reviews)
                  </button>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline gap-3 my-4">
                  <span className="font-serif text-2xl font-bold text-white">${product.price}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-neutral-500 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 font-mono">
                    Swiss Insured Delivery
                  </span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#232733] space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#2b3142] rounded-lg bg-[#151924]">
                    <button
                      disabled={quantity <= 1 || isOutOfStock}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3 py-2 text-xs font-mono font-bold text-white">
                      {quantity}
                    </span>
                    <button
                      disabled={quantity >= product.stock || isOutOfStock}
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="px-3 py-2 text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    disabled={isOutOfStock}
                    onClick={handleAdd}
                    className={`flex-1 py-3 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isOutOfStock
                        ? 'bg-[#1b202e] text-neutral-500 cursor-not-allowed'
                        : addedAnimation
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#c5a880] text-black hover:bg-white shadow'
                    }`}
                  >
                    {addedAnimation ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>{isOutOfStock ? 'Sold Out' : 'Acquire Timepiece'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs: Specifications & Customer Reviews */}
          <div className="pt-6 border-t border-[#232733]">
            <div className="flex items-center gap-4 border-b border-[#232733] pb-3 mb-5">
              <button
                onClick={() => setActiveTab('specs')}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer pb-1 ${
                  activeTab === 'specs'
                    ? 'text-[#c5a880] border-b-2 border-[#c5a880]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer pb-1 flex items-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? 'text-[#c5a880] border-b-2 border-[#c5a880]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Verified Feedback ({reviews.length})</span>
              </button>
            </div>

            {/* Tab 1: Specs */}
            {activeTab === 'specs' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-[#151924] border border-[#23293a] p-3 rounded-xl">
                  <div className="text-neutral-500 text-[10px] uppercase font-mono">Calibre / Movement</div>
                  <p className="text-xs text-white font-medium mt-0.5">{product.movement}</p>
                </div>
                <div className="bg-[#151924] border border-[#23293a] p-3 rounded-xl">
                  <div className="text-neutral-500 text-[10px] uppercase font-mono">Dial Design</div>
                  <p className="text-xs text-white font-medium mt-0.5">{product.dialColor}</p>
                </div>
                <div className="bg-[#151924] border border-[#23293a] p-3 rounded-xl">
                  <div className="text-neutral-500 text-[10px] uppercase font-mono">Sapphire Glass</div>
                  <p className="text-xs text-white font-medium mt-0.5">{product.glass}</p>
                </div>
                <div className="bg-[#151924] border border-[#23293a] p-3 rounded-xl">
                  <div className="text-neutral-500 text-[10px] uppercase font-mono">Bracelet / Strap</div>
                  <p className="text-xs text-white font-medium mt-0.5">{product.strap}</p>
                </div>
                <div className="bg-[#151924] border border-[#23293a] p-3 rounded-xl">
                  <div className="text-neutral-500 text-[10px] uppercase font-mono">Water Resistance</div>
                  <p className="text-xs text-white font-medium mt-0.5">{product.waterResistance}</p>
                </div>
                <div className="bg-[#151924] border border-[#23293a] p-3 rounded-xl">
                  <div className="text-neutral-500 text-[10px] uppercase font-mono">Case Diameter</div>
                  <p className="text-xs text-white font-medium mt-0.5">{product.caseSize}</p>
                </div>
              </div>
            )}

            {/* Tab 2: Reviews & Purchase-Gated Feedback Form */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Existing Reviews */}
                <div className="space-y-3">
                  {loadingReviews ? (
                    <div className="text-center py-4 text-neutral-400 text-xs">Loading feedback...</div>
                  ) : reviews.length === 0 ? (
                    <div className="text-center py-5 text-neutral-400 text-xs bg-[#151924] rounded-xl border border-[#23293a]">
                      No reviews yet for this model.
                    </div>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev.id} className="bg-[#151924] border border-[#23293a] p-3.5 rounded-xl space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{rev.customerName}</span>
                            <span className="text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 px-1.5 py-0.2 rounded">
                              Verified Owner
                            </span>
                          </div>
                          <div className="flex items-center text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400' : 'text-neutral-600'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <h4 className="text-xs font-semibold text-[#c5a880]">{rev.title}</h4>
                        <p className="text-xs text-neutral-300 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Gated Feedback Submission Area */}
                {checkingPurchase ? (
                  <div className="p-4 rounded-xl bg-[#141824] border border-[#23293a] text-center text-xs text-neutral-400">
                    Checking purchase verification...
                  </div>
                ) : hasPurchasedProduct ? (
                  /* Form enabled for verified purchasers */
                  <div className="bg-[#151924] border border-[#282f42] p-4 rounded-xl">
                    <h4 className="text-xs font-semibold text-white mb-3 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#c5a880]" />
                      <span>Verified Buyer Feedback</span>
                    </h4>

                    {reviewSuccess && (
                      <div className="mb-3 p-2.5 bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 rounded-lg text-xs">
                        {reviewSuccess}
                      </div>
                    )}

                    {reviewError && (
                      <div className="mb-3 p-2.5 bg-rose-950/60 border border-rose-800/40 text-rose-300 rounded-lg text-xs">
                        {reviewError}
                      </div>
                    )}

                    <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-neutral-400 mb-1 text-[11px]">Your Name</label>
                          <input
                            type="text"
                            required
                            value={reviewName}
                            onChange={(e) => setReviewName(e.target.value)}
                            className="w-full bg-[#1c2130] border border-[#2f374c] rounded-lg p-2 text-white focus:outline-none focus:border-[#c5a880]"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-400 mb-1 text-[11px]">Rating</label>
                          <select
                            value={reviewRating}
                            onChange={(e) => setReviewRating(Number(e.target.value))}
                            className="w-full bg-[#1c2130] border border-[#2f374c] rounded-lg p-2 text-white focus:outline-none focus:border-[#c5a880]"
                          >
                            <option value={5}>⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                            <option value={4}>⭐⭐⭐⭐ (4 - Great Quality)</option>
                            <option value={3}>⭐⭐⭐ (3 - Average)</option>
                            <option value={2}>⭐⭐ (2 - Below Expectations)</option>
                            <option value={1}>⭐ (1 - Unsatisfactory)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-neutral-400 mb-1 text-[11px]">Feedback Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Exceptional finishing and dial precision"
                          value={reviewTitle}
                          onChange={(e) => setReviewTitle(e.target.value)}
                          className="w-full bg-[#1c2130] border border-[#2f374c] rounded-lg p-2 text-white focus:outline-none focus:border-[#c5a880]"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-400 mb-1 text-[11px]">Your Comments</label>
                        <textarea
                          required
                          rows={2}
                          placeholder="Share your experience with the craftsmanship and wrist comfort..."
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          className="w-full bg-[#1c2130] border border-[#2f374c] rounded-lg p-2 text-white focus:outline-none focus:border-[#c5a880]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="px-4 py-2 rounded-lg bg-[#c5a880] text-black font-semibold text-xs hover:bg-white transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {submittingReview ? 'Submitting...' : 'Post Verified Review'}
                      </button>
                    </form>
                  </div>
                ) : (
                  /* Inform user that only buyers of this product can review */
                  <div className="p-4 rounded-xl bg-[#141824] border border-[#23293a] text-center space-y-1.5">
                    <ShieldCheck className="w-5 h-5 text-[#c5a880] mx-auto" />
                    <p className="text-xs font-semibold text-white">Verified Purchase Required</p>
                    <p className="text-[11px] text-neutral-400 max-w-sm mx-auto">
                      Reviews can only be submitted by collectors who have ordered this timepiece. Once you place an order, feedback access is unlocked automatically.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
