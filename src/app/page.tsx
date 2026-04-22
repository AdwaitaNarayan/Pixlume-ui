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
import { X } from "lucide-react";

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
        const data = await getPhotos(1, 12); // Fetch 12 for the infinite marquee
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
      <header className="relative w-full overflow-hidden bg-white dark:bg-zinc-950 py-28 sm:py-40">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-cyan-500/10 dark:bg-cyan-500/5 blur-[120px] rounded-full" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              translateY: [0, 50, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-[20%] -right-[5%] w-[35%] h-[35%] bg-blue-600/10 dark:bg-blue-600/5 blur-[120px] rounded-full" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.15, 1],
              translateX: [0, -30, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full" 
          />
        </div>

        {/* Grid Overlay */}
        <motion.div 
            style={{ y: heroGridY, opacity: heroOpacity }}
            className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)]" 
        />

        {/* Floating Decorative Elements (Abstract Photos) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none hidden lg:block">
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 0.4, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute top-1/4 left-10 w-32 h-44 rounded-2xl overflow-hidden border border-white/20 shadow-2xl rotate-[-6deg] blur-[1px]"
            >
                <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400" alt="" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 0.4, x: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="absolute top-1/3 right-12 w-40 h-52 rounded-2xl overflow-hidden border border-white/20 shadow-2xl rotate-[8deg] blur-[2px]"
            >
                <img src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=400" alt="" className="w-full h-full object-cover" />
            </motion.div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <h1 className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white sm:text-8xl lg:text-9xl leading-[0.95]">
              Welcome to <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">Pixlume</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-2xl sm:mt-8">
              Discover the art of professional photography. <br className="hidden sm:block" /> 
              Curated assets for the world's most ambitious projects.
            </p>
          </motion.div>

          {/* Search Bar Container */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-12 w-full max-w-3xl flex flex-col items-center"
          >
            <form 
                onSubmit={handleHeroSearchSubmit} 
                className="group relative flex flex-col md:flex-row w-full items-stretch md:items-center p-2 rounded-[1.5rem] md:rounded-[2.5rem] bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-3xl transition-all focus-within:ring-2 focus-within:ring-cyan-500/30 focus-within:border-cyan-500/50"
            >
                <div className="flex-1 flex items-center min-h-[60px]">
                    <div className="ml-5 p-2 rounded-xl bg-zinc-100 dark:bg-white/5 text-zinc-400 dark:text-zinc-500 transition-colors group-focus-within:text-cyan-500">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search for nature, architecture..." 
                        value={heroSearch}
                        onChange={e => setHeroSearch(e.target.value)}
                        className="flex-1 px-4 py-4 md:py-6 bg-transparent text-lg md:text-xl font-medium text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 outline-none"
                    />
                </div>
                <button 
                    type="submit" 
                    className="relative overflow-hidden group rounded-[1.2rem] md:rounded-[2rem] bg-zinc-900 dark:bg-white px-8 py-4 md:py-6 text-sm font-black text-white dark:text-zinc-900 transition-all hover:scale-[1.02] active:scale-95 shadow-2xl mt-2 md:mt-0"
                >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                        Search Gallery
                        <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            →
                        </motion.span>
                    </span>
                    <div className="absolute inset-0 z-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-10 dark:group-hover:opacity-100" />
                </button>
            </form>

            <div className="mt-8 w-full">
                <div className="flex items-center gap-4 mb-4 px-2 overflow-x-auto no-scrollbar scroll-smooth">
                    <span className="text-[10px] whitespace-nowrap font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Trending Now</span>
                    {["Nature", "Urban", "Abstract", "Architecture", "Minimal", "Cinematic"].map((tag) => (
                        <button 
                            key={tag}
                            onClick={() => router.push(`/gallery?search=${tag}`)}
                            className="px-6 py-3 min-h-[48px] rounded-xl text-xs font-black bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10 transition-all border border-zinc-200/50 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/20 active:scale-95 whitespace-nowrap shadow-sm"
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
          </motion.div>

          {/* Social Proof & Rating */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-24 flex flex-col items-center gap-12"
          >
            <div className="flex flex-col sm:flex-row items-center gap-8 md:gap-12">
                <div className="hidden sm:flex items-center -space-x-5">
                    {[
                        "https://i.pravatar.cc/100?u=12",
                        "https://i.pravatar.cc/100?u=24",
                        "https://i.pravatar.cc/100?u=36",
                        "https://i.pravatar.cc/100?u=48"
                    ].map((src, i) => (
                        <motion.img 
                            key={i}
                            whileHover={{ y: -8, zIndex: 10, scale: 1.1 }}
                            className="h-14 w-14 rounded-full border-[6px] border-white dark:border-zinc-950 shadow-2xl object-cover ring-1 ring-zinc-200 dark:ring-white/10" 
                            src={src} 
                            alt="User" 
                        />
                    ))}
                </div>
                <div className="text-center sm:text-left">
                    <p className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white leading-none">10,000+</p>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Global Contributors</p>
                </div>
            </div>

            <div className="flex flex-col items-center gap-3">
                <div className="flex gap-1.5">
                    {[1,2,3,4,5].map((s) => (
                        <motion.svg 
                            key={s} 
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, delay: s * 0.2, repeat: Infinity }}
                            className="w-6 h-6 text-amber-400 fill-current drop-shadow-sm" 
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </motion.svg>
                    ))}
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-600 bg-zinc-100 dark:bg-white/5 px-4 py-1 rounded-full border border-zinc-200/50 dark:border-white/5">World-Class Photography Standards</p>
            </div>
          </motion.div>
        </div>

        {/* Studio Status Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl px-6"
        >
          <div className="flex justify-between items-center px-8 py-5 rounded-2xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-3xl border border-white/20 dark:border-white/5 shadow-2xl">
            {[
              { label: "Assets", value: "2.4k+" },
              { label: "Artists", value: "150+" },
              { label: "Downloads", value: "125k+" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-1">{stat.label}</p>
                <p className="text-xl font-black text-zinc-900 dark:text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Fade Transition */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-zinc-950 to-transparent z-10" />
      </header>

      {/* Featured Preview Section */}
      <main className="relative z-20 -mt-10 bg-white dark:bg-zinc-950 rounded-t-[3rem] shadow-[0_0_40px_rgba(0,0,0,0.05)] dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-colors duration-300">
        <section className="mx-auto max-w-7xl px-6 py-24 text-center lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 relative inline-block"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] border border-cyan-500/20 mb-6">Latest Selection</span>
              <h2 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-6xl mb-2">Featured Shots</h2>
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "60%" }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-1 bg-gradient-to-r from-cyan-400 to-transparent mx-auto rounded-full"
              />
              <p className="mx-auto mt-8 max-w-2xl text-lg font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed italic">"A curated glimpse of our most profound high-resolution professional collections."</p>
            </motion.div>
            
            {/* Infinite Marquee Container */}
            <div className="relative w-full overflow-hidden mt-12 py-10">
                {/* Edge Masks for seamless fading */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-zinc-950 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-zinc-950 to-transparent z-10 pointer-events-none" />

                <motion.div 
                    className="flex gap-8 cursor-grab active:cursor-grabbing"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ 
                        duration: 40, 
                        repeat: Infinity, 
                        ease: "linear",
                        repeatType: "loop"
                    }}
                    style={{ width: "fit-content" }}
                    whileHover={{ transition: { duration: 80 } }} // Slow down on hover
                >
                    {/* Double the photos for seamless loop */}
                    {[...featuredPhotos, ...featuredPhotos].map((photo, idx) => (
                        <motion.div 
                          key={`${photo.id}-${idx}`} 
                          className="relative flex-shrink-0 w-[400px] aspect-[16/10] overflow-hidden rounded-[2rem] shadow-2xl bg-zinc-900 border border-white/5 group"
                        >
                            <PhotoCard photo={photo} onClick={() => setSelectedPhoto(photo)} />
                            
                            {/* Cinematic Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 pointer-events-none">
                               <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Master Series</p>
                               <h4 className="text-white font-black text-xl leading-tight">{photo.categories?.[0] || "Curated Discovery"}</h4>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
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
                  ].map((col, idx) => (
                      <motion.div 
                        key={col.name} 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.1 }}
                        className="group relative h-[450px] overflow-hidden rounded-[2.5rem] cursor-pointer bg-zinc-900"
                      >
                          <img src={col.image} alt={col.name} className="absolute inset-0 h-full w-full object-cover transition-all duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-80" />
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                          
                          <div className="absolute top-8 right-8">
                             <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-black text-white uppercase tracking-widest">{col.count} Photos</div>
                          </div>

                          <div className="absolute bottom-10 left-10 right-10 text-left">
                              <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em] mb-3">Series {idx + 1}</p>
                              <h3 className="text-3xl font-black text-white leading-tight lg:pr-10">{col.name}</h3>
                              <motion.div 
                                className="w-12 h-1 bg-white mt-6 rounded-full"
                                initial={{ width: 0 }}
                                whileHover={{ width: 48 }}
                              />
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
