import React from 'react';
import StatCard from './StatCard';
import SalesChart from './SalesChart';
import CategoryChart from './CategoryChart';

interface OverviewTabProps {
    stats: any;
    onOpenModal: (product: any) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ stats, onOpenModal }) => {
    if (!stats) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Doanh thu"
                    value={`${(stats.totalRevenue || 0).toLocaleString('vi-VN')}₫`}
                    icon="payments"
                    color="text-green-500"
                    bg="bg-green-100 dark:bg-green-900/30"
                    trend={{ value: Math.abs(stats.growth?.revenue || 0), isUp: (stats.growth?.revenue || 0) >= 0 }}
                />
                <StatCard
                    label="Đơn hàng"
                    value={stats.totalOrders}
                    icon="shopping_cart"
                    color="text-blue-500"
                    bg="bg-blue-100 dark:bg-blue-900/30"
                    trend={{ value: Math.abs(stats.growth?.orders || 0), isUp: (stats.growth?.orders || 0) >= 0 }}
                />
                <StatCard
                    label="Tồn kho"
                    value={stats.totalStock}
                    icon="inventory"
                    color="text-purple-500"
                    bg="bg-purple-100 dark:bg-purple-900/30"
                    trend={{ value: Math.abs(stats.growth?.stock || 0), isUp: (stats.growth?.stock || 0) >= 0 }}
                />
                <StatCard
                    label="Người dùng"
                    value={stats.totalUsers}
                    icon="group"
                    color="text-orange-500"
                    bg="bg-orange-100 dark:bg-orange-900/30"
                    trend={{ value: Math.abs(stats.growth?.users || 0), isUp: (stats.growth?.users || 0) >= 0 }}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <SalesChart data={stats.salesByDay} />

                    <div className="bg-white dark:bg-surface-dark rounded-[2rem] border border-slate-100 dark:border-surface-border p-8 shadow-sm">
                        <h3 className="text-lg font-black font-display mb-6">Đơn hàng gần đây</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-surface-border">
                                        <th className="pb-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Mã đơn</th>
                                        <th className="pb-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Khách hàng</th>
                                        <th className="pb-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Tổng tiền</th>
                                        <th className="pb-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-surface-border">
                                    {stats.recentOrders.map((order: any) => (
                                        <tr key={order.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="py-4 font-bold text-slate-900 dark:text-white">#{order.id}</td>
                                            <td className="py-4 text-slate-600 dark:text-slate-300">{order.user.name}</td>
                                            <td className="py-4 font-black text-primary">{order.total.toLocaleString('vi-VN')}₫</td>
                                            <td className="py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                                        order.status === 'shipping' || order.status === 'shipped' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {stats.categoryDistribution && (
                        <CategoryChart data={stats.categoryDistribution} />
                    )}

                    <div className="bg-white dark:bg-surface-dark rounded-[2rem] border border-slate-100 dark:border-surface-border p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black font-display">Bán chạy nhất</h3>
                            <span className="material-symbols-outlined text-primary">trending_up</span>
                        </div>
                        <div className="space-y-4">
                            {stats.topProducts && stats.topProducts.map((p: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <div className="size-10 rounded-lg bg-slate-50 dark:bg-white/5 p-1 flex-shrink-0">
                                        <img src={p.image} alt={p.name} className="size-full object-contain" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{p.name}</h4>
                                        <p className="text-[10px] font-black uppercase text-primary">Đã bán {p.sold}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-surface-dark rounded-[2rem] border border-slate-100 dark:border-surface-border p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black font-display">Sắp hết hàng</h3>
                            <span className="material-symbols-outlined text-orange-500 animate-pulse">warning</span>
                        </div>
                        <div className="space-y-4">
                            {stats.lowStockProducts.length > 0 ? (
                                stats.lowStockProducts.map((p: any) => (
                                    <div key={p.id} className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-transparent hover:border-slate-100 dark:hover:border-white/10 transition-all">
                                        <div className="size-10 rounded-lg bg-white dark:bg-surface-dark p-1 flex-shrink-0">
                                            <img src={p.image} alt={p.name} className="size-full object-contain" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{p.name}</h4>
                                            <p className={`text-[10px] font-black uppercase ${p.stock < 10 ? 'text-red-500' : 'text-orange-500'}`}>Còn {p.stock} sản phẩm</p>
                                        </div>
                                        <button onClick={() => onOpenModal(p)} className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                            <span className="material-symbols-outlined !text-[16px]">add_box</span>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-slate-500 text-center py-4 italic">Kho hàng vẫn đầy đủ</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
