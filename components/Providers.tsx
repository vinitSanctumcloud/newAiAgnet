// app/Providers.tsx
'use client';

import { Provider } from 'react-redux';
import store from '@/store'; // Use default import
import { Toaster } from 'sonner';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <Toaster richColors /> {/* Add Toaster for Sonner toasts */}
      {children}
    </Provider>
  );
}