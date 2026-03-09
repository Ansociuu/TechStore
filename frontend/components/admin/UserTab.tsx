import React from 'react';
import { User } from '../../types';

interface UserTabProps {
    users: User[];
    currentUser: User | null;
    searchUserTerm: string;
    setSearchUserTerm: (term: string) => void;
    onUpdateUserRole: (userId: number, role: string) => void;
    onDeleteUser: (userId: number) => void;
    onBulkDeleteUsers: (ids: number[]) => void;
    pagination: any;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

const UserTab: React.FC<UserTabProps> = ({
    users,
    currentUser,
    searchUserTerm,
    setSearchUserTerm,
    onUpdateUserRole,
    onDeleteUser,
    onBulkDeleteUsers,
    pagination,
    currentPage,
    setCurrentPage
}) => {
    const [selectedIds, setSelectedIds] = React.useState<number[]>([]);

    const toggleSelect = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === users.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(users.map(u => u.id));
        }
    };

    const downloadCSV = () => {
        const headers = ['User ID', 'Name', 'Email', 'Role', 'Joined Date'];
        const csvContent = [
            headers.join(','),
            ...users.map(u => [
                u.id,
                `"${u.name}"`,
                u.email,
                u.role,
                new Date(u.createdAt || '').toLocaleDateString('vi-VN')
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'techstore_users.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white dark:bg-surface-dark rounded-[2rem] border border-slate-100 dark:border-surface-border p-8 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div className="space-y-1">
                    <h3 className="text-lg font-black font-display">Quản lý người dùng</h3>
                    <p className="text-xs text-slate-500">Xem danh sách và phân quyền thành viên</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    {selectedIds.length > 0 && (
                        <div className="flex items-center gap-2 animate-in slide-in-from-right-4">
                            <span className="text-xs font-bold text-slate-500">{selectedIds.length} đã chọn</span>
                            <button
                                onClick={() => {
                                    if (window.confirm(`Xóa ${selectedIds.length} người dùng đã chọn?`)) {
                                        onBulkDeleteUsers(selectedIds);
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
                            placeholder="Tìm tên hoặc email..."
                            value={searchUserTerm}
                            onChange={(e) => setSearchUserTerm(e.target.value)}
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
                                    checked={selectedIds.length === users.length && users.length > 0}
                                    onChange={toggleSelectAll}
                                    className="size-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                                />
                            </th>
                            <th className="px-4 pb-2">Người dùng</th>
                            <th className="px-4 pb-2">Email</th>
                            <th className="px-4 pb-2">Vai trò</th>
                            <th className="px-4 pb-2">Ngày tạo</th>
                            <th className="px-4 pb-2 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id} className="group bg-slate-50/50 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white-[0.08] transition-all">
                                <td className="px-4 py-3 rounded-l-2xl">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(u.id)}
                                        onChange={() => toggleSelect(u.id)}
                                        className="size-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm uppercase border border-primary/5">
                                            {u.name.charAt(0)}
                                        </div>
                                        <span className="font-bold text-slate-900 dark:text-white">{u.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-slate-500 text-xs font-medium">{u.email}</td>
                                <td className="px-4 py-3">
                                    <select
                                        value={u.role}
                                        onChange={(e) => onUpdateUserRole(u.id, e.target.value)}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-transparent outline-none cursor-pointer transition-all ${u.role === 'admin' ? 'bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400' : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400'
                                            }`}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="px-4 py-3 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                    {new Date(u.createdAt || '').toLocaleDateString('vi-VN')}
                                </td>
                                <td className="px-4 py-3 rounded-r-2xl text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onDeleteUser(u.id)}
                                            disabled={u.id === currentUser?.id}
                                            className={`size-8 rounded-lg flex items-center justify-center transition-all ${u.id === currentUser?.id ? 'opacity-20 cursor-not-allowed text-slate-400' : 'text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white'
                                                }`}
                                            title="Xóa người dùng"
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
                        Hiển thị trang {pagination.page} trên tổng {pagination.totalPages} trang ({pagination.total} người dùng)
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

export default UserTab;
