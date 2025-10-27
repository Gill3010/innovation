import React from 'react';
import PageShell from '@/components/PageShell';

export const metadata = {
  title: 'Terms of Service - Innova Proyectos',
  description: 'Terms of Service for Innova Proyectos Scientific Research Platform.',
};

export default function TermsPage() {
  return (
    <PageShell>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">Terms of Service</h1>
          
          <p className="text-slate-600 mb-8">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-slate-700 leading-relaxed">
                By accessing or using Innova Proyectos, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Use License</h2>
              <p className="text-slate-700 leading-relaxed mb-3">
                Permission is granted to temporarily access and use Innova Proyectos for personal and academic research purposes. This license does not include:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Modifying or copying the platform materials</li>
                <li>Using the materials for commercial purposes without written authorization</li>
                <li>Attempting to reverse engineer any software contained on the platform</li>
                <li>Removing any copyright or proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. User Accounts</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">3.1 Account Creation</h3>
                  <p className="text-slate-700 leading-relaxed">
                    To access certain features of the platform, you must create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">3.2 Account Security</h3>
                  <p className="text-slate-700 leading-relaxed">
                    You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Academic Integrity and Use</h2>
              <p className="text-slate-700 leading-relaxed mb-3">
                You agree to use the platform in accordance with academic and professional standards, including:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Properly citing and attributing all sources and references</li>
                <li>Respecting intellectual property rights of others</li>
                <li>Not engaging in plagiarism, fabrication, or falsification</li>
                <li>Following ethical guidelines for research and collaboration</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. User Content</h2>
              <p className="text-slate-700 leading-relaxed mb-3">
                You retain ownership of any content you post or submit ("User Content"). By posting or submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, distribute, and display such content for the purpose of operating and promoting the platform.
              </p>
              <p className="text-slate-700 leading-relaxed">
                You represent and warrant that your User Content does not violate any third-party rights, including intellectual property rights, privacy rights, or publicity rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Prohibited Uses</h2>
              <p className="text-slate-700 leading-relaxed mb-3">
                You may not use the platform:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>In any way that violates any applicable law or regulation</li>
                <li>To transmit any malicious code, viruses, or harmful software</li>
                <li>To impersonate or attempt to impersonate another person or entity</li>
                <li>To engage in any automated use of the system that interferes with others</li>
                <li>To collect or store personal data about other users without their permission</li>
                <li>To spam, harass, or harm other users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Intellectual Property</h2>
              <p className="text-slate-700 leading-relaxed">
                The platform and its original content, features, and functionality are owned by Innova Proyectos and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Disclaimers</h2>
              <p className="text-slate-700 leading-relaxed mb-3">
                THE PLATFORM IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Warranties of merchantability, fitness for a particular purpose, and non-infringement</li>
                <li>Warranties that the platform will be uninterrupted, secure, or error-free</li>
                <li>Warranties regarding the accuracy, reliability, or availability of any content or information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-slate-700 leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Indemnification</h2>
              <p className="text-slate-700 leading-relaxed">
                You agree to defend, indemnify, and hold harmless Innova Proyectos and its officers, directors, employees, and agents from and against any claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including legal fees) arising from your use of the platform or violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Termination</h2>
              <p className="text-slate-700 leading-relaxed">
                We may terminate or suspend your account and access to the platform immediately, without prior notice, for any breach of these Terms of Service or for any conduct that we, in our sole discretion, deem harmful to other users, us, or third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Governing Law</h2>
              <p className="text-slate-700 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Innova Proyectos operates, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Changes to Terms</h2>
              <p className="text-slate-700 leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">14. Contact Information</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-slate-50 p-6 rounded-xl">
                <p className="text-slate-900 font-semibold mb-2">Innova Proyectos</p>
                <p className="text-slate-700">Email: legal@innovaproyectos.com</p>
                <p className="text-slate-700">Website: https://innovaproyectos.com</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">15. Academic Standards and Ethics</h2>
              <p className="text-slate-700 leading-relaxed">
                This platform is dedicated to advancing scientific research and academic collaboration. All users are expected to adhere to the highest standards of academic integrity, including accurate reporting, proper attribution, respect for intellectual property, and ethical conduct in research practices.
              </p>
            </section>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
