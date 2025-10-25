'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PageShell from '@/components/PageShell';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSwitchToRegister = () => {
    router.push('/register');
  };

  const handleClose = () => {
    router.push('/');
  };

  if (user) {
    return null; // or a loading spinner
  }

  return (
    <PageShell className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <LoginForm 
          onSwitchToRegister={handleSwitchToRegister}
          onClose={handleClose}
        />
        <div className="mt-6 text-center">
          <Link 
            href="/"
            className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </PageShell>
  );
}

