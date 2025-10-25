"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from '@/contexts/TranslationContext';

type FormState = {
  name: string;
  email: string;
  organization: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  organization: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { translate } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = translate("Please enter your name.");
    if (!form.email.trim()) e.email = translate("Please enter your email.");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = translate("Please enter a valid email.");
    if (!form.message.trim()) e.message = translate("Please enter a message.");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((s) => ({ ...s, [k]: e.target.value }));
    setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSuccess(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess(translate('Message sent — we will contact you shortly.'));
        setForm(initialState);
      } else {
        const subject = encodeURIComponent(`Contact from ${form.name} — Innova Proyectos`);
        const body = encodeURIComponent(`Name: ${form.name}\nOrganization: ${form.organization}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
        window.location.href = `mailto:info@innovaproyectos.com?subject=${subject}&body=${body}`;
        setSuccess(translate('Opened mail client as a fallback.'));
        setForm(initialState);
      }
    } catch {
      const subject = encodeURIComponent(`Contact from ${form.name} — Innova Proyectos`);
      const body = encodeURIComponent(`Name: ${form.name}\nOrganization: ${form.organization}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
      window.location.href = `mailto:info@innovaproyectos.com?subject=${subject}&body=${body}`;
      setSuccess('Opened mail client as a fallback.');
      setForm(initialState);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
      <div 
        className={`max-w-3xl mx-auto bg-linear-to-br from-white to-slate-50/50 p-8 md:p-10 rounded-3xl shadow-xl border border-slate-200/60 relative overflow-hidden transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-linear-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{translate('Contact Us')}</h2>
          </div>
          <p className="text-slate-600 font-light">{translate('Fill the form and we will get back to you within 1-2 business days.')}</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col group">
              <span className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {translate('Name')}
              </span>
              <input
                value={form.name}
                onChange={handleChange('name')}
                className={`px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.name ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 hover:border-slate-300'
                }`}
                placeholder={translate('Your full name')}
              />
              {errors.name && (
                <span className="text-xs text-rose-600 mt-2 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name}
                </span>
              )}
            </div>

            <div className="flex flex-col group">
              <span className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                {translate('Email')}
              </span>
              <input
                value={form.email}
                onChange={handleChange('email')}
                type="email"
                className={`px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.email ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 hover:border-slate-300'
                }`}
                placeholder={translate('you@company.com')}
              />
              {errors.email && (
                <span className="text-xs text-rose-600 mt-2 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col group">
            <span className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {translate('Organization')} <span className="text-slate-400 font-normal">({translate('optional')})</span>
            </span>
            <input
              value={form.organization}
              onChange={handleChange('organization')}
              className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-300 transition-all duration-200"
              placeholder={translate('Company or institution')}
            />
          </div>

          <div className="flex flex-col group">
            <span className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              {translate('Message')}
            </span>
            <textarea
              value={form.message}
              onChange={handleChange('message')}
              rows={6}
              className={`px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                errors.message ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 hover:border-slate-300'
              }`}
              placeholder={translate('Tell us briefly about your project or needs')}
            />
            {errors.message && (
              <span className="text-xs text-rose-600 mt-2 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.message}
              </span>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-300 font-semibold"
          >
            {submitting ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {translate('Sending…')}
              </>
            ) : (
              <>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                {translate('Send Message')}
              </>
            )}
          </button>

          {success && (
            <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-emerald-700">{success}</span>
            </div>
          )}
        </div>

        <div className="mt-10 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500 mb-4 font-medium">{translate('Or reach us directly:')}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="mailto:info@innovaproyectos.com"
              className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors duration-200 group"
            >
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              info@innovaproyectos.com
            </a>
            
            <a 
              href="tel:+50766661234"
              className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors duration-200 group"
            >
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              +507 6666 1234
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}