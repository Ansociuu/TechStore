
import React, { useState } from 'react';

const AdminOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const orderStats = [
    { label: 'Doanh thu hôm nay', value: '25.400.000 đ', trend: '+12%', icon: 'payments', trendUp: true },
    { label: 'Tổng đơn hàng', value: '18', trend: '+5%', icon: 'shopping_bag', trendUp: true },
    { label: 'Cần xử lý gấp', value: '5', trend: 'High priority', icon: 'pending_actions', trendUp: false },
  ];

  const orders = [
    {
      id: '#ORD-2023-0891',
      customer: { name: 'Nguyễn Văn An', email: 'an.nguyen@email.com', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH4yVze214xUWhLjdxBSu9W7WULFBGY8F5vwYo3SW-iWPq_NJZH_dsXgkXCmVppnTO2vkXGBJKOxR5xkBQ4nK-DW18IcVYANHz_Veer973NOA927RGtLJ-8t5zIdszxzyn6jV-kSilQwB9k1S44Qmfa2hWWMBmlPFq63P4UI9K6qCPtdeQap60hWT2UjGsN-4tprL_wC1zxLjiT18R5UP6kiLSwdu6ryZzNxTrCW1Tjsyoeb_JAXm8Kd6vF6dKBkXiqHqiBKe_38s' },
      date: '20/10/2023',
      time: '10:45 AM',
      total: '25.990.000 đ',
      payment: 'COD',
      status: 'Đang giao',
      statusColor: 'text-blue-500 bg-blue-500/10',
      aiInsight: 'diamond'
    },
    {
      id: '#ORD-2023-0890',
      customer: { name: 'Trần Thị Lan', email: 'lan.tran@email.com', avatar: '' },
      date: '20/10/2023',
      time: '09:12 AM',
      total: '4.500.000 đ',
      payment: 'Ví Momo',
      status: 'Chờ xử lý',
      statusColor: 'text-yellow-600 bg-yellow-600/10',
      aiInsight: null
    },
    {
      id: '#ORD-2023-0889',
      customer: { name: 'Lê Hoàng Nam', email: 'nam.le@email.com', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH4yVze214xUWhLjdxBSu9W7WULFBGY8F5vwYo3SW-iWPq_NJZH_dsXgkXCmVppnTO2vkXGBJKOxR5xkBQ4nK-DW18IcVYANHz_Veer973NOA927RGtLJ-8t5zIdszxzyn6jV-kSilQwB9k1S44Qmfa2hWWMBmlPFq63P4UI9K6qCPtdeQap60hWT2UjGsN-4tprL_wC1zxLjiT18R5UP6kiLSwdu6ryZzNxTrCW1Tjsyoeb_JAXm8Kd6vF6dKBkXiqHqiBKe_38s' },
      date: '19/10/2023',
      time: '16:30 PM',
      total: '125.000.000 đ',
      payment: 'Chuyển khoản',
      status: 'Đã giao',
      statusColor: 'text-green-500 bg-green-500/10',
      aiInsight: 'warning'
    },
    {
      id: '#ORD-2023-0888',
      customer: { name: 'Đỗ Kim', email: 'kim.do@email.com', avatar: '' },
      date: '19/10/2023',
      time: '14:00 PM',
      total: '1.250.000 đ',
      payment: 'COD',
      status: 'Đã hủy',
      statusColor: 'text-red-500 bg-red-500/10',
      aiInsight: null
    },
    {
      id: '#ORD-2023-0887',
      customer: { name: 'Phạm Thu Hà', email: 'ha.pham@email.com', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH4yVze214xUWhLjdxBSu9W7WULFBGY8F5vwYo3SW-iWPq_NJZH_dsXgkXCmVppnTO2vkXGBJKOxR5xkBQ4nK-DW18IcVYANHz_Veer973NOA927RGtLJ-8t5zIdszxzyn6jV-kSilQwB9k1S44Qmfa2hWWMBmlPFq63P4UI9K6qCPtdeQap60hWT2UjGsN-4tprL_wC1zxLjiT18R5UP6kiLSwdu6ryZzNxTrCW1Tjsyoeb_JAXm8Kd6vF6dKBkXiqHqiBKe_38s' },
      date: '19/10/2023',
      time: '10:15 AM',
      total: '8.990.000 đ',
      payment: 'Thẻ tín dụng',
      status: 'Đang giao',
      statusColor: 'text-blue-500 bg-blue-500/10',
      aiInsight: 'auto_graph'
    }
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Page Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white uppercase leading-none">Quản lý đơn hàng</h1>
          <p className="text-sm text-slate-400 mt-2 font-medium italic">Theo dõi, xử lý và cập nhật trạng thái đơn hàng trên toàn hệ thống.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-surface-border text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined !text-[18px]">download</span>
            Xuất báo cáo
          </button>
          <button className="px-5 py-2.5 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all flex items-center gap-2">
            <span className="material-symbols-outlined !text-[18px]">add</span>
            Tạo đơn mới
          </button>
        </div>
      </div>

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {orderStats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-surface-border rounded-3xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden group">
             <div className="absolute right-0 top-0 size-24 bg-slate-100 dark:bg-white/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest relative z-10">{stat.label}</p>
             <div className="flex items-baseline gap-3 relative z-10">
                <h3 className="text-2xl font-black font-display tracking-tight">{stat.value}</h3>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${stat.trendUp ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
                   {stat.trend}
                </span>
             </div>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-slate-100 dark:border-surface-border flex flex-wrap gap-4 items-center">
        <div className="flex-1 relative min-w-[300px]">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input 
            type="text" 
            placeholder="Tìm theo mã đơn, tên khách hàng, email..."
            className="w-full h-11 pl-12 pr-4 bg-slate-50 dark:bg-background-dark/50 border-none rounded-xl text-xs focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <select className="h-11 px-4 bg-slate-50 dark:bg-background-dark/50 border-none rounded-xl text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
            <option>Tất cả trạng thái</option>
            <option>Chờ xử lý</option>
            <option>Đang giao</option>
            <option>Hoàn thành</option>
            <option>Đã hủy</option>
          </select>
          <button className="h-11 px-5 bg-slate-50 dark:bg-background-dark/50 border-none rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined !text-[18px]">calendar_today</span>
            Tháng này
          </button>
          <button className="h-11 px-5 bg-slate-50 dark:bg-background-dark/50 border-none rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined !text-[18px]">filter_list</span>
            Lọc thêm
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-surface-border rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-background-dark/30 border-b border-slate-100 dark:border-surface-border">
                <th className="py-5 px-8 w-12">
                   <input type="checkbox" className="size-4 rounded border-slate-300 dark:border-surface-border text-primary focus:ring-primary/20 bg-white dark:bg-black/20" />
                </th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Mã đơn hàng</th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Khách hàng</th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Ngày đặt</th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Tổng giá trị</th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Thanh toán</th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Trạng thái</th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">AI Insights</th>
                <th className="py-5 px-8 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-surface-border">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                  <td className="py-5 px-8">
                     <input type="checkbox" className="size-4 rounded border-slate-300 dark:border-surface-border text-primary focus:ring-primary/20 bg-white dark:bg-black/20" />
                  </td>
                  <td className="py-5 px-8 text-xs font-black text-primary hover:underline cursor-pointer">{order.id}</td>
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-slate-100 dark:bg-background-dark border border-slate-200 dark:border-surface-border overflow-hidden">
                        {order.customer.avatar ? (
                          <img src={order.customer.avatar} className="size-full object-cover" />
                        ) : (
                          <div className="size-full flex items-center justify-center text-[10px] font-black text-slate-400 bg-slate-200 dark:bg-white/10">
                            {order.customer.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-900 dark:text-white leading-tight">{order.customer.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{order.customer.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight">{order.date}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{order.time}</span>
                    </div>
                  </td>
                  <td className="py-5 px-8 text-xs font-black text-slate-900 dark:text-white">{order.total}</td>
                  <td className="py-5 px-8 text-xs font-medium text-slate-500">{order.payment}</td>
                  <td className="py-5 px-8">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${order.statusColor}`}>
                       <span className="size-1.5 rounded-full bg-current"></span>
                       {order.status}
                    </span>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex justify-center">
                       {order.aiInsight ? (
                         <div className="size-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-primary group/tooltip relative cursor-help transition-all hover:bg-primary/10">
                           <span className={`material-symbols-outlined !text-[18px] ${order.aiInsight === 'warning' ? 'text-orange-500' : order.aiInsight === 'diamond' ? 'text-purple-500 font-variation-fill' : 'text-primary'}`}>
                             {order.aiInsight}
                           </span>
                           <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl border border-white/10">
                             {order.aiInsight === 'diamond' ? 'Khách hàng VIP tiềm năng' : order.aiInsight === 'warning' ? 'Đơn giá trị lớn bất thường' : 'Tỷ lệ quay lại cao'}
                           </div>
                         </div>
                       ) : (
                         <span className="text-slate-300 dark:text-slate-600">—</span>
                       )}
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <button className="text-slate-400 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined !text-[20px]">more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-slate-100 dark:border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 dark:bg-background-dark/30">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hiển thị <span className="text-slate-900 dark:text-white">1-5</span> của <span className="text-slate-900 dark:text-white">124</span> đơn hàng</p>
          <div className="flex items-center gap-2">
            <button className="size-9 rounded-xl border border-slate-200 dark:border-surface-border flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all disabled:opacity-30">
              <span className="material-symbols-outlined !text-[18px]">chevron_left</span>
            </button>
            {[1, 2, 3, '...', 12].map((p, i) => (
              <button 
                key={i}
                className={`size-9 rounded-xl text-[10px] font-black transition-all ${p === 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-white/5'}`}
              >
                {p}
              </button>
            ))}
            <button className="size-9 rounded-xl border border-slate-200 dark:border-surface-border flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all">
              <span className="material-symbols-outlined !text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
