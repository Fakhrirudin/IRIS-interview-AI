import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const prompt = `
Analyze this interview conversation.

Return STRICT JSON format:
{
  "score": number (0-100),
  "summary": string,
  "strengths": string[],
  "weaknesses": string[]
}

Conversation:
${JSON.stringify(messages)}
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    const text = data.choices?.[0]?.message?.content;

    try {
      return NextResponse.json(JSON.parse(text));
    } catch {
      return NextResponse.json({
        score: 75,
        summary: text,
        strengths: [],
        weaknesses: [],
      });
    }
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to analyze" },
      { status: 500 }
    );
  }
}