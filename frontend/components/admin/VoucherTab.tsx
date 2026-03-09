import React, { useState } from 'react';
import { Voucher } from '../../types';

interface VoucherTabProps {
    vouchers: Voucher[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    onAddVoucher: () => void;
    onEditVoucher: (voucher: Voucher) => void;
    onDeleteVoucher: (id: number) => void;
    onBulkDelete: (ids: number[]) => void;
    onToggleActive: (id: number, isActive: boolean) => void;
    pagination: any;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

const VoucherTab: React.FC<VoucherTabProps> = ({
    vouchers,
    searchTerm,
    setSearchTerm,
    onAddVoucher,
    onEditVoucher,
    onDeleteVoucher,
    onBulkDelete,
    onToggleActive,
    pagination,
    currentPage,
    setCurrentPage
}) => {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const toggleSelect = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === vouchers.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(vouchers.map(v => v.id));
        }
    };

    const downloadCSV = () => {
        const headers = ['Code', 'Type', 'Discount', 'Min Order', 'Max Discount', 'Start Date', 'End Date', 'Limit', 'Used', 'Active'];
        const csvContent = [
            headers.join(','),
            ...vouchers.map(v => [
                v.code,
                v.type,
                v.discount,
                v.minOrder || 0,
                v.maxDiscount || 0,
                new Date(v.startDate).toLocaleDateString('vi-VN'),
                new Date(v.endDate).toLocaleDateString('vi-VN'),
                v.usageLimit || 'Unlimited',
                v.usageCount,
                v.isActive
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.body.appendChild(document.createElement('a'));
        link.href = URL.createObjectURL(blob);
        link.download = 'techstore_vouchers.csv';
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white dark:bg-surface-dark rounded-[2rem] border border-slate-100 dark:border-surface-border p-8 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div className="space-y-1">
                    <h3 className="text-lg font-black font-display">Quản lý Voucher</h3>
                    <p className="text-xs text-slate-500">Tạo và quản lý các mã giảm giá cho khách hàng</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {selectedIds.length > 0 && (
                        <div className="flex items-center gap-2 animate-in slide-in-from-right-4">
                            <span className="text-xs font-bold text-slate-500">{selectedIds.length} đã chọn</span>
                            <button
                                onClick={() => {
                                    if (window.confirm(`Xóa ${selectedIds.length} voucher đã chọn?`)) {
                                        onBulkDelete(selectedIds);
                                        setSelectedIds([]);
                                    }
                                }}
                                className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
                            >
                                Xóa hàng loạt
                            </button>
                        </div>
                    )}
                    <button
                        onClick={onAddVoucher}
                        className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary-dark transition-all shadow-md shadow-primary/20 active:scale-95"
                    >
                        <span className="material-symbols-outlined !text-[20px]">add_circle</span>
                        Thêm Voucher
                    </button>
                    <button
                        onClick={downloadCSV}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-all flex items-center gap-2 text-xs font-bold"
                    >
                        <span className="material-symbols-outlined !text-[18px]">download</span>
                        Xuất CSV
                    </button>
                    <div className="relative flex-1 md:w-64">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 !text-[20px]">search</span>
                        <input
                            type="text"
                            placeholder="Tìm mã voucher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border focus:border-primary outline-none transition-all text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto -mx-8 px-8">
                <table className="w-full text-left text-sm border-separate border-spacing-y-3">
                    <thead>
                        <tr className="text-slate-400 uppercase tracking-widest text-[10px] font-black">
                            <th className="px-4 pb-2">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.length === vouchers.length && vouchers.length > 0}
                                    onChange={toggleSelectAll}
                                    className="size-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                                />
                            </th>
                            <th className="px-4 pb-2">Mã / Loại</th>
                            <th className="px-4 pb-2">Mức giảm</th>
                            <th className="px-4 pb-2">Thời hạn</th>
                            <th className="px-4 pb-2">Sử dụng</th>
                            <th className="px-4 pb-2">Trạng thái</th>
                            <th className="px-4 pb-2 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vouchers.map((v) => {
                            const isExpired = new Date(v.endDate) < new Date();
                            const isFullyUsed = v.usageLimit !== null && v.usageCount >= v.usageLimit;

                            return (
                                <tr key={v.id} className="group bg-slate-50/50 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white-[0.08] transition-all">
                                    <td className="px-4 py-3 rounded-l-2xl">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(v.id)}
                                            onChange={() => toggleSelect(v.id)}
                                            className="size-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-black text-slate-900 dark:text-white family-display">{v.code}</span>
                                            </div>
                                            <span className="px-2 py-0.5 bg-slate-200/50 dark:bg-white/10 rounded text-[9px] font-black uppercase text-slate-500">
                                                {v.type === 'percentage' ? 'Phần trăm' : 'Cố định'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-black text-primary">
                                        {v.type === 'percentage' ? `${v.discount}%` : `${v.discount.toLocaleString()}₫`}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                            {new Date(v.startDate).toLocaleDateString('vi-VN')} - {new Date(v.endDate).toLocaleDateString('vi-VN')}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="space-y-1">
                                            <div className="w-24 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all ${isFullyUsed ? 'bg-red-500' : 'bg-primary'}`}
                                                    style={{ width: v.usageLimit ? `${(v.usageCount / v.usageLimit) * 100}%` : '0%' }}
                                                />
                                            </div>
                                            <p className="text-[9px] font-bold text-slate-400">{v.usageCount} / {v.usageLimit || '∞'}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => onToggleActive(v.id, !v.isActive)}
                                            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${isExpired ? 'bg-slate-100 text-slate-400' :
                                                v.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                }`}
                                        >
                                            {isExpired ? 'Hết hạn' : v.isActive ? 'Kích hoạt' : 'Tạm dừng'}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 rounded-r-2xl text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => onEditVoucher(v)}
                                                className="size-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all"
                                                title="Chỉnh sửa"
                                            >
                                                <span className="material-symbols-outlined !text-[18px]">edit</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm('Xóa voucher này?')) onDeleteVoucher(v.id);
                                                }}
                                                className="size-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                                title="Xóa"
                                            >
                                                <span className="material-symbols-outlined !text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100 dark:border-surface-border">
                    <p className="text-xs text-slate-500">
                        Hiển thị trang {pagination.page} trên tổng {pagination.totalPages} trang ({pagination.total} voucher)
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
                                    ? 'bg-primary text-white'
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

export default VoucherTab;
