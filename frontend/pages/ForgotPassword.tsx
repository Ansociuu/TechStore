import React, { useState } from 'react';
import { Page } from '../types';
import { authAPI } from '../services/apiService';

interface ForgotPasswordProps {
    onNavigate: (page: Page) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigate }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            await authAPI.forgotPassword(email);
            setMessage({
                type: 'success',
                text: 'Một email hướng dẫn khôi phục mật khẩu đã được gửi đến hòm thư của bạn.'
            });
        } catch (err: any) {
            setMessage({
                type: 'error',
                text: err.response?.data?.error || 'Có lỗi xảy ra, vui lòng thử lại sau.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 animate-in fade-in duration-700">
            <div className="w-full max-w-md bg-white dark:bg-surface-dark rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-surface-border">
                <div className="p-10 space-y-8">
                    <div className="text-center space-y-2">
                        <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
                            <span className="material-symbols-outlined !text-[32px]">lock_reset</span>
                        </div>
                        <h1 className="text-3xl font-black font-display tracking-tight">Quên mật khẩu?</h1>
                        <p className="text-slate-500 text-sm">Nhập email của bạn để nhận liên kết khôi phục mật khẩu.</p>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                            }`}>
                            <span className="material-symbols-outlined !text-[20px]">
                                {message.type === 'success' ? 'check_circle' : 'error'}
                            </span>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email tài khoản</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 !text-[20px]">mail</span>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="size-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                'Gửi yêu cầu'
                            )}
                        </button>
                    </form>

                    <div className="text-center">
                        <button
                            onClick={() => onNavigate(Page.AUTH)}
                            className="text-sm font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-2 mx-auto"
                        >
                            <span className="material-symbols-outlined !text-[18px]">arrow_back</span>
                            Quay lại đăng nhập
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
