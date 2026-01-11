
import React, { useState } from 'react';
import { Page, User } from '../types';
import AdminOrders from '../components/admin/AdminOrders';
import AdminProducts from '../components/admin/AdminProducts';
import AdminCustomers from '../components/admin/AdminCustomers';

interface AdminDashboardProps {
  onNavigate: (page: Page) => void;
  user: User | null;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, user }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Tổng doanh thu', value: '3,120,400,000₫', trend: '+12%', icon: 'payments', color: 'text-primary bg-primary/10' },
    { label: 'Tổng đơn hàng', value: '1,240', trend: '+5%', icon: 'shopping_cart', color: 'text-orange-500 bg-orange-500/10' },
    { label: 'Khách mới', value: '340', trend: '+8%', icon: 'group_add', color: 'text-purple-500 bg-purple-500/10' },
    { label: 'AI Conversion', value: '35%', trend: '+15%', icon: 'psychology', color: 'text-teal-500 bg-teal-500/10' },
  ];

  const recentOrders = [
    { id: '#ORD-7352', product: 'MacBook Pro M2', customer: 'Jane Cooper', date: '24 Thg 10, 2023', amount: '42,400,000₫', status: 'Hoàn thành', color: 'bg-green-500' },
    { id: '#ORD-7351', product: 'iPhone 15 Pro', customer: 'Wade Warren', date: '24 Thg 10, 2023', amount: '28,990,000₫', status: 'Chờ xử lý', color: 'bg-yellow-500' },
    { id: '#ORD-7350', product: 'Sony WH-1000XM5', customer: 'Esther Howard', date: '23 Thg 10, 2023', amount: '8,490,000₫', status: 'Đã giao', color: 'bg-blue-500' },
    { id: '#ORD-7349', product: 'Apple Watch Series 9', customer: 'Jenny Wilson', date: '23 Thg 10, 2023', amount: '10,190,000₫', status: 'Hoàn thành', color: 'bg-green-500' },
  ];

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark overflow-hidden font-body selection:bg-primary selection:text-white">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-20 bg-white dark:bg-surface-dark border-r border-slate-200 dark:border-surface-border h-full flex-shrink-0 transition-all items-center py-6 z-20">
        <div className="mb-10">
          <div 
            onClick={() => onNavigate(Page.HOME)}
            className="size-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/25 cursor-pointer hover:scale-105 transition-transform"
          >
            <span className="material-symbols-outlined font-variation-fill">hexagon</span>
          </div>
        </div>
        
        <nav className="flex-1 w-full px-3 flex flex-col gap-4 items-center">
          {[
            { id: 'overview', icon: 'dashboard', label: 'Tổng quan' },
            { id: 'products', icon: 'shopping_bag', label: 'Sản phẩm' },
            { id: 'orders', icon: 'shopping_cart', label: 'Đơn hàng' },
            { id: 'customers', icon: 'group', label: 'Người dùng' },
            { id: 'ai', icon: 'psychology', label: 'Phân tích AI' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex justify-center items-center size-10 rounded-xl transition-all relative group ${activeTab === item.id ? 'bg-primary/10 text-primary shadow-sm' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}
              title={item.label}
            >
              <span className={`material-symbols-outlined ${activeTab === item.id ? 'font-variation-fill' : ''}`}>{item.icon}</span>
              <div className="absolute left-full ml-4 px-3 py-1 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            </button>
          ))}
          
          <div className="w-8 h-px bg-slate-100 dark:bg-surface-border my-2"></div>
          
          <button
            onClick={() => onNavigate(Page.HOME)}
            className="flex justify-center items-center size-10 rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all"
            title="Thoát Admin"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-8 bg-white dark:bg-surface-dark border-b border-slate-200 dark:border-surface-border flex-shrink-0 z-10">
          <div className="flex items-center gap-10">
             <h2 className="text-xl font-black font-display tracking-tight uppercase">Admin Panel</h2>
             <div className="hidden lg:flex items-center gap-2">
                {[
                  { id: 'overview', label: 'Tổng quan' },
                  { id: 'products', label: 'Sản phẩm' },
                  { id: 'orders', label: 'Đơn hàng' },
                  { id: 'customers', label: 'Người dùng' },
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-5 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === tab.id ? 'text-primary bg-primary/10' : 'text-slate-400 hover:text-primary'}`}
                  >
                    {tab.label}
                  </button>
                ))}
             </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex max-w-sm w-64 text-left">
              <label className="relative flex w-full items-center group">
                <span className="absolute left-4 text-slate-400 group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-xl">search</span>
                </span>
                <input className="w-full h-10 pl-11 pr-4 rounded-full bg-slate-50 dark:bg-background-dark/50 border-none text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Tìm kiếm..." type="text"/>
              </label>
            </div>
            
            <div className="flex items-center gap-4 border-l border-slate-100 dark:border-surface-border pl-6 text-left">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full overflow-hidden border-2 border-primary/20">
                  <img src={user?.avatar} alt="Admin" className="size-full object-cover" />
                </div>
                <div className="hidden md:block">
                  <p className="text-xs font-black text-slate-900 dark:text-white uppercase leading-none">{user?.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {activeTab === 'overview' && (
            <div className="p-8 space-y-8 animate-in fade-in duration-500">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-surface-border rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`material-symbols-outlined p-3 rounded-2xl ${stat.color}`}>{stat.icon}</span>
                      <div className="flex items-center gap-1 text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">
                        <span className="material-symbols-outlined !text-[12px]">trending_up</span>
                        {stat.trend}
                      </div>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <h3 className="text-2xl font-black font-display tracking-tight text-slate-900 dark:text-white">{stat.value}</h3>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-surface-dark border border-slate-100 dark:border-surface-border rounded-[2.5rem] p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div className='text-left'>
                      <h3 className="text-lg font-black font-display text-slate-900 dark:text-white uppercase tracking-tight">Biểu đồ doanh thu</h3>
                      <p className="text-xs text-slate-400 font-medium">30 ngày qua (Phân tích bằng AI)</p>
                    </div>
                    <select className="bg-slate-50 dark:bg-background-dark/50 border-none rounded-xl text-[10px] font-black uppercase px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
                      <option>30 ngày qua</option>
                      <option>7 ngày qua</option>
                    </select>
                  </div>
                  
                  <div className="h-[280px] w-full relative group flex items-end justify-between px-4 pb-4">
                     {[40, 70, 45, 90, 65, 80, 50, 95, 60, 85, 40, 75].map((h, i) => (
                       <div key={i} className="w-[6%] group/bar relative">
                          <div 
                            className="w-full bg-primary/20 rounded-t-lg group-hover/bar:bg-primary transition-all duration-500" 
                            style={{ height: `${h}%` }}
                          ></div>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                            {h}M
                          </div>
                       </div>
                     ))}
                  </div>
                </div>

                {/* AI Impact */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-primary to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 bg-white/10 blur-[50px] size-40 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
                    <div className="relative z-10 text-center space-y-4">
                        <span className="material-symbols-outlined !text-[40px] font-variation-fill animate-sparkle">auto_awesome</span>
                        <h3 className="text-xs font-black uppercase tracking-widest">AI Performance Score</h3>
                        <div className="text-5xl font-black font-display">94.2</div>
                        <p className="text-[10px] text-white/70 leading-relaxed font-medium">Hệ thống AI đã giúp giảm 20% tỷ lệ hoàn đơn và tăng 15% doanh số chéo.</p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-surface-border rounded-[2.5rem] p-8 shadow-sm">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 text-left">Top Danh Mục</h3>
                    <div className="space-y-5">
                      {[
                        { label: 'Laptop', val: 75, color: 'bg-primary' },
                        { label: 'Smartphone', val: 60, color: 'bg-purple-500' },
                        { label: 'Âm thanh', val: 45, color: 'bg-orange-500' },
                      ].map((item, i) => (
                        <div key={i} className="space-y-2">
                           <div className="flex justify-between text-[10px] font-black uppercase">
                              <span>{item.label}</span>
                              <span>{item.val}%</span>
                           </div>
                           <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                              <div className={`h-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity Table */}
              <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-surface-border rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 dark:border-surface-border flex justify-between items-center">
                  <h3 className="text-lg font-black font-display text-slate-900 dark:text-white uppercase tracking-tight">Đơn hàng gần đây</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs font-black text-primary uppercase tracking-widest hover:underline">Xem tất cả</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-slate-50/50 dark:bg-background-dark/30">
                        <th className="py-4 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Mã đơn</th>
                        <th className="py-4 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Sản phẩm</th>
                        <th className="py-4 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Số tiền</th>
                        <th className="py-4 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-surface-border">
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                          <td className="py-5 px-8 text-xs font-black text-slate-900 dark:text-white">{order.id}</td>
                          <td className="py-5 px-8">
                             <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{order.product}</p>
                             <p className="text-[10px] text-slate-400 font-medium">Khách: {order.customer}</p>
                          </td>
                          <td className="py-5 px-8 text-xs font-black text-primary text-right">{order.amount}</td>
                          <td className="py-5 px-8 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white ${order.color}`}>
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
          )}
          {activeTab === 'orders' && <AdminOrders />}
          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'customers' && <AdminCustomers />}
        </div>

        {/* Footer */}
        <footer className="h-12 border-t border-slate-100 dark:border-surface-border flex items-center justify-between px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white dark:bg-surface-dark flex-shrink-0">
          <span>© 2024 TechStore AI Enterprise</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">V1.2.0-Stable</a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default AdminDashboard;
