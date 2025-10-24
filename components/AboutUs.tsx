'use client';

import React from 'react';

const AboutUs: React.FC = () => {
  const photoSrc = '/images/yo.jpeg';
  const resumeHref = '/resume/israel-cv.pdf';

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
      {/* Hero Section - Who we are */}
      <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100 mb-8">
        <div className="p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Innova Proyectos</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-10">
              We are a company specialized in designing and developing scalable digital infrastructures for
              educational institutions, research centers and organizations seeking to transform their
              technology footprint.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Mission</h3>
                <p className="text-gray-600 text-base">
                  To accelerate digital transformation through robust, secure and high-performance technology
                  solutions that support the strategic goals of our clients.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Vision</h3>
                <p className="text-gray-600 text-base">
                  To be the trusted technology partner in Latin America for organizations seeking world-class
                  digital solutions meeting international standards.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Values</h3>
                <p className="text-gray-600 text-base">
                  Innovation, technical excellence, transparent execution, commitment to security and focus on
                  measurable outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nuestro Fundador */}
      <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
          <div className="p-6 md:p-8 flex justify-center md:justify-start">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-lg ring-1 ring-gray-100">
              <img src={photoSrc} alt="Israel Samuels" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="md:col-span-2 p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Israel Samuels</h2>
            <p className="text-base text-gray-500 mb-6">CEO & Founder of Innova Proyectos</p>

            <p className="text-gray-700 leading-relaxed mb-6">
                Technology leader with extensive experience designing and delivering scalable digital infrastructures.
                Focused on delivering high-impact solutions for educational and enterprise clients.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Specialization</h3>
                <ul className="text-gray-600 text-sm space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Distributed systems architecture and resilient design</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Technical leadership and management of multidisciplinary teams</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Implementation of AI and Machine Learning solutions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Cybersecurity strategies and secure-by-design systems</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Key Experience</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Extensive experience delivering high-performance platforms, collaborating with international
                  teams and ensuring projects follow best practices in scalability, availability and security.
                  Proven track record defining technical roadmaps and driving cross-functional delivery.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <a
                href={resumeHref}
                download
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 font-medium text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4M21 12v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6" />
                </svg>
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;