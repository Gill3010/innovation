import React from 'react';
import AboutUs from '@/components/AboutUs';
import PageShell from '@/components/PageShell';

export const metadata = {
  title: 'About - Innova Proyectos',
  description: 'About Innova Proyectos — mission, vision, values and leadership.',
};

export default function AboutPage() {
  return (
    <PageShell>
      <AboutUs />
    </PageShell>
  );
}
