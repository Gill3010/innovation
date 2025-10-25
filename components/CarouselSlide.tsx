'use client';

import React from 'react';
import { useState, useEffect, useCallback } from 'react';
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
    <section className={`relative w-full ${className}`}>
      <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl bg-linear-to-br from-gray-50 to-gray-100">
        
        <div className="absolute inset-0">
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
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1920px"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0A1628]/95 via-[#0A1628]/50 to-transparent" />
        </div>

        <div className="relative h-full flex items-end">
          <div className="w-full px-6 sm:px-8 md:px-12 lg:px-16 pb-12 sm:pb-16 md:pb-20 lg:pb-24">
            <div className="max-w-4xl">
              
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

              {currentSlide.link && (
                <a
                  href={currentSlide.link}
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-[#00D4FF] to-[#0099FF] text-white font-bold text-sm sm:text-base rounded-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fadeInUp animation-delay-600"
                  aria-label={`Learn more about ${currentSlide.title}`}
                >
                  Learn More
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              )}
            </div>
          </div>
        </div>

        {showArrows && slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              disabled={isAnimating}
              className="absolute left-4 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-full p-3 sm:p-4 hover:bg-white/20 hover:border-white/40 transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group"
              aria-label="Previous slide"
            >
              <FaChevronLeft className="text-white text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
            </button>

            <button
              onClick={nextSlide}
              disabled={isAnimating}
              className="absolute right-4 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-full p-3 sm:p-4 hover:bg-white/20 hover:border-white/40 transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group"
              aria-label="Next slide"
            >
              <FaChevronRight className="text-white text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
            </button>
          </>
        )}

        {showDots && slides.length > 1 && (
          <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                disabled={isAnimating}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? 'w-8 sm:w-10 h-2 sm:h-2.5 bg-white'
                    : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/40 hover:bg-white/60'
                } disabled:cursor-not-allowed`}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={idx === currentIndex ? 'true' : 'false'}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.7s ease-out forwards;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.7s ease-out forwards;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
          opacity: 0;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
          opacity: 0;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
        }
      `}</style>
    </section>
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
      title: 'Transform Your Digital Presence',
      subtitle: 'Web Development',
      description: 'Build stunning, high-performance websites that engage users and drive results. Our expert team delivers cutting-edge solutions tailored to your business needs.',
      tags: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      badge: {
        text: 'Featured Project',
        color: 'blue',
      },
      link: '#contact',
    },
    {
      id: 2,
      image: '/api/placeholder/1920/1080',
      title: 'Innovative Mobile Solutions',
      subtitle: 'Mobile Development',
      description: 'Create seamless mobile experiences that users love. Native iOS and Android apps built with modern frameworks for optimal performance.',
      tags: ['React Native', 'iOS', 'Android', 'Cross-Platform'],
      badge: {
        text: 'New Service',
        color: 'green',
      },
      link: '#services',
    },
    {
      id: 3,
      image: '/api/placeholder/1920/1080',
      title: 'Scale Your Business with Cloud',
      subtitle: 'Cloud Infrastructure',
      description: 'Leverage powerful cloud solutions to scale efficiently. Enterprise-grade infrastructure, security, and reliability for your growing business.',
      tags: ['AWS', 'Azure', 'DevOps', 'CI/CD'],
      badge: {
        text: 'Popular Choice',
        color: 'purple',
      },
      link: '#portfolio',
    },
    {
      id: 4,
      image: '/api/placeholder/1920/1080',
      title: 'Data-Driven Insights',
      subtitle: 'Data Analytics',
      description: 'Unlock the power of your data with advanced analytics and visualization. Make informed decisions that drive growth and innovation.',
      tags: ['Python', 'R', 'Machine Learning', 'Big Data'],
      badge: {
        text: 'Top Rated',
        color: 'orange',
      },
      link: '#about',
    },
    {
      id: 5,          
      image: '/api/placeholder/1920/1080',
      title: 'Seamless User Experiences',
      subtitle: 'UI/UX Design',
      description: 'Craft intuitive and engaging user experiences that drive satisfaction and loyalty. Our design team focuses on user-centered solutions.',
      tags: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
      badge: {
        text: 'Client Favorite',
        color: 'pink',
      },
      link: '#contact',
    },
    {
      id: 6,
      image: '/api/placeholder/1920/1080',
      title: 'Robust E-commerce Platforms',
      subtitle: 'E-commerce Solutions',
      description: 'Develop scalable e-commerce platforms that enhance customer experience and boost sales. Integrated solutions for all your online business needs.',
      tags: ['Shopify', 'Magento', 'WooCommerce', 'Payment Gateways'],
      badge: {
        text: 'Best Seller',
        color: 'red',
      },
      link: '#services',
    },
    {
      id: 7,
      image: '/api/placeholder/1920/1080',
      title: 'Advanced Cybersecurity Measures',
      subtitle: 'Cybersecurity Services',
      description: 'Protect your digital assets with state-of-the-art cybersecurity solutions. Comprehensive strategies to safeguard against evolving threats.',
      tags: ['Network Security', 'Penetration Testing', 'Compliance', 'Risk Management'],
      badge: {
        text: 'Secure Choice',
        color: 'teal',
      },
      link: '#portfolio',
    },
    {
      id: 8,
      image: '/api/placeholder/1920/1080',
      title: 'Efficient IT Consulting',
      subtitle: 'IT Consulting Services',
      description: 'Optimize your IT infrastructure with expert consulting services. Tailored strategies to enhance efficiency, reduce costs, and drive innovation.',
      tags: ['IT Strategy', 'System Integration', 'Cloud Migration', 'Digital Transformation'],
      badge: {
        text: 'Trusted Advisor',
        color: 'navy',
      },
      link: '#about',
    },
    {
      id: 9,
      image: '/api/placeholder/1920/1080',
      title: 'Cutting-Edge AI Solutions',
      subtitle: 'Artificial Intelligence',
      description: 'Implement AI-driven solutions to automate processes and gain competitive advantages. From machine learning to natural language processing, we cover it all.',
      tags: ['AI', 'Machine Learning', 'NLP', 'Automation'],
      badge: {
        text: 'Innovative Tech',
        color: 'lime',
      },
      link: '#contact',
    },
    {
      id: 10,
      image: '/api/placeholder/1920/1080',
      title: 'Comprehensive Digital Marketing',
      subtitle: 'Digital Marketing Services',
      description: 'Boost your online presence with targeted digital marketing strategies. SEO, SEM, social media, and content marketing to drive traffic and conversions.',
      tags: ['SEO', 'Content Marketing', 'Social Media', 'PPC'],
      badge: {
        text: 'Marketing Expert',
        color: 'gold',
      },
      link: '#services',
    },
    {
      id: 11,
      image: '/api/placeholder/1920/1080',
      title: 'Innovative IoT Solutions',
      subtitle: 'Internet of Things',
      description: 'Connect and manage devices with our IoT solutions. From smart homes to industrial applications, we provide end-to-end IoT services.',
      tags: ['IoT', 'Embedded Systems', 'Cloud Integration', 'Data Analytics'],
      badge: {    
        text: 'Innovative Tech',
        color: 'lime',
      },
      link: '#contact',
    },
    {
      id: 12,
      image: '/api/placeholder/1920/1080',
      title: 'Next-Gen Blockchain Development',
      subtitle: 'Blockchain Solutions',
      description: 'Leverage blockchain technology for secure and transparent transactions. Custom blockchain development for various industries and applications.',
      tags: ['Blockchain', 'Smart Contracts', 'Cryptocurrency', 'Decentralized Apps'],
      badge: {
        text: 'Cutting Edge',
        color: 'silver',
      },
      link: '#portfolio',
    },
    {
      id: 13,
      image: '/api/placeholder/1920/1080',
      title: 'Immersive AR/VR Experiences',
      subtitle: 'Augmented & Virtual Reality',
      description: 'Create engaging AR and VR experiences that captivate users. From gaming to training simulations, we bring your ideas to life with immersive technology.', 
      tags: ['AR', 'VR', 'Immersive Technology', 'User Experience'],
      badge: {
        text: 'Innovative Tech',
        color: 'lime',
      },
      link: '#contact',
    },
    {
      id: 14,
      image: '/api/placeholder/1920/1080',
      title: 'Efficient Robotic Process Automation',
      subtitle: 'RPA Solutions',
      description: 'Automate repetitive tasks with our RPA solutions. Increase efficiency and reduce errors with intelligent automation tailored to your business processes.',
      tags: ['RPA', 'Automation', 'Efficiency', 'Business Processes'],
      badge: {
        text: 'Productivity Boost',
        color: 'cyan',
      },
      link: '#about',
    },
    {
      id: 15,
      image: '/api/placeholder/1920/1080',
      title: 'Comprehensive Software Testing',
      subtitle: 'QA & Testing Services',
      description: 'Ensure the quality and reliability of your software with our comprehensive testing services. Manual and automated testing tailored to your project needs.',
      tags: ['QA', 'Automated Testing', 'Manual Testing', 'Software Reliability'],
      badge: {
        text: 'Quality First',
        color: 'indigo',
      },
      link: '#services',
    },
    {
      id: 16,
      image: '/api/placeholder/1920/1080',
      title: 'Seamless System Integration',
      subtitle: 'Integration Services',
      description: 'Integrate disparate systems and applications for seamless data flow and improved efficiency. Customized integration solutions to meet your business needs.',
      tags: ['System Integration', 'APIs', 'Data Flow', 'Efficiency'],
      badge: {
        text: 'Connected Solutions',
        color: 'brown',
      },
      link: '#portfolio',
    },
    {
      id: 17,
      image: '/api/placeholder/1920/1080',
      title: 'Cutting-Edge Quantum Computing',
      subtitle: 'Quantum Solutions',
      description: 'Explore the potential of quantum computing with our innovative solutions. From research to application, we help you harness the power of quantum technology.',
      tags: ['Quantum Computing', 'Research', 'Innovation', 'Future Tech'],
      badge: {
        text: 'Future Ready',
        color: 'violet',
      },
      link: '#about',
    },
    {
      id: 18,
      image: '/api/placeholder/1920/1080',
      title: 'Advanced Geographic Information Systems',
      subtitle: 'GIS Solutions',
      description: 'Utilize GIS technology for spatial data analysis and visualization. Customized GIS solutions for various industries and applications.',
      tags: ['GIS', 'Spatial Analysis', 'Data Visualization', 'Mapping'],
      badge: {
        text: 'Spatial Expert',
        color: 'olive',
      },
      link: '#contact',
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