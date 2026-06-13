// components/layout/navbar.tsx
"use client";

import { Search, Bell, Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-md backdrop-saturate-150">
      <div className="flex items-center gap-3 px-4 md:px-6 h-16">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search campus, courses, events..."
            className="w-full rounded-default bg-surface border border-border pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-200"
          />
        </div>

        <div className="flex-1" />

        <button className="hidden sm:flex items-center gap-2 rounded-default bg-accent/15 border border-accent/30 text-accent px-3 py-2 text-sm font-medium hover:bg-accent/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
          <Sparkles className="h-4 w-4" />
          Ask AI
        </button>

        <button
          className="relative p-2 rounded-default hover:bg-surface-hover transition-colors duration-200"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-foreground/80" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent" />
        </button>

        <button
          className="h-9 w-9 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-semibold hover:scale-105 transition-transform duration-200"
          aria-label="Profile"
        >
          AS
        </button>
      </div>
    </header>
  );
}