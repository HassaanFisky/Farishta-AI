"use client";

import { motion } from "framer-motion";
import { Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed top-6 right-6 w-11 h-11 rounded-full glass-surface border border-white/10 flex items-center justify-center z-50"
      whileHover={{ scale: 1.08, boxShadow: "0 8px 24px var(--accent-glow)" }}
      whileTap={{ scale: 0.985, transition: { duration: 0.044 } }}
      transition={{ duration: 0.16, ease: [0.34, 1.56, 0.64, 1] }}
      aria-label="Toggle theme"
    >
      <motion.div
        key={theme} // Key triggers re-animation on change
        initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.3, ease: "backOut" }}
      >
        {theme === "noor" && (
          <Sun className="w-5 h-5" style={{ color: "var(--gold-primary)" }} />
        )}
        {theme === "layl" && (
          <Moon className="w-5 h-5" style={{ color: "var(--gold-primary)" }} />
        )}
        {theme === "adn" && (
          <Sparkles className="w-5 h-5" style={{ color: "var(--gold-rich)" }} />
        )}
        {/* Fallback */}
        {theme === "light" && (
          <Sun className="w-5 h-5" style={{ color: "var(--gold-primary)" }} />
        )}
        {theme === "dark" && (
          <Moon className="w-5 h-5" style={{ color: "var(--gold-primary)" }} />
        )}
      </motion.div>
    </motion.button>
  );
}
