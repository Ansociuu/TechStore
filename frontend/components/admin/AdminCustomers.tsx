
import React, { useState } from 'react';

const AdminCustomers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const customerStats = [
    { label: 'Tổng người dùng', value: '12,540', trend: '+5.2%', trendDesc: 'so với tháng trước', icon: 'group', color: 'text-primary bg-primary/10', trendUp: true },
    { label: 'Người dùng mới', value: '+350', trend: '+12%', trendDesc: 'tuần này', icon: 'person_add', color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30', trendUp: true },
    { label: 'Đang hoạt động', value: '8,200', trendDesc: 'Hiện tại đang online', icon: 'radio_button_checked', color: 'text-green-600 bg-green-100 dark:bg-green-900/30', trendUp: null },
    { label: 'Tài khoản bị khóa', value: '45', trendDesc: 'Cần xem xét', icon: 'block', color: 'text-red-600 bg-red-100 dark:bg-red-900/30', trendUp: false },
  ];

  const customers = [
    {
      id: '#USER-8832',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@gmail.com',
      phone: '0987 654 321',
      role: 'Khách hàng',
      segment: 'Tech Enthusiast',
      segmentIcon: 'smart_toy',
      status: 'Hoạt động',
      statusColor: 'text-green-700 bg-green-50 dark:bg-green-900/30',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBZ-uaHEeOIJul79lmjOWSYiJUoidasso7h5AFGnRXz9l1cma9r3PpNsKtB0CBiGwuIkuyCA8wgbZFgF4tUxY9qvz-UdYlYSBBQP-qopT4nI6t0ZeRyQiRKAqOu3DsEZy8E7ORuVOg2HW8pT48dFNfIN91rMWv2KrRIhY-j3mOzs-SjskyHvyQAMUtLpbG1K2WyqrmY2xPQmb_4k0zrDHcGmBfgHU-veYGqltiaoMsmeSYSPgg0-ghDaR28EXL-l3L9OfIRAngfAU'
    },
    {
      id: '#USER-9921',
      name: 'Trần Thị B',
      email: 'tranthib@techzone.vn',
      phone: '0912 345 678',
      role: 'Quản trị viên',
      segment: 'Staff',
      segmentIcon: 'shield',
      status: 'Hoạt động',
      statusColor: 'text-green-700 bg-green-50 dark:bg-green-900/30',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiNnvV5tnBax6SF4DjUyB3qWfcFxaUwnMaNivw7GYax8YOYUtXpgDkghXK-2-u2ZSyDWFzuBy3uyXb9TlZpfidhBbUbKVzGvSnfS0XI283EwB4Rq9N1aAd0m6FTF6NPjXQr3NSlJF2S0n6psU0tlRivmt3X0PjwDS_Dk91TnVB9sCqkNXdOXAEh75-w4lKndS0qEsKWS5li7NgkLIWTC8yY8fwtJv7G4le5EI88C380odKwmFfpztBBNE4wyuSZQUpHTAF4Lbk13w'
    },
    {
      id: '#USER-1102',
      name: 'Lê Hoàng',
      email: 'lehoang.game@gmail.com',
      phone: '0901 222 333',
      role: 'Khách hàng',
      segment: 'High Spender / Gamer',
      segmentIcon: 'sports_esports',
      status: 'Đã khóa',
      statusColor: 'text-red-700 bg-red-50 dark:bg-red-900/30',
      avatar: null
    },
    {
      id: '#USER-3421',
      name: 'Phạm Minh',
      email: 'phamminh@corp.vn',
      phone: '0933 111 222',
      role: 'Doanh nghiệp',
      segment: 'Office Setup',
      segmentIcon: 'business_center',
      status: 'Chờ duyệt',
      statusColor: 'text-gray-700 bg-gray-100 dark:bg-gray-700',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVymd7nFKOLuiNfO5bA02A3C4r8snmgJKhe9ieXQ0Tfvon-1_IPVxH77Cc_DwIyDVFvOQTMvetVNohVPTQHxO5eOvfaVB2XFdKt1AW2fsWe755IPDAHXqOoExRmtK2Bur3VlXazYzvbYLW51CoiFICDCPYIWJrSAUoemEew8hNCzwlm3OLs0o-jyweFC94LeAnpDIfj1BoRNUFNB2cTdKJzGkti35eaIzmOJn_RUMgWgu4FQZwbhMyZP3UecjHFHEG1gwWkvDVIto'
    }
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Page Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
            <span>Dashboard</span>
            <span className="material-symbols-outlined !text-[14px] mx-2">chevron_right</span>
            <span className="text-primary">Quản lý người dùng</span>
          </nav>
          <h1 className="text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white uppercase leading-none">Danh sách người dùng</h1>
          <p className="text-sm text-slate-400 mt-2 font-medium italic">Quản lý tài khoản và phân tích hành vi khách hàng với AI.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-surface-border text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined !text-[18px]">file_download</span>
            Export
          </button>
          <button className="px-5 py-2.5 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all flex items-center gap-2">
            <span className="material-symbols-outlined !text-[18px]">add</span>
            Thêm người dùng mới
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {customerStats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-surface-border rounded-3xl p-6 shadow-sm flex flex-col gap-1 hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className={`p-2 rounded-xl ${stat.color}`}>
                <span className="material-symbols-outlined !text-[20px]">{stat.icon}</span>
              </div>
            </div>
            <h3 className="text-2xl font-black font-display tracking-tight text-slate-900 dark:text-white mt-1">{stat.value}</h3>
            <div className="flex items-center gap-1 mt-1">
              {stat.trend && (
                <span className={`text-[10px] font-black flex items-center ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="material-symbols-outlined !text-[14px]">{stat.trendUp ? 'trending_up' : 'warning'}</span>
                  {stat.trend}
                </span>
              )}
              <span className="text-[10px] font-medium text-slate-400">{stat.trendDesc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-slate-100 dark:border-surface-border flex flex-wrap gap-4 items-center">
        <div className="flex-1 relative min-w-[300px] group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên, email hoặc ID..."
            className="w-full h-11 pl-12 pr-4 bg-slate-50 dark:bg-background-dark/50 border-none rounded-xl text-xs focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <select className="h-11 px-4 bg-slate-50 dark:bg-background-dark/50 border-none rounded-xl text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
            <option>Tất cả trạng thái</option>
            <option>Đang hoạt động</option>
            <option>Đã khóa</option>
            <option>Chờ duyệt</option>
          </select>
          <select className="h-11 px-4 bg-slate-50 dark:bg-background-dark/50 border-none rounded-xl text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
            <option>Phân khúc AI</option>
            <option>High Spender</option>
            <option>Tech Enthusiast</option>
            <option>Office Setup</option>
          </select>
          <button className="h-11 w-11 flex items-center justify-center rounded-xl border border-slate-100 dark:border-surface-border text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-surface-border rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-background-dark/30 border-b border-slate-100 dark:border-surface-border">
                <th className="py-5 px-8 w-12 text-center">
                   <input type="checkbox" className="size-4 rounded border-slate-300 dark:border-surface-border text-primary focus:ring-primary/20 bg-white dark:bg-black/20" />
                </th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Người dùng</th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Liên hệ</th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Vai trò</th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <div className="flex items-center gap-1">
                    AI Segment
                    <span className="material-symbols-outlined !text-[14px] text-slate-300 cursor-help" title="Phân tích dựa trên hành vi mua sắm">info</span>
                  </div>
                </th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Trạng thái</th>
                <th className="py-5 px-8 w-16 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-surface-border">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                  <td className="py-5 px-8 text-center">
                     <input type="checkbox" className="size-4 rounded border-slate-300 dark:border-surface-border text-primary focus:ring-primary/20 bg-white dark:bg-black/20" />
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-4">
                      <div className="size-11 rounded-full bg-slate-100 dark:bg-background-dark border border-slate-200 dark:border-surface-border overflow-hidden">
                        {c.avatar ? (
                          <img src={c.avatar} className="size-full object-cover" />
                        ) : (
                          <div className="size-full flex items-center justify-center text-[11px] font-black text-slate-500 bg-yellow-100">
                            {c.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 dark:text-white leading-tight">{c.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {c.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight">{c.email}</span>
                      <span className="text-[10px] text-slate-400 font-medium mt-0.5">{c.phone}</span>
                    </div>
                  </td>
                  <td className="py-5 px-8 text-xs font-bold text-slate-600 dark:text-slate-400">
                    <span className={c.role === 'Quản trị viên' ? 'text-primary' : ''}>{c.role}</span>
                  </td>
                  <td className="py-5 px-8">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-surface-border">
                       <span className={`material-symbols-outlined !text-[16px] ${c.segment === 'Staff' ? 'text-blue-500' : 'text-purple-500'}`}>{c.segmentIcon}</span>
                       {c.segment}
                    </span>
                  </td>
                  <td className="py-5 px-8">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${c.statusColor}`}>
                       {c.status}
                    </span>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-primary transition-all">
                        <span className="material-symbols-outlined !text-[18px]">edit</span>
                      </button>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-primary transition-all">
                        <span className="material-symbols-outlined !text-[18px]">visibility</span>
                      </button>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 transition-all">
                        <span className="material-symbols-outlined !text-[18px]">more_vert</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-slate-100 dark:border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 dark:bg-background-dark/30">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Hiển thị <span className="text-slate-900 dark:text-white">1-4</span> trong số <span className="text-slate-900 dark:text-white">12,540</span> kết quả
          </p>
          <div className="flex items-center gap-2">
            <button className="size-9 rounded-xl border border-slate-200 dark:border-surface-border flex items-center justify-center text-slate-400 hover:text-primary transition-all">
              <span className="material-symbols-outlined !text-[18px]">chevron_left</span>
            </button>
            <button className="size-9 rounded-xl bg-primary text-white text-[10px] font-black shadow-lg shadow-primary/20">1</button>
            <button className="size-9 rounded-xl text-[10px] font-black text-slate-500 hover:bg-slate-200 dark:hover:bg-white/5 transition-all">2</button>
            <button className="size-9 rounded-xl text-[10px] font-black text-slate-500 hover:bg-slate-200 dark:hover:bg-white/5 transition-all">3</button>
            <span className="text-slate-400 px-1">...</span>
            <button className="size-9 rounded-xl text-[10px] font-black text-slate-500 hover:bg-slate-200 dark:hover:bg-white/5 transition-all">125</button>
            <button className="size-9 rounded-xl border border-slate-200 dark:border-surface-border flex items-center justify-center text-slate-400 hover:text-primary transition-all">
              <span className="material-symbols-outlined !text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
