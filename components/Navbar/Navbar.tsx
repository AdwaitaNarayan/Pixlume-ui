'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Camera, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import ThemeToggle from '../ThemeToggle';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Collections', href: '/#collections' },
    { name: 'About', href: '/#about' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-zinc-200 dark:border-zinc-800 shadow-sm'
          : 'bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm border-transparent'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <motion.div
                whileHover={{ rotate: -10, scale: 1.1 }}
                className="relative z-10 p-2.5 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-2xl shadow-xl shadow-cyan-500/30"
              >
                <Camera className="w-6 h-6 text-white" />
              </motion.div>
              {/* Backglow for the logo icon */}
              <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-30 group-hover:opacity-50 transition-opacity rounded-full shadow-cyan-500/50" />
            </div>
            
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter flex items-center gap-1.5 leading-none">
                <span className="text-zinc-950 dark:text-white">Pix</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-indigo-500">lume</span>
              </span>
              <span className="text-[11px] uppercase tracking-[0.3em] font-black text-zinc-400 dark:text-zinc-500 mt-1 leading-none">
                Studio
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2 space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href === '/#collections' && pathname === '/') || (link.href === '/#about' && pathname === '/');
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 text-[13px] font-bold transition-all rounded-full ${
                    isActive 
                      ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10" 
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-zinc-600 dark:text-zinc-300"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-xl font-medium text-zinc-900 dark:text-zinc-100"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-500">Theme</span>
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
