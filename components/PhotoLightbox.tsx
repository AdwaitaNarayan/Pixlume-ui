"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Heart, Download, ChevronLeft, ChevronRight,
  Share2, Info, Waves, ArrowRight, Monitor
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
  const [showWallpaperPreview, setShowWallpaperPreview] = useState(false);
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
    link.download = `${photo.categories ? photo.categories.join("_") : "pixlume"}-${label}.jpg`;
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

        <div className="flex-1 overflow-y-auto lg:overflow-hidden p-6 md:p-12 lg:p-16 pt-24">
          <div className="flex flex-col lg:flex-row lg:h-full gap-8 lg:gap-20">
            
            {/* Left Side: Large Asset Image */}
            <div className="lg:w-[55%] h-[60vh] lg:h-full min-h-0 flex flex-col relative">
              
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
                    alt={photo.categories?.join(", ") || "Wallpaper View"} 
                    fill
                    className={`object-cover transition-all duration-700 ${isImageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`} 
                    onLoad={() => setIsImageLoaded(true)}
                    priority
                  />
                )}
                
                {/* ── Smart Wallpaper Preview Overlay ── */}
                <AnimatePresence>
                  {showWallpaperPreview && (
                    <motion.div
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      onClick={() => setShowWallpaperPreview(false)}
                      className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-xl cursor-pointer"
                    >
                      {photo.device_type === "mobile" ? (
                        /* Ultra-Modern Flagship Frame (S24 Ultra / iPhone 17 Pro style) */
                        <div className="relative h-[82vh] aspect-[9/19.5] max-w-[340px] rounded-[2.5rem] p-[3px] bg-gradient-to-b from-zinc-700 to-zinc-900 shadow-[0_40px_120px_-20px_rgba(0,0,0,1)] pointer-events-none ring-1 ring-white/10">
                           {/* Ultra-Thin Bezel */}
                           <div className="h-full w-full bg-zinc-950 rounded-[2.3rem] p-[6px] relative overflow-hidden">
                              {/* Pill / Dynamic Island */}
                              <div className="absolute top-4 left-1/2 -translate-x-1/2 h-5 w-16 bg-black rounded-full z-30 ring-1 ring-white/5" />
                              
                              <div className="relative h-full w-full overflow-hidden rounded-[1.8rem]">
                                 <Image src={highResUrl || ""} fill className="object-cover" alt="Mobile Wallpaper" />
                                 
                                 {/* Minimalist OS UI */}
                                 <div className="absolute top-10 left-0 right-0 px-8 flex justify-between items-center text-white/90">
                                    <span className="text-xs font-bold tracking-tight">9:41</span>
                                    <div className="flex gap-1.5 items-center">
                                       <div className="w-4 h-2 border border-white/40 rounded-[2px]" />
                                       <div className="w-1.5 h-1.5 bg-white/80 rounded-full" />
                                    </div>
                                 </div>
                                 
                                 {/* Floating Lock Screen Element */}
                                 <div className="absolute top-[25%] left-0 right-0 flex flex-col items-center">
                                    <span className="text-5xl font-light text-white/95 tracking-tighter">9:41</span>
                                    <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-white/60 mt-2">Wednesday, April 22</span>
                                 </div>

                                 <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                                    <div className="h-1 w-24 bg-white/30 rounded-full" />
                                 </div>
                              </div>
                           </div>
                        </div>
                      ) : (
                        /* Desktop Monitor Frame Mockup */
                        <div className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-xl border-[4px] border-zinc-800 bg-zinc-900 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.8)] pointer-events-none">
                          <Image src={highResUrl || ""} fill className="object-cover" alt="Desktop Wallpaper" />
                          
                          {/* Desktop Elements */}
                          <div className="absolute bottom-0 left-0 right-0 h-8 bg-black/50 backdrop-blur-xl flex items-center justify-center px-4 gap-3 border-t border-white/10">
                             <div className="flex gap-2">
                               <div className="h-4 w-4 rounded-sm bg-white/30" />
                               <div className="h-4 w-4 rounded-sm bg-white/20" />
                               <div className="h-4 w-4 rounded-sm bg-white/20" />
                             </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-8 flex flex-col items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 drop-shadow-lg">Simulation Mode</span>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest italic">Tap anywhere to leave</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

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
            <div className="flex-1 min-w-0 lg:overflow-y-auto custom-scrollbar lg:pr-6 relative z-10">
              <div className="max-w-[520px] mx-auto lg:mx-0 py-2 pb-32 lg:pb-0">
                
                {/* Title & Badges */}
                <div className="mb-12">
                  <h1 className="font-headline text-3xl lg:text-5xl font-extrabold tracking-tighter mb-4 leading-tight capitalize">{photo.categories?.join(", ") || "Untitled Masterpiece"}</h1>
                  <div className="flex flex-wrap gap-3 items-center">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold uppercase text-[9px] tracking-widest flex items-center gap-1.5 border border-primary/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                      Premium Work
                    </span>
                    <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-bold uppercase text-[9px] tracking-widest border border-outline-variant/10">
                      Pixlume Curated
                    </span>
                    <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-bold uppercase text-[9px] tracking-widest border border-outline-variant/10">
                      {photo.image_8k_url ? "8K Cinema" : photo.image_4k_url ? "4K UHD" : photo.image_2k_url ? "2K QHD" : "Full HD"}
                    </span>
                  </div>
                </div>

                {/* Description / Story */}
                <div className="mb-12">
                  <h3 className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 mb-4">The Narrative</h3>
                  <p className="text-on-surface-variant text-base leading-relaxed font-medium">
                    {(photo as any).description || `A study of profound silence and atmospheric weight. Captured creatively, this piece explores haunting beauty through a cinematic lens.`}
                  </p>
                </div>

                {/* Action Buttons (Hide on Mobile) */}
                <div className="hidden lg:flex gap-4 mb-14 relative z-50">
                  <div className="flex-[2] relative">
                    <button 
                      onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                      className="w-full h-full bg-gradient-to-r from-primary to-[#00B8CC] text-background-dark px-8 py-5 rounded-xl font-headline text-sm font-extrabold flex items-center justify-center gap-3 hover:shadow-[0_15px_40px_rgba(0,229,255,0.25)] transition-all transform hover:-translate-y-1"
                    >
                      <Download className="h-5 w-5 font-bold" />
                      <span>Download</span>
                    </button>

                    {/* Download Menu */}
                    <AnimatePresence>
                      {showDownloadMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute bottom-full left-0 right-0 mb-4 overflow-hidden rounded-3xl border border-white/10 bg-surface shadow-[0_32px_128px_-16px_rgba(0,0,0,0.8)] backdrop-blur-xl z-[100]"
                        >
                          <div className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 border-b border-white/10">Select Resolution</div>
                          <div className="flex flex-col">
                            {[
                              { key: 'image_8k_url', label: '8K Ultra Master', size: '7680 × 4320' },
                              { key: 'image_4k_url', label: '4K Cinematic HD', size: '3840 × 2160' },
                              { key: 'image_2k_url', label: '2K QHD Premium', size: '2560 × 1440' },
                              { key: 'image_1080_url', label: '1080p Full HD', size: '1920 × 1080' },
                              { key: 'thumbnail_url', label: 'Original Quality', size: 'Native Source' },
                            ].map((opt) => (
                              ((photo as any)[opt.key] || (opt.key === 'thumbnail_url' && !photo.image_1080_url)) && (
                                <button
                                  key={opt.key}
                                  onClick={() => {
                                    handleDownload((photo as any)[opt.key], opt.label);
                                    setShowDownloadMenu(false);
                                  }}
                                  className="group flex w-full items-center justify-between px-6 py-4 text-left hover:bg-surface-container-high transition-colors border-b border-white/5 last:border-0"
                                >
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{opt.label}</span>
                                      {(photo as any)[opt.key] && !((photo as any)['image_8k_url'] && opt.key !== 'image_8k_url') && (
                                        <span className="text-[7px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-black uppercase tracking-tighter">Native</span>
                                      )}
                                    </div>
                                    <span className="text-[10px] text-on-surface-variant font-medium tracking-tight mb-0">{opt.size}</span>
                                  </div>
                                  <Download className="h-4 w-4 text-on-surface-variant group-hover:text-primary transition-colors" />
                                </button>
                              )
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <button 
                    onClick={() => setShowWallpaperPreview(true)}
                    className={`flex-1 bg-surface-container text-on-surface border-outline-variant/20 hover:bg-surface-bright border px-8 py-5 rounded-xl font-headline text-sm font-bold flex items-center justify-center gap-3 transition-all group`}
                  >
                    <Monitor className="h-5 w-5 transition-transform group-hover:scale-110 text-primary" />
                    <span>Preview</span>
                  </button>
                </div>

                {/* Technical Specs (Grid Layout) */}
                <div className="bg-surface-container-low rounded-2xl p-8 border border-outline-variant/10 mb-10">
                  <h3 className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8">Technical Specifications</h3>
                  <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase tracking-widest text-on-surface-variant/60 font-bold">Resolution</span>
                      <p className="font-label text-sm font-semibold text-on-surface">
                        {photo.image_8k_url ? "7680 x 4320 (8K)" : 
                         photo.image_4k_url ? "3840 x 2160 (4K)" : 
                         photo.image_2k_url ? "2560 x 1440 (2K)" : 
                         photo.image_1080_url ? "1920 x 1080 (HD)" : 
                         "Original Quality"}
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

            </div>
          </div>
        </div>
      </div>

        {/* ── Global Mobile Sticky Action Bar (Fixed to bottom of screen) ── */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] p-4 bg-background-dark/40 backdrop-blur-3xl border-t border-white/5 safe-area-bottom">
          <div className="flex gap-3 max-w-md mx-auto relative">
             <div className="flex-[2] relative">
                  <button 
                    onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                    className="w-full bg-primary text-background-dark py-4 rounded-xl font-headline text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>

                  <AnimatePresence>
                    {showDownloadMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-full left-0 right-0 mb-4 overflow-hidden rounded-2xl border border-white/10 bg-surface/95 backdrop-blur-3xl shadow-2xl"
                      >
                        <div className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 border-b border-white/10">Quality</div>
                        {[
                            { key: 'image_8k_url', label: '8K Ultra Master', size: '7680 × 4320' },
                            { key: 'image_4k_url', label: '4K Cinematic HD', size: '3840 × 2160' },
                            { key: 'image_2k_url', label: '2K QHD Premium', size: '2560 × 1440' },
                            { key: 'image_1080_url', label: '1080p Full HD', size: '1920 × 1080' },
                            { key: 'thumbnail_url', label: 'Original Quality', size: 'Native Source' },
                        ].map((opt) => (
                            ((photo as any)[opt.key] || (opt.key === 'thumbnail_url' && !photo.image_1080_url)) && (
                                <button
                                    key={opt.key}
                                    onClick={() => {
                                        handleDownload((photo as any)[opt.key], opt.label);
                                        setShowDownloadMenu(false);
                                    }}
                                    className="w-full px-5 py-4 text-left border-b border-white/5 active:bg-white/10 flex justify-between items-center"
                                >
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-bold text-on-surface leading-none">{opt.label}</span>
                                          {(photo as any)[opt.key] && !((photo as any)['image_8k_url'] && opt.key !== 'image_8k_url') && (
                                            <span className="text-[6px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-black uppercase tracking-tighter">Native</span>
                                          )}
                                        </div>
                                        <span className="text-[9px] text-on-surface-variant mt-1">{opt.size}</span>
                                    </div>
                                    <Download className="h-4 w-4 text-primary" />
                                </button>
                            )
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
             </div>
             <button 
                onClick={() => setShowWallpaperPreview(true)}
                className="flex-1 bg-surface-container text-on-surface border border-outline-variant/20 py-4 rounded-xl font-headline text-sm font-bold flex items-center justify-center gap-2"
              >
                <Monitor className="h-4 w-4 text-primary" />
                <span>Preview</span>
              </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
