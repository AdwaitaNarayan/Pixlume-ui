"use client";

import Link from "next/link";
import { Camera, Instagram, Twitter, Mail } from "lucide-react";

const footerLinks = [
  {
    title: "Explore",
    links: [
      { name: "All Photos", href: "/gallery" },
      { name: "Collections", href: "/#collections" },
      { name: "About", href: "/#about" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Contact", href: "mailto:hello@pixlume.com" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#0f0f0f] border-t border-zinc-100 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 group mb-6">
              <div className="w-8 h-8 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center transition-transform group-hover:scale-95">
                <Camera className="w-4 h-4 text-white dark:text-zinc-900" />
              </div>
              <span className="text-[17px] font-bold tracking-tight text-zinc-900 dark:text-white">
                Pixlume
              </span>
            </Link>
            <p className="text-zinc-400 dark:text-zinc-500 text-sm leading-relaxed max-w-xs font-medium">
              A premium image discovery platform for creators. High-resolution photography at your fingertips.
            </p>
            <div className="flex items-center gap-5 mt-8">
              {[
                { icon: Instagram, href: "https://www.instagram.com/picgallery62/", label: "Instagram" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Mail, href: "mailto:hello@pixlume.com", label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">
                {section.title}
              </p>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-zinc-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-medium text-zinc-400">
            © {new Date().getFullYear()} Pixlume Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-zinc-300 dark:text-zinc-700 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
