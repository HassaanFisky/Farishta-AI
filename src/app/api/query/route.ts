import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface Citation {
  type: "quran" | "hadith";
  title: string;
  reference: string;
  text: string;
  arabic?: string;
}

interface ParsedResponse {
  answer: string;
  citations: Citation[];
  whisperArabic?: string;
  whisperTranslation?: string;
  whisperReference?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM PROMPT — Farishta AI v3
// ─────────────────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Farishta AI — an angelic mentor guiding every human
toward truth, one step at a time. You serve ALL humanity.

INTERNAL THINKING PROTOCOL (never shown to user):
Before every answer, silently:
1. What is the user REALLY asking beneath the surface?
2. Which mode — Education / Defense / Ethics?
3. Most authentic source?
4. Build step by step. Verify logic before speaking.

RESPONSE STRUCTURE (always this exact order):
Step 1 — Repeat the question clearly in one sentence.
Step 2 — Quote most authentic source:
          Arabic text + English translation + reference.
Step 3 — Logical and scientific explanation if applicable.
Step 4 — Step-by-step discovery path. Guide, never dump.
Step 5 — Conclusion: simple, powerful, no pressure.
         End: Source | Confidence: High/Medium/Low
         + Scholar note if opinions differ.

STYLE RULES:
- Lead with non-Muslim intellectual testimony when defending Islam
- Never mention any scholar by name in outputs
- Uncertain? Say "scholars differ — consult a qualified aalim"
- Never issue fatwa. Never replace a scholar.
- For non-Muslims: universal framing, zero religious pressure
- Calm. Wise. Real. Never preachy. Never arrogant.

MODES:
Education: neutral, clear Islamic knowledge
Defense: doubts, atheist arguments, interfaith — logical
Ethics: real-life moral decisions with guidance

DISCLAIMER (every new session start):
"Farishta AI is an educational tool only.
It does not replace a qualified Islamic scholar.
For personal rulings, please consult a certified aalim."

HARD RULES (never bypass):
Reject: extremism, sectarianism, political manipulation,
fake claims, violence, hatred.
Always: mercy, justice, humility, source transparency.

MANDATORY OUTPUT FORMAT — respond with valid JSON ONLY:
{
  "answer": "Your comprehensive answer following the 5-step structure",
  "citations": [
    {
      "type": "quran",
      "title": "Surah Name",
      "reference": "Surah X:Verse Y",
      "text": "English translation",
      "arabic": "Arabic text"
    },
    {
      "type": "hadith",
      "title": "Brief hadith description",
      "reference": "Sahih Bukhari Volume X, Book Y, Hadith Z",
      "text": "Hadith translation"
    }
  ]
}

IMPORTANT: Always include at least one citation. Return valid, parseable JSON only.`;

// ─────────────────────────────────────────────────────────────────────────────
// WHISPER PROMPT — for users expressing pain or despair
// ─────────────────────────────────────────────────────────────────────────────
const WHISPER_PROMPT = `You are Farishta AI. Someone is reaching out to you in pain.
They need one thing only: a single Quranic verse that speaks directly to their heart.

Choose the most comforting, hope-giving verse for their state.
No analysis. No steps. No long answer. Just the verse. Let it land.

Return ONLY this exact JSON — nothing else:
{
  "answer": "",
  "citations": [
    {
      "type": "quran",
      "title": "Surah Name",
      "reference": "Surah Name X:Y",
      "text": "English translation — chosen for maximum comfort and hope",
      "arabic": "Arabic text of the verse"
    }
  ],
  "whisperArabic": "Arabic text of the verse",
  "whisperTranslation": "English translation",
  "whisperReference": "Surah Name X:Y"
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function extractCitationsFallback(text: string): Citation[] {
  const citations: Citation[] = [];

  const quranPattern =
    /(?:Surah|Surat)\s+(?:(?:Al-)?([A-Z][a-z]+(?:-[A-Z][a-z]+)?))\s+(\d+):(\d+)/gi;
  let match;
  while ((match = quranPattern.exec(text)) !== null) {
    citations.push({
      type: "quran",
      title: match[1] || "Quran",
      reference: `${match[1]} ${match[2]}:${match[3]}`,
      text: "Referenced in response above",
    });
  }

  const hadithPattern =
    /Sahih\s+(Bukhari|Muslim)(?:\s+(?:Volume|Vol\.?)\s+(\d+))?(?:,?\s+(?:Book|Bk\.?)\s+(\d+))?(?:,?\s+(?:Hadith|Num\.?)\s+(\d+))?/gi;
  while ((match = hadithPattern.exec(text)) !== null) {
    const collection = match[1];
    const volume = match[2] || "";
    const book = match[3] || "";
    const number = match[4] || "";
    const refParts = [collection];
    if (volume) refParts.push(`Vol. ${volume}`);
    if (book) refParts.push(`Book ${book}`);
    if (number) refParts.push(`Hadith ${number}`);
    citations.push({
      type: "hadith",
      title: `${collection} Collection`,
      reference: refParts.join(", "),
      text: "Referenced in response above",
    });
  }

  return citations.filter(
    (c, i, self) => i === self.findIndex((x) => x.reference === c.reference)
  );
}

function normalizeResponse(parsed: Record<string, unknown>): ParsedResponse {
  const answer = typeof parsed.answer === "string" ? parsed.answer : "";
  const rawCitations = Array.isArray(parsed.citations) ? parsed.citations : [];
  const citations: Citation[] = rawCitations.map((c: Record<string, unknown>) => ({
    type: c.type === "quran" ? "quran" : ("hadith" as const),
    title: typeof c.title === "string" ? c.title : "",
    reference: typeof c.reference === "string" ? c.reference : "",
    text: typeof c.text === "string" ? c.text : "",
    arabic: typeof c.arabic === "string" ? c.arabic : undefined,
  }));

  return {
    answer,
    citations,
    whisperArabic:
      typeof parsed.whisperArabic === "string" ? parsed.whisperArabic : undefined,
    whisperTranslation:
      typeof parsed.whisperTranslation === "string"
        ? parsed.whisperTranslation
        : undefined,
    whisperReference:
      typeof parsed.whisperReference === "string"
        ? parsed.whisperReference
        : undefined,
  };
}

function parseGeminiResponse(text: string): ParsedResponse {
  // Try JSON inside markdown code fence
  const fenceMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (fenceMatch) {
    try {
      return normalizeResponse(JSON.parse(fenceMatch[1]));
    } catch {
      // fall through
    }
  }

  // Try extracting raw JSON object from text
  const objectMatch = text.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    try {
      return normalizeResponse(JSON.parse(objectMatch[0]));
    } catch {
      // fall through
    }
  }

  // Try parsing full text as JSON
  try {
    return normalizeResponse(JSON.parse(text));
  } catch {
    // fall through
  }

  // Final fallback — return raw text with regex-extracted citations
  return {
    answer: text,
    citations: extractCitationsFallback(text),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// POST Handler
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        answer:
          "Farishta AI is currently in peaceful standby. Please configure the GEMINI_API_KEY to enable divine guidance.",
        citations: [],
        isFatwaQuery: false,
        mode: "education",
        isWhisperMode: false,
      });
    }

    // ── Mode detection ────────────────────────────────────────────────────────
    const defenseWords = [
      "prove", "wrong", "atheist", "contradict",
      "science vs", "debate", "argument", "false", "why islam",
      "disprove", "against islam", "refute",
    ];
    const ethicsWords = [
      "should i", "is it okay", "my situation",
      "i am facing", "what do i do", "decision", "problem",
      "is it permissible", "can i", "advice",
    ];
    const whisperWords = [
      "tired", "lost", "hopeless", "scared",
      "alone", "sad", "broken", "thak gaya", "haar gaya",
      "kho gaya", "feel empty", "no point", "give up",
    ];

    const lowerPrompt = prompt.toLowerCase();
    const isWhisperMode = whisperWords.some((w) => lowerPrompt.includes(w));
    const mode = defenseWords.some((w) => lowerPrompt.includes(w))
      ? "defense"
      : ethicsWords.some((w) => lowerPrompt.includes(w))
      ? "ethics"
      : "education";

    // ── Fatwa detection ───────────────────────────────────────────────────────
    const fatwaKeywords = [
      "fatwa", "ruling", "halal", "haram", "permissible",
      "allowed", "forbidden", "sharia", "permissibility",
    ];
    const isFatwaQuery = fatwaKeywords.some((k) => lowerPrompt.includes(k));

    // ── Build prompts ─────────────────────────────────────────────────────────
    const systemPrompt = isWhisperMode ? WHISPER_PROMPT : SYSTEM_PROMPT;
    const enhancedPrompt = isWhisperMode
      ? `${prompt}\n\nReturn only one comforting Quranic verse in the specified JSON format.`
      : `${prompt}\n\nRespond in valid JSON format with "answer" and "citations" fields as specified. Active mode: ${mode}.`;

    // ── Gemini call ───────────────────────────────────────────────────────────
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(enhancedPrompt);
    const rawText = result.response.text();

    const { answer, citations, whisperArabic, whisperTranslation, whisperReference } =
      parseGeminiResponse(rawText);

    console.log(
      `[Farishta AI] mode=${mode} whisper=${isWhisperMode} citations=${citations.length}`
    );

    return NextResponse.json({
      answer,
      citations,
      isFatwaQuery,
      mode,
      isWhisperMode,
      whisperArabic,
      whisperTranslation,
      whisperReference,
    });
  } catch (error) {
    console.error("[Farishta AI] API Error:", error);
    return NextResponse.json(
      {
        error: "An error occurred while seeking guidance. Please try again.",
        answer:
          "I encountered a difficulty while processing your request. Please try rephrasing your question.",
        citations: [],
        isFatwaQuery: false,
        mode: "education",
        isWhisperMode: false,
      },
      { status: 500 }
    );
  }
}
