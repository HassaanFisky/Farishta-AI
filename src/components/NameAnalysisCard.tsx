"use client";

import { motion } from "framer-motion";
import type { NameAnalysisResult } from "@/app/api/name-analysis/route";

interface NameAnalysisCardProps {
  result: NameAnalysisResult;
  name: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.2, 0.9, 0.28, 1] },
  },
};

// ── Shared section card ────────────────────────────────────────────────────
function SectionCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      variants={sectionVariants}
      className="rounded-xl p-5"
      style={{
        background: "#0F2419",
        border: "1px solid rgba(201,168,76,0.18)",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs font-semibold uppercase tracking-widest mb-3"
      style={{ color: "rgba(201,168,76,0.55)", letterSpacing: "0.12em" }}
    >
      {children}
    </p>
  );
}

// ── Confidence badge ───────────────────────────────────────────────────────
function ConfidenceBadge({ level }: { level: string }) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    High: {
      bg: "rgba(27,67,50,0.8)",
      text: "#6fcf97",
      border: "rgba(111,207,151,0.3)",
    },
    Medium: {
      bg: "rgba(201,168,76,0.1)",
      text: "#C9A84C",
      border: "rgba(201,168,76,0.3)",
    },
    Low: {
      bg: "rgba(220,100,80,0.1)",
      text: "#E07060",
      border: "rgba(220,100,80,0.3)",
    },
  };
  const c = colors[level] ?? colors.Medium;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
      style={{ background: c.bg, color: c.text, borderColor: c.border }}
    >
      {level} Confidence
    </span>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function NameAnalysisCard({ result, name }: NameAnalysisCardProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden"
      style={{
        background: "#1B4332",
        border: "1px solid rgba(201,168,76,0.22)",
        boxShadow:
          "0 12px 40px rgba(0,0,0,0.45), 0 0 80px rgba(201,168,76,0.05)",
      }}
    >
      {/* Header */}
      <motion.div
        variants={sectionVariants}
        className="px-6 pt-6 pb-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(201,168,76,0.12)" }}
      >
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ color: "rgba(201,168,76,0.55)" }}
          >
            Name Analysis
          </p>
          <h2
            className="text-2xl font-bold"
            style={{ color: "#C9A84C" }}
          >
            {name}
          </h2>
        </div>
        <ConfidenceBadge level={result.confidence} />
      </motion.div>

      {/* Sections */}
      <div className="p-6 space-y-4">
        {/* 1 — Arabic Root */}
        <SectionCard>
          <SectionLabel>Arabic Root</SectionLabel>
          <p
            className="text-lg font-medium leading-relaxed"
            style={{ color: "#FFFFFF" }}
          >
            {result.arabicRoot}
          </p>
        </SectionCard>

        {/* 2 — Quranic Connection */}
        <SectionCard>
          <SectionLabel>Quranic Connection</SectionLabel>
          <p
            className="arabic-text text-right leading-loose mb-3"
            lang="ar"
            style={{
              fontFamily: "Amiri, Georgia, serif",
              fontSize: "1.4rem",
              color: "#C9A84C",
              direction: "rtl",
            }}
          >
            {result.quranicVerse.arabic}
          </p>
          <p
            className="text-sm leading-relaxed italic mb-2"
            style={{ color: "rgba(255,255,255,0.8)", fontFamily: "Georgia, serif" }}
          >
            &ldquo;{result.quranicVerse.translation}&rdquo;
          </p>
          <p
            className="text-xs"
            style={{ color: "rgba(201,168,76,0.55)" }}
          >
            — {result.quranicVerse.reference}
          </p>
        </SectionCard>

        {/* 3 — Historical Figure */}
        <SectionCard>
          <SectionLabel>A Bearer of This Name</SectionLabel>
          <div className="flex items-start gap-3">
            <div
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-base"
              style={{
                background: "rgba(201,168,76,0.12)",
                border: "1px solid rgba(201,168,76,0.25)",
                color: "#C9A84C",
              }}
            >
              ✦
            </div>
            <div>
              <p className="font-semibold text-base mb-0.5" style={{ color: "#FFFFFF" }}>
                {result.historicalFigure.name}
              </p>
              <p className="text-xs mb-2" style={{ color: "rgba(201,168,76,0.6)" }}>
                {result.historicalFigure.era}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                {result.historicalFigure.description}
              </p>
            </div>
          </div>
        </SectionCard>

        {/* 4 — Name's Wisdom */}
        <SectionCard>
          <SectionLabel>What This Name Calls You Toward</SectionLabel>
          <p
            className="text-base leading-relaxed italic"
            style={{
              fontFamily: "Georgia, serif",
              color: "rgba(255,255,255,0.88)",
              borderLeft: "3px solid rgba(201,168,76,0.4)",
              paddingLeft: "1rem",
            }}
          >
            {result.nameWisdom}
          </p>
        </SectionCard>

        {/* 5 — Prophet SAW at Your Age */}
        <SectionCard
          style={{
            background: "#162E1F",
            borderColor: "rgba(201,168,76,0.3)",
            borderLeftWidth: "3px",
            borderLeftColor: "#C9A84C",
          }}
        >
          <SectionLabel>
            The Prophet ﷺ at Age {result.prophetAtAge.age}
          </SectionLabel>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
            {result.prophetAtAge.event}
          </p>
        </SectionCard>
      </div>

      {/* Footer */}
      <motion.div
        variants={sectionVariants}
        className="px-6 pb-5 text-center"
      >
        <p
          className="text-xs"
          style={{ color: "rgba(201,168,76,0.35)", letterSpacing: "0.06em" }}
        >
          Alhamdulillah — for the beauty carried in your name
        </p>
      </motion.div>
    </motion.div>
  );
}
