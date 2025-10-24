'use client';

import React, { useEffect, useState } from 'react';
import {
  FaXTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaFacebookF,
  FaWhatsapp,
  FaGithub,
} from 'react-icons/fa6';

interface SocialLink {
  icon: React.ReactElement;
  href: string;
  label: string;
  hoverColor: string;
  bgGradient: string;
}

const socialLinks: SocialLink[] = [
  {
    icon: <FaXTwitter className="w-5 h-5" />,
    href: 'https://twitter.com/youraccount',
    label: 'Follow us on X (Twitter)',
    hoverColor: 'hover:text-[#1DA1F2]',
    bgGradient: 'hover:bg-gradient-to-br hover:from-[#1DA1F2]/20 hover:to-[#1DA1F2]/5',
  },
  {
    icon: <FaInstagram className="w-5 h-5" />,
    href: 'https://instagram.com/youraccount',
    label: 'Follow us on Instagram',
    hoverColor: 'hover:text-[#E4405F]',
    bgGradient: 'hover:bg-gradient-to-br hover:from-[#E4405F]/20 hover:to-[#833AB4]/5',
  },
  {
    icon: <FaLinkedinIn className="w-5 h-5" />,
    href: 'https://linkedin.com/company/yourcompany',
    label: 'Connect with us on LinkedIn',
    hoverColor: 'hover:text-[#0A66C2]',
    bgGradient: 'hover:bg-gradient-to-br hover:from-[#0A66C2]/20 hover:to-[#0A66C2]/5',
  },
  {
    icon: <FaFacebookF className="w-5 h-5" />,
    href: 'https://facebook.com/yourpage',
    label: 'Like us on Facebook',
    hoverColor: 'hover:text-[#1877F2]',
    bgGradient: 'hover:bg-gradient-to-br hover:from-[#1877F2]/20 hover:to-[#1877F2]/5',
  },
  {
    icon: <FaWhatsapp className="w-5 h-5" />,
    href: 'https://wa.me/yourphone',
    label: 'Contact us on WhatsApp',
    hoverColor: 'hover:text-[#25D366]',
    bgGradient: 'hover:bg-gradient-to-br hover:from-[#25D366]/20 hover:to-[#25D366]/5',
  },
  {
    icon: <FaGithub className="w-5 h-5" />,
    href: 'https://github.com/yourorganization',
    label: 'Check our GitHub',
    hoverColor: 'hover:text-slate-200',
    bgGradient: 'hover:bg-gradient-to-br hover:from-slate-700/40 hover:to-slate-800/20',
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <footer className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-300 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main footer content */}
      <div 
        className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">Innovation Platform</h3>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md">
              Empowering the future through innovative solutions. We transform ideas into reality,
              creating meaningful impact in the digital world.
            </p>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@innovaproyectos.com" className="hover:text-blue-400 transition-colors">
                  info@innovaproyectos.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick links section */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {['About', 'Services', 'Projects', 'Contact'].map((item, index) => (
                <li 
                  key={item}
                  className="transition-all duration-300"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <a
                    href={`/${item.toLowerCase()}`}
                    className="group flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-200"
                  >
                    <svg 
                      className="w-4 h-4 text-blue-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {item}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social links section */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              Connect With Us
            </h4>
            <p className="text-sm text-slate-400">
              Follow us on social media for updates and news
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-700/50 
                    transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20
                    ${social.hoverColor} ${social.bgGradient} hover:border-slate-600`}
                  style={{ 
                    transitionDelay: `${index * 50}ms`,
                    animation: isVisible ? 'none' : 'none'
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              <span>© {currentYear} Innovation Platform. All rights reserved.</span>
            </div>
            <div className="mt-4 md:mt-0">
              <ul className="flex flex-wrap gap-6 text-sm text-slate-400">
                <li>
                  <a
                    href="/privacy"
                    className="hover:text-white transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <svg className="w-4 h-4 text-slate-500 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="hover:text-white transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <svg className="w-4 h-4 text-slate-500 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;