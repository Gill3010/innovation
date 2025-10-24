import React from 'react';
import AboutUs from '@/components/AboutUs';
import PageShell from '@/components/PageShell';

export const metadata = {
  title: 'About Us - Innova Proyectos',
  description: 'Learn about Innova Proyectos and our mission.',
};

export default function AboutPage() {
  return (
    <PageShell>
      <AboutUs />
    </PageShell>
  );
}