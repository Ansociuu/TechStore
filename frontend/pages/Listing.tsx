
import React, { useState, useMemo, useEffect } from 'react';
import { Product, Page } from '../types';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/apiService';

interface ListingProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onNavigate: (page: Page) => void;
  searchQuery?: string;
  initialCategory?: string;
}

const Listing: React.FC<ListingProps> = ({ onProductSelect, onAddToCart, onNavigate, searchQuery = '', initialCategory = 'All' }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);
  const [activePage, setActivePage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<string>('Popular');
  const [priceRange, setPriceRange] = useState<number>(100000000);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const categories = ['All', 'Laptop', 'Smartphone', 'Tablet', 'Âm thanh', 'Phụ kiện'];
  const brands = ['Apple', 'Logitech', 'Sony', 'Samsung', 'Keychron', 'JBL'];

  // Sync initialCategory prop with state when it changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const sortMap: Record<string, string> = {
        'PriceLow': 'price_asc',
        'PriceHigh': 'price_desc',
        'Rating': 'rating_desc',
        'Popular': ''
      };

      const data = await productAPI.getAll({
        page: activePage,
        limit: 12,
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        search: searchQuery || undefined,
        maxPrice: priceRange,
        sort: sortMap[sortBy]
      });

      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch listing products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activePage, selectedCategory, sortBy, priceRange, searchQuery]);

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  return (
    <div className="flex flex-col gap-6 pb-20 animate-in fade-in duration-500">
      {/* Navigation Back */}
      <button
        onClick={() => onNavigate(Page.HOME)}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-all group w-fit"
      >
        <span className="material-symbols-outlined !text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
        Về trang chủ
      </button>

      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black font-display tracking-tight">
          {searchQuery ? `Kết quả cho "${searchQuery}"` : selectedCategory === 'All' ? 'Tất cả sản phẩm' : selectedCategory}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Khám phá công nghệ mới nhất với đề xuất từ trí tuệ nhân tạo AI</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined !text-[18px] text-primary">category</span>
              Danh mục
            </h3>
            <div className="flex flex-col gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedCategory === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500'}`}
                >
                  {cat === 'All' ? 'Tất cả' : cat}
                  {selectedCategory === cat && <span className="material-symbols-outlined !text-[16px]">check_circle</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-surface-border"></div>

          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined !text-[18px] text-primary">payments</span>
              Khoảng giá
            </h3>
            <div className="space-y-4 px-2">
              <input
                type="range"
                min="0"
                max="100000000"
                step="5000000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-surface-border rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] font-black text-slate-400">
                <span>0₫</span>
                <span className="text-primary">{priceRange.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-surface-border"></div>

          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest">Thương hiệu</h3>
            <div className="grid grid-cols-1 gap-2">
              {brands.map(brand => (
                <label key={brand} className="flex items-center gap-3 group cursor-pointer">
                  <div className={`size-5 rounded border flex items-center justify-center transition-all ${selectedBrands.includes(brand) ? 'bg-primary border-primary' : 'border-slate-200 dark:border-surface-border group-hover:border-primary'}`}>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                    />
                    {selectedBrands.includes(brand) && <span className="material-symbols-outlined text-white !text-[14px]">check</span>}
                  </div>
                  <span className={`text-sm font-medium transition-colors ${selectedBrands.includes(brand) ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-400 group-hover:text-primary'}`}>{brand}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-slate-100 dark:border-surface-border sticky top-[72px] z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
              Hiển thị <span className="text-primary font-black">{products.length}</span> {pagination?.total ? `trên ${pagination.total}` : ''} sản phẩm
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest hidden sm:block">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-100 dark:bg-surface-dark border-none rounded-xl px-4 py-2 text-xs font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer outline-none"
              >
                <option value="Popular">Phổ biến nhất</option>
                <option value="PriceLow">Giá: Thấp đến Cao</option>
                <option value="PriceHigh">Giá: Cao đến Thấp</option>
                <option value="Rating">Đánh giá cao nhất</option>
              </select>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onProductSelect}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="size-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-400">
                <span className="material-symbols-outlined !text-[40px]">search_off</span>
              </div>
              <h2 className="text-xl font-bold">Không tìm thấy sản phẩm</h2>
              <p className="text-slate-500 text-sm max-w-xs">Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác.</p>
              <button
                onClick={() => { setSelectedCategory('All'); setPriceRange(100000000); setSelectedBrands([]); }}
                className="px-6 py-2 bg-primary text-white font-bold rounded-xl text-sm"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center pt-10">
              <div className="flex items-center gap-2">
                <button
                  disabled={activePage === 1}
                  onClick={() => setActivePage(prev => prev - 1)}
                  className="size-10 rounded-xl border border-slate-200 dark:border-surface-border flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                  <span className="material-symbols-outlined !text-[18px]">chevron_left</span>
                </button>
                {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setActivePage(page)}
                    className={`size-10 rounded-xl font-bold text-sm transition-all ${activePage === page ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  disabled={activePage === pagination.totalPages}
                  onClick={() => setActivePage(prev => prev + 1)}
                  className="size-10 rounded-xl border border-slate-200 dark:border-surface-border flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                  <span className="material-symbols-outlined !text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Listing;
