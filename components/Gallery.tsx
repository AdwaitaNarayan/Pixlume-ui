"use client";

import { useEffect, useState, useRef } from "react";
import { getPhotos, searchPhotos, Photo } from "../services/api";
import PhotoCard from "./PhotoCard";
import PhotoLightbox from "./PhotoLightbox";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryProps {
  initialSearch?: string;
}

export default function Gallery({ initialSearch = "" }: GalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTag, setSearchTag] = useState(initialSearch);

  // Autocomplete state
  const [suggestions, setSuggestions] = useState<Photo[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Filters state
  const [resolution, setResolution] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [category, setCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadingObserverRef = useRef<HTMLDivElement>(null);

  // Lightbox state
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const loadPhotos = async (
    query: string = searchTag,
    res: string = resolution,
    date: string = dateRange,
    cat: string = category,
    pageToLoad: number = 1,
    isFetchMore: boolean = false
  ) => {
    try {
      if (isFetchMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const data = query || res || date || cat
        ? await searchPhotos(query, pageToLoad, 20, { resolution: res, date, category: cat })
        : await getPhotos(pageToLoad, 20);

      if (isFetchMore) {
        setPhotos(prev => [...prev, ...data.results]);
      } else {
        setPhotos(data.results);
      }

      setHasMore(data.results.length === 20);
      setPage(pageToLoad);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load photos. Please check if the backend is running.");
    } finally {
      if (isFetchMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // Initial load
    loadPhotos(initialSearch);
    
    import("../services/api").then(api => {
        api.getCategories().then(setAvailableCategories).catch(console.error);
    });

    // Listen for hero search
    const handleHeroSearch = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail !== undefined) {
        setSearchTag(customEvent.detail);
        loadPhotos(customEvent.detail, resolution, dateRange, category, 1, false);
      }
    };
    window.addEventListener("hero-search", handleHeroSearch);

    // Click outside to close suggestions
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("hero-search", handleHeroSearch);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounced autocomplete suggestions
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTag.trim().length >= 2) {
        try {
          const data = await searchPhotos(searchTag.trim(), 1, 5);
          setSuggestions(data.results);
          setShowSuggestions(true);
        } catch {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTag]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading && !loadingMore) {
          loadPhotos(searchTag, resolution, dateRange, category, page + 1, true);
        }
      },
      { rootMargin: "400px" } // Load a bit earlier before user reaches the very bottom
    );

    if (loadingObserverRef.current) observer.observe(loadingObserverRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, page, searchTag, resolution, dateRange, category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    loadPhotos(searchTag, resolution, dateRange, category, 1, false);
  };

  const handleFilterChange = (type: string, value: string) => {
    if (type === "resolution") { setResolution(value); loadPhotos(searchTag, value, dateRange, category, 1, false); }
    if (type === "date") { setDateRange(value); loadPhotos(searchTag, resolution, value, category, 1, false); }
    if (type === "category") { setCategory(value); loadPhotos(searchTag, resolution, dateRange, value, 1, false); }
  };

  const clearSearch = () => {
    setSearchTag("");
    setResolution("");
    setDateRange("");
    setCategory("");
    loadPhotos("", "", "", "", 1, false);
  };

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  return (
    <section className="mx-auto w-full max-w-[1600px] px-6 py-6 lg:px-12">
      {/* Search & Filter Section */}
      <div className="mb-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-8 border-b border-zinc-100 dark:border-white/5">
          <div className="flex-1 w-full max-w-2xl" ref={searchContainerRef}>
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors" />
              <input
                type="text"
                placeholder="Search by keyword..."
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                className="w-full bg-transparent border-none py-4 pl-8 pr-12 text-xl font-light text-zinc-900 dark:text-white placeholder-zinc-300 dark:placeholder-zinc-700 outline-none"
              />
              {searchTag && (
                <button
                  onClick={clearSearch}
                  type="button"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Autocomplete Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-4 overflow-hidden rounded-2xl border border-zinc-100 bg-white/90 py-2 shadow-2xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/90">
                  {suggestions.map((photo) => (
                    <div
                      key={photo.id}
                      onClick={() => {
                        const tag = photo.categories && photo.categories.length > 0 ? photo.categories[0] : "";
                        setSearchTag(tag);
                        setShowSuggestions(false);
                        loadPhotos(tag, resolution, dateRange, category, 1, false);
                      }}
                      className="flex cursor-pointer items-center gap-4 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <div className="h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                        <img src={photo.thumbnail_url || undefined} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex-1 truncate text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {photo.caption || photo.categories?.join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>

          <div className="flex items-center gap-6">
             <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {showFilters ? "Hide Filters" : "Filters"}
            </button>
            <div className="h-4 w-[1px] bg-zinc-200 dark:bg-white/10" />
            <button 
              onClick={clearSearch}
              className="text-sm font-semibold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-8 border-b border-zinc-100 dark:border-white/5">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Resolution</label>
                  <select
                    value={resolution}
                    onChange={(e) => handleFilterChange("resolution", e.target.value)}
                    className="w-full bg-transparent border-none text-sm font-medium text-zinc-900 dark:text-white outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Any Quality</option>
                    <option value="4k">4K Ultra HD</option>
                    <option value="2k">2K Quad HD</option>
                    <option value="1080p">1080p Full HD</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Timeframe</label>
                  <select
                    value={dateRange}
                    onChange={(e) => handleFilterChange("date", e.target.value)}
                    className="w-full bg-transparent border-none text-sm font-medium text-zinc-900 dark:text-white outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Any Time</option>
                    <option value="today">Past 24 Hours</option>
                    <option value="week">Past Week</option>
                    <option value="month">Past Month</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Category</label>
                  <select
                    value={category}
                    onChange={(e) => handleFilterChange("category", e.target.value)}
                    className="w-full bg-transparent border-none text-sm font-medium text-zinc-900 dark:text-white outline-none appearance-none cursor-pointer"
                  >
                    <option value="">All Collections</option>
                    {availableCategories.map(cat => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {loading && !loadingMore ? (
        <div className="columns-1 gap-8 sm:columns-2 lg:columns-3 xl:columns-4 [column-fill:_balance]">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="mb-8 break-inside-avoid">
              <div className="skeleton-shimmer w-full rounded-2xl bg-zinc-100 dark:bg-zinc-900" style={{ height: i % 3 === 0 ? '450px' : i % 2 === 0 ? '320px' : '400px' }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="columns-1 gap-8 sm:columns-2 lg:columns-3 xl:columns-4">
            {photos.map((photo, idx) => (
              <div key={photo.id} className="mb-8 break-inside-avoid">
                <PhotoCard
                  photo={photo}
                  onClick={handlePhotoClick}
                  enterClass="card-enter"
                />
              </div>
            ))}
          </div>

          {hasMore && (
            <div ref={loadingObserverRef} className="flex h-32 w-full items-center justify-center py-12">
              {loadingMore && (
                <div className="h-6 w-6 border-2 border-zinc-200 border-t-zinc-900 animate-spin rounded-full dark:border-zinc-800 dark:border-t-white" />
              )}
            </div>
          )}
        </div>
      )}


      {/* ── Photo Lightbox Modal ── */}
      {selectedPhoto && (
        <PhotoLightbox
          photo={selectedPhoto}
          allPhotos={photos}
          onClose={() => setSelectedPhoto(null)}
          onNavigate={(p) => setSelectedPhoto(p)}
        />
      )}
    </section>
  );
}
