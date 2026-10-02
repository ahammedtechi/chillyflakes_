import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#172421] text-[#F1EFE5] border border-[#355247] shadow-forest text-xs font-light tracking-wide pointer-events-auto"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#8A9C82] flex-shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-[#8A9C82] flex-shrink-0" />}
          {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-[#A5B59E] flex-shrink-0" />}
          <span className="flex-1">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
