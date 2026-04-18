"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'customer' | 'admin';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // User belum login, redirect ke login
        router.push('/login');
        return;
      }

      if (requiredRole && user.role !== requiredRole) {
        // User tidak punya role yang sesuai, redirect ke halaman sesuai role
        if (user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/customer');
        }
        return;
      }
    }
  }, [user, isLoading, requiredRole, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          <p className="text-white mt-2">Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

  // Don't render children if user is not authenticated or doesn't have required role
  if (!user || (requiredRole && user.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}