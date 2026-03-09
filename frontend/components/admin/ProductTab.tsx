import React from 'react';
import { Product } from '../../types';

interface ProductTabProps {
    products: Product[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    onOpenModal: (product?: Product) => void;
    onDeleteProduct: (id: string) => void;
    onBulkDelete: (ids: string[]) => void;
    pagination: any;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

const ProductTab: React.FC<ProductTabProps> = ({
    products,
    searchTerm,
    setSearchTerm,
    onOpenModal,
    onDeleteProduct,
    onBulkDelete,
    pagination,
    currentPage,
    setCurrentPage
}) => {
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === products.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(products.map(p => p.id.toString()));
        }
    };

    const downloadCSV = () => {
        const headers = ['Product ID', 'Name', 'Category', 'Price', 'Stock'];
        const csvContent = [
            headers.join(','),
            ...products.map(p => [
                p.id,
                `"${p.name}"`,
                p.category,
                p.price,
                p.stock
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'techstore_products.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white dark:bg-surface-dark rounded-[2rem] border border-slate-100 dark:border-surface-border p-8 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div className="space-y-1">
                    <h3 className="text-lg font-black font-display">Quản lý sản phẩm</h3>
                    <p className="text-xs text-slate-500">Tìm kiếm và quản lý kho hàng của bạn</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    {selectedIds.length > 0 && (
                        <div className="flex items-center gap-2 animate-in slide-in-from-right-4">
                            <span className="text-xs font-bold text-slate-500">{selectedIds.length} đã chọn</span>
                            <button
                                onClick={() => {
                                    if (window.confirm(`Xóa ${selectedIds.length} sản phẩm đã chọn?`)) {
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
                        onClick={downloadCSV}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-all flex items-center gap-2 text-xs font-bold whitespace-nowrap"
                    >
                        <span className="material-symbols-outlined !text-[18px]">download</span>
                        Xuất CSV
                    </button>
                    <div className="relative flex-1 md:w-64">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 !text-[20px]">search</span>
                        <input
                            type="text"
                            placeholder="Tìm tên sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border focus:border-primary outline-none transition-all text-sm"
                        />
                    </div>
                    <button
                        onClick={() => onOpenModal()}
                        className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 active:scale-95 whitespace-nowrap"
                    >
                        <span className="material-symbols-outlined !text-[18px]">add</span>
                        Thêm mới
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto -mx-8 px-8">
                <table className="w-full text-left text-sm border-separate border-spacing-y-3">
                    <thead>
                        <tr className="text-slate-400 uppercase tracking-widest text-[10px] font-black">
                            <th className="px-4 pb-2">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.length === products.length && products.length > 0}
                                    onChange={toggleSelectAll}
                                    className="size-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                                />
                            </th>
                            <th className="px-4 pb-2">Sản phẩm</th>
                            <th className="px-4 pb-2">Danh mục</th>
                            <th className="px-4 pb-2">Giá bán</th>
                            <th className="px-4 pb-2">Tồn kho</th>
                            <th className="px-4 pb-2 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className={`group bg-slate-50/50 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white-[0.08] transition-all ${selectedIds.includes(product.id.toString()) ? 'bg-primary/5 dark:bg-primary/10' : ''}`}>
                                <td className="px-4 py-3 rounded-l-2xl">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(product.id.toString())}
                                        onChange={() => toggleSelect(product.id.toString())}
                                        className="size-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-xl bg-white dark:bg-surface-dark p-2 flex-shrink-0 border border-slate-100 dark:border-surface-border">
                                            <img src={product.image} alt={product.name} className="size-full object-contain" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{product.name}</h4>
                                            <p className="text-[10px] text-slate-500 font-medium">ID: #{product.id.toString().slice(-4)}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="px-4 py-3 font-black text-primary">
                                    {product.price.toLocaleString('vi-VN')}₫
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-1.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${product.stock && product.stock < 10 ? 'bg-orange-500' : 'bg-green-500'}`}
                                                style={{ width: `${Math.min((product.stock || 0) * 2, 100)}%` }}
                                            ></div>
                                        </div>
                                        <span className={`text-xs font-bold ${product.stock && product.stock < 10 ? 'text-orange-500' : 'text-slate-600 dark:text-slate-400'}`}>
                                            {product.stock || 0}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 rounded-r-2xl text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onOpenModal(product)}
                                            className="size-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all"
                                            title="Sửa"
                                        >
                                            <span className="material-symbols-outlined !text-[18px]">edit</span>
                                        </button>
                                        <button
                                            onClick={() => onDeleteProduct(product.id)}
                                            className="size-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                            title="Xóa"
                                        >
                                            <span className="material-symbols-outlined !text-[18px]">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100 dark:border-surface-border">
                    <p className="text-xs text-slate-500">
                        Hiển thị trang {pagination.page} trên tổng {pagination.totalPages} trang ({pagination.totalProducts} sản phẩm)
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

export default ProductTab;
