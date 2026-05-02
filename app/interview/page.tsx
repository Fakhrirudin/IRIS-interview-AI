"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Avatar from "@/components/Avatar";
import ChatBubble from "@/components/ChatBubble";
import { useRouter } from "next/navigation";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const createMessage = (
  role: "user" | "assistant",
  content: string
): Message => ({
  role,
  content,
});



export default function InterviewPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [language, setLanguage] = useState<"en" | "id">("en");
  const [role, setRole] = useState<string>("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (started) {
      setMessages([
        createMessage(
          "assistant",
          language === "id"
            ? `Halo, saya IRIS. Kita akan melakukan interview untuk posisi ${role}. Ceritakan tentang diri Anda.`
            : `Hello, I'm IRIS. We'll conduct an interview for the ${role} role. Tell me about yourself.`
        ),
      ]);
    }
  }, [started, language, role]);

  const router = useRouter();
  const endInterview = () => {
    if (messages.length === 0) return;

    localStorage.setItem("interview", JSON.stringify(messages));
    router.push("/result");
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, createMessage("user", input)];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post<{ reply: string }>("/api/interview", {
        messages: newMessages,
        role,
        language, // 🔥 kirim language juga
      });

      const updatedMessages = [
        ...newMessages,
        createMessage("assistant", res.data.reply),
      ];

      setMessages(updatedMessages);

      localStorage.setItem("interview", JSON.stringify(updatedMessages));
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        createMessage(
          "assistant",
          language === "id"
            ? "Terjadi kesalahan. Silakan coba lagi."
            : "Something went wrong. Please try again."
        ),
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 SETUP SCREEN
  if (!started) {
    return (
      <div className="h-screen flex items-center justify-center text-white px-4">
        <div className="bg-[#020617] p-8 rounded-xl border border-gray-800 w-full max-w-md">
          
          <h2 className="text-xl font-semibold mb-6">
            Setup Interview
          </h2>

          {/* Role */}
          <div className="mb-4">
            <label className="text-sm text-gray-400">Role</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="ex: Frontend Developer, Data Analyst"
              className="w-full mt-2 bg-gray-900 border border-gray-700 p-3 rounded-lg focus:outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="text-sm text-gray-400">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "en" | "id")}
              className="w-full mt-2 bg-gray-900 border border-gray-700 p-3 rounded-lg focus:outline-none"
            >
              <option value="en">English</option>
              <option value="id">Bahasa Indonesia</option>
            </select>
          </div>

          <button
            disabled={!role.trim()}
            onClick={() => setStarted(true)}
            className="w-full border border-gray-600 py-3 rounded-lg hover:border-white hover:bg-white/5 transition disabled:opacity-40"
          >
            Start Interview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col max-w-3xl mx-auto p-4">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar size={40} />
        <div>
          <h2 className="font-semibold">IRIS</h2>
          <p className="text-sm text-gray-400">
            {role} • {language === "id" ? "Bahasa Indonesia" : "English"}
          </p>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto mb-4 bg-[#020617] p-4 rounded-xl border border-gray-800">
        {messages.map((msg, i) => (
          <ChatBubble key={i} role={msg.role} content={msg.content} />
        ))}

        {loading && (
          <p className="text-gray-400 text-sm mt-2">
            {language === "id"
              ? "IRIS sedang menganalisis jawaban Anda..."
              : "IRIS is analyzing your answer..."}
          </p>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          className="flex-1 bg-gray-900 border border-gray-700 p-3 rounded-lg focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            language === "id"
              ? "Ketik jawaban Anda..."
              : "Type your answer..."
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />

        <button
          onClick={endInterview}
          disabled={loading || messages.length < 2}
          className="
            text-sm text-gray-500
            hover:text-white
            transition
            disabled:opacity-30
          "
        >
          End Interview
        </button>
        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-6 rounded-lg border border-gray-600 hover:border-white hover:bg-white/5 transition disabled:opacity-50"
        >
          Send
        </button>
        
      </div>
    </div>
  );
}