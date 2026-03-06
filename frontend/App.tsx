import React, { useState, useEffect } from 'react';
import { Page, Product, CartItem, User, Order, Notification } from './types';
import { productAPI, authAPI, cartAPI, notificationAPI } from './services/apiService';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Auth from './pages/Auth';
import Listing from './pages/Listing';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import OrderDetail from './pages/OrderDetail';
import AIAssistant from './pages/AIAssistant';
import AdminDashboard from './pages/AdminDashboard';
import OrderSuccess from './pages/OrderSuccess';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
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
      setCurrentPage(Page.RESET_PASSWORD);
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
    setCurrentPage(Page.HOME);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage(Page.DETAIL);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
    setCurrentPage(Page.ORDER_DETAIL);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBuyNow = (product: Product, quantity: number = 1) => {
    setBuyNowItem({ ...product, quantity });
    setCurrentPage(Page.CHECKOUT);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = async (product: Product, quantity: number = 1) => {
    if (!user) {
      setCurrentPage(Page.AUTH);
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

  const handleAuthSuccess = (userData: User) => {
    handleLogin(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setNotifications([]);
    authAPI.logout();
    setCurrentPage(Page.HOME);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      setCurrentPage(Page.LISTING);
    }
  };

  const handleCategorySelect = (category: string) => {
    setCategoryQuery(category);
    setCurrentPage(Page.LISTING);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        user={user}
        cartCount={cartCount}
        onNavigate={setCurrentPage}
        currentPage={currentPage}
        onLogout={handleLogout}
        notifications={notifications}
        onMarkAsRead={markNotificationAsRead}
        onMarkAllAsRead={markAllNotificationsAsRead}
        onSearch={handleSearch}
        onCategorySelect={handleCategorySelect}
      />

      <main className="flex-grow container mx-auto px-4 lg:px-8 max-w-7xl pt-8 pb-12">
        {currentPage === Page.HOME && (
          <Home
            products={products}
            onProductSelect={handleProductSelect}
            onAddToCart={handleAddToCart}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === Page.DETAIL && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onNavigate={setCurrentPage}
            onProductSelect={handleProductSelect}
          />
        )}

        {currentPage === Page.AUTH && (
          <Auth
            onNavigate={setCurrentPage}
            onLogin={handleLogin}
          />
        )}

        {currentPage === Page.LISTING && (
          <Listing
            products={products}
            onProductSelect={handleProductSelect}
            onAddToCart={handleAddToCart}
            onNavigate={setCurrentPage}
            searchQuery={searchQuery}
            initialCategory={categoryQuery}
          />
        )}

        {currentPage === Page.CART && (
          <Cart
            cart={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onNavigate={setCurrentPage}
            onProductSelect={handleProductSelect}
            onAddToCart={handleAddToCart}
            onCheckoutSelected={(items) => {
              setCheckoutItems(items);
              setBuyNowItem(null);
              setCurrentPage(Page.CHECKOUT);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === Page.CHECKOUT && (
          <Checkout
            cart={buyNowItem ? [buyNowItem] : (checkoutItems.length > 0 ? checkoutItems : cart)}
            onNavigate={(page) => {
              setBuyNowItem(null);
              setCheckoutItems([]);
              setCurrentPage(page);
            }}
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
        )}

        {currentPage === Page.ORDER_SUCCESS && (
          <OrderSuccess onNavigate={setCurrentPage} />
        )}

        {currentPage === Page.PROFILE && user && (
          <Profile
            user={user}
            onNavigate={setCurrentPage}
            onProductSelect={handleProductSelect}
            onOrderSelect={handleOrderSelect}
            onUpdateUser={handleUpdateUser}
          />
        )}

        {currentPage === Page.ORDER_DETAIL && selectedOrder && (
          <OrderDetail
            order={selectedOrder}
            user={user}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === Page.AI_ASSISTANT && (
          <AIAssistant onNavigate={setCurrentPage} />
        )}

        {currentPage === Page.ADMIN_DASHBOARD && (
          <AdminDashboard onNavigate={setCurrentPage} user={user} />
        )}

        {currentPage === Page.FORGOT_PASSWORD && (
          <ForgotPassword onNavigate={setCurrentPage} />
        )}

        {currentPage === Page.RESET_PASSWORD && (
          <ResetPassword onNavigate={setCurrentPage} />
        )}


      </main>

      <footer className="bg-white dark:bg-[#0b0f17] border-t border-slate-200 dark:border-surface-border pt-20 pb-10 transition-colors duration-300">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16 px-4 md:px-0">
            {/* Column 1: Brand & About */}
            <div className="flex flex-col gap-6 items-center md:items-start text-center md:text-left lg:pr-12">
              <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setCurrentPage(Page.HOME)}>
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
                <li><button onClick={() => setCurrentPage(Page.AI_ASSISTANT)} className="hover:text-primary hover:translate-x-1 transition-all flex items-center gap-2"><span className="material-symbols-outlined !text-[18px]">auto_awesome</span>AI Tech Assistant</button></li>
                <li><button onClick={() => setCurrentPage(Page.HOME)} className="hover:text-primary hover:translate-x-1 transition-all">Gợi ý cá nhân hóa</button></li>
                <li><button onClick={() => setCurrentPage(Page.LISTING)} className="hover:text-primary hover:translate-x-1 transition-all">So sánh sản phẩm AI</button></li>
              </ul>
              {user?.role === 'admin' && (
                <button
                  onClick={() => setCurrentPage(Page.ADMIN_DASHBOARD)}
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
