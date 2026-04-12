"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Gallery from "../../../components/Gallery";
import Footer from "../../../components/Footer";

function GalleryContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0f0f0f]">
      <Gallery initialSearch={initialSearch} />
      <Footer />
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#fafafa] dark:bg-[#0f0f0f]">
          <div className="w-8 h-8 border-2 border-zinc-200 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full animate-spin" />
        </div>
      }
    >
      <GalleryContent />
    </Suspense>
  );
}
