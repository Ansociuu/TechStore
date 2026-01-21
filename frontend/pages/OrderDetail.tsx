
import React, { useState } from 'react';
import { Order, Page } from '../types';

interface OrderDetailProps {
  order: Order;
  onNavigate: (page: Page) => void;
}

export default function OrderDetail({ order, onNavigate }: OrderDetailProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  
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

  return (
    <div className="flex flex-col gap-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <button onClick={() => onNavigate(Page.PROFILE)} className="hover:text-primary transition-colors">Hồ sơ</button>
        <span className="material-symbols-outlined !text-[14px]">chevron_right</span>
        <button onClick={() => onNavigate(Page.PROFILE)} className="hover:text-primary transition-colors">Lịch sử</button>
        <span className="material-symbols-outlined !text-[14px]">chevron_right</span>
        <span className="text-primary">{order.id}</span>
      </nav>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 dark:border-surface-border pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white">Chi tiết đơn hàng</h1>
          <p className="text-slate-500 text-sm font-medium">Mã đơn: <span className="text-slate-900 dark:text-white font-bold">{order.id}</span> • {order.date}</p>
        </div>
        <button 
          onClick={handlePrint}
          disabled={isPrinting}
          className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary hover:text-white transition-all disabled:opacity-50"
        >
          <span className="material-symbols-outlined !text-[18px]">{isPrinting ? 'sync' : 'print'}</span> 
          {isPrinting ? 'Đang chuẩn bị...' : 'In hóa đơn'}
        </button>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-[2rem] border border-slate-100 dark:border-surface-border p-8 md:p-12 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-center relative z-10">
          <div className="absolute left-0 top-6 w-full h-1 bg-slate-100 dark:bg-white/5 -z-10 rounded-full"></div>
          <div 
            className="absolute left-0 top-6 h-1 bg-primary -z-10 rounded-full transition-all duration-1000"
            style={{ width: `${(order.trackingStep / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center gap-3">
              <div className={`size-12 rounded-2xl flex items-center justify-center transition-all duration-500 ring-4 ${index <= order.trackingStep ? 'bg-primary text-white ring-primary/20' : 'bg-slate-100 dark:bg-surface-border text-slate-400 ring-transparent'}`}>
                <span className={`material-symbols-outlined !text-[24px] ${index <= order.trackingStep ? 'font-variation-fill' : ''}`}>{step.icon}</span>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${index <= order.trackingStep ? 'text-primary' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-surface-dark rounded-[2rem] border border-slate-100 dark:border-surface-border overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-surface-border bg-slate-50/50 dark:bg-white/5">
               <h3 className="text-sm font-black uppercase tracking-widest font-display text-slate-900 dark:text-white">Sản phẩm đã mua</h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-surface-border">
              {order.items.map((item, idx) => (
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
              <p className="text-sm font-black text-slate-900 dark:text-white">Nguyễn Văn A</p>
              <p className="text-xs text-slate-500 mt-1">0912 345 678</p>
              <p className="text-xs text-slate-500 mt-2">{order.address}</p>
              <button onClick={() => alert('Yêu cầu đổi địa chỉ giao hàng đã được gửi!')} className="text-[9px] font-black text-primary uppercase tracking-widest mt-4 hover:underline">Thay đổi địa chỉ</button>
            </div>
            <div className="h-px bg-slate-100 dark:bg-surface-border"></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Thanh toán</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{order.paymentMethod}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-[2rem] border border-slate-100 dark:border-surface-border p-6 shadow-sm">
            <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-surface-border">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500">Tạm tính</span>
                <span className="text-slate-900 dark:text-white">{order.total.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500">Vận chuyển</span>
                <span className="text-green-500 uppercase">Miễn phí</span>
              </div>
            </div>
            <div className="pt-4 flex justify-between items-center">
              <span className="text-sm font-black font-display uppercase text-slate-900 dark:text-white">Tổng cộng</span>
              <span className="text-2xl font-black text-primary tracking-tighter">{order.total.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
