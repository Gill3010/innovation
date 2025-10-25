'use client';

import React, { useState } from 'react';
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

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

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
      setIsEditing(false);
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
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          {translate('Profile')}
        </h2>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? translate('Saving...') : translate('Save')}
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                {translate('Cancel')}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              {translate('Edit Profile')}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {translate('Name')}
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-slate-900">{user.name || translate('Not specified')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {translate('Email')}
          </label>
          <p className="text-slate-900">{user.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {translate('Affiliation')}
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.affiliation}
              onChange={(e) => setFormData(prev => ({ ...prev, affiliation: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-slate-900">{user.affiliation || translate('Not specified')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            ORCID ID
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.orcidId}
              onChange={(e) => setFormData(prev => ({ ...prev, orcidId: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0000-0000-0000-0000"
            />
          ) : (
            <p className="text-slate-900">{user.orcidId || translate('Not specified')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Google Scholar ID
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.googleScholarId}
              onChange={(e) => setFormData(prev => ({ ...prev, googleScholarId: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-slate-900">{user.googleScholarId || translate('Not specified')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {translate('Research Interests')}
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.researchInterests}
              onChange={(e) => setFormData(prev => ({ ...prev, researchInterests: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="AI, Machine Learning, Data Science"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {user.researchInterests && user.researchInterests.length > 0 ? (
                user.researchInterests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <p className="text-slate-500">{translate('No interests specified')}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          {translate('Sign Out')}
        </button>
      </div>
    </div>
  );
};

export default UserProfile;

