'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/contexts/TranslationContext';

interface MenuItem {
  icon: React.ReactElement;
  label: string;
  href: string;
  key: string;
}

interface SidebarProps {
  onNavigate?: (key: string) => void;
  activeKey?: string;
}

const menuItems: MenuItem[] = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    label: 'Home',
    href: '/',
    key: 'home',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    label: 'Analytics',
    href: '/analytics',
    key: 'analytics',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    label: 'Projects',
    href: '/projects',
    key: 'projects',
  },
];

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, activeKey }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const { translate } = useTranslation();

  // Handle screen resize
  const handleResize = useCallback(() => {
    const isMobileView = window.innerWidth < 768;
    setIsMobile(isMobileView);
    if (isMobileView) {
      setIsExpanded(false);
    }
  }, []);

  // Initialize client-side state after hydration
  useEffect(() => {
    // Use setTimeout to avoid cascading renders
    const timer = setTimeout(() => {
      setIsClient(true);
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      // Always start collapsed, user can expand if needed
      setIsExpanded(false);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  // Add resize listener
  useEffect(() => {
    if (!isClient) return;
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize, isClient]);

  // Handle keyboard navigation
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'b') {
      e.preventDefault();
      setIsExpanded(prev => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const handleItemClick = (item: MenuItem) => {
    if (onNavigate) {
      onNavigate(item.key);
    }
  };

  const isItemActive = (item: MenuItem) => {
    if (activeKey) {
      return activeKey === item.key;
    }
    return pathname === item.href;
  };

  return (
    <>
      {/* Overlay for mobile and desktop when sidebar is expanded */}
      {isClient && isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 cursor-pointer"
          onClick={() => setIsExpanded(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile: small fixed toggle when closed so users can open the menu */}
      {isClient && isMobile && !isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          aria-label="Open sidebar"
          className="fixed left-4 top-20 z-50 bg-white border border-gray-100 rounded-full p-2 shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bg-white border-r border-gray-100 
          transition-all duration-300 ease-in-out z-50
          ${!isClient 
            ? 'w-64 translate-x-0 h-[calc(100vh-4rem)]'
            : isMobile
              ? (isExpanded ? 'translate-x-0 w-64 h-[calc(100vh-4rem)] overflow-y-auto shadow-2xl' : '-translate-x-full')
              : (isExpanded ? 'w-64 translate-x-0 h-[calc(100vh-4rem)] shadow-lg' : 'w-20 translate-x-0 h-[calc(100vh-4rem)]')
          }
        `}
        aria-label="Sidebar navigation"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toggle button (visible when sidebar is open or on desktop) */}
        <button
          onClick={() => setIsExpanded(prev => !prev)}
          className={`absolute bg-white border border-gray-100 rounded-full p-1.5 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isClient ? '-right-3 top-4' : isMobile ? 'right-3 top-3' : '-right-3 top-4'}`}
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-expanded={isExpanded}
        >
          <svg
            className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Menu items */}
        <nav className="h-full py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.href}>
                {onNavigate ? (
                  <button
                    onClick={() => handleItemClick(item)}
                    className={`flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 w-full text-left
                      ${isItemActive(item) ? 'bg-blue-50 text-blue-600' : ''}
                      transition-colors duration-200
                    `}
                  >
                    <span className="inline-block">{item.icon}</span>
                    {isExpanded && (
                      <span className="ml-3 text-sm font-medium whitespace-nowrap">
                        {translate(item.label)}
                      </span>
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50
                      ${isItemActive(item) ? 'bg-blue-50 text-blue-600' : ''}
                      transition-colors duration-200
                    `}
                  >
                    <span className="inline-block">{item.icon}</span>
                    {isExpanded && (
                      <span className="ml-3 text-sm font-medium whitespace-nowrap">
                        {translate(item.label)}
                      </span>
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;