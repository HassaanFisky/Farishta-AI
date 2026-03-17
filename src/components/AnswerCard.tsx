"use client";

import { motion } from "framer-motion";
import { variants } from "@/lib/motion";
import SourceCitation from "./SourceCitation";
import FidelityBadge from "./FidelityBadge";
import NoFatwaNotice from "./NoFatwaNotice";
import ReactMarkdown from "react-markdown";

interface Citation {
  type: "quran" | "hadith";
  title: string;
  reference: string;
  text: string;
  arabic?: string;
}

interface AnswerCardProps {
  answer: string;
  citations?: Citation[];
  isFatwaQuery?: boolean;
}

export default function AnswerCard({
  answer,
  citations,
  isFatwaQuery,
}: AnswerCardProps) {
  return (
    <motion.div
      variants={variants.answerContainer}
      initial="hidden"
      animate="visible"
      className="w-full max-w-3xl mx-auto"
    >
      <motion.div
        className="rounded-2xl border border-white/4 p-6 transition-all duration-medium"
        style={{
          background: "var(--card)",
          boxShadow:
            "0 10px 30px rgba(2,6,23,0.48), 0 0 60px var(--accent-glow)",
        }}
        whileHover={{
          y: -4,
          boxShadow:
            "0 14px 40px rgba(2,6,23,0.56), 0 0 80px var(--accent-glow)",
        }}
      >
        <motion.div
          variants={variants.answerItem}
          className="mb-4 flex items-center justify-between"
        >
          <h3
            className="text-xl font-semibold"
            style={{ color: "var(--gold-primary)" }}
          >
            Answer
          </h3>
          {citations && citations.length > 0 && <FidelityBadge />}
        </motion.div>

        {isFatwaQuery && (
          <motion.div variants={variants.answerItem} className="mb-4">
            <NoFatwaNotice />
          </motion.div>
        )}

        <motion.div
          variants={variants.answerItem}
          className="prose prose-invert max-w-none prose-p:leading-relaxed prose-p:text-text-primary"
        >
          <div style={{ color: "var(--text-primary)" }}>
            <ReactMarkdown>{answer}</ReactMarkdown>
          </div>
        </motion.div>

        {citations && citations.length > 0 && (
          <motion.div variants={variants.answerItem}>
            <SourceCitation citations={citations} />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
