
import React, { useState, useEffect } from 'react';
import { Page, Product, CartItem, User, Order, Notification } from './types';
import { PRODUCTS, MOCK_USER } from './constants';
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

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>({ ...MOCK_USER, role: 'admin' });
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryQuery, setCategoryQuery] = useState('All');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'n1',
      title: 'Đơn hàng đang đến!',
      message: 'Đơn hàng #ORD-2390 của bạn đã được bàn giao cho đơn vị vận chuyển.',
      timestamp: '10 phút trước',
      type: 'order',
      isRead: false,
      targetPage: Page.PROFILE
    },
    {
      id: 'n2',
      title: 'AI Recommendation Match',
      message: 'Chúng tôi vừa tìm thấy một phụ kiện hoàn hảo cho MacBook Air M2 của bạn. Xem ngay!',
      timestamp: '2 giờ trước',
      type: 'ai',
      isRead: false,
      targetPage: Page.AI_ASSISTANT
    }
  ]);

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

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
      setCart([]);
    }
  };

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    setCurrentPage(Page.HOME);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage(Page.HOME);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
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

  const isAdminView = currentPage === Page.ADMIN_DASHBOARD;

  if (isAdminView) {
    return <AdminDashboard onNavigate={setCurrentPage} user={user} />;
  }

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
            products={PRODUCTS}
            onProductSelect={handleProductSelect}
            onAddToCart={handleAddToCart}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === Page.DETAIL && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === Page.AUTH && (
          <Auth
            onSuccess={handleAuthSuccess}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === Page.LISTING && (
          <Listing
            products={PRODUCTS}
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
          />
        )}

        {currentPage === Page.CHECKOUT && (
          <Checkout
            cart={cart}
            onNavigate={setCurrentPage}
            onAddToCart={handleAddToCart}
          />
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
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === Page.AI_ASSISTANT && (
          <AIAssistant onNavigate={setCurrentPage} />
        )}
      </main>

      <footer className="bg-white dark:bg-[#0b0f17] border-t border-slate-200 dark:border-surface-border pt-16 pb-8">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="flex flex-col gap-6 items-center md:items-start">
              <div className="flex items-center gap-2">
                <div className="size-8 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined !text-[32px] font-variation-fill">hexagon</span>
                </div>
                <h1 className="text-2xl font-black font-display tracking-tight text-slate-900 dark:text-white">TechStore</h1>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-light">
                Hệ thống bán lẻ thiết bị công nghệ chính hãng hàng đầu Việt Nam. Chất lượng đảm bảo, dịch vụ tận tâm và gợi ý mua sắm thông minh bởi AI.
              </p>
              {user?.role === 'admin' && (
                <button
                  onClick={() => setCurrentPage(Page.ADMIN_DASHBOARD)}
                  className="px-4 py-2 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-primary hover:text-white transition-all w-fit"
                >
                  Truy cập Admin Panel
                </button>
              )}
            </div>



            <div>
              <h3 className="font-bold mb-6 text-sm uppercase tracking-widest text-slate-900 dark:text-white">Hỗ trợ</h3>
              <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400 font-light">
                <li><button onClick={() => alert('Đang chuyển đến chính sách bảo hành...')} className="hover:text-primary transition-colors">Chính sách bảo hành</button></li>
                <li><button onClick={() => alert('Đang kiểm tra thông tin vận chuyển...')} className="hover:text-primary transition-colors">Vận chuyển & Giao hàng</button></li>
                <li><button onClick={() => alert('Chương trình trả góp đang được tải...')} className="hover:text-primary transition-colors">Trả góp 0%</button></li>
                <li><button onClick={() => alert('Hotline: 1900 1234')} className="hover:text-primary transition-colors">Liên hệ</button></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-6 text-sm uppercase tracking-widest text-slate-900 dark:text-white">Công cụ AI</h3>
              <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400 font-light">
                <li><button onClick={() => setCurrentPage(Page.AI_ASSISTANT)} className="hover:text-primary transition-colors">AI Tech Assistant</button></li>
                <li><button onClick={() => setCurrentPage(Page.HOME)} className="hover:text-primary transition-colors">AI Recommended</button></li>
                <li><button onClick={() => setCurrentPage(Page.LISTING)} className="hover:text-primary transition-colors">So sánh sản phẩm</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-surface-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-400">© 2026 TechStore. All rights reserved.</p>
            <div className="flex gap-6">
              <button onClick={() => window.location.href = "https://www.facebook.com/adr.adt.7"} className="text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined !text-[20px]">public</span></button>
              <button onClick={() => window.location.href = "https://www.facebook.com/adr.adt.7"} className="text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined !text-[20px]">photo_camera</span></button>
              <button onClick={() => window.location.href = "https://www.facebook.com/adr.adt.7"} className="text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined !text-[20px]">alternate_email</span></button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
