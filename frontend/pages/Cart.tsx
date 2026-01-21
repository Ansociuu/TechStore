
import React, { useMemo, useState } from 'react';
import { CartItem, Product, Page } from '../types';

interface CartProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onNavigate: (page: Page) => void;
  onProductSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const Cart: React.FC<CartProps> = ({ cart, onUpdateQuantity, onRemoveItem, onClearCart, onNavigate, onProductSelect, onAddToCart }) => {
  const [promoCode, setPromoCode] = useState('');
  
  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart]);
  const shipping = 0; 
  const total = subtotal + shipping;

  const aiSuggestions = [
    {
      id: "s1",
      name: "USB-C Hub Đa Năng",
      desc: "Mở rộng 7 cổng kết nối",
      price: 1250000,
      icon: "usb",
      category: "Phụ kiện",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6fnnApC-_P42jyZl2HXFy2zZcs68VOb-PGrRqJGD4nz3uOqKFSqN6eV14P8VnvMhHvvCxmx60vXleUBJ0b21EoDtfxihh70BC_zfzbJqKf4bLVa1wY4po5sIedopCSxnS0RpXvx6xjuq5C2QUUUM2jhjL7E_hVpZmi6wP1Gcul2LbMUdYqci3zd-QTunvT75F87j8MieniY6w8WwAINsEDZ3oWfJBd0aw1yKGL3_zcGRap3k3huBh54c0IK7mrr-hJ1wxX-vHXh0"
    },
    {
      id: "s2",
      name: "Sony WH-1000XM5 Case",
      desc: "Tương thích hoàn hảo",
      price: 549000,
      icon: "headphones",
      category: "Âm thanh",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKbraHIHckv38Qvn3MLh8uXfYs1vQXJoG0PI3WPKiV4KOZ2BHZpYvxXUV63NE-WyrEI4lf8HYv8RU6nFUdwfkgHKMFiNhpdLJg0EMQM9tbwszeG7kmH6QHAOAR9L9Vt4eRIXYsL5VkGeiEeLpBOolVqxFHaQI52cyPy6JdRaSZheR0htB2sMB0qkEs0MTmo8exdTuvQqCDBstyN9AQtlL4krteeRGaDOMBgTBZm6P5iOD0z1_JbZKqH3cU0bno7NGH8mZE0VYcD-E"
    },
    {
      id: "s3",
      name: "Vệ sinh thiết bị AI",
      desc: "Chống khuẩn cao cấp",
      price: 190000,
      icon: "clean_hands",
      category: "Phụ kiện",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6fnnApC-_P42jyZl2HXFy2zZcs68VOb-PGrRqJGD4nz3uOqKFSqN6eV14P8VnvMhHvvCxmx60vXleUBJ0b21EoDtfxihh70BC_zfzbJqKf4bLVa1wY4po5sIedopCSxnS0RpXvx6xjuq5C2QUUUM2jhjL7E_hVpZmi6wP1Gcul2LbMUdYqci3zd-QTunvT75F87j8MieniY6w8WwAINsEDZ3oWfJBd0aw1yKGL3_zcGRap3k3huBh54c0IK7mrr-hJ1wxX-vHXh0"
    }
  ];

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      alert(`Mã giảm giá "${promoCode}" đang được kiểm tra trên hệ thống...`);
    } else {
      alert('Vui lòng nhập mã giảm giá.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in duration-500">
        <div className="size-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-400 mb-6 border border-slate-200 dark:border-surface-border">
          <span className="material-symbols-outlined !text-[48px]">shopping_cart_off</span>
        </div>
        <h2 className="text-3xl font-black font-display mb-2">Giỏ hàng đang trống</h2>
        <p className="text-slate-500 max-w-sm mb-8">Có vẻ như bạn chưa chọn được món đồ công nghệ nào ưng ý.</p>
        <button 
          onClick={() => onNavigate(Page.LISTING)}
          className="px-8 py-3 bg-primary text-white font-black rounded-xl shadow-xl shadow-primary/20 hover:scale-105 transition-all uppercase tracking-widest text-xs"
        >
          Khám phá sản phẩm ngay
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-wrap justify-between items-end gap-4 border-b border-slate-100 dark:border-surface-border pb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black font-display tracking-tight text-slate-900 dark:text-white">
            Giỏ hàng của bạn <span className="text-primary font-black">({cart.length})</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-light">Kiểm tra lại các món đồ công nghệ bạn đã chọn trước khi thanh toán.</p>
        </div>
        <button 
          onClick={onClearCart}
          className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors font-bold text-xs uppercase tracking-widest"
        >
          <span className="material-symbols-outlined !text-[18px]">delete_sweep</span>
          Xóa tất cả
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        <div className="flex-1 w-full space-y-8">
          <div className="rounded-3xl border border-slate-100 dark:border-surface-border bg-white dark:bg-surface-dark shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-black/20 border-b border-slate-100 dark:border-surface-border">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 w-1/2">Sản phẩm</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Số lượng</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Thành tiền</th>
                  <th className="px-8 py-5 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-surface-border">
                {cart.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-6">
                        <div 
                          className="size-24 flex-shrink-0 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-surface-border p-3 cursor-pointer group-hover:scale-105 transition-transform"
                          onClick={() => onProductSelect(item)}
                        >
                          <img src={item.image} alt={item.name} className="size-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                        </div>
                        <div className="flex flex-col gap-1 min-w-0">
                          <h3 
                            className="text-base font-black text-slate-900 dark:text-white hover:text-primary transition-colors cursor-pointer line-clamp-1"
                            onClick={() => onProductSelect(item)}
                          >
                            {item.name}
                          </h3>
                          <p className="text-xs text-slate-400 font-medium">{item.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="inline-flex items-center rounded-xl border border-slate-200 dark:border-surface-border bg-slate-50 dark:bg-black/20 p-1">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="size-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined !text-[18px]">remove</span>
                        </button>
                        <span className="w-10 text-center text-sm font-black text-slate-900 dark:text-white">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="size-8 rounded-lg flex items-center justify-center text-slate-900 dark:text-white hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined !text-[18px]">add</span>
                        </button>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-base font-black text-slate-900 dark:text-white">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="size-10 rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined !text-[20px]">delete_outline</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gradient-to-br from-indigo-900/10 to-primary/5 border border-primary/20 rounded-3xl p-8 shadow-sm overflow-hidden relative group">
            <div className="absolute -right-20 -top-20 bg-primary/20 blur-[100px] size-64 rounded-full group-hover:bg-primary/30 transition-colors duration-1000"></div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-inner">
                  <span className="material-symbols-outlined !text-[32px] font-variation-fill animate-pulse">auto_awesome</span>
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-black font-display tracking-tight text-slate-900 dark:text-white">AI Tech Match</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
                    Dựa trên các sản phẩm trong giỏ hàng, AI gợi ý thêm các phụ kiện tương thích hoàn hảo.
                  </p>
                </div>
              </div>
              <button onClick={() => alert('Đang tải danh sách phụ kiện tương thích...')} className="text-primary text-xs font-black uppercase tracking-widest hover:underline">Xem tất cả gợi ý</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {aiSuggestions.map((s) => (
                <div key={s.id} className="group/item flex flex-col gap-4 rounded-2xl border border-slate-100 dark:border-surface-border bg-white dark:bg-surface-dark p-6 hover:border-primary transition-all cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start justify-between">
                    <div className="size-12 rounded-xl bg-slate-50 dark:bg-black/20 flex items-center justify-center text-slate-400 group-hover/item:text-primary transition-colors">
                      <span className="material-symbols-outlined !text-[24px]">{s.icon}</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); alert(`Đã thêm ${s.name} vào giỏ hàng!`); }}
                      className="size-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined !text-[18px]">add_shopping_cart</span>
                    </button>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-black leading-tight group-hover/item:text-primary transition-colors text-slate-900 dark:text-white">{s.name}</h3>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{s.desc}</p>
                    <p className="text-sm font-black mt-2 text-primary">{s.price.toLocaleString('vi-VN')}₫</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="w-full lg:w-[400px] flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-3xl border border-slate-100 dark:border-surface-border bg-white dark:bg-surface-dark p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
               <h2 className="text-2xl font-black font-display mb-8 tracking-tight text-slate-900 dark:text-white">Tổng đơn hàng</h2>
               <div className="space-y-5 border-b border-slate-100 dark:border-surface-border pb-8 text-slate-700 dark:text-slate-300">
                 <div className="flex justify-between items-center">
                   <span className="text-sm font-medium">Tạm tính ({cart.length} món)</span>
                   <span className="text-sm font-black">{subtotal.toLocaleString('vi-VN')}₫</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-sm font-medium">Thuế (VAT 10%)</span>
                   <span className="text-xs font-bold text-slate-400 italic">Đã bao gồm</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-sm font-medium">Phí vận chuyển</span>
                   <span className="text-sm font-black text-green-500 uppercase tracking-widest text-[10px]">Miễn phí</span>
                 </div>
               </div>
               <div className="py-8 space-y-2">
                 <div className="flex justify-between items-center">
                   <span className="text-base font-black text-slate-900 dark:text-white">Tổng cộng</span>
                   <span className="text-3xl font-black text-primary tracking-tighter">{total.toLocaleString('vi-VN')}₫</span>
                 </div>
               </div>
               <button 
                onClick={() => onNavigate(Page.CHECKOUT)}
                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary-dark text-white font-black uppercase tracking-widest shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-3 active:scale-95 group"
               >
                 Tiến hành thanh toán
                 <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
               </button>
            </div>

            <div className="rounded-2xl border border-slate-100 dark:border-surface-border bg-white dark:bg-surface-dark p-6 space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <span className="material-symbols-outlined !text-[18px] text-primary">sell</span>
                Mã giảm giá
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Nhập mã ưu đãi..."
                  className="flex-1 rounded-xl border border-slate-100 dark:border-surface-border bg-slate-50 dark:bg-black/20 text-sm px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white"
                />
                <button 
                  onClick={handleApplyPromo}
                  className="px-6 py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all text-slate-900 dark:text-white"
                >
                  Áp dụng
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 dark:border-surface-border bg-slate-50 dark:bg-white/5 p-6 flex gap-4">
               <div className="p-2 bg-white dark:bg-surface-dark rounded-xl text-primary shadow-sm h-fit">
                  <span className="material-symbols-outlined">headset_mic</span>
               </div>
               <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">Hỗ trợ khách hàng</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Chat với AI Assistant hoặc gọi hotline <span className="text-slate-900 dark:text-white font-bold">1900 1234</span> để được hỗ trợ.</p>
                  <button onClick={() => onNavigate(Page.AI_ASSISTANT)} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline mt-2">Trò chuyện ngay</button>
               </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
