
import React, { useState, useEffect } from 'react';
import { Product, Page } from '../types';
import ProductCard from '../components/ProductCard';
import { recommendationAPI } from '../services/apiService';

interface HomeProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onNavigate: (page: Page) => void;
}

const Home: React.FC<HomeProps> = ({ products, onProductSelect, onAddToCart, onNavigate }) => {
  const trending = products.slice(0, 4);
  const featuredProduct = products.find(p => p.id === 'p2') || products[1] || products[0];
  const [cfRecommendations, setCfRecommendations] = useState<Product[]>([]);
  const [cfLoading, setCfLoading] = useState(false);

  useEffect(() => {
    const fetchCF = async () => {
      try {
        setCfLoading(true);
        const data = await recommendationAPI.hybrid(4);
        if (data.recommendations?.length > 0) {
          setCfRecommendations(data.recommendations.map((p: any) => ({
            ...p,
            id: String(p.id),
            specs: p.specs || {}
          })));
        }
      } catch {
        // User not logged in or no data - use trending
      } finally {
        setCfLoading(false);
      }
    };
    fetchCF();
  }, []);

  const aiPickProducts = cfRecommendations.length > 0 ? cfRecommendations : trending;

  // Nếu không có sản phẩm nào, hiển thị placeholder
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6">
        <div className="size-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-400">
          <span className="material-symbols-outlined !text-[40px]">inventory_2</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Chưa có sản phẩm</h2>
        <p className="text-slate-500 text-sm max-w-md text-center">
          Hiện tại chưa có sản phẩm nào trong hệ thống. Vui lòng quay lại sau hoặc liên hệ quản trị viên.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Hero Section */}
      <section className="relative w-full rounded-[2rem] overflow-hidden shadow-2xl bg-[#0b0f17] min-h-[450px] md:h-[550px] group border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 pointer-events-none"></div>
        <div className="flex h-full relative">
          {/* Content side */}
          <div className="relative z-20 flex flex-col justify-center p-8 md:p-16 lg:p-20 gap-8 w-full md:w-1/2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 w-fit backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Mới ra mắt</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter text-white font-display">
                {featuredProduct?.name || 'Sản phẩm nổi bật'} <br className="hidden lg:block" />
              </h1>
              <p className="text-lg md:text-xl text-slate-300 font-light max-w-md leading-relaxed">
                {featuredProduct?.description || 'Khám phá công nghệ mới nhất tại TechStore'}
              </p>
            </div>
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => featuredProduct && onProductSelect(featuredProduct)}
                disabled={!featuredProduct}
                className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary-dark text-white font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/30 flex items-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mua Ngay
                <span className="material-symbols-outlined !text-[20px]">arrow_forward</span>
              </button>
              <button
                onClick={() => featuredProduct && onProductSelect(featuredProduct)}
                disabled={!featuredProduct}
                className="h-14 px-10 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest backdrop-blur-md transition-all border border-white/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Xem chi tiết
              </button>
            </div>
          </div>

          {/* Image side - FIXED */}
          <div className="absolute right-0 top-0 w-full md:w-3/5 h-full overflow-hidden">
            {featuredProduct?.image ? (
              <img
                src={featuredProduct.image}
                alt={featuredProduct.name || "Featured Product"}
                className="w-full h-full object-cover object-center transform transition-transform duration-[3s] group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-indigo-500/20 flex items-center justify-center">
                <span className="material-symbols-outlined !text-[120px] text-white/20">image</span>
              </div>
            )}
            {/* Blend mask */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#0b0f17] hidden md:block"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] to-transparent md:hidden"></div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
        {[
          { icon: 'local_shipping', title: 'Free Shipping', desc: 'Miễn phí vận chuyển cho đơn hàng từ 500k', color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { icon: 'verified_user', title: 'Authenticity Guaranteed', desc: 'Cam kết sản phẩm chính hãng 100%', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { icon: 'payments', title: 'Flexible Payment', desc: 'Hỗ trợ trả góp 0% lãi suất cực kỳ dễ dàng', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
          { icon: 'support_agent', title: '24/7 Premium Support', desc: 'Đội ngũ chuyên gia tư vấn tận tâm 24/7', color: 'text-rose-500', bg: 'bg-rose-500/10' },
        ].map((f, i) => (
          <div key={i} className="group p-8 rounded-[2.5rem] bg-white dark:bg-surface-dark border border-slate-100 dark:border-surface-border flex flex-col items-start gap-6 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-default overflow-hidden relative">
            {/* Background Accent */}
            <div className={`absolute -right-4 -top-4 size-32 rounded-full ${f.bg} opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>

            <div className={`size-16 rounded-2xl ${f.bg} ${f.color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10 shadow-lg shadow-black/5`}>
              <span className="material-symbols-outlined !text-[36px] font-variation-fill">{f.icon}</span>
            </div>

            <div className="relative z-10 space-y-2">
              <h3 className="font-black text-sm uppercase tracking-[0.15em] text-slate-900 dark:text-white font-display">{f.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{f.desc}</p>
            </div>

            {/* Subtle indicator */}
            <div className="w-12 h-1 bg-slate-100 dark:bg-white/10 rounded-full mt-auto relative z-10 group-hover:w-20 group-hover:bg-primary transition-all duration-500"></div>
          </div>
        ))}
      </section>

      {/* AI Recommendation Showcase */}
      <section className="flex flex-col gap-8">
        <div className="flex items-end justify-between px-2">
          <div className="flex items-center gap-5">
            <div className="size-14 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 text-white shadow-2xl shadow-primary/30 flex items-center justify-center">
              <span className="material-symbols-outlined !text-[32px] font-variation-fill animate-sparkle">auto_awesome</span>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black font-display tracking-tight uppercase leading-none">Gợi ý dành riêng cho bạn</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-light mt-2 italic">Được AI cá nhân hóa theo sở thích của bạn</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate(Page.LISTING)}
            className="px-8 py-3 rounded-xl border border-slate-200 dark:border-surface-border text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all hidden sm:block font-display"
          >
            Xem tất cả
          </button>
        </div>
        {cfLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-3xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-surface-border p-6 animate-pulse">
                <div className="aspect-square bg-slate-100 dark:bg-white/5 rounded-2xl mb-4"></div>
                <div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : aiPickProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {aiPickProducts.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={onProductSelect}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-500">
            <p>Chưa có sản phẩm để gợi ý</p>
          </div>
        )}
        {cfRecommendations.length > 0 && (
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-2">
            <span className="material-symbols-outlined !text-[16px] text-primary">psychology</span>
            <span className="font-medium italic">Được gợi ý bởi Collaborative Filtering AI dựa trên hành vi mua hàng</span>
          </div>
        )}
      </section>

      {/* Gaming Banner */}
      <section
        onClick={() => onNavigate(Page.LISTING)}
        className="rounded-[2.5rem] overflow-hidden relative min-h-[300px] flex items-center group cursor-pointer shadow-2xl"
      >
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSbw3lpVij8ArFHQaJPWCaOm1L8RHIOeMh5Qf6-zf1cPZpC97AwlLLggHWwG2XGFJJvPIN4M9Mqbt4leBMljHCjynsL4VupG6FLIT779DzcUevcgSE5cmlQEFrJEPvbjOyq6lFnXTrjVxfp2ruVyfy6BwBmRQIjQybcEoZJqzjwscr209dRa4kJku9FNP3Rpr222ZEo4frxuqO_GR_hxtck1kus-2QHp-PKPsud4Q6NelpbLsHXWY032UG6Z-rZjIzbau0yEYNMZw"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          alt="Gaming Setup"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
        <div className="relative z-10 p-10 md:p-16 flex flex-col gap-4 items-start">
          <span className="bg-primary text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">Gaming Gear</span>
          <h3 className="text-3xl md:text-5xl font-black text-white font-display max-w-xl leading-tight tracking-tighter">Nâng cấp góc máy, chiến game cực đỉnh</h3>
          <p className="text-slate-300 text-lg font-light mb-4">Giảm tới 30% cho các thiết bị gaming chuyên dụng.</p>
          <button
            onClick={(e) => { e.stopPropagation(); onNavigate(Page.LISTING); }}
            className="px-10 py-4 bg-white text-slate-900 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-white transition-all shadow-2xl flex items-center gap-3"
          >
            Khám phá ngay
            <span className="material-symbols-outlined !text-[18px]">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
            <span className="material-symbols-outlined font-variation-fill">local_fire_department</span>
          </div>
          <h2 className="text-2xl font-black font-display tracking-tight uppercase">Sản phẩm bán chạy</h2>
        </div>
        {products.length > 4 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.slice(4, 8).map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={onProductSelect}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-500">
            <p>Chưa có sản phẩm bán chạy</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
