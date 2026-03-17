import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, age = 0 }: { name: string; age?: number } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API not configured' }, { status: 503 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `Analyze the Islamic name "${name.trim()}" for a person aged ${age}.

Return ONLY valid JSON in this exact structure (no markdown, no code fences):
{
  "arabicRoot": "the root Arabic letters and their exact meaning",
  "quranicVerse": {
    "arabic": "Arabic text of a relevant Quranic verse",
    "translation": "English translation",
    "reference": "Surah Name Chapter:Verse"
  },
  "historicalFigure": {
    "name": "Name of a Sahabi or notable Islamic figure who carried this name",
    "era": "time period (e.g. Early Islamic period, 7th century)",
    "description": "2-3 sentences about their character and contribution"
  },
  "nameWisdom": "A 2-3 sentence reflection on what this name calls its bearer toward in life",
  "prophetAtAge": {
    "age": ${age > 0 ? age : 25},
    "event": "What the Prophet Muhammad ﷺ was doing at this exact age according to verified Seerah — be specific and factual"
  },
  "confidence": "High"
}

Rules:
- Only use verified Seerah for prophetAtAge
- Only cite real Quranic verses with correct references
- If the name is not Arabic/Islamic, analyze its closest meaning
- Return pure JSON only`

    const result = await model.generateContent(prompt)
    const raw = result.response.text().trim()

    // Strip markdown fences if present
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```\s*$/, '')
      .trim()

    try {
      const parsed = JSON.parse(cleaned)
      return NextResponse.json(parsed)
    } catch {
      // Try to extract JSON object from the response
      const match = cleaned.match(/\{[\s\S]*\}/)
      if (match) {
        try {
          const parsed = JSON.parse(match[0])
          return NextResponse.json(parsed)
        } catch {}
      }
      return NextResponse.json(
        { error: 'Could not parse response', raw: cleaned.slice(0, 200) },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('[name-analysis] Error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze name. Please try again.' },
      { status: 500 }
    )
  }
}
