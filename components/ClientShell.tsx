'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';

const ClientShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Navbar />
      <Sidebar />

      <main className="pt-16 pl-4 md:pl-20 lg:pl-20 transition-all duration-300 grow">
        {children}
      </main>

      <Footer />
      <Chatbot />
    </>
  );
};

export default ClientShell;