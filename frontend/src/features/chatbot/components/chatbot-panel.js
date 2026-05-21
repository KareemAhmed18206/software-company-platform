"use client";

import { useState } from "react";

import { apiRequest } from "@/lib/api/client";

export function ChatbotPanel() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello. Ask about services, timelines, budgets, or which solution fits your project best."
    }
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!input.trim()) {
      return;
    }

    const nextUserMessage = {
      role: "user",
      content: input.trim()
    };

    setMessages((current) => [...current, nextUserMessage]);
    setInput("");
    setIsSending(true);

    try {
      const response = await apiRequest("/chatbot/message", {
        method: "POST",
        body: {
          message: nextUserMessage.content
        }
      });

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: response.reply
        }
      ]);
    } catch (_error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "I could not answer right now. Please try again in a moment."
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <p className="text-sm uppercase tracking-[0.2em] text-brand-light">
        AI Support Chatbot
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-white">
        Ask about services and best-fit solutions
      </h2>

      <div className="mt-5 max-h-[28rem] space-y-3 overflow-auto pr-2">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-2xl whitespace-pre-line rounded-[1.5rem] px-4 py-3 text-sm leading-7 ${
                message.role === "user"
                  ? "bg-brand text-slate-950"
                  : "bg-slate-950/70 text-slate-100"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-5 flex gap-3">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="What should we build for your team?"
          className="flex-1 rounded-full border border-white/10 bg-slate-950 px-5 py-3 text-sm text-white outline-none transition focus:border-brand"
        />
        <button
          type="submit"
          disabled={isSending}
          className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSending ? "Sending..." : "Ask"}
        </button>
      </form>
    </section>
  );
}

