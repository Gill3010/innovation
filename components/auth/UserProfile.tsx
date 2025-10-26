'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';

const UserProfile: React.FC = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const { translate } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    affiliation: user?.affiliation || '',
    orcidId: user?.orcidId || '',
    googleScholarId: user?.googleScholarId || '',
    researchInterests: user?.researchInterests?.join(', ') || '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const userData = {
        name: formData.name,
        affiliation: formData.affiliation,
        orcidId: formData.orcidId,
        googleScholarId: formData.googleScholarId,
        researchInterests: formData.researchInterests
          ? formData.researchInterests.split(',').map(interest => interest.trim()).filter(interest => interest)
          : [],
      };

      await updateUserProfile(userData);
      setSuccess(translate('Profile updated successfully!'));
      setIsEditing(false);
      
      setTimeout(() => setSuccess(null), 5000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar perfil';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      affiliation: user?.affiliation || '',
      orcidId: user?.orcidId || '',
      googleScholarId: user?.googleScholarId || '',
      researchInterests: user?.researchInterests?.join(', ') || '',
    });
    setIsEditing(false);
    setError(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
      <div 
        className={`max-w-3xl mx-auto bg-linear-to-br from-white to-slate-50/50 p-8 md:p-10 rounded-3xl shadow-xl border border-slate-200/60 relative overflow-hidden transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{translate('Profile')}</h2>
                <p className="text-slate-600 font-light text-sm">{translate('Manage your account information')}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-300 font-semibold text-sm"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {translate('Saving...')}
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {translate('Save')}
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 font-semibold text-sm"
                  >
                    {translate('Cancel')}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all duration-200 font-semibold text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {translate('Edit Profile')}
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl">
            <svg className="w-5 h-5 text-rose-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-rose-700">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-emerald-700">{success}</span>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex flex-col group">
            <span className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {translate('Name')}
            </span>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-300 transition-all duration-200"
              />
            ) : (
              <p className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900">{user.name || translate('Not specified')}</p>
            )}
          </div>

          <div className="flex flex-col group">
            <span className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              {translate('Email')}
            </span>
            <p className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900">{user.email}</p>
          </div>

          <div className="flex flex-col group">
            <span className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {translate('Affiliation')}
            </span>
            {isEditing ? (
              <input
                type="text"
                value={formData.affiliation}
                onChange={(e) => setFormData(prev => ({ ...prev, affiliation: e.target.value }))}
                className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-300 transition-all duration-200"
              />
            ) : (
              <p className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900">{user.affiliation || translate('Not specified')}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col group">
              <span className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
                ORCID ID
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.orcidId}
                  onChange={(e) => setFormData(prev => ({ ...prev, orcidId: e.target.value }))}
                  className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-300 transition-all duration-200"
                  placeholder="0000-0000-0000-0000"
                />
              ) : (
                <p className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900">{user.orcidId || translate('Not specified')}</p>
              )}
            </div>

            <div className="flex flex-col group">
              <span className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Google Scholar ID
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.googleScholarId}
                  onChange={(e) => setFormData(prev => ({ ...prev, googleScholarId: e.target.value }))}
                  className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-300 transition-all duration-200"
                />
              ) : (
                <p className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900">{user.googleScholarId || translate('Not specified')}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col group">
            <span className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {translate('Research Interests')}
            </span>
            {isEditing ? (
              <input
                type="text"
                value={formData.researchInterests}
                onChange={(e) => setFormData(prev => ({ ...prev, researchInterests: e.target.value }))}
                className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-300 transition-all duration-200"
                placeholder="AI, Machine Learning, Data Science"
              />
            ) : (
              <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex flex-wrap gap-2">
                  {user.researchInterests && user.researchInterests.length > 0 ? (
                    user.researchInterests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium"
                      >
                        {interest}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-500">{translate('No interests specified')}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="group inline-flex items-center justify-center gap-3 w-full px-8 py-4 bg-linear-to-r from-red-600 to-red-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-800 transform hover:-translate-y-0.5 transition-all duration-300 font-semibold"
          >
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {translate('Sign Out')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

