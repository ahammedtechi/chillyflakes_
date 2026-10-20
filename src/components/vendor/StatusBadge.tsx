import React from 'react';
import {
  Clock,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  FileEdit,
  EyeOff,
  Archive,
} from 'lucide-react';
import type { OrderStatus, AlertType } from '../../types/dashboard';
import type { ProductStatus } from '../../types/product';

export type BadgeVariant =
  | OrderStatus
  | AlertType
  | ProductStatus
  | 'pending'
  | 'success'
  | 'warning'
  | 'danger'
  | 'neutral';

export interface StatusBadgeProps {
  status: BadgeVariant;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  className = '',
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'draft':
        return {
          icon: <FileEdit className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
          bg: 'bg-[#F5F2EC]',
          text: 'text-[#637365]',
          border: 'border-[#EAE5DB]',
          defaultLabel: 'Draft',
        };
      case 'pending_review':
        return {
          icon: <Clock className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
          bg: 'bg-[#FAF3E0]',
          text: 'text-[#8A5A00]',
          border: 'border-[#F3E2B8]',
          defaultLabel: 'Waiting for review',
        };
      case 'approved':
        return {
          icon: <CheckCircle2 className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
          bg: 'bg-[#EAF1EA]',
          text: 'text-[#2E4D34]',
          border: 'border-[#D1DDD0]',
          defaultLabel: 'Live',
        };
      case 'rejected':
        return {
          icon: <XCircle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
          bg: 'bg-[#FFF0F0]',
          text: 'text-[#C53030]',
          border: 'border-[#FED7D7]',
          defaultLabel: 'Rejected',
        };
      case 'unpublished':
        return {
          icon: <EyeOff className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
          bg: 'bg-[#F4F4F5]',
          text: 'text-[#71717A]',
          border: 'border-[#E4E4E7]',
          defaultLabel: 'Unpublished',
        };
      case 'archived':
        return {
          icon: <Archive className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
          bg: 'bg-[#F5F5F5]',
          text: 'text-[#737373]',
          border: 'border-[#E5E5E5]',
          defaultLabel: 'Archived',
        };
      case 'pending':
        return {
          icon: <Clock className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
          bg: 'bg-[#FAF3E0]',
          text: 'text-[#8A5A00]',
          border: 'border-[#F3E2B8]',
          defaultLabel: 'Pending',
        };
      case 'processing':
        return {
          icon: <Package className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
          bg: 'bg-[#EBF3FC]',
          text: 'text-[#1D63B8]',
          border: 'border-[#C8E0FA]',
          defaultLabel: 'Processing',
        };
      case 'shipped':
        return {
          icon: <Truck className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
          bg: 'bg-[#F2EDFB]',
          text: 'text-[#6B3DB8]',
          border: 'border-[#DFD2F7]',
          defaultLabel: 'Shipped',
        };
      case 'delivered':
      case 'success':
        return {
          icon: <CheckCircle2 className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
          bg: 'bg-[#EAF1EA]',
          text: 'text-[#2E4D34]',
          border: 'border-[#D1DDD0]',
          defaultLabel: 'Delivered',
        };
      case 'cancelled':
      case 'danger':
      case 'error':
        return {
          icon: <XCircle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
          bg: 'bg-[#FFF0F0]',
          text: 'text-[#C53030]',
          border: 'border-[#FED7D7]',
          defaultLabel: 'Cancelled',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
          bg: 'bg-[#FAF3E0]',
          text: 'text-[#8A5A00]',
          border: 'border-[#F3E2B8]',
          defaultLabel: 'Warning',
        };
      case 'info':
        return {
          icon: <Info className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
          bg: 'bg-[#EBF3FC]',
          text: 'text-[#1D63B8]',
          border: 'border-[#C8E0FA]',
          defaultLabel: 'Info',
        };
      case 'neutral':
      default:
        return {
          icon: <AlertCircle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
          bg: 'bg-[#F5F2EC]',
          text: 'text-[#637365]',
          border: 'border-[#EAE5DB]',
          defaultLabel: 'Neutral',
        };
    }
  };

  const config = getBadgeConfig();
  const displayLabel = label || config.defaultLabel;

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[11px] gap-1'
      : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}
    >
      {config.icon}
      <span>{displayLabel}</span>
    </span>
  );
};
export default StatusBadge;
