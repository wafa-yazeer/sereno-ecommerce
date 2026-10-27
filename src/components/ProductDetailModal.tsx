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
  AlertCircle
} from 'lucide-react';
import { Product, Review } from '../types';
import { api } from '../services/api';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onProductUpdated?: (updatedProduct: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onProductUpdated,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Review form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedImage(product.imageUrl);
      setQuantity(1);
      fetchReviews(product.id);
      setReviewSuccess('');
      setReviewError('');
    }
  }, [product]);

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
      setReviewSuccess('Thank you! Your verified review has been published.');
      setReviewName('');
      setReviewTitle('');
      setReviewComment('');
      setReviewRating(5);

      // Refresh product rating from API
      const updated = await api.getProductById(product.id);
      if (onProductUpdated) {
        onProductUpdated(updated);
      }
    } catch (err: any) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-[#11141c] border border-[#2b3142] rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl shadow-black text-[#e0e2ec]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
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
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-[#232733] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left: Gallery & Main Image */}
            <div className="md:col-span-6 space-y-4">
              <div className="aspect-square bg-[#161a25] rounded-xl border border-[#252b3b] overflow-hidden p-6 flex items-center justify-center relative">
                {product.badge && (
                  <span className="absolute top-4 left-4 text-[10px] font-bold px-2.5 py-1 rounded bg-[#c5a880]/20 text-[#c5a880] border border-[#c5a880]/40 uppercase tracking-wider">
                    {product.badge}
                  </span>
                )}
                <img
                  src={selectedImage || product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain filter contrast-105 transition-all duration-300"
                />
              </div>

              {/* Thumbnails */}
              {product.galleryImages && product.galleryImages.length > 1 && (
                <div className="flex items-center gap-3">
                  {product.galleryImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`w-16 h-16 rounded-lg bg-[#161a25] border overflow-hidden p-1 transition-all ${
                        selectedImage === imgUrl ? 'border-[#c5a880] ring-1 ring-[#c5a880]' : 'border-[#252b3b] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info, Price, Actions */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-white tracking-wide mb-2">
                  {product.name}
                </h2>

                {/* Rating & Reviews pill */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="text-sm font-bold text-white">{product.rating}</span>
                  </div>
                  <span className="text-xs text-neutral-400">({product.reviewCount} customer reviews)</span>
                  <span className="text-neutral-500">•</span>
                  <span className="text-xs text-emerald-400 font-medium">Authenticity Certified</span>
                </div>

                {/* Price display */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-serif text-3xl font-bold text-white">${product.price}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-sm text-neutral-500 line-through">${product.originalPrice}</span>
                      <span className="text-xs font-semibold text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-800/40">
                        Save ${product.originalPrice - product.price}
                      </span>
                    </>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#9da4b8] leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Stock status indicator */}
                <div className="mb-6 p-3 rounded-lg bg-[#161a25] border border-[#262c3d] flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Inventory Status:</span>
                  {isOutOfStock ? (
                    <span className="text-rose-400 font-bold">Temporarily Sold Out</span>
                  ) : product.stock < 8 ? (
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Only {product.stock} units remaining
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-bold">{product.stock} units ready to dispatch</span>
                  )}
                </div>

                {/* Quantity selector & Add to cart */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-[#2b3142] bg-[#161a25] rounded-lg">
                    <button
                      disabled={isOutOfStock || quantity <= 1}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-neutral-400 hover:text-white disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold font-mono text-white">{quantity}</span>
                    <button
                      disabled={isOutOfStock || quantity >= product.stock}
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-2 text-neutral-400 hover:text-white disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>

                  <button
                    id="modal-add-to-cart-btn"
                    disabled={isOutOfStock}
                    onClick={handleAdd}
                    className={`flex-1 py-3 px-6 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      addedAnimation
                        ? 'bg-emerald-500 text-black'
                        : isOutOfStock
                        ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                        : 'bg-[#c5a880] text-black hover:bg-white active:scale-[0.98] shadow-lg shadow-black/50'
                    }`}
                  >
                    {addedAnimation ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Bag!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>{isOutOfStock ? 'Sold Out' : `Add ${quantity} to Bag • $${product.price * quantity}`}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Guarantees */}
              <div className="pt-4 border-t border-[#232733] grid grid-cols-2 gap-3 text-[11px] text-neutral-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>24-Month Manufacturer Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>Complimentary Insured Courier</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Switcher: Specifications vs Reviews */}
          <div className="border-t border-[#232733] pt-6">
            <div className="flex items-center gap-6 border-b border-[#232733] pb-3 mb-6">
              <button
                onClick={() => setActiveTab('specs')}
                className={`text-sm font-semibold pb-2 border-b-2 transition-all ${
                  activeTab === 'specs'
                    ? 'border-[#c5a880] text-white'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                Technical Horology Specifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`text-sm font-semibold pb-2 border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'reviews'
                    ? 'border-[#c5a880] text-white'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Customer Reviews ({reviews.length})</span>
              </button>
            </div>

            {/* Tab 1: Specifications Table */}
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-[#151924] border border-[#23293a] p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-[#c5a880] text-xs font-semibold mb-1">
                    <Clock className="w-4 h-4" />
                    <span>Calibre & Movement</span>
                  </div>
                  <p className="text-xs text-white font-mono">{product.movement}</p>
                </div>

                <div className="bg-[#151924] border border-[#23293a] p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
                    <Layers className="w-4 h-4" />
                    <span>Case Diameter</span>
                  </div>
                  <p className="text-xs text-white font-mono">{product.caseSize} (316L Surgical Steel)</p>
                </div>

                <div className="bg-[#151924] border border-[#23293a] p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
                    <Droplets className="w-4 h-4" />
                    <span>Water Resistance</span>
                  </div>
                  <p className="text-xs text-white font-mono">{product.waterResistance}</p>
                </div>

                <div className="bg-[#151924] border border-[#23293a] p-4 rounded-xl">
                  <div className="text-neutral-400 text-xs font-semibold mb-1">Dial Aesthetics</div>
                  <p className="text-xs text-white">{product.dialColor}</p>
                </div>

                <div className="bg-[#151924] border border-[#23293a] p-4 rounded-xl">
                  <div className="text-neutral-400 text-xs font-semibold mb-1">Crystal Lens</div>
                  <p className="text-xs text-white">{product.glass}</p>
                </div>

                <div className="bg-[#151924] border border-[#23293a] p-4 rounded-xl">
                  <div className="text-neutral-400 text-xs font-semibold mb-1">Bracelet / Strap</div>
                  <p className="text-xs text-white">{product.strap}</p>
                </div>
              </div>
            )}

            {/* Tab 2: Customer Reviews & Submission Form */}
            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* List of existing reviews */}
                <div className="space-y-4">
                  {loadingReviews ? (
                    <div className="text-center py-6 text-neutral-400 text-xs">Loading verified feedback...</div>
                  ) : reviews.length === 0 ? (
                    <div className="text-center py-6 text-neutral-400 text-xs bg-[#151924] rounded-xl border border-[#23293a]">
                      No reviews yet for this model. Be the first to share your experience!
                    </div>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev.id} className="bg-[#151924] border border-[#23293a] p-4 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{rev.customerName}</span>
                            {rev.verifiedPurchase && (
                              <span className="text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded">
                                Verified Collector
                              </span>
                            )}
                          </div>
                          <div className="flex items-center text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400' : 'text-neutral-600'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <h4 className="text-xs font-semibold text-[#c5a880]">{rev.title}</h4>
                        <p className="text-xs text-[#a6acc0] leading-relaxed">{rev.comment}</p>
                        <div className="text-[10px] text-neutral-500">{new Date(rev.createdAt).toLocaleDateString()}</div>
                      </div>
                    ))
                  )}
                </div>

                {/* Write a review form */}
                <div className="bg-[#151924] border border-[#282f42] p-5 rounded-xl">
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#c5a880]" />
                    <span>Submit a Verified Customer Review</span>
                  </h4>

                  {reviewSuccess && (
                    <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 rounded-lg text-xs">
                      {reviewSuccess}
                    </div>
                  )}

                  {reviewError && (
                    <div className="mb-4 p-3 bg-rose-950/60 border border-rose-800/40 text-rose-300 rounded-lg text-xs">
                      {reviewError}
                    </div>
                  )}

                  <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-neutral-400 mb-1">Your Name / Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Dr. Roland M."
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          className="w-full bg-[#1c2130] border border-[#2f374c] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#c5a880]"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-400 mb-1">Rating (1 to 5 Stars)</label>
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(Number(e.target.value))}
                          className="w-full bg-[#1c2130] border border-[#2f374c] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#c5a880]"
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
                      <label className="block text-neutral-400 mb-1">Review Headline</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Remarkable dial depth and precision"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        className="w-full bg-[#1c2130] border border-[#2f374c] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#c5a880]"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-400 mb-1">Detailed Evaluation</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Write your honest thoughts regarding the finishing, movement reliability, and wrist presence..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full bg-[#1c2130] border border-[#2f374c] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#c5a880]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="px-5 py-2.5 rounded-lg bg-[#c5a880] text-black font-semibold hover:bg-white transition-colors disabled:opacity-50"
                    >
                      {submittingReview ? 'Submitting to REST API...' : 'Publish Customer Review'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
