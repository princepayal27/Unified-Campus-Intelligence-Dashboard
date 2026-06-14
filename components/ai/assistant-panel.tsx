"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, User, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
type Role = "user" | "assistant";
interface Message { id: string; role: Role; content: string; }
interface AssistantPanelProps { isOpen: boolean; onClose: () => void; }

const AI_CHAT_URL = "http://localhost:8000/ai/chat";
const SUGGESTION_CHIPS = [
  "Show my assignments",
  "Find a study room",
  "Today's events",
  "What's for lunch?",
  "What is the attendance policy?",
];

function generateId(): string { return Math.random().toString(36).slice(2, 9); }

// --- Sub-components (Kept original structure for compatibility) ---
const UserBubble = ({ content }: { content: string }) => (
  <div className="flex items-end justify-end gap-3">
    <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-accent px-5 py-3 text-sm text-background leading-relaxed shadow-sm">
      {content}
    </div>
    <div className="h-9 w-9 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
      <User className="h-4 w-4 text-accent" />
    </div>
  </div>
);

const AssistantBubble = ({ content }: { content: string }) => (
  <div className="flex items-end gap-3">
    <div className="h-9 w-9 rounded-full bg-surface-hover border border-border flex items-center justify-center shrink-0">
      <Bot className="h-4 w-4 text-accent" />
    </div>
    <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-surface-hover border border-border px-5 py-3 text-sm text-foreground leading-relaxed shadow-sm whitespace-pre-wrap">
      {content}
    </div>
  </div>
);

const TypingIndicator = () => (
  <div className="flex items-end gap-3">
    <div className="h-9 w-9 rounded-full bg-surface-hover border border-border flex items-center justify-center shrink-0">
      <Bot className="h-4 w-4 text-accent" />
    </div>
    <div className="rounded-2xl rounded-bl-sm bg-surface-hover border border-border px-5 py-4">
      <div className="flex gap-1.5 items-center">
        <span className="h-2 w-2 rounded-full bg-muted animate-bounce [animation-delay:0ms]" />
        <span className="h-2 w-2 rounded-full bg-muted animate-bounce [animation-delay:150ms]" />
        <span className="h-2 w-2 rounded-full bg-muted animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  </div>
);

// --- Main Component ---
export function AssistantPanel({ isOpen, onClose }: AssistantPanelProps) {
  const [messages, setMessages] = useState<Message[]>([{
    id: "welcome", role: "assistant", 
    content: "Hi Aarav 👋 I'm your campus AI assistant. Ask me anything — assignments, events, menu, library, or academic policies!",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 300); }, [isOpen]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { id: generateId(), role: "user", content: trimmed }]);
    setLoading(true);
    
    try {
      const res = await fetch(AI_CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { id: generateId(), role: "assistant", content: data.response }]);
    } catch {
      setMessages((prev) => [...prev, { id: generateId(), role: "assistant", content: "⚠️ Could not connect to AI backend." }]);
    } finally { setLoading(false); }
  };

  return (
    <aside
      className={cn(
        "fixed right-0 top-0 z-50 h-screen flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "w-full lg:w-[70%] max-w-4xl bg-background/95 backdrop-blur-3xl border-l border-white/10 shadow-2xl",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center ring-1 ring-accent/20">
            <Bot className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">AI Assistant</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <p className="text-xs text-muted font-medium">Connected to campus data</p>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-3 rounded-full hover:bg-surface-hover text-muted hover:text-foreground transition-all">
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">
        {messages.map((msg) => msg.role === "user" ? <UserBubble key={msg.id} content={msg.content} /> : <AssistantBubble key={msg.id} content={msg.content} />)}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Footer Area */}
      <div className="p-8 border-t border-white/5 bg-background/50 space-y-6">
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2">
            {SUGGESTION_CHIPS.map((chip) => (
              <button key={chip} onClick={() => sendMessage(chip)} className="text-xs px-4 py-2 rounded-full bg-surface border border-border hover:border-accent/40 text-muted hover:text-accent transition-all">
                {chip}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-3 bg-surface border border-border rounded-2xl px-5 py-4 focus-within:ring-2 focus-within:ring-accent/20 transition-all">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask anything about campus…"
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
          <button onClick={() => sendMessage(input)} disabled={loading} className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center text-background hover:scale-105 transition-all">
            {loading ? <Loader2 className="animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
}