"use client";

import Image from "next/image";
import { Photo } from "../services/api";

interface PhotoCardProps {
  photo: Photo;
  onClick: (photo: Photo) => void;
}

export default function PhotoCard({ photo, onClick }: PhotoCardProps) {
  // Fallback if there's no thumbnail but other URLs exist
  const imageUrl =
    photo.thumbnail_url ||
    photo.image_720_url ||
    "https://via.placeholder.com/600x400?text=No+Image";

  return (
    <div
      onClick={() => onClick(photo)}
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={photo.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Info Section - Slides up on hover */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-4 p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <h3 className="text-xl font-bold text-white drop-shadow-md">
          {photo.title}
        </h3>
        {photo.tags && photo.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {photo.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
