"use client";

import Link from "next/link";

import { ChatbotPanel } from "@/features/chatbot/components/chatbot-panel";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.15),transparent_25%),linear-gradient(180deg,#020617,#0f172a)] px-6 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-brand hover:text-white"
          >
            Back to Home
          </Link>
          <Link
            href="/services"
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-brand hover:text-white"
          >
            Browse Services
          </Link>
        </div>

        <ChatbotPanel />
      </div>
    </main>
  );
}

