import React, { useEffect, useState } from 'react';
import { Page, Order } from '../types';
import { orderAPI } from '../services/apiService';

interface PaymentResultProps {
    onNavigate: (page: Page) => void;
}

const PaymentResult: React.FC<PaymentResultProps> = ({ onNavigate }) => {
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [order, setOrder] = useState<Order | null>(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const params: Record<string, string> = {};
                urlParams.forEach((value, key) => {
                    params[key] = value;
                });

                const result = await orderAPI.verifyVNPay(params);
                if (result.success) {
                    setSuccess(true);
                    setOrder(result.order);
                } else {
                    setSuccess(false);
                    setMessage(result.message || 'Thanh toán không thành công');
                }
            } catch (error) {
                setSuccess(false);
                setMessage('Có lỗi xảy ra khi xác thực thanh toán');
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="size-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-lg font-bold text-slate-500 animate-pulse">Đang xác thực giao dịch từ VNPay...</p>
            </div>
        );
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center p-4 animate-in fade-in duration-700">
            <div className="w-full max-w-2xl bg-white dark:bg-surface-dark rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-surface-border">
                <div className="p-10 md:p-16 text-center space-y-8">
                    {success ? (
                        <>
                            <div className="size-24 bg-green-500/10 rounded-[2rem] flex items-center justify-center text-green-500 mx-auto animate-bounce-short">
                                <span className="material-symbols-outlined !text-[56px] font-variation-fill">check_circle</span>
                            </div>
                            <div className="space-y-3">
                                <h1 className="text-4xl font-black font-display tracking-tight">Thanh toán thành công!</h1>
                                <p className="text-slate-500 text-lg">Cảm ơn bạn đã tin tưởng TechStore. Đơn hàng của bạn đang được xử lý.</p>
                            </div>
                            {order && (
                                <div className="bg-slate-50 dark:bg-white/5 rounded-3xl p-6 text-left space-y-4">
                                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Mã đơn hàng</span>
                                        <span className="font-display font-black text-primary">#{order.id}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Tổng thanh toán</span>
                                        <span className="text-xl font-black">{(order.total).toLocaleString('vi-VN')}₫</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Phương thức</span>
                                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">VNPay (Thanh toán trực tuyến)</span>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="size-24 bg-red-500/10 rounded-[2rem] flex items-center justify-center text-red-500 mx-auto">
                                <span className="material-symbols-outlined !text-[56px] font-variation-fill">error</span>
                            </div>
                            <div className="space-y-3">
                                <h1 className="text-4xl font-black font-display tracking-tight text-red-500">Thanh toán thất bại</h1>
                                <p className="text-slate-500 text-lg">{message}</p>
                            </div>
                            <p className="text-slate-400 text-sm">Vui lòng thử lại hoặc liên hệ với bộ phận hỗ trợ nếu bạn đã bị trừ tiền.</p>
                        </>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <button
                            onClick={() => onNavigate(Page.HOME)}
                            className="flex-1 py-4 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-2xl font-black text-sm uppercase tracking-widest transition-all"
                        >
                            Về trang chủ
                        </button>
                        <button
                            onClick={() => onNavigate(Page.PROFILE)}
                            className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            Xem đơn hàng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentResult;
