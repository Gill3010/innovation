import React from 'react';
import LibraryManager from '@/components/scientific/LibraryManager';
import PageShell from '@/components/PageShell';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export const metadata = {
  title: 'Research Library - Scientific Assistant',
  description: 'Manage your personal library of scientific papers and references.',
};

export default function LibraryPage() {
  return (
    <PageShell>
      <ProtectedRoute>
        <LibraryManager />
      </ProtectedRoute>
    </PageShell>
  );
}
