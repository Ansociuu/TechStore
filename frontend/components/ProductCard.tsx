
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onAddToCart, onBuyNow }) => {
  return (
    <div className="group relative bg-white dark:bg-surface-dark border border-slate-100 dark:border-surface-border rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.isNew && (
          <span className="bg-primary text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-lg">New</span>
        )}
        {product.isHot && (
          <span className="bg-red-500 text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-lg">Hot</span>
        )}
        {product.discount && (
          <span className="bg-orange-500 text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-lg">{product.discount}</span>
        )}
      </div>

      {/* Image Container */}
      <div
        className="relative aspect-[4/3] w-full bg-slate-50 dark:bg-black/40 overflow-hidden cursor-pointer"
        onClick={() => onSelect(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <div className="min-h-[44px]">
          <h3
            className="text-base font-black text-slate-900 dark:text-white line-clamp-1 hover:text-primary cursor-pointer transition-colors font-display tracking-tight"
            onClick={() => onSelect(product)}
          >
            {product.name}
          </h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{product.category}</p>
        </div>

        <div className="flex flex-col gap-3 pt-3 border-t border-slate-50 dark:border-surface-border">
          <div className="flex items-baseline gap-2">
            <span className="text-primary text-lg font-black tracking-tight">{product.price.toLocaleString('vi-VN')}₫</span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through font-medium">{(product.originalPrice).toLocaleString('vi-VN')}₫</span>
            )}
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`material-symbols-outlined !text-[12px] ${i < Math.floor(product.rating) ? 'font-variation-fill' : ''}`}>star</span>
                ))}
              </div>
              <span className="text-[10px] font-black text-slate-400">{product.rating.toFixed(1)}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                className="size-8 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-primary text-slate-600 dark:text-slate-400 hover:text-white transition-all flex items-center justify-center active:scale-90"
                title="Thêm vào giỏ"
              >
                <span className="material-symbols-outlined !text-[18px]">add_shopping_cart</span>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onBuyNow(product); }}
                className="h-8 px-3 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all flex items-center justify-center active:scale-95 shadow-lg shadow-primary/20"
              >
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
