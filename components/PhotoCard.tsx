"use client";

import { useState } from "react";
import { Photo } from "../services/api";
import { motion } from "framer-motion";
import { Heart, Download, Expand } from "lucide-react";

interface PhotoCardProps {
  photo: Photo;
  onClick: (photo: Photo) => void;
  enterClass?: string;
}

export default function PhotoCard({ photo, onClick, enterClass = "" }: PhotoCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveAnim, setSaveAnim] = useState(false);

  const imageUrl =
    photo.thumbnail_url ||
    photo.image_720_url ||
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80";

  const title = photo.caption || photo.categories?.join(", ") || "Untitled";
  const photographer = (photo as any).photographer || "Pixlume Artist";

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved((prev) => !prev);
    setSaveAnim(true);
    setTimeout(() => setSaveAnim(false), 600);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url =
      photo.image_4k_url ||
      photo.image_2k_url ||
      photo.image_1080_url ||
      photo.image_720_url ||
      photo.thumbnail_url;
    if (!url) return;
    let finalUrl = url;
    if (finalUrl.includes("cloudinary.com")) {
      const parts = finalUrl.split("/upload/");
      if (parts.length === 2) finalUrl = `${parts[0]}/upload/fl_attachment/${parts[1]}`;
    }
    const link = document.createElement("a");
    link.href = finalUrl;
    link.download = `pixlume-${title.replace(/\s+/g, "-").toLowerCase()}.jpg`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onClick(photo)}
      className={`group relative cursor-pointer break-inside-avoid rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-sm hover:shadow-xl transition-shadow duration-300 ${enterClass}`}
    >
      {/* Skeleton loader */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-br from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900" />
      )}

      {/* Image */}
      <img
        src={imageUrl}
        alt={title}
        loading="lazy"
        className={`w-full h-auto block transition-transform duration-500 ease-out group-hover:scale-[1.04] ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setIsLoaded(true)}
      />

      {/* Save button — always top-right, appears on hover */}
      <div className="absolute top-3 right-3 z-30">
        <button
          onClick={handleSave}
          className={`flex items-center justify-center w-9 h-9 rounded-full shadow-lg backdrop-blur-md transition-all duration-200
            opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
            ${isSaved
              ? "bg-rose-500 text-white scale-110"
              : "bg-white/90 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-200 hover:bg-rose-500 hover:text-white"
            }
            ${saveAnim ? "scale-125" : ""}
          `}
          title={isSaved ? "Saved" : "Save"}
        >
          <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* 4K badge */}
      {photo.image_4k_url && (
        <div className="absolute top-3 left-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-[9px] font-black uppercase tracking-widest bg-black/60 text-white px-2 py-1 rounded-full backdrop-blur-sm">
            4K
          </span>
        </div>
      )}

      {/* Hover overlay with info + actions */}
      <div
        className="absolute inset-0 z-20 flex flex-col justify-end
          bg-gradient-to-t from-black/70 via-black/10 to-transparent
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300 ease-out
          pointer-events-none group-hover:pointer-events-auto"
      >
        <div className="p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          {/* Title */}
          <p className="text-white text-sm font-semibold line-clamp-1 leading-tight mb-1">
            {title}
          </p>
          {/* Photographer */}
          <p className="text-white/60 text-xs font-medium line-clamp-1 mb-3">
            by {photographer}
          </p>

          {/* Action row */}
          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
            {/* View button */}
            <button
              onClick={() => onClick(photo)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-zinc-900 hover:bg-zinc-100 transition-colors shadow-sm"
            >
              <Expand className="w-3.5 h-3.5" />
              View
            </button>

            {/* Download button */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-colors border border-white/20"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
