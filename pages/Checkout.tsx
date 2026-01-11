
import React, { useState, useMemo } from 'react';
import { CartItem, Page, Product } from '../types';
import { PRODUCTS } from '../constants';

interface CheckoutProps {
  cart: CartItem[];
  onNavigate: (page: Page) => void;
  // Added missing onAddToCart prop to fix TypeScript error in App.tsx
  onAddToCart: (product: Product) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, onNavigate, onAddToCart }) => {
  const [step, setStep] = useState(1); // 1: Delivery, 2: Payment, 3: Confirmation
  
  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart]);
  const shipping = 0;
  const total = subtotal + shipping;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
    else {
      alert("Đơn hàng của bạn đã được tiếp nhận! Cảm ơn bạn đã mua sắm tại TechStore AI.");
      onNavigate(Page.HOME);
    }
  };

  return (
    <div className="flex flex-col gap-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <button onClick={() => onNavigate(Page.CART)} className="hover:text-primary transition-colors">Giỏ hàng</button>
        <span className="material-symbols-outlined !text-[14px]">chevron_right</span>
        <span className={step === 1 ? 'text-primary' : 'text-slate-600 dark:text-slate-200'}>Giao hàng</span>
        <span className="material-symbols-outlined !text-[14px]">chevron_right</span>
        <span className={step === 2 ? 'text-primary' : 'text-slate-400'}>Thanh toán</span>
      </nav>

      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black font-display tracking-tight">Thanh toán an toàn</h1>
        <p className="text-slate-500 dark:text-slate-400 font-light">Hoàn tất đơn hàng của bạn trong vài bước đơn giản.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 xl:gap-16 items-start">
        {/* Main Form Area */}
        <div className="flex-1 w-full space-y-10">
          {/* Progress Steps */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 1, label: '1. Giao hàng' },
              { id: 2, label: '2. Thanh toán' },
              { id: 3, label: '3. Xác nhận' }
            ].map((s) => (
              <div key={s.id} className="flex flex-col gap-3 group cursor-pointer" onClick={() => step > s.id && setStep(s.id)}>
                <div className={`h-1.5 w-full rounded-full transition-all duration-500 ${step >= s.id ? 'bg-primary' : 'bg-slate-200 dark:bg-surface-dark'}`}>
                  {step === s.id && <div className="h-full bg-white/30 animate-pulse"></div>}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${step >= s.id ? 'text-primary' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleNextStep} className="space-y-8">
            {step === 1 && (
              <section className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-surface-border rounded-[2rem] p-8 md:p-10 shadow-sm animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="flex items-center gap-4 mb-8">
                  <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                    <span className="material-symbols-outlined !text-[28px]">local_shipping</span>
                  </div>
                  <h2 className="text-2xl font-black font-display tracking-tight">Thông tin giao hàng</h2>
                </div>

                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="flex flex-col gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Họ và tên</span>
                      <input required className="w-full h-14 rounded-xl border border-slate-100 dark:border-surface-border bg-slate-50 dark:bg-black/20 px-5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Nguyễn Văn A" type="text"/>
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Số điện thoại</span>
                      <input required className="w-full h-14 rounded-xl border border-slate-100 dark:border-surface-border bg-slate-50 dark:bg-black/20 px-5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="0901234567" type="tel"/>
                    </label>
                  </div>
                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email (Để nhận hóa đơn)</span>
                    <input required className="w-full h-14 rounded-xl border border-slate-100 dark:border-surface-border bg-slate-50 dark:bg-black/20 px-5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="example@email.com" type="email"/>
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Địa chỉ nhận hàng</span>
                    <input required className="w-full h-14 rounded-xl border border-slate-100 dark:border-surface-border bg-slate-50 dark:bg-black/20 px-5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Số nhà, tên đường, phường/xã..." type="text"/>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="flex flex-col gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tỉnh / Thành phố</span>
                      <select required className="w-full h-14 rounded-xl border border-slate-100 dark:border-surface-border bg-slate-50 dark:bg-black/20 px-5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer">
                        <option disabled selected value="">Chọn Tỉnh / Thành phố</option>
                        <option value="hanoi">Hà Nội</option>
                        <option value="hcm">TP. Hồ Chí Minh</option>
                        <option value="danang">Đà Nẵng</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Quận / Huyện</span>
                      <select required className="w-full h-14 rounded-xl border border-slate-100 dark:border-surface-border bg-slate-50 dark:bg-black/20 px-5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer">
                        <option disabled selected value="">Chọn Quận / Huyện</option>
                      </select>
                    </label>
                  </div>
                  <div className="flex items-center gap-3 pt-4">
                    <input id="save-info" type="checkbox" className="size-5 rounded border-slate-300 dark:border-surface-border text-primary focus:ring-primary/20 bg-slate-50 dark:bg-black/20" />
                    <label htmlFor="save-info" className="text-xs font-bold text-slate-500 dark:text-slate-400 cursor-pointer select-none">Lưu thông tin cho lần thanh toán sau</label>
                  </div>
                </div>
              </section>
            )}

            {step === 2 && (
              <section className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-surface-border rounded-[2rem] p-8 md:p-10 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-4 mb-8">
                  <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                    <span className="material-symbols-outlined !text-[28px]">payments</span>
                  </div>
                  <h2 className="text-2xl font-black font-display tracking-tight">Phương thức thanh toán</h2>
                </div>
                
                <div className="grid gap-4">
                  {[
                    { id: 'cod', name: 'Thanh toán khi nhận hàng (COD)', icon: 'local_atm' },
                    { id: 'vnpay', name: 'Ví VNPAY / Thẻ ATM Nội địa', icon: 'account_balance' },
                    { id: 'momo', name: 'Ví MoMo', icon: 'wallet' },
                    { id: 'visa', name: 'Thẻ Visa / Mastercard', icon: 'credit_card' },
                  ].map((p) => (
                    <label key={p.id} className="flex items-center gap-4 p-5 rounded-2xl border border-slate-100 dark:border-surface-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group">
                      <input type="radio" name="payment" value={p.id} defaultChecked={p.id === 'cod'} className="size-5 text-primary border-slate-300 dark:border-surface-border focus:ring-primary/20 bg-white dark:bg-black/20" />
                      <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">{p.icon}</span>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{p.name}</span>
                    </label>
                  ))}
                </div>
              </section>
            )}

            <div className="flex justify-between items-center pt-6">
              <button 
                type="button" 
                onClick={() => step > 1 ? setStep(step - 1) : onNavigate(Page.CART)}
                className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined !text-[18px]">arrow_back</span>
                Quay lại
              </button>
              <button 
                type="submit"
                className="h-14 px-10 bg-primary hover:bg-primary-dark text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary/30 flex items-center gap-3 active:scale-95 group"
              >
                {step === 3 ? 'Xác nhận đơn hàng' : 'Tiếp tục thanh toán'}
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Summary */}
        <aside className="w-full lg:w-[420px] flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-[2rem] border border-slate-100 dark:border-surface-border bg-white dark:bg-surface-dark p-8 shadow-sm">
              <h3 className="text-xl font-black font-display mb-8 tracking-tight flex items-center gap-3">
                <span className="material-symbols-outlined text-primary font-variation-fill">shopping_bag</span>
                Đơn hàng của bạn
              </h3>

              <div className="space-y-4 mb-8 max-h-[320px] overflow-y-auto pr-2 no-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-start">
                    <div className="size-20 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-surface-border p-2 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="size-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white truncate pr-2">{item.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{item.category}</p>
                      <p className="text-sm font-black text-primary mt-1">{item.price.toLocaleString('vi-VN')}₫</p>
                    </div>
                    <div className="text-[10px] font-black text-slate-400 bg-slate-50 dark:bg-black/20 px-2 py-1 rounded-lg">x{item.quantity}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mb-8">
                <input className="flex-1 h-12 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-surface-border text-xs px-4 focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Mã giảm giá" type="text"/>
                <button className="h-12 px-6 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">Áp dụng</button>
              </div>

              <div className="border-t border-slate-100 dark:border-surface-border pt-6 space-y-4">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>Tạm tính</span>
                  <span className="text-slate-900 dark:text-white">{subtotal.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>Phí vận chuyển</span>
                  <span className="text-green-500 uppercase tracking-widest text-[10px]">Miễn phí</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-surface-border">
                  <span className="text-base font-black text-slate-900 dark:text-white">Tổng cộng</span>
                  <span className="text-2xl font-black text-primary tracking-tighter">{total.toLocaleString('vi-VN')}₫</span>
                </div>
                <p className="text-[10px] text-right text-slate-400 font-bold uppercase tracking-widest mt-[-8px] italic">(Đã bao gồm VAT)</p>
              </div>
            </div>

            {/* AI Suggestion */}
            <div className="bg-gradient-to-br from-indigo-900 to-[#0f172a] border border-primary/20 rounded-[2rem] p-6 shadow-xl relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 bg-primary/20 blur-3xl size-32 rounded-full"></div>
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <span className="material-symbols-outlined text-primary animate-pulse !text-[20px] font-variation-fill">smart_toy</span>
                <h3 className="text-[10px] font-black text-white tracking-widest uppercase">AI Suggestion</h3>
              </div>
              <p className="text-[11px] text-slate-300 mb-6 leading-relaxed relative z-10">Dựa trên đơn hàng của bạn, 85% khách hàng mua thêm sản phẩm này để tối ưu trải nghiệm:</p>
              <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/10 hover:border-primary/50 transition-all cursor-pointer group/item relative z-10">
                <div className="size-14 rounded-xl bg-white p-2 flex-shrink-0">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6fnnApC-_P42jyZl2HXFy2zZcs68VOb-PGrRqJGD4nz3uOqKFSqN6eV14P8VnvMhHvvCxmx60vXleUBJ0b21EoDtfxihh70BC_zfzbJqKf4bLVa1wY4po5sIedopCSxnS0RpXvx6xjuq5C2QUUUM2jhjL7E_hVpZmi6wP1Gcul2LbMUdYqci3zd-QTunvT75F87j8MieniY6w8WwAINsEDZ3oWfJBd0aw1yKGL3_zcGRap3k3huBh54c0IK7mrr-hJ1wxX-vHXh0" alt="Sugg" className="size-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-tight truncate">Logitech MX Master 3S</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-black text-primary">2.190.000₫</span>
                    <span className="text-[9px] text-slate-500 line-through">2.490.000₫</span>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const product = PRODUCTS.find(p => p.id === 'p4');
                    if (product) onAddToCart(product);
                  }}
                  className="size-8 rounded-full bg-primary hover:bg-primary-dark flex items-center justify-center text-white transition-all shadow-lg active:scale-90"
                >
                  <span className="material-symbols-outlined !text-[16px]">add</span>
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              <div className="flex flex-col items-center gap-1">
                <span className="material-symbols-outlined !text-[20px]">lock_person</span>
                <span className="text-[9px] font-black uppercase tracking-tighter">Bảo mật SSL</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="material-symbols-outlined !text-[20px]">verified</span>
                <span className="text-[9px] font-black uppercase tracking-tighter">Chính hãng 100%</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="material-symbols-outlined !text-[20px]">support</span>
                <span className="text-[9px] font-black uppercase tracking-tighter">Hỗ trợ 24/7</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
