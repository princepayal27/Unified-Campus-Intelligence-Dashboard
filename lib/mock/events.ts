// lib/mock/events.ts

export type CampusEvent = {
  id: string;
  title: string;
  date: string;
  venue: string;
  organizer: string;
  category: string;
};

export const campusEvents: CampusEvent[] = [
  {
    id: "EVT001",
    title: "AI & Future Tech Summit",
    date: "2026-06-25",
    venue: "Main Auditorium",
    organizer: "Computer Science Dept",
    category: "Academic",
  },
  {
    id: "EVT002",
    title: "Annual Cultural Fest",
    date: "2026-07-05",
    venue: "University Grounds",
    organizer: "Student Union",
    category: "Cultural",
  },
  {
    id: "EVT003",
    title: "Hackathon 2026",
    date: "2026-07-12",
    venue: "Innovation Lab",
    organizer: "Coding Club",
    category: "Technical",
  },
  {
    id: "EVT004",
    title: "Startup Pitch Day",
    date: "2026-07-18",
    venue: "Seminar Hall B",
    organizer: "Entrepreneurship Cell",
    category: "Business",
  },
  {
    id: "EVT005",
    title: "Inter-College Robotics Expo",
    date: "2026-07-22",
    venue: "Engineering Block",
    organizer: "Robotics Club",
    category: "Technical",
  },
  {
    id: "EVT006",
    title: "Yoga & Wellness Session",
    date: "2026-07-25",
    venue: "Sports Complex",
    organizer: "Health & Fitness Wing",
    category: "Wellness",
  },
  {
    id: "EVT007",
    title: "Music Night: Live Jam",
    date: "2026-07-29",
    venue: "Open Air Theater",
    organizer: "Music Club",
    category: "Cultural",
  },
  {
    id: "EVT008",
    title: "Guest Lecture: Quantum Computing",
    date: "2026-08-02",
    venue: "Physics Hall",
    organizer: "Physics Dept",
    category: "Academic",
  },
];

/**
 * Helper to get events sorted by date
 */
export const getUpcomingEvents = (): CampusEvent[] => {
  return [...campusEvents].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

/**
 * Helper to filter events by category
 */
export const getEventsByCategory = (category: string): CampusEvent[] => {
  return campusEvents.filter(
    (event) => event.category.toLowerCase() === category.toLowerCase()
  );
};