'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { selectAuthLoading, selectIsAuthenticated } from '@/store/slice/authSlice';
import type { RootState } from '@/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state));
  const isLoading = useSelector((state: RootState) => selectAuthLoading(state));
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div> 
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}