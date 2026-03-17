"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Download, Copy, Check } from "lucide-react";

interface WisdomCardProps {
  arabic?: string;
  wisdom: string;
  reference: string;
}

export default function WisdomCard({ arabic, wisdom, reference }: WisdomCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // ── Download as PNG ────────────────────────────────────────────────────────
  const handleDownload = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);

    try {
      // Dynamic import — works once `npm install` is run after freeing disk space
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#1B4332",
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `farishta-wisdom-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      // Fallback: open card in a print-friendly window
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Farishta AI — Wisdom Card</title>
              <style>
                body { margin: 0; background: #1B4332; display: flex;
                       justify-content: center; align-items: center;
                       min-height: 100vh; }
              </style>
            </head>
            <body>${cardRef.current?.outerHTML ?? ""}</body>
          </html>
        `);
        printWindow.print();
      }
    } finally {
      setDownloading(false);
    }
  };

  // ── Copy to clipboard ──────────────────────────────────────────────────────
  const handleCopy = async () => {
    const text = arabic
      ? `${arabic}\n\n"${wisdom}"\n\n— ${reference}\n\nFarishta AI • Truth. One step at a time.`
      : `"${wisdom}"\n\n— ${reference}\n\nFarishta AI • Truth. One step at a time.`;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.9, 0.28, 1] }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* ── The shareable card ─────────────────────────────────────────────── */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: "#1B4332",
          border: "2px solid rgba(201,168,76,0.35)",
          boxShadow: "inset 0 0 60px rgba(201,168,76,0.04)",
          padding: "40px 36px",
        }}
      >
        {/* Corner accents */}
        {(["top-left", "top-right", "bottom-left", "bottom-right"] as const).map(
          (corner) => (
            <div
              key={corner}
              className="absolute w-6 h-6"
              style={{
                ...(corner.includes("top") ? { top: 8 } : { bottom: 8 }),
                ...(corner.includes("left") ? { left: 8 } : { right: 8 }),
                borderTop: corner.includes("top")
                  ? "1.5px solid rgba(201,168,76,0.5)"
                  : undefined,
                borderBottom: corner.includes("bottom")
                  ? "1.5px solid rgba(201,168,76,0.5)"
                  : undefined,
                borderLeft: corner.includes("left")
                  ? "1.5px solid rgba(201,168,76,0.5)"
                  : undefined,
                borderRight: corner.includes("right")
                  ? "1.5px solid rgba(201,168,76,0.5)"
                  : undefined,
              }}
            />
          )
        )}

        {/* Logo + brand */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="relative w-10 h-10">
            <Image
              src="/assets/logos/Farista-AI-LOGO-main.png"
              alt="Farishta AI"
              fill
              className="object-contain"
            />
          </div>
          <p
            className="text-sm font-semibold tracking-wide"
            style={{ color: "#C9A84C", letterSpacing: "0.1em" }}
          >
            Farishta AI
          </p>
        </div>

        {/* Arabic text */}
        {arabic && (
          <p
            className="text-center leading-loose mb-4"
            lang="ar"
            style={{
              fontFamily: "Amiri, Georgia, serif",
              fontSize: "1.6rem",
              color: "#C9A84C",
              direction: "rtl",
              lineHeight: "2",
            }}
          >
            {arabic}
          </p>
        )}

        {/* Divider */}
        <div
          className="mx-auto mb-5"
          style={{
            height: "1px",
            width: "60px",
            background:
              "linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent)",
          }}
        />

        {/* Wisdom text */}
        <p
          className="text-center leading-relaxed mb-4"
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "1rem",
            color: "rgba(255,255,255,0.9)",
            lineHeight: "1.85",
          }}
        >
          &ldquo;{wisdom}&rdquo;
        </p>

        {/* Reference */}
        <p
          className="text-center mb-6"
          style={{
            fontSize: "0.78rem",
            color: "rgba(201,168,76,0.55)",
            letterSpacing: "0.06em",
          }}
        >
          — {reference}
        </p>

        {/* Tagline */}
        <p
          className="text-center"
          style={{
            fontSize: "0.72rem",
            color: "rgba(201,168,76,0.4)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Truth. One step at a time.
        </p>
      </div>

      {/* ── Action buttons ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <motion.button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #C9A84C, #a8893e)",
            color: "#0F2419",
          }}
          whileHover={{ y: -1, boxShadow: "0 6px 20px rgba(201,168,76,0.3)" }}
          whileTap={{ scale: 0.96 }}
        >
          <Download className="w-3.5 h-3.5" />
          {downloading ? "Saving…" : "Download PNG"}
        </motion.button>

        <motion.button
          onClick={handleCopy}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold border transition-all"
          style={{
            borderColor: "rgba(201,168,76,0.35)",
            background: "rgba(201,168,76,0.06)",
            color: "#C9A84C",
          }}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.96 }}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy Text
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
