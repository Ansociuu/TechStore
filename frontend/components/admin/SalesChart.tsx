import React, { useState } from 'react';

interface SalesChartProps {
    data: any[];
}

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    if (!data || data.length === 0) return null;

    const maxVal = Math.max(...data.map(d => d.count), 5);
    const chartHeight = 150;
    const chartWidth = 400;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 30;
    const paddingBottom = 30;

    const getX = (index: number) => (index / (data.length - 1)) * (chartWidth - paddingLeft - paddingRight) + paddingLeft;
    const getY = (val: number) => chartHeight - (val / maxVal) * (chartHeight - paddingTop - paddingBottom) - paddingBottom;

    const points = data.map((d, i) => `${getX(i)},${getY(d.count)}`).join(' ');

    return (
        <div className="w-full bg-white dark:bg-surface-dark rounded-[2rem] p-8 border border-slate-100 dark:border-surface-border shadow-sm">
            <div className="flex justify-between items-center mb-8">
                <div className="space-y-1">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Xu hướng đơn hàng</h4>
                    <p className="text-[10px] font-bold text-slate-500">Thống kê số lượng trong 7 ngày qua</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-primary shadow-sm shadow-primary/40"></span>
                        <span className="text-[10px] font-black uppercase tracking-tight text-slate-600 dark:text-slate-400">Đơn hàng</span>
                    </div>
                </div>
            </div>

            <div className="relative">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
                    <defs>
                        <linearGradient id="chart-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="var(--primary)" />
                            <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                        <linearGradient id="chart-area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                        </linearGradient>
                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                            <feOffset dx="0" dy="4" result="offsetblur" />
                            <feComponentTransfer>
                                <feFuncA type="linear" slope="0.3" />
                            </feComponentTransfer>
                            <feMerge>
                                <feMergeNode />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Y-Axis Grid & Labels */}
                    {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => {
                        const val = Math.round(p * maxVal);
                        const y = getY(val);
                        return (
                            <g key={idx}>
                                <line
                                    x1={paddingLeft} y1={y}
                                    x2={chartWidth - paddingRight} y2={y}
                                    className="stroke-slate-100 dark:stroke-white/5"
                                    strokeWidth="1"
                                    strokeDasharray="4"
                                />
                                <text
                                    x={paddingLeft - 10}
                                    y={y}
                                    dominantBaseline="middle"
                                    textAnchor="end"
                                    className="text-[8px] fill-slate-400 font-bold"
                                >
                                    {val}
                                </text>
                            </g>
                        );
                    })}

                    {/* Area path */}
                    <path
                        d={`M${getX(0)},${chartHeight - paddingBottom} ${points} L${getX(data.length - 1)},${chartHeight - paddingBottom} Z`}
                        fill="url(#chart-area-gradient)"
                    />

                    {/* Line path */}
                    <polyline
                        fill="none"
                        stroke="url(#chart-gradient)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={points}
                        filter="url(#shadow)"
                    />

                    {/* Data Points & Interaction */}
                    {data.map((d, i) => {
                        const x = getX(i);
                        const y = getY(d.count);

                        return (
                            <g
                                key={i}
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className="cursor-pointer group"
                            >
                                {/* Transparent interaction area */}
                                <rect x={x - 15} y={paddingTop} width="30" height={chartHeight - paddingTop - paddingBottom} fill="transparent" />

                                {/* Value Tag (always visible but small, pops on hover) */}
                                <text
                                    x={x}
                                    y={y - 12}
                                    textAnchor="middle"
                                    className={`text-[9px] font-black transition-all duration-300 ${hoveredIndex === i ? 'fill-primary scale-110' : 'fill-slate-400'}`}
                                >
                                    {d.count}
                                </text>

                                {/* Point circle */}
                                <circle
                                    cx={x}
                                    cy={y}
                                    r={hoveredIndex === i ? "6" : "4"}
                                    className={`transition-all duration-300 ${hoveredIndex === i ? 'fill-white stroke-primary stroke-[3]' : 'fill-primary stroke-white dark:stroke-surface-dark stroke-2'}`}
                                />

                                {/* X-Axis Date Label */}
                                <text
                                    x={x}
                                    y={chartHeight - 10}
                                    textAnchor="middle"
                                    className={`text-[8px] font-bold transition-colors ${hoveredIndex === i ? 'fill-primary' : 'fill-slate-400'}`}
                                >
                                    {d.date}
                                </text>

                                {/* Tooltip */}
                                {hoveredIndex === i && (
                                    <g className="animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
                                        <rect
                                            x={x - 45}
                                            y={y - 55}
                                            width="90"
                                            height="35"
                                            rx="12"
                                            className="fill-slate-900/90 dark:fill-white/95 shadow-xl"
                                        />
                                        <text x={x} y={y - 42} textAnchor="middle" className="text-[8px] font-black uppercase tracking-tight fill-slate-400 dark:fill-slate-500">
                                            Doanh thu: {d.revenue.toLocaleString('vi-VN')}₫
                                        </text>
                                        <text x={x} y={y - 32} textAnchor="middle" className="text-[9px] font-black fill-white dark:fill-slate-900">
                                            {d.count} đơn hàng
                                        </text>
                                        {/* Tooltip Arrow */}
                                        <path d={`M${x - 4},${y - 20} L${x},${y - 15} L${x + 4},${y - 20}`} className="fill-slate-900/90 dark:fill-white/95" />
                                    </g>
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

export default SalesChart;
