"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Heart, Download, Monitor, ChevronLeft, ChevronRight, 
  Maximize2, Share2, Info, Tag, Calendar, Layers
} from "lucide-react";
import Image from "next/image";
import { Photo } from "../services/api";

interface PhotoLightboxProps {
  photo: Photo;
  allPhotos?: Photo[];
  onClose: () => void;
  onNavigate?: (photo: Photo) => void;
}

export default function PhotoLightbox({ photo, allPhotos = [], onClose, onNavigate }: PhotoLightboxProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [showWallpaperPreview, setShowWallpaperPreview] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onNavigate) navigate(-1);
      if (e.key === "ArrowRight" && onNavigate) navigate(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [photo, allPhotos]);

  const navigate = (direction: number) => {
    if (!allPhotos.length || !onNavigate) return;
    const currentIndex = allPhotos.findIndex(p => p.id === photo.id);
    if (currentIndex === -1) return;
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = allPhotos.length - 1;
    if (nextIndex >= allPhotos.length) nextIndex = 0;
    onNavigate(allPhotos[nextIndex]);
  };

  const highResUrl = photo.image_4k_url || photo.image_2k_url || photo.image_1080_url || photo.image_720_url || photo.thumbnail_url;

  const handleDownload = (url: string, label: string) => {
    let finalUrl = url;
    if (finalUrl.includes("cloudinary.com")) {
      const parts = finalUrl.split("/upload/");
      if (parts.length === 2) finalUrl = `${parts[0]}/upload/fl_attachment/${parts[1]}`;
    }
    const link = document.createElement("a");
    link.href = finalUrl;
    link.download = `${photo.title || "pixlume"}-${label}.jpg`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-10"
      >
        {/* ── Close Button ── */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-[110] rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:rotate-90 active:scale-90"
        >
          <X className="h-6 w-6" />
        </button>

        {/* ── Navigation Buttons ── */}
        {allPhotos.length > 1 && onNavigate && (
          <>
            <button 
              onClick={() => navigate(-1)}
              className="absolute left-6 top-1/2 z-[110] -translate-y-1/2 rounded-full bg-white/10 p-4 text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-90"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button 
              onClick={() => navigate(1)}
              className="absolute right-6 top-1/2 z-[110] -translate-y-1/2 rounded-full bg-white/10 p-4 text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-90"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </>
        )}

        <div className="relative flex h-full w-full max-w-7xl flex-col gap-6 lg:flex-row">
          
          {/* ── Main View Area ── */}
          <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl">
            
            {/* Background Image (Blurred) */}
            <div className="absolute inset-0 z-0 opacity-30 blur-3xl scale-110">
              <img src={photo.thumbnail_url || ""} className="h-full w-full object-cover" alt="Background" />
            </div>

            <motion.div 
              layoutId={`photo-${photo.id}`}
              className="relative z-10 h-full w-full p-4 flex items-center justify-center"
            >
              {!isImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500/20 border-t-cyan-500" />
                </div>
              )}
              
              <Image
                src={highResUrl || ""}
                alt={photo.title || "Photo"}
                fill
                className={`object-contain transition-all duration-700 ${isImageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                onLoad={() => setIsImageLoaded(true)}
                priority
              />

              {/* ── Wallpaper Preview Overlay ── */}
              <AnimatePresence>
                {showWallpaperPreview && (
                  <motion.div
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 bg-black/40 backdrop-blur-sm pointer-events-none"
                  >
                    {/* Mock Desktop Frame */}
                    <div className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-xl border-[8px] border-zinc-800 bg-zinc-900 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.8)]">
                         {/* Image as wallpaper */}
                         <Image src={highResUrl || ""} fill className="object-cover" alt="Wallpaper Preview" />
                         {/* Desktop Elements */}
                         <div className="absolute bottom-0 left-0 right-0 h-10 bg-zinc-900/60 backdrop-blur-md flex items-center px-4 gap-3">
                            <div className="h-6 w-6 rounded bg-cyan-500/50" />
                            <div className="h-1.5 w-24 rounded-full bg-white/20" />
                            <div className="ml-auto h-4 w-12 rounded-full bg-white/20" />
                         </div>
                    </div>
                    <p className="mt-6 text-sm font-bold tracking-widest text-cyan-400 uppercase">Desktop Wallpaper Mode</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* ── Sidebar Metadata ── */}
          <div className="flex w-full flex-col gap-6 lg:w-96">
            
            {/* Top Action Panel */}
            <div className="rounded-[2rem] bg-zinc-800/50 p-8 backdrop-blur-md border border-white/5 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-cyan-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Photograph</span>
                </div>
                <h2 className="text-2xl font-black text-white">{photo.title}</h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold transition-all active:scale-95 ${
                    isFavorited ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30" : "bg-white/5 text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  <Heart className={`h-4.5 w-4.5 ${isFavorited ? "fill-current" : ""}`} />
                  {isFavorited ? "Favorited" : "Like"}
                </button>
                <button 
                  onClick={() => setShowWallpaperPreview(!showWallpaperPreview)}
                  className={`flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold transition-all active:scale-95 ${
                    showWallpaperPreview ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30" : "bg-white/5 text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  <Monitor className="h-4.5 w-4.5" />
                  Preview
                </button>
              </div>

              <div className="relative">
                <button 
                  onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 py-4 text-sm font-black text-white shadow-xl shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Download className="h-5 w-5" />
                  Download High-Res
                </button>

                {/* Download Menu */}
                <AnimatePresence>
                    {showDownloadMenu && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute bottom-full left-0 right-0 mb-4 overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 p-2 shadow-2xl backdrop-blur-xl"
                        >
                            <div className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Select Resolution</div>
                            <div className="flex flex-col gap-1">
                                {[
                                    { key: 'image_4k_url', label: '4K Ultra HD', size: '3840 × 2160' },
                                    { key: 'image_2k_url', label: '2K QHD', size: '2560 × 1440' },
                                    { key: 'image_1080_url', label: '1080p Full HD', size: '1920 × 1080' },
                                    { key: 'image_720_url', label: '720p HD', size: '1280 × 720' },
                                    { key: 'thumbnail_url', label: 'Thumbnail', size: 'Small' },
                                ].map((opt) => (
                                    (photo as any)[opt.key] && (
                                        <button
                                            key={opt.key}
                                            onClick={() => {
                                                handleDownload((photo as any)[opt.key], opt.label);
                                                setShowDownloadMenu(false);
                                            }}
                                            className="group flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left hover:bg-white/5 transition-colors"
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white group-hover:text-cyan-400">{opt.label}</span>
                                                <span className="text-[10px] text-zinc-500 font-medium tracking-tight">{opt.size}</span>
                                            </div>
                                            <Download className="h-4 w-4 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    )
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
              </div>
            </div>

            {/* Info Panel */}
            <div className="flex-1 rounded-[2rem] bg-zinc-800/20 p-8 backdrop-blur-md border border-white/5 flex flex-col gap-6 overflow-y-auto max-h-96 lg:max-h-none">
                <div className="flex flex-col gap-4">
                    <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        <Tag className="h-3.5 w-3.5" /> Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {photo.tags?.map(tag => (
                            <span key={tag} className="rounded-full bg-white/5 border border-white/5 px-3.5 py-1.5 text-xs font-semibold text-zinc-300">
                                {tag}
                            </span>
                        )) || <span className="text-sm text-zinc-600">No tags listed.</span>}
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        <Info className="h-3.5 w-3.5" /> Details
                    </label>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-500">Resolution</span>
                            <span className="text-xs font-bold text-white bg-cyan-500/20 px-2 py-0.5 rounded text-cyan-400">
                                {photo.image_4k_url ? "4K UHD" : photo.image_2k_url ? "2K QHD" : "HD"}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-500">Downloads</span>
                            <span className="text-xs font-bold text-white">{photo.downloads?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-500">Uploaded</span>
                            <span className="text-sm font-medium text-white flex items-center gap-1.5">
                                <Calendar className="h-3 w-3" />
                                {photo.created_at ? new Date(photo.created_at).toLocaleDateString() : "Recently"}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="mt-auto border-t border-white/5 pt-6 flex items-center justify-between">
                    <button className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase">
                        <Share2 className="h-4 w-4" /> Share
                    </button>
                    <button className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase">
                        <Maximize2 className="h-4 w-4" /> Expand
                    </button>
                </div>
            </div>

          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
