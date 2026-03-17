"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useState } from "react";
import { tactilePress, tactileRelease } from "@/lib/motion";

interface AskBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function AskBox({
  value,
  onChange,
  onSubmit,
  isLoading,
}: AskBoxProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.48, ease: [0.2, 0.9, 0.28, 1] }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="relative group">
        <motion.div
          className="glass-surface rounded-xl border p-4 transition-all duration-medium relative"
          animate={{
            borderColor: isFocused
              ? "var(--gold-rich)"
              : "rgba(255,255,255,0.06)",
            y: isFocused ? -2 : 0,
          }}
          style={{
            boxShadow: isFocused ? "0 6px 24px var(--accent-glow)" : "none",
          }}
        >
          {isFocused && (
            <motion.div
              className="absolute inset-0 rounded-xl pointer-events-none"
              animate={{ opacity: [0.06, 0.16, 0.06] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                boxShadow: "0 0 20px 4px var(--accent-glow)",
              }}
            />
          )}
          <div className="flex items-end gap-3 relative z-10">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ask about Quran, Hadith, or Islamic guidance..."
              className="flex-1 bg-transparent outline-none text-base placeholder:text-muted-text min-h-[56px] py-4"
              style={{ color: "var(--text-primary)" }}
              disabled={isLoading}
            />
            <motion.button
              onClick={onSubmit}
              disabled={isLoading || !value.trim()}
              className="rounded-full px-6 py-3 font-medium text-sm transition-all duration-fast disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background:
                  "linear-gradient(135deg, var(--gold-primary), var(--gold-rich))",
                color: "var(--bg)",
                boxShadow: "0 4px 16px rgba(246,217,114,0.24)",
              }}
              whileHover={{
                y: -2,
                boxShadow: "0 8px 24px rgba(246,217,114,0.32)",
              }}
              whileTap={tactilePress}
              transition={{ duration: 0.16 }}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5"
                >
                  ⟳
                </motion.div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </motion.div>
        <motion.div
          className="absolute -bottom-6 left-0 right-0 text-xs text-center"
          style={{ color: "var(--muted-text)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Sourced from Quran & Sahih Hadith
        </motion.div>
      </div>
    </motion.div>
  );
}
