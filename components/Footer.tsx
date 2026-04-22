import Link from "next/link";
import { Camera, Instagram } from "lucide-react";
import { motion } from "framer-motion";

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
    <footer className="relative bg-white py-16 dark:bg-zinc-950 sm:py-20 transition-colors duration-300">
      <div className="absolute top-0 left-0 right-0 h-px bg-zinc-100 dark:bg-zinc-900" />
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="grid grid-cols-1 gap-x-16 gap-y-16 lg:grid-cols-12">
          {/* Logo & Info Section */}
          <div className="lg:col-span-6">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <motion.div
                  whileHover={{ rotate: -10, scale: 1.1 }}
                  className="relative z-10 p-2.5 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-2xl shadow-xl shadow-cyan-500/30"
                >
                  <Camera className="w-6 h-6 text-white" />
                </motion.div>
                <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-30 group-hover:opacity-50 transition-opacity rounded-full shadow-cyan-500/50" />
              </div>
              
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter flex items-center gap-1.5 leading-none">
                  <span className="text-zinc-950 dark:text-white transition-colors">Pix</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-indigo-500">lume</span>
                </span>
                <span className="text-[11px] uppercase tracking-[0.3em] font-black text-zinc-400 dark:text-zinc-500 mt-1 leading-none">
                  Studio
                </span>
              </div>
            </Link>

            <p className="mt-8 text-sm leading-7 text-zinc-500 dark:text-zinc-400 max-w-xs">
              Experience digital clarity with the world's most premium photography gallery. Curating breathtaking 4K and 8K visual experiences.
            </p>
            <div className="mt-10">
              <a
                href="https://www.instagram.com/picgallery62/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors shadow-sm group"
              >
                <Instagram className="h-5 w-5 transition-transform group-hover:scale-110" />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title} className="lg:col-span-3">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                {section.title}
              </h3>
              <ul className="mt-8 space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-[13px] font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright Section */}
        <div className="mt-16 border-t border-zinc-100 dark:border-zinc-900 pt-12 text-center">
          <p className="text-[12px] font-medium text-zinc-400 dark:text-zinc-600">
            © {new Date().getFullYear()} Pixlume Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
