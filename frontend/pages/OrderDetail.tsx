import React, { useState } from 'react';
import { Order, Page, User } from '../types';
import { orderAPI } from '../services/apiService';

interface OrderDetailProps {
  order: Order;
  user: User | null;
  onNavigate: (page: Page) => void;
}

export default function OrderDetail({ order, user, onNavigate }: OrderDetailProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order>(order);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const isAdmin = user?.role === 'admin';

  const steps = [
    { label: 'Đặt hàng', icon: 'shopping_cart' },
    { label: 'Đóng gói', icon: 'package_2' },
    { label: 'Vận chuyển', icon: 'local_shipping' },
    { label: 'Hoàn tất', icon: 'verified' },
  ];

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      alert('Đã tạo bản in hóa đơn thành công!');
    }, 2000);
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      setIsUpdatingStatus(true);
      const numericId = typeof currentOrder.id === 'string' ? parseInt(currentOrder.id.replace(/\D/g, '')) : currentOrder.id;
      const updatedOrder = await orderAPI.updateStatus(numericId, newStatus);
      setCurrentOrder({ ...currentOrder, status: newStatus });
      alert('Cập nhật trạng thái đơn hàng thành công!');
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Cập nhật trạng thái thất bại');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getTrackingStep = (status: string) => {
    switch (status) {
      case 'pending': return 0;
      case 'processing': return 1;
      case 'shipped':
      case 'shipping': return 2;
      case 'delivered': return 3;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const trackingStep = getTrackingStep(currentOrder.status);

  return (
    <div className="flex flex-col gap-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate(Page.PROFILE)}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-all group w-fit"
        >
          <span className="material-symbols-outlined !text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Quay lại lịch sử
        </button>
        <nav className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <button onClick={() => onNavigate(Page.PROFILE)} className="hover:text-primary transition-colors">Hồ sơ</button>
          <span className="material-symbols-outlined !text-[14px]">chevron_right</span>
          <button onClick={() => onNavigate(Page.PROFILE)} className="hover:text-primary transition-colors">Lịch sử</button>
          <span className="material-symbols-outlined !text-[14px]">chevron_right</span>
          <span className="text-primary">{currentOrder.id}</span>
        </nav>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-surface-border pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            Chi tiết đơn hàng
            {currentOrder.status === 'cancelled' && (
              <span className="bg-red-500 text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-black">Đã hủy</span>
            )}
          </h1>
          <p className="text-slate-500 text-sm font-medium">Mã đơn: <span className="text-slate-900 dark:text-white font-bold">{currentOrder.id}</span> • {currentOrder.date || (currentOrder as any).createdAt}</p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <div className="flex items-center gap-3 bg-white dark:bg-white/5 p-2 rounded-2xl border border-slate-100 dark:border-surface-border">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Quyền Admin:</span>
              <select
                value={currentOrder.status}
                onChange={(e) => handleUpdateStatus(e.target.value)}
                disabled={isUpdatingStatus}
                className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl border-none outline-none cursor-pointer disabled:opacity-50"
              >
                <option value="pending">Chờ xử lý</option>
                <option value="processing">Đang đóng gói</option>
                <option value="shipped">Đang vận chuyển</option>
                <option value="delivered">Đã hoàn tất</option>
                <option value="cancelled">Hủy đơn</option>
              </select>
            </div>
          )}
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary hover:text-white transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined !text-[18px]">{isPrinting ? 'sync' : 'print'}</span>
            {isPrinting ? 'Đang chuẩn bị...' : 'In hóa đơn'}
          </button>
        </div>
      </div>

      {currentOrder.status !== 'cancelled' && (
        <div className="bg-white dark:bg-surface-dark rounded-[2rem] border border-slate-100 dark:border-surface-border p-8 md:p-12 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center relative z-10">
            <div className="absolute left-0 top-6 w-full h-1 bg-slate-100 dark:bg-white/5 -z-10 rounded-full"></div>
            <div
              className="absolute left-0 top-6 h-1 bg-primary -z-10 rounded-full transition-all duration-1000"
              style={{ width: `${(trackingStep / (steps.length - 1)) * 100}%` }}
            ></div>

            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center gap-3">
                <div className={`size-12 rounded-2xl flex items-center justify-center transition-all duration-500 ring-4 ${index <= trackingStep ? 'bg-primary text-white ring-primary/20' : 'bg-slate-100 dark:bg-surface-border text-slate-400 ring-transparent'}`}>
                  <span className={`material-symbols-outlined !text-[24px] ${index <= trackingStep ? 'font-variation-fill' : ''}`}>{step.icon}</span>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${index <= trackingStep ? 'text-primary' : 'text-slate-400'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-surface-dark rounded-[2rem] border border-slate-100 dark:border-surface-border overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-surface-border bg-slate-50/50 dark:bg-white/5">
              <h3 className="text-sm font-black uppercase tracking-widest font-display text-slate-900 dark:text-white">Sản phẩm đã mua</h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-surface-border">
              {currentOrder.items.map((item, idx) => (
                <div key={idx} className="p-6 flex items-center gap-6 group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <div className="size-20 rounded-2xl bg-white p-2 border border-slate-100 dark:border-surface-border flex-shrink-0 cursor-pointer" onClick={() => alert('Chuyển đến trang sản phẩm...')}>
                    <img src={item.image} alt={item.name} className="size-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white truncate cursor-pointer" onClick={() => alert('Chuyển đến trang sản phẩm...')}>{item.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-primary">{item.price.toLocaleString('vi-VN')}₫</p>
                    <p className="text-[10px] text-slate-400 font-bold">Số lượng: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            onClick={() => onNavigate(Page.AI_ASSISTANT)}
            className="ai-glass rounded-[2rem] p-8 relative group overflow-hidden cursor-pointer hover:border-primary/40 transition-all"
          >
            <div className="relative z-10 flex items-center gap-6">
              <div className="size-16 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg animate-sparkle">
                <span className="material-symbols-outlined !text-[32px] font-variation-fill">auto_awesome</span>
              </div>
              <div>
                <h3 className="text-lg font-black font-display text-primary mb-1 uppercase tracking-tight">AI Care Plus Insight</h3>
                <p className="text-sm text-slate-500 dark:text-slate-300 leading-relaxed">
                  Dựa trên các thiết bị bạn vừa nhận, TechStore AI khuyên bạn nên sử dụng sạc chính hãng 20W để bảo vệ pin thiết bị tốt hơn 15%. Click để hỏi thêm AI.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-surface-dark rounded-[2rem] border border-slate-100 dark:border-surface-border p-6 space-y-6 shadow-sm">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Thông tin giao hàng</p>
              <p className="text-sm font-black text-slate-900 dark:text-white">{currentOrder.user?.name || 'Khách hàng'}</p>
              <p className="text-xs text-slate-500 mt-1">{currentOrder.user?.phone || 'Chưa cập nhật SĐT'}</p>
              <p className="text-xs text-slate-500 mt-2">{currentOrder.address}</p>
              <button onClick={() => alert('Yêu cầu đổi địa chỉ giao hàng đã được gửi!')} className="text-[9px] font-black text-primary uppercase tracking-widest mt-4 hover:underline">Thay đổi địa chỉ</button>
            </div>
            <div className="h-px bg-slate-100 dark:bg-surface-border"></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Thanh toán</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{currentOrder.paymentMethod}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-[2rem] border border-slate-100 dark:border-surface-border p-6 shadow-sm">
            <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-surface-border">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500">Tạm tính</span>
                <span className="text-slate-900 dark:text-white">{currentOrder.total.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500">Vận chuyển</span>
                <span className="text-green-500 uppercase">Miễn phí</span>
              </div>
            </div>
            <div className="pt-4 flex justify-between items-center">
              <span className="text-sm font-black font-display uppercase text-slate-900 dark:text-white">Tổng cộng</span>
              <span className="text-2xl font-black text-primary tracking-tighter">{currentOrder.total.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
