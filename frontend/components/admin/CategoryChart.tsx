import React from 'react';

interface CategoryChartProps {
    data: { name: string; count: number }[];
}

const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
    if (!data || data.length === 0) return null;
    const total = data.reduce((sum, item) => sum + item.count, 0);

    // Simple colors for categories
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

    return (
        <div className="bg-white dark:bg-surface-dark rounded-[2rem] border border-slate-100 dark:border-surface-border p-8 shadow-sm">
            <h3 className="text-lg font-black font-display mb-6">Phân loại sản phẩm</h3>
            <div className="flex items-center gap-8">
                <div className="relative size-32 flex-shrink-0">
                    <svg viewBox="0 0 32 32" className="size-full -rotate-90">
                        {data.reduce((acc, item, i) => {
                            const percentage = (item.count / total) * 100;
                            const strokeDasharray = `${percentage} ${100 - percentage}`;
                            const strokeDashoffset = -acc.offset;

                            acc.elements.push(
                                <circle
                                    key={i}
                                    cx="16" cy="16" r="16"
                                    fill="none"
                                    stroke={colors[i % colors.length]}
                                    strokeWidth="6"
                                    strokeDasharray={strokeDasharray}
                                    strokeDashoffset={strokeDashoffset}
                                    pathLength="100"
                                />
                            );
                            acc.offset += percentage;
                            return acc;
                        }, { elements: [] as React.ReactNode[], offset: 0 }).elements}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-xl font-black">{total}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Sản phẩm</p>
                    </div>
                </div>
                <div className="flex-1 space-y-2">
                    {data.map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="size-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }}></span>
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{item.name}</span>
                            </div>
                            <span className="text-xs font-black">{Math.round((item.count / total) * 100)}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryChart;
