"use client";

import { useEffect, useState } from "react";
import { getPhotos, searchPhotos, Photo } from "../services/api";
import PhotoCard from "./PhotoCard";

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTag, setSearchTag] = useState("");

  const loadPhotos = async (tagQuery?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = tagQuery
        ? await searchPhotos(tagQuery, 1, 50)
        : await getPhotos(1, 50);
      setPhotos(data.results);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load photos. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    loadPhotos();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTag.trim()) {
      loadPhotos(searchTag.trim());
    } else {
      loadPhotos();
    }
  };

  const clearSearch = () => {
    setSearchTag("");
    loadPhotos();
  };

  const handlePhotoClick = (photo: Photo) => {
    // Open a modal or full-screen view (coming later)
    window.open(photo.image_2k_url || photo.image_1080_url || photo.thumbnail_url || "#", "_blank");
  };

  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-12 md:px-12">
      {/* Search Bar Section */}
      <div className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row">
        <h2 className="text-3xl font-light tracking-tight text-zinc-900 dark:text-zinc-100 lg:text-4xl">
          Curated <span className="font-semibold text-cyan-600 dark:text-cyan-400">Collection</span>
        </h2>

        <form onSubmit={handleSearch} className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search by tag (e.g., landscape, city)..."
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            className="w-full rounded-full border border-zinc-200 bg-white/50 px-6 py-3 pl-12 shadow-sm backdrop-blur-md outline-none transition-all focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:border-cyan-400 dark:focus:bg-zinc-900 sm:text-sm"
          />
          <svg
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchTag && (
            <button
              onClick={clearSearch}
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              ✕
            </button>
          )}
        </form>
      </div>

      {/* Grid Section */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[4/5] animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          ))}
        </div>
      ) : error ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-900/10 h-full w-full">
          <svg className="mb-4 h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-lg font-medium">{error}</p>
        </div>
      ) : photos.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl bg-zinc-50 dark:bg-zinc-900/50">
          <p className="text-xl text-zinc-500">No photos found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-8">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} onClick={handlePhotoClick} />
          ))}
        </div>
      )}
    </section>
  );
}
