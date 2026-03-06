import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import { authAPI } from '../services/apiService';

interface ResetPasswordProps {
    onNavigate: (page: Page) => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ onNavigate }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        // Lấy token từ URL query
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            setMessage({
                type: 'error',
                text: 'Liên kết không hợp lệ. Vui lòng kiểm tra lại email của bạn.'
            });
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            await authAPI.resetPassword(token, newPassword);
            setMessage({
                type: 'success',
                text: 'Mật khẩu của bạn đã được cập nhật thành công!'
            });
            // Delay redirect to login
            setTimeout(() => onNavigate(Page.AUTH), 3000);
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
                            <span className="material-symbols-outlined !text-[32px]">verified_user</span>
                        </div>
                        <h1 className="text-3xl font-black font-display tracking-tight">Đặt lại mật khẩu</h1>
                        <p className="text-slate-500 text-sm">Vui lòng nhập mật khẩu mới cho tài khoản của bạn.</p>
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

                    {!token && !message ? (
                        <div className="text-center py-10">
                            <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Mật khẩu mới</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 !text-[20px]">lock</span>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Xác nhận mật khẩu</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 !text-[20px]">lock</span>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !token}
                                className="w-full py-4 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="size-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    'Cập nhật mật khẩu'
                                )}
                            </button>
                        </form>
                    )}

                    <div className="text-center">
                        <button
                            onClick={() => onNavigate(Page.AUTH)}
                            className="text-sm font-bold text-primary hover:underline transition-all"
                        >
                            Quay lại đăng nhập
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
