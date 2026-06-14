"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { AssistantPanel } from "@/components/ai/assistant-panel";
import {
  UpcomingEventsWidget,
  FreeStudyRoomsWidget,
  CafeteriaMenuWidget,
  AssignmentDeadlinesWidget,
  LibraryAvailabilityWidget,
  AttendanceWidget,
  AIRecommendationsWidget,
} from "@/components/dashboard/widgets";
import { cn } from "@/lib/utils";

export default function Home() {
  const [aiPanelOpen, setAiPanelOpen] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col md:pl-64 min-w-0 h-screen overflow-hidden">
        <Navbar
          onAskAI={() => setAiPanelOpen((prev) => !prev)}
          aiPanelOpen={aiPanelOpen}
        />

        <div className="flex-1 relative overflow-y-auto">
          {/* Main Content Area - Full width always */}
          <main className="px-4 md:px-8 py-6 w-full transition-all duration-500">
            
            {/* The Overlay - Tinted, no blur, keeps dashboard visible */}
            {aiPanelOpen && (
              <div
                className="fixed inset-0 z-40 bg-[#222121]/60 transition-all duration-500"
                onClick={() => setAiPanelOpen(false)}
                aria-hidden="true"
              />
            )}

            <header className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Welcome back, Aarav 👋
              </h1>
              <p className="text-sm text-muted mt-1">{today}</p>
              <p className="text-sm text-accent mt-2">
                Your unified campus intelligence hub
              </p>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              <UpcomingEventsWidget />
              <FreeStudyRoomsWidget />
              <CafeteriaMenuWidget />
              <AssignmentDeadlinesWidget />
              <LibraryAvailabilityWidget />
              <AttendanceWidget />
              <AIRecommendationsWidget />
            </section>
          </main>

          {/* AI Panel - Solid background for clear visibility */}
          <AssistantPanel
            isOpen={aiPanelOpen}
            onClose={() => setAiPanelOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}