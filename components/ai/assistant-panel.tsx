// components/ai/assistant-panel.tsx
"use client";

import { useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";

const suggestionChips = [
  "Show my assignments",
  "Find study room",
  "Today's events",
];

export function AssistantPanel() {
  const [input, setInput] = useState("");

  return (
    <aside className="hidden lg:flex fixed right-0 top-16 z-20 h-[calc(100vh-4rem)] w-96 flex-col border-l border-border bg-surface">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
        <div className="h-10 w-10 rounded-default bg-accent/15 flex items-center justify-center">
          <Bot className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">AI Assistant</h2>
          <p className="text-xs text-muted">Always here to help</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        <div className="rounded-default bg-accent/10 border border-accent/20 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-accent" />
            <p className="text-sm font-semibold text-foreground">
              Hi Aarav 👋
            </p>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">
            I can help you check assignments, find study rooms, browse
            today&apos;s events, and more. What would you like to do?
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {suggestionChips.map((chip) => (
            <button
              key={chip}
              onClick={() => setInput(chip)}
              className="text-xs font-medium rounded-default bg-background border border-border px-3 py-2 text-foreground/80 hover:border-accent/40 hover:text-accent hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 rounded-default bg-background border border-border px-3 py-2 focus-within:ring-2 focus-within:ring-accent/50 focus-within:border-accent transition-all duration-200">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Ask anything about campus..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
          />
          <button
            aria-label="Send message"
            className="h-8 w-8 rounded-default bg-accent flex items-center justify-center text-background hover:bg-accent-hover hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50"
            disabled={!input.trim()}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}