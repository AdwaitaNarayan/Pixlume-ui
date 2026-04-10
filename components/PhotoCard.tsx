"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { Photo } from "../services/api";
import DownloadMenu from "./DownloadMenu/DownloadMenu";

interface PhotoCardProps {
  photo: Photo;
  onClick: (photo: Photo) => void;
  enterClass?: string; // e.g. "card-enter card-enter-2" for staggered animation
}

import { motion } from "framer-motion";

export default function PhotoCard({ photo, onClick, enterClass = "card-enter" }: PhotoCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const imageUrl =
    photo.thumbnail_url ||
    photo.image_720_url ||
    "https://via.placeholder.com/600x400?text=No+Image";

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited((prev) => !prev);
    if (!isFavorited) {
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 700);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onClick(photo)}
      className={`group relative cursor-pointer bg-zinc-100 dark:bg-zinc-900 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl ${enterClass}`}
    >
      {/* ── Image Container ── */}
      <div className="relative w-full aspect-[3/4] overflow-hidden">
        {/* Shimmer skeleton */}
        {!isLoaded && (
          <div className="absolute inset-0 z-0 skeleton-shimmer" />
        )}

        <img
          src={imageUrl}
          alt={photo.caption || "Photo"}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-700 ease-in-out
            ${isLoaded ? "opacity-100 group-hover:scale-110" : "opacity-0"}
          `}
          onLoad={() => setIsLoaded(true)}
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/30 transition-colors duration-500" />

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
           <button 
             onClick={handleFavorite}
             className="p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-colors"
           >
             <svg className="w-5 h-5" fill={isFavorited ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
             </svg>
           </button>
        </div>

        {/* Info Strip */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <p className="text-white font-medium text-lg leading-tight line-clamp-2 italic font-serif">
              {photo.caption || photo.categories?.join(", ") || "Untitled"}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
               {photo.categories?.slice(0, 2).map(cat => (
                 <span key={cat} className="text-[10px] uppercase tracking-widest text-white/70 font-semibold px-2 py-0.5 border border-white/20 rounded-full">
                   {cat}
                 </span>
               ))}
            </div>
        </div>
      </div>
    </motion.div>

  );
}
