"use client";

import Footer from "../../../components/Footer";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <main className="mx-auto max-w-4xl px-6 py-32">
        <Link 
            href="/" 
            className="group flex w-fit items-center gap-2 text-sm font-bold text-zinc-500 hover:text-cyan-600 transition-colors mb-12"
        >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600">
                <BookOpen className="h-6 w-6" />
            </div>
            <div>
                <h1 className="text-4xl font-black text-zinc-900 dark:text-white">Terms of Service</h1>
                <p className="text-sm text-zinc-500 font-medium">Last updated: March 26, 2026</p>
            </div>
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-12">
            <section>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">1. Agreement to Terms</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    By accessing or using the Pixlume website, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the platform. We reserve the right to update these terms at any time.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">2. User Accounts</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">3. Content and Copyright</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    All images, text, and other content provided by Pixlume are protected by copyright. You may download photos for personal use as specified by the platform's features, but you may not redistribute, sell, or claim ownership of Pixlume's intellectual property.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">4. Prohibited Activities</h2>
                <ul className="list-disc pl-6 mt-4 space-y-3 text-zinc-600 dark:text-zinc-400">
                    <li>Violating any laws or regulations</li>
                    <li>Attempting to bypass security systems</li>
                    <li>Automated scraping or data mining</li>
                    <li>Impersonating other users or staff</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">5. Termination</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
            </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
