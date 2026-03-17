"use client";

import { motion } from "framer-motion";

interface ModeIndicatorProps {
  mode: "education" | "defense" | "ethics";
}

const MODE_CONFIG = {
  education: {
    label: "✦ Education",
    borderColor: "rgba(201,168,76,0.6)",
    background: "rgba(201,168,76,0.08)",
    color: "#C9A84C",
  },
  defense: {
    label: "⚔ Defense",
    borderColor: "rgba(220,100,80,0.5)",
    background: "rgba(220,100,80,0.08)",
    color: "#E07060",
  },
  ethics: {
    label: "⚖ Ethics",
    borderColor: "rgba(201,168,76,0.4)",
    background: "rgba(201,168,76,0.06)",
    color: "#C9A84C",
  },
} as const;

export default function ModeIndicator({ mode }: ModeIndicatorProps) {
  const config = MODE_CONFIG[mode] ?? MODE_CONFIG.education;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.28, ease: [0.2, 0.9, 0.28, 1] }}
    >
      <span
        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide border"
        style={{
          borderColor: config.borderColor,
          background: config.background,
          color: config.color,
          letterSpacing: "0.05em",
        }}
      >
        {config.label}
      </span>
    </motion.div>
  );
}
