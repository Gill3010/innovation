import React from 'react';
import ResearchManager from '@/components/scientific/ResearchManager';
import PageShell from '@/components/PageShell';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export const metadata = {
  title: 'Research Manager - Scientific Assistant',
  description: 'Manage your research projects and scientific publications.',
};

export default function ResearchPage() {
  return (
    <PageShell>
      <ProtectedRoute>
        <ResearchManager />
      </ProtectedRoute>
    </PageShell>
  );
}
