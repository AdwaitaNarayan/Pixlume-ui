'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Camera, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import ThemeToggle from '../ThemeToggle';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Gallery', href: '/gallery' },
    { name: 'Collections', href: '/#collections' },
    { name: 'About', href: '/#about' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/gallery?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery('');
    setSearchFocused(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-[#0f0f0f]/95 backdrop-blur-xl shadow-sm border-b border-zinc-100 dark:border-white/5'
          : 'bg-white dark:bg-[#0f0f0f]'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 h-16">

          {/* ── LOGO ── */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center transition-transform group-hover:scale-95">
              <Camera className="w-4 h-4 text-white dark:text-zinc-900" />
            </div>
            <span className="text-[17px] font-bold tracking-tight text-zinc-900 dark:text-white hidden sm:block">
              Pixlume
            </span>
          </Link>

          {/* ── CENTERED SEARCH BAR ── */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-2xl mx-auto"
          >
            <div
              className={`flex items-center gap-3 rounded-full px-4 py-2.5 transition-all duration-200 ${
                searchFocused
                  ? 'bg-white dark:bg-zinc-800 ring-2 ring-zinc-900/10 dark:ring-white/10 shadow-md'
                  : 'bg-zinc-100 dark:bg-zinc-800/60 hover:bg-zinc-200/70 dark:hover:bg-zinc-800'
              }`}
            >
              <Search className={`shrink-0 transition-colors duration-200 ${searchFocused ? 'w-4 h-4 text-zinc-900 dark:text-white' : 'w-4 h-4 text-zinc-400'}`} />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search high-quality images..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="flex-1 bg-transparent text-sm font-medium text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 outline-none min-w-0"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>

          {/* ── DESKTOP NAV LINKS ── */}
          <div className="hidden md:flex items-center gap-1 shrink-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-zinc-900 dark:text-white bg-zinc-100 dark:bg-white/10'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* ── RIGHT ACTIONS ── */}
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="md:hidden border-t border-zinc-100 dark:border-white/5 bg-white dark:bg-[#0f0f0f]"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white transition-all"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-3 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between px-4">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Dark Mode</span>
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
