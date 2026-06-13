"use client";

import { ModuleCard } from "@/components/ModuleCard";
import { campusEvents } from "@/lib/mock/events";

export default function EventsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Campus Events</h1>
        <p className="text-gray-400">
          Stay updated with upcoming workshops, cultural fests, and academic sessions.
        </p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {campusEvents.map((event) => (
          <ModuleCard
            key={event.id}
            title={event.title}
            subtitle={event.venue}
            status="Upcoming"
            extraInfo={`Date: ${event.date} • ${event.category}`}
          />
        ))}
      </div>

      {/* Empty State (if no events) */}
      {campusEvents.length === 0 && (
        <div className="text-center py-20 border border-white/5 rounded-[18px] bg-[#1a1a1a]/20">
          <p className="text-gray-500">No upcoming events at the moment.</p>
        </div>
      )}
    </div>
  );
}