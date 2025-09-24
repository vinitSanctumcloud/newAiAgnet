// app/layout.tsx

'use client';

import './globals.css';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
import store from '@/store';
import AuthGate from '@/components/AuthGate';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <Toaster 
            position="top-center" 
            richColors 
            closeButton 
            theme="light"
            toastOptions={{
              classNames: {
                toast: 'border border-gray-200 shadow-lg',
                title: 'font-medium',
                description: 'text-gray-600',
                actionButton: 'bg-blue-600',
                cancelButton: 'bg-gray-300'
              }
            }}
          />
          <AuthGate>{children}</AuthGate>
        </Provider>
      </body>
    </html>
  );
}