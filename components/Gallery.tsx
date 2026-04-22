import { useEffect, useState, useRef } from "react";
import { X, Search, Filter } from "lucide-react";
import { getPhotos, searchPhotos, Photo } from "../services/api";
import PhotoCard from "./PhotoCard";
import PhotoLightbox from "./PhotoLightbox";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryProps {
  initialSearch?: string;
}

export default function Gallery({ initialSearch = "" }: GalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTag, setSearchTag] = useState(initialSearch);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  // Autocomplete state
  const [suggestions, setSuggestions] = useState<Photo[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Filters state
  const [resolution, setResolution] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [category, setCategory] = useState("");
  const [deviceType, setDeviceType] = useState("");
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
    device: string = deviceType,
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

      const data = query || res || date || cat || device
        ? await searchPhotos(query, pageToLoad, 20, { resolution: res, date, category: cat, device_type: device })
        : await getPhotos(pageToLoad, 20);

      if (isFetchMore) {
        setPhotos(prev => [...prev, ...data.results]);
      } else {
        setPhotos(data.results);
      }
      setSuggestion(data.suggestion || null);

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
    loadPhotos(initialSearch);
    import("../services/api").then(api => {
        api.getCategories().then(setAvailableCategories).catch(console.error);
    });

    const handleHeroSearch = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail !== undefined) {
        setSearchTag(customEvent.detail);
        loadPhotos(customEvent.detail, resolution, dateRange, category, deviceType, 1, false);
      }
    };
    window.addEventListener("hero-search", handleHeroSearch);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading && !loadingMore) {
          loadPhotos(searchTag, resolution, dateRange, category, deviceType, page + 1, true);
        }
      },
      { rootMargin: "400px" }
    );

    if (loadingObserverRef.current) observer.observe(loadingObserverRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, page, searchTag, resolution, dateRange, category, deviceType]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    loadPhotos(searchTag, resolution, dateRange, category, deviceType, 1, false);
  };

  const handleFilterChange = (type: string, value: string) => {
    if (type === "resolution") { setResolution(value); loadPhotos(searchTag, value, dateRange, category, deviceType, 1, false); }
    if (type === "date") { setDateRange(value); loadPhotos(searchTag, resolution, value, category, deviceType, 1, false); }
    if (type === "category") { setCategory(value); loadPhotos(searchTag, resolution, dateRange, value, deviceType, 1, false); }
    if (type === "device") { setDeviceType(value); loadPhotos(searchTag, resolution, dateRange, category, value, 1, false); }
  };

  const clearSearch = () => {
    setSearchTag("");
    setResolution("");
    setDateRange("");
    setCategory("");
    setDeviceType("");
    setSuggestion(null);
    loadPhotos("", "", "", "", "", 1, false);
  };

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 md:px-8">
      {/* Unified Browsing Toolbar */}
      <div className="mb-12 border-b border-zinc-100 dark:border-zinc-900 pb-12" ref={searchContainerRef}>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <form onSubmit={handleSearch} className="relative w-full group">
              <input
                type="text"
                placeholder="Search premium gallery..."
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-transparent focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 rounded-2xl px-5 py-3.5 pl-12 text-sm outline-none transition-all dark:text-white"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-cyan-500 transition-colors" />
              {searchTag && (
                <button
                  onClick={clearSearch}
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* Autocomplete Dropdown */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 right-0 top-full z-50 mt-3 overflow-hidden rounded-2xl border border-zinc-100 bg-white/90 py-2 shadow-2xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/90"
                  >
                    <div className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                      Discovery
                    </div>
                    {suggestions.map((photo) => (
                      <div
                        key={photo.id}
                        onClick={() => {
                          const tag = photo.categories && photo.categories.length > 0 ? photo.categories[0] : "";
                          setSearchTag(tag);
                          setShowSuggestions(false);
                          loadPhotos(tag, resolution, dateRange, category, deviceType, 1, false);
                        }}
                        className="flex cursor-pointer items-center gap-4 px-5 py-3 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-colors group"
                      >
                        {photo.thumbnail_url ? (
                          <div
                            className="h-10 w-10 shrink-0 rounded-lg bg-cover bg-center border border-zinc-100 dark:border-zinc-800"
                            style={{ backgroundImage: `url(${photo.thumbnail_url})` }}
                          />
                        ) : (
                          <div className="h-10 w-10 shrink-0 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
                        )}
                        <div className="flex-1 truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                          {photo.categories?.join(", ") || 'Studio Capture'}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Filters Row - Horizontal Scroll on Mobile */}
          <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 scrollbar-hide">
            <div className="flex items-center gap-2 pr-4 lg:pr-0 border-r lg:border-none border-zinc-100 dark:border-zinc-800 shrink-0">
               <Filter className="h-4 w-4 text-zinc-400" />
               <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Filters</span>
            </div>
            
            <div className="flex items-center gap-3">
              {[
                { type: "category", value: category, options: [{label: "All Categories", val: ""}, ...availableCategories.map(c => ({label: c, val: c}))] },
                { type: "resolution", value: resolution, options: [
                  {label: "Resolution", val: ""},
                  {label: "4K Ultra HD", val: "4k"},
                  {label: "2K Quad HD", val: "2k"},
                  {label: "1080p Full HD", val: "1080p"}
                ]},
                { type: "date", value: dateRange, options: [
                  {label: "Time Period", val: ""},
                  {label: "Today", val: "today"},
                  {label: "This Week", val: "week"},
                  {label: "This Month", val: "month"}
                ]},
                { type: "device", value: deviceType, options: [
                  {label: "Device", val: ""},
                  {label: "PC / Laptop", val: "desktop"},
                  {label: "Phone", val: "mobile"}
                ]}
              ].map((filter) => (
                <select
                  key={filter.type}
                  value={filter.value}
                  onChange={(e) => handleFilterChange(filter.type, e.target.value)}
                  className={`shrink-0 px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-transparent rounded-xl text-xs font-bold outline-none cursor-pointer transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:ring-2 focus:ring-cyan-500/20 ${filter.value ? "text-cyan-600 dark:text-cyan-400 border-cyan-500/20 bg-cyan-50 dark:bg-cyan-500/5" : "text-zinc-500 dark:text-zinc-400"}`}
                >
                  {filter.options.map(opt => (
                    <option key={opt.val} value={opt.val}>{opt.label}</option>
                  ))}
                </select>
              ))}

              {(searchTag || resolution || category || dateRange || deviceType) && (
                <button
                  onClick={clearSearch}
                  className="shrink-0 px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-400 hover:text-cyan-500 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Masonry Loading Section */}
      {loading && !loadingMore ? (
        <div className="columns-1 gap-2 sm:columns-2 lg:columns-3 xl:columns-4 [column-fill:_balance]">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="mb-2 break-inside-avoid">
              <div
                className="skeleton-shimmer w-full rounded-2xl"
                style={{ height: i % 3 === 0 ? '450px' : i % 2 === 0 ? '320px' : '400px' }}
              />
            </div>
          ))}
        </div>
      ) : error && photos.length === 0 ? (
        <div className="flex h-64 w-full flex-col items-center justify-center rounded-3xl bg-red-50 text-red-500 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
          <svg className="mb-4 h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm font-bold uppercase tracking-widest">{error}</p>
        </div>
      ) : photos.length === 0 ? (
        <div className="flex h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
          <Search className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-700" />
          <p className="text-xl font-bold text-zinc-400 dark:text-zinc-600">No results found</p>
          {suggestion && (
            <div className="mt-4 flex items-center gap-2 text-sm text-zinc-500">
              <span>Did you mean</span>
              <button
                onClick={() => {
                  setSearchTag(suggestion);
                  loadPhotos(suggestion, resolution, dateRange, category, deviceType, 1, false);
                }}
                className="font-black text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 transition-colors underline decoration-cyan-500/30 underline-offset-4"
              >
                {suggestion}
              </button>
              <span>?</span>
            </div>
          )}
          <button
            onClick={clearSearch}
            className="mt-8 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="columns-1 gap-2 sm:columns-2 lg:columns-3 xl:columns-4">
            {photos.map((photo, idx) => (
              <div key={photo.id} className="mb-2 break-inside-avoid">
                <PhotoCard
                  photo={photo}
                  onClick={handlePhotoClick}
                  enterClass={`card-enter card-enter-${Math.min((idx % 8) + 1, 8)}`}
                />
              </div>
            ))}
          </div>

          {/* Infinite Scroll trigger */}
          {hasMore && (
            <div ref={loadingObserverRef} className="flex h-48 w-full items-center justify-center">
              <AnimatePresence mode="wait">
                {loadingMore && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative flex items-center justify-center p-8"
                  >
                    <div className="absolute h-14 w-14 rounded-full border-2 border-cyan-500/5 dark:border-cyan-500/10" />
                    <div className="absolute h-14 w-14 rounded-full border-t-2 border-cyan-500 animate-spin" style={{ animationDuration: '0.8s' }} />
                    <div className="h-8 w-8 rounded-full border-b-2 border-indigo-500 animate-spin" style={{ animationDuration: '0.6s', animationDirection: 'reverse' }} />
                  </motion.div>
                )}
              </AnimatePresence>
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
