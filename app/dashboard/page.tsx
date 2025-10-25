import React from 'react';
import DashboardShell from '@/components/scientific/DashboardShell';
import PageShell from '@/components/PageShell';

export const metadata = {
  title: 'Research Dashboard - Scientific Assistant',
  description: 'Manage your research projects, publications, and collaborations.',
};

export default function DashboardPage() {
  return (
    <PageShell>
      <DashboardShell />
    </PageShell>
  );
}
