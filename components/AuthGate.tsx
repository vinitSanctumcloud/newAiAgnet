// components/AuthGate.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import {
  initializeAuth,
  validateToken,
  selectIsAuthenticated,
  selectAuthLoading,
} from '@/store/slice/authSlice';
import { getToken } from '@/utils/authToken';
import type { AppDispatch } from '@/store';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAuthLoading = useSelector(selectAuthLoading);
  const [mounted, setMounted] = useState(false);
  const authChecked = useRef(false);

  const publicRoutePrefixes = [
    '/auth/login',
    '/auth/signup',
    '/auth/forgot-password',
    '/agent',
  ];

  const isPublicRoute = publicRoutePrefixes.some((prefix) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  useEffect(() => {
    setMounted(true);

    const checkAuth = async () => {
      if (authChecked.current) return; // Prevent multiple checks
      authChecked.current = true;

      const token = getToken();
      console.log('AuthGate: Token:', token, 'Pathname:', pathname, 'IsAuthenticated:', isAuthenticated);

      if (!token) {
        console.log('AuthGate: No token, redirecting to login if not public route');
        if (!isPublicRoute) {
          router.replace('/auth/login');
        }
        return;
      }

      dispatch(initializeAuth());
      try {
        await dispatch(validateToken()).unwrap();
        console.log('AuthGate: Token validated, isAuthenticated:', isAuthenticated);
        if (isPublicRoute && pathname.startsWith('/auth')) {
          console.log('AuthGate: Redirecting to dashboard from auth route');
          router.replace('/dashboard');
        }
      } catch (error) {
        console.error('AuthGate: Token validation failed:', error);
        if (!isPublicRoute) {
          router.replace('/auth/login');
        }
      }
    };

    checkAuth();
  }, [dispatch, router, pathname, isPublicRoute]);

  // Separate effect for handling authenticated state changes
  useEffect(() => {
    if (mounted && isAuthenticated && isPublicRoute && pathname.startsWith('/auth')) {
      console.log('AuthGate: User authenticated, redirecting to dashboard');
      router.replace('/dashboard');
    }
  }, [isAuthenticated, mounted, pathname, router, isPublicRoute]);

  const shouldShowLoader = !mounted || (isAuthLoading && !authChecked.current);
  console.log('AuthGate: shouldShowLoader:', shouldShowLoader, 'isAuthLoading:', isAuthLoading, 'authChecked:', authChecked.current);

  if (shouldShowLoader) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}