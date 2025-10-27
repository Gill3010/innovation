import React from 'react';
import PageShell from '@/components/PageShell';

export const metadata = {
  title: 'Privacy Policy - Innova Proyectos',
  description: 'Privacy Policy for Innova Proyectos Scientific Research Platform.',
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
          
          <p className="text-slate-600 mb-8">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
              <p className="text-slate-700 leading-relaxed">
                Welcome to Innova Proyectos. We are committed to protecting your privacy and ensuring you have a positive experience on our platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our scientific research platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">2.1 Personal Information</h3>
                  <p className="text-slate-700 leading-relaxed">
                    We may collect personal information that you voluntarily provide to us when you:
                  </p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-2">
                    <li>Register for an account</li>
                    <li>Use our research and collaboration features</li>
                    <li>Contact us or communicate with us</li>
                    <li>Participate in academic events and forums</li>
                  </ul>
                  <p className="text-slate-700 leading-relaxed mt-3">
                    This may include your name, email address, institutional affiliation, research interests, and academic credentials.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">2.2 Usage Data</h3>
                  <p className="text-slate-700 leading-relaxed">
                    We automatically collect certain information when you access and use the platform, including:
                  </p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-2">
                    <li>Log and usage data (pages visited, features used, timestamps)</li>
                    <li>Device information (browser type, operating system, device identifiers)</li>
                    <li>IP address and general location information</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-slate-700 leading-relaxed mb-3">
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Provide, operate, and maintain our research platform</li>
                <li>Improve and personalize your experience</li>
                <li>Process and manage your research activities</li>
                <li>Send administrative information and updates</li>
                <li>Respond to your inquiries and provide support</li>
                <li>Detect, prevent, and address technical issues</li>
                <li>Comply with legal obligations and enforce our policies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Sharing and Disclosure</h2>
              <p className="text-slate-700 leading-relaxed mb-3">
                We do not sell your personal information. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf</li>
                <li><strong>Legal Requirements:</strong> To comply with applicable laws, regulations, or legal processes</li>
                <li><strong>Protection of Rights:</strong> To protect our rights, privacy, safety, or property</li>
                <li><strong>Academic Collaboration:</strong> With your consent, to facilitate research collaborations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Data Security</h2>
              <p className="text-slate-700 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Your Rights and Choices</h2>
              <p className="text-slate-700 leading-relaxed mb-3">
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Access to your personal information</li>
                <li>Correction of inaccurate or incomplete data</li>
                <li>Deletion of your personal information</li>
                <li>Objection to processing of your personal information</li>
                <li>Data portability of your information</li>
                <li>Withdrawal of consent where processing is based on consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Cookies and Tracking Technologies</h2>
              <p className="text-slate-700 leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. International Data Transfers</h2>
              <p className="text-slate-700 leading-relaxed">
                Your information may be transferred to and maintained on computers located outside of your country where data protection laws may differ. By using our platform, you consent to the transfer of your information to these facilities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Children's Privacy</h2>
              <p className="text-slate-700 leading-relaxed">
                Our platform is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Changes to This Privacy Policy</h2>
              <p className="text-slate-700 leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Contact Us</h2>
              <p className="text-slate-700 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-slate-50 p-6 rounded-xl mt-4">
                <p className="text-slate-900 font-semibold mb-2">Innova Proyectos</p>
                <p className="text-slate-700">Email: privacy@innovaproyectos.com</p>
                <p className="text-slate-700">Website: https://innovaproyectos.com</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
