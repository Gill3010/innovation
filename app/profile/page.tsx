'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageShell from '@/components/PageShell';
import UserProfile from '@/components/auth/UserProfile';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <PageShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            <p className="text-slate-600 font-medium">Cargando...</p>
          </div>
        </div>
      </PageShell>
    );
  }

  if (!user) {
    return null; // While redirecting
  }

  return (
    <PageShell className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-2xl">
        <UserProfile />
      </div>
    </PageShell>
  );
}

