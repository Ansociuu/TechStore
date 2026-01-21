
import React, { useState, useRef, useEffect } from 'react';
import { Page, User, Notification } from '../types';
import NotificationPopover from './NotificationPopover';

interface NavbarProps {
  user: User | null;
  cartCount: number;
  onNavigate: (page: Page) => void;
  currentPage: Page;
  onLogout: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSearch: (query: string) => void;
  onCategorySelect?: (category: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  user,
  cartCount,
  onNavigate,
  currentPage,
  onLogout,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onSearch,
  onCategorySelect
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    // Default to Light Mode (User request)
    // if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    //   setIsDarkMode(true);
    //   document.documentElement.classList.add('dark');
    // }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  const handleCategoryClick = (category: string) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    } else {
      onNavigate(Page.LISTING);
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-surface-border bg-white/90 dark:bg-background-dark/95 backdrop-blur-xl transition-all duration-300">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl h-16 md:h-20 flex items-center justify-between gap-4">

        {/* Left: Logo & Navigation */}
        <div className="flex items-center gap-8">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-2 rounded-full transition-colors lg:hidden ${isMenuOpen ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'}`}
          >
            <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
          </button>

          {/* Logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onNavigate(Page.HOME); setIsMenuOpen(false); }}
            className="flex items-center gap-2 group"
          >
            <div className="size-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined !text-[24px] font-variation-fill">hexagon</span>
            </div>
            <h1 className="text-xl font-bold font-display tracking-tight text-slate-900 dark:text-white hidden md:block">TechStore</h1>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {['Laptop', 'Smartphone', 'Tablet', 'Phụ kiện'].map((item) => (
              <button
                key={item}
                onClick={() => handleCategoryClick(item)}
                className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        {/* Right: Search & Actions */}
        <div className="flex items-center gap-3 flex-1 justify-end">

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="hidden xl:flex relative w-full max-w-[280px] group">
            <button type="submit" className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">search</button>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full bg-slate-100 dark:bg-surface-dark border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </form>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors order-first sm:order-none"
            title={isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}
          >
            <span className="material-symbols-outlined font-variation-fill">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
          </button>

          {/* AI Button */}
          <button
            onClick={() => onNavigate(Page.AI_ASSISTANT)}
            className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${currentPage === Page.AI_ASSISTANT ? 'bg-primary text-white shadow-lg' : 'hover:bg-primary/10 text-primary'}`}
          >
            <span className="material-symbols-outlined !text-[20px] font-variation-fill animate-sparkle">auto_awesome</span>
            <span className="text-[10px] font-black uppercase tracking-widest hidden xl:block">AI Chat</span>
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-surface-border mx-1 hidden sm:block"></div>

          {/* Actions */}
          <div className="flex items-center gap-2">

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`relative p-2 transition-all rounded-full ${isNotifOpen ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-white/5'}`}
                title="Thông báo"
              >
                <span className="material-symbols-outlined">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 size-4 bg-primary text-white text-[9px] font-black flex items-center justify-center rounded-full ring-2 ring-white dark:ring-background-dark animate-in zoom-in duration-300">
                    {unreadCount}
                  </span>
                )}
              </button>
              {isNotifOpen && (
                <NotificationPopover
                  notifications={notifications}
                  onMarkAsRead={onMarkAsRead}
                  onMarkAllAsRead={onMarkAllAsRead}
                  onClose={() => setIsNotifOpen(false)}
                  onNavigate={onNavigate}
                />
              )}
            </div>

            {/* Cart */}
            <button
              onClick={() => onNavigate(Page.CART)}
              className={`relative p-2 transition-all rounded-full ${currentPage === Page.CART ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-white/5'}`}
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute top-2 right-2 size-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white dark:ring-background-dark">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile */}
            {user ? (
              <div className="flex items-center gap-2 pl-2">
                <button
                  onClick={() => onNavigate(Page.PROFILE)}
                  className="flex items-center gap-2 rounded-full p-1 hover:bg-slate-100 dark:hover:bg-white/5 transition-all group"
                >
                  <div className="size-8 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-primary transition-all">
                    <img src={user.avatar} alt={user.name} className="size-full object-cover" />
                  </div>
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors hidden sm:block"
                  title="Đăng xuất"
                >
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate(Page.AUTH)}
                className="ml-2 px-6 py-2 text-sm font-black uppercase tracking-widest text-white bg-primary hover:bg-primary-dark rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-95"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-background-dark border-b border-slate-200 dark:border-surface-border p-6 space-y-6 shadow-2xl animate-in slide-in-from-top duration-300 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full bg-slate-100 dark:bg-surface-dark border-none rounded-xl py-3 pl-10 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </form>
          <nav className="flex flex-col gap-2">
            {[
              { label: 'Trang chủ', page: Page.HOME, icon: 'home', action: () => onNavigate(Page.HOME) },
              { label: 'Laptop', icon: 'laptop', action: () => handleCategoryClick('Laptop') },
              { label: 'Smartphone', icon: 'smartphone', action: () => handleCategoryClick('Smartphone') },
              { label: 'Tablet', icon: 'tablet', action: () => handleCategoryClick('Tablet') },
              { label: 'Phụ kiện', icon: 'headphones', action: () => handleCategoryClick('Phụ kiện') },
              { label: 'Trợ lý AI', page: Page.AI_ASSISTANT, icon: 'smart_toy', action: () => onNavigate(Page.AI_ASSISTANT) },
              { label: 'Giỏ hàng', page: Page.CART, icon: 'shopping_cart', action: () => onNavigate(Page.CART) },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => { item.action(); setIsMenuOpen(false); }}
                className={`flex items-center gap-4 p-4 rounded-xl text-sm font-bold transition-all ${currentPage === (item as any).page ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300'}`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
