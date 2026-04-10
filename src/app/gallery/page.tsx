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
      <div className="mx-auto max-w-[1600px] px-6 pt-32 pb-12 md:px-12">
        <nav className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-8">
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            Home
          </Link>
          <span className="text-zinc-200 dark:text-zinc-800">/</span>
          <span className="text-zinc-900 dark:text-white">Archive</span>
        </nav>
        
        <div className="max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-5xl italic font-serif">
            Digital Archive
          </h1>
          <p className="mt-4 text-zinc-500 dark:text-zinc-400 font-light text-lg">
            A comprehensive gateway to our high-resolution photography collections.
          </p>
        </div>
      </div>

      {/* Main Gallery Component */}
      <main className="pb-32">
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
