import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

export interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      setToasts((prev) => [...prev, { id, type, message }]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  const success = useCallback((msg: string) => showToast(msg, 'success'), [showToast]);
  const error = useCallback((msg: string) => showToast(msg, 'error'), [showToast]);
  const warning = useCallback((msg: string) => showToast(msg, 'warning'), [showToast]);
  const info = useCallback((msg: string) => showToast(msg, 'info'), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      {/* Toast container */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((toast) => {
          const config = {
            success: {
              icon: <CheckCircle2 className="w-4 h-4 text-[#2E4D34]" />,
              bg: 'bg-[#EAF1EA]',
              border: 'border-[#D1DDD0]',
              text: 'text-[#223B28]',
            },
            error: {
              icon: <AlertCircle className="w-4 h-4 text-[#C53030]" />,
              bg: 'bg-[#FFF0F0]',
              border: 'border-[#FED7D7]',
              text: 'text-[#9B2C2C]',
            },
            warning: {
              icon: <AlertTriangle className="w-4 h-4 text-[#8A5A00]" />,
              bg: 'bg-[#FAF3E0]',
              border: 'border-[#F3E2B8]',
              text: 'text-[#684400]',
            },
            info: {
              icon: <Info className="w-4 h-4 text-[#1D63B8]" />,
              bg: 'bg-[#EBF3FC]',
              border: 'border-[#C8E0FA]',
              text: 'text-[#103D73]',
            },
          }[toast.type];

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl border shadow-md transition-all animate-fadeIn ${config.bg} ${config.border} ${config.text}`}
            >
              <div className="flex items-center gap-2.5 text-xs font-medium">
                {config.icon}
                <span>{toast.message}</span>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="opacity-60 hover:opacity-100 p-0.5 rounded transition-opacity"
                aria-label="Dismiss toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
