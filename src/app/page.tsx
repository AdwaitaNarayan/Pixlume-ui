"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getPhotos, Photo } from "../../services/api";
import PhotoCard from "../../components/PhotoCard";
import PhotoLightbox from "../../components/PhotoLightbox";
import AboutSection from "../../components/AboutSection";
import Footer from "../../components/Footer";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { X, Search } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [heroSearch, setHeroSearch] = useState("");
  const [featuredPhotos, setFeaturedPhotos] = useState<Photo[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const { scrollY } = useScroll();
  const heroGridY = useTransform(scrollY, [0, 500], [0, 100]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.8]);

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
    <div className="min-h-screen bg-white font-sans dark:bg-zinc-950">
      {/* Hero Section */}
      <header className="relative w-full overflow-hidden bg-white dark:bg-zinc-950 pt-32 pb-20 sm:pt-48 sm:pb-32">
        {/* Subtle Background Detail */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(8,145,178,0.03)_0%,transparent_70%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1600px] px-6 lg:px-12 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-4xl"
          >
            <h1 className="text-5xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-7xl lg:text-8xl">
              Elevated imagery for <br />
              <span className="text-zinc-500 italic font-serif">design-led</span> projects.
            </h1>
            <p className="mx-auto mt-8 max-w-xl text-lg text-zinc-500 dark:text-zinc-400 sm:text-xl font-light leading-relaxed">
              Curated, high-resolution photography studio. <br />
              Bridging the gap between raw art and production-ready assets.
            </p>
          </motion.div>

          {/* Search Bar Container */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-14 w-full max-w-2xl"
          >
            <form 
                onSubmit={handleHeroSearchSubmit} 
                className="group relative flex w-full items-center pl-6 pr-2 py-2 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-sm focus-within:shadow-lg focus-within:border-zinc-400 dark:focus-within:border-white/30 transition-all duration-300"
            >
                <Search className="w-5 h-5 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search by keyword or category..." 
                    value={heroSearch}
                    onChange={e => setHeroSearch(e.target.value)}
                    className="flex-1 px-4 py-3 bg-transparent text-lg font-normal text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 outline-none"
                />
                <button 
                    type="submit" 
                    className="rounded-xl bg-zinc-900 dark:bg-white px-6 py-3 text-sm font-semibold text-white dark:text-zinc-900 hover:opacity-90 active:scale-95 transition-all"
                >
                    Search
                </button>
            </form>

            <div className="mt-6 flex flex-wrap justify-center items-center gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Popular</span>
                {["Minimal", "Nature", "Abstract", "Urban"].map((tag) => (
                    <button 
                        key={tag}
                        onClick={() => router.push(`/gallery?search=${tag}`)}
                        className="px-4 py-1.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-transparent hover:border-zinc-200 dark:hover:border-white/10 transition-all"
                    >
                        {tag}
                    </button>
                ))}
            </div>
          </motion.div>
        </div>
      </header>


      {/* Featured Preview Section */}
      <main className="relative z-20 bg-white dark:bg-zinc-950 transition-colors duration-300">
        <section className="mx-auto max-w-[1600px] px-6 py-24 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="max-w-2xl">
                    <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-4xl italic font-serif">Featured Works</h2>
                    <p className="mt-4 text-zinc-500 dark:text-zinc-400 font-light text-lg">A curated selection of our most recent high-fidelity captures.</p>
                </div>
                <Link 
                    href="/gallery" 
                    className="group inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white hover:opacity-70 transition-opacity"
                >
                    View all collections
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </div>
            
            <div className="columns-1 gap-8 sm:columns-2 lg:columns-4 [column-fill:_balance]">
                {loadingFeatured ? (
                    [1, 2, 3, 4].map(i => (
                        <div key={i} className="mb-8 break-inside-avoid">
                            <div className="skeleton-shimmer w-full rounded-2xl bg-zinc-100 dark:bg-zinc-900" style={{ height: i % 2 === 0 ? '400px' : '300px' }} />
                        </div>
                    ))
                ) : (
                    featuredPhotos.map((photo) => (
                        <div key={photo.id} className="mb-8 break-inside-avoid">
                            <PhotoCard photo={photo} onClick={() => setSelectedPhoto(photo)} />
                        </div>
                    ))
                )}
            </div>
        </section>

        {/* Collections Section */}
        <section id="collections" className="py-32 border-t border-zinc-100 dark:border-white/5 transition-colors duration-300">
            <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
                <div className="max-w-2xl mb-16">
                    <h2 className="text-3xl font-semibold text-zinc-900 dark:text-white sm:text-4xl italic font-serif">Curated Series</h2>
                    <p className="mt-4 text-zinc-500 dark:text-zinc-400 font-light text-lg">Hand-picked narratives told through professional lenses.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                    {[
                        { name: "Nature Wonders", count: 45, image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800" },
                        { name: "Urban Architecture", count: 32, image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800" },
                        { name: "Abstract Vibe", count: 28, image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800" },
                    ].map((col, idx) => (
                        <motion.div 
                          key={col.name} 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
                          className="group relative cursor-pointer"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
                                <img src={col.image} alt={col.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors duration-500" />
                                <div className="absolute bottom-8 left-8">
                                    <h3 className="text-2xl font-semibold text-white tracking-tight">{col.name}</h3>
                                    <p className="mt-1 text-sm text-zinc-300 font-medium uppercase tracking-widest">{col.count} Images</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* About Section */}
        <AboutSection />

        {/* Footer Section */}
        <Footer />
      </main>

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
