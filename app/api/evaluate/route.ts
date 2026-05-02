import { callAI } from "@/lib/openrouter";

export async function POST(req) {
  const { messages } = await req.json();

  const prompt = `
Evaluate this interview:

${messages.map((m) => `${m.role}: ${m.content}`).join("\n")}

Return:
- Score (0-100)
- Strengths
- Weaknesses
- Suggestions
`;

  const result = await callAI([{ role: "user", content: prompt }]);

  return Response.json({ result });
}