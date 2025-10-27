'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/contexts/TranslationContext';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSelector from './LanguageSelector';

type NavbarProps = {
  onShowAbout?: (show: boolean) => void;
  onShowServices?: (show: boolean) => void;
};

const Navbar = ({ onShowAbout, onShowServices }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { translate } = useTranslation();
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const nav = document.querySelector('nav');
      
      if (nav && !nav.contains(target)) {
        setIsMobileMenuOpen(false);
      }
    };

    // Small delay to prevent immediate closing
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Close user menu when clicking outside
  useEffect(() => {
    if (!isUserMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (!target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };

    // Small delay to prevent immediate closing
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <>
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-60 sm:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Overlay for user menu dropdown */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-70 transition-opacity duration-300"
          onClick={() => setIsUserMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      
      <nav 
      className={`fixed top-0 left-0 right-0 z-70 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-slate-200/60' 
          : 'bg-white/80 backdrop-blur-md border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="shrink-0 flex items-center group">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                <span className="text-white text-lg font-bold">IP</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent leading-tight">
                  {translate('Innova Proyectos')}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {translate('Development & Consulting')}
                </span>
              </div>
            </Link>
          </div>

          {/* Language Selector - Desktop */}
          <div className="hidden lg:flex lg:items-center">
            <LanguageSelector />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-2">
            {onShowAbout ? (
              <button
                onClick={() => onShowAbout(true)}
                className="relative px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors duration-200 group whitespace-nowrap"
                type="button"
              >
                {translate('About')}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </button>
            ) : (
              <Link 
                href="/about" 
                className="relative px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors duration-200 group whitespace-nowrap"
              >
                {translate('About')}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            )}

            {onShowServices ? (
              <button
                onClick={() => onShowServices(true)}
                className="relative px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors duration-200 group whitespace-nowrap"
                type="button"
              >
                {translate('Services')}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </button>
            ) : (
              <Link 
                href="/services" 
                className="relative px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors duration-200 group whitespace-nowrap"
              >
                {translate('Services')}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            )}

            <Link 
              href="/dashboard" 
              className="relative px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors duration-200 group whitespace-nowrap"
            >
              {translate('Dashboard')}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>

            <Link 
              href="/research" 
              className="relative px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors duration-200 group whitespace-nowrap"
            >
              {translate('Research')}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>

            <Link 
              href="/library" 
              className="relative px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors duration-200 group whitespace-nowrap"
            >
              {translate('Library')}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>

            {/* Auth Section */}
            {isLoading ? (
              <div className="ml-4 px-6 py-2.5 text-slate-600 text-sm">
                {translate('Loading...')}
              </div>
            ) : user ? (
              <div className="ml-4 flex items-center gap-2">
                {/* User Menu */}
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {user.name || translate('Profile')}
                    <svg 
                      className={`w-4 h-4 transition-transform duration-300 ${isUserMenuOpen ? 'transform rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border-2 border-slate-200 overflow-hidden transition-all duration-300 ease-in-out z-80 ${
                      isUserMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}
                  >
                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 border-b border-slate-100"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {translate('View Profile')}
                    </Link>
                    
                    <button
                      onClick={async () => {
                        try {
                          await logout();
                          setIsUserMenuOpen(false);
                        } catch (error) {
                          console.error('Logout error:', error);
                        }
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      {translate('Log Out')}
                    </button>
                  </div>
                </div>

                <Link 
                  href="/contact" 
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  {translate('Contact')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            ) : (
              <div className="ml-4 flex items-center gap-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  {translate('Sign In')}
                </Link>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  {translate('Contact')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            )}
          </div>

          {/* Tablet Navigation with Horizontal Scroll */}
          <div className="hidden sm:flex lg:hidden flex-1 ml-6">
            <div className="flex overflow-x-auto scrollbar-hide space-x-2 py-2">
              <LanguageSelector />
              {onShowAbout ? (
                <button
                  onClick={() => onShowAbout(true)}
                  className="relative px-3 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors duration-200 group whitespace-nowrap shrink-0"
                  type="button"
                >
                  {translate('About')}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </button>
              ) : (
                <Link 
                  href="/about" 
                  className="relative px-3 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors duration-200 group whitespace-nowrap shrink-0"
                >
                  {translate('About')}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              )}

              {onShowServices ? (
                <button
                  onClick={() => onShowServices(true)}
                  className="relative px-3 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors duration-200 group whitespace-nowrap shrink-0"
                  type="button"
                >
                  {translate('Services')}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </button>
              ) : (
                <Link 
                  href="/services" 
                  className="relative px-3 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors duration-200 group whitespace-nowrap shrink-0"
                >
                  {translate('Services')}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              )}

              <Link 
                href="/dashboard" 
                className="relative px-3 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors duration-200 group whitespace-nowrap shrink-0"
              >
                {translate('Dashboard')}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>

              <Link 
                href="/research" 
                className="relative px-3 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors duration-200 group whitespace-nowrap shrink-0"
              >
                {translate('Research')}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>

              <Link 
                href="/library" 
                className="relative px-3 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors duration-200 group whitespace-nowrap shrink-0"
              >
                {translate('Library')}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>

              <Link 
                href="/contact" 
                className="ml-2 inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap shrink-0"
              >
                {translate('Contact')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              aria-label="Toggle menu"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-linear-to-b from-white to-slate-50 border-b border-slate-200/60 shadow-lg">
          <div className="px-4 pt-2 pb-4 max-h-96 overflow-y-auto scrollbar-hide">
            <div className="space-y-2">
              {/* Language Selector - Mobile */}
              <div className="px-4 py-3 border-b border-slate-200/60">
                <LanguageSelector />
              </div>
              {onShowAbout ? (
                <button
                  onClick={() => {
                    onShowAbout(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                  type="button"
                >
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {translate('About')}
                </button>
              ) : (
                <Link 
                  href="/about" 
                  className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {translate('About')}
                </Link>
              )}

              {onShowServices ? (
                <button
                  onClick={() => {
                    onShowServices(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                  type="button"
                >
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {translate('Services')}
                </button>
              ) : (
                <Link 
                  href="/services" 
                  className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {translate('Services')}
                </Link>
              )}

              <Link 
                href="/dashboard" 
                className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
                {translate('Dashboard')}
              </Link>

              <Link 
                href="/research" 
                className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                {translate('Research')}
              </Link>

              <Link 
                href="/library" 
                className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {translate('Library')}
              </Link>

              {/* Auth Section - Mobile */}
              <div className="border-t border-slate-200/60 pt-2 mt-2">
                {user ? (
                  <>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {user.name || translate('Profile')}
                      </div>
                      <svg 
                        className={`w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-transform duration-300 ${isUserMenuOpen ? 'transform rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu - Mobile */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out relative z-80 ${
                        isUserMenuOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="bg-slate-50 rounded-xl border-2 border-slate-200">
                        <Link
                          href="/profile"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 border-b border-slate-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {translate('View Profile')}
                        </Link>
                        
                        <button
                          onClick={async () => {
                            try {
                              await logout();
                              setIsUserMenuOpen(false);
                              setIsMobileMenuOpen(false);
                            } catch (error) {
                              console.error('Logout error:', error);
                            }
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-base font-semibold text-red-600 hover:bg-red-50 transition-all duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          {translate('Log Out')}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      {translate('Sign In')}
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      {translate('Sign Up')}
                    </Link>
                  </>
                )}
              </div>

              <Link 
                href="/contact" 
                className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-white bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-md transition-all duration-200 group mt-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {translate('Contact')}
                <svg className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

    </nav>
    </>
  );
};

export default Navbar;