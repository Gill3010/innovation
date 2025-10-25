'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, fallback }) => {
  const { user, isLoading } = useAuth();
  const { translate } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated and not loading
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <p className="text-slate-600 font-medium">{translate('Loading...')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // While redirecting, show a message or fallback
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl font-bold">IP</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {translate('Authentication Required')}
          </h1>
          <p className="text-slate-600 mb-4">
            {translate('Please sign in to access this page')}
          </p>
          <div className="animate-pulse text-blue-600">
            {translate('Redirecting to login...')}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
