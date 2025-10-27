import React from 'react';
import PageShell from '@/components/PageShell';
import SuccessCasesMetrics from '@/components/SuccessCasesMetrics';

export const metadata = {
  title: 'Analytics - Innova Proyectos',
  description: 'View our success metrics and analytics dashboard.',
};

export default function AnalyticsPage() {
  return (
    <PageShell>
      <SuccessCasesMetrics />
    </PageShell>
  );
}

