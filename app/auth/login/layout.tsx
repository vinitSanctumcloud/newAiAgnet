// app/auth/login/layout.tsx
'use client';

import { ReactNode } from 'react';

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  );
}