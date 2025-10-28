"use client";

import { useState, useEffect } from 'react';
import Button from '../components/Button';
import SearchComponent from '../components/SearchComponent';
import HeroCTA from '../components/HeroCTA';


export default function Home() {
  const videoSrc = "/videos/pexels-office-6774633.mp4";
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  useEffect(() => {
    const checkScrollable = () => {
      // Check if there's content to scroll
      const hasScrollableContent = window.innerHeight < document.documentElement.scrollHeight;
      // Check if user has scrolled past certain point
      const scrolledPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      setShowScrollIndicator(hasScrollableContent && scrolledPercentage < 90);
    };

    // Check on mount
    checkScrollable();

    // Check on scroll
    window.addEventListener('scroll', checkScrollable);
    window.addEventListener('resize', checkScrollable);

    return () => {
      window.removeEventListener('scroll', checkScrollable);
      window.removeEventListener('resize', checkScrollable);
    };
  }, []);

  return (
    <div className="relative w-full overflow-x-hidden">
      {/* Background video - Fixed position to stay static during scroll */}
      <video
        className="fixed inset-0 h-screen w-full object-cover z-0"
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />

      {/* Subtle overlay to ensure text readability */}
      <div
        aria-hidden="true"
        className="fixed inset-0 h-screen bg-black/30 z-0"
        style={{ mixBlendMode: 'normal' }}
      />

      {/* Centered content overlay — preserves original text exactly */}
      <main className="relative z-10 flex min-h-screen landscape:min-h-[100dvh] flex-col items-center justify-center px-6 landscape:px-4 text-center bg-transparent">
        <h1 className="text-4xl landscape:text-3xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          <span className="block">Welcome to</span>
          <span className="block text-blue-300">Innova Proyectos</span>
        </h1>

        <p className="mt-4 landscape:mt-2 max-w-xl text-lg landscape:text-base text-white/90 sm:text-lg md:mt-6 md:text-xl">
          Discover the future of innovation with our cutting-edge platform. Start your journey today.
        </p>

        {/* "Get Started" button using Button component */}
        <div className="mt-8 landscape:mt-4">
          <Button text="Get Started" />
        </div>

        {/* Search Component */}
        <div className="mt-12 landscape:mt-6">
          <SearchComponent />
        </div>
      </main>

      {/* Hero CTA Section */}
      <div className="relative z-10">
        <HeroCTA />
      </div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="flex flex-col items-center">
            <span className="text-sm text-white/80 mb-2 font-medium tracking-wide">
              Scroll to explore
            </span>
            <div className="relative w-12 h-12">
              {/* Animated arrow */}
              <svg
                className="w-12 h-12 text-white drop-shadow-lg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
              {/* Pulsing circle effect */}
              <div className="absolute inset-0 animate-ping">
                <div className="w-12 h-12 rounded-full border-2 border-white/30"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
