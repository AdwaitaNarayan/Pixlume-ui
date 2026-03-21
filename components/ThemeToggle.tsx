"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9, rotate: 15 }}
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 ring-1 ring-zinc-200 transition-all hover:bg-zinc-200 dark:bg-zinc-900/50 dark:ring-white/10 dark:hover:bg-zinc-800 dark:hover:ring-white/20"
      aria-label="Toggle Theme"
      title={currentTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <motion.div
        key={currentTheme}
        initial={{ scale: 0.5, rotate: -180, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "backOut" }}
        className="flex items-center justify-center"
      >
        {currentTheme === "dark" ? (
          <Sun className="h-5 w-5 text-amber-400 fill-amber-400/20" />
        ) : (
          <Moon className="h-5 w-5 text-cyan-600 fill-cyan-600/10" />
        )}
      </motion.div>
    </motion.button>
  );
}
