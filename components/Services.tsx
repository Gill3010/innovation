'use client';

import React from 'react';

const Services: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Solutions</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          We build high-performance technology platforms using agile methodologies and international
          standards. Our approach incorporates cutting-edge technologies such as Artificial
          Intelligence, Machine Learning and Cybersecurity.
        </p>
      </div>

      {/* Servicios Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Educational Platforms</h3>
          </div>
          <p className="text-gray-600 text-base mb-4">
            Online learning systems (LMS), academic management platforms and collaborative tools designed
            for educational institutions of all levels.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100 font-medium">
              Moodle
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100 font-medium">
              LMS
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100 font-medium">
              E-Learning
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100 font-medium">
              Academic Management
            </span>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Web & Mobile Applications</h3>
          </div>
            <p className="text-gray-600 text-base mb-4">
            Full-stack development of responsive web applications and native or hybrid mobile apps with
            optimized user experiences and scalable architectures.
          </p>
            <div className="flex flex-wrap gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-700 ring-1 ring-green-100 font-medium">
              Full Stack
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-700 ring-1 ring-green-100 font-medium">
              iOS & Android
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-700 ring-1 ring-green-100 font-medium">
              React & Next.js
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-700 ring-1 ring-green-100 font-medium">
              Progressive Web Apps
            </span>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Publishing Platforms</h3>
          </div>
          <p className="text-gray-600 text-base mb-4">
            Editorial management systems, institutional repositories, OJS platforms for academic journals
            and digital publishing solutions for scholarly content.
          </p>
            <div className="flex flex-wrap gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-purple-50 text-purple-700 ring-1 ring-purple-100 font-medium">
              OJS
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-purple-50 text-purple-700 ring-1 ring-purple-100 font-medium">
              DSpace
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-purple-50 text-purple-700 ring-1 ring-purple-100 font-medium">
              WordPress
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-purple-50 text-purple-700 ring-1 ring-purple-100 font-medium">
              Institutional Repositories
            </span>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 text-base mb-4">
            Implementation of Machine Learning workflows, model deployment and MLOps, secure-by-design
            systems, threat modeling and risk mitigation strategies.
          </p>
            <div className="flex flex-wrap gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-700 ring-1 ring-red-100 font-medium">
              AI & ML
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-700 ring-1 ring-red-100 font-medium">
              MLOps
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-700 ring-1 ring-red-100 font-medium">
              Cybersecurity
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-700 ring-1 ring-red-100 font-medium">
              Threat Modeling
            </span>
          </div>
        </div>
      </div>

  {/* Why Choose Us */}
      <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100 mb-8">
        <div className="p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose Us</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Proven Experience</h3>
                  <p className="text-gray-600 text-base">
                    Successful track record delivering high-performance platforms for educational and research
                    institutions, collaborating with international teams.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Cutting-edge Technology</h3>
                  <p className="text-gray-600 text-base">
                    We use industry-leading technologies, including modern frameworks, cloud architectures and
                    AI-based solutions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Multidisciplinary Teams</h3>
                  <p className="text-gray-600 text-base">
                    Technical leadership and mentorship of specialized teams, coordinating development, design,
                    QA and operations professionals.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Scalable Architectures</h3>
                  <p className="text-gray-600 text-base">
                    We design resilient distributed systems that grow with your organization, ensuring high
                    availability and optimal performance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Comprehensive Security</h3>
                  <p className="text-gray-600 text-base">
                    We implement security strategies from day one, with threat modeling and best practices to
                    safeguard critical information.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Agile Methodologies</h3>
                  <p className="text-gray-600 text-base">
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg rounded-2xl overflow-hidden">
        <div className="p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to transform your digital infrastructure?
          </h2>
          <p className="text-blue-50 text-lg mb-8 max-w-3xl mx-auto">
            Let’s discuss how we can help you achieve your technology goals with robust, scalable and
            secure solutions designed specifically for your organization.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:info@innovaproyectos.com"
              className="inline-flex items-center gap-3 px-6 py-3 bg-white text-blue-600 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Us
            </a>
            
            <a
              href="tel:+50766661234"
              className="inline-flex items-center gap-3 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-400 transition-all duration-200 font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Request Consultation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;