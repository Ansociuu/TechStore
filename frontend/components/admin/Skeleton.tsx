import React from 'react';

interface SkeletonProps {
    className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
    <div className={`animate-pulse bg-slate-200 dark:bg-white/10 rounded-lg ${className}`}></div>
);

export const StatsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white dark:bg-surface-dark p-6 rounded-[2rem] border border-slate-100 dark:border-surface-border shadow-sm flex items-center gap-4">
                <Skeleton className="size-12 rounded-2xl" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-2 w-16" />
                    <Skeleton className="h-6 w-24" />
                </div>
            </div>
        ))}
    </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
    <div className="bg-white dark:bg-surface-dark rounded-[2rem] border border-slate-100 dark:border-surface-border p-8 shadow-sm">
        <div className="flex justify-between items-center mb-8">
            <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-10 w-64 rounded-xl" />
        </div>
        <div className="space-y-4">
            {Array.from({ length: rows }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-2xl" />
            ))}
        </div>
    </div>
);

export default Skeleton;
