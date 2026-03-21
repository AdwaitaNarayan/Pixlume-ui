"use client";

import { useState } from "react";
import Gallery from "../../components/Gallery";

export default function Home() {
  const [heroSearch, setHeroSearch] = useState("");

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const event = new CustomEvent("hero-search", { detail: heroSearch.trim() });
    window.dispatchEvent(event);
    window.scrollTo({
      top: window.innerHeight * 0.7,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      {/* Hero Section */}
      <header className="relative w-full overflow-hidden bg-white/50 py-24 shadow-sm dark:bg-black sm:py-32">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)]"></div>
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-zinc-50 to-transparent dark:from-zinc-950" />
        
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 dark:opacity-20 blur-3xl">
          <div className="h-[30rem] w-[30rem] rounded-full bg-cyan-400 mix-blend-multiply opacity-50 dark:mix-blend-screen transition-transform duration-[10s] hover:scale-110" />
          <div className="h-[25rem] w-[25rem] rounded-full bg-blue-600 mix-blend-multiply opacity-40 dark:mix-blend-screen -ml-32 mt-32 transition-transform duration-[15s] hover:-translate-x-10" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-7xl">
            Welcome to <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Pixlume</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            A high-resolution photography platform. Discover, search, and download premium image variants ranging from thumbnails to breathtaking 4K resolutions.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleHeroSearchSubmit} className="mt-10 mx-auto flex w-full max-w-xl items-center p-1.5 rounded-full bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-md transition-shadow focus-within:ring-2 focus-within:ring-cyan-500/50">
            <svg className="ml-4 h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search high-res photos..." 
              value={heroSearch}
              onChange={e => setHeroSearch(e.target.value)}
              className="flex-1 px-4 py-2 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none"
            />
            <button type="submit" className="flex items-center justify-center rounded-full bg-cyan-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-cyan-500 hover:scale-105 active:scale-95">
              Search Gallery
            </button>
          </form>

          {/* Trust Signals */}
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-x-8">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center -space-x-2">
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-zinc-900 object-cover" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-zinc-900 object-cover" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-zinc-900 object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80" alt="User" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-zinc-900 object-cover" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" />
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                <span className="font-semibold text-zinc-900 dark:text-zinc-200">10K+</span> Images Available
              </div>
            </div>
            
            <div className="hidden h-4 w-px bg-zinc-300 dark:bg-zinc-700 sm:block"></div>
            
            <div className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="flex text-yellow-500">
                {[1,2,3,4,5].map((star) => (
                  <svg key={star} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-medium text-zinc-900 dark:text-zinc-200">5.0/5</span> from users
            </div>
          </div>
        </div>
      </header>

      {/* Main Content (Gallery) */}
      <main className="relative z-20 -mt-10 bg-white dark:bg-zinc-950 rounded-t-[3rem] shadow-[0_0_40px_rgba(0,0,0,0.05)] dark:shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <Gallery />
      </main>
    </div>
  );
}
