
import React, { useState, useEffect } from 'react';
import { User, Page, Product, Order } from '../types';
import { PRODUCTS } from '../constants';

interface ProfileProps {
  user: User;
  onNavigate: (page: Page) => void;
  onProductSelect: (product: Product) => void;
  onOrderSelect: (order: Order) => void;
  onUpdateUser: (user: User) => void;
}

export default function Profile({ user, onNavigate, onProductSelect, onOrderSelect, onUpdateUser }: ProfileProps) {
  const [activeTab, setActiveTab] = useState('info');
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email
  });

  // Đồng bộ form khi user prop thay đổi
  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email
    });
  }, [user]);

  const orders: Order[] = [
    {
      id: "#ORD-2390",
      date: "20/10/2023",
      total: 8680000,
      status: "Giao thành công",
      trackingStep: 3,
      paymentMethod: "Thẻ tín dụng (**** 1234)",
      address: "123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh",
      items: [
        { name: "Sony WH-1000XM5", price: 6490000, quantity: 1, image: PRODUCTS[2].image, category: PRODUCTS[2].category },
        { name: "Logitech MX Master 3S", price: 2190000, quantity: 1, image: PRODUCTS[3].image, category: PRODUCTS[3].category }
      ]
    }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Giả lập lưu dữ liệu lên server
    setTimeout(() => {
      onUpdateUser({
        ...user,
        name: formData.name,
        email: formData.email
      });
      setIsSaving(false);
      alert('Đã cập nhật thông tin cá nhân thành công!');
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Navigation Back */}
      <button 
        onClick={() => onNavigate(Page.HOME)}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-all group w-fit"
      >
        <span className="material-symbols-outlined !text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
        Thoát hồ sơ
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-slate-100 dark:border-surface-border overflow-hidden sticky top-24 shadow-sm">
            <div className="p-8 border-b border-slate-100 dark:border-surface-border flex flex-col items-center text-center gap-4">
              <div className="size-24 rounded-full border-4 border-primary/20 p-1 relative">
                <img src={user.avatar} alt={user.name} className="size-full rounded-full object-cover" />
                <button className="absolute bottom-0 right-0 size-8 bg-primary text-white rounded-full border-2 border-white dark:border-surface-dark flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined !text-[16px]">photo_camera</span>
                </button>
              </div>
              <div>
                <h3 className="text-lg font-black font-display">{user.name}</h3>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-[10px] font-black uppercase tracking-widest mt-1">
                  <span className="material-symbols-outlined !text-[14px] font-variation-fill">workspace_premium</span>
                  Thành viên {user.rank}
                </span>
              </div>
            </div>
            
            <nav className="p-4 flex flex-col gap-1">
              {[
                { id: 'info', label: 'Thông tin tài khoản', icon: 'person' },
                { id: 'orders', label: 'Lịch sử đơn hàng', icon: 'inventory_2' },
                { id: 'address', label: 'Sổ địa chỉ', icon: 'location_on' },
                { id: 'ai', label: 'Sở thích AI', icon: 'auto_awesome' },
                { id: 'settings', label: 'Cài đặt', icon: 'settings' },
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                >
                  <span className={`material-symbols-outlined !text-[20px] ${activeTab === tab.id ? 'font-variation-fill' : ''}`}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Đơn hàng', value: '12', icon: 'shopping_bag' },
              { label: 'Tích lũy', value: '2.5M', icon: 'database' },
              { label: 'Voucher', value: '05', icon: 'sell' },
              { label: 'AI Score', value: '98', icon: 'psychology' },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-slate-100 dark:border-surface-border flex flex-col items-center gap-1 shadow-sm">
                <span className="material-symbols-outlined text-primary !text-[20px] mb-1">{stat.icon}</span>
                <span className="text-xl font-black font-display">{stat.value}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
              </div>
            ))}
          </div>

          {activeTab === 'info' && (
            <div className="bg-white dark:bg-surface-dark rounded-[2.5rem] border border-slate-100 dark:border-surface-border p-8 md:p-10 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black font-display tracking-tight flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary font-variation-fill">person_edit</span>
                  Thông tin cá nhân
                </h2>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cập nhật lần cuối: Hôm nay</span>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSave}>
                <label className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Họ và tên</span>
                  <input 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="h-14 rounded-2xl border border-slate-100 dark:border-surface-border bg-slate-50 dark:bg-black/20 px-6 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-bold" 
                    type="text" 
                    required
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email nhận thông báo</span>
                  <input 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="h-14 rounded-2xl border border-slate-100 dark:border-surface-border bg-slate-50 dark:bg-black/20 px-6 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-bold" 
                    type="email" 
                    required
                  />
                </label>
                
                <div className="md:col-span-2 p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary">info</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Thông tin cá nhân của bạn được bảo mật theo tiêu chuẩn TechStore AI. Chúng tôi sử dụng các thông tin này để cá nhân hóa trải nghiệm mua sắm và đề xuất sản phẩm tốt nhất cho bạn.
                  </p>
                </div>

                <div className="md:col-span-2 flex justify-end gap-4 pt-4">
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="px-8 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-70"
                  >
                    {isSaving ? (
                      <>
                        <span className="size-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined !text-[18px]">save</span>
                        Lưu thay đổi
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-black font-display tracking-tight flex items-center gap-3">
                <span className="material-symbols-outlined text-primary font-variation-fill">inventory_2</span>
                Lịch sử mua hàng
              </h2>
              {orders.map(order => (
                <div key={order.id} onClick={() => onOrderSelect(order)} className="bg-white dark:bg-surface-dark rounded-[2rem] border border-slate-100 dark:border-surface-border overflow-hidden shadow-sm hover:border-primary transition-all cursor-pointer group">
                  <div className="p-6 md:p-8 bg-slate-50 dark:bg-black/20 border-b border-slate-100 dark:border-surface-border flex flex-wrap justify-between items-center gap-4">
                    <div className="flex gap-8">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mã đơn hàng</p>
                        <p className="text-sm font-black group-hover:text-primary transition-colors">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ngày đặt</p>
                        <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{order.date}</p>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'Giao thành công' ? 'text-green-500 bg-green-500/10' : 'text-primary bg-primary/10'}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="p-8 space-y-6">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-6 items-center">
                        <div className="size-16 rounded-xl bg-slate-50 dark:bg-black/40 p-2 flex-shrink-0 border border-slate-100 dark:border-surface-border">
                          <img src={item.image} alt={item.name} className="size-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-black line-clamp-1">{item.name}</h4>
                          <p className="text-[10px] text-slate-500 mt-1">Số lượng: {item.quantity}</p>
                        </div>
                        <span className="text-xs font-black text-primary">{item.price.toLocaleString('vi-VN')}₫</span>
                      </div>
                    ))}
                    <div className="pt-6 border-t border-slate-100 dark:border-surface-border flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">Tổng thanh toán:</span>
                        <span className="text-lg font-black text-primary">{order.total.toLocaleString('vi-VN')}₫</span>
                      </div>
                      <span className="text-[10px] font-black uppercase text-primary tracking-widest group-hover:translate-x-1 transition-transform flex items-center gap-2">
                        Xem chi tiết <span className="material-symbols-outlined !text-[16px]">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-gradient-to-br from-indigo-900 to-[#0f172a] rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
                  <div className="absolute -right-20 -top-20 bg-primary/20 blur-[100px] size-80 rounded-full group-hover:bg-primary/30 transition-all duration-1000"></div>
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 w-fit">
                          <span className="material-symbols-outlined !text-[16px] text-primary font-variation-fill animate-pulse">auto_awesome</span>
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest">AI Profile Insight</span>
                        </div>
                        <h2 className="text-3xl font-black font-display text-white">Phân tích phong cách công nghệ</h2>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                          Dựa trên các đơn hàng Laptop và Phụ kiện cao cấp, AI nhận diện bạn là một <b>Power User</b>.
                        </p>
                        <button className="px-8 py-3 bg-white text-slate-900 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all">Cập nhật sở thích</button>
                    </div>
                  </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
