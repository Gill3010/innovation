import React from 'react';
import DashboardShell from '@/components/scientific/DashboardShell';
import PageShell from '@/components/PageShell';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export const metadata = {
  title: 'Research Dashboard - Scientific Assistant',
  description: 'Manage your research projects, publications, and collaborations.',
};

export default function DashboardPage() {
  return (
    <PageShell>
      <ProtectedRoute>
        <DashboardShell />
      </ProtectedRoute>
    </PageShell>
  );
}
