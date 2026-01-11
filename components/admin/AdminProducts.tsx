
import React, { useState } from 'react';
import { PRODUCTS } from '../../constants';

const AdminProducts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const productStats = [
    { label: 'Tổng sản phẩm', value: '1,240', trend: '+12%', icon: 'inventory_2', color: 'text-primary bg-primary/10' },
    { label: 'Hết hàng', value: '8', trend: '+2', icon: 'remove_shopping_cart', color: 'text-red-500 bg-red-500/10' },
    { label: 'Cảnh báo tồn', value: '12', trend: 'Sắp hết', icon: 'warning', color: 'text-orange-500 bg-orange-500/10' },
    { label: 'AI Đề xuất', value: '5', trend: 'Mục tối ưu', icon: 'auto_awesome', color: 'text-purple-500 bg-purple-500/10' },
  ];

  const adminProducts = PRODUCTS.map(p => ({
    ...p,
    sku: `SKU-${p.id.toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
    stock: Math.floor(Math.random() * 100),
    aiScore: Math.floor(Math.random() * 30) + 70,
    status: Math.random() > 0.1 ? 'Active' : 'Inactive'
  }));

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Page Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
            <span>Trang chủ</span>
            <span className="material-symbols-outlined !text-[14px] mx-2">chevron_right</span>
            <span className="text-primary">Quản lý sản phẩm</span>
          </nav>
          <h1 className="text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white uppercase leading-none">Danh sách sản phẩm</h1>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-surface-border text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined !text-[18px]">file_upload</span>
            Import
          </button>
          <button className="px-5 py-2.5 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all flex items-center gap-2">
            <span className="material-symbols-outlined !text-[18px]">add</span>
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {productStats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-surface-border rounded-3xl p-6 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-black font-display tracking-tight">{stat.value}</h3>
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${stat.label === 'Hết hàng' ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'}`}>
                   {stat.trend}
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-2xl ${stat.color}`}>
              <span className="material-symbols-outlined !text-[24px]">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-slate-100 dark:border-surface-border flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          <div className="relative min-w-[180px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 !text-[18px]">category</span>
            <select className="w-full h-11 pl-10 pr-8 bg-slate-50 dark:bg-background-dark/50 border-none rounded-xl text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer appearance-none">
              <option>Tất cả danh mục</option>
              <option>Laptop</option>
              <option>Smartphone</option>
              <option>Phụ kiện</option>
            </select>
          </div>
          <div className="relative min-w-[180px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 !text-[18px]">filter_alt</span>
            <select className="w-full h-11 pl-10 pr-8 bg-slate-50 dark:bg-background-dark/50 border-none rounded-xl text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer appearance-none">
              <option>Tất cả trạng thái</option>
              <option>Còn hàng</option>
              <option>Hết hàng</option>
            </select>
          </div>
        </div>
        <div className="relative w-full max-w-sm">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input 
            type="text" 
            placeholder="Tìm sản phẩm, SKU, tag..."
            className="w-full h-11 pl-12 pr-4 bg-slate-50 dark:bg-background-dark/50 border-none rounded-xl text-xs focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-surface-border rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-background-dark/30 border-b border-slate-100 dark:border-surface-border">
                <th className="py-5 px-8 w-12 text-center">
                   <input type="checkbox" className="size-4 rounded border-slate-300 dark:border-surface-border text-primary focus:ring-primary/20 bg-white dark:bg-black/20" />
                </th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Thông tin sản phẩm</th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Danh mục</th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Giá bán</th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Tồn kho</th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">AI Score</th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Trạng thái</th>
                <th className="py-5 px-8 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-surface-border">
              {adminProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                  <td className="py-5 px-8 text-center">
                     <input type="checkbox" className="size-4 rounded border-slate-300 dark:border-surface-border text-primary focus:ring-primary/20 bg-white dark:bg-black/20" />
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-xl bg-slate-100 dark:bg-background-dark border border-slate-200 dark:border-surface-border overflow-hidden p-1">
                        <img src={p.image} className="size-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-900 dark:text-white hover:text-primary transition-colors cursor-pointer">{p.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5">{p.sku}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <span className="inline-flex px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-5 px-8 text-xs font-black text-slate-900 dark:text-white text-right font-mono">
                    {p.price.toLocaleString('vi-VN')} ₫
                  </td>
                  <td className="py-5 px-8 text-center">
                    <span className={`text-xs font-black ${p.stock < 15 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${p.aiScore}%` }}></div>
                      </div>
                      <span className="text-[10px] font-black text-purple-600">{p.aiScore}</span>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${p.status === 'Active' ? 'text-green-600 bg-green-50 border border-green-100' : 'text-red-600 bg-red-50 border border-red-100'}`}>
                       <span className={`size-1.5 rounded-full ${p.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                       {p.status}
                    </span>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all">
                        <span className="material-symbols-outlined !text-[18px]">edit</span>
                      </button>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                        <span className="material-symbols-outlined !text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-slate-100 dark:border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 dark:bg-background-dark/30">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Hiển thị <span className="text-slate-900 dark:text-white">1-5</span> trong <span className="text-slate-900 dark:text-white">1,240</span> kết quả
          </p>
          <div className="flex items-center gap-2">
            <button className="size-9 rounded-xl border border-slate-200 dark:border-surface-border flex items-center justify-center text-slate-400 hover:text-primary transition-all">
              <span className="material-symbols-outlined !text-[18px]">chevron_left</span>
            </button>
            <button className="size-9 rounded-xl bg-primary text-white text-[10px] font-black shadow-lg shadow-primary/20">1</button>
            <button className="size-9 rounded-xl text-[10px] font-black text-slate-500 hover:bg-slate-200 dark:hover:bg-white/5 transition-all">2</button>
            <button className="size-9 rounded-xl text-[10px] font-black text-slate-500 hover:bg-slate-200 dark:hover:bg-white/5 transition-all">3</button>
            <span className="text-slate-400">...</span>
            <button className="size-9 rounded-xl border border-slate-200 dark:border-surface-border flex items-center justify-center text-slate-400 hover:text-primary transition-all">
              <span className="material-symbols-outlined !text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
