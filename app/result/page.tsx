"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Analysis = {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
};

export default function ResultPage() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem("interview");

    if (!data) {
      router.push("/");
      return;
    }

    const messages: Message[] = JSON.parse(data);

    analyze(messages);
  }, []);

  const analyze = async (messages: Message[]) => {
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ messages }),
      });

      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        IRIS is analyzing your interview...
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        Failed to load result.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0f19] text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <h1 className="text-3xl font-semibold mb-10">
          Interview Result
        </h1>

        {/* Score */}
        <div className="mb-8 p-6 bg-[#020617] rounded-xl border border-gray-800">
          <p className="text-gray-400 mb-2">Overall Score</p>
          <h2 className="text-5xl font-bold">
            {analysis.score}/100
          </h2>
        </div>

        {/* Summary */}
        <div className="mb-8 p-6 bg-[#020617] rounded-xl border border-gray-800">
          <h3 className="font-semibold mb-3">Summary</h3>
          <p className="text-gray-400 leading-relaxed">
            {analysis.summary}
          </p>
        </div>

        {/* Strengths */}
        <div className="mb-8 p-6 bg-[#020617] rounded-xl border border-gray-800">
          <h3 className="font-semibold mb-3">Strengths</h3>
          <ul className="list-disc pl-5 text-gray-400 space-y-2">
            {analysis.strengths.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="mb-10 p-6 bg-[#020617] rounded-xl border border-gray-800">
          <h3 className="font-semibold mb-3">Areas to Improve</h3>
          <ul className="list-disc pl-5 text-gray-400 space-y-2">
            {analysis.weaknesses.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push("/")}
          className="border border-gray-600 px-6 py-3 rounded-lg hover:border-white hover:bg-white/5 transition"
        >
          Start New Interview
        </button>

      </div>
    </main>
  );
}