"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Heart, Download, ChevronLeft, ChevronRight,
  Share2, Info, Waves, ArrowRight
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
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onNavigate) navigate(-1);
      if (e.key === "ArrowRight" && onNavigate) navigate(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [photo, allPhotos, onNavigate]);

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

  const handleDownload = (url: string = highResUrl || "", label: string = "High-Res") => {
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

  /* We use AnimatePresence in the parent, but we can wrap our elements directly here too. */
  return (
    <>
      {/* Backdrop Dimmer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-[2px] pointer-events-auto"
      />

      {/* Asset Detail Side Sheet (Drawer) */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed right-0 top-0 h-full w-full max-w-[1300px] z-[110] bg-surface shadow-2xl flex flex-col border-l border-outline-variant/10 text-on-surface font-body overflow-hidden"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-8 z-[120] p-3 rounded-full bg-surface-container/50 hover:bg-surface-container transition-all border border-outline-variant/20 group hover:rotate-90"
        >
          <X className="h-6 w-6 text-on-surface group-hover:scale-110 transition-transform" />
        </button>

        <div className="flex-1 overflow-hidden p-8 md:p-12 lg:p-16 pt-24">
          <div className="flex flex-col lg:flex-row h-full gap-12 lg:gap-20">
            
            {/* Left Side: Large Asset Image */}
            <div className="lg:w-[55%] h-full min-h-0 flex flex-col relative">
              
              {/* Navigation Arrows for Left Side */}
              {allPhotos.length > 1 && onNavigate && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                    className="absolute left-4 top-1/2 z-[130] -translate-y-1/2 rounded-full bg-surface-container-low/50 p-3 text-on-surface backdrop-blur-md transition-all hover:bg-surface-container border border-outline-variant/20 active:scale-95"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(1); }}
                    className="absolute right-4 top-1/2 z-[130] -translate-y-1/2 rounded-full bg-surface-container-low/50 p-3 text-on-surface backdrop-blur-md transition-all hover:bg-surface-container border border-outline-variant/20 active:scale-95"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              <div className="relative group flex-1 overflow-hidden rounded-2xl bg-surface-container-low shadow-2xl border border-outline-variant/10">
                {!isImageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                  </div>
                )}
                
                {highResUrl && (
                  <Image 
                    src={highResUrl} 
                    alt={photo.title || "Wallpaper View"} 
                    fill
                    className={`object-cover transition-all duration-700 ${isImageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`} 
                    onLoad={() => setIsImageLoaded(true)}
                    priority
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
              </div>

              {/* Image Meta Info Footer */}
              <div className="mt-6 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary p-[1px]">
                    <div className="w-full h-full rounded-full bg-surface-container overflow-hidden flex items-center justify-center">
                      <span className="font-headline font-bold text-xs text-primary text-center">
                        {(photo as any).photographer?.[0]?.toUpperCase() || "P"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Artist</p>
                    <p className="text-sm font-semibold">{(photo as any).photographer || "Pixlume Artist"}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button className="p-2 rounded-lg bg-surface-container-low border border-outline-variant/10 text-on-surface-variant hover:text-on-surface transition-colors">
                     <Share2 className="h-5 w-5" />
                   </button>
                   <button className="p-2 rounded-lg bg-surface-container-low border border-outline-variant/10 text-on-surface-variant hover:text-on-surface transition-colors">
                     <Info className="h-5 w-5" />
                   </button>
                </div>
              </div>
            </div>

            {/* Right Side: Details & Actions (Expansive Layout) */}
            <div className="flex-1 min-w-0 overflow-y-auto custom-scrollbar lg:pr-6 relative z-10">
              <div className="max-w-[520px] mx-auto lg:mx-0 py-2">
                
                {/* Title & Badges */}
                <div className="mb-12">
                  <h1 className="font-headline text-5xl font-extrabold tracking-tighter mb-4 leading-tight">{photo.title || "Untitled Masterpiece"}</h1>
                  <div className="flex flex-wrap gap-3 items-center">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold uppercase text-[9px] tracking-widest flex items-center gap-1.5 border border-primary/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                      Premium Work
                    </span>
                    <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-bold uppercase text-[9px] tracking-widest border border-outline-variant/10">
                      Pixlume Curated
                    </span>
                    <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-bold uppercase text-[9px] tracking-widest border border-outline-variant/10">
                      {photo.image_4k_url ? "8K Digital" : photo.image_2k_url ? "4K UHD" : "High Res"}
                    </span>
                  </div>
                </div>

                {/* Description / Story */}
                <div className="mb-12">
                  <h3 className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 mb-4">The Narrative</h3>
                  <p className="text-on-surface-variant text-base leading-relaxed font-medium">
                    {(photo as any).description || `A study of profound silence and atmospheric weight. Captured creatively, "${photo.title || "the photo"}" explores haunting beauty through a cinematic lens.`}
                  </p>
                </div>

                {/* Action Buttons (Side by Side) */}
                <div className="flex gap-4 mb-14 relative">
                  <button 
                    onClick={() => handleDownload()}
                    className="flex-[2] bg-gradient-to-r from-primary to-[#00B8CC] text-background-dark px-8 py-5 rounded-xl font-headline text-sm font-extrabold flex items-center justify-center gap-3 hover:shadow-[0_15px_40px_rgba(0,229,255,0.25)] transition-all transform hover:-translate-y-1"
                  >
                    <Download className="h-5 w-5 font-bold" />
                    <span>Download</span>
                  </button>
                  <button 
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`flex-1 ${isFavorited ? 'bg-error-dim/20 text-error-dim border-error-dim/50' : 'bg-surface-container text-on-surface border-outline-variant/20 hover:bg-surface-bright'} border px-8 py-5 rounded-xl font-headline text-sm font-bold flex items-center justify-center gap-3 transition-all group`}
                  >
                    <Heart className={`h-5 w-5 transition-transform group-hover:scale-110 ${isFavorited ? 'fill-current text-error border-transparent' : 'text-primary'}`} />
                    <span>{isFavorited ? 'Liked' : 'Like'}</span>
                  </button>
                </div>

                {/* Technical Specs (Grid Layout) */}
                <div className="bg-surface-container-low rounded-2xl p-8 border border-outline-variant/10 mb-10">
                  <h3 className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8">Technical Specifications</h3>
                  <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase tracking-widest text-on-surface-variant/60 font-bold">Resolution</span>
                      <p className="font-label text-sm font-semibold text-on-surface">
                        {photo.image_4k_url ? "7680 x 4320 (8K)" : photo.image_2k_url ? "3840 x 2160 (4K)" : "1920 x 1080 (HD)"}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase tracking-widest text-on-surface-variant/60 font-bold">Aspect Ratio</span>
                      <p className="font-label text-sm font-semibold text-on-surface">16:9 Cinematic</p>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase tracking-widest text-on-surface-variant/60 font-bold">Downloads</span>
                      <p className="font-label text-sm font-semibold text-on-surface">{photo.downloads?.toLocaleString() || 0} Total</p>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase tracking-widest text-on-surface-variant/60 font-bold">Format</span>
                      <p className="font-label text-sm font-semibold text-on-surface">RAW .JPG</p>
                    </div>
                  </div>
                </div>

                {/* Collection Insights */}
                <div className="mb-14 p-8 rounded-2xl border border-primary/10 bg-gradient-to-br from-surface-container-low to-surface-dim relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Waves className="h-20 w-20 text-on-surface" />
                  </div>
                  <div className="flex justify-between items-center mb-6 z-10 relative">
                    <h3 className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Collection Curator</h3>
                    <button className="text-primary font-body text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 hover:gap-2 transition-all">
                      Explore All
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-on-surface-variant text-sm leading-relaxed relative z-10">
                    A defining piece of the <span className="text-on-surface font-semibold">Creator's Series</span>. This curated set features unique atmospheric captures inspired by natural silence and grand vistas.
                  </p>
                </div>

                {/* Tags (optional extension) */}
                {photo.tags && photo.tags.length > 0 && (
                  <div className="mb-14">
                    <h3 className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 mb-4">Related Tags</h3>
                    <div className="flex flex-wrap gap-2">
                       {photo.tags.map(tag => (
                         <span key={tag} className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant text-[10px] uppercase tracking-wider font-bold border border-outline-variant/10 hover:text-on-surface hover:border-outline-variant/30 transition-colors cursor-pointer">
                           {tag}
                         </span>
                       ))}
                    </div>
                  </div>
                )}

                {/* Footer Info */}
                <div className="pt-8 border-t border-outline-variant/10 flex justify-between items-center pb-8 opacity-50">
                  <div className="font-body text-[9px] tracking-[0.3em] uppercase text-on-surface-variant">
                    Pixlume Curated © {new Date().getFullYear()}
                  </div>
                  <div className="flex gap-4">
                    <span className="font-body text-[9px] tracking-widest uppercase cursor-pointer hover:text-on-surface transition-colors">Terms</span>
                    <span className="font-body text-[9px] tracking-widest uppercase cursor-pointer hover:text-on-surface transition-colors">Rights</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
