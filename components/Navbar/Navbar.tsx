'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Camera, Search, User, Menu, X, Layers, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import ThemeToggle from '../ThemeToggle';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Gallery', href: '/gallery' },
    { name: 'Collections', href: '/#collections' },
    { name: 'About', href: '/#about' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200/50 dark:border-white/5 py-3 shadow-sm'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex items-center justify-between h-12">
          
          {/* ────── LOGO SECTION ────── */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="relative flex items-center justify-center">
              <Camera className="w-5 h-5 text-zinc-900 dark:text-white transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-cyan-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
            </div>
            
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white leading-none">
                Pixlume
              </span>
              <span className="text-[9px] uppercase tracking-[0.4em] font-medium text-zinc-400 dark:text-zinc-500 mt-0.5 leading-none">
                Studio
              </span>
            </div>
          </Link>

          {/* ────── DESKTOP LINKS ────── */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href.includes("#") && pathname === "/");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-all rounded-lg hover:text-zinc-900 dark:hover:text-white ${
                    isActive 
                        ? "text-zinc-950 dark:text-white" 
                        : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {link.name}
                  {isActive && (
                      <motion.div 
                        layoutId="nav-active" 
                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-zinc-900 dark:bg-white rounded-full"
                      />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ────── ACTIONS SECTION ────── */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
