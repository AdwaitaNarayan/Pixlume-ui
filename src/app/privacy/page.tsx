"use client";

import Footer from "../../../components/Footer";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
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
                <Shield className="h-6 w-6" />
            </div>
            <div>
                <h1 className="text-4xl font-black text-zinc-900 dark:text-white">Privacy Policy</h1>
                <p className="text-sm text-zinc-500 font-medium">Last updated: March 26, 2026</p>
            </div>
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-12">
            <section>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">1. Introduction</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Welcome to Pixlume Studio. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">2. Information We Collect</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    We collect personal information that you voluntarily provide to us when you register on the Website, express an interest in obtaining information about us or our products and services, when you participate in activities on the Website or otherwise when you contact us.
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-3 text-zinc-600 dark:text-zinc-400">
                    <li>Contact Data (such as email address)</li>
                    <li>Usage Data (IP address, browser type, pages visited)</li>
                    <li>Device Data (model, operating system)</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">3. How We Use Your Information</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">4. Cookies and Tracking</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">5. Contact Us</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    If you have questions or comments about this policy, you may email us at hello@pixlume.com or by post to our physical address.
                </p>
            </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
