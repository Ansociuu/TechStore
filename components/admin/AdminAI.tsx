import React from 'react';

const AdminAI: React.FC = () => {
    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white uppercase">Phân tích chuyên sâu AI</h1>
                <p className="text-sm text-slate-500 font-medium italic">Báo cáo hiệu năng kinh doanh từ Gemini Business Engine</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Forecast Card */}
                <div className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-surface-border rounded-[2.5rem] p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="material-symbols-outlined text-primary font-variation-fill">batch_prediction</span>
                        <h3 className="text-sm font-black uppercase tracking-widest">Dự báo doanh thu tháng tới</h3>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-end justify-between h-40 px-4">
                            {[30, 45, 60, 85, 95].map((h, i) => (
                                <div key={i} className="w-[15%] group relative flex flex-col items-center">
                                    <div className={`w-full rounded-t-xl transition-all duration-1000 ${i === 4 ? 'bg-primary shadow-lg shadow-primary/20 animate-pulse' : 'bg-slate-200 dark:bg-white/5'}`} style={{ height: `${h}%` }}></div>
                                    <span className="absolute top-full mt-2 text-[8px] font-black text-slate-400">THÁNG {i + 1}</span>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                            <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                <span className="text-primary font-black uppercase">Dự báo:</span> Tăng trưởng dự kiến <b>15.4%</b> nhờ chiến dịch AI-Targeting mới. Lượng truy cập Laptop có thể tăng đột biến vào cuối tuần.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Inventory Optimization */}
                <div className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-surface-border rounded-[2.5rem] p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="material-symbols-outlined text-purple-500 font-variation-fill">inventory</span>
                        <h3 className="text-sm font-black uppercase tracking-widest">Tối ưu hóa tồn kho</h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: 'MacBook Air M2', suggestion: 'Nhập thêm 50 đơn vị', urgency: 'High' },
                            { name: 'iPhone 15 Pro', suggestion: 'Duy trì mức hiện tại', urgency: 'Normal' },
                            { name: 'Sony WH-1000XM5', suggestion: 'Giảm giá để đẩy hàng', urgency: 'Low' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border">
                                <div>
                                    <h4 className="text-xs font-black">{item.name}</h4>
                                    <p className="text-[10px] text-slate-500">{item.suggestion}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${item.urgency === 'High' ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-500'}`}>{item.urgency}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Market Intelligence */}
            <div className="bg-gradient-to-br from-slate-900 to-black rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute right-0 top-0 size-80 bg-primary/10 blur-[100px] pointer-events-none"></div>
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="space-y-4">
                        <span className="material-symbols-outlined !text-[40px] text-primary">public</span>
                        <h3 className="text-sm font-black uppercase tracking-widest text-primary">Global Trends</h3>
                        <p className="text-xs text-slate-400 leading-relaxed font-light">Nhu cầu về gaming gear cao cấp đang tăng 22% trên toàn khu vực Đông Nam Á.</p>
                    </div>
                    <div className="space-y-4">
                        <span className="material-symbols-outlined !text-[40px] text-primary">psychology</span>
                        <h3 className="text-sm font-black uppercase tracking-widest text-primary">Customer Sentiment</h3>
                        <p className="text-xs text-slate-400 leading-relaxed font-light">89% khách hàng hài lòng với dịch vụ giao hàng siêu tốc trong 2h tại TP. HCM.</p>
                    </div>
                    <div className="space-y-4">
                        <span className="material-symbols-outlined !text-[40px] text-primary">rocket_launch</span>
                        <h3 className="text-sm font-black uppercase tracking-widest text-primary">Ad Strategy</h3>
                        <p className="text-xs text-slate-400 leading-relaxed font-light">Nên tập trung ngân sách quảng cáo vào TikTok Ads cho đối tượng Gen Z đam mê tech.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAI;
