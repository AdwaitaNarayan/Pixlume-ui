"use client";

import Link from "next/link";
import { Camera, Instagram, Twitter, Github, Linkedin, Mail } from "lucide-react";

const footerLinks = [
  {
    title: "Gallery",
    links: [
      { name: "All Photos", href: "/gallery" },
      { name: "Trending", href: "#trending" },
      { name: "Latest", href: "#latest" },
      { name: "Popular", href: "#popular" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/#about" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Contact", href: "mailto:hello@pixlume.com" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-white py-24 dark:bg-zinc-950 transition-colors duration-300">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-x-16 gap-y-16 lg:grid-cols-12 pb-20 border-b border-zinc-100 dark:border-white/5">
          {/* Logo & Info Section */}
          <div className="lg:col-span-6">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <Camera className="w-5 h-5 text-zinc-900 dark:text-white" />
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white leading-none">
                  Pixlume
                </span>
                <span className="text-[9px] uppercase tracking-[0.4em] font-medium text-zinc-400 dark:text-zinc-500 mt-0.5 leading-none">
                  Studio
                </span>
              </div>
            </Link>
            <p className="mt-8 text-lg leading-relaxed text-zinc-400 dark:text-zinc-500 max-w-sm font-light">
              Elevating digital experiences through high-fidelity photography and minimalist curation.
            </p>
            <div className="mt-10 flex gap-6">
              {[
                { Icon: Instagram, href: "https://www.instagram.com/picgallery62/" },
                { Icon: Twitter, href: "#" },
                { Icon: Mail, href: "mailto:hello@pixlume.com" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  <social.Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title} className="lg:col-span-3">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-900 dark:text-white mb-8">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors font-medium">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright Section */}
        <div className="mt-12 flex flex-col items-center justify-between gap-8 sm:flex-row">
          <p className="text-xs font-medium text-zinc-400">
            © {new Date().getFullYear()} Pixlume Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-300 dark:text-zinc-800">
            <div className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-800" />
            Operational
          </div>
        </div>
      </div>
    </footer>

  );
}
