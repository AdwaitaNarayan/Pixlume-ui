"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-10 w-10 shrink-0" />; // placeholder
  }

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95, rotate: -5 }}
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 ring-1 ring-zinc-200 transition-all hover:bg-zinc-200 dark:bg-zinc-900/50 dark:ring-white/10 dark:hover:bg-zinc-800 dark:hover:ring-white/20 overflow-hidden"
      aria-label="Toggle Theme"
    >
      <AnimatePresence mode="wait">
        <motion.div
            key={currentTheme}
            initial={{ y: 20, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: 45 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex items-center justify-center"
        >
            {currentTheme === "dark" ? (
                <div className="relative">
                    <Sun className="h-5 w-5 text-amber-400 fill-amber-400/20" />
                    <div className="absolute inset-0 blur-md bg-amber-400/40 -z-10 animate-pulse" />
                </div>
            ) : (
                <div className="relative">
                    <Moon className="h-5 w-5 text-cyan-600 fill-cyan-600/10" />
                    <div className="absolute inset-0 blur-md bg-cyan-400/30 -z-10 animate-pulse" />
                </div>
            )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
