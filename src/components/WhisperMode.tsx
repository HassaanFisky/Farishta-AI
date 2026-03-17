"use client";

import { motion } from "framer-motion";

interface WhisperModeProps {
  arabic: string;
  translation: string;
  reference: string;
}

export default function WhisperMode({
  arabic,
  translation,
  reference,
}: WhisperModeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.2, 0.9, 0.28, 1] }}
      className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden relative"
      style={{
        background: "#0F2419",
        border: "1px solid rgba(201,168,76,0.25)",
        boxShadow:
          "0 0 60px rgba(201,168,76,0.08), 0 20px 40px rgba(0,0,0,0.4)",
      }}
    >
      {/* Gold ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 px-8 py-12 flex flex-col items-center gap-8">
        {/* Arabic text */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="arabic-text text-center leading-loose"
          lang="ar"
          style={{
            fontFamily: "Amiri, Georgia, serif",
            fontSize: "2rem",
            color: "#C9A84C",
            letterSpacing: "0.04em",
            direction: "rtl",
            lineHeight: "2",
          }}
        >
          {arabic}
        </motion.p>

        {/* Gold divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.45, duration: 0.5, ease: [0.2, 0.9, 0.28, 1] }}
          style={{
            height: "1px",
            width: "80px",
            background:
              "linear-gradient(90deg, transparent, rgba(201,168,76,0.7), transparent)",
          }}
        />

        {/* English translation */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="text-center"
          style={{
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            fontSize: "1.1rem",
            lineHeight: "1.8",
            color: "rgba(255,255,255,0.88)",
            maxWidth: "520px",
          }}
        >
          &ldquo;{translation}&rdquo;
        </motion.p>

        {/* Reference */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.5 }}
          className="text-center"
          style={{
            fontSize: "0.8rem",
            letterSpacing: "0.08em",
            color: "rgba(201,168,76,0.55)",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          — {reference}
        </motion.p>
      </div>
    </motion.div>
  );
}
