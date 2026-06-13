// components/dashboard/widgets.tsx
import {
  CalendarDays,
  DoorOpen,
  UtensilsCrossed,
  ClipboardList,
  BookOpen,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { cn } from "@/lib/utils";

import { getUpcomingEvents } from "@/lib/mock/events";
import { getAvailableBooks, getBorrowedBooks } from "@/lib/mock/library";
import { cafeteriaMenu, getAvailableItems } from "@/lib/mock/cafeteria";
import { assignments, attendanceRecord } from "@/lib/mock/academics";

export function UpcomingEventsWidget() {
  const events = getUpcomingEvents().slice(0, 3);

  return (
    <DashboardCard title="Upcoming Events" icon={CalendarDays} href="/events">
      <ul className="space-y-3">
        {events.map((event) => (
          <li key={event.id} className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {event.title}
              </p>
              <p className="text-xs text-muted">{event.venue}</p>
            </div>
            <span className="text-xs font-medium text-accent bg-accent/10 rounded-default px-2 py-1 shrink-0">
              {new Date(event.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}

export function FreeStudyRoomsWidget() {
  // No dedicated study-room data source yet; using available books count as a stand-in placeholder
  const rooms = [
    { id: "RM01", name: "Study Room 1", capacity: 4, status: "available" as const },
    { id: "RM02", name: "Study Room 2", capacity: 6, status: "occupied" as const },
    { id: "RM03", name: "Study Room 3", capacity: 2, status: "available" as const },
  ];

  return (
    <DashboardCard title="Free Study Rooms" icon={DoorOpen} href="/library">
      <ul className="space-y-3">
        {rooms.map((room) => (
          <li key={room.id} className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {room.name}
              </p>
              <p className="text-xs text-muted">Capacity: {room.capacity}</p>
            </div>
            <span
              className={cn(
                "text-xs font-medium rounded-default px-2 py-1 shrink-0",
                room.status === "available"
                  ? "text-success bg-success/10"
                  : "text-danger bg-danger/10"
              )}
            >
              {room.status === "available" ? "Available" : "Occupied"}
            </span>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}

export function CafeteriaMenuWidget() {
  const meals: { type: string; items: ReturnType<typeof getAvailableItems> }[] = [
    { type: "Breakfast", items: getAvailableItems("breakfast") },
    { type: "Lunch", items: getAvailableItems("lunch") },
    { type: "Dinner", items: getAvailableItems("dinner") },
  ];

  return (
    <DashboardCard title="Today's Cafeteria Menu" icon={UtensilsCrossed} href="/cafeteria">
      <div className="space-y-3">
        {meals.map((meal) => (
          <div key={meal.type}>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-1">
              {meal.type}
            </p>
            <p className="text-sm text-foreground/90 leading-relaxed">
              {meal.items.map((item) => item.name).join(", ")}
            </p>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

export function AssignmentDeadlinesWidget() {
  const pending = assignments.filter((a) => !a.submitted).slice(0, 3);

  return (
    <DashboardCard title="Assignment Deadlines" icon={ClipboardList} href="/academics">
      <ul className="space-y-3">
        {pending.map((assignment) => (
          <li key={assignment.id} className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {assignment.title}
              </p>
              <p className="text-xs text-muted">
                {assignment.subjectCode} · Due{" "}
                {new Date(assignment.dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <span
              className={cn(
                "text-xs font-medium rounded-default px-2 py-1 shrink-0",
                assignment.priority === "high" && "text-danger bg-danger/10",
                assignment.priority === "medium" && "text-warning bg-warning/10",
                assignment.priority === "low" && "text-success bg-success/10"
              )}
            >
              {assignment.priority}
            </span>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}

export function LibraryAvailabilityWidget() {
  const availableCount = getAvailableBooks().length;
  const borrowedCount = getBorrowedBooks().length;

  return (
    <DashboardCard title="Library Availability" icon={BookOpen} href="/library">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-default bg-background/50 border border-border p-3">
          <p className="text-2xl font-bold text-accent">{availableCount}</p>
          <p className="text-xs text-muted mt-1">Available books</p>
        </div>
        <div className="rounded-default bg-background/50 border border-border p-3">
          <p className="text-2xl font-bold text-foreground">{borrowedCount}</p>
          <p className="text-xs text-muted mt-1">Borrowed books</p>
        </div>
      </div>
    </DashboardCard>
  );
}

export function AttendanceWidget() {
  const { overallPercentage, attendedClasses, totalClasses, status } = attendanceRecord;

  const barColor =
    status === "good"
      ? "bg-success"
      : status === "warning"
      ? "bg-warning"
      : "bg-danger";

  return (
    <DashboardCard title="Attendance Overview" icon={TrendingUp} href="/academics">
      <div>
        <div className="flex items-end justify-between mb-2">
          <p className="text-2xl font-bold text-foreground">{overallPercentage}%</p>
          <p className="text-xs text-muted capitalize">{status}</p>
        </div>
        <div className="h-2 w-full rounded-full bg-background/60 overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-500", barColor)}
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
        <p className="text-xs text-muted mt-2">
          {attendedClasses}/{totalClasses} classes attended
        </p>
      </div>
    </DashboardCard>
  );
}

export function AIRecommendationsWidget() {
  const pendingAssignment = assignments.find((a) => !a.submitted && a.priority === "high");
  const borrowed = getBorrowedBooks()[0];
  const nextEvent = getUpcomingEvents()[0];

  const suggestions = [
    pendingAssignment && {
      id: "sug_assignment",
      title: `${pendingAssignment.title} (${pendingAssignment.subjectCode}) is due ${new Date(
        pendingAssignment.dueDate
      ).toLocaleDateString("en-US", { month: "short", day: "numeric" })} — start now?`,
    },
    borrowed && {
      id: "sug_library",
      title: `"${borrowed.title}" is due back on ${new Date(
        borrowed.dueDate as string
      ).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
    },
    nextEvent && {
      id: "sug_event",
      title: `${nextEvent.title} is happening at ${nextEvent.venue} on ${new Date(
        nextEvent.date
      ).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
    },
  ].filter(Boolean) as { id: string; title: string }[];

  return (
    <DashboardCard
      title="AI Recommendations"
      icon={Sparkles}
      className="md:col-span-2 xl:col-span-1 border-accent/20"
    >
      <ul className="space-y-3">
        {suggestions.map((suggestion) => (
          <li
            key={suggestion.id}
            className="flex items-start gap-2 rounded-default bg-accent/5 border border-accent/15 p-2.5 hover:bg-accent/10 transition-colors duration-200 cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-accent mt-0.5 shrink-0" />
            <p className="text-sm text-foreground/90 leading-snug">{suggestion.title}</p>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}