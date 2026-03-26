"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPhotos, Photo } from "../../services/api";
import PhotoCard from "../../components/PhotoCard";
import PhotoLightbox from "../../components/PhotoLightbox";
import AboutSection from "../../components/AboutSection";
import Footer from "../../components/Footer";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [heroSearch, setHeroSearch] = useState("");
  const [featuredPhotos, setFeaturedPhotos] = useState<Photo[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // Fetch a small subset for the homepage preview
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getPhotos(1, 4); // Just get the top 4
        setFeaturedPhotos(data.results);
      } catch (err) {
        console.error("Failed to load featured photos:", err);
      } finally {
        setLoadingFeatured(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroSearch.trim()) return;
    router.push(`/gallery?search=${encodeURIComponent(heroSearch.trim())}`);
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

      {/* Featured Preview Section */}
      <main className="relative z-20 -mt-10 bg-white dark:bg-zinc-950 rounded-t-[3rem] shadow-[0_0_40px_rgba(0,0,0,0.05)] dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-colors duration-300">
        <section className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">Featured Shots</h2>
            <p className="mx-auto mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">A glimpse of our latest high-resolution professional collections.</p>
            
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {loadingFeatured ? (
                    [1, 2, 3, 4].map(i => <div key={i} className="skeleton-shimmer aspect-[4/5] rounded-2xl" />)
                ) : (
                    featuredPhotos.map((photo) => (
                        <PhotoCard key={photo.id} photo={photo} onClick={() => setSelectedPhoto(photo)} />
                    ))
                )}
            </div>

            <div className="mt-16 flex justify-center">
                <Link 
                    href="/gallery" 
                    className="group relative flex items-center gap-2 rounded-2xl bg-zinc-900 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-black dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                >
                    Explore Full Gallery
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </div>
        </section>
      </main>

      {/* Collections Section Placeholder */}
      <section id="collections" className="py-24 bg-zinc-50 dark:bg-zinc-900/10 transition-colors duration-300">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">Featured Collections</h2>
              <p className="mt-4 text-zinc-600 dark:text-zinc-400">Curated sets of high-resolution imagery specifically tailored for your projects.</p>
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                      { name: "Nature Wonders", count: 45, image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800" },
                      { name: "Urban Architecture", count: 32, image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800" },
                      { name: "Abstract Vibe", count: 28, image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800" },
                  ].map((col) => (
                      <div key={col.name} className="group relative overflow-hidden rounded-3xl cursor-pointer">
                          <img src={col.image} alt={col.name} className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute bottom-6 left-6 text-left">
                              <h3 className="text-xl font-bold text-white">{col.name}</h3>
                              <p className="text-sm text-zinc-300">{col.count} Photos</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Footer Section */}
      <Footer />

      {/* ── Photo Lightbox Modal ── */}
      {selectedPhoto && (
        <PhotoLightbox 
          photo={selectedPhoto} 
          allPhotos={featuredPhotos}
          onClose={() => setSelectedPhoto(null)}
          onNavigate={(p) => setSelectedPhoto(p)}
        />
      )}
    </div>
  );
}
