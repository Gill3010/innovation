'use client';

import React from 'react';
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
}

const socialLinks: SocialLink[] = [
  {
    icon: <FaXTwitter className="w-5 h-5" />,
    href: 'https://twitter.com/youraccount',
    label: 'Follow us on X (Twitter)',
    hoverColor: 'hover:text-[#1DA1F2]',
  },
  {
    icon: <FaInstagram className="w-5 h-5" />,
    href: 'https://instagram.com/youraccount',
    label: 'Follow us on Instagram',
    hoverColor: 'hover:text-[#E4405F]',
  },
  {
    icon: <FaLinkedinIn className="w-5 h-5" />,
    href: 'https://linkedin.com/company/yourcompany',
    label: 'Connect with us on LinkedIn',
    hoverColor: 'hover:text-[#0A66C2]',
  },
  {
    icon: <FaFacebookF className="w-5 h-5" />,
    href: 'https://facebook.com/yourpage',
    label: 'Like us on Facebook',
    hoverColor: 'hover:text-[#1877F2]',
  },
  {
    icon: <FaWhatsapp className="w-5 h-5" />,
    href: 'https://wa.me/yourphone',
    label: 'Contact us on WhatsApp',
    hoverColor: 'hover:text-[#25D366]',
  },
  {
    icon: <FaGithub className="w-5 h-5" />,
    href: 'https://github.com/yourorganization',
    label: 'Check our GitHub',
    hoverColor: 'hover:text-gray-100',
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A1A3F] text-gray-300">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Innovation Platform</h3>
            <p className="text-gray-400 max-w-md">
              Empowering the future through innovative solutions. We transform ideas into reality,
              creating meaningful impact in the digital world.
            </p>
          </div>

          {/* Quick links section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              {['About', 'Services', 'Projects', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`/${item.toLowerCase()}`}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social links section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Connect With Us</h4>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`bg-gray-800 p-3 rounded-full transition-all duration-300 
                    ${social.hoverColor} hover:scale-110`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-sm text-gray-400">
              © {currentYear} Innovation Platform. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6 text-sm text-gray-400">
                <li>
                  <a
                    href="/privacy"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="hover:text-white transition-colors duration-200"
                  >
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