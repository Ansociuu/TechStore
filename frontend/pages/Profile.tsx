
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
    email: user.email,
    phone: user.phone || '',
    birthday: user.birthday || '',
    gender: user.gender || 'male'
  });

  const [addresses, setAddresses] = useState(user.addresses || []);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    detail: '',
    type: 'home' as 'home' | 'office',
    isDefault: false
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    app: true,
    promo: true
  });

  // Đồng bộ form khi user prop thay đổi
  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      birthday: user.birthday || '',
      gender: user.gender || 'male'
    });
    setAddresses(user.addresses || []);
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
        email: formData.email,
        phone: formData.phone,
        birthday: formData.birthday,
        gender: formData.gender as any
      });
      setIsSaving(false);
      alert('Đã cập nhật thông tin cá nhân thành công!');
    }, 800);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddress = {
      ...addressForm,
      id: editingAddress ? editingAddress.id : `addr-${Date.now()}`
    };

    let updatedAddresses;
    if (editingAddress) {
      updatedAddresses = addresses.map(addr => addr.id === editingAddress.id ? newAddress : addr);
    } else {
      updatedAddresses = [...addresses, newAddress];
    }

    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === newAddress.id
      }));
    }

    setAddresses(updatedAddresses);
    onUpdateUser({ ...user, addresses: updatedAddresses });
    setIsAddingAddress(false);
    setEditingAddress(null);
    setAddressForm({
      name: '', phone: '', province: '', district: '', ward: '', detail: '', type: 'home', isDefault: false
    });
  };

  const handleDeleteAddress = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      const updatedAddresses = addresses.filter(addr => addr.id !== id);
      setAddresses(updatedAddresses);
      onUpdateUser({ ...user, addresses: updatedAddresses });
    }
  };

  const handleSetDefaultAddress = (id: string) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    setAddresses(updatedAddresses);
    onUpdateUser({ ...user, addresses: updatedAddresses });
  };

  const handleLogoutClick = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      // Vì onLogout không được truyền trực tiếp qua ProfileProps nhưng App.tsx xử lý logic chuyển hướng nếu user null
      // Chúng ta sẽ gọi callback xóa user
      onUpdateUser(null as any);
      onNavigate(Page.HOME);
    }
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

              <div className="my-4 border-t border-slate-100 dark:border-surface-border"></div>

              <button
                onClick={handleLogoutClick}
                className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
              >
                <span className="material-symbols-outlined !text-[20px]">logout</span>
                Đăng xuất
              </button>
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
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-14 rounded-2xl border border-slate-100 dark:border-surface-border bg-slate-50 dark:bg-black/20 px-6 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-bold"
                    type="text"
                    required
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email nhận thông báo</span>
                  <input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-14 rounded-2xl border border-slate-100 dark:border-surface-border bg-slate-50 dark:bg-black/20 px-6 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-bold"
                    type="email"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Số điện thoại</span>
                  <input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-14 rounded-2xl border border-slate-100 dark:border-surface-border bg-slate-50 dark:bg-black/20 px-6 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-bold"
                    type="tel"
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Ngày sinh</span>
                    <input
                      value={formData.birthday}
                      onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                      className="h-14 rounded-2xl border border-slate-100 dark:border-surface-border bg-slate-50 dark:bg-black/20 px-6 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-bold"
                      type="date"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Giới tính</span>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="h-14 rounded-2xl border border-slate-100 dark:border-surface-border bg-slate-50 dark:bg-black/20 px-6 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-bold appearance-none"
                    >
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </label>
                </div>

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

          {activeTab === 'address' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black font-display tracking-tight flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary font-variation-fill">location_on</span>
                  Sổ địa chỉ
                </h2>
                {!isAddingAddress && (
                  <button
                    onClick={() => {
                      setIsAddingAddress(true);
                      setEditingAddress(null);
                      setAddressForm({ name: '', phone: '', province: '', district: '', ward: '', detail: '', type: 'home', isDefault: false });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                  >
                    <span className="material-symbols-outlined !text-[18px]">add</span>
                    Thêm địa chỉ mới
                  </button>
                )}
              </div>

              {isAddingAddress ? (
                <div className="bg-white dark:bg-surface-dark rounded-[2.5rem] border border-slate-100 dark:border-surface-border p-8 shadow-sm">
                  <h3 className="text-lg font-black font-display mb-6">{editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}</h3>
                  <form onSubmit={handleSaveAddress} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="flex flex-col gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Họ và tên người nhận</span>
                      <input
                        value={addressForm.name}
                        onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                        className="h-12 rounded-xl border border-slate-100 dark:border-surface-border bg-slate-50 dark:bg-black/20 px-4 text-sm font-bold outline-none focus:border-primary"
                        required
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Số điện thoại</span>
                      <input
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        className="h-12 rounded-xl border border-slate-100 dark:border-surface-border bg-slate-50 dark:bg-black/20 px-4 text-sm font-bold outline-none focus:border-primary"
                        required
                      />
                    </label>
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input placeholder="Tỉnh/Thành phố" value={addressForm.province} onChange={(e) => setAddressForm({ ...addressForm, province: e.target.value })} className="h-12 rounded-xl border border-slate-100 dark:border-surface-border bg-slate-50 dark:bg-black/20 px-4 text-sm font-bold outline-none focus:border-primary" required />
                      <input placeholder="Quận/Huyện" value={addressForm.district} onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })} className="h-12 rounded-xl border border-slate-100 dark:border-surface-border bg-slate-50 dark:bg-black/20 px-4 text-sm font-bold outline-none focus:border-primary" required />
                      <input placeholder="Phường/Xã" value={addressForm.ward} onChange={(e) => setAddressForm({ ...addressForm, ward: e.target.value })} className="h-12 rounded-xl border border-slate-100 dark:border-surface-border bg-slate-50 dark:bg-black/20 px-4 text-sm font-bold outline-none focus:border-primary" required />
                    </div>
                    <label className="md:col-span-2 flex flex-col gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Địa chỉ chi tiết</span>
                      <input
                        value={addressForm.detail}
                        onChange={(e) => setAddressForm({ ...addressForm, detail: e.target.value })}
                        className="h-12 rounded-xl border border-slate-100 dark:border-surface-border bg-slate-50 dark:bg-black/20 px-4 text-sm font-bold outline-none focus:border-primary"
                        required
                      />
                    </label>
                    <div className="flex gap-4">
                      <button type="button" onClick={() => setAddressForm({ ...addressForm, type: 'home' })} className={`flex-1 py-3 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all ${addressForm.type === 'home' ? 'bg-primary/10 border-primary text-primary' : 'border-slate-100 dark:border-surface-border text-slate-400'}`}>Nhà riêng</button>
                      <button type="button" onClick={() => setAddressForm({ ...addressForm, type: 'office' })} className={`flex-1 py-3 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all ${addressForm.type === 'office' ? 'bg-primary/10 border-primary text-primary' : 'border-slate-100 dark:border-surface-border text-slate-400'}`}>Văn phòng</button>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={addressForm.isDefault} onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })} className="size-5 rounded border-slate-300 text-primary focus:ring-primary" />
                      <span className="text-xs font-bold text-slate-600">Đặt làm địa chỉ mặc định</span>
                    </label>
                    <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                      <button type="button" onClick={() => setIsAddingAddress(false)} className="px-6 py-3 rounded-xl border border-slate-100 dark:border-surface-border text-xs font-black uppercase tracking-widest">Hủy bỏ</button>
                      <button type="submit" className="px-8 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20">Lưu địa chỉ</button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.length === 0 ? (
                    <div className="md:col-span-2 bg-white dark:bg-surface-dark rounded-[2.5rem] border border-dashed border-slate-200 dark:border-surface-border p-12 text-center">
                      <span className="material-symbols-outlined !text-[48px] text-slate-200 mb-4">location_off</span>
                      <p className="text-slate-500 font-bold">Bạn chưa có địa chỉ nào được lưu.</p>
                    </div>
                  ) : (
                    addresses.map(addr => (
                      <div key={addr.id} className={`bg-white dark:bg-surface-dark rounded-3xl border p-6 flex flex-col gap-4 shadow-sm transition-all ${addr.isDefault ? 'border-primary ring-1 ring-primary/20' : 'border-slate-100 dark:border-surface-border'}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-sm">{addr.name}</h4>
                            {addr.isDefault && (
                              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest">Mặc định</span>
                            )}
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 text-[8px] font-black uppercase tracking-widest">{addr.type === 'home' ? 'Nhà riêng' : 'Văn phòng'}</span>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => {
                              setEditingAddress(addr);
                              setAddressForm(addr);
                              setIsAddingAddress(true);
                            }} className="size-8 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
                              <span className="material-symbols-outlined !text-[18px]">edit</span>
                            </button>
                            {!addr.isDefault && (
                              <button onClick={() => handleDeleteAddress(addr.id)} className="size-8 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                                <span className="material-symbols-outlined !text-[18px]">delete</span>
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-slate-500 flex items-center gap-2">
                            <span className="material-symbols-outlined !text-[14px]">call</span> {addr.phone}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                            <span className="material-symbols-outlined !text-[14px] mt-0.5">location_on</span>
                            {addr.detail}, {addr.ward}, {addr.district}, {addr.province}
                          </p>
                        </div>
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="mt-2 text-[10px] font-black uppercase tracking-widest text-primary hover:underline w-fit"
                          >
                            Thiết lập mặc định
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
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

          {activeTab === 'settings' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-black font-display tracking-tight flex items-center gap-3">
                <span className="material-symbols-outlined text-primary font-variation-fill">settings</span>
                Cài đặt tài khoản
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-surface-dark rounded-[2.5rem] border border-slate-100 dark:border-surface-border p-8 shadow-sm">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Thông báo</h3>
                  <div className="space-y-6">
                    {[
                      { id: 'email', label: 'Thông báo qua Email', desc: 'Cập nhật đơn hàng, khuyến mãi' },
                      { id: 'app', label: 'Thông báo ứng dụng', desc: 'Tin nhắn AI, nhắc nhở thanh toán' },
                      { id: 'sms', label: 'Thông báo SMS', desc: 'Mã OTP, xác nhận đơn hàng quan trọng' },
                      { id: 'promo', label: 'Tin tức khuyến mãi', desc: 'Ưu đãi đặc quyền dành riêng cho bạn' }
                    ].map(item => (
                      <div key={item.id} className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-black">{item.label}</p>
                          <p className="text-[10px] text-slate-500">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => setNotifications({ ...notifications, [item.id]: !((notifications as any)[item.id]) })}
                          className={`size-12 rounded-2xl flex items-center justify-center border transition-all ${((notifications as any)[item.id]) ? 'bg-primary border-primary text-white' : 'border-slate-100 dark:border-surface-border text-slate-300'}`}
                        >
                          <span className="material-symbols-outlined !text-[20px] font-variation-fill">
                            {((notifications as any)[item.id]) ? 'notifications_active' : 'notifications_off'}
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-white dark:bg-surface-dark rounded-[2.5rem] border border-slate-100 dark:border-surface-border p-8 shadow-sm">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Bảo mật</h3>
                    <div className="space-y-4">
                      <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border hover:border-primary transition-all">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary">key</span>
                          <span className="text-xs font-bold font-display">Đổi mật khẩu</span>
                        </div>
                        <span className="material-symbols-outlined !text-[18px] text-slate-400">chevron_right</span>
                      </button>
                      <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border hover:border-primary transition-all">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary">security</span>
                          <span className="text-xs font-bold font-display">Xác thực 2 lớp (2FA)</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 text-[8px] font-black uppercase tracking-widest">Tắt</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-red-50 dark:bg-red-500/5 rounded-[2.5rem] border border-red-100 dark:border-red-500/10 p-8 shadow-sm">
                    <h3 className="text-xs font-black uppercase tracking-widest text-red-500 mb-2">Vùng nguy hiểm</h3>
                    <p className="text-[10px] text-red-400 mb-6">Xóa tài khoản vĩnh viễn và mọi dữ liệu liên quan.</p>
                    <button onClick={() => alert('Yêu cầu xóa tài khoản đã được gửi. Chúng tôi sẽ liên hệ với bạn để xác nhận.')} className="px-6 py-3 rounded-xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20 active:scale-95 transition-all">
                      Yêu cầu xóa tài khoản
                    </button>
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
