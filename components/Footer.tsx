'use client';

import React, { useEffect, useState } from 'react';
import {
  FaLinkedinIn,
  FaWhatsapp,
  FaGithub,
} from 'react-icons/fa6';
import { useTranslation } from '@/contexts/TranslationContext';

interface SocialLink {
  icon: React.ReactElement;
  href: string;
  label: string;
  hoverColor: string;
  bgGradient: string;
}

const socialLinks: SocialLink[] = [
  {
    icon: <FaGithub className="w-6 h-6" />,
    href: 'https://github.com/Gill3010',
    label: 'GitHub Profile - Israel Samuels',
    hoverColor: 'hover:text-slate-200',
    bgGradient: 'hover:bg-linear-to-br hover:from-slate-700/40 hover:to-slate-800/20',
  },
  {
    icon: <FaLinkedinIn className="w-6 h-6" />,
    href: 'https://www.linkedin.com/in/israel-samuels-g-201419197/',
    label: 'LinkedIn Profile - Israel Samuels',
    hoverColor: 'hover:text-[#0A66C2]',
    bgGradient: 'hover:bg-linear-to-br hover:from-[#0A66C2]/20 hover:to-[#0A66C2]/5',
  },
  {
    icon: <FaWhatsapp className="w-6 h-6" />,
    href: 'https://wa.me/50765498362',
    label: 'Contact via WhatsApp',
    hoverColor: 'hover:text-[#25D366]',
    bgGradient: 'hover:bg-linear-to-br hover:from-[#25D366]/20 hover:to-[#25D366]/5',
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);
  const { translate } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <footer className="bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-300 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/2 translate-x-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main footer content */}
      <div 
        className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">IP</span>
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-white leading-tight">Innova Proyectos</h3>
                <span className="text-xs text-slate-400 font-medium">Development & Consulting</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
            Empowering the future through innovative solutions. We transform ideas into reality, creating meaningful impact in the digital world.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:info@innovaproyectos.com" className="text-slate-400 hover:text-blue-400 transition-colors">
                info@innovaproyectos.com
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
              {translate('Quick Links')}
            </h4>
            <ul className="space-y-2">
              {['About', 'Services', 'Projects', 'Contact'].map((item, index) => (
                <li 
                  key={item}
                  className="transition-all duration-300"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <a
                    href={`/${item.toLowerCase()}`}
                    className="group flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-200 text-sm"
                  >
                    <svg 
                      className="w-3 h-3 text-blue-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {translate(item)}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social links */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
              {translate('Connect With Us')}
            </h4>
            <div className="flex gap-3 flex-wrap">
              {socialLinks.map((social, index) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`group bg-slate-800/80 backdrop-blur-sm p-5 rounded-xl border-2 border-slate-700/50 
                    transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/20
                    ${social.hoverColor} ${social.bgGradient} hover:border-slate-500`}
                  style={{ 
                    transitionDelay: `${index * 80}ms`,
                  }}
                >
                  <div className="transition-transform duration-300 group-hover:scale-110">
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col items-center space-y-2 text-center">
            <p className="text-sm text-slate-400">
              © {currentYear} <span className="text-white font-semibold">Innova Proyectos</span>. {translate('All rights reserved')}.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-500">
              <a href="/privacy" className="hover:text-white transition-colors duration-200">
                {translate('Privacy Policy')}
              </a>
              <span className="text-slate-700">•</span>
              <a href="/terms" className="hover:text-white transition-colors duration-200">
                {translate('Terms of Service')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;