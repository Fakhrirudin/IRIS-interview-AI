import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/openrouter";

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

    const reply = await callAI(prompt);

    try {
      return NextResponse.json(JSON.parse(reply));
    } catch {
      return NextResponse.json({
        score: 75,
        summary: reply,
        strengths: [],
        weaknesses: [],
      });
    }
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to evaluate" },
      { status: 500 }
    );
  }
}