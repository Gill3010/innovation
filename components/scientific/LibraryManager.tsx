'use client';

import React, { useState, useEffect } from 'react';
import { ScientificPaper } from '@/types/scientific';
import { ScientificDataService } from '@/services/scientificData';
import { useAuth } from '@/contexts/AuthContext';
import AddPaperForm from './AddPaperForm';

const LibraryManager: React.FC = () => {
  const { user } = useAuth();
  const [papers, setPapers] = useState<ScientificPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'citations'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddPaperForm, setShowAddPaperForm] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) {
      loadPapers();
    }
  }, [user]);

  const loadPapers = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const papersData = await ScientificDataService.getPapers(user.id);
      setPapers(papersData);
    } catch (error) {
      console.error('Error loading papers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaperAdded = () => {
    loadPapers(); // Recargar datos después de agregar un paper
  };

  const handleMarkAsRead = async (paperId: string, isRead: boolean) => {
    try {
      await ScientificDataService.updatePaper(paperId, { isRead });
      await loadPapers(); // Recargar datos
    } catch (error) {
      console.error('Error updating paper:', error);
    }
  };

  const handleAddNote = async (paperId: string, notes: string) => {
    try {
      await ScientificDataService.updatePaper(paperId, { notes });
      await loadPapers(); // Recargar datos
    } catch (error) {
      console.error('Error updating paper:', error);
    }
  };

  // Obtener todas las tags únicas
  const allTags = Array.from(new Set(papers.flatMap(paper => paper.tags)));

  // Filtrar y ordenar papers
  const filteredPapers = papers
    .filter(paper => {
      const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase())) ||
        paper.abstract.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTag = !selectedTag || paper.tags.includes(selectedTag);
      
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'citations':
          return (b.citations || 0) - (a.citations || 0);
        case 'date':
        default:
          return new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime();
      }
    });

  const unreadCount = papers.filter(paper => !paper.isRead).length;
  const readCount = papers.filter(paper => paper.isRead).length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div 
        className={`mb-8 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Research Library</h1>
        <p className="text-slate-600">Your personal collection of scientific papers</p>
      </div>

      {/* Stats */}
      <div 
        className={`grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: '100ms' }}
      >
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Papers</p>
              <p className="text-2xl font-bold text-slate-900">{papers.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Unread</p>
              <p className="text-2xl font-bold text-slate-900">{unreadCount}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Read</p>
              <p className="text-2xl font-bold text-slate-900">{readCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Tags</p>
              <p className="text-2xl font-bold text-slate-900">{allTags.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div 
        className={`bg-white rounded-xl p-6 shadow-lg border border-slate-200 mb-8 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: '200ms' }}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search papers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Tag Filter */}
          <div className="lg:w-48">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="lg:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'citations')}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="citations">Sort by Citations</option>
            </select>
          </div>

          {/* View Mode */}
          <div className="flex border border-slate-200 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-3 rounded-l-lg transition-colors ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-3 rounded-r-lg transition-colors ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Papers List */}
      {loading ? (
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      ) : (
        <div 
          className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'} transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          {filteredPapers.map((paper) => (
            <div key={paper.id} className={`bg-white rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow ${
              viewMode === 'list' ? 'p-6' : 'p-6'
            }`}>
              {viewMode === 'grid' ? (
                // Grid View
                <>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-slate-900 line-clamp-2 flex-1 mr-4">{paper.title}</h3>
                    <button
                      onClick={() => handleMarkAsRead(paper.id, !paper.isRead)}
                      className={`p-2 rounded-lg transition-colors ${
                        paper.isRead ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      }`}
                    >
                      {paper.isRead ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                    {paper.authors.join(', ')}
                  </p>
                  
                  <p className="text-xs text-slate-500 mb-4">
                    {paper.journal} • {new Date(paper.publicationDate).getFullYear()}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {paper.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                    {paper.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{paper.tags.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {paper.citations && (
                      <span className="text-xs text-slate-500">
                        {paper.citations} citations
                      </span>
                    )}
                    {paper.doi && (
                      <a
                        href={`https://doi.org/${paper.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        View DOI
                      </a>
                    )}
                  </div>
                </>
              ) : (
                // List View
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-slate-900 line-clamp-1 flex-1 mr-4">{paper.title}</h3>
                      <button
                        onClick={() => handleMarkAsRead(paper.id, !paper.isRead)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          paper.isRead ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                      >
                        {paper.isRead ? 'Read' : 'Unread'}
                      </button>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-2">
                      {paper.authors.join(', ')}
                    </p>
                    
                    <p className="text-xs text-slate-500 mb-3">
                      {paper.journal} • {new Date(paper.publicationDate).getFullYear()}
                      {paper.citations && ` • ${paper.citations} citations`}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {paper.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {paper.doi && (
                      <a
                        href={`https://doi.org/${paper.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Paper
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && filteredPapers.length === 0 && (
        <div 
          className={`text-center py-12 text-slate-500 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg mb-2">No papers found</p>
          <p className="text-sm mb-4">
            {searchQuery || selectedTag ? 'Try adjusting your filters' : 'Add your first paper to get started'}
          </p>
          <button 
            onClick={() => setShowAddPaperForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Papers
          </button>
        </div>
      )}

      {/* Add Paper Form Modal */}
      {showAddPaperForm && (
        <AddPaperForm
          onClose={() => setShowAddPaperForm(false)}
          onSuccess={handlePaperAdded}
        />
      )}
    </div>
  );
};

export default LibraryManager;
