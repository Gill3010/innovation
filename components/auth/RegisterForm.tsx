'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onClose?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin, onClose }) => {
  const { register, isLoading } = useAuth();
  const { translate } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    affiliation: '',
    researchInterests: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      const userData = {
        name: formData.name,
        affiliation: formData.affiliation,
        researchInterests: formData.researchInterests
          ? formData.researchInterests.split(',').map(interest => interest.trim()).filter(interest => interest)
          : [],
      };

      await register(formData.email, formData.password, userData);
      if (onClose) onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear cuenta';
      setError(errorMessage);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 border border-gray-200">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">IP</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {translate('Create Account')}
          </h2>
          <p className="text-slate-600">
            {translate('Join our research community')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {translate('Full Name')} *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-slate-900 placeholder-slate-500"
              placeholder={translate('Enter your full name')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {translate('Email Address')} *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-slate-900 placeholder-slate-500"
              placeholder={translate('Enter your email')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {translate('Affiliation')}
            </label>
            <input
              type="text"
              value={formData.affiliation}
              onChange={(e) => handleInputChange('affiliation', e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-slate-900 placeholder-slate-500"
              placeholder={translate('University, Institution, Company')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {translate('Research Interests')}
            </label>
            <input
              type="text"
              value={formData.researchInterests}
              onChange={(e) => handleInputChange('researchInterests', e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-slate-900 placeholder-slate-500"
              placeholder={translate('AI, Machine Learning, Data Science (separated by commas)')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {translate('Password')} *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-slate-900 placeholder-slate-500"
              placeholder={translate('Create a password')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {translate('Confirm Password')} *
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-slate-900 placeholder-slate-500"
              placeholder={translate('Confirm your password')}
              required
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {translate('Creating Account...')}
              </div>
            ) : (
              translate('Create Account')
            )}
          </button>
        </form>

        <div className="mt-5 text-center">
          <p className="text-slate-600">
            {translate('Already have an account?')}{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              {translate('Sign in')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
