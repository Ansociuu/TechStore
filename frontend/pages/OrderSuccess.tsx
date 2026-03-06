import React from 'react';
import { Page } from '../types';

interface OrderSuccessProps {
    onNavigate: (page: Page) => void;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ onNavigate }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="mb-8 relative">
                <div className="size-24 rounded-3xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 shadow-xl shadow-green-200/50 dark:shadow-none animate-bounce-slow">
                    <span className="material-symbols-outlined !text-[48px]">check_circle</span>
                </div>
                <div className="absolute -top-2 -right-2 size-8 rounded-full bg-primary flex items-center justify-center text-white animate-pulse">
                    <span className="material-symbols-outlined !text-[16px]">celebration</span>
                </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight text-slate-900 dark:text-white mb-4">
                Đặt hàng thành công!
            </h1>

            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-md mb-8 font-light leading-relaxed">
                Cảm ơn bạn đã mua sắm tại TechStore. Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến bạn.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                    onClick={() => onNavigate(Page.PROFILE)}
                    className="h-14 px-8 bg-slate-100 dark:bg-surface-light hover:bg-slate-200 dark:hover:bg-surface-border text-slate-900 dark:text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group"
                >
                    <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">history</span>
                    Xem đơn hàng
                </button>
                <button
                    onClick={() => onNavigate(Page.HOME)}
                    className="h-14 px-8 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2 group active:scale-95"
                >
                    Tiếp tục mua sắm
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
            </div>

            <div className="mt-12 p-6 rounded-3xl bg-slate-50 dark:bg-surface-dark border border-slate-100 dark:border-surface-border max-w-md w-full">
                <div className="flex items-start gap-4 text-left">
                    <div className="size-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 flex-shrink-0">
                        <span className="material-symbols-outlined">mark_email_unread</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">Kiểm tra email của bạn</h3>
                        <p className="text-sm text-slate-500 mt-1">Chúng tôi đã gửi xác nhận đơn hàng và thông tin theo dõi vận chuyển vào email của bạn.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
