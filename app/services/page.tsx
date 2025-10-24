import React from 'react';
import Services from '@/components/Services';
import PageShell from '@/components/PageShell';

export const metadata = {
  title: 'Services - Innova Proyectos',
  description: 'Services and solutions provided by Innova Proyectos.',
};

export default function ServicesPage() {
  return (
    <PageShell>
      <Services />
    </PageShell>
  );
}
