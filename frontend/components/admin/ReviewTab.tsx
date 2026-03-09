import React, { useState } from 'react';
import { Review } from '../../types';

interface ReviewTabProps {
    reviews: any[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    ratingFilter: string;
    setRatingFilter: (rating: string) => void;
    onDeleteReview: (id: number) => void;
    onBulkDelete: (ids: number[]) => void;
    pagination: any;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

const ReviewTab: React.FC<ReviewTabProps> = ({
    reviews,
    searchTerm,
    setSearchTerm,
    ratingFilter,
    setRatingFilter,
    onDeleteReview,
    onBulkDelete,
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
        if (selectedIds.length === reviews.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(reviews.map(r => r.id));
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <span
                        key={i}
                        className={`material-symbols-outlined !text-[14px] ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                            }`}
                    >
                        star
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-surface-dark rounded-[2rem] border border-slate-100 dark:border-surface-border p-8 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div className="space-y-1">
                    <h3 className="text-lg font-black font-display">Quản lý Đánh giá</h3>
                    <p className="text-xs text-slate-500">Theo dõi và kiểm duyệt phản hồi từ khách hàng</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {selectedIds.length > 0 && (
                        <div className="flex items-center gap-2 animate-in slide-in-from-right-4">
                            <span className="text-xs font-bold text-slate-500">{selectedIds.length} đã chọn</span>
                            <button
                                onClick={() => {
                                    if (window.confirm(`Xóa ${selectedIds.length} đánh giá đã chọn?`)) {
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
                    <select
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value)}
                        className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border text-xs font-bold outline-none cursor-pointer"
                    >
                        <option value="all">Tất cả sao</option>
                        <option value="5">5 sao</option>
                        <option value="4">4 sao</option>
                        <option value="3">3 sao</option>
                        <option value="2">2 sao</option>
                        <option value="1">1 sao</option>
                    </select>
                    <div className="relative flex-1 md:w-64">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 !text-[20px]">search</span>
                        <input
                            type="text"
                            placeholder="Tìm nội dung bình luận..."
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
                                    checked={selectedIds.length === reviews.length && reviews.length > 0}
                                    onChange={toggleSelectAll}
                                    className="size-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                                />
                            </th>
                            <th className="px-4 pb-2">Người dùng</th>
                            <th className="px-4 pb-2">Sản phẩm</th>
                            <th className="px-4 pb-2">Đánh giá</th>
                            <th className="px-4 pb-2">Nội dung</th>
                            <th className="px-4 pb-2">Ngày tạo</th>
                            <th className="px-4 pb-2 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map((r) => (
                            <tr key={r.id} className="group bg-slate-50/50 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white-[0.08] transition-all">
                                <td className="px-4 py-3 rounded-l-2xl">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(r.id)}
                                        onChange={() => toggleSelect(r.id)}
                                        className="size-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-lg bg-primary/10 overflow-hidden border border-primary/5">
                                            {r.user.avatar ? (
                                                <img src={r.user.avatar} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-black text-[10px] text-primary">
                                                    {r.user.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="font-bold text-slate-900 dark:text-white text-xs">{r.user.name}</p>
                                            <p className="text-[10px] text-slate-500 truncate max-w-[120px]">{r.user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <img src={r.product.image} alt="" className="size-8 rounded shadow-sm object-cover" />
                                        <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate max-w-[150px]">{r.product.name}</p>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    {renderStars(r.rating)}
                                </td>
                                <td className="px-4 py-3">
                                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium line-clamp-2 max-w-[300px]" title={r.comment}>
                                        {r.comment}
                                    </p>
                                </td>
                                <td className="px-4 py-3 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                    {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                                </td>
                                <td className="px-4 py-3 rounded-r-2xl text-right">
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Xóa đánh giá này?')) onDeleteReview(r.id);
                                        }}
                                        className="size-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                        title="Xóa đánh giá"
                                    >
                                        <span className="material-symbols-outlined !text-[18px]">delete</span>
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
                        Hiển thị trang {pagination.page} trên tổng {pagination.totalPages} trang ({pagination.total} đánh giá)
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

export default ReviewTab;
