'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const HeroCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Intersection Observer for fade up animation on scroll
  useEffect(() => {
    const currentRef = sectionRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInViewport(true);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Instant Insights',
      description: 'Real-time analytics',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: 'Secure Platform',
      description: 'Enterprise-grade security',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
      ),
      title: 'Scalable Solutions',
      description: 'Grows with your business',
    },
  ];

  const stats = [
    { number: '10K+', label: 'Active Teams' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' },
  ];

  return (
    <section 
      ref={sectionRef}
      className={`relative z-10 py-16 md:py-20 overflow-hidden transition-all duration-1000 ${
        isInViewport ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      {/* Lighter overlay for better video visibility */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Animated background elements with parallax */}
      <div 
        className="absolute inset-0 opacity-10 transition-transform duration-300 ease-out"
        style={{ 
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` 
        }}
      >
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA Card with glassmorphism */}
        <div 
          className={`bg-white/85 backdrop-blur-md rounded-2xl shadow-2xl border border-white/60 p-6 md:p-8 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center">
            {/* Compact Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold mb-4 shadow-lg animate-pulse">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              LIMITED OFFER
            </div>

            {/* Heading with animated gradient */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-3 leading-tight">
              Ready to Accelerate Your
              <span className="block mt-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-pulse bg-[length:200%_auto]">
                Innovation Journey?
              </span>
            </h2>

            <p className="text-base md:text-lg text-gray-800 max-w-2xl mx-auto mb-6 font-medium">
              Join <strong className="text-blue-600">10,000+ teams</strong> powering their digital transformation. Start building today.
            </p>

            {/* CTA Buttons with enhanced animations */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
              <Link
                href="/contact"
                className="group relative inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative">Get Started Free</span>
                <svg className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span className="absolute top-0 right-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
              </Link>
              
              <Link
                href="/research"
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-white/90 backdrop-blur-sm border-2 border-gray-300 text-gray-800 font-bold rounded-xl hover:border-blue-500 hover:text-blue-600 hover:bg-white transition-all duration-300 hover:shadow-lg"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch Demo
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center px-4 py-2 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200/50 transition-all duration-300 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-xs font-semibold text-gray-700">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Compact Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm hover:from-white/90 hover:to-white/80 transition-all duration-300 border border-gray-200/50 hover:border-blue-300 hover:shadow-md ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${(index + 3) * 100}ms` }}
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-md">
                    {feature.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-gray-900">{feature.title}</h3>
                    <p className="text-xs text-gray-700">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Indicators with icons */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-gray-700 pt-4 border-t border-gray-300/50">
              <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                No Credit Card
              </div>
              <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                2-Min Setup
              </div>
              <div className="flex items-center gap-1.5 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200">
                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Cancel Anytime
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCTA;