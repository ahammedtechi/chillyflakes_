import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from '../ui/Button';

export interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: React.ReactNode;
}

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`text-center py-10 px-4 sm:px-6 flex flex-col items-center justify-center max-w-md mx-auto ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#EAE5DB] text-[#5F6D61] flex items-center justify-center mb-4 shadow-2xs">
        {icon || <PackageOpen className="w-7 h-7 text-[#8E9B90]" />}
      </div>

      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#223B28] mb-1.5">
        {title}
      </h3>

      {description && (
        <p className="text-xs sm:text-sm text-[#637365] leading-relaxed mb-5">
          {description}
        </p>
      )}

      {action && (
        <div>
          {action.href ? (
            <a href={action.href}>
              <Button variant="primary" size="sm" leftIcon={action.icon}>
                {action.label}
              </Button>
            </a>
          ) : (
            <Button
              variant="primary"
              size="sm"
              leftIcon={action.icon}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
export default EmptyState;
