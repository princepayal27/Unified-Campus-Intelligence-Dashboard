"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { ModuleCard } from "@/components/ModuleCard";

type CampusEvent = {
  id: string;
  title: string;
  date: string;
  venue: string;
  category: string;
  organizer: string;
};

export default function EventsPage() {
  const [query, setQuery] = useState("");
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchEvents = async (searchQuery: string = "") => {
    try {
      setLoading(true);
      setError("");

      const endpoint = searchQuery.trim()
        ? `http://127.0.0.1:8002/events/search?q=${searchQuery}`
        : `http://127.0.0.1:8002/events/upcoming`;

      const res = await fetch(endpoint);

      if (!res.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await res.json();

      // Support both { events: [...] } and direct [...]
     setEvents(data.events || data.results || data);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to Events MCP server.");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchEvents();
  }, []);

  // Search debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchEvents(query);
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Campus Events</h1>
        <p className="text-gray-400">
          Stay updated with upcoming workshops, cultural fests, and academic sessions.
        </p>
      </div>

      {/* Search */}
      <div className="search-surface w-full p-2 rounded-full border border-white/10 bg-[#1a1a1a]/50 backdrop-blur-md flex items-center gap-3">
        <Search className="w-5 h-5 text-[#c9a86a] ml-3" />
        <input
          type="text"
          placeholder="Search events, categories, organizers..."
          className="w-full bg-transparent border-none outline-none text-white placeholder:text-gray-500 py-2 pr-4"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-400 py-10">
          Loading events...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center text-red-400 py-10">
          {error}
        </div>
      )}

      {/* Events Grid */}
      {!loading && !error && events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map((event) => (
            <ModuleCard
              key={event.id}
              title={event.title}
              subtitle={event.venue}
              status="Upcoming"
              extraInfo={`Date: ${event.date} • ${event.category}`}
            />
          ))}
        </div>
      ) : (
        !loading &&
        !error && (
          <div className="text-center py-20 border border-white/5 rounded-[18px] bg-[#1a1a1a]/20">
            <p className="text-gray-500">
              No upcoming events found.
            </p>
          </div>
        )
      )}
    </div>
  );
}