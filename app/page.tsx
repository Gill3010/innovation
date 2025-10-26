"use client";

import Button from '../components/Button';
import SearchComponent from '../components/SearchComponent';


export default function Home() {
  const videoSrc = "/videos/pexels-office-6774633.mp4";

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
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
        className="absolute inset-0 bg-black/30"
        style={{ mixBlendMode: 'normal' }}
      />

      {/* Centered content overlay — preserves original text exactly */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          <span className="block">Welcome to</span>
          <span className="block text-blue-300">Innova Proyectos</span>
        </h1>

        <p className="mt-4 max-w-xl text-lg text-white/90 sm:text-lg md:mt-6 md:text-xl">
          Discover the future of innovation with our cutting-edge platform. Start your journey today.
        </p>

        {/* "Get Started" button using Button component */}
        <div className="mt-8">
          <Button text="Get Started" />
        </div>

        {/* Search Component */}
        <div className="mt-12">
          <SearchComponent />
        </div>
      </main>

      
    </div>
  );
}
