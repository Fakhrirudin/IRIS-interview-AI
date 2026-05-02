import { NextRequest, NextResponse } from "next/server";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type RequestBody = {
  messages: Message[];
  role: string;
  language: "en" | "id";
};

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { messages, role, language } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    if (!role) {
      return NextResponse.json(
        { error: "Role is required" },
        { status: 400 }
      );
    }

    const systemPrompt = `
You are IRIS, a professional AI interviewer.

Context:
- Role: ${role}
- Language: ${language === "id" ? "Bahasa Indonesia" : "English"}

Your task:
- Conduct a realistic job interview
- Ask one question at a time
- Adapt based on the candidate’s answers

Behavior:
- If answer is weak → ask follow-up
- If strong → go deeper technically
- Avoid generic questions

Tone:
- Professional, calm, slightly strict

Rules:
- Do not ask multiple questions
- Keep answers concise
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini", // bisa ganti model lain
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Sorry, something went wrong.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("OpenRouter API Error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        reply: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}