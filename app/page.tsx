// app/page.tsx
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

export default function Home() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex-1 flex flex-col md:pl-64">
        <Navbar />

        <div className="flex-1 flex">
          <main className="flex-1 px-4 md:px-8 py-6 lg:pr-96">
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

          <AssistantPanel />
        </div>
      </div>
    </div>
  );
}