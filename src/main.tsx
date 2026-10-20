import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './i18n/config';
import './index.css';
import AppRoutes from './routes';
import { VendorAuthProvider } from './context/VendorAuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

// TanStack Query Client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Conditionally start MSW in development if VITE_USE_MOCKS !== 'false'
// Using dynamic import so mocks are never bundled into the production build
async function prepareApp(): Promise<void> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS !== 'false') {
    try {
      const { worker } = await import('./mocks/browser');
      await worker.start();
      console.info('[MSW] Mock Service Worker running for development.');
    } catch (err) {
      console.warn('[MSW] Failed to initialize Mock Service Worker:', err);
    }
  }
}

prepareApp().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <VendorAuthProvider>
            <AdminAuthProvider>
              <AppRoutes />
            </AdminAuthProvider>
          </VendorAuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  );
});
