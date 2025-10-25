'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';

const Services: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { translate } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
      {/* Header */}
      <div 
        className={`text-center mb-16 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">{translate('Our Solutions')}</h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto font-light leading-relaxed">
          We build high-performance technology platforms using agile methodologies and international
          standards. Our approach incorporates cutting-edge technologies such as Artificial
          Intelligence, Machine Learning and Cybersecurity.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div 
          className={`group bg-white border border-slate-200/60 rounded-3xl p-8 hover:shadow-2xl hover:border-blue-200 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '100ms' }}
        >
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 bg-linear-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Educational Platforms</h3>
          </div>
          <p className="text-slate-600 text-base mb-5 leading-relaxed">
            Online learning systems (LMS), academic management platforms and collaborative tools designed
            for educational institutions of all levels.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100/50 font-medium">
              Moodle
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100/50 font-medium">
              LMS
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100/50 font-medium">
              E-Learning
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100/50 font-medium">
              Academic Management
            </span>
          </div>
        </div>

        <div 
          className={`group bg-white border border-slate-200/60 rounded-3xl p-8 hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 bg-linear-to-br from-emerald-100 to-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Web & Mobile Applications</h3>
          </div>
          <p className="text-slate-600 text-base mb-5 leading-relaxed">
            Full-stack development of responsive web applications and native or hybrid mobile apps with
            optimized user experiences and scalable architectures.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100/50 font-medium">
              Full Stack
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100/50 font-medium">
              iOS & Android
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100/50 font-medium">
              React & Next.js
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100/50 font-medium">
              Progressive Web Apps
            </span>
          </div>
        </div>

        <div 
          className={`group bg-white border border-slate-200/60 rounded-3xl p-8 hover:shadow-2xl hover:border-violet-200 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 bg-linear-to-br from-violet-100 to-violet-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Publishing Platforms</h3>
          </div>
          <p className="text-slate-600 text-base mb-5 leading-relaxed">
            Editorial management systems, institutional repositories, OJS platforms for academic journals
            and digital publishing solutions for scholarly content.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 ring-1 ring-violet-100/50 font-medium">
              OJS
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 ring-1 ring-violet-100/50 font-medium">
              DSpace
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 ring-1 ring-violet-100/50 font-medium">
              WordPress
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 ring-1 ring-violet-100/50 font-medium">
              Institutional Repositories
            </span>
          </div>
        </div>

        <div 
          className={`group bg-white border border-slate-200/60 rounded-3xl p-8 hover:shadow-2xl hover:border-rose-200 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 bg-linear-to-br from-rose-100 to-rose-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">AI & Cybersecurity</h3>
          </div>
          <p className="text-slate-600 text-base mb-5 leading-relaxed">
            Implementation of Machine Learning workflows, model deployment and MLOps, secure-by-design
            systems, threat modeling and risk mitigation strategies.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 ring-1 ring-rose-100/50 font-medium">
              AI & ML
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 ring-1 ring-rose-100/50 font-medium">
              MLOps
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 ring-1 ring-rose-100/50 font-medium">
              Cybersecurity
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 ring-1 ring-rose-100/50 font-medium">
              Threat Modeling
            </span>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div 
        className={`bg-linear-to-br from-slate-50 to-blue-50/30 shadow-xl rounded-3xl overflow-hidden border border-slate-200/60 mb-12 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: '500ms' }}
      >
        <div className="p-8 md:p-12 relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl -z-10"></div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-10 text-center tracking-tight">{translate('Why Choose Us')}</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-14 h-14 bg-linear-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Proven Experience</h3>
                  <p className="text-slate-600 text-base leading-relaxed">
                    Successful track record delivering high-performance platforms for educational and research
                    institutions, collaborating with international teams.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-14 h-14 bg-linear-to-br from-emerald-100 to-emerald-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Cutting-edge Technology</h3>
                  <p className="text-slate-600 text-base leading-relaxed">
                    We use industry-leading technologies, including modern frameworks, cloud architectures and
                    AI-based solutions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-14 h-14 bg-linear-to-br from-violet-100 to-violet-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Multidisciplinary Teams</h3>
                  <p className="text-slate-600 text-base leading-relaxed">
                    Technical leadership and mentorship of specialized teams, coordinating development, design,
                    QA and operations professionals.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-14 h-14 bg-linear-to-br from-amber-100 to-amber-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Scalable Architectures</h3>
                  <p className="text-slate-600 text-base leading-relaxed">
                    We design resilient distributed systems that grow with your organization, ensuring high
                    availability and optimal performance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-14 h-14 bg-linear-to-br from-rose-100 to-rose-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Comprehensive Security</h3>
                  <p className="text-slate-600 text-base leading-relaxed">
                    We implement security strategies from day one, with threat modeling and best practices to
                    safeguard critical information.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-14 h-14 bg-linear-to-br from-indigo-100 to-indigo-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Agile Methodologies</h3>
                  <p className="text-slate-600 text-base leading-relaxed">
                    We apply agile frameworks that ensure transparency, iterative deliveries and fast
                    adaptation to change.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div 
        className={`bg-linear-to-br from-blue-600 via-blue-700 to-blue-800 shadow-2xl rounded-3xl overflow-hidden relative transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: '600ms' }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        
        <div className="p-8 md:p-12 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
            {translate('Ready to transform your digital infrastructure?')}
          </h2>
          <p className="text-blue-50 text-lg mb-8 max-w-3xl mx-auto font-light leading-relaxed">
  Let&apos;s discuss how we can help you achieve your technology goals with robust, scalable and
  secure solutions designed specifically for your organization.
</p>

          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:info@innovaproyectos.com"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold"
            >
              <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {translate('Contact Us')}
            </a>
            
            <a
              href="tel:+50766661234"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-blue-500/90 backdrop-blur-sm text-white rounded-xl shadow-lg hover:bg-blue-400 hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold"
            >
              <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {translate('Request Consultation')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;