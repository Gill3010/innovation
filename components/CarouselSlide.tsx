'use client';

import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight, FaStar, FaArrowRight } from 'react-icons/fa';

// ============================================================
// TYPE DEFINITIONS
// ============================================================

interface CarouselSlide {
  id: string | number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  tags?: string[];
  badge?: {
    text: string;
    color: string;
  };
  link?: string;
}

interface ResponsiveCarouselProps {
  slides: CarouselSlide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
}

// ============================================================
// CAROUSEL COMPONENT
// ============================================================

const ResponsiveCarousel: React.FC<ResponsiveCarouselProps> = ({
  slides,
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string>('');
  const mounted = typeof window !== 'undefined';

  const openImageModal = (imageUrl: string) => {
    setModalImage(imageUrl);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setModalImage('');
    document.body.style.overflow = '';
  };

  const goToSlide = useCallback((index: number) => {
    if (isAnimating || index === currentIndex) return;
    
    setIsAnimating(true);
    setDirection(index > currentIndex ? 'right' : 'left');
    setCurrentIndex(index);
    
    setTimeout(() => setIsAnimating(false), 600);
  }, [currentIndex, isAnimating]);

  const nextSlide = useCallback(() => {
    const nextIndex = (currentIndex + 1) % slides.length;
    goToSlide(nextIndex);
  }, [currentIndex, slides.length, goToSlide]);

  const prevSlide = useCallback(() => {
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(prevIndex);
  }, [currentIndex, slides.length, goToSlide]);

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, nextSlide, slides.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  if (!slides || slides.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-2xl">
        <p className="text-gray-500">No slides available</p>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <>
      {/* Render modal via portal directly to body */}
      {mounted && typeof window !== 'undefined' && isModalOpen && createPortal(
        <>
          {/* SUPER CLOSE BUTTON - MAXIMUM Z-INDEX AND VISIBILITY */}
          <button
            onClick={closeImageModal}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 p-4 sm:p-5 bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-full shadow-2xl flex items-center justify-center transition-all duration-200 border-4 border-white/30"
            aria-label="Close image"
            type="button"
            style={{ 
              zIndex: 99999999,
              position: 'fixed',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              pointerEvents: 'auto',
              top: '16px',
              right: '16px'
            }}
          >
            <svg 
              className="w-8 h-8 sm:w-10 sm:h-10 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              strokeWidth={4}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Modal backdrop with scrollable content */}
          <div 
            className="fixed inset-0 bg-black/95 overflow-y-auto overflow-x-hidden"
            style={{ zIndex: 99999998 }}
          >
            <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 py-20 sm:py-24 md:py-32">
              <div className="w-full max-w-[95vw] lg:max-w-7xl">
                <Image
                  src={modalImage}
                  alt="Full size preview"
                  width={2400}
                  height={1600}
                  className="w-full h-auto rounded-lg sm:rounded-xl shadow-2xl"
                  style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
                  priority
                  unoptimized
                />
              </div>
            </div>
          </div>
        </>,
        document.body
      )}

      <section className={`relative w-full ${className}`}>
        <div className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl bg-white">
          
          {/* Layout Grid: Image on left, content on right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] md:min-h-[600px]">
            
            {/* Image Section */}
            <div className="relative h-[300px] md:h-[400px] lg:h-auto overflow-hidden group cursor-pointer" onClick={() => openImageModal(currentSlide.image)}>
              <Image
                src={currentSlide.image}
                alt={currentSlide.title}
                fill
                priority={currentIndex === 0}
                loading={currentIndex === 0 ? 'eager' : 'lazy'}
                className={`object-cover transition-all duration-700 ${
                  isAnimating 
                    ? direction === 'right' 
                      ? 'animate-slideInRight' 
                      : 'animate-slideInLeft'
                    : ''
                }`}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              
              {/* View Image Button Overlay - visible on hover (desktop) and tap indicator (mobile) */}
              <div className="absolute inset-0 bg-black/0 md:group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transform scale-100 md:scale-90 md:group-hover:scale-100 transition-all duration-300 px-4 sm:px-6 py-2 sm:py-3 bg-white/90 md:hover:bg-white text-slate-900 font-bold rounded-full shadow-xl flex items-center gap-2 text-sm sm:text-base">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                  <span className="hidden sm:inline">View Image</span>
                  <span className="sm:hidden">Tap to View</span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="relative bg-linear-to-br from-[#0A1628] to-[#1a2942] p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <div className="max-w-2xl">
              
              {currentSlide.badge && (
                <div className="mb-4 inline-block animate-fadeInUp">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wide bg-white/10 backdrop-blur-sm border border-white/20 text-white`}>
                    <FaStar className="text-yellow-400" />
                    {currentSlide.badge.text}
                  </span>
                </div>
              )}

              <p className="text-sm sm:text-base md:text-lg text-[#00D4FF] font-semibold mb-3 animate-fadeInUp animation-delay-100">
                {currentSlide.subtitle}
              </p>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight animate-fadeInUp animation-delay-200">
                {currentSlide.title}
              </h2>

              <div className="w-20 sm:w-24 h-1 bg-linear-to-r from-[#00D4FF] to-[#0099FF] rounded-full mb-4 sm:mb-6 animate-fadeInUp animation-delay-300" />

              <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 max-w-2xl leading-relaxed animate-fadeInUp animation-delay-400">
                {currentSlide.description}
              </p>

              {currentSlide.tags && currentSlide.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 animate-fadeInUp animation-delay-500">
                  {currentSlide.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm text-white text-xs sm:text-sm font-medium rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-3 sm:gap-4 animate-fadeInUp animation-delay-600">
                {currentSlide.link && (
                  <a
                    href={currentSlide.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-[#00D4FF] to-[#0099FF] text-white font-bold text-sm sm:text-base rounded-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    aria-label={`Learn more about ${currentSlide.title}`}
                  >
                    Visit Site
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                )}
                
                <button
                  onClick={() => openImageModal(currentSlide.image)}
                  className="inline-flex items-center gap-2 px-5 sm:px-8 py-3 sm:py-4 bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-sm text-white font-bold text-sm sm:text-base rounded-full border-2 border-white/30 hover:border-white/50 active:border-white/60 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                  aria-label="View full image"
                  style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="hidden sm:inline">View Image</span>
                  <span className="sm:hidden">View</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {showArrows && slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              disabled={isAnimating}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white backdrop-blur-sm border-2 border-white/40 rounded-full p-2 sm:p-3 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group"
              aria-label="Previous slide"
            >
              <FaChevronLeft className="text-slate-900 text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
            </button>

            <button
              onClick={nextSlide}
              disabled={isAnimating}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white backdrop-blur-sm border-2 border-white/40 rounded-full p-2 sm:p-3 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group"
              aria-label="Next slide"
            >
              <FaChevronRight className="text-slate-900 text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
            </button>
          </>
        )}

        {showDots && slides.length > 1 && (
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                disabled={isAnimating}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? 'w-8 sm:w-10 h-2 sm:h-2.5 bg-[#00D4FF]'
                    : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/40 hover:bg-white/60'
                } disabled:cursor-not-allowed`}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={idx === currentIndex ? 'true' : 'false'}
              />
            ))}
          </div>
        )}
      </div>
    </section>
    </>
  );
};

// ============================================================
// PROJECTS CONTENT - ONLY CAROUSEL WITHOUT DOCUMENTATION
// ============================================================

export default function ProjectsContent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  const projectSlides: CarouselSlide[] = [
    {
      id: 1,
      image: '/images/revistas.up.ac.pa.png',
      title: 'Academic Journal Management System',
      subtitle: 'Research Platform',
      description: 'Comprehensive editorial management and scientific publication platform for Universidad de Panamá. 300% increase in academic visibility with international reach.',
      tags: ['15,000+ Users', '500+ Publications', 'International Impact', 'OJS'],
      badge: {
        text: 'Featured Project',
        color: 'blue',
      },
      link: 'https://revistas.up.ac.pa/',
    },
    {
      id: 2,
      image: '/images/relaticpanama.org__journals.png',
      title: 'RELATIC Panama Journal Portal',
      subtitle: 'Institutional Platform',
      description: 'University management system with integrated modules for RELATIC Panamá. 70% optimization in editorial processes with high indexation rates.',
      tags: ['8,500+ Users', '350+ Publications', 'High Indexing', 'Editorial System'],
      badge: {
        text: 'Process Optimization',
        color: 'green',
      },
      link: 'https://relaticpanama.org/_journals/',
    },
    {
      id: 3,
      image: '/images/dialogoseducativos.png',
      title: 'Educational Sciences Journal',
      subtitle: 'E-Learning Research',
      description: 'Specialized journal in educational sciences with adaptive technology. Regional impact reference in educational research and publication.',
      tags: ['5,000+ Users', '200+ Publications', 'Regional Impact', 'Education Focus'],
      badge: {
        text: 'Educational Leader',
        color: 'purple',
      },
      link: 'https://relaticpanama.org/_journals/index.php/dialogoseducativos',
    },
    {
      id: 4,
      image: '/images/mundosostenible.png',
      title: 'Sustainable World Environmental Journal',
      subtitle: 'Environmental Research',
      description: 'Platform for dissemination and analysis of academic research in environmental management. Leader in environmental research aligned with SDGs.',
      tags: ['4,200+ Users', '180+ Publications', 'SDG Aligned', 'Sustainability'],
      badge: {
        text: 'Environmental Leader',
        color: 'orange',
      },
      link: 'https://relaticpanama.org/_journals/index.php/mundosostenible',
    },
    {
      id: 5,          
      image: '/images/icuali.png',
      title: 'Qualitative Research Journal - ICUALI',
      subtitle: 'Editorial Platform',
      description: 'OJS system for qualitative research publication with world-class editorial system. Rigorous peer review process for academic excellence.',
      tags: ['3,800+ Users', '150+ Publications', 'Peer Review', 'Quality Standards'],
      badge: {
        text: 'World-Class Editorial',
        color: 'pink',
      },
      link: 'https://relaticpanama.org/_journals/index.php/icuali',
    },
    {
      id: 6,
      image: '/images/educaf5-berit.png',
      title: 'Educaf5 Berit Education Journal',
      subtitle: 'Educational System',
      description: 'Educational ERP with student registration and tracking modules. Digital transformation in education with innovation and cutting-edge technology.',
      tags: ['6,500+ Users', '220+ Publications', 'Educational Innovation', 'ERP System'],
      badge: {
        text: 'Digital Transformation',
        color: 'red',
      },
      link: 'https://relaticpanama.org/_journals/index.php/educaf5-berit',
    },
    {
      id: 7,
      image: '/images/relaticpanama.org__posters_.png',
      title: 'Scientific Posters Portal - RELATIC',
      subtitle: 'Academic Events',
      description: 'Platform for academic events and digital presentations. Leading platform in virtual academic events with extensive reach and engagement.',
      tags: ['7,200+ Users', '800+ Presentations', 'Virtual Events', 'Academic Network'],
      badge: {
        text: 'Event Leader',
        color: 'teal',
      },
      link: 'https://relaticpanama.org/_posters',
    },
    {
      id: 8,
      image: '/images/primerencuentro.png',
      title: 'I Qualitative Research Meeting',
      subtitle: 'Professional Training',
      description: 'First qualitative research meeting portal. Beginning of a successful academic network fostering research collaboration and knowledge exchange.',
      tags: ['2,500+ Users', '50+ Papers', 'First Event', 'Network Building'],
      badge: {
        text: 'Network Founder',
        color: 'navy',
      },
      link: 'https://relaticpanama.org/_posters/index.php/primerencuentro',
    },
    {
      id: 9,
      image: '/images/segundoencuentro.png',
      title: 'II Qualitative Research Meeting',
      subtitle: 'Institutional Platform',
      description: 'Second qualitative research meeting with 60% growth. Consolidation of the academic network with integrated university management modules.',
      tags: ['4,000+ Users', '80+ Papers', '60% Growth', 'Network Consolidation'],
      badge: {
        text: 'Network Growth',
        color: 'lime',
      },
      link: 'https://relaticpanama.org/_posters/index.php/segundoencuentro',
    },
    {
      id: 10,
      image: '/images/tercercongreso.png',
      title: 'III Qualitative Research Congress',
      subtitle: 'Research Platform',
      description: 'Comprehensive editorial management and scientific publication platform. Largest qualitative congress in the region with international participation.',
      tags: ['8,000+ Users', '150+ Papers', 'International', 'Regional Leader'],
      badge: {
        text: 'Largest Congress',
        color: 'gold',
      },
      link: 'https://relaticpanama.org/_posters/index.php/tercercongreso',
    },
    {
      id: 11,
      image: '/images/primercongresocientifico.png',
      title: 'I CRUPE Scientific Congress 2025',
      subtitle: 'Multimedia Platform',
      description: 'Multimedia repository for dissemination of academic content at CRUPE. Cutting-edge digital platform with innovation for 2025 and beyond.',
      tags: ['3,200+ Users', '90+ Papers', '2025 Innovation', 'Digital Vanguard'],
      badge: {    
        text: 'Future Innovation',
        color: 'lime',
      },
      link: 'https://relaticpanama.org/_posters/index.php/primercongresocientificointernac',
    },
    {
      id: 12,
      image: '/images/relaticpanama.org__books.png',
      title: 'RELATIC Panama Digital Publishing',
      subtitle: 'Digital Ecosystem',
      description: 'Digital ecosystem for international academic collaboration. Leading open access digital publishing with extensive catalog and global reach.',
      tags: ['12,000+ Users', '300+ Publications', 'Open Access', 'Digital Leader'],
      badge: {
        text: 'Open Access Leader',
        color: 'silver',
      },
      link: 'https://relaticpanama.org/_books/index.php/edrp/catalog',
    },
    {
      id: 13,
      image: '/images/relaticpanama.org__classroom.png',
      title: 'Continuous Learning Platform',
      subtitle: 'E-Learning',
      description: 'Online learning environment with adaptive technology and AI. Cutting-edge adaptive technology for personalized learning experiences.',
      tags: ['9,500+ Users', '400+ Courses', 'AI Adaptive', 'Personalized Learning'],
      badge: {
        text: 'Adaptive Technology',
        color: 'lime',
      },
      link: 'https://relaticpanama.org/_classroom/',
    },
    {
      id: 14,
      image: '/images/relaticpanama.org__protect.png',
      title: 'Intellectual Property & Copyright',
      subtitle: 'Legal Protection',
      description: 'Online teacher training platform for copyright protection. Robust intellectual property protection system with legal compliance and security.',
      tags: ['5,500+ Users', '100+ Courses', 'Legal Protection', 'Copyright System'],
      badge: {
        text: 'Legal Compliance',
        color: 'cyan',
      },
      link: 'https://relaticpanama.org/_protect/',
    },
    {
      id: 15,
      image: '/images/relaticpanama.org__blog.png',
      title: 'RELATIC Academic Blog',
      subtitle: 'Multimedia Content',
      description: 'Multimedia repository for dissemination of academic content. Highest reach in academic networks with viral content and extensive engagement.',
      tags: ['11,000+ Users', '600+ Articles', 'Viral Content', 'Social Reach'],
      badge: {
        text: 'Highest Reach',
        color: 'indigo',
      },
      link: 'https://relaticpanama.org/_blog/',
    },
    {
      id: 16,
      image: '/images/relaticpanama.org__events.png',
      title: 'III Qualitative Research Congress',
      subtitle: 'Research Platform',
      description: 'Platform for dissemination and analysis of academic research. Successful international collaboration between Peru and Panama universities.',
      tags: ['6,800+ Users', '120+ Papers', 'Peru-Panama', 'International Collab'],
      badge: {
        text: 'International Success',
        color: 'brown',
      },
      link: 'https://relaticpanama.org/_events/',
    },
    {
      id: 17,
      image: '/images/relaticpanama.org__events__crupe.png',
      title: 'I CRUPE Scientific Congress 2025',
      subtitle: 'Multimedia Event',
      description: 'Multimedia repository for dissemination of academic content at CRUPE. Successful launch of regional congress with cutting-edge digital infrastructure.',
      tags: ['3,200+ Users', '90+ Papers', '2025 Event', 'Regional Launch'],
      badge: {
        text: 'Successful Launch',
        color: 'violet',
      },
      link: 'https://relaticpanama.org/_events/_crupe/',
    }
  ];

  return (
    <div 
      className={`w-full transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <ResponsiveCarousel
        slides={projectSlides}
        autoPlay={true}
        autoPlayInterval={5000}
        showDots={true}
        showArrows={true}
      />
    </div>
  );
}