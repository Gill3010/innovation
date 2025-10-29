'use client';

import React, { useState, useEffect } from 'react';
import { ScientificPaper, ResearchProject, PaperFormData, ProjectFormData } from '@/types/scientific';
import { ScientificDataService } from '@/services/scientificData';
import { ScientificAPIService } from '@/services/scientificAPI';
import { useAuth } from '@/contexts/AuthContext';
import AddPaperForm from './AddPaperForm';
import AddProjectForm from './AddProjectForm';

const ResearchManager: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'papers' | 'projects'>('papers');
  const [papers, setPapers] = useState<ScientificPaper[]>([]);
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [apiSearchResults, setApiSearchResults] = useState<any[]>([]);
  const [apiSearching, setApiSearching] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showAddPaperForm, setShowAddPaperForm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  // Leer parámetro de búsqueda de la URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    if (query && query.trim()) {
      setSearchQuery(query);
      handleApiSearch(query, 'all');
    }
  }, []);

  const loadData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const [papersData, projectsData] = await Promise.all([
        ScientificDataService.getPapers(user.id),
        ScientificDataService.getProjects(user.id)
      ]);

      setPapers(papersData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaperAdded = () => {
    loadData(); // Recargar datos después de agregar un paper
  };

  const handleApiSearch = async (query: string, source: 'all' | 'crossref' | 'arxiv' | 'semantic' | 'openalex' = 'all') => {
    if (!query.trim()) return;
    
    setApiSearching(true);
    try {
      if (source === 'all') {
        // Buscar en todas las fuentes (hasta 8 resultados por fuente = 32 total)
        const [crossrefResults, arxivResults, semanticResults, openalexResults] = await Promise.all([
          ScientificAPIService.searchCrossRef(query, 8),
          ScientificAPIService.searchArXiv(query, 8),
          ScientificAPIService.searchSemanticScholar(query, 8),
          ScientificAPIService.searchOpenAlex(query, 8),
        ]);
        
        // Combinar y etiquetar resultados
        const allResults = [
          ...crossrefResults.map((r: any) => ({ ...r, source: 'CrossRef' })),
          ...arxivResults.map((r: any) => ({ ...r, source: 'arXiv' })),
          ...semanticResults.map((r: any) => ({ ...r, source: 'Semantic Scholar' })),
          ...openalexResults.map((r: any) => ({ ...r, source: 'OpenAlex' })),
        ];
        
        setApiSearchResults(allResults);
      } else if (source === 'crossref') {
        const results = await ScientificAPIService.searchCrossRef(query, 20);
        setApiSearchResults(results.map((r: any) => ({ ...r, source: 'CrossRef' })));
      } else if (source === 'arxiv') {
        const results = await ScientificAPIService.searchArXiv(query, 20);
        setApiSearchResults(results.map((r: any) => ({ ...r, source: 'arXiv' })));
      } else if (source === 'semantic') {
        const results = await ScientificAPIService.searchSemanticScholar(query, 20);
        setApiSearchResults(results.map((r: any) => ({ ...r, source: 'Semantic Scholar' })));
      } else if (source === 'openalex') {
        const results = await ScientificAPIService.searchOpenAlex(query, 20);
        setApiSearchResults(results.map((r: any) => ({ ...r, source: 'OpenAlex' })));
      }
    } catch (error) {
      console.error('Error searching APIs:', error);
    } finally {
      setApiSearching(false);
    }
  };

  const addPaperFromAPI = async (apiPaper: any) => {
    if (!user) return;
    
    try {
      // Determine source from paper.source or default to crossref
      const source = apiPaper.source?.toLowerCase() || 'crossref';
      let normalizedPaper;
      
      if (source.includes('arxiv')) {
        normalizedPaper = apiPaper; // ArXiv data already normalized
      } else if (source.includes('semantic')) {
        normalizedPaper = ScientificAPIService.normalizePaperData(apiPaper, 'semantic');
      } else if (source.includes('openalex')) {
        normalizedPaper = ScientificAPIService.normalizePaperData(apiPaper, 'openalex');
      } else {
        normalizedPaper = ScientificAPIService.normalizePaperData(apiPaper, 'crossref');
      }
      
      // Handle different author formats - support arrays, strings, and CrossRef format
      let authors: string[] = [];
      if (source.includes('crossref')) {
        // CrossRef format has author array with given/family
        authors = apiPaper.author?.map((a: any) => `${a.given || ''} ${a.family || ''}`.trim()).filter(Boolean) || [];
      } else if (Array.isArray(normalizedPaper.authors)) {
        authors = normalizedPaper.authors;
      } else if (typeof normalizedPaper.authors === 'string') {
        authors = normalizedPaper.authors.split(',').map((a: string) => a.trim()).filter(Boolean);
      }
      
      // Ensure we have at least a fallback author
      if (authors.length === 0) {
        authors = ['Unknown authors'];
      }
      
      // Parse publication date - handle different formats
      let publicationDate: Date = new Date();
      const dateStr = normalizedPaper.publicationDate || 
                     (apiPaper.year ? `${apiPaper.year}-01-01` : '') ||
                     (apiPaper['published-print']?.['date-parts']?.[0]?.join('-') || '');
      
      if (dateStr) {
        publicationDate = new Date(dateStr);
        // If date is invalid, use current date
        if (isNaN(publicationDate.getTime())) {
          publicationDate = new Date();
        }
      }
      
      const paperData: Partial<ScientificPaper> = {
        title: normalizedPaper.title || apiPaper.title?.[0] || apiPaper.title || 'Untitled',
        authors: authors,
        abstract: normalizedPaper.abstract || apiPaper.abstract || '',
        doi: normalizedPaper.doi || apiPaper.doi || apiPaper.DOI || undefined,
        arxivId: normalizedPaper.arxivId || apiPaper.arxivId || undefined,
        journal: normalizedPaper.journal || apiPaper.venue || apiPaper['container-title']?.[0] || undefined,
        publicationDate: publicationDate,
        url: normalizedPaper.url || apiPaper.url || apiPaper.URL || undefined,
        citations: normalizedPaper.citations || apiPaper.citationCount || apiPaper['is-referenced-by-count'] || 0,
        tags: [],
        ownerId: user.id,
        isRead: false,
      };

      // Remove undefined values before saving to Firestore
      const cleanPaperData = Object.fromEntries(
        Object.entries(paperData).filter(([, value]) => value !== undefined)
      );

      await ScientificDataService.createPaper(cleanPaperData as Partial<ScientificPaper>);
      await loadData(); // Recargar datos
      setApiSearchResults([]);
      
      // Show success feedback
      alert('Paper added to library successfully!');
    } catch (error) {
      console.error('Error adding paper:', error);
      alert('Error adding paper. Please check the console for details.');
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

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Please Sign In</h1>
          <p className="text-slate-600 mb-8">You need to be signed in to access the research manager.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 landscape:pl-20 py-12 landscape:py-6">
      {/* Header */}
      <div 
        className={`mb-8 landscape:mb-4 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h1 className="text-3xl landscape:text-2xl font-bold text-slate-900 mb-2 landscape:mb-1">Research Manager</h1>
        <p className="text-slate-600 landscape:text-sm">Manage your research papers and projects</p>
      </div>

      {/* Search and Add */}
      <div 
        className={`bg-white rounded-xl landscape:rounded-lg p-6 landscape:p-4 shadow-lg border border-slate-200 mb-8 landscape:mb-3 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: '100ms' }}
      >
        <div className="flex flex-col md:flex-row gap-4 landscape:gap-2">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search papers and projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 landscape:px-3 py-3 landscape:py-2 pl-10 landscape:pl-8 border border-slate-200 rounded-lg landscape:text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex gap-2 landscape:gap-1.5">
            <button
              onClick={() => handleApiSearch(searchQuery, 'all')}
              disabled={apiSearching || !searchQuery.trim()}
              className="px-6 landscape:px-3 py-3 landscape:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 landscape:gap-1"
            >
              {apiSearching ? (
                <>
                  <svg className="animate-spin w-4 h-4 landscape:w-3 landscape:h-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="landscape:hidden">Searching...</span>
                  <span className="hidden landscape:inline">...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 landscape:w-3 landscape:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="landscape:hidden">Search All Sources</span>
                  <span className="hidden landscape:inline">API</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => {
                if (activeTab === 'papers') {
                  setShowAddPaperForm(true);
                } else {
                  setShowAddForm(!showAddForm);
                }
              }}
              className="px-6 landscape:px-3 py-3 landscape:py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 landscape:gap-1"
            >
              <svg className="w-4 h-4 landscape:w-3 landscape:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add {activeTab === 'papers' ? 'Paper' : 'Project'}
            </button>
          </div>
        </div>

        {/* API Search Results */}
        {apiSearchResults.length > 0 && (
          <div className="mt-6 border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Search Results ({apiSearchResults.length} found)</h3>
            <p className="text-sm text-slate-600 mb-4">Showing up to 8 results per source (max 32 total)</p>
            <div className="space-y-3">
              {apiSearchResults.map((paper, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-3 sm:p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-2 mb-2">
                        <h4 className="font-semibold text-slate-900 text-sm sm:text-base break-words">{paper.title?.[0] || paper.title || 'Untitled'}</h4>
                        {paper.source && <span className="w-fit px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full whitespace-nowrap">{paper.source}</span>}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 mb-2 break-words">
                        {paper.author?.map((a: any) => `${a.given} ${a.family}`).join(', ') || paper.authors || 'Unknown authors'}
                      </p>
                      <p className="text-xs text-slate-500 break-words">
                        {paper['container-title']?.[0] || paper.venue || 'Unknown journal'} • {paper['published-print']?.['date-parts']?.[0]?.[0] || paper.year || 'Unknown year'}
                      </p>
                    </div>
                    <button
                      onClick={() => addPaperFromAPI(paper)}
                      className="w-full sm:w-auto shrink-0 px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition-colors"
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
      <div 
        className={`flex space-x-1 bg-slate-100 rounded-lg p-1 mb-8 landscape:mb-3 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: '200ms' }}
      >
        <button
          onClick={() => setActiveTab('papers')}
          className={`flex-1 py-2 landscape:py-1.5 px-4 landscape:px-3 rounded-md font-medium landscape:text-sm transition-colors ${
            activeTab === 'papers'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Papers ({papers.length})
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex-1 py-2 landscape:py-1.5 px-4 landscape:px-3 rounded-md font-medium landscape:text-sm transition-colors ${
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
        <div 
          className={`space-y-6 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
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
                  
                  <div className="flex items-center justify-between mb-3">
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
                  
                  <div className="flex gap-2">
                    {(paper.doi || paper.url) && (
                      <a
                        href={paper.doi ? `https://doi.org/${paper.doi}` : paper.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
                      >
                        View Paper
                      </a>
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
            <div 
              className={`text-center py-12 text-slate-500 transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
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
                onClick={() => {
                  if (activeTab === 'papers') {
                    setShowAddPaperForm(true);
                  } else {
                    setShowAddForm(true);
                  }
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add {activeTab === 'papers' ? 'Paper' : 'Project'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add Paper Form Modal */}
      {showAddPaperForm && (
        <AddPaperForm
          onClose={() => setShowAddPaperForm(false)}
          onSuccess={handlePaperAdded}
        />
      )}

      {/* Add Project Form Modal */}
      {showAddForm && (
        <AddProjectForm
          onClose={() => setShowAddForm(false)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
};

export default ResearchManager;