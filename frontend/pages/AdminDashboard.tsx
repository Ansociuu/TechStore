import React, { useState, useEffect } from 'react';
import { Page, Product, Order, User } from '../types';
import { adminAPI, productAPI, orderAPI } from '../services/apiService';

interface AdminDashboardProps {
  user: User | null;
  onNavigate: (page: Page) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'users'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchUserTerm, setSearchUserTerm] = useState('');
  const [searchOrderTerm, setSearchOrderTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // States for Product Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    stock: 0
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      onNavigate(Page.HOME);
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, productsData, ordersData, usersData] = await Promise.all([
        adminAPI.getStats(),
        productAPI.getAll({ page: currentPage, limit: 10, search: searchTerm }),
        orderAPI.getAllAdmin(),
        adminAPI.getUsers()
      ]);
      setStats(statsData);
      setProducts(productsData.products);
      setPagination(productsData.pagination);
      setOrders(ordersData);
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm]);

  const handleOpenModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        category: product.category,
        image: product.image,
        stock: product.stock || 0
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: '',
        image: '',
        stock: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productAPI.update(editingProduct.id, formData);
        alert('Cập nhật sản phẩm thành công');
      } else {
        await productAPI.create(formData);
        alert('Thêm sản phẩm thành công');
      }
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Lỗi khi lưu sản phẩm');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await productAPI.delete(id);
        setProducts(products.filter(p => p.id !== id));
        fetchData();
      } catch (error) {
        alert('Xóa sản phẩm thất bại');
      }
    }
  };

  const handleUpdateUserRole = async (userId: number, newRole: string) => {
    try {
      await adminAPI.updateUserRole(userId, newRole);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
    } catch (error) {
      alert('Cập nhật vai trò thất bại');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const result = await adminAPI.uploadImage(file);
      setFormData({ ...formData, image: result.url });
    } catch (error) {
      alert('Upload ảnh thất bại. Hãy kiểm tra lại cấu hình Cloudinary.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await adminAPI.deleteUser(userId);
        setUsers(users.filter(u => u.id !== userId));
      } catch (error) {
        alert('Xóa người dùng thất bại');
      }
    }
  };

  // Helper to draw SVG Chart
  const RenderChart = ({ data }: { data: any[] }) => {
    if (!data || data.length === 0) return null;
    const maxVal = Math.max(...data.map(d => d.count), 5);
    const height = 150;
    const width = 400;
    const padding = 20;

    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
      const y = height - (d.count / maxVal) * (height - 2 * padding) - padding;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="w-full bg-slate-50 dark:bg-white/5 rounded-[2rem] p-6 border border-slate-100 dark:border-surface-border">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Đơn hàng 7 ngày qua</h4>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-primary"></span>
            <span className="text-[10px] font-bold text-slate-500">Số lượng đơn</span>
          </div>
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => (
            <line
              key={idx}
              x1={padding} y1={height - padding - p * (height - 2 * padding)}
              x2={width - padding} y2={height - padding - p * (height - 2 * padding)}
              stroke="currentColor" className="text-slate-200 dark:text-white/10" strokeWidth="1" strokeDasharray="4"
            />
          ))}
          {/* Path */}
          <polyline
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            className="drop-shadow-lg"
          />
          {/* Area under line */}
          <path
            d={`M${padding},${height - padding} ${points} L${width - padding},${height - padding} Z`}
            fill="url(#area-gradient)"
            className="opacity-40"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Points */}
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
            const y = height - (d.count / maxVal) * (height - 2 * padding) - padding;
            return (
              <g key={i} className="group/dot">
                <circle cx={x} cy={y} r="4" className="fill-primary transition-all" />
                <text x={x} y={height - 5} className="text-[8px] fill-slate-400" textAnchor="middle">{d.date}</text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full size-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm">Chào mừng quay trở lại, {user?.name}</p>
        </div>
        <button
          onClick={() => onNavigate(Page.HOME)}
          className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-surface-dark text-xs font-bold hover:bg-slate-200 transition-colors"
        >
          Về trang chủ
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-surface-dark rounded-2xl w-fit overflow-x-auto max-w-full">
        {[
          { id: 'overview', label: 'Tổng quan', icon: 'dashboard' },
          { id: 'products', label: 'Sản phẩm', icon: 'inventory_2' },
          { id: 'orders', label: 'Đơn hàng', icon: 'shopping_bag' },
          { id: 'users', label: 'Người dùng', icon: 'group' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === tab.id
              ? 'bg-white dark:bg-surface-light text-primary shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <span className="material-symbols-outlined !text-[18px]">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && stats && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Doanh thu', value: `${(stats.totalRevenue || 0).toLocaleString('vi-VN')}₫`, icon: 'payments', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
              { label: 'Tổng đơn hàng', value: stats.totalOrders, icon: 'shopping_cart', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
              { label: 'Tổng tồn kho', value: stats.totalStock, icon: 'inventory', color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
              { label: 'Người dùng', value: stats.totalUsers, icon: 'group', color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-surface-dark p-6 rounded-[2rem] border border-slate-100 dark:border-surface-border shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className={`size-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <RenderChart data={stats.salesByDay} />

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
                        <button onClick={() => handleOpenModal(p)} className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                          <span className="material-symbols-outlined !text-[16px]">add_box</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-4 italic">Kho hàng vẫn đầy đủ</p>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary to-blue-600 rounded-[2rem] p-8 text-white shadow-xl shadow-primary/20">
                <h3 className="text-lg font-black font-display mb-2">Đăng tin khuyến mãi</h3>
                <p className="text-xs text-white/70 mb-6 leading-relaxed">Tiếp cận khách hàng mục tiêu bằng những gợi ý sản phẩm phù hợp được hỗ trợ bởi AI.</p>
                <button className="w-full py-4 bg-white/20 hover:bg-white/30 rounded-2xl font-black uppercase tracking-widest text-[10px] backdrop-blur-md transition-all border border-white/20">
                  Tạo chiến dịch AI
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Tab Content */}
      {activeTab === 'products' && (
        <div className="bg-white dark:bg-surface-dark rounded-[2rem] border border-slate-100 dark:border-surface-border p-8 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="space-y-1">
              <h3 className="text-lg font-black font-display">Quản lý sản phẩm</h3>
              <p className="text-xs text-slate-500">Tìm kiếm và quản lý kho hàng của bạn</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
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
                onClick={() => handleOpenModal()}
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
                  <th className="px-4 pb-2">Sản phẩm</th>
                  <th className="px-4 pb-2">Danh mục</th>
                  <th className="px-4 pb-2">Giá bán</th>
                  <th className="px-4 pb-2">Tồn kho</th>
                  <th className="px-4 pb-2 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(product => (
                    <tr key={product.id} className="group bg-slate-50/50 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white-[0.08] transition-all">
                      <td className="px-4 py-3 rounded-l-2xl">
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
                            onClick={() => handleOpenModal(product)}
                            className="size-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all"
                            title="Sửa"
                          >
                            <span className="material-symbols-outlined !text-[18px]">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
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

          {/* Phân trang sản phẩm */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100 dark:border-surface-border">
              <p className="text-xs text-slate-500">
                Hiển thị trang {pagination.page} trên tổng {pagination.totalPages} trang ({pagination.totalProducts} sản phẩm)
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                  disabled={currentPage === pagination.totalPages}
                  className="size-8 rounded-lg flex items-center justify-center bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <span className="material-symbols-outlined !text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Users Tab Content */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-surface-dark rounded-[2rem] border border-slate-100 dark:border-surface-border p-8 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="space-y-1">
              <h3 className="text-lg font-black font-display">Quản lý người dùng</h3>
              <p className="text-xs text-slate-500">Xem danh sách và phân quyền thành viên</p>
            </div>
            <div className="relative w-full md:w-64">
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

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-surface-border">
                  <th className="pb-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Người dùng</th>
                  <th className="pb-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Email</th>
                  <th className="pb-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Vai trò</th>
                  <th className="pb-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Ngày tạo</th>
                  <th className="pb-4 font-black text-slate-400 uppercase tracking-widest text-[10px] text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-surface-border">
                {users
                  .filter(u => u.name.toLowerCase().includes(searchUserTerm.toLowerCase()) || u.email.toLowerCase().includes(searchUserTerm.toLowerCase()))
                  .map((u) => (
                    <tr key={u.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                            {u.name.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-slate-500">{u.email}</td>
                      <td className="py-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                          className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest border border-transparent outline-none cursor-pointer transition-all ${u.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'
                            }`}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-4 text-slate-500 text-xs">
                        {new Date(u.createdAt || '').toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          disabled={u.id === user?.id}
                          className={`size-8 rounded-lg flex items-center justify-center transition-all ${u.id === user?.id ? 'opacity-20 cursor-not-allowed text-slate-400' : 'text-red-500 hover:bg-red-500 hover:text-white'
                            }`}
                        >
                          <span className="material-symbols-outlined !text-[18px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab Content */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-surface-dark rounded-[2rem] border border-slate-100 dark:border-surface-border p-8 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="space-y-1">
              <h3 className="text-lg font-black font-display">Tất cả đơn hàng</h3>
              <p className="text-xs text-slate-500">Theo dõi và cập nhật trạng thái đơn hàng</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
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
                className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border focus:border-primary outline-none text-xs font-bold"
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

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-separate border-spacing-y-2">
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
                    <tr key={order.id} className="group bg-slate-50/30 dark:bg-white-[0.02] hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                      <td className="px-4 py-4 rounded-l-2xl font-bold text-slate-900 dark:text-white">#{order.id}</td>
                      <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{order.user?.name || 'Guest'}</td>
                      <td className="px-4 py-4 text-slate-500 text-xs">{new Date(order.date || order.createdAt || '').toLocaleDateString('vi-VN')}</td>
                      <td className="px-4 py-4 font-black text-primary">{order.total.toLocaleString('vi-VN')}₫</td>
                      <td className="px-4 py-4">
                        <select
                          value={order.status}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            try {
                              const numericId = typeof order.id === 'string' ? parseInt(order.id.replace(/\D/g, '')) : order.id;
                              await orderAPI.updateStatus(numericId, newStatus);
                              setOrders(orders.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
                            } catch (err) {
                              alert('Cập nhật trạng thái thất bại');
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-surface-border outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer transition-all ${order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                              order.status === 'shipped' || order.status === 'shipping' ? 'bg-blue-100 text-blue-600' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
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
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsOrderDetailOpen(true);
                          }}
                          className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {isOrderDetailOpen && selectedOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-surface-dark w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-slate-100 dark:border-surface-border">
            <div className="p-8 border-b border-slate-100 dark:border-surface-border flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
              <div>
                <h3 className="text-xl font-black font-display">Chi tiết đơn hàng #{selectedOrder.id}</h3>
                <p className="text-xs text-slate-500 mt-1">Đặt lúc: {new Date(selectedOrder.date || (selectedOrder as any).createdAt).toLocaleString('vi-VN')}</p>
              </div>
              <button
                onClick={() => setIsOrderDetailOpen(false)}
                className="size-10 rounded-full hover:bg-white dark:hover:bg-white/10 flex items-center justify-center transition-all active:scale-90"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thông tin khách hàng</h4>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white">{selectedOrder.user?.name}</p>
                    <p className="text-sm text-slate-500">{selectedOrder.user?.email}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trạng thái</h4>
                  <div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-600' :
                      selectedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                        selectedOrder.status === 'shipped' || selectedOrder.status === 'shipping' ? 'bg-blue-100 text-blue-600' :
                          selectedOrder.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Danh sách sản phẩm</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border">
                      <div className="size-16 rounded-xl bg-white dark:bg-surface-dark p-2 flex-shrink-0 border border-slate-50 dark:border-surface-border">
                        <img src={item.image} alt={item.name} className="size-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-slate-900 dark:text-white truncate">{item.name}</h5>
                        <p className="text-xs text-slate-500">{item.quantity} x {item.price?.toLocaleString('vi-VN')}₫</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-primary">{(item.quantity * (item.price || 0)).toLocaleString('vi-VN')}₫</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-surface-border flex justify-between items-center">
                <p className="text-lg font-black font-display">Tổng cộng</p>
                <div className="text-right">
                  <p className="text-2xl font-black text-primary">{selectedOrder.total.toLocaleString('vi-VN')}₫</p>
                  <p className="text-[10px] text-slate-400">Đã bao gồm thuế và phí vận chuyển</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-surface-border">
              <button
                onClick={() => setIsOrderDetailOpen(false)}
                className="w-full py-4 rounded-2xl bg-slate-200 dark:bg-white/10 font-bold hover:bg-slate-300 dark:hover:bg-white/20 transition-all active:scale-95 text-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-surface-dark w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-slate-100 dark:border-surface-border">
            <div className="p-8 border-b border-slate-100 dark:border-surface-border flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
              <h3 className="text-xl font-black font-display">{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
              <button
                onClick={handleCloseModal}
                className="size-10 rounded-full hover:bg-white dark:hover:bg-white/10 flex items-center justify-center transition-all active:scale-90"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Tên sản phẩm</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Danh mục</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Smartphone">Smartphone</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Âm thanh">Âm thanh</option>
                    <option value="Smartwatch">Smartwatch</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Phụ kiện">Phụ kiện</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Giá (₫)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Số lượng kho</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Ảnh sản phẩm</label>
                  <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-surface-border group hover:border-primary/50 transition-all">
                    <div className="size-32 rounded-2xl bg-white dark:bg-surface-dark p-2 border border-slate-100 dark:border-surface-border flex-shrink-0 relative overflow-hidden flex items-center justify-center">
                      {formData.image ? (
                        <>
                          <img src={formData.image} alt="Preview" className="size-full object-contain" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, image: '' })}
                              className="size-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all"
                            >
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        <span className="material-symbols-outlined text-slate-300 !text-4xl">image</span>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-white/80 dark:bg-surface-dark/80 flex items-center justify-center">
                          <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <p className="text-xs text-slate-500 leading-relaxed">Tải lên ảnh sản phẩm của bạn. Hỗ trợ định dạng JPG, PNG, WEBP. Tối đa 5MB.</p>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/*"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={isUploading}
                          onClick={() => fileInputRef.current?.click()}
                          className="px-5 py-2.5 bg-white dark:bg-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-white/20 transition-all border border-slate-200 dark:border-surface-border shadow-sm active:scale-95 disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined !text-[18px]">cloud_upload</span>
                          Chọn ảnh từ máy
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const url = prompt('Nhập URL ảnh:');
                            if (url) setFormData({ ...formData, image: url });
                          }}
                          className="px-4 py-2.5 text-slate-500 hover:text-primary rounded-xl text-xs font-bold transition-all"
                        >
                          Dùng URL ảnh
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Mô tả</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all resize-none"
                  ></textarea>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-white/10 font-bold hover:bg-slate-200 dark:hover:bg-white/20 transition-all active:scale-95 text-sm"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary-dark shadow-lg shadow-primary/25 transition-all active:scale-95 text-sm"
                >
                  {editingProduct ? 'Cập nhật sản phẩm' : 'Thêm mới sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
