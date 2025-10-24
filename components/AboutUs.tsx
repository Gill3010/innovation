'use client';

import React from 'react';

const AboutUs: React.FC = () => {
  const photoSrc = '/images/yo.jpeg'; // replace with your photo in /public/images or an external URL
  const resumeHref = '/resume/israel-cv.pdf'; // place the CV in public/resume/

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
      <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
          {/* Photo */}
          <div className="p-6 md:p-8 flex justify-center md:justify-start">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-lg ring-1 ring-gray-100">
              <img src={photoSrc} alt="Israel Samuels" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Main content */}
          <div className="md:col-span-2 p-6 md:p-8">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Israel Samuels</h2>
                <p className="mt-1 text-sm text-gray-500">CEO &amp; Founder of Innova Proyectos</p>
              </div>

              <div className="hidden md:flex items-center">
                <a
                  href={resumeHref}
                  download
                  className="inline-flex items-center gap-3 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4M21 12v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6" />
                  </svg>
                  <span className="text-sm font-medium">Download CV</span>
                </a>
              </div>
            </div>

            <p className="mt-6 text-gray-700 leading-relaxed">
              Tech leader specialized in designing scalable digital infrastructures for educational and research institutions. I
              lead teams to build high-performance platforms using agile methodologies and international standards. My work
              focuses on cutting-edge technologies including AI &amp; Machine Learning and Cybersecurity to deliver robust,
              maintainable and secure solutions.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Roles &amp; Skills</h3>
                <p className="mt-2 text-gray-600 text-sm">
                  Full Stack Developer · Mobile &amp; Web Apps Developer · Web Pages · Learning Platforms · Publication Platforms · Book Publishers
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {['Full Stack', 'Mobile & Web', 'Learning Platforms', 'AI & ML', 'Cybersecurity', 'Leadership'].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 ring-1 ring-gray-50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-800">Expertise & Leadership</h3>
                <ul className="mt-2 text-gray-600 text-sm space-y-2 list-inside list-disc">
                  <li><strong>Leadership:</strong> Technical leadership &amp; team mentoring for complex initiatives.</li>
                  <li><strong>Scalable Architecture:</strong> Design of resilient, distributed systems for education &amp; research.</li>
                  <li><strong>AI &amp; ML:</strong> Applied ML workflows, model deployment, MLOps practices.</li>
                  <li><strong>Cybersecurity:</strong> Secure-by-design systems, threat modeling and risk mitigation.</li>
                  <li><strong>Technical Leadership:</strong> Roadmaps, standards, and cross-functional delivery.</li>
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-800">Experience</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Extensive experience delivering high-performance platforms, collaborating with international teams and
                stakeholders, and ensuring projects follow best practices in scalability, availability and security.
              </p>
            </div>

            {/* CTA for small screens */}
            <div className="mt-6 md:hidden">
              <a
                href={resumeHref}
                download
                className="inline-flex items-center gap-3 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4M21 12v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6" />
                </svg>
                <span className="text-sm font-medium">Download CV</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
