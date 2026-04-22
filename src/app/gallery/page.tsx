"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Gallery from "../../../components/Gallery";
import Footer from "../../../components/Footer";
import Link from "next/link";

function GalleryContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      {/* Editorial Header */}
      <header className="mx-auto max-w-[1600px] px-4 pt-12 md:px-8 md:pt-16 pb-8">
        <div className="flex flex-col gap-6">
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
            <Link href="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-zinc-200 dark:text-zinc-800">/</span>
            <span className="text-zinc-900 dark:text-white">Gallery</span>
          </nav>
          
          <div className="flex flex-col gap-3 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
              Gallery Archive
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
              Full Collection
            </h1>
            <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Explore our curated selection of high-resolution professional photography.
            </p>
          </div>
        </div>
      </header>

      {/* Main Gallery Component */}
      <main className="pb-24">
        <Gallery initialSearch={initialSearch} />
      </main>

      <Footer />
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500/20 border-t-cyan-500" />
      </div>
    }>
      <GalleryContent />
    </Suspense>
  );
}
