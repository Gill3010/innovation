'use client';

import React, { useState, useEffect } from 'react';
import { ScientificPaper, ResearchProject, PaperFormData, ProjectFormData } from '@/types/scientific';
import { ScientificDataService } from '@/services/scientificData';
import { ScientificAPIService } from '@/services/scientificAPI';

const ResearchManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'papers' | 'projects'>('papers');
  const [papers, setPapers] = useState<ScientificPaper[]>([]);
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [apiSearchResults, setApiSearchResults] = useState<any[]>([]);
  const [apiSearching, setApiSearching] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const userId = 'demo-user'; // En producción vendría de auth
      
      const [papersData, projectsData] = await Promise.all([
        ScientificDataService.getPapers(userId),
        ScientificDataService.getProjects(userId)
      ]);

      setPapers(papersData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApiSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setApiSearching(true);
    try {
      // Buscar en CrossRef
      const crossrefResults = await ScientificAPIService.searchPapers(query, 5);
      setApiSearchResults(crossrefResults);
    } catch (error) {
      console.error('Error searching APIs:', error);
    } finally {
      setApiSearching(false);
    }
  };

  const addPaperFromAPI = async (apiPaper: any) => {
    try {
      const normalizedPaper = ScientificAPIService.normalizePaperData(apiPaper, 'crossref');
      
      const paperData: Partial<ScientificPaper> = {
        title: normalizedPaper.title,
        authors: normalizedPaper.authors,
        abstract: normalizedPaper.abstract,
        doi: normalizedPaper.doi,
        journal: normalizedPaper.journal,
        publicationDate: normalizedPaper.publicationDate,
        url: normalizedPaper.url,
        citations: normalizedPaper.citations,
        tags: [],
        ownerId: 'demo-user',
        isRead: false,
      };

      await ScientificDataService.createPaper(paperData);
      await loadData(); // Recargar datos
      setApiSearchResults([]);
    } catch (error) {
      console.error('Error adding paper:', error);
    }
  };

  const filteredPapers = papers.filter(paper =>
    paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paper.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase())) ||
    paper.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Research Manager</h1>
        <p className="text-slate-600">Manage your research papers and projects</p>
      </div>

      {/* Search and Add */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search papers and projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => handleApiSearch(searchQuery)}
              disabled={apiSearching || !searchQuery.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {apiSearching ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search APIs
                </>
              )}
            </button>
            
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add {activeTab === 'papers' ? 'Paper' : 'Project'}
            </button>
          </div>
        </div>

        {/* API Search Results */}
        {apiSearchResults.length > 0 && (
          <div className="mt-6 border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Search Results from CrossRef</h3>
            <div className="space-y-3">
              {apiSearchResults.map((paper, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 mb-2">{paper.title?.[0] || 'Untitled'}</h4>
                      <p className="text-sm text-slate-600 mb-2">
                        {paper.author?.map((a: any) => `${a.given} ${a.family}`).join(', ') || 'Unknown authors'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {paper['container-title']?.[0] || 'Unknown journal'} • {paper['published-print']?.['date-parts']?.[0]?.[0] || 'Unknown year'}
                      </p>
                    </div>
                    <button
                      onClick={() => addPaperFromAPI(paper)}
                      className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add to Library
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 rounded-lg p-1 mb-8">
        <button
          onClick={() => setActiveTab('papers')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'papers'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Papers ({papers.length})
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'projects'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Projects ({projects.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {activeTab === 'papers' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPapers.map((paper) => (
                <div key={paper.id} className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
                  <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{paper.title}</h3>
                  <p className="text-sm text-slate-600 mb-3">
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
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      paper.isRead ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {paper.isRead ? 'Read' : 'Unread'}
                    </span>
                    {paper.citations && (
                      <span className="text-xs text-slate-500">
                        {paper.citations} citations
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
                  <h3 className="font-semibold text-slate-900 mb-2">{project.title}</h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-3">{project.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.status === 'active' ? 'bg-green-100 text-green-700' :
                      project.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      project.status === 'planning' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {project.status}
                    </span>
                    <span className="text-xs text-slate-500">
                      {project.collaborators.length} collaborators
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {((activeTab === 'papers' && filteredPapers.length === 0) || 
            (activeTab === 'projects' && filteredProjects.length === 0)) && (
            <div className="text-center py-12 text-slate-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {activeTab === 'papers' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                )}
              </svg>
              <p className="text-lg mb-2">No {activeTab} found</p>
              <p className="text-sm mb-4">
                {searchQuery ? 'Try adjusting your search terms' : `Add your first ${activeTab.slice(0, -1)} to get started`}
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add {activeTab === 'papers' ? 'Paper' : 'Project'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResearchManager;
