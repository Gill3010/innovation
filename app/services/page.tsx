import React from 'react';
import Services from '@/components/Services';
import PageShell from '@/components/PageShell';

export const metadata = {
  title: 'Services - Innova Proyectos',
  description: 'Explore our digital transformation and technology services.',
};

export default function ServicesPage() {
  return (
    <PageShell>
      <Services />
    </PageShell>
  );
}