import React from 'react';

const PageShell: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-gray-50 pt-24 landscape:pt-20 pb-12 landscape:pb-6 ${className}`}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 landscape:px-3">{children}</main>
    </div>
  );
};

export default PageShell;
