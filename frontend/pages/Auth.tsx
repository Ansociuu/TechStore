
import React, { useState } from 'react';
import { Page } from '../types';

interface AuthProps {
  onSuccess: (userData: any) => void;
  onNavigate: (page: Page) => void;
}

const Auth: React.FC<AuthProps> = ({ onSuccess, onNavigate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful login
    onSuccess({
      name: "Nguyễn Văn A",
      email: "user@example.com",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1ACFs9JeKxmBtKrY5EDMeayhUqt2VoL6O5wNjCUZvSrm4W8ndrWHPG-kRy7f4DeSEUyibBGiemWZxMDXvS-7SWjHLUKgYuYvxMgqyYNVVGVw-HVx8KSJuQ9PevWkUAuY5R3NapZg8PUHhtYlkchSm7onyEGbEey5e8mEm-6NcrMHrKDqVeEfS3kq5IPNV8CgY4OHodn_QS3KjfMZ4XhKnCJSXATUDbdimSwM_pB5wd5okLcWLEqY3DaRrgSk3PkCO6zRmphL0hfY",
      rank: 'Gold'
    });
    onNavigate(Page.HOME);
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 min-h-[70vh] relative animate-in fade-in zoom-in-95 duration-500">
      {/* Navigation Back */}
      <div className="w-full max-w-[480px] mb-6">
        <button 
          onClick={() => onNavigate(Page.HOME)}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-all group w-fit"
        >
          <span className="material-symbols-outlined !text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Quay lại trang chủ
        </button>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-50">
        <div className="absolute top-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] -left-[10%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-[480px] bg-white dark:bg-surface-dark rounded-[2rem] shadow-2xl z-10 border border-slate-100 dark:border-surface-border overflow-hidden relative transition-all duration-500">
        {/* Header section */}
        <div className="pt-10 px-8 pb-4 text-center">
          <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5 text-primary">
            <span className="material-symbols-outlined !text-[32px] font-variation-fill">smart_toy</span>
          </div>
          <h1 className="text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white">
            {isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-light">
            {isLogin ? 'Trải nghiệm mua sắm thông minh cùng AI' : 'Tham gia cộng đồng TechStore ngay hôm nay'}
          </p>
        </div>

        {/* Tabs */}
        <div className="px-8 mt-6">
          <div className="flex border-b border-slate-100 dark:border-surface-border w-full relative">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 pb-3 text-sm font-bold transition-all relative z-10 ${isLogin ? 'text-primary' : 'text-slate-400'}`}
            >
              Đăng nhập
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 pb-3 text-sm font-bold transition-all relative z-10 ${!isLogin ? 'text-primary' : 'text-slate-400'}`}
            >
              Đăng ký
            </button>
            <div 
              className={`absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ${isLogin ? 'left-0 w-1/2' : 'left-1/2 w-1/2'}`}
            />
          </div>
        </div>

        <div className="p-8 pt-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500">Họ</span>
                  <input 
                    required 
                    type="text" 
                    placeholder="Nguyễn"
                    className="w-full rounded-xl border border-slate-100 dark:border-surface-border bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white h-12 px-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500">Tên</span>
                  <input 
                    required 
                    type="text" 
                    placeholder="Văn A"
                    className="w-full rounded-xl border border-slate-100 dark:border-surface-border bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white h-12 px-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </label>
              </div>
            )}

            <label className="flex flex-col gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">Email</span>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 !text-[20px]">mail</span>
                <input 
                  required 
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-slate-100 dark:border-surface-border bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white h-12 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
            </label>

            <label className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Mật khẩu</span>
                {isLogin && <a href="#" className="text-[10px] font-bold text-primary hover:underline">Quên mật khẩu?</a>}
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 !text-[20px]">lock</span>
                <input 
                  required 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-100 dark:border-surface-border bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white h-12 pl-12 pr-12 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <span className="material-symbols-outlined !text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </label>

            <button 
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-black tracking-widest uppercase transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98] group"
            >
              {isLogin ? 'Đăng nhập' : 'Đăng ký ngay'}
              <span className="material-symbols-outlined !text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </form>

          <div className="relative flex items-center py-8">
            <div className="flex-grow border-t border-slate-100 dark:border-surface-border"></div>
            <span className="flex-shrink-0 mx-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hoặc tiếp tục với</span>
            <div className="flex-grow border-t border-slate-100 dark:border-surface-border"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 h-12 border border-slate-100 dark:border-surface-border rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all bg-white dark:bg-transparent shadow-sm group">
              <img alt="Google" className="size-5 group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKur42-ZX-1NIZgQGan58POKEhUh1MUPpuPQOrAGvYV-Da7Qx_UhdMBx_oOKYvMTSPhk1addJc_QOetsu4HP1_nLFDIfI71HzKhRp67sa3TXFDR6MHo6LktvLwVSr4BDeROUZ3iZrwcYOQCcSstdoOcobKAChg2ma4CVNirYUhA7dy_CSlsIV0RInQui5vYlcppbFBTSczAfw6oamzDkC-uxNcSaB1yR6x7zeo5N7_YuOxw2lGB2d0omUscywYKljYpJJG-LAMSLo"/>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 h-12 border border-slate-100 dark:border-surface-border rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all bg-white dark:bg-transparent shadow-sm group">
              <img alt="Facebook" className="size-5 group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfKZCNHla6y4vhqxkDasHfmN6w9JclQdEJfpuuF9GvzCVChr1Q-qsvGNUpjY10qfQ6t0Iz2ofBSNzl2FfJXutbqiU3Q-NFEsuVbV4syAMO0-bp9lkMTdHNzTiIP2_L7Sgn1U_3WQqxBZqH_lByEd1A1pGtQBxqx5YaW01m9-CbNurNHP2xVWBnAWdJZ0r6_ebUFZXMIBT9DdLwR1px7nWwzdXNQr3Id1h-46oM0k4--42Sg0qnl6QaKY3iyGfEeDAlIHgPvsPW9eU"/>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
