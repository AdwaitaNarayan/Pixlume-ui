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
    <div
      ref={cardRef}
      onClick={() => onClick(photo)}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900
        transition-all duration-500
        hover:shadow-[0_12px_48px_-8px_rgba(6,182,212,0.35)]
        hover:-translate-y-1
        ${enterClass}`}
    >
      {/* ── Image Container ── */}
      <div className="relative w-full overflow-hidden leading-none min-h-[200px]">

        {/* Shimmer skeleton – shows only while image loads */}
        {!isLoaded && (
          <div className="absolute inset-0 z-0 skeleton-shimmer rounded-2xl" />
        )}

        <Image
          src={imageUrl}
          alt={photo.title}
          width={800}
          height={600}
          unoptimized={imageUrl.includes("via.placeholder")}
          className={`w-full h-auto block object-cover
            transition-all duration-700 ease-out
            ${isLoaded
              ? "opacity-100 group-hover:scale-[1.07] group-hover:brightness-90"
              : "opacity-0 scale-95"
            }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onLoad={() => setIsLoaded(true)}
        />

        {/* Multi-layer hover overlay — gradient + noise texture feel */}
        <div className="absolute inset-0 z-10 pointer-events-none
          bg-gradient-to-t from-black/75 via-black/10 to-transparent
          opacity-0 group-hover:opacity-100
          transition-opacity duration-400 ease-out" />

        {/* Subtle cyan tint shimmer on hover */}
        <div className="absolute inset-0 z-10 pointer-events-none
          bg-gradient-to-br from-cyan-600/10 to-transparent
          opacity-0 group-hover:opacity-100
          transition-opacity duration-500" />

        {/* ── Top-right action buttons ── */}
        <div
          className="absolute top-3 right-3 z-30 flex flex-col gap-2
            translate-x-2 opacity-0
            group-hover:translate-x-0 group-hover:opacity-100
            transition-all duration-300 ease-out"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Favorite / heart button */}
          <button
            onClick={handleFavorite}
            className={`relative flex h-9 w-9 items-center justify-center rounded-full
              backdrop-blur-md shadow-lg
              transition-all duration-200 active:scale-75
              ${isFavorited
                ? "bg-rose-500 shadow-rose-500/40"
                : "bg-black/40 hover:bg-rose-500/80"
              }`}
            title={isFavorited ? "Unfavorite" : "Add to favorites"}
          >
            <svg
              className={`h-4 w-4 transition-transform duration-200 ${isFavorited ? "scale-110" : "scale-100"}`}
              fill={isFavorited ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>

            {/* Heart burst animation */}
            {showHeartBurst && (
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="absolute h-12 w-12 rounded-full bg-rose-400/50 animate-ping" />
              </span>
            )}
          </button>

          {/* Download button */}
          <div className="ripple-btn">
            <DownloadMenu
              onDownload={() => {
                const downloadUrl =
                  photo.image_4k_url ||
                  photo.image_2k_url ||
                  photo.image_1080_url ||
                  photo.image_720_url ||
                  photo.thumbnail_url;
                if (!downloadUrl) return;

                let finalUrl = downloadUrl;
                if (finalUrl.includes("cloudinary.com")) {
                  const parts = finalUrl.split("/upload/");
                  if (parts.length === 2)
                    finalUrl = `${parts[0]}/upload/fl_attachment/${parts[1]}`;
                }
                const link = document.createElement("a");
                link.href = finalUrl;
                link.download = `${photo.title || "pixlume-photo"}.jpg`;
                link.target = "_blank";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            />
          </div>
        </div>

        {/* ── Resolution badge ── */}
        {photo.image_4k_url && (
          <div className="absolute top-3 left-3 z-30
            translate-y-1 opacity-0
            group-hover:translate-y-0 group-hover:opacity-100
            transition-all duration-300 delay-75">
            <span className="rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-cyan-300 backdrop-blur-md border border-cyan-400/20">
              4K
            </span>
          </div>
        )}
      </div>

      {/* ── Info strip — slides up from bottom on hover ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 p-5
          translate-y-3 opacity-0
          group-hover:translate-y-0 group-hover:opacity-100
          transition-all duration-350 ease-out
          pointer-events-none"
      >
        <h3 className="text-base font-bold leading-tight text-white drop-shadow-md line-clamp-1">
          {photo.title}
        </h3>

        {photo.tags && photo.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {photo.tags.slice(0, 3).map((tag, i) => (
              <span
                key={tag}
                style={{ transitionDelay: `${i * 40}ms` }}
                className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur-sm
                  border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Hover border glow ── */}
      <div className="pointer-events-none absolute inset-0 z-40 rounded-2xl ring-0 ring-cyan-400/0
        transition-all duration-400
        group-hover:ring-1 group-hover:ring-cyan-400/30" />
    </div>
  );
}
