
import React, { useState, useEffect } from 'react';
import { Product, Page } from '../types';
import { analyzeProductSpec } from '../services/geminiService';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onNavigate: (page: Page) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onAddToCart, onNavigate }) => {
  const [quantity, setQuantity] = useState(1);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setIsLoadingAnalysis(true);
      const analysis = await analyzeProductSpec(product.name);
      setAiAnalysis(analysis);
      setIsLoadingAnalysis(false);
    };
    fetchAnalysis();
  }, [product.name]);

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
                {aiAnalysis.split('\n').map((line, i) => (
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
              onClick={() => onAddToCart({ ...product })}
              className="flex-1 bg-primary hover:bg-primary-dark text-white font-black rounded-2xl h-16 px-10 shadow-2xl shadow-primary/20 transition-all flex items-center justify-center gap-4 active:scale-95 group uppercase tracking-widest text-xs"
            >
              <span className="material-symbols-outlined !text-[22px] group-hover:rotate-12 transition-transform">shopping_cart</span>
              Thêm vào giỏ hàng
            </button>
            <button className="bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white rounded-2xl size-16 flex items-center justify-center transition-all active:scale-95 border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
              <span className="material-symbols-outlined !text-[28px]">favorite</span>
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
              {Object.entries(product.specs).map(([key, value], i) => (
                <div key={i} className="flex flex-col gap-2 pb-6 border-b border-slate-100 dark:border-surface-border last:border-0">
                  <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">{key}</span>
                  <span className="text-base font-bold text-slate-800 dark:text-slate-100">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
