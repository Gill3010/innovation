import React from 'react';
import PageShell from '@/components/PageShell';
import CarouselSlide from '@/components/CarouselSlide';

export const metadata = {
  title: 'Projects - Innova Proyectos',
  description: 'Explore our featured projects and visuals in motion.',
};

export default function ProjectsPage() {
  return (
    <PageShell>
      <CarouselSlide />
    </PageShell>
  );
}
