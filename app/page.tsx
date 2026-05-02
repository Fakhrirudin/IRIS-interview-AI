"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#0b0f19] text-white flex items-center">
      
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        
        {/* LEFT CONTENT */}
        <div>
          <p className="text-xs text-gray-500 tracking-[0.2em] mb-6 uppercase">
            AI Interview System
          </p>

          <h1 className="text-5xl md:text-6xl font-medium leading-[1.1] tracking-tight mb-6">
            Practice interviews  
            <br />
            with an AI that
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              actually evaluates you
            </span>
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed max-w-lg mb-10">
            IRIS simulates real interview scenarios, adapts to your responses,
            and provides structured feedback to help you improve.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/interview")}
              className="
              px-6 py-3 rounded-lg font-medium
              border border-gray-600 text-white

              transition-all duration-200
              hover:border-white
              hover:bg-white/5
            "
            >
              Start Interview
            </button>
          </div>
        </div>

        <div className="relative flex justify-center md:justify-end">
          
          <div className="relative w-[300px] md:w-[380px] h-[520px]">
  
            <div className="absolute inset-0 bg-purple-500/10 blur-2xl rounded-full" />

            <div
              className="relative w-full h-full z-10"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.2) 15%, rgba(0,0,0,0.6) 35%, rgba(0,0,0,1) 55%)",
                maskImage:
                  "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.2) 15%, rgba(0,0,0,0.6) 35%, rgba(0,0,0,1) 55%)",
              }}
            >
              <Image
                src="/iris/iris-full.png"
                alt="IRIS AI"
                fill
                sizes="(max-width: 768px) 100vw, 380px"
                className="object-contain opacity-95 drop-shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
                priority
              />
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}