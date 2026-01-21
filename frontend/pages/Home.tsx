
import React from 'react';
import { Product, Page } from '../types';
import ProductCard from '../components/ProductCard';

interface HomeProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onNavigate: (page: Page) => void;
}

const Home: React.FC<HomeProps> = ({ products, onProductSelect, onAddToCart, onNavigate }) => {
  const trending = products.slice(0, 4);
  const featuredProduct = products.find(p => p.id === 'p2') || products[1];

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
                iPhone 16 <br className="hidden lg:block" />Pro Max
              </h1>
              <p className="text-lg md:text-xl text-slate-300 font-light max-w-md leading-relaxed">
                Titan Tự Nhiên. Chip A17 Pro mạnh mẽ nhất. Thiết kế nhẹ hơn, bền bỉ hơn.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => onProductSelect(featuredProduct)}
                className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary-dark text-white font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/30 flex items-center gap-3 active:scale-95"
              >
                Mua Ngay
                <span className="material-symbols-outlined !text-[20px]">arrow_forward</span>
              </button>
              <button
                onClick={() => onProductSelect(featuredProduct)}
                className="h-14 px-10 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest backdrop-blur-md transition-all border border-white/10 active:scale-95"
              >
                Xem chi tiết
              </button>
            </div>
          </div>

          {/* Image side - FIXED */}
          <div className="absolute right-0 top-0 w-full md:w-3/5 h-full overflow-hidden">
            <img
              src={featuredProduct.image}
              alt="iPhone 16 Pro Max"
              className="w-full h-full object-cover object-center transform transition-transform duration-[3s] group-hover:scale-105"
            />
            {/* Blend mask */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#0b0f17] hidden md:block"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] to-transparent md:hidden"></div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: 'local_shipping', title: 'Free Shipping', desc: 'Đơn từ 500k', color: 'text-blue-500' },
          { icon: 'verified_user', title: 'Authentic', desc: 'Chính hãng 100%', color: 'text-green-500' },
          { icon: 'payments', title: '0% Installment', desc: 'Dễ dàng thanh toán', color: 'text-purple-500' },
          { icon: 'support_agent', title: 'Hỗ trợ 24/7', desc: 'Tư vấn chuyên nghiệp', color: 'text-orange-500' },
        ].map((f, i) => (
          <div key={i} className="p-6 rounded-3xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-surface-border flex flex-col items-center text-center gap-3 shadow-sm hover:shadow-xl transition-all cursor-default group">
            <div className={`p-4 rounded-2xl bg-slate-50 dark:bg-white/5 ${f.color} group-hover:scale-110 transition-transform`}>
              <span className="material-symbols-outlined !text-[32px]">{f.icon}</span>
            </div>
            <div>
              <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-900 dark:text-white mb-1 font-display">{f.title}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{f.desc}</p>
            </div>
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {trending.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={onProductSelect}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
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
      </section>
    </div>
  );
};

export default Home;
