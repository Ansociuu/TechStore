import React from 'react';
import { Order } from '../../types';

interface OrderTabProps {
    orders: Order[];
    searchOrderTerm: string;
    setSearchOrderTerm: (term: string) => void;
    statusFilter: string;
    setStatusFilter: (filter: string) => void;
    onUpdateStatus: (id: number, status: string) => Promise<void>;
    onOpenDetail: (order: Order) => void;
    pagination: any;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

const OrderTab: React.FC<OrderTabProps> = ({
    orders,
    searchOrderTerm,
    setSearchOrderTerm,
    statusFilter,
    setStatusFilter,
    onUpdateStatus,
    onOpenDetail,
    pagination,
    currentPage,
    setCurrentPage
}) => {
    const downloadCSV = () => {
        const headers = ['Order ID', 'Customer', 'Date', 'Total', 'Status'];
        const csvContent = [
            headers.join(','),
            ...orders.map(o => [
                o.id,
                o.user?.name || 'Guest',
                new Date(o.date || o.createdAt || '').toLocaleDateString('vi-VN'),
                o.total,
                o.status
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    return (
        <div className="bg-white dark:bg-surface-dark rounded-[2rem] border border-slate-100 dark:border-surface-border p-8 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div className="space-y-1">
                    <h3 className="text-lg font-black font-display">Quản lý đơn hàng</h3>
                    <p className="text-xs text-slate-500">Theo dõi và cập nhật trạng thái đơn hàng</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={downloadCSV}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 rounded-xl text-xs font-bold transition-all text-slate-600 dark:text-slate-300 border border-transparent"
                    >
                        <span className="material-symbols-outlined !text-[18px]">download</span>
                        Xuất file CSV
                    </button>
                    <div className="relative flex-1 md:w-64">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 !text-[20px]">search</span>
                        <input
                            type="text"
                            placeholder="Mã đơn hoặc khách hàng..."
                            value={searchOrderTerm}
                            onChange={(e) => setSearchOrderTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border focus:border-primary outline-none transition-all text-sm"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border focus:border-primary outline-none text-xs font-bold cursor-pointer"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="pending">Chờ xử lý</option>
                        <option value="processing">Đang xử lý</option>
                        <option value="shipped">Đang giao</option>
                        <option value="delivered">Đã giao</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto -mx-8 px-8">
                <table className="w-full text-left text-sm border-separate border-spacing-y-3">
                    <thead>
                        <tr className="text-slate-400 uppercase tracking-widest text-[10px] font-black">
                            <th className="px-4 pb-2">Mã đơn</th>
                            <th className="px-4 pb-2">Khách hàng</th>
                            <th className="px-4 pb-2">Ngày đặt</th>
                            <th className="px-4 pb-2">Tổng tiền</th>
                            <th className="px-4 pb-2">Trạng thái</th>
                            <th className="px-4 pb-2 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders
                            .filter(o => {
                                const matchesSearch = o.id.toString().includes(searchOrderTerm) || (o as any).user?.name.toLowerCase().includes(searchOrderTerm.toLowerCase());
                                const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
                                return matchesSearch && matchesStatus;
                            })
                            .map((order) => (
                                <tr key={order.id} className="group bg-slate-50/50 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white-[0.08] transition-all">
                                    <td className="px-4 py-4 rounded-l-2xl font-bold text-slate-900 dark:text-white">#{order.id}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-700 dark:text-slate-200">{order.user?.name || 'Guest'}</span>
                                            <span className="text-[10px] text-slate-400 font-medium">{order.user?.email || ''}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                        {new Date(order.date || order.createdAt || '').toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-4 py-4 font-black text-primary text-base">
                                        {order.total.toLocaleString('vi-VN')}₫
                                    </td>
                                    <td className="px-4 py-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => {
                                                const numericId = typeof order.id === 'string' ? parseInt(order.id.replace(/\D/g, '')) : order.id;
                                                onUpdateStatus(numericId, e.target.value);
                                            }}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-transparent outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer transition-all ${order.status === 'delivered' ? 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400' :
                                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400' :
                                                    order.status === 'shipped' || order.status === 'shipping' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' :
                                                        order.status === 'cancelled' ? 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400' : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400'
                                                }`}
                                        >
                                            <option value="pending">Chờ xử lý</option>
                                            <option value="processing">Đang xử lý</option>
                                            <option value="shipped">Đang giao</option>
                                            <option value="delivered">Đã giao</option>
                                            <option value="cancelled">Đã hủy</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-4 rounded-r-2xl text-right">
                                        <button
                                            onClick={() => onOpenDetail(order)}
                                            className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-primary/20"
                                        >
                                            Chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100 dark:border-surface-border">
                    <p className="text-xs text-slate-500">
                        Hiển thị trang {pagination.page} trên tổng {pagination.totalPages} trang ({pagination.total} đơn hàng)
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                            disabled={currentPage === 1}
                            className="size-8 rounded-lg flex items-center justify-center bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <span className="material-symbols-outlined !text-[18px]">chevron_left</span>
                        </button>

                        {[...Array(pagination.totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`size-8 rounded-lg text-xs font-bold transition-all ${currentPage === i + 1
                                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                                    : 'bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(Math.min(currentPage + 1, pagination.totalPages))}
                            disabled={currentPage === pagination.totalPages}
                            className="size-8 rounded-lg flex items-center justify-center bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <span className="material-symbols-outlined !text-[18px]">chevron_right</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderTab;
