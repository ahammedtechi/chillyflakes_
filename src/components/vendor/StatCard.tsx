import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Skeleton } from './Skeleton';

export interface StatCardChange {
  value: number;
  label?: string;
}

export interface StatCardProps {
  label: string;
  value: string | number;
  change?: StatCardChange;
  icon?: React.ReactNode;
  subtext?: string;
  isLoading?: boolean;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  icon,
  subtext,
  isLoading = false,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`p-5 sm:p-6 bg-white rounded-2xl border border-[#EAE5DB] shadow-xs space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-3 w-28" />
      </div>
    );
  }

  const renderTrend = () => {
    if (!change) return null;
    const isPositive = change.value > 0;
    const isNegative = change.value < 0;

    return (
      <div className="flex items-center gap-1.5 text-xs font-medium">
        <span
          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md ${
            isPositive
              ? 'bg-[#EAF1EA] text-[#2E4D34]'
              : isNegative
              ? 'bg-[#FFF0F0] text-[#C53030]'
              : 'bg-[#F5F2EC] text-[#637365]'
          }`}
        >
          {isPositive && <TrendingUp className="w-3 h-3" />}
          {isNegative && <TrendingDown className="w-3 h-3" />}
          {!isPositive && !isNegative && <Minus className="w-3 h-3" />}
          <span>
            {change.value > 0 ? `+${change.value}%` : `${change.value}%`}
          </span>
        </span>
        {change.label && (
          <span className="text-[#8E9B90] text-[11px] truncate">
            {change.label}
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      className={`p-5 sm:p-6 bg-white rounded-2xl border border-[#EAE5DB] shadow-xs hover:border-[#D1DDD0] transition-colors flex flex-col justify-between ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-xs sm:text-sm font-medium text-[#637365] leading-snug">
          {label}
        </span>
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-[#EAF1EA] text-[#2E4D34] flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="font-serif text-2xl sm:text-3xl font-bold text-[#223B28] tracking-tight">
          {value}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2">
          {renderTrend()}
          {subtext && (
            <span className="text-[11px] text-[#8E9B90]">{subtext}</span>
          )}
        </div>
      </div>
    </div>
  );
};
export default StatCard;
