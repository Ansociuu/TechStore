import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Page, User, Notification, Product } from '../types';
import NotificationPopover from './NotificationPopover';
import { productAPI } from '../services/apiService';

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
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Handle hotkey '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setShowDropdown(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search for suggestions
  useEffect(() => {
    if (searchValue.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const data = await productAPI.getAll({ search: searchValue, limit: 5 });
        setSuggestions(data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      saveRecentSearch(searchValue);
      onSearch(searchValue);
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (product: Product) => {
    saveRecentSearch(searchValue);
    navigate(`/product/${product.id}`);
    setShowDropdown(false);
    setSearchValue('');
  };

  const handleCategoryClick = (category: string) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    } else {
      onNavigate(Page.LISTING);
    }
    setIsMenuOpen(false);
  };

  const removeRecentSearch = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== text);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
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
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-2 group"
          >
            <div className="size-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined !text-[24px] font-variation-fill">hexagon</span>
            </div>
            <h1 className="text-xl font-bold font-display tracking-tight text-slate-900 dark:text-white hidden md:block">TechStore</h1>
          </Link>

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

          {/* Search Content */}
          <div ref={searchRef} className="hidden xl:flex relative w-full max-w-[320px] group">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <button type="submit" className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">search</button>
              <input
                ref={inputRef}
                type="text"
                value={searchValue}
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-full bg-slate-100 dark:bg-surface-dark border-none rounded-2xl py-2.5 pl-11 pr-10 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={() => { setSearchValue(''); onSearch(''); inputRef.current?.focus(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <span className="material-symbols-outlined !text-[18px]">close</span>
                </button>
              )}
            </form>

            {/* Suggestions Dropdown */}
            {showDropdown && (
              <div className="absolute top-full left-0 w-full mt-3 bg-white dark:bg-[#161d2b] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[100]">
                {/* Recent Searches */}
                {!searchValue && recentSearches.length > 0 && (
                  <div className="p-2">
                    <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 flex justify-between items-center">
                      <span>Tìm kiếm gần đây</span>
                    </div>
                    {recentSearches.map((text, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between group/item px-3 py-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl cursor-pointer transition-colors"
                        onClick={() => { setSearchValue(text); onSearch(text); setShowDropdown(false); }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-[18px] text-slate-400">history</span>
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{text}</span>
                        </div>
                        <button
                          onClick={(e) => removeRecentSearch(e, text)}
                          className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded-md transition-all"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggestions Results */}
                {searchValue && (
                  <div className="p-2">
                    <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 flex justify-between items-center">
                      <span>{isLoadingSuggestions ? 'Đang tìm kiếm...' : 'Gợi ý sản phẩm'}</span>
                    </div>

                    {suggestions.length > 0 ? (
                      <div className="space-y-1">
                        {suggestions.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => handleSuggestionClick(product)}
                            className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl cursor-pointer transition-all group"
                          >
                            <div className="size-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                              <img src={product.image} alt={product.name} className="size-full object-cover transition-transform group-hover:scale-110" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{product.name}</h4>
                              <p className="text-xs font-bold text-primary">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : !isLoadingSuggestions && (
                      <div className="p-4 text-center">
                        <span className="material-symbols-outlined text-slate-300 text-[40px] mb-2">search_off</span>
                        <p className="text-xs font-medium text-slate-400">Không tìm thấy sản phẩm</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer Tips */}
                <div className="bg-slate-50 dark:bg-white/5 px-4 py-2 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-medium">Nhấn <kbd className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">Enter</kbd> để tìm tất cả</span>
                  <span className="text-[10px] text-slate-400 font-medium tracking-tight">TechStore-AI Suggestions</span>
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors order-first sm:order-none"
            title={isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}
          >
            <span className="material-symbols-outlined font-variation-fill">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
          </button>

          {/* AI Button */}
          <Link
            to="/ai-assistant"
            className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${location.pathname === '/ai-assistant' ? 'bg-primary text-white shadow-lg' : 'hover:bg-primary/10 text-primary'}`}
          >
            <span className="material-symbols-outlined !text-[20px] font-variation-fill animate-sparkle">auto_awesome</span>
            <span className="text-[10px] font-black uppercase tracking-widest hidden xl:block">AI Chat</span>
          </Link>

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
            <Link
              to="/cart"
              className={`relative p-2 transition-all rounded-full ${location.pathname === '/cart' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-white/5'}`}
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute top-2 right-2 size-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white dark:ring-background-dark">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile */}
            {user ? (
              <div className="flex items-center gap-2 pl-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-full p-1 hover:bg-slate-100 dark:hover:bg-white/5 transition-all group"
                >
                  <div className="size-8 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-primary transition-all">
                    <img src={user.avatar} alt={user.name} className="size-full object-cover" />
                  </div>
                </Link>
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors hidden sm:block"
                  title="Đăng xuất"
                >
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="ml-2 px-6 py-2 text-sm font-black uppercase tracking-widest text-white bg-primary hover:bg-primary-dark rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-95"
              >
                Login
              </Link>
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
              { label: 'Trang chủ', to: '/', icon: 'home' },
              { label: 'Laptop', icon: 'laptop', action: () => handleCategoryClick('Laptop') },
              { label: 'Smartphone', icon: 'smartphone', action: () => handleCategoryClick('Smartphone') },
              { label: 'Tablet', icon: 'tablet', action: () => handleCategoryClick('Tablet') },
              { label: 'Phụ kiện', icon: 'headphones', action: () => handleCategoryClick('Phụ kiện') },
              { label: 'Trợ lý AI', to: '/ai-assistant', icon: 'smart_toy' },
              { label: 'Giỏ hàng', to: '/cart', icon: 'shopping_cart' },
            ].map((item, idx) => (
              item.to ? (
                <Link
                  key={idx}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-4 p-4 rounded-xl text-sm font-bold transition-all ${location.pathname === item.to ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300'}`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  {item.label}
                </Link>
              ) : (
                <button
                  key={idx}
                  onClick={() => { (item as any).action(); setIsMenuOpen(false); }}
                  className={`flex items-center gap-4 p-4 rounded-xl text-sm font-bold transition-all hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  {item.label}
                </button>
              )
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
