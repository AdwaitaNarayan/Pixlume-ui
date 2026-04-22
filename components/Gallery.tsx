"use client";

import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import { getPhotos, searchPhotos, Photo } from "../services/api";
import PhotoCard from "./PhotoCard";
import PhotoLightbox from "./PhotoLightbox";

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
    <section className="mx-auto w-full max-w-[1600px] px-4 md:px-8">
      {/* Unified Browsing Toolbar */}
      <div className="mb-12 border-b border-zinc-100 dark:border-zinc-900 pb-12" ref={searchContainerRef}>
        <div className="flex flex-col lg:flex-row items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1 w-full lg:w-auto">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search gallery..."
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-transparent focus:border-zinc-200 dark:focus:border-zinc-800 rounded-lg px-4 py-3 pl-11 text-sm outline-none transition-all dark:text-white"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchTag && (
                <button
                  onClick={clearSearch}
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="h-3 w-3" />
                </button>
              )}

              {/* Autocomplete Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-zinc-100 bg-white py-2 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Suggestions
                  </div>
                  {suggestions.map((photo) => (
                    <div
                      key={photo.id}
                      onClick={() => {
                        const tag = photo.categories && photo.categories.length > 0 ? photo.categories[0] : "";
                        setSearchTag(tag);
                        setShowSuggestions(false);
                        loadPhotos(tag, resolution, dateRange, category, 1, false);
                      }}
                      className="flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    >
                      {photo.thumbnail_url ? (
                        <div
                          className="h-8 w-8 shrink-0 rounded bg-cover bg-center"
                          style={{ backgroundImage: `url(${photo.thumbnail_url})` }}
                        />
                      ) : (
                        <div className="h-8 w-8 shrink-0 rounded bg-zinc-100 dark:bg-zinc-800" />
                      )}
                      <div className="flex-1 truncate text-xs font-medium text-zinc-900 dark:text-zinc-100">
                        {photo.categories?.join(", ") || 'Photo'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <select
              value={category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-transparent rounded-lg text-xs font-medium outline-none cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors dark:text-zinc-300"
            >
              <option value="">All Categories</option>
              {availableCategories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>

            <select
              value={resolution}
              onChange={(e) => handleFilterChange("resolution", e.target.value)}
              className="px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-transparent rounded-lg text-xs font-medium outline-none cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors dark:text-zinc-300"
            >
              <option value="">Resolution</option>
              <option value="4k">4K Ultra HD</option>
              <option value="2k">2K Quad HD</option>
              <option value="1080p">1080p Full HD</option>
            </select>

            <select
              value={dateRange}
              onChange={(e) => handleFilterChange("date", e.target.value)}
              className="px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-transparent rounded-lg text-xs font-medium outline-none cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors dark:text-zinc-300 sm:block hidden"
            >
              <option value="">Time Period</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>

            {(searchTag || resolution || category || dateRange) && (
              <button
                onClick={clearSearch}
                className="px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                Reset
              </button>
            )}
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
        <div className="flex h-64 w-full flex-col items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-900/10">
          <svg className="mb-4 h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-lg font-medium">{error}</p>
        </div>
      ) : photos.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl bg-zinc-50 dark:bg-zinc-900/50">
          <svg className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-xl text-zinc-500">No photos found matching your search.</p>
          {suggestion && (
            <div className="mt-2 text-sm text-zinc-400">
              Did you mean{" "}
              <button
                onClick={() => {
                  setSearchTag(suggestion);
                  loadPhotos(suggestion, resolution, dateRange, category, 1, false);
                }}
                className="font-semibold text-cyan-600 hover:underline dark:text-cyan-400"
              >
                {suggestion}
              </button>
              ?
            </div>
          )}
          <button
            onClick={clearSearch}
            className="mt-4 text-sm font-semibold text-cyan-600 hover:text-cyan-500 dark:text-cyan-400"
          >
            Clear filters
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
            <div ref={loadingObserverRef} className="flex h-24 w-full items-center justify-center py-12">
              {loadingMore && (
                <div className="relative flex items-center justify-center">
                  {/* Outer slower ring */}
                  <div className="absolute h-12 w-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" style={{ animationDuration: '1.2s' }} />
                  {/* Inner faster ring */}
                  <div className="h-7 w-7 rounded-full border-2 border-transparent border-b-cyan-400 animate-spin" style={{ animationDuration: '0.7s' }} />
                </div>
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
