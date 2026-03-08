import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Page, Product, CartItem, User, Order, Notification } from './types';
import { productAPI, authAPI, cartAPI, notificationAPI } from './services/apiService';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';

// Lazy load page components
const Home = lazy(() => import('./pages/Home'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Auth = lazy(() => import('./pages/Auth'));
const Listing = lazy(() => import('./pages/Listing'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Profile = lazy(() => import('./pages/Profile'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const AIAssistant = lazy(() => import('./pages/AIAssistant'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

// Loading Fallback Component
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
    <div className="relative size-16">
      <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 animate-pulse">Đang tải TechStore...</p>
  </div>
);

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutVoucher, setCheckoutVoucher] = useState<any>(null);
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryQuery, setCategoryQuery] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Lấy dữ liệu sản phẩm từ API khi component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const data = await productAPI.getAll({ limit: 100 });
        setProducts(data.products);
      } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();

    if (user) {
      fetchUserContent();
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('token')) {
      navigate('/reset-password');
    }
  }, []);

  const fetchUserContent = async () => {
    try {
      // Fetch Cart
      const cartData = await cartAPI.get();
      const transformedCart = cartData.items.map((item: any) => ({
        ...item.product,
        id: String(item.product.id),
        quantity: item.quantity,
        dbItemId: item.id // Store backend record ID for updates
      }));
      setCart(transformedCart);

      // Fetch Notifications
      const notifs = await notificationAPI.getAll();
      setNotifications(notifs);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu người dùng:', error);
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    fetchUserContent();
    navigate('/');
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    navigate(`/product/${product.id}`);
  };

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
    navigate(`/order/${order.id}`);
  };

  const handleBuyNow = (product: Product, quantity: number = 1) => {
    setBuyNowItem({ ...product, quantity });
    navigate('/checkout');
  };

  const handleAddToCart = async (product: Product, quantity: number = 1) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      await cartAPI.addItem(Number(product.id), quantity);
      await fetchUserContent(); // Refresh from DB
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
    }
  };

  const handleUpdateCartQuantity = async (productId: string, delta: number) => {
    const item = cart.find(i => i.id === productId);
    if (!item || !item.dbItemId) return;

    try {
      const newQuantity = Math.max(1, item.quantity + delta);
      await cartAPI.updateItem(item.dbItemId, newQuantity);
      await fetchUserContent();
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng:', error);
    }
  };

  const handleRemoveFromCart = async (productId: string) => {
    const item = cart.find(i => i.id === productId);
    if (!item || !item.dbItemId) return;

    try {
      await cartAPI.removeItem(item.dbItemId);
      await fetchUserContent();
    } catch (error) {
      console.error('Lỗi khi xóa khỏi giỏ hàng:', error);
    }
  };

  const handleClearCart = async (force: boolean = false) => {
    if (force || window.confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
      try {
        await cartAPI.clear();
        setCart([]);
      } catch (error) {
        console.error('Lỗi khi xóa giỏ hàng:', error);
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setNotifications([]);
    authAPI.logout();
    navigate('/');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    if (updatedUser) {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Lỗi khi đánh dấu đã đọc:', error);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Lỗi khi đánh dấu đọc tất cả:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      navigate('/listing');
    }
  };

  const handleCategorySelect = (category: string) => {
    setCategoryQuery(category);
    navigate('/listing');
  };


  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Helper to determine current "Page" enum for components that still need it
  const getCurrentPageEnum = () => {
    const path = location.pathname;
    if (path === '/') return Page.HOME;
    if (path.startsWith('/product/')) return Page.DETAIL;
    if (path === '/auth') return Page.AUTH;
    if (path === '/listing') return Page.LISTING;
    if (path === '/cart') return Page.CART;
    if (path === '/checkout') return Page.CHECKOUT;
    if (path === '/profile') return Page.PROFILE;
    if (path.startsWith('/order/')) return Page.ORDER_DETAIL;
    if (path === '/ai-assistant') return Page.AI_ASSISTANT;
    if (path === '/admin') return Page.ADMIN_DASHBOARD;
    if (path === '/order-success') return Page.ORDER_SUCCESS;
    if (path === '/forgot-password') return Page.FORGOT_PASSWORD;
    if (path === '/reset-password') return Page.RESET_PASSWORD;
    return Page.HOME;
  };

  const currentPage = getCurrentPageEnum();

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar
        user={user}
        cartCount={cartCount}
        onNavigate={(page) => {
          // Mapping Page enum to paths for backward compatibility with Navbar
          switch (page) {
            case Page.HOME: navigate('/'); break;
            case Page.AUTH: navigate('/auth'); break;
            case Page.CART: navigate('/cart'); break;
            case Page.PROFILE: navigate('/profile'); break;
            case Page.AI_ASSISTANT: navigate('/ai-assistant'); break;
            case Page.ADMIN_DASHBOARD: navigate('/admin'); break;
            case Page.LISTING: navigate('/listing'); break;
            default: navigate('/');
          }
        }}
        currentPage={currentPage}
        onLogout={handleLogout}
        notifications={notifications}
        onMarkAsRead={markNotificationAsRead}
        onMarkAllAsRead={markAllNotificationsAsRead}
        onSearch={handleSearch}
        onCategorySelect={handleCategorySelect}
      />

      <main className="flex-grow container mx-auto px-4 lg:px-8 max-w-7xl pt-8 pb-12">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={
              <Home
                products={products}
                onProductSelect={handleProductSelect}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onNavigate={(page) => {
                  switch (page) {
                    case Page.LISTING: navigate('/listing'); break;
                    case Page.CART: navigate('/cart'); break;
                    case Page.PROFILE: navigate('/profile'); break;
                    case Page.AI_ASSISTANT: navigate('/ai-assistant'); break;
                    case Page.AUTH: navigate('/auth'); break;
                    default: navigate('/');
                  }
                }}
              />
            } />

            <Route path="/product/:id" element={
              <ProductDetail
                product={selectedProduct}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onNavigate={(page) => {
                  switch (page) {
                    case Page.LISTING: navigate('/listing'); break;
                    case Page.CART: navigate('/cart'); break;
                    case Page.PROFILE: navigate('/profile'); break;
                    case Page.AI_ASSISTANT: navigate('/ai-assistant'); break;
                    case Page.AUTH: navigate('/auth'); break;
                    default: navigate('/');
                  }
                }}
                onProductSelect={handleProductSelect}
              />
            } />

            <Route path="/auth" element={
              <Auth
                onNavigate={(page) => {
                  switch (page) {
                    case Page.LISTING: navigate('/listing'); break;
                    case Page.CART: navigate('/cart'); break;
                    case Page.PROFILE: navigate('/profile'); break;
                    case Page.AI_ASSISTANT: navigate('/ai-assistant'); break;
                    case Page.AUTH: navigate('/auth'); break;
                    default: navigate('/');
                  }
                }}
                onLogin={handleLogin}
              />
            } />

            <Route path="/listing" element={
              <Listing
                products={products}
                onProductSelect={handleProductSelect}
                onAddToCart={handleAddToCart}
                onNavigate={(page) => {
                  switch (page) {
                    case Page.LISTING: navigate('/listing'); break;
                    case Page.CART: navigate('/cart'); break;
                    case Page.PROFILE: navigate('/profile'); break;
                    case Page.AI_ASSISTANT: navigate('/ai-assistant'); break;
                    case Page.AUTH: navigate('/auth'); break;
                    default: navigate('/');
                  }
                }}
                searchQuery={searchQuery}
                initialCategory={categoryQuery}
              />
            } />

            <Route path="/cart" element={
              <Cart
                user={user}
                cart={cart}
                onUpdateQuantity={handleUpdateCartQuantity}
                onRemoveItem={handleRemoveFromCart}
                onClearCart={handleClearCart}
                onNavigate={(page) => {
                  switch (page) {
                    case Page.LISTING: navigate('/listing'); break;
                    case Page.CART: navigate('/cart'); break;
                    case Page.PROFILE: navigate('/profile'); break;
                    case Page.AI_ASSISTANT: navigate('/ai-assistant'); break;
                    case Page.AUTH: navigate('/auth'); break;
                    default: navigate('/');
                  }
                }}
                onProductSelect={handleProductSelect}
                onAddToCart={handleAddToCart}
                onCheckoutSelected={(items, voucher) => {
                  setCheckoutItems(items);
                  setCheckoutVoucher(voucher);
                  setBuyNowItem(null);
                  navigate('/checkout');
                }}
              />
            } />

            <Route path="/checkout" element={
              <Checkout
                cart={buyNowItem ? [buyNowItem] : (checkoutItems.length > 0 ? checkoutItems : cart)}
                onNavigate={(page) => {
                  setBuyNowItem(null);
                  setCheckoutItems([]);
                  setCheckoutVoucher(null);
                  // page here is restricted in Checkout, but we map to HOME/SUCCESS
                  if (page === Page.ORDER_SUCCESS) navigate('/order-success');
                  else navigate('/');
                }}
                initialVoucher={checkoutVoucher}
                onAddToCart={handleAddToCart}
                user={user}
                onClearCart={(force) => {
                  if (buyNowItem) {
                    setBuyNowItem(null);
                  } else if (checkoutItems.length > 0) {
                    setCheckoutItems([]);
                  } else {
                    handleClearCart(force);
                  }
                }}
              />
            } />

            <Route path="/order-success" element={<OrderSuccess onNavigate={(page) => navigate('/')} />} />

            <Route path="/profile" element={
              user ? (
                <Profile
                  user={user}
                  onNavigate={(page) => {
                    switch (page) {
                      case Page.LISTING: navigate('/listing'); break;
                      case Page.CART: navigate('/cart'); break;
                      case Page.PROFILE: navigate('/profile'); break;
                      case Page.AI_ASSISTANT: navigate('/ai-assistant'); break;
                      case Page.AUTH: navigate('/auth'); break;
                      default: navigate('/');
                    }
                  }}
                  onProductSelect={handleProductSelect}
                  onOrderSelect={handleOrderSelect}
                  onUpdateUser={handleUpdateUser}
                />
              ) : <Navigate to="/auth" />
            } />

            <Route path="/order/:id" element={
              <OrderDetail
                order={selectedOrder}
                user={user}
                onNavigate={(page) => {
                  switch (page) {
                    case Page.LISTING: navigate('/listing'); break;
                    case Page.CART: navigate('/cart'); break;
                    case Page.PROFILE: navigate('/profile'); break;
                    case Page.AI_ASSISTANT: navigate('/ai-assistant'); break;
                    case Page.AUTH: navigate('/auth'); break;
                    default: navigate('/');
                  }
                }}
              />
            } />

            <Route path="/ai-assistant" element={<AIAssistant onNavigate={(page) => navigate('/')} />} />

            <Route path="/admin" element={
              user?.role === 'admin' ? (
                <AdminDashboard onNavigate={(page) => navigate('/')} user={user} />
              ) : <Navigate to="/" />
            } />

            <Route path="/forgot-password" element={<ForgotPassword onNavigate={(page) => navigate('/')} />} />
            <Route path="/reset-password" element={<ResetPassword onNavigate={(page) => navigate('/')} />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </main>

      <footer className="bg-white dark:bg-[#0b0f17] border-t border-slate-200 dark:border-surface-border pt-20 pb-10 transition-colors duration-300">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16 px-4 md:px-0">
            {/* Column 1: Brand & About */}
            <div className="flex flex-col gap-6 items-center md:items-start text-center md:text-left lg:pr-12">
              <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                <div className="size-10 bg-primary/10 rounded-xl text-primary flex items-center justify-center transition-transform group-hover:rotate-12">
                  <span className="material-symbols-outlined !text-[32px] font-variation-fill">hexagon</span>
                </div>
                <h1 className="text-2xl font-black font-display tracking-tight text-slate-900 dark:text-white">TechStore</h1>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                Hệ thống bán lẻ thiết bị công nghệ chính hãng hàng đầu Việt Nam. Chất lượng đảm bảo, dịch vụ tận tâm và gợi ý mua sắm thông minh bởi AI.
              </p>
              <div className="flex gap-4 pt-2">
                {[
                  { icon: 'public', link: 'https://www.facebook.com/adr.adt.7' },
                  { icon: 'photo_camera', link: 'https://www.facebook.com/adr.adt.7' },
                  { icon: 'alternate_email', link: 'https://www.facebook.com/adr.adt.7' }
                ].map((social, idx) => (
                  <button
                    key={idx}
                    onClick={() => window.open(social.link, '_blank')}
                    className="size-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    <span className="material-symbols-outlined !text-[20px]">{social.icon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Column 2: Support */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="font-black mb-8 text-sm uppercase tracking-[0.2em] text-slate-900 dark:text-white font-display border-b-2 border-primary/20 pb-2 w-fit">Hỗ trợ khách hàng</h3>
              <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <li><button onClick={() => alert('Chính sách bảo hành đang cập nhật')} className="hover:text-primary hover:translate-x-1 transition-all">Chính sách bảo hành</button></li>
                <li><button onClick={() => alert('Vận chuyển nhanh 24h')} className="hover:text-primary hover:translate-x-1 transition-all">Vận chuyển & Giao hàng</button></li>
                <li><button onClick={() => alert('Trả góp lãi suất 0%')} className="hover:text-primary hover:translate-x-1 transition-all">Trả góp 0% lãi suất</button></li>
                <li><button onClick={() => alert('Hotline: 1900 1234')} className="hover:text-primary hover:translate-x-1 transition-all">Trung tâm trợ giúp</button></li>
              </ul>
            </div>

            {/* Column 3: AI & Admin */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="font-black mb-8 text-sm uppercase tracking-[0.2em] text-slate-900 dark:text-white font-display border-b-2 border-primary/20 pb-2 w-fit">Công nghệ & Quản lý</h3>
              <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400 font-medium mb-8">
                <li><button onClick={() => navigate('/ai-assistant')} className="hover:text-primary hover:translate-x-1 transition-all flex items-center gap-2"><span className="material-symbols-outlined !text-[18px]">auto_awesome</span>AI Tech Assistant</button></li>
                <li><button onClick={() => navigate('/')} className="hover:text-primary hover:translate-x-1 transition-all">Gợi ý cá nhân hóa</button></li>
                <li><button onClick={() => navigate('/listing')} className="hover:text-primary hover:translate-x-1 transition-all">So sánh sản phẩm AI</button></li>
              </ul>
              {user?.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="px-6 py-2.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  Truy cập Admin Panel
                </button>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
              © 2026 <span className="text-slate-900 dark:text-white font-black">TechStore</span>. All rights reserved.
            </p>
            <div className="flex gap-8 text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              <button className="hover:text-primary transition-colors">Bảo mật</button>
              <button className="hover:text-primary transition-colors">Điều khoản</button>
              <button className="hover:text-primary transition-colors">Cookies</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
