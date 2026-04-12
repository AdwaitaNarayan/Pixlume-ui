"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getPhotos, searchPhotos, getCategories, Photo } from "../../services/api";
import PhotoCard from "../../components/PhotoCard";
import PhotoLightbox from "../../components/PhotoLightbox";
import Footer from "../../components/Footer";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, Leaf, Building2, Palette, Camera } from "lucide-react";

// ─── Category filter chips ──────────────────────────────────────────────────
const PRESET_CATEGORIES = [
  { label: "All", value: "", icon: Sparkles },
  { label: "Trending", value: "trending", icon: TrendingUp },
  { label: "Nature", value: "nature", icon: Leaf },
  { label: "Urban", value: "urban", icon: Building2 },
  { label: "Abstract", value: "abstract", icon: Palette },
  { label: "Minimal", value: "minimal", icon: Camera },
];

// ─── Masonry grid using CSS columns ────────────────────────────────────────
function MasonryGrid({
  photos,
  onPhotoClick,
}: {
  photos: Photo[];
  onPhotoClick: (p: Photo) => void;
}) {
  return (
    <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3 sm:gap-4">
      {photos.map((photo, idx) => (
        <div key={photo.id} className="mb-3 sm:mb-4 break-inside-avoid">
          <PhotoCard
            photo={photo}
            onClick={onPhotoClick}
            enterClass={`card-enter-${(idx % 8) + 1}`}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Skeleton placeholder cards ─────────────────────────────────────────────
function SkeletonGrid({ count = 20 }: { count?: number }) {
  const heights = [280, 340, 220, 380, 260, 310, 290, 360, 240, 320,
                   350, 270, 400, 230, 300, 370, 250, 330, 280, 310];
  return (
    <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="mb-3 sm:mb-4 break-inside-avoid">
          <div
            className="w-full rounded-2xl animate-pulse bg-zinc-200 dark:bg-zinc-800"
            style={{ height: heights[i % heights.length] }}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function Home() {
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([]);
  const observerRef = useRef<HTMLDivElement>(null);

  const PAGE_SIZE = 20;

  const fetchPhotos = useCallback(
    async (cat: string, pageNum: number, isLoadMore = false) => {
      try {
        if (isLoadMore) setLoadingMore(true);
        else setLoading(true);

        const data =
          cat && cat !== "trending"
            ? await searchPhotos("", pageNum, PAGE_SIZE, { category: cat })
            : await getPhotos(pageNum, PAGE_SIZE);

        const results = data.results ?? [];
        if (isLoadMore) {
          setPhotos((prev) => [...prev, ...results]);
        } else {
          setPhotos(results);
        }
        setHasMore(results.length === PAGE_SIZE);
        setPage(pageNum);
      } catch (err) {
        console.error("Failed to fetch photos:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  // Initial load + category load categories
  useEffect(() => {
    fetchPhotos(selectedCategory, 1, false);
    getCategories()
      .then(setDynamicCategories)
      .catch(() => {});
  }, [selectedCategory]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          fetchPhotos(selectedCategory, page + 1, true);
        }
      },
      { rootMargin: "500px" }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, page, selectedCategory, fetchPhotos]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
    setPhotos([]);
    setHasMore(true);
  };

  // Build the final category list — combine presets with dynamic ones from API
  const allCategories = [
    ...PRESET_CATEGORIES,
    ...dynamicCategories
      .filter(
        (c) =>
          !PRESET_CATEGORIES.some(
            (p) => p.value.toLowerCase() === c.toLowerCase()
          )
      )
      .slice(0, 6)
      .map((c) => ({ label: c.charAt(0).toUpperCase() + c.slice(1), value: c, icon: Palette })),
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0f0f0f] font-sans">
      {/* ── CATEGORY FILTER CHIPS ── */}
      <div className="sticky top-16 z-40 bg-[#fafafa]/90 dark:bg-[#0f0f0f]/90 backdrop-blur-md border-b border-zinc-100 dark:border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
            {allCategories.map(({ label, value, icon: Icon }) => {
              const active = selectedCategory === value;
              return (
                <button
                  key={value}
                  onClick={() => handleCategoryChange(value)}
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
          </div>
        </div>
      </div>

      {/* ── MAIN MASONRY GRID ── */}
      <main className="max-w-[1600px] mx-auto px-3 sm:px-6 py-6">
        {loading ? (
          <SkeletonGrid count={20} />
        ) : photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <Camera className="w-7 h-7 text-zinc-400" />
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg">No images found</p>
            <button
              onClick={() => handleCategoryChange("")}
              className="text-sm font-semibold text-zinc-900 dark:text-white underline underline-offset-4"
            >
              Clear filter
            </button>
          </div>
        ) : (
          <>
            <MasonryGrid photos={photos} onPhotoClick={setSelectedPhoto} />

            {/* Infinite scroll trigger */}
            <div ref={observerRef} className="h-20 flex items-center justify-center mt-4">
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
      </main>

      {/* ── FOOTER ── */}
      <Footer />

      {/* ── LIGHTBOX ── */}
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
