
import React from 'react';
import { Notification, Page } from '../types';

interface NotificationPopoverProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
  onNavigate: (page: Page) => void;
}

const NotificationPopover: React.FC<NotificationPopoverProps> = ({ 
  notifications, 
  onMarkAsRead, 
  onMarkAllAsRead, 
  onClose,
  onNavigate
}) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order': return 'package_2';
      case 'ai': return 'auto_awesome';
      case 'promo': return 'sell';
      default: return 'notifications';
    }
  };

  const getColor = (type: Notification['type']) => {
    switch (type) {
      case 'order': return 'text-blue-500 bg-blue-500/10';
      case 'ai': return 'text-primary bg-primary/10';
      case 'promo': return 'text-orange-500 bg-orange-500/10';
      default: return 'text-slate-500 bg-slate-500/10';
    }
  };

  return (
    <div className="absolute top-full right-0 mt-4 w-[360px] md:w-[420px] bg-white dark:bg-surface-dark border border-slate-200 dark:border-surface-border rounded-3xl shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
      <div className="p-6 border-b border-slate-100 dark:border-surface-border flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-black uppercase tracking-widest font-display">Thông báo</h3>
          {notifications.filter(n => !n.isRead).length > 0 && (
            <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              {notifications.filter(n => !n.isRead).length} mới
            </span>
          )}
        </div>
        <button 
          onClick={onMarkAllAsRead}
          className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
        >
          Đánh dấu đã đọc hết
        </button>
      </div>

      <div className="max-h-[480px] overflow-y-auto no-scrollbar">
        {notifications.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-surface-border">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                onClick={() => {
                  onMarkAsRead(n.id);
                  if (n.targetPage) {
                    onNavigate(n.targetPage);
                    onClose();
                  }
                }}
                className={`p-5 flex gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer relative ${!n.isRead ? 'bg-primary/5' : ''}`}
              >
                {!n.isRead && (
                  <div className="absolute top-6 right-6 size-2 bg-primary rounded-full"></div>
                )}
                <div className={`size-12 rounded-2xl flex-shrink-0 flex items-center justify-center ${getColor(n.type)}`}>
                  <span className={`material-symbols-outlined !text-[24px] ${n.type === 'ai' ? 'animate-sparkle font-variation-fill' : ''}`}>
                    {getIcon(n.type)}
                  </span>
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className={`text-sm tracking-tight ${!n.isRead ? 'font-black text-slate-900 dark:text-white' : 'font-bold text-slate-600 dark:text-slate-400'}`}>
                    {n.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {n.message}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-1">
                    {n.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center text-center px-10 gap-4">
            <div className="size-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-300">
              <span className="material-symbols-outlined !text-[32px]">notifications_off</span>
            </div>
            <p className="text-sm font-bold text-slate-400 italic">Không có thông báo nào dành cho bạn.</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-surface-border">
        <button 
          onClick={onClose}
          className="w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
        >
          Đóng cửa sổ
        </button>
      </div>
    </div>
  );
};

export default NotificationPopover;
