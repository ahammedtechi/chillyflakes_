import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load data',
  message = 'An unexpected error occurred while loading this section. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`text-center py-8 px-4 flex flex-col items-center justify-center max-w-sm mx-auto ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-[#FFF0F0] border border-[#FED7D7] text-[#C53030] flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>

      <h4 className="font-serif text-base font-bold text-[#223B28] mb-1">
        {title}
      </h4>

      <p className="text-xs text-[#637365] leading-relaxed mb-4">
        {message}
      </p>

      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};
export default ErrorState;
