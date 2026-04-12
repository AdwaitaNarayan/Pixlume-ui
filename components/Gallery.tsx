"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getPhotos, searchPhotos, getCategories, Photo } from "../services/api";
import PhotoCard from "./PhotoCard";
import PhotoLightbox from "./PhotoLightbox";
import { Search, X, SlidersHorizontal, Leaf, Building2, Palette, Camera, Sparkles, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryProps {
  initialSearch?: string;
}

const PRESET_CHIPS = [
  { label: "All", value: "", icon: Sparkles },
  { label: "Trending", value: "trending", icon: TrendingUp },
  { label: "Nature", value: "nature", icon: Leaf },
  { label: "Urban", value: "urban", icon: Building2 },
  { label: "Abstract", value: "abstract", icon: Palette },
  { label: "Minimal", value: "minimal", icon: Camera },
];

function SkeletonGrid({ count = 16 }: { count?: number }) {
  const heights = [280, 360, 220, 410, 300, 340, 260, 390, 240, 320, 370, 270, 430, 250, 310, 350];
  return (
    <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="mb-3 sm:mb-4 break-inside-avoid">
          <div
            className="w-full rounded-2xl animate-pulse"
            style={{
              height: heights[i % heights.length],
              background: "linear-gradient(110deg, #e4e4e7 30%, #f1f1f4 50%, #e4e4e7 70%)",
              backgroundSize: "200% 100%",
              animation: `shimmer 1.5s infinite ${i * 0.05}s`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default function Gallery({ initialSearch = "" }: GalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Search
  const [searchTag, setSearchTag] = useState(initialSearch);
  const [inputValue, setInputValue] = useState(initialSearch);
  const [suggestions, setSuggestions] = useState<Photo[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filters
  const [activeCategory, setActiveCategory] = useState("");
  const [resolution, setResolution] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  // Infinite scroll
  const observerRef = useRef<HTMLDivElement>(null);

  // Lightbox
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const PAGE_SIZE = 20;

  // ─── Core fetch ───────────────────────────────────────────────────────────
  const loadPhotos = useCallback(
    async (
      query: string,
      cat: string,
      res: string,
      date: string,
      pageNum: number,
      append = false
    ) => {
      try {
        append ? setLoadingMore(true) : setLoading(true);
        setError(null);

        const hasQuery = query || cat || res || date;
        const data = hasQuery
          ? await searchPhotos(query, pageNum, PAGE_SIZE, { category: cat, resolution: res, date })
          : await getPhotos(pageNum, PAGE_SIZE);

        const results = data.results ?? [];
        setPhotos((prev) => (append ? [...prev, ...results] : results));
        setHasMore(results.length === PAGE_SIZE);
        setPage(pageNum);
      } catch (err) {
        console.error(err);
        setError("Failed to load photos. Is the backend running?");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  // ─── Initial load & category load ────────────────────────────────────────
  useEffect(() => {
    loadPhotos(searchTag, activeCategory, resolution, dateRange, 1, false);
    getCategories().then(setAvailableCategories).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Infinite scroll ──────────────────────────────────────────────────────
  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading && !loadingMore) {
          loadPhotos(searchTag, activeCategory, resolution, dateRange, page + 1, true);
        }
      },
      { rootMargin: "500px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, page, searchTag, activeCategory, resolution, dateRange, loadPhotos]);

  // ─── Debounced autocomplete ────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (inputValue.trim().length >= 2) {
        try {
          const data = await searchPhotos(inputValue.trim(), 1, 5);
          setSuggestions(data.results ?? []);
          setShowSuggestions(true);
        } catch {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 280);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Click outside to close suggestions
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const applySearch = (query: string) => {
    setSearchTag(query);
    setShowSuggestions(false);
    setPage(1);
    setPhotos([]);
    loadPhotos(query, activeCategory, resolution, dateRange, 1, false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applySearch(inputValue);
  };

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setPage(1);
    setPhotos([]);
    loadPhotos(searchTag, cat, resolution, dateRange, 1, false);
  };

  const handleResolutionChange = (val: string) => {
    setResolution(val);
    setPage(1);
    setPhotos([]);
    loadPhotos(searchTag, activeCategory, val, dateRange, 1, false);
  };

  const handleDateChange = (val: string) => {
    setDateRange(val);
    setPage(1);
    setPhotos([]);
    loadPhotos(searchTag, activeCategory, resolution, val, 1, false);
  };

  const clearAll = () => {
    setInputValue("");
    setSearchTag("");
    setActiveCategory("");
    setResolution("");
    setDateRange("");
    setPage(1);
    setPhotos([]);
    loadPhotos("", "", "", "", 1, false);
  };

  // Build category chips (preset + dynamic extras)
  const allChips = [
    ...PRESET_CHIPS,
    ...availableCategories
      .filter((c) => !PRESET_CHIPS.some((p) => p.value.toLowerCase() === c.toLowerCase()))
      .slice(0, 8)
      .map((c) => ({ label: c.charAt(0).toUpperCase() + c.slice(1), value: c, icon: Palette })),
  ];

  const hasActiveFilters = searchTag || activeCategory || resolution || dateRange;

  return (
    <div className="w-full">
      {/* ── CATEGORY CHIPS ────────────────────────────────────────────────── */}
      <div className="sticky top-16 z-40 bg-[#fafafa]/90 dark:bg-[#0f0f0f]/90 backdrop-blur-md border-b border-zinc-100 dark:border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
            {allChips.map(({ label, value, icon: Icon }) => {
              const active = activeCategory === value;
              return (
                <button
                  key={value}
                  onClick={() => handleCategoryClick(value)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                    active
                      ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm"
                      : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              );
            })}

            {/* Divider */}
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700 mx-1 shrink-0" />

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
                showFilters || resolution || dateRange
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                  : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters {(resolution || dateRange) && "•"}
            </button>

            {/* Clear all */}
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1 px-3 py-2 rounded-full text-sm font-semibold whitespace-nowrap text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── FILTER PANEL ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-zinc-100 dark:border-white/5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md"
          >
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 flex flex-wrap gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Resolution</label>
                <select
                  value={resolution}
                  onChange={(e) => handleResolutionChange(e.target.value)}
                  className="text-sm font-medium text-zinc-800 dark:text-white bg-transparent border-none outline-none cursor-pointer"
                >
                  <option value="">Any</option>
                  <option value="4k">4K Ultra HD</option>
                  <option value="2k">2K QHD</option>
                  <option value="1080p">1080p HD</option>
                  <option value="720p">720p</option>
                </select>
              </div>
              <div className="w-px bg-zinc-100 dark:bg-zinc-800" />
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Uploaded</label>
                <select
                  value={dateRange}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="text-sm font-medium text-zinc-800 dark:text-white bg-transparent border-none outline-none cursor-pointer"
                >
                  <option value="">Any time</option>
                  <option value="today">Today</option>
                  <option value="week">This week</option>
                  <option value="month">This month</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SEARCH BAR (inline, above grid) ──────────────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-5 pb-2" ref={searchRef}>
        <form onSubmit={handleSearchSubmit} className="relative max-w-lg">
          <div className="flex items-center gap-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-zinc-900/10 dark:focus-within:ring-white/10 transition-all">
            <Search className="w-4 h-4 text-zinc-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
              placeholder="Search high-quality images..."
              className="flex-1 text-sm font-medium bg-transparent text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 outline-none"
            />
            {inputValue && (
              <button type="button" onClick={() => { setInputValue(""); applySearch(""); }}>
                <X className="w-4 h-4 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200" />
              </button>
            )}
          </div>

          {/* Autocomplete dropdown */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
                className="absolute left-0 right-0 top-full mt-2 z-50 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden"
              >
                {suggestions.map((photo) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => {
                      const tag = photo.categories?.[0] ?? photo.caption ?? "";
                      setInputValue(tag);
                      applySearch(tag);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left"
                  >
                    <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
                      {photo.thumbnail_url && (
                        <img src={photo.thumbnail_url} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                      {photo.caption || photo.categories?.join(", ") || "Untitled"}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* ── MASONRY GRID ─────────────────────────────────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 py-4">
        {loading && !loadingMore ? (
          <SkeletonGrid count={20} />
        ) : error && photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <X className="w-6 h-6 text-red-400" />
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 font-medium">{error}</p>
            <button onClick={clearAll} className="text-sm font-semibold underline underline-offset-4 text-zinc-900 dark:text-white">
              Try again
            </button>
          </div>
        ) : photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <div className="w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <Camera className="w-6 h-6 text-zinc-400" />
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">No images found</p>
            {hasActiveFilters && (
              <button onClick={clearAll} className="text-sm font-semibold underline underline-offset-4 text-zinc-900 dark:text-white">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3 sm:gap-4">
              {photos.map((photo, idx) => (
                <div key={photo.id} className="mb-3 sm:mb-4 break-inside-avoid">
                  <PhotoCard
                    photo={photo}
                    onClick={setSelectedPhoto}
                    enterClass={`card-enter-${(idx % 8) + 1}`}
                  />
                </div>
              ))}
            </div>

            {/* Infinite scroll sentinel */}
            <div ref={observerRef} className="flex items-center justify-center h-20 mt-2">
              {loadingMore && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-zinc-200 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full"
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* ── LIGHTBOX ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedPhoto && (
          <PhotoLightbox
            photo={selectedPhoto}
            allPhotos={photos}
            onClose={() => setSelectedPhoto(null)}
            onNavigate={(p) => setSelectedPhoto(p)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
