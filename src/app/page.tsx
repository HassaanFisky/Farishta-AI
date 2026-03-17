"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";
import AskBox from "@/components/AskBox";
import AnswerCard from "@/components/AnswerCard";
import ModeIndicator from "@/components/ModeIndicator";
import WhisperMode from "@/components/WhisperMode";
import NameAnalysisCard from "@/components/NameAnalysisCard";
import WisdomCard from "@/components/WisdomCard";
import type { NameAnalysisResult } from "@/app/api/name-analysis/route";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface Citation {
  type: "quran" | "hadith";
  title: string;
  reference: string;
  text: string;
  arabic?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Suggested queries — mode-coded
// ─────────────────────────────────────────────────────────────────────────────
const SUGGESTED_QUERIES: {
  label: string;
  mode: "education" | "defense" | "ethics";
}[] = [
  { label: "Virtues of patience in Islam", mode: "education" },
  { label: "How to attain concentration in Salah?", mode: "education" },
  { label: "Can science disprove God?", mode: "defense" },
  { label: "I'm facing a hard decision — what should I do?", mode: "ethics" },
];

const MODE_QUERY_STYLES: Record<
  "education" | "defense" | "ethics",
  { borderColor: string; color: string }
> = {
  education: {
    borderColor: "rgba(201,168,76,0.25)",
    color: "rgba(201,168,76,0.7)",
  },
  defense: {
    borderColor: "rgba(220,100,80,0.2)",
    color: "rgba(220,100,80,0.65)",
  },
  ethics: {
    borderColor: "rgba(201,168,76,0.18)",
    color: "rgba(201,168,76,0.55)",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function Page() {
  // ── Existing state ─────────────────────────────────────────────────────────
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [citations, setCitations] = useState<Citation[]>([]);
  const [isFatwaQuery, setIsFatwaQuery] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ── New state ──────────────────────────────────────────────────────────────
  const [mode, setMode] = useState<"education" | "defense" | "ethics">(
    "education"
  );
  const [isWhisperMode, setIsWhisperMode] = useState(false);
  const [whisperArabic, setWhisperArabic] = useState("");
  const [whisperTranslation, setWhisperTranslation] = useState("");
  const [whisperReference, setWhisperReference] = useState("");

  // Name analysis
  const [nameOpen, setNameOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [ageInput, setAgeInput] = useState("");
  const [nameResult, setNameResult] = useState<NameAnalysisResult | null>(null);
  const [nameLoading, setNameLoading] = useState(false);
  const [nameError, setNameError] = useState("");

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleAsk = async (explicitQuery?: string) => {
    const activeQuery = explicitQuery || query;
    if (!activeQuery.trim() || isLoading) return;

    setIsLoading(true);
    setAnswer("");
    setCitations([]);
    setIsFatwaQuery(false);
    setIsWhisperMode(false);
    setWhisperArabic("");
    setWhisperTranslation("");
    setWhisperReference("");

    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: activeQuery }),
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setAnswer(data.answer || "No answer received.");
      setCitations(data.citations || []);
      setIsFatwaQuery(data.isFatwaQuery || false);

      // New fields
      const resolvedMode = (["education", "defense", "ethics"] as const).includes(
        data.mode
      )
        ? (data.mode as "education" | "defense" | "ethics")
        : "education";
      setMode(resolvedMode);
      setIsWhisperMode(!!data.isWhisperMode);

      if (data.isWhisperMode) {
        // Prefer dedicated whisper fields; fall back to first citation
        const firstCitation = data.citations?.[0];
        setWhisperArabic(
          data.whisperArabic || firstCitation?.arabic || ""
        );
        setWhisperTranslation(
          data.whisperTranslation || firstCitation?.text || ""
        );
        setWhisperReference(
          data.whisperReference || firstCitation?.reference || ""
        );
      }
    } catch {
      setAnswer("An error occurred. Please try again.");
      setCitations([]);
      setIsFatwaQuery(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameAnalysis = async () => {
    if (!nameInput.trim() || !ageInput.trim() || nameLoading) return;

    const age = parseInt(ageInput, 10);
    if (isNaN(age) || age < 1 || age > 120) {
      setNameError("Please enter a valid age between 1 and 120.");
      return;
    }

    setNameLoading(true);
    setNameResult(null);
    setNameError("");

    try {
      const response = await fetch("/api/name-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameInput.trim(), age }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setNameError(data.error || "Unable to analyze name. Please try again.");
        return;
      }

      setNameResult(data.result);
    } catch {
      setNameError("Network error. Please try again.");
    } finally {
      setNameLoading(false);
    }
  };

  // ── Wisdom card visibility ──────────────────────────────────────────────────
  // Show WisdomCard if there's a Quranic verse with text
  const wisdomCitation = citations.find(
    (c) => c.type === "quran" && c.text && c.text !== "Referenced in response above"
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-6 py-16">
      {/* Background radial */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        style={{
          background:
            "radial-gradient(circle at 50% 50%, var(--surface-elevated) 0%, var(--bg) 60%)",
        }}
      />

      {/* Starfield */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-30"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20% 30%, rgba(246,217,114,0.08) 0%, transparent 50%), radial-gradient(1px 1px at 60% 70%, rgba(246,217,114,0.06) 0%, transparent 50%), radial-gradient(2px 2px at 50% 50%, rgba(246,217,114,0.04) 0%, transparent 50%)",
          backgroundSize: "200% 200%",
        }}
      />

      <div className="w-full max-w-5xl z-10 space-y-12">
        <Logo />

        {/* ── Ask box + suggestions ───────────────────────────────────────── */}
        <div className="space-y-6">
          <AskBox
            value={query}
            onChange={setQuery}
            onSubmit={() => handleAsk()}
            isLoading={isLoading}
          />

          {/* ── Name Analysis section ─────────────────────────────────────── */}
          <div className="w-full max-w-3xl mx-auto">
            {/* Toggle button */}
            <div className="flex justify-center">
              <motion.button
                onClick={() => setNameOpen((v) => !v)}
                className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold border transition-all"
                style={{
                  borderColor: nameOpen
                    ? "rgba(201,168,76,0.45)"
                    : "rgba(201,168,76,0.2)",
                  background: nameOpen
                    ? "rgba(201,168,76,0.08)"
                    : "transparent",
                  color: nameOpen
                    ? "#C9A84C"
                    : "rgba(201,168,76,0.55)",
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>Analyze My Name ✦</span>
                <motion.span
                  animate={{ rotate: nameOpen ? 180 : 0 }}
                  transition={{ duration: 0.24 }}
                  style={{ display: "inline-block" }}
                >
                  ▾
                </motion.span>
              </motion.button>
            </div>

            {/* Collapsible panel */}
            <AnimatePresence>
              {nameOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.36, ease: [0.2, 0.9, 0.28, 1] }}
                  className="overflow-hidden"
                >
                  <div
                    className="mt-4 rounded-xl p-5 space-y-4"
                    style={{
                      background: "#0F2419",
                      border: "1px solid rgba(201,168,76,0.18)",
                    }}
                  >
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        placeholder="Your name (e.g. Ibrahim)"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleNameAnalysis()
                        }
                        className="flex-1 px-4 py-3 rounded-lg text-sm outline-none placeholder:opacity-40"
                        style={{
                          background: "#162E1F",
                          border: "1px solid rgba(201,168,76,0.22)",
                          color: "#FFFFFF",
                        }}
                        disabled={nameLoading}
                      />
                      <input
                        type="number"
                        placeholder="Your age"
                        value={ageInput}
                        onChange={(e) => setAgeInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleNameAnalysis()
                        }
                        className="w-full sm:w-28 px-4 py-3 rounded-lg text-sm outline-none placeholder:opacity-40"
                        style={{
                          background: "#162E1F",
                          border: "1px solid rgba(201,168,76,0.22)",
                          color: "#FFFFFF",
                        }}
                        min={1}
                        max={120}
                        disabled={nameLoading}
                      />
                      <motion.button
                        onClick={handleNameAnalysis}
                        disabled={
                          nameLoading ||
                          !nameInput.trim() ||
                          !ageInput.trim()
                        }
                        className="px-6 py-3 rounded-lg text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                        style={{
                          background:
                            "linear-gradient(135deg, #C9A84C, #a8893e)",
                          color: "#0F2419",
                        }}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {nameLoading ? (
                          <motion.span
                            animate={{ opacity: [1, 0.4, 1] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                          >
                            Seeking…
                          </motion.span>
                        ) : (
                          "Reveal ✦"
                        )}
                      </motion.button>
                    </div>

                    {/* Error state */}
                    {nameError && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs"
                        style={{ color: "#E07060" }}
                      >
                        {nameError}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Name Analysis Result */}
          <AnimatePresence>
            {nameResult && nameInput && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", damping: 20 }}
              >
                <NameAnalysisCard result={nameResult} name={nameInput} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Suggested queries */}
          {!answer && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap justify-center gap-3 pt-4"
            >
              {SUGGESTED_QUERIES.map((q, i) => {
                const styles = MODE_QUERY_STYLES[q.mode];
                return (
                  <motion.button
                    key={i}
                    onClick={() => {
                      setQuery(q.label);
                      handleAsk(q.label);
                    }}
                    className="px-4 py-2 rounded-full glass-surface border text-xs font-medium transition-colors"
                    style={{
                      borderColor: styles.borderColor,
                      color: styles.color,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {q.label}
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* ── Answer area ──────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {(answer || isWhisperMode) && (
            <motion.div
              key={isWhisperMode ? "whisper" : "answer"}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", damping: 20 }}
              className="space-y-6"
            >
              {/* Whisper Mode — full-width ayah only */}
              {isWhisperMode && (whisperArabic || whisperTranslation) ? (
                <WhisperMode
                  arabic={whisperArabic}
                  translation={whisperTranslation}
                  reference={whisperReference}
                />
              ) : (
                /* Normal answer */
                answer && (
                  <div className="relative">
                    {/* Mode indicator — top right of card */}
                    <div className="absolute -top-3.5 right-4 z-20">
                      <ModeIndicator mode={mode} />
                    </div>
                    <AnswerCard
                      answer={answer}
                      citations={citations}
                      isFatwaQuery={isFatwaQuery}
                    />
                  </div>
                )
              )}

              {/* WisdomCard — shown when a Quranic verse with real text is present */}
              {!isWhisperMode && wisdomCitation && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <WisdomCard
                    arabic={wisdomCitation.arabic}
                    wisdom={wisdomCitation.text}
                    reference={wisdomCitation.reference}
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-xs pt-12"
          style={{ color: "var(--muted-text)" }}
        >
          <div className="flex items-center justify-center gap-4 mb-4 opacity-50">
            <div className="h-[1px] w-12 bg-current"></div>
            <span>Verified Sources Only</span>
            <div className="h-[1px] w-12 bg-current"></div>
          </div>
          <p>Farishta AI • Guided by Quran & Sahih Hadith • v3.0.0</p>
        </motion.footer>
      </div>
    </main>
  );
}
