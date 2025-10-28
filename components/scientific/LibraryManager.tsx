'use client';

import React, { useState, useEffect } from 'react';
import { ScientificPaper, ResearchProject } from '@/types/scientific';
import { ScientificDataService } from '@/services/scientificData';
import { useAuth } from '@/contexts/AuthContext';
import AddPaperForm from './AddPaperForm';
import AddProjectForm from './AddProjectForm';

const LibraryManager: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'papers' | 'projects'>('papers');
  const [papers, setPapers] = useState<ScientificPaper[]>([]);
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'citations'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddPaperForm, setShowAddPaperForm] = useState(false);
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [paperToEdit, setPaperToEdit] = useState<ScientificPaper | null>(null);
  const [projectToEdit, setProjectToEdit] = useState<ResearchProject | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleProjectAdded = () => {
    loadData(); // Recargar datos después de agregar un project
  };

  const handleEditPaper = (paper: ScientificPaper) => {
    setPaperToEdit(paper);
  };

  const handleEditProject = (project: ResearchProject) => {
    setProjectToEdit(project);
  };

  const handlePaperEdited = () => {
    setPaperToEdit(null);
    loadData();
  };

  const handleProjectEdited = () => {
    setProjectToEdit(null);
    loadData();
  };

  const handleMarkAsRead = async (paperId: string, isRead: boolean) => {
    try {
      await ScientificDataService.updatePaper(paperId, { isRead });
      await loadData(); // Recargar datos
    } catch (error) {
      console.error('Error updating paper:', error);
    }
  };

  const handleAddNote = async (paperId: string, notes: string) => {
    try {
      await ScientificDataService.updatePaper(paperId, { notes });
      await loadData(); // Recargar datos
    } catch (error) {
      console.error('Error updating paper:', error);
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete || !user) return;
    
    try {
      setDeleting(true);
      if (activeTab === 'papers') {
        await ScientificDataService.deletePaper(itemToDelete);
      } else {
        await ScientificDataService.deleteProject(itemToDelete);
      }
      setItemToDelete(null);
      await loadData(); // Recargar datos
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  // Obtener todas las tags únicas (mezcladas de papers y projects)
  const paperTags = papers.flatMap(paper => paper.tags);
  const projectTags = projects.flatMap(project => project.tags);
  const allTags = Array.from(new Set([...paperTags, ...projectTags]));

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

  // Filtrar y ordenar projects
  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTag = !selectedTag || project.tags.includes(selectedTag);
      
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'date':
        default:
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }
    });

  const getProjectTitle = (projectId?: string): string | null => {
    if (!projectId) return null;
    const project = projects.find(p => p.id === projectId);
    return project?.title || null;
  };

  const getProjectPapers = (projectId: string): ScientificPaper[] => {
    return papers.filter(paper => paper.projectId === projectId);
  };

  const unreadCount = papers.filter(paper => !paper.isRead).length;
  const readCount = papers.filter(paper => paper.isRead).length;

  return (
    <div className="max-w-7xl mx-auto px-6 landscape:pl-20 py-12 landscape:py-6">
      {/* Header */}
      <div 
        className={`mb-8 landscape:mb-4 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h1 className="text-3xl landscape:text-2xl font-bold text-slate-900 mb-2 landscape:mb-1">Research Library</h1>
        <p className="text-slate-600 landscape:text-sm">Your personal collection of papers and projects</p>
      </div>

      {/* Stats */}
      <div 
        className={`grid grid-cols-1 md:grid-cols-4 landscape:grid-cols-4 gap-6 landscape:gap-2 mb-8 landscape:mb-3 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: '100ms' }}
      >
        <div className="bg-white rounded-xl landscape:rounded-lg p-6 landscape:p-3 shadow-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm landscape:text-[10px] font-medium text-slate-600">Total {activeTab === 'papers' ? 'Papers' : 'Projects'}</p>
              <p className="text-2xl landscape:text-lg font-bold text-slate-900">{activeTab === 'papers' ? papers.length : projects.length}</p>
            </div>
            <div className="w-12 h-12 landscape:w-8 landscape:h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 ml-2">
              <svg className="w-6 h-6 landscape:w-4 landscape:h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl landscape:rounded-lg p-6 landscape:p-3 shadow-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm landscape:text-[10px] font-medium text-slate-600">Unread</p>
              <p className="text-2xl landscape:text-lg font-bold text-slate-900">{unreadCount}</p>
            </div>
            <div className="w-12 h-12 landscape:w-8 landscape:h-8 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0 ml-2">
              <svg className="w-6 h-6 landscape:w-4 landscape:h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl landscape:rounded-lg p-6 landscape:p-3 shadow-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm landscape:text-[10px] font-medium text-slate-600">Read</p>
              <p className="text-2xl landscape:text-lg font-bold text-slate-900">{readCount}</p>
            </div>
            <div className="w-12 h-12 landscape:w-8 landscape:h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0 ml-2">
              <svg className="w-6 h-6 landscape:w-4 landscape:h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl landscape:rounded-lg p-6 landscape:p-3 shadow-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm landscape:text-[10px] font-medium text-slate-600">Tags</p>
              <p className="text-2xl landscape:text-lg font-bold text-slate-900">{allTags.length}</p>
            </div>
            <div className="w-12 h-12 landscape:w-8 landscape:h-8 bg-purple-100 rounded-lg flex items-center justify-center shrink-0 ml-2">
              <svg className="w-6 h-6 landscape:w-4 landscape:h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div 
        className={`flex space-x-1 bg-slate-100 rounded-lg p-1 mb-8 landscape:mb-3 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: '150ms' }}
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
          Research Hub ({projects.length})
        </button>
      </div>

      {/* Filters and Controls */}
      <div 
        className={`bg-white rounded-xl landscape:rounded-lg p-6 landscape:p-4 shadow-lg border border-slate-200 mb-8 landscape:mb-3 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: '200ms' }}
      >
        <div className="flex flex-col lg:flex-row gap-4 landscape:gap-2">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 landscape:px-3 py-3 landscape:py-2 pl-10 landscape:pl-8 border border-slate-200 rounded-lg landscape:text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              {activeTab === 'papers' && <option value="citations">Sort by Citations</option>}
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

      {/* Items List */}
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
          {activeTab === 'papers' ? filteredPapers.map((paper) => (
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
                    <div className="flex items-center gap-3">
                      {paper.projectId && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 border border-emerald-200 rounded-lg">
                          <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          <span className="text-xs font-medium text-emerald-700">{getProjectTitle(paper.projectId)}</span>
                        </div>
                      )}
                      {paper.citations && (
                        <span className="text-xs text-slate-500">
                          {paper.citations} citations
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
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
                      <button
                        onClick={() => handleEditPaper(paper)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Edit paper"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setItemToDelete(paper.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete paper"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                // List View
                <div>
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
                  
                  {paper.projectId && getProjectTitle(paper.projectId) && (
                    <div className="mb-2">
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span className="text-xs font-medium text-emerald-700">{getProjectTitle(paper.projectId)}</span>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-sm text-slate-600 mb-2">
                    {paper.authors.join(', ')}
                  </p>
                  
                  <p className="text-xs text-slate-500 mb-3">
                    {paper.journal} • {new Date(paper.publicationDate).getFullYear()}
                    {paper.citations && ` • ${paper.citations} citations`}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {paper.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 landscape:gap-1.5">
                    {paper.doi && (
                      <a
                        href={`https://doi.org/${paper.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs sm:text-sm landscape:text-[10px] rounded-md landscape:rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
                      >
                        View Paper
                      </a>
                    )}
                    <button
                      onClick={() => setItemToDelete(paper.id)}
                      className="px-3 py-1.5 bg-red-600 text-white text-xs sm:text-sm landscape:text-[10px] rounded-md landscape:rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5"
                      title="Delete paper"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )) : filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-slate-900 line-clamp-2 flex-1 mr-4">{project.title}</h3>
                <span className={`px-2 py-1 text-xs rounded-full shrink-0 ${
                  project.status === 'active' ? 'bg-green-100 text-green-700' :
                  project.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                  project.status === 'planning' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {project.status}
                </span>
              </div>
              {project.progress !== undefined && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-600">Progress</span>
                    <span className="text-xs font-semibold text-slate-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              <p className="text-sm text-slate-600 mb-3 line-clamp-2">{project.description}</p>
              <p className="text-xs text-slate-500 mb-4">Started: {project.startDate instanceof Date ? project.startDate.toLocaleDateString() : project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</p>
              
              {/* Deliverables Section */}
              {getProjectPapers(project.id).length > 0 && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-xs font-semibold text-blue-700">Deliverables</span>
                    <span className="px-2 py-0.5 bg-blue-200 text-blue-800 text-xs rounded-full">{getProjectPapers(project.id).length}</span>
                  </div>
                  <div className="space-y-1">
                    {getProjectPapers(project.id).slice(0, 2).map((paper) => (
                      <div key={paper.id} className="flex items-start gap-2">
                        <svg className="w-3 h-3 text-blue-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-blue-700 line-clamp-1">{paper.title}</span>
                      </div>
                    ))}
                    {getProjectPapers(project.id).length > 2 && (
                      <p className="text-xs text-blue-600">+{getProjectPapers(project.id).length - 2} more papers</p>
                    )}
                  </div>
                </div>
              )}

              {/* Milestones Section */}
              {project.milestones && project.milestones.length > 0 && (
                <div className="mb-4 p-3 bg-purple-50 border border-purple-100 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span className="text-xs font-semibold text-purple-700">Milestones</span>
                    </div>
                    <span className="text-xs text-purple-600">
                      {project.milestones.filter(m => m.completed).length} / {project.milestones.length} complete
                    </span>
                  </div>
                  <div className="space-y-1">
                    {project.milestones.slice(0, 3).map((milestone) => (
                      <div key={milestone.id} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                          milestone.completed ? 'bg-green-500' : 'bg-purple-300'
                        }`}>
                          {milestone.completed && (
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-xs line-clamp-1 ${
                          milestone.completed ? 'text-purple-600 line-through' : 'text-purple-700'
                        }`}>
                          {milestone.title}
                        </span>
                      </div>
                    ))}
                    {project.milestones.length > 3 && (
                      <p className="text-xs text-purple-600 mt-1">+{project.milestones.length - 3} more milestones</p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-1 mb-4">
                {project.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
                {project.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{project.tags.length - 3}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{project.collaborators.length} collaborators</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditProject(project)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    title="Edit project"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setItemToDelete(project.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Delete project"
                  >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && ((activeTab === 'papers' && filteredPapers.length === 0) || (activeTab === 'projects' && filteredProjects.length === 0)) && (
        <div 
          className={`text-center py-12 text-slate-500 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg mb-2">No {activeTab} found</p>
          <p className="text-sm mb-4">
            {searchQuery || selectedTag ? 'Try adjusting your filters' : `Add your first ${activeTab.slice(0, -1)} to get started`}
          </p>
          <button 
            onClick={() => activeTab === 'papers' ? setShowAddPaperForm(true) : setShowAddProjectForm(true)}
            className={`px-6 py-3 rounded-lg transition-colors ${
              activeTab === 'papers' 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            Add {activeTab === 'papers' ? 'Paper' : 'Project'}
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

      {/* Add Project Form Modal */}
      {showAddProjectForm && (
        <AddProjectForm
          onClose={() => setShowAddProjectForm(false)}
          onSuccess={handleProjectAdded}
        />
      )}

      {/* Edit Paper Form Modal */}
      {paperToEdit && (
        <AddPaperForm
          paperToEdit={paperToEdit}
          onClose={() => setPaperToEdit(null)}
          onSuccess={handlePaperEdited}
        />
      )}

      {/* Edit Project Form Modal */}
      {projectToEdit && (
        <AddProjectForm
          projectToEdit={projectToEdit}
          onClose={() => setProjectToEdit(null)}
          onSuccess={handleProjectEdited}
        />
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div 
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl border border-slate-200/60 relative"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Delete {activeTab === 'papers' ? 'Paper' : 'Project'}?</h3>
                <p className="text-sm text-slate-600">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-slate-700 mb-8">
              Are you sure you want to remove this {activeTab === 'papers' ? 'paper' : 'project'} from your library? This will delete it permanently from your collection.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDeleteItem}
                disabled={deleting}
                className="flex-1 group inline-flex items-center justify-center gap-3 px-6 py-3 bg-linear-to-r from-red-600 to-red-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-300 font-semibold"
              >
                {deleting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete {activeTab === 'papers' ? 'Paper' : 'Project'}
                  </>
                )}
              </button>
              <button
                onClick={() => setItemToDelete(null)}
                disabled={deleting}
                className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryManager;