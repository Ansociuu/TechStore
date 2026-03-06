import React, { useState, useEffect } from 'react';
import { Product, Page, Review, User } from '../types';
import { analyzeProductSpec } from '../services/geminiService';
import { recommendationAPI, productAPI, authAPI } from '../services/apiService';
import ProductCard from '../components/ProductCard';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: Product, quantity?: number) => void;
  onBuyNow: (product: Product, quantity?: number) => void;
  onNavigate: (page: Page) => void;
  onProductSelect?: (product: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onAddToCart, onBuyNow, onNavigate, onProductSelect }) => {
  const [quantity, setQuantity] = useState(1);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(product.reviews || []);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const currentUser: User | null = authAPI.getCurrentUser();

  useEffect(() => {
    const fetchAnalysis = async () => {
      setIsLoadingAnalysis(true);
      const analysis = await analyzeProductSpec(product.name);
      setAiAnalysis(analysis);
      setIsLoadingAnalysis(false);
    };
    fetchAnalysis();
  }, [product.name]);

  useEffect(() => {
    if (product.reviews) {
      setReviews(product.reviews);
    }
  }, [product.reviews]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setIsSubmittingReview(true);
      setReviewError(null);
      const createdReview = await productAPI.addReview(product.id, newReview.rating, newReview.comment);
      setReviews([createdReview, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
      alert('Cảm ơn bạn đã đánh giá sản phẩm!');
    } catch (error: any) {
      setReviewError(error.response?.data?.error || 'Không thể gửi đánh giá. Vui lòng thử lại sau.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Fetch Item-based CF recommendations
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        setRelatedLoading(true);
        const data = await recommendationAPI.forItem(product.id, 4);
        if (data.recommendations?.length > 0) {
          setRelatedProducts(data.recommendations.map((p: any) => ({
            ...p,
            id: String(p.id),
            specs: p.specs || {}
          })));
        } else {
          setRelatedProducts([]);
        }
      } catch {
        setRelatedProducts([]);
      } finally {
        setRelatedLoading(false);
      }
    };
    fetchRelated();
  }, [product.id]);

  return (
    <div className="flex flex-col gap-6 pb-20 max-w-6xl mx-auto animate-in fade-in duration-500">
      {/* Navigation Back */}
      <button
        onClick={() => onNavigate(Page.LISTING)}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-all group w-fit"
      >
        <span className="material-symbols-outlined !text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
        Quay lại danh sách
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-20 items-start">
        {/* Gallery */}
        <div className="flex flex-col gap-6 sticky top-24">
          <div className="relative aspect-[4/3] bg-white dark:bg-surface-dark rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-surface-border p-12 group">
            <img src={product.image} alt={product.name} className="size-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute top-8 left-8 z-10 flex flex-col gap-2">
              {product.isNew && <span className="bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">New Arrival</span>}
              <div className="bg-indigo-600/90 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full flex items-center gap-2 uppercase tracking-widest shadow-xl border border-white/20">
                <span className="material-symbols-outlined !text-[16px] font-variation-fill animate-sparkle">auto_awesome</span> AI Verified
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 px-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`aspect-square rounded-2xl border-2 transition-all cursor-pointer overflow-hidden p-3 bg-white dark:bg-surface-dark ${i === 0 ? 'border-primary shadow-lg shadow-primary/10' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700 opacity-60 hover:opacity-100'}`}>
                <img src={product.image} className="size-full object-contain" />
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-10">
          <div className="space-y-6 border-b border-slate-100 dark:border-surface-border pb-10">
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em]">
              <span className="material-symbols-outlined !text-[18px]">category</span>
              {product.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-display text-slate-900 dark:text-white leading-[1.1] tracking-tight">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined !text-[20px] font-variation-fill">star</span>
                  ))}
                </div>
                <span className="font-black text-slate-900 dark:text-white text-base">{product.rating}</span>
                <span className="text-slate-400 font-medium text-sm">({product.reviewCount} Reviews)</span>
              </div>
              <div className="h-4 w-px bg-slate-200 dark:bg-surface-border hidden md:block"></div>
              <div className="text-green-500 font-black text-sm uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined !text-[20px]">verified</span>
                In Stock
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-end gap-4">
              <span className="text-5xl font-black text-primary tracking-tighter">{product.price.toLocaleString('vi-VN')}₫</span>
              {product.originalPrice && (
                <span className="text-2xl text-slate-400 line-through mb-1">{(product.originalPrice).toLocaleString('vi-VN')}₫</span>
              )}
            </div>
            <p className="text-xs font-black text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 w-fit px-4 py-2 rounded-xl uppercase tracking-widest">
              Trả góp chỉ từ {(product.price / 12).toLocaleString('vi-VN', { maximumFractionDigits: 0 })}₫/tháng
            </p>
          </div>

          {/* AI Insights Block */}
          <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-surface-dark border border-indigo-100 dark:border-indigo-500/20 rounded-3xl p-8 shadow-sm overflow-hidden relative">
            <div className="absolute -right-10 -top-10 bg-primary/10 blur-[80px] size-40 rounded-full"></div>
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h3 className="text-xs font-black text-primary flex items-center gap-3 uppercase tracking-[0.15em]">
                <span className="material-symbols-outlined !text-[22px] font-variation-fill animate-sparkle">auto_awesome</span>
                AI Product Analysis
              </h3>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-black/20 px-2 py-1 rounded">Real-time Data</span>
            </div>
            {isLoadingAnalysis ? (
              <div className="space-y-4 animate-pulse relative z-10">
                <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-full"></div>
                <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-4/5"></div>
                <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-full"></div>
              </div>
            ) : (
              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-3 relative z-10 font-medium">
                {aiAnalysis.split('\n').map((line: string, i: number) => (
                  <p key={i} className="flex gap-2">
                    {line.trim().startsWith('-') && <span className="text-primary">•</span>}
                    {line.replace(/^-/, '').trim()}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-2xl h-16 w-full sm:w-44 p-1.5 border border-transparent focus-within:border-primary transition-all shadow-inner">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="size-12 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">remove</span>
              </button>
              <input
                type="text"
                value={quantity}
                readOnly
                className="w-full bg-transparent border-none text-center font-black text-slate-900 dark:text-white text-lg"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="size-12 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
            <button
              onClick={() => onAddToCart(product, quantity)}
              className="px-8 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-black rounded-2xl h-16 shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 group uppercase tracking-widest text-xs"
            >
              <span className="material-symbols-outlined !text-[22px] group-hover:rotate-12 transition-transform">shopping_cart</span>
              Thêm giỏ hàng
            </button>
            <button
              onClick={() => onBuyNow(product, quantity)}
              className="flex-1 bg-primary hover:bg-primary-dark text-white font-black rounded-2xl h-16 px-10 shadow-2xl shadow-primary/20 transition-all flex items-center justify-center gap-4 active:scale-95 group uppercase tracking-widest text-xs animate-pulse-slow"
            >
              <span className="material-symbols-outlined !text-[22px]">flash_on</span>
              Mua ngay
            </button>
            <button
              onClick={() => {
                const nextState = !isFavorite;
                setIsFavorite(nextState);
                if (nextState) {
                  alert('Đã thêm sản phẩm vào danh sách yêu thích!');
                }
              }}
              className={`rounded-2xl size-16 flex items-center justify-center transition-all active:scale-95 border ${isFavorite ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-500' : 'bg-slate-100 dark:bg-white/5 border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-900 dark:text-white'}`}
            >
              <span className={`material-symbols-outlined !text-[28px] ${isFavorite ? 'font-variation-fill' : ''}`}>favorite</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs / Description */}
      <section className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-surface-border rounded-[2.5rem] p-10 md:p-14 shadow-sm mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-10">
            <h3 className="text-2xl font-black font-display text-slate-900 dark:text-white uppercase tracking-tight">Chi tiết sản phẩm</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xl font-light">
              {product.description} Sản phẩm kết hợp công nghệ hiện đại nhất với thiết kế tinh xảo, mang lại trải nghiệm người dùng hoàn hảo trong mọi điều kiện sử dụng.
            </p>
            <div className="bg-indigo-50/50 dark:bg-indigo-900/10 rounded-3xl p-8 border border-indigo-100 dark:border-indigo-500/10 italic text-slate-600 dark:text-slate-300 font-medium leading-loose text-lg relative">
              <span className="material-symbols-outlined absolute -top-4 -left-4 size-10 bg-white dark:bg-surface-dark rounded-full flex items-center justify-center text-primary shadow-md !text-[20px]">format_quote</span>
              "Một sự lựa chọn không thể bỏ qua cho các tín đồ công nghệ mong muốn sở hữu những thiết bị dẫn đầu xu hướng, kết hợp hoàn hảo giữa tính thẩm mỹ và hiệu năng vượt trội."
            </div>
          </div>
          <div className="space-y-8">
            <h3 className="text-lg font-black font-display text-slate-900 dark:text-white uppercase tracking-widest">Thông số kỹ thuật</h3>
            <div className="space-y-6">
              {Object.entries(product.specs || {}).map(([key, value], i) => (
                <div key={i} className="flex flex-col gap-2 pb-6 border-b border-slate-100 dark:border-surface-border last:border-0">
                  <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">{key}</span>
                  <span className="text-base font-bold text-slate-800 dark:text-slate-100">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Thường mua cùng - Item-based CF */}
      <section className="mt-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="size-12 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 text-white shadow-xl shadow-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined !text-[28px] font-variation-fill">hub</span>
          </div>
          <div>
            <h3 className="text-2xl font-black font-display tracking-tight uppercase">Thường mua cùng</h3>
            <p className="text-xs text-slate-400 italic flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined !text-[14px] text-primary">psychology</span>
              Gợi ý bởi Item-based Collaborative Filtering
            </p>
          </div>
        </div>
        {relatedLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-3xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-surface-border p-6 animate-pulse">
                <div className="aspect-square bg-slate-100 dark:bg-white/5 rounded-2xl mb-4"></div>
                <div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : relatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p: Product) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={onProductSelect || ((prod) => onNavigate(Page.LISTING))}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 bg-slate-50 dark:bg-white/5 rounded-2xl">
            <span className="material-symbols-outlined !text-[32px] mb-2">inventory_2</span>
            <p className="text-sm font-medium">Chưa có dữ liệu gợi ý cho sản phẩm này</p>
          </div>
        )}
      </section>

      {/* Reviews Section */}
      <section className="mt-10 bg-white dark:bg-surface-dark border border-slate-100 dark:border-surface-border rounded-[2.5rem] p-10 md:p-14 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h3 className="text-2xl font-black font-display tracking-tight uppercase">Đánh giá từ khách hàng</h3>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`material-symbols-outlined !text-[24px] ${i < Math.round(product.rating) ? 'font-variation-fill' : ''}`}>star</span>
                ))}
              </div>
              <span className="text-xl font-black">{product.rating.toFixed(1)} / 5</span>
              <span className="text-slate-400 text-sm">({reviews.length} nhận xét)</span>
            </div>
          </div>

          {!currentUser ? (
            <button
              onClick={() => onNavigate(Page.AUTH)}
              className="px-6 py-3 bg-slate-100 dark:bg-white/5 rounded-2xl text-xs font-bold hover:bg-slate-200 transition-all"
            >
              Đăng nhập để đánh giá
            </button>
          ) : null}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Review Form */}
          <div className="lg:col-span-1">
            {currentUser ? (
              <form onSubmit={handleReviewSubmit} className="space-y-6 sticky top-24">
                <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border">
                  <h4 className="text-sm font-black uppercase tracking-widest mb-6">Viết đánh giá của bạn</h4>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2">Số sao</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            className={`size-10 rounded-xl flex items-center justify-center transition-all ${newReview.rating >= star ? 'text-yellow-500' : 'text-slate-300'
                              }`}
                          >
                            <span className={`material-symbols-outlined !text-[28px] ${newReview.rating >= star ? 'font-variation-fill' : ''}`}>star</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2">Nhận xét</label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                        required
                        className="w-full h-32 px-6 py-4 rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-surface-border focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm resize-none"
                      />
                    </div>

                    {reviewError && (
                      <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 text-xs font-medium border border-red-100 dark:border-red-900/30 flex gap-2">
                        <span className="material-symbols-outlined !text-[16px]">error</span>
                        {reviewError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 uppercase tracking-widest text-[10px]"
                    >
                      {isSubmittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
                    </button>

                    <p className="text-[9px] text-slate-400 text-center italic mt-4">
                      * Chỉ những khách hàng đã mua sản phẩm này mới có thể đánh giá.
                    </p>
                  </div>
                </div>
              </form>
            ) : (
              <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border text-center">
                <span className="material-symbols-outlined !text-[48px] text-slate-300 mb-4 font-variation-light">rate_review</span>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Vui lòng đăng nhập và mua sản phẩm để chia sẻ đánh giá của bạn.
                </p>
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-8">
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review: Review) => (
                  <div key={review.id} className="p-8 rounded-[2rem] bg-white dark:bg-surface-dark border border-slate-100 dark:border-surface-border shadow-sm flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex-shrink-0 flex flex-row md:flex-col items-center gap-4 min-w-[120px]">
                      <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl border border-primary/20 overflow-hidden">
                        {review.user.avatar ? (
                          <img src={review.user.avatar} alt={review.user.name} className="size-full object-cover" />
                        ) : (
                          review.user.name.charAt(0)
                        )}
                      </div>
                      <div className="text-center md:text-center">
                        <p className="font-black text-slate-900 dark:text-white text-sm truncate max-w-[100px]">{review.user.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Khách hàng</p>
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`material-symbols-outlined !text-[18px] ${i < review.rating ? 'font-variation-fill' : ''}`}>star</span>
                          ))}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {new Date(review.createdAt).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm italic">
                        "{review.comment}"
                      </p>
                      <div className="flex items-center gap-4 pt-2">
                        <button className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-primary transition-colors">
                          <span className="material-symbols-outlined !text-[16px]">thumb_up</span> Hữu ích
                        </button>
                        <button className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-slate-600 transition-colors">
                          <span className="material-symbols-outlined !text-[16px]">reply</span> Trả lời
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-surface-border">
                <span className="material-symbols-outlined !text-[64px] text-slate-200 mb-4">chat_bubble</span>
                <p className="text-slate-500 font-medium">Chưa có đánh giá nào cho sản phẩm này.</p>
                <p className="text-xs text-slate-400 mt-2">Hãy là người đầu tiên chia sẻ cảm nhận!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
