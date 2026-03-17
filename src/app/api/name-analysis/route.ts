import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
export interface NameAnalysisResult {
  arabicRoot: string;
  quranicVerse: {
    arabic: string;
    translation: string;
    reference: string;
  };
  historicalFigure: {
    name: string;
    era: string;
    description: string;
  };
  nameWisdom: string;
  prophetAtAge: {
    age: number;
    event: string;
  };
  confidence: "High" | "Medium" | "Low";
}

// ─────────────────────────────────────────────────────────────────────────────
// System prompt for name analysis
// ─────────────────────────────────────────────────────────────────────────────
const NAME_ANALYSIS_PROMPT = `You are Farishta AI — a knowledgeable Islamic scholar and linguist.
Your task is to analyze Islamic/Arabic names with depth, wisdom, and historical accuracy.

HARD RULES:
- Only cite verified Quranic verses (give actual Arabic text)
- Only cite verified Seerah events for the Prophet's timeline (PBUH)
- If unsure of a Seerah event at a specific age, say "scholars differ on this period"
- Historical figures must be real Sahabah or known Islamic figures
- Never fabricate references
- Confidence: High = multiple verified sources, Medium = generally accepted, Low = limited sources

Return ONLY valid JSON — no markdown, no explanation, no text outside the JSON object:
{
  "arabicRoot": "root letters + exact meaning",
  "quranicVerse": {
    "arabic": "Arabic text",
    "translation": "English translation",
    "reference": "Surah Name X:Y"
  },
  "historicalFigure": {
    "name": "Name of Sahabi or Islamic figure",
    "era": "time period (e.g. 'Companion of the Prophet, 7th century')",
    "description": "2-3 sentences about their character, virtues, and legacy"
  },
  "nameWisdom": "What this name calls you toward in life — 1-2 powerful sentences",
  "prophetAtAge": {
    "age": <number — same as user's age>,
    "event": "What Prophet Muhammad SAW was doing at this exact age — verified Seerah only"
  },
  "confidence": "High"
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Parser
// ─────────────────────────────────────────────────────────────────────────────
function parseNameAnalysisResponse(
  text: string,
  age: number
): NameAnalysisResult | null {
  // Strip markdown fences
  const fenceMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  const raw = fenceMatch ? fenceMatch[1] : text;

  // Extract JSON object
  const objectMatch = raw.match(/\{[\s\S]*\}/);
  if (!objectMatch) return null;

  try {
    const parsed = JSON.parse(objectMatch[0]);

    // Validate required shape
    if (
      typeof parsed.arabicRoot !== "string" ||
      !parsed.quranicVerse ||
      !parsed.historicalFigure ||
      typeof parsed.nameWisdom !== "string" ||
      !parsed.prophetAtAge
    ) {
      return null;
    }

    return {
      arabicRoot: parsed.arabicRoot,
      quranicVerse: {
        arabic: parsed.quranicVerse?.arabic ?? "",
        translation: parsed.quranicVerse?.translation ?? "",
        reference: parsed.quranicVerse?.reference ?? "",
      },
      historicalFigure: {
        name: parsed.historicalFigure?.name ?? "",
        era: parsed.historicalFigure?.era ?? "",
        description: parsed.historicalFigure?.description ?? "",
      },
      nameWisdom: parsed.nameWisdom,
      prophetAtAge: {
        age: typeof parsed.prophetAtAge?.age === "number"
          ? parsed.prophetAtAge.age
          : age,
        event: parsed.prophetAtAge?.event ?? "",
      },
      confidence: ["High", "Medium", "Low"].includes(parsed.confidence)
        ? parsed.confidence
        : "Medium",
    };
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST Handler
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, age } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const parsedAge = typeof age === "number" ? age : parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 1 || parsedAge > 120) {
      return NextResponse.json(
        { error: "Age must be a number between 1 and 120" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Farishta AI is in standby — GEMINI_API_KEY not configured." },
        { status: 503 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: NAME_ANALYSIS_PROMPT,
    });

    const prompt = `Analyze the Islamic/Arabic name "${name.trim()}" for a person who is ${parsedAge} years old.

Provide:
1. The Arabic root letters and exact meaning of the name "${name.trim()}"
2. A Quranic verse connected to this name's meaning or virtue (with full Arabic text)
3. A real historical Islamic figure who bore this name or embodied its virtues
4. The wisdom this name calls the bearer toward
5. What Prophet Muhammad SAW (PBUH) was doing at age ${parsedAge} — verified Seerah events only

Return only the JSON object as specified.`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    const analysisResult = parseNameAnalysisResponse(rawText, parsedAge);

    if (!analysisResult) {
      console.error("[Name Analysis] Failed to parse response:", rawText.slice(0, 300));
      return NextResponse.json(
        {
          error: "Unable to analyze this name at the moment. Please try again.",
          rawText: rawText.slice(0, 200),
        },
        { status: 422 }
      );
    }

    console.log(`[Farishta AI] Name analysis complete: ${name}, age ${parsedAge}`);

    return NextResponse.json({ result: analysisResult });
  } catch (error) {
    console.error("[Farishta AI] Name Analysis Error:", error);
    return NextResponse.json(
      {
        error:
          "An error occurred during name analysis. Please try again.",
      },
      { status: 500 }
    );
  }
}
