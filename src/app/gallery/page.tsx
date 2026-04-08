"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Gallery from "../../../components/Gallery";
import Footer from "../../../components/Footer";
import { ChevronRight, Home as HomeIcon } from "lucide-react";
import Link from "next/link";

function GalleryContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      {/* Breadcrumbs & Header */}
      <div className="mx-auto max-w-[1400px] px-6 pt-24 md:px-12">
        <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
          <Link href="/" className="hover:text-cyan-600 transition-colors flex items-center gap-1">
            <HomeIcon className="h-3 w-3" /> Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-zinc-900 dark:text-white">Full Gallery</span>
        </nav>
        <div className="mt-4 flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            Explore the <span className="bg-gradient-to-r from-cyan-500 to-indigo-500 bg-clip-text text-transparent">Full Collection</span>
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Browse through thousands of high-resolution professional photographs. Filter by resolution, category, and more to find the perfect shot for your project.
          </p>
        </div>
      </div>

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
