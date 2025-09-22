// app/auth/layout.tsx
'use client';

import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className=" bg-gray-100">
      {children}
    </div>
  );
}