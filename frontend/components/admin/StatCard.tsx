import React from 'react';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: string;
    color: string;
    bg: string;
    trend?: {
        value: number;
        isUp: boolean;
    };
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color, bg, trend }) => (
    <div className="bg-white dark:bg-surface-dark p-6 rounded-[2rem] border border-slate-100 dark:border-surface-border shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow group">
        <div className={`size-12 rounded-2xl ${bg} ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
            <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
            <div className="flex items-baseline gap-2 mt-1">
                <p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p>
                {trend && (
                    <span className={`text-[10px] font-bold ${trend.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {trend.isUp ? '+' : '-'}{trend.value}%
                    </span>
                )}
            </div>
        </div>
    </div>
);

export default StatCard;
