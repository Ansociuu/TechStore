import React, { useState, useEffect, useRef } from 'react';
import { Product, Page } from '../types';
import ProductCard from '../components/ProductCard';
import { recommendationAPI } from '../services/apiService';

interface HomeProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onNavigate: (page: Page) => void;
}

const Home: React.FC<HomeProps> = ({ products, onProductSelect, onAddToCart, onBuyNow, onNavigate }) => {
  const trending = products.slice(0, 10);
  const heroProducts = products.slice(0, 5);
  const bestSellers = products.slice(4, 12);
  const newArrivals = products.slice(0, 8);

  const [cfRecommendations, setCfRecommendations] = useState<Product[]>([]);
  const [cfLoading, setCfLoading] = useState(false);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [currentGamingIndex, setCurrentGamingIndex] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll multiplier
    if (Math.abs(walk) > 5) {
      setHasDragged(true);
    }
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const gamingPromos = [
    {
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSbw3lpVij8ArFHQaJPWCaOm1L8RHIOeMh5Qf6-zf1cPZpC97AwlLLggHWwG2XGFJJvPIN4M9Mqbt4leBMljHCjynsL4VupG6FLIT779DzcUevcgSE5cmlQEFrJEPvbjOyq6lFnXTrjVxfp2ruVyfy6BwBmRQIjQybcEoZJqzjwscr209dRa4kJku9FNP3Rpr222ZEo4frxuqO_GR_hxtck1kus-2QHp-PKPsud4Q6NelpbLsHXWY032UG6Z-rZjIzbau0yEYNMZw",
      badge: "Gaming Gear",
      title: "Nâng cấp góc máy,<br className='hidden md:block'/>chiến game cực đỉnh",
      subtitle: "Giảm tới 30% cho các thiết bị gaming chuyên dụng."
    },
    {
      image: "https://m.media-amazon.com/images/I/61yS6eRfOfL.jpg",
      badge: "Mới ra mắt",
      title: "Trải nghiệm mượt mà,<br className='hidden md:block'/>không độ trễ",
      subtitle: "Bàn phím cơ dành cho game thủ chuyên nghiệp."
    },
    {
      image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=2000&auto=format&fit=crop",
      badge: "Esports Pro",
      title: "Thế giới ảo,<br className='hidden md:block'/>trải nghiệm thật",
      subtitle: "Tay cầm chơi game, chiến mọi lúc mọi nơi."
    }
  ];

  useEffect(() => {
    const heroTimer = setInterval(() => {
      setCurrentHeroIndex(prev => (prev + 1) % Math.max(1, heroProducts.length));
    }, 5000);
    const gamingTimer = setInterval(() => {
      setCurrentGamingIndex(prev => (prev + 1) % gamingPromos.length);
    }, 6000);

    return () => { clearInterval(heroTimer); clearInterval(gamingTimer); };
  }, [heroProducts.length, gamingPromos.length]);

  useEffect(() => {
    const fetchCF = async () => {
      try {
        setCfLoading(true);
        const data = await recommendationAPI.hybrid(8);
        if (data.recommendations?.length > 0) {
          setCfRecommendations(data.recommendations.map((p: any) => ({
            ...p,
            id: String(p.id),
            specs: p.specs || {}
          })));
        }
      } catch {
      } finally {
        setCfLoading(false);
      }
    };
    fetchCF();
  }, []);

  const aiPickProducts = cfRecommendations.length > 0 ? cfRecommendations : trending;

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
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section Carousel */}
      <section className="relative w-full rounded-[2rem] overflow-hidden shadow-2xl bg-[#0b0f17] min-h-[500px] md:h-[550px] group border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10 pointer-events-none"></div>

        {heroProducts.map((p, index) => (
          <div key={p.id} className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentHeroIndex ? 'opacity-100 z-20' : 'opacity-0 z-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-[#0b0f17] z-0"></div>
            <div className="absolute top-0 right-0 w-full md:w-[60%] h-[48%] md:h-full overflow-hidden pointer-events-none z-10">
              {p.image && (
                <img
                  src={p.image}
                  alt={p.name}
                  className={`w-full h-full object-cover object-center md:object-right transform transition-all duration-[6s] ease-out ${index === currentHeroIndex ? 'scale-105 opacity-100' : 'scale-115 opacity-0'} [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)] md:[mask-image:linear-gradient(to_right,transparent_0%,black_35%,black_100%)]`}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f17] via-transparent to-transparent hidden md:block z-20 w-[40%]"></div>
            </div>

            <div className="relative z-30 flex flex-col justify-end md:justify-center p-6 sm:p-10 md:p-16 lg:p-20 gap-4 md:gap-6 w-full md:w-[60%] lg:w-1/2 h-full pb-16 md:pb-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 w-fit backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{p.category || 'Sản phẩm nổi bật'}</span>
              </div>

              <div className="space-y-3 md:space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black leading-[1.05] tracking-tighter text-white font-display drop-shadow-2xl line-clamp-2 md:line-clamp-3">
                  {p.name}
                </h1>
                <p className="text-sm md:text-lg text-slate-300 font-light max-w-md leading-relaxed line-clamp-2">
                  {p.description || 'Khám phá công nghệ mới nhất tại TechStore với hàng ngàn ưu đãi hấp dẫn.'}
                </p>
                <div className="text-xl lg:text-3xl font-bold text-white pt-1">
                  {p.price.toLocaleString('vi-VN')}đ
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2 md:pt-4">
                <button
                  onClick={() => onBuyNow(p)}
                  className="group/btn h-11 md:h-14 px-6 md:px-10 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-lg shadow-primary/40 flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-95 border border-primary-light/30 flex-shrink-0"
                >
                  Mua Ngay
                  <span className="material-symbols-outlined !text-[18px] transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                </button>
                <button
                  onClick={() => onProductSelect(p)}
                  className="h-11 md:h-14 px-6 md:px-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm tracking-wide backdrop-blur-xl transition-all border border-white/20 hover:border-white/30 active:scale-95 flex items-center justify-center gap-2 flex-shrink-0"
                >
                  Chi tiết
                </button>

                <div className="flex gap-1.5 items-center pl-2 md:pl-4">
                  {heroProducts.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setCurrentHeroIndex(i); }}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === currentHeroIndex ? 'w-6 bg-primary' : 'w-1.5 bg-white/30 hover:bg-white/50'}`}
                      aria-label={`Carousel slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
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
            <div className={`absolute -right-4 -top-4 size-32 rounded-full ${f.bg} opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
            <div className={`size-16 rounded-2xl ${f.bg} ${f.color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10 shadow-lg shadow-black/5`}>
              <span className="material-symbols-outlined !text-[36px] font-variation-fill">{f.icon}</span>
            </div>
            <div className="relative z-10 space-y-2">
              <h3 className="font-black text-sm uppercase tracking-[0.15em] text-slate-900 dark:text-white font-display">{f.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{f.desc}</p>
            </div>
            <div className="w-12 h-1 bg-slate-100 dark:bg-white/10 rounded-full mt-auto relative z-10 group-hover:w-20 group-hover:bg-primary transition-all duration-500"></div>
          </div>
        ))}
      </section>

      {/* AI Recommendation Showcase - Now a Slider */}
      <section className="flex flex-col gap-8 relative group/slider">
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
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="size-10 rounded-xl border border-slate-200 dark:border-surface-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-90"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              onClick={() => scroll('right')}
              className="size-10 rounded-xl border border-slate-200 dark:border-surface-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-90"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
            <button
              onClick={() => onNavigate(Page.LISTING)}
              className="ml-4 px-6 py-2.5 rounded-xl border border-slate-200 dark:border-surface-border text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all hidden sm:block font-display"
            >
              Tất cả
            </button>
          </div>
        </div>

        {cfLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 px-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-3xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-surface-border p-6 animate-pulse">
                <div className="aspect-square bg-slate-100 dark:bg-white/5 rounded-2xl mb-4"></div>
                <div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onClickCapture={(e) => {
              if (hasDragged) {
                e.stopPropagation();
                e.preventDefault();
              }
            }}
            className={`flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar px-2 pb-6 ${isDragging ? 'cursor-grabbing select-none snap-none' : 'cursor-grab'}`}
          >
            {aiPickProducts.map(p => (
              <div key={p.id} className="min-w-[280px] md:min-w-[320px] snap-start">
                <ProductCard
                  product={p}
                  onSelect={onProductSelect}
                  onAddToCart={onAddToCart}
                  onBuyNow={onBuyNow}
                />
              </div>
            ))}
          </div>
        )}

        {cfRecommendations.length > 0 && (
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <span className="material-symbols-outlined !text-[16px] text-primary">psychology</span>
            <span className="font-medium italic">Được gợi ý bởi Collaborative Filtering AI dựa trên hành vi mua hàng</span>
          </div>
        )}
      </section>

      {/* New Arrivals Section */}
      <section className="flex flex-col gap-8">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined font-variation-fill">new_releases</span>
            </div>
            <h2 className="text-2xl font-black font-display tracking-tight uppercase">Sản phẩm mới</h2>
          </div>
          <button
            onClick={() => onNavigate(Page.LISTING)}
            className="text-xs font-black text-primary uppercase tracking-widest hover:underline"
          >
            Xem thêm
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-2">
          {newArrivals.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={onProductSelect}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
            />
          ))}
        </div>
      </section>

      {/* Gaming Banner Carousel */}
      <section
        onClick={() => onNavigate(Page.LISTING)}
        className="rounded-[2.5rem] overflow-hidden relative min-h-[300px] flex items-center group cursor-pointer shadow-2xl mx-2"
      >
        {gamingPromos.map((promo, index) => (
          <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentGamingIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <img
              src={promo.image}
              className={`absolute inset-0 w-full h-full object-cover origin-center transform transition-transform duration-[6s] ease-out ${index === currentGamingIndex ? 'scale-105' : 'scale-100'}`}
              alt={promo.badge}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 mix-blend-screen pointer-events-none z-10"></div>

            <div className="relative z-20 p-10 md:p-16 flex flex-col gap-4 items-start max-w-2xl h-full justify-center">
              <span className="bg-primary text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-primary/30">
                {promo.badge}
              </span>
              <h3 className="text-3xl md:text-5xl font-black text-white font-display max-w-xl leading-tight tracking-tighter drop-shadow-xl" dangerouslySetInnerHTML={{ __html: promo.title }} />
              <p className="text-slate-300 text-lg md:text-xl font-light leading-relaxed max-w-lg mb-4">{promo.subtitle}</p>
              <button className="group/btn mt-2 px-8 py-4 bg-primary text-white font-bold text-sm tracking-wide rounded-2xl hover:bg-primary-dark transition-all shadow-[0_0_30px_-5px_var(--tw-shadow-color)] shadow-primary/40 flex items-center gap-3 hover:-translate-y-1 active:scale-95 border border-primary-light/30">
                Khám phá trọn bộ
                <span className="material-symbols-outlined !text-[20px] transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
        <div className="absolute bottom-6 right-8 flex gap-2 z-30">
          {gamingPromos.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrentGamingIndex(i); }}
              className={`h-2 rounded-full transition-all duration-300 ${i === currentGamingIndex ? 'w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'w-2 bg-white/30 hover:bg-white/50'}`}
              aria-label={`Carousel slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Bestsellers - Now showing 8 products */}
      <section className="flex flex-col gap-8">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
              <span className="material-symbols-outlined font-variation-fill">local_fire_department</span>
            </div>
            <h2 className="text-2xl font-black font-display tracking-tight uppercase">Sản phẩm bán chạy</h2>
          </div>
          <button
            onClick={() => onNavigate(Page.LISTING)}
            className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors"
          >
            Xem tất cả
          </button>
        </div>
        {products.length > 4 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-2">
            {bestSellers.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={onProductSelect}
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
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
