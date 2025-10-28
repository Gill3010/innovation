'use client';

import React, { useState, useEffect } from 'react';
import { PaperFormData, CrossRefPaper } from '@/types/scientific';
import { ScientificAPIService } from '@/services/scientificAPI';
import { ScientificDataService } from '@/services/scientificData';
import { OJSAPIService, OJSSubmissionResponse } from '@/services/ojsAPI';

// Verificar si OJS está configurado
const hasOJSCredentials = () => {
  return !!(process.env.NEXT_PUBLIC_OJS_API_KEY && process.env.NEXT_PUBLIC_OJS_API_SECRET);
};
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
  const [isVisible, setIsVisible] = useState(false);
  const [submitToJournal, setSubmitToJournal] = useState(false);
  const [ojsResult, setOjsResult] = useState<OJSSubmissionResponse | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

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
    setSuccess(null);
    setOjsResult(null);

    try {
      const paperData = {
        ...formData,
        ownerId: user.id,
        isRead: false,
        publicationDate: formData.publicationDate ? new Date(formData.publicationDate) : new Date(),
        tags: formData.tags.filter(tag => tag.trim() !== ''),
      };

      // 1. Primero guardar en nuestra base de datos local
      await ScientificDataService.createPaper(paperData);
      
      // 2. Si el usuario quiere enviar al journal, intentar enviar a OJS
      if (submitToJournal) {
        try {
          const ojsPaper = OJSAPIService.convertToOJSFormat(formData);
          const ojsResponse = await OJSAPIService.submitPaper(ojsPaper);
          setOjsResult(ojsResponse);
          
          if (ojsResponse.success) {
            setSuccess(`Paper added successfully! Submission ID: ${ojsResponse.submissionId}`);
          } else {
            setSuccess('Paper saved locally, but OJS submission failed. Check console for details.');
            setError(ojsResponse.error || 'Unknown error occurred');
          }
        } catch (ojsError) {
          console.error('OJS submission error:', ojsError);
          setSuccess('Paper saved locally, but OJS submission failed.');
          setError('Could not connect to OJS. Paper was saved to your library.');
        }
      } else {
        setSuccess('Paper added successfully to your library!');
      }
      
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
      }, 3000);
      
    } catch (error) {
      setError('Error adding paper. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 py-8 md:py-12 landscape:py-4 landscape:p-2 z-50 backdrop-blur-sm">
      <div 
        className={`bg-linear-to-br from-white to-slate-50/50 rounded-3xl landscape:rounded-2xl p-6 pt-10 md:p-10 md:pt-12 landscape:p-4 landscape:pt-6 max-w-3xl w-full max-h-[85vh] md:max-h-[88vh] landscape:max-h-[90vh] overflow-y-auto shadow-xl border border-slate-200/60 relative transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
        }`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="mb-6 md:mb-8 landscape:mb-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 landscape:gap-2 min-w-0">
              <div className="w-10 h-10 md:w-12 md:h-12 landscape:w-8 landscape:h-8 bg-linear-to-br from-blue-100 to-blue-50 rounded-2xl landscape:rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 md:w-6 md:h-6 landscape:w-4 landscape:h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl landscape:text-lg font-bold text-slate-900 tracking-tight truncate">Add New Paper</h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-xl shrink-0"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search by DOI */}
        <div className="mb-6 landscape:mb-3 p-5 landscape:p-3 bg-blue-50/50 border border-blue-100 rounded-2xl landscape:rounded-xl">
          <h3 className="font-semibold landscape:text-sm text-slate-900 mb-3 landscape:mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            Search by DOI
          </h3>
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Enter DOI (e.g., 10.1038/nature12373)"
              value={formData.doi}
              onChange={(e) => handleInputChange('doi', e.target.value)}
              className="flex-1 min-w-[200px] px-4 landscape:px-3 py-3 landscape:py-2 border border-slate-200 rounded-xl landscape:rounded-lg text-slate-900 landscape:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-300 transition-all duration-200"
            />
            <button
              onClick={handleSearchByDOI}
              disabled={searching}
              className="px-4 landscape:px-4 py-3 landscape:py-2 bg-blue-600 text-white rounded-xl landscape:rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 landscape:text-sm font-semibold shadow-md hover:shadow-lg whitespace-nowrap flex-shrink-0"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Search by Title */}
        <div className="mb-6 landscape:mb-3 p-5 landscape:p-3 bg-emerald-50/50 border border-emerald-100 rounded-2xl landscape:rounded-xl">
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search by Title
          </h3>
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Enter paper title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-300 transition-all duration-200"
            />
            <button
              onClick={handleSearchByTitle}
              disabled={searching}
              className="px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-all duration-200 font-semibold shadow-md hover:shadow-lg whitespace-nowrap flex-shrink-0"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-6 p-5 bg-slate-50/50 border border-slate-200 rounded-2xl">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Search Results
            </h3>
            <div className="space-y-3">
              {searchResults.map((paper, index) => (
                <div
                  key={index}
                  className="p-4 border border-slate-200 bg-white rounded-xl hover:border-blue-300 hover:shadow-md cursor-pointer transition-all duration-200 group"
                  onClick={() => handleSelectSearchResult(paper)}
                >
                  <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{paper.title?.[0] || 'Untitled'}</h4>
                  <p className="text-sm text-slate-600 mt-1">
                    {paper.author?.map(a => `${a.given} ${a.family}`).join(', ') || 'Unknown authors'}
                  </p>
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {paper['container-title']?.[0] || 'Unknown journal'} • {paper['published-print']?.['date-parts']?.[0]?.[0] || 'Unknown year'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manual Form */}
        <form onSubmit={handleSubmit} className="space-y-6 landscape:space-y-3">
          <div className="flex flex-col group">
            <span className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Title *
            </span>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="px-4 landscape:px-3 py-3 landscape:py-2 border border-slate-200 rounded-xl landscape:rounded-lg text-slate-900 landscape:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-300 transition-all duration-200"
              required
            />
          </div>

          <div className="flex flex-col group">
            <span className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Authors *
            </span>
            <input
              type="text"
              placeholder="Enter authors separated by commas"
              value={formData.authors.join(', ')}
              onChange={(e) => handleInputChange('authors', e.target.value.split(',').map(a => a.trim()).filter(a => a))}
              className="px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-300 transition-all duration-200"
              required
            />
          </div>

          <div className="flex flex-col group">
            <span className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Abstract
            </span>
            <textarea
              value={formData.abstract}
              onChange={(e) => handleInputChange('abstract', e.target.value)}
              rows={4}
              className="px-4 landscape:px-3 py-3 landscape:py-2 border border-slate-200 rounded-xl landscape:rounded-lg text-slate-900 landscape:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-300 transition-all duration-200 resize-none landscape:rows-3"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col group">
              <span className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Journal
              </span>
              <input
                type="text"
                value={formData.journal}
                onChange={(e) => handleInputChange('journal', e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-300 transition-all duration-200"
              />
            </div>
            <div className="flex flex-col group">
              <span className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Publication Date
              </span>
              <input
                type="date"
                value={formData.publicationDate}
                onChange={(e) => handleInputChange('publicationDate', e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-300 transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex flex-col group">
            <span className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Tags
            </span>
            <input
              type="text"
              placeholder="Enter tags separated by commas"
              value={formData.tags.join(', ')}
              onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
              className="px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-300 transition-all duration-200"
            />
          </div>

          {/* Checkbox para enviar a OJS - Solo mostrar si las credenciales están configuradas */}
          {hasOJSCredentials() && (
            <div className="flex items-start gap-3 p-4 bg-blue-50/30 border border-blue-100 rounded-xl">
              <input
                type="checkbox"
                id="submitToJournal"
                checked={submitToJournal}
                onChange={(e) => setSubmitToJournal(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="submitToJournal" className="text-sm text-slate-700 cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-semibold">Also submit to journal (OJS)</span>
                </div>
                <p className="text-xs text-slate-600 ml-7">
                  Send this paper to the journal for review. The paper will be saved to your library regardless.
                </p>
              </label>
            </div>
          )}

          {/* Error/Success Messages */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl">
              <svg className="w-5 h-5 text-rose-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-rose-700">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-emerald-700">{success}</span>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="group inline-flex items-center justify-center gap-3 flex-1 px-8 py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-300 font-semibold"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Paper
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 font-semibold"
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
