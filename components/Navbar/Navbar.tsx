'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Camera, Search, User, Menu, X, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../ThemeToggle';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Gallery', href: '/' },
    { name: 'Collections', href: '#collections' },
    { name: 'About', href: '#about' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        scrolled
          ? 'bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 py-2 shadow-sm'
          : 'bg-transparent border-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* ────── LOGO SECTION ────── */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <motion.div
                whileHover={{ rotate: -10, scale: 1.1 }}
                className="relative z-10 p-2 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-xl shadow-lg shadow-cyan-500/20"
              >
                <Camera className="w-5 h-5 text-white" />
              </motion.div>
              {/* Backglow for the logo icon */}
              <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full shadow-cyan-500/50" />
            </div>
            
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight flex items-center gap-1">
                <span className="text-zinc-950 dark:text-white transition-colors">Pix</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-indigo-500">lume</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 dark:text-zinc-500 -mt-1 leading-none transition-colors">
                Studio
              </span>
            </div>
          </Link>

          {/* ────── DESKTOP LINKS ────── */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-white transition-all rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* ────── ACTIONS SECTION ────── */}
          <div className="flex items-center gap-2 sm:gap-3">
             {/* Small screen Search shortcut */}
             <button className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-white transition-colors">
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* User Profile / Admin Link */}
            <Link 
              href="/admin" 
              className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:border-cyan-500/50 transition-all dark:hover:bg-white/10"
            >
              <div className="h-6 w-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors overflow-hidden">
                <User className="w-4 h-4 text-zinc-600 dark:text-zinc-400 group-hover:text-cyan-500 transition-colors" />
              </div>
              <span className="hidden sm:inline text-sm font-bold text-zinc-700 dark:text-zinc-300">Admin</span>
            </Link>

            {/* Separator */}
            <div className="h-6 w-px bg-zinc-200 dark:bg-white/10 mx-1 hidden sm:block" />

            {/* Theme Toggle Component */}
            <ThemeToggle />

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ────── MOBILE DROPDOWN MENU ────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-lg font-bold text-zinc-800 dark:text-zinc-200 hover:text-cyan-500 transition-colors px-2 py-1"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between px-2">
                <span className="text-sm font-medium text-zinc-500">Dark Mode</span>
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
