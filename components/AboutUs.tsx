'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';

const AboutUs: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const photoSrc = '/images/yo.jpeg';
  const resumeHref = '/resume/israel-cv.pdf';
  const { translate } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
      {/* Hero Section - Who we are */}
      <div 
        className={`bg-linear-to-br from-slate-50 to-blue-50/30 shadow-lg rounded-3xl overflow-hidden border border-slate-200/60 mb-8 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: '100ms' }}
      >
        <div className="p-8 md:p-12 relative">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -z-10"></div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
            Innova Proyectos
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-slate-700 leading-relaxed mb-10 font-light">
              We are a company specialized in designing and developing scalable digital infrastructures for
              educational institutions, research centers and organizations seeking to transform their
              technology footprint.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                  <h3 className="text-lg font-bold text-slate-900">{translate('Mission')}</h3>
                </div>
                <p className="text-slate-600 text-base leading-relaxed">
                  To accelerate digital transformation through robust, secure and high-performance technology
                  solutions that support the strategic goals of our clients.
                </p>
              </div>
              
              <div className="group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                  <h3 className="text-lg font-bold text-slate-900">{translate('Vision')}</h3>
                </div>
                <p className="text-slate-600 text-base leading-relaxed">
                  To be the trusted technology partner in Latin America for organizations seeking world-class
                  digital solutions meeting international standards.
                </p>
              </div>
              
              <div className="group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                  <h3 className="text-lg font-bold text-slate-900">{translate('Values')}</h3>
                </div>
                <p className="text-slate-600 text-base leading-relaxed">
                  Innovation, technical excellence, transparent execution, commitment to security and focus on
                  measurable outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Founder Section */}
      <div 
        className={`bg-white shadow-xl rounded-3xl overflow-hidden border border-slate-200/60 backdrop-blur-sm transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: '300ms' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
          <div className="p-6 md:p-8 flex justify-center md:justify-start">
            <div className="relative group">
              <div className="absolute inset-0 bg-linear-to-br from-blue-600 to-blue-400 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-2xl ring-4 ring-white transform group-hover:scale-105 transition-transform duration-500 ease-out">
                <img src={photoSrc} alt="Israel Samuels" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 tracking-tight">
              Israel Samuels
            </h2>
            <p className="text-base text-blue-600 font-medium mb-6">CEO & Founder of Innova Proyectos</p>

            <p className="text-slate-700 leading-relaxed mb-6 font-light">
              Technology leader with extensive experience designing and delivering scalable digital infrastructures.
              Focused on delivering high-impact solutions for educational and enterprise clients.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {translate('Specialization')}
                </h3>
                <ul className="text-slate-600 text-sm space-y-3">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span>Distributed systems architecture and resilient design</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span>Technical leadership and management of multidisciplinary teams</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span>Implementation of AI and Machine Learning solutions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span>Cybersecurity strategies and secure-by-design systems</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {translate('Key Experience')}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Extensive experience delivering high-performance platforms, collaborating with international
                  teams and ensuring projects follow best practices in scalability, availability and security.
                  Proven track record defining technical roadmaps and driving cross-functional delivery.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <a
                href={resumeHref}
                download
                className="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-0.5 transition-all duration-300 font-semibold text-sm group"
              >
                <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4M21 12v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6" />
                </svg>
                {translate('Download Resume')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;