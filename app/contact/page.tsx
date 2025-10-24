import React from 'react';
import ContactForm from '@/components/ContactForm';
import PageShell from '@/components/PageShell';

export const metadata = {
  title: 'Contact - Innova Proyectos',
  description: 'Contact Innova Proyectos to discuss digital transformation and technology solutions.',
};

export default function ContactPage() {
  return (
    <PageShell>
      <ContactForm />
    </PageShell>
  );
}
