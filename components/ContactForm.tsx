"use client";

import React, { useState } from "react";

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

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!form.email.trim()) e.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email.";
    if (!form.message.trim()) e.message = "Please enter a message.";
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
      // Try to POST to api/contact if exists; otherwise fallback to mailto
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess('Message sent — we will contact you shortly.');
        setForm(initialState);
      } else {
        // fallback to mailto if api isn't available
        const subject = encodeURIComponent(`Contact from ${form.name} — Innova Proyectos`);
        const body = encodeURIComponent(`Name: ${form.name}\nOrganization: ${form.organization}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
        window.location.href = `mailto:info@innovaproyectos.com?subject=${subject}&body=${body}`;
        setSuccess('Opened mail client as a fallback.');
        setForm(initialState);
      }
    } catch {
      // network error -> mailto fallback
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
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Us</h2>
      <p className="text-gray-600 mb-6">Fill the form and we will get back to you within 1-2 business days.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">Name</span>
          <input
            value={form.name}
            onChange={handleChange('name')}
            className={`mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-300' : 'border-gray-200'}`}
            placeholder="Your full name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && <span id="name-error" className="text-xs text-red-600 mt-1">{errors.name}</span>}
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">Email</span>
          <input
            value={form.email}
            onChange={handleChange('email')}
            className={`mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-300' : 'border-gray-200'}`}
            placeholder="you@company.com"
            type="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && <span id="email-error" className="text-xs text-red-600 mt-1">{errors.email}</span>}
        </label>
      </div>

      <label className="flex flex-col mt-4">
        <span className="text-sm font-medium text-gray-700">Organization (optional)</span>
        <input
          value={form.organization}
          onChange={handleChange('organization')}
          className="mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
          placeholder="Company or institution"
        />
      </label>

      <label className="flex flex-col mt-4">
        <span className="text-sm font-medium text-gray-700">Message</span>
        <textarea
          value={form.message}
          onChange={handleChange('message')}
          className={`mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.message ? 'border-red-300' : 'border-gray-200'}`}
          placeholder="Tell us briefly about your project or needs"
          rows={6}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && <span id="message-error" className="text-xs text-red-600 mt-1">{errors.message}</span>}
      </label>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Sending…' : 'Send Message'}
        </button>

        {success && <span className="text-sm text-green-600">{success}</span>}
      </div>
    </form>
  );
}
