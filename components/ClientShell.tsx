'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import AboutUs from '@/components/AboutUs';
import Services from '@/components/Services';

const ClientShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showAbout, setShowAbout] = useState(false);
  const [showServices, setShowServices] = useState(false);

  // ensure only one overlay is visible at a time
  const openAbout = (v: boolean) => {
    setShowServices(false);
    setShowAbout(v);
  };

  const openServices = (v: boolean) => {
    setShowAbout(false);
    setShowServices(v);
  };

  const closeAll = () => {
    setShowAbout(false);
    setShowServices(false);
  };

  const isOverlayOpen = showAbout || showServices;

  return (
    <>
      <Navbar onShowAbout={openAbout} onShowServices={openServices} />
      <Sidebar />

      <main className="pt-16 pl-4 md:pl-20 lg:pl-20 transition-all duration-300 grow">
        {children}
      </main>

      <Footer />

      {/* Shared overlay for About and Services controlled from Navbar */}
      {isOverlayOpen && (
        <div className="fixed inset-0 z-80 pt-16 overflow-auto bg-white/90 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="flex justify-end">
              <button
                onClick={closeAll}
                className="p-2 rounded-md bg-white border border-gray-200 shadow hover:bg-gray-50 focus:outline-none"
                aria-label="Close overlay"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {showAbout && <AboutUs />}
            {showServices && <Services />}
          </div>
        </div>
      )}
    </>
  );
};

export default ClientShell;
