import React, { useState, useEffect } from 'react';
import { adminAPI, productAPI, orderAPI } from '../services/apiService';
import OverviewTab from '../components/admin/OverviewTab';
import ProductTab from '../components/admin/ProductTab';
import OrderTab from '../components/admin/OrderTab';
import UserTab from '../components/admin/UserTab';
import VoucherTab from '../components/admin/VoucherTab';
import ReviewTab from '../components/admin/ReviewTab';
import { StatsSkeleton, TableSkeleton } from '../components/admin/Skeleton';
import { Page, Product, Order, User, Voucher } from '../types';

interface AdminDashboardProps {
  user: User | null;
  onNavigate: (page: Page) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'users' | 'vouchers' | 'reviews'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);
  const [orderPagination, setOrderPagination] = useState<any>(null);
  const [userPagination, setUserPagination] = useState<any>(null);
  const [voucherPagination, setVoucherPagination] = useState<any>(null);
  const [reviewPagination, setReviewPagination] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [voucherPage, setVoucherPage] = useState(1);
  const [reviewPage, setReviewPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchUserTerm, setSearchUserTerm] = useState('');
  const [searchOrderTerm, setSearchOrderTerm] = useState('');
  const [searchVoucherTerm, setSearchVoucherTerm] = useState('');
  const [searchReviewTerm, setSearchReviewTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
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

  // States for Voucher Modal
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [voucherFormData, setVoucherFormData] = useState({
    code: '',
    discount: 0,
    type: 'percentage' as 'percentage' | 'fixed',
    minOrder: 0,
    maxDiscount: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: 0,
    isActive: true
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
      const [statsData, productsData, ordersData, usersData, vouchersData, reviewsData] = await Promise.all([
        adminAPI.getStats(),
        productAPI.getAll({ page: currentPage, limit: 10, search: searchTerm }),
        orderAPI.getAllAdmin({ page: orderPage, limit: 10 }),
        adminAPI.getUsers({ page: userPage, limit: 10 }),
        adminAPI.getVouchers({ page: voucherPage, limit: 10, search: searchVoucherTerm }),
        adminAPI.getReviews({
          page: reviewPage,
          limit: 10,
          search: searchReviewTerm,
          rating: ratingFilter === 'all' ? undefined : Number(ratingFilter)
        })
      ]);
      setStats(statsData);
      setProducts(productsData.products);
      setPagination(productsData.pagination);
      setOrders(ordersData.orders);
      setOrderPagination(ordersData.pagination);
      setUsers(usersData.users);
      setUserPagination(usersData.pagination);
      setVouchers(vouchersData.vouchers);
      setVoucherPagination(vouchersData.pagination);
      setReviews(reviewsData.reviews);
      setReviewPagination(reviewsData.pagination);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, orderPage, userPage, voucherPage, reviewPage, searchTerm, searchVoucherTerm, searchReviewTerm, ratingFilter]);

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

  const handleOpenVoucherModal = (voucher: Voucher | null = null) => {
    if (voucher) {
      setEditingVoucher(voucher);
      setVoucherFormData({
        code: voucher.code,
        discount: voucher.discount,
        type: voucher.type,
        minOrder: voucher.minOrder || 0,
        maxDiscount: voucher.maxDiscount || 0,
        startDate: new Date(voucher.startDate).toISOString().split('T')[0],
        endDate: new Date(voucher.endDate).toISOString().split('T')[0],
        usageLimit: voucher.usageLimit || 0,
        isActive: voucher.isActive
      });
    } else {
      setEditingVoucher(null);
      setVoucherFormData({
        code: '',
        discount: 0,
        type: 'percentage',
        minOrder: 0,
        maxDiscount: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        usageLimit: 0,
        isActive: true
      });
    }
    setIsVoucherModalOpen(true);
  };

  const handleVoucherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVoucher) {
        await adminAPI.updateVoucher(editingVoucher.id, voucherFormData);
        alert('Cập nhật voucher thành công');
      } else {
        await adminAPI.createVoucher(voucherFormData);
        alert('Thêm voucher thành công');
      }
      setIsVoucherModalOpen(false);
      fetchData();
    } catch (error) {
      alert('Lỗi khi lưu voucher');
    }
  };

  const handleDeleteVoucher = async (id: number) => {
    try {
      await adminAPI.deleteVoucher(id);
      fetchData();
    } catch (error) {
      alert('Xóa voucher thất bại');
    }
  };

  const handleToggleVoucherActive = async (id: number, isActive: boolean) => {
    try {
      await adminAPI.updateVoucher(id, { isActive });
      setVouchers(vouchers.map(v => v.id === id ? { ...v, isActive } : v));
    } catch (error) {
      alert('Cập nhật trạng thái thất bại');
    }
  };

  const handleBulkDeleteVouchers = async (ids: number[]) => {
    try {
      await adminAPI.bulkDeleteVouchers(ids);
      fetchData();
    } catch (error) {
      alert('Xóa hàng loạt voucher thất bại');
    }
  };

  const handleDeleteReview = async (id: number) => {
    try {
      await adminAPI.deleteReview(id);
      fetchData();
    } catch (error) {
      alert('Xóa đánh giá thất bại');
    }
  };

  const handleBulkDeleteReviews = async (ids: number[]) => {
    try {
      await adminAPI.bulkDeleteReviews(ids);
      fetchData();
    } catch (error) {
      alert('Xóa hàng loạt đánh giá thất bại');
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
    if (userId === user?.id) {
      alert('Bạn không thể xóa chính mình');
      return;
    }
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await adminAPI.deleteUser(userId);
        setUsers(users.filter(u => u.id !== userId));
      } catch (error) {
        alert('Xóa người dùng thất bại');
      }
    }
  };

  const handleBulkDeleteUsers = async (ids: number[]) => {
    // Lọc ra các ID không phải là admin hiện tại (tự bảo vệ)
    const safeIds = ids.filter(id => id !== user?.id);

    if (safeIds.length === 0) {
      alert('Không có người dùng hợp lệ để xóa');
      return;
    }

    try {
      await adminAPI.bulkDeleteUsers(safeIds);
      setUsers(users.filter(u => !safeIds.includes(u.id)));
      if (safeIds.length < ids.length) {
        alert(`Đã xóa ${safeIds.length} người dùng. Không thể xóa chính bạn.`);
      }
    } catch (error) {
      alert('Xóa hàng loạt thất bại');
    }
  };

  // Helper to draw SVG Chart
  const RenderChart = (data: any[]) => {
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
          { id: 'users', label: 'Người dùng', icon: 'group' },
          { id: 'vouchers', label: 'Vouchers', icon: 'confirmation_number' },
          { id: 'reviews', label: 'Đánh giá', icon: 'reviews' }
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

      {activeTab === 'overview' && (loading ? <StatsSkeleton /> : stats && (
        <OverviewTab
          stats={stats}
          onOpenModal={handleOpenModal}
        />
      ))}

      {/* Products Tab Content */}
      {activeTab === 'products' && (loading ? <TableSkeleton rows={8} /> : (
        <ProductTab
          products={products}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onOpenModal={handleOpenModal}
          onDeleteProduct={handleDeleteProduct}
          onBulkDelete={async (ids) => {
            try {
              await productAPI.bulkDelete(ids.map(id => Number(id)));
              setProducts(products.filter(p => !ids.includes(p.id.toString())));
            } catch (err) {
              alert('Xóa hàng loạt thất bại');
            }
          }}
          pagination={pagination}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      ))}

      {/* Users Tab Content */}
      {activeTab === 'users' && (
        loading ? (
          <TableSkeleton />
        ) : (
          <UserTab
            users={users}
            currentUser={user}
            searchUserTerm={searchUserTerm}
            setSearchUserTerm={setSearchUserTerm}
            onUpdateUserRole={handleUpdateUserRole}
            onDeleteUser={handleDeleteUser}
            onBulkDeleteUsers={handleBulkDeleteUsers}
            pagination={userPagination}
            currentPage={userPage}
            setCurrentPage={setUserPage}
          />
        )
      )}

      {activeTab === 'vouchers' && (
        loading ? (
          <TableSkeleton />
        ) : (
          <VoucherTab
            vouchers={vouchers}
            searchTerm={searchVoucherTerm}
            setSearchTerm={setSearchVoucherTerm}
            onAddVoucher={() => handleOpenVoucherModal()}
            onEditVoucher={handleOpenVoucherModal}
            onDeleteVoucher={handleDeleteVoucher}
            onBulkDelete={handleBulkDeleteVouchers}
            onToggleActive={handleToggleVoucherActive}
            pagination={voucherPagination}
            currentPage={voucherPage}
            setCurrentPage={setVoucherPage}
          />
        )
      )}

      {activeTab === 'reviews' && (
        loading ? (
          <TableSkeleton />
        ) : (
          <ReviewTab
            reviews={reviews}
            searchTerm={searchReviewTerm}
            setSearchTerm={setSearchReviewTerm}
            ratingFilter={ratingFilter}
            setRatingFilter={setRatingFilter}
            onDeleteReview={handleDeleteReview}
            onBulkDelete={handleBulkDeleteReviews}
            pagination={reviewPagination}
            currentPage={reviewPage}
            setCurrentPage={setReviewPage}
          />
        )
      )}

      {activeTab === 'orders' && (loading ? <TableSkeleton rows={8} /> : (
        <OrderTab
          orders={orders}
          searchOrderTerm={searchOrderTerm}
          setSearchOrderTerm={setSearchOrderTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onUpdateStatus={async (id, status) => {
            try {
              await orderAPI.updateStatus(id, status);
              setOrders(orders.map(o => {
                const oId = typeof o.id === 'string' ? parseInt(o.id.replace(/\D/g, '')) : o.id;
                return oId === id ? { ...o, status } : o;
              }));
            } catch (err) {
              alert('Cập nhật trạng thái thất bại');
            }
          }}
          onOpenDetail={(order) => {
            setSelectedOrder(order);
            setIsOrderDetailOpen(true);
          }}
          pagination={orderPagination}
          currentPage={orderPage}
          setCurrentPage={setOrderPage}
        />
      ))}

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
      {/* Voucher Modal */}
      {isVoucherModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsVoucherModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white dark:bg-surface-dark rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-surface-border overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-50 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
              <div>
                <h3 className="text-xl font-black font-display">{editingVoucher ? 'Cập nhật Voucher' : 'Thêm Voucher mới'}</h3>
                <p className="text-xs text-slate-500 mt-1">Thiết lập chương trình giảm giá</p>
              </div>
              <button onClick={() => setIsVoucherModalOpen(false)} className="size-10 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center transition-all">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleVoucherSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Mã Voucher</label>
                  <input
                    required
                    type="text"
                    value={voucherFormData.code}
                    onChange={(e) => setVoucherFormData({ ...voucherFormData, code: e.target.value.toUpperCase() })}
                    placeholder="VD: TECHSTORE50"
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border focus:border-primary outline-none transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Loại giảm giá</label>
                  <select
                    value={voucherFormData.type}
                    onChange={(e) => setVoucherFormData({ ...voucherFormData, type: e.target.value as any })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border focus:border-primary outline-none transition-all font-bold"
                  >
                    <option value="percentage">Phần trăm (%)</option>
                    <option value="fixed">Số tiền cố định (₫)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                    {voucherFormData.type === 'percentage' ? 'Phần trăm giảm' : 'Số tiền giảm'}
                  </label>
                  <input
                    required
                    type="number"
                    value={voucherFormData.discount}
                    onChange={(e) => setVoucherFormData({ ...voucherFormData, discount: Number(e.target.value) })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border focus:border-primary outline-none transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Số lượng tối đa</label>
                  <input
                    type="number"
                    value={voucherFormData.usageLimit}
                    onChange={(e) => setVoucherFormData({ ...voucherFormData, usageLimit: Number(e.target.value) })}
                    placeholder="0 = Không giới hạn"
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border focus:border-primary outline-none transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Ngày bắt đầu</label>
                  <input
                    required
                    type="date"
                    value={voucherFormData.startDate}
                    onChange={(e) => setVoucherFormData({ ...voucherFormData, startDate: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border focus:border-primary outline-none transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Ngày kết thúc</label>
                  <input
                    required
                    type="date"
                    value={voucherFormData.endDate}
                    onChange={(e) => setVoucherFormData({ ...voucherFormData, endDate: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border focus:border-primary outline-none transition-all font-bold"
                  />
                </div>
                {voucherFormData.type === 'percentage' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Giảm tối đa (₫)</label>
                    <input
                      type="number"
                      value={voucherFormData.maxDiscount}
                      onChange={(e) => setVoucherFormData({ ...voucherFormData, maxDiscount: Number(e.target.value) })}
                      className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border focus:border-primary outline-none transition-all font-bold"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Đơn hàng tối thiểu (₫)</label>
                  <input
                    type="number"
                    value={voucherFormData.minOrder}
                    onChange={(e) => setVoucherFormData({ ...voucherFormData, minOrder: Number(e.target.value) })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border focus:border-primary outline-none transition-all font-bold"
                  />
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsVoucherModalOpen(false)}
                  className="px-8 py-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 dark:hover:bg-white/10 transition-all border border-slate-100 dark:border-surface-border"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-10 py-3.5 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px] hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 active:scale-95"
                >
                  {editingVoucher ? 'Cập nhật' : 'Thêm Voucher'}
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
