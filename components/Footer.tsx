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
    <footer className="relative bg-zinc-50 py-24 dark:bg-zinc-950 sm:py-32 transition-colors duration-300">
      <div className="absolute top-0 left-0 right-0 h-px bg-zinc-200 dark:bg-zinc-800" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-16 gap-y-16 lg:grid-cols-12">
          {/* Logo & Info Section */}
          <div className="lg:col-span-6">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative z-10 p-2 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-xl shadow-lg shadow-cyan-500/20">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight flex items-center gap-1">
                <span className="text-zinc-950 dark:text-white transition-colors">Pix</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-indigo-500">lume</span>
              </span>
            </Link>
            <p className="mt-6 text-sm leading-7 text-zinc-600 dark:text-zinc-400 max-w-xs">
              Experience digital clarity with the world's most premium photography gallery. Curating breathtaking 4K and 8K visual experiences.
            </p>
            <div className="mt-8 flex gap-4">
              {[
                { Icon: Instagram, href: "https://www.instagram.com/picgallery62/" },
                { Icon: Twitter, href: "#" },
                { Icon: Github, href: "#" },
                { Icon: Linkedin, href: "#" },
                { Icon: Mail, href: "mailto:hello@pixlume.com" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-cyan-500 dark:text-zinc-500 dark:hover:text-cyan-400 transition-colors shadow-sm"
                >
                  <social.Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title} className="lg:col-span-3">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
                {section.title}
              </h3>
              <ul className="mt-6 space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-sm text-zinc-600 hover:text-cyan-600 dark:text-zinc-400 dark:hover:text-cyan-400 transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright Section */}
        <div className="mt-20 flex flex-col items-center justify-between gap-8 border-t border-zinc-200 dark:border-zinc-800 pt-10 sm:flex-row">
          <p className="text-sm text-zinc-500 dark:text-zinc-600">
            © {new Date().getFullYear()} Pixlume Studio. All rights reserved. Built with precision and passion.
          </p>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-tighter text-zinc-400 dark:text-zinc-600">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            System Status: Operational
          </div>
        </div>
      </div>
    </footer>
  );
}
