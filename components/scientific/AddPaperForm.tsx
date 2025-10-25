'use client';

import React, { useState } from 'react';
import { PaperFormData, CrossRefPaper } from '@/types/scientific';
import { ScientificAPIService } from '@/services/scientificAPI';
import { ScientificDataService } from '@/services/scientificData';
import { useAuth } from '@/contexts/AuthContext';

interface AddPaperFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddPaperForm: React.FC<AddPaperFormProps> = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<PaperFormData>({
    title: '',
    authors: [],
    abstract: '',
    doi: '',
    pmid: '',
    arxivId: '',
    journal: '',
    publicationDate: '',
    url: '',
    pdfUrl: '',
    tags: [],
    projectId: '',
    notes: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<CrossRefPaper[]>([]);
  const [searching, setSearching] = useState(false);

  const handleInputChange = (field: keyof PaperFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSearchByDOI = async () => {
    if (!formData.doi) {
      setError('Please enter a DOI');
      return;
    }

    setSearching(true);
    setError(null);

    try {
      const paper = await ScientificAPIService.getPaperByDOI(formData.doi);
      if (paper) {
        const normalized = ScientificAPIService.normalizePaperData(paper, 'crossref');
        setFormData(prev => ({
          ...prev,
          title: normalized.title,
          authors: normalized.authors,
          abstract: normalized.abstract,
          journal: normalized.journal,
          publicationDate: normalized.publicationDate,
          url: normalized.url,
          citations: normalized.citations,
        }));
        setSuccess('Paper data loaded successfully!');
      } else {
        setError('Paper not found with this DOI');
      }
    } catch (error) {
      setError('Error fetching paper data');
      console.error('Error:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchByTitle = async () => {
    if (!formData.title) {
      setError('Please enter a title to search');
      return;
    }

    setSearching(true);
    setError(null);

    try {
      const results = await ScientificAPIService.searchPapers(formData.title, 5);
      setSearchResults(results);
      if (results.length === 0) {
        setError('No papers found with this title');
      }
    } catch (error) {
      setError('Error searching papers');
      console.error('Error:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectSearchResult = (paper: CrossRefPaper) => {
    const normalized = ScientificAPIService.normalizePaperData(paper, 'crossref');
    setFormData(prev => ({
      ...prev,
      title: normalized.title,
      authors: normalized.authors,
      abstract: normalized.abstract,
      journal: normalized.journal,
      publicationDate: normalized.publicationDate,
      url: normalized.url,
      doi: normalized.doi,
      citations: normalized.citations,
    }));
    setSearchResults([]);
    setSuccess('Paper data loaded successfully!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to add papers');
      return;
    }

    if (!formData.title || !formData.authors.length) {
      setError('Title and at least one author are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const paperData = {
        ...formData,
        ownerId: user.id,
        isRead: false,
        publicationDate: formData.publicationDate ? new Date(formData.publicationDate) : new Date(),
        tags: formData.tags.filter(tag => tag.trim() !== ''),
      };

      await ScientificDataService.createPaper(paperData);
      setSuccess('Paper added successfully!');
      
      // Reset form
      setFormData({
        title: '',
        authors: [],
        abstract: '',
        doi: '',
        pmid: '',
        arxivId: '',
        journal: '',
        publicationDate: '',
        url: '',
        pdfUrl: '',
        tags: [],
        projectId: '',
        notes: '',
      });
      
      // Call success callback
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
      
    } catch (error) {
      setError('Error adding paper. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Add New Paper</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search by DOI */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-slate-900 mb-3">Search by DOI</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter DOI (e.g., 10.1038/nature12373)"
              value={formData.doi}
              onChange={(e) => handleInputChange('doi', e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearchByDOI}
              disabled={searching}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Search by Title */}
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-slate-900 mb-3">Search by Title</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter paper title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearchByTitle}
              disabled={searching}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-6 p-4 bg-slate-50 rounded-lg">
            <h3 className="font-semibold text-slate-900 mb-3">Search Results</h3>
            <div className="space-y-2">
              {searchResults.map((paper, index) => (
                <div
                  key={index}
                  className="p-3 border border-slate-200 rounded-lg hover:bg-white cursor-pointer"
                  onClick={() => handleSelectSearchResult(paper)}
                >
                  <h4 className="font-medium text-slate-900">{paper.title?.[0] || 'Untitled'}</h4>
                  <p className="text-sm text-slate-600">
                    {paper.author?.map(a => `${a.given} ${a.family}`).join(', ') || 'Unknown authors'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {paper['container-title']?.[0] || 'Unknown journal'} • {paper['published-print']?.['date-parts']?.[0]?.[0] || 'Unknown year'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manual Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Authors *</label>
            <input
              type="text"
              placeholder="Enter authors separated by commas"
              value={formData.authors.join(', ')}
              onChange={(e) => handleInputChange('authors', e.target.value.split(',').map(a => a.trim()).filter(a => a))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Abstract</label>
            <textarea
              value={formData.abstract}
              onChange={(e) => handleInputChange('abstract', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Journal</label>
              <input
                type="text"
                value={formData.journal}
                onChange={(e) => handleInputChange('journal', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Publication Date</label>
              <input
                type="date"
                value={formData.publicationDate}
                onChange={(e) => handleInputChange('publicationDate', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
            <input
              type="text"
              placeholder="Enter tags separated by commas"
              value={formData.tags.join(', ')}
              onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Paper'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaperForm;
