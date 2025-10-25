'use client';

import React, { useState, useEffect } from 'react';

const SearchComponent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Aquí puedes agregar la lógica de búsqueda
      console.log('Searching for:', searchQuery);
      // Por ahora, redirigir a la página de research con el query
      window.location.href = `/research?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div 
      className={`w-full max-w-2xl mx-auto transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: '200ms' }}
    >
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg 
              className={`w-5 h-5 transition-colors duration-200 ${
                isFocused ? 'text-blue-400' : 'text-white/70'
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search research papers, projects, or topics..."
            className={`w-full pl-12 pr-4 py-4 text-lg bg-white/10 backdrop-blur-md border-2 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 ${
              isFocused 
                ? 'border-blue-400/50 bg-white/20 shadow-lg shadow-blue-500/20' 
                : 'border-white/20 hover:border-white/30 hover:bg-white/15'
            }`}
          />
          
          <button
            type="submit"
            disabled={!searchQuery.trim()}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
              searchQuery.trim()
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                : 'bg-white/20 text-white/50 cursor-not-allowed'
            }`}
          >
            Search
          </button>
        </div>
      </form>
      
      {/* Search suggestions */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <span className="text-white/60 text-sm">Popular searches:</span>
        {['Machine Learning', 'AI Research', 'Data Science', 'Neuroscience'].map((term) => (
          <button
            key={term}
            onClick={() => setSearchQuery(term)}
            className="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-full transition-all duration-200 hover:scale-105"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchComponent;

