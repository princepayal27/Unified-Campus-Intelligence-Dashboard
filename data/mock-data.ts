// data/mock-data.ts
export interface UpcomingEvent {
  id: string;
  title: string;
  location: string;
  time: string;
}

export interface StudyRoom {
  id: string;
  name: string;
  capacity: number;
  status: "available" | "occupied";
}

export interface CafeteriaMeal {
  type: "Breakfast" | "Lunch" | "Dinner";
  items: string[];
}

export interface Assignment {
  id: string;
  subject: string;
  dueDate: string;
  urgency: "high" | "medium" | "low";
}

export interface LibraryStats {
  availableSeats: number;
  borrowedBooks: number;
}

export interface Attendance {
  course: string;
  totalClasses: number;
  attended: number;
  percentage: number;
}

export interface AISuggestion {
  id: string;
  title: string;
}

export const upcomingEvents: UpcomingEvent[] = [
  { id: "evt_101", title: "AI & Robotics Symposium", location: "Auditorium B", time: "2:00 PM" },
  { id: "evt_102", title: "Career Fair 2026", location: "Main Lawn", time: "10:00 AM" },
  { id: "evt_103", title: "Music Club Open Mic", location: "Amphitheatre", time: "6:30 PM" },
];

export const studyRooms: StudyRoom[] = [
  { id: "lib_room_01", name: "Study Room 1", capacity: 4, status: "occupied" },
  { id: "lib_room_03", name: "Study Room 3", capacity: 6, status: "available" },
  { id: "lib_room_05", name: "Study Room 5", capacity: 2, status: "available" },
];

export const cafeteriaMenu: CafeteriaMeal[] = [
  { type: "Breakfast", items: ["Idli", "Sambar", "Coffee"] },
  { type: "Lunch", items: ["Paneer Curry", "Rice", "Dal", "Salad"] },
  { type: "Dinner", items: ["Veg Pulao", "Curd", "Roti"] },
];

export const assignments: Assignment[] = [
  { id: "asg_201", subject: "Database Systems – Lab Report 4", dueDate: "Jun 14", urgency: "high" },
  { id: "asg_202", subject: "Operating Systems Assignment 3", dueDate: "Jun 18", urgency: "medium" },
  { id: "asg_203", subject: "Linear Algebra Problem Set", dueDate: "Jun 25", urgency: "low" },
];

export const libraryStats: LibraryStats = {
  availableSeats: 42,
  borrowedBooks: 3,
};

export const attendance: Attendance = {
  course: "CS302 - Database Systems",
  totalClasses: 40,
  attended: 35,
  percentage: 87.5,
};

export const aiSuggestions: AISuggestion[] = [
  { id: "sug_01", title: "Lab Report 4 is due tomorrow — start now?" },
  { id: "sug_02", title: "Study Room 3 is free — want to book it?" },
  { id: "sug_03", title: "AI & Robotics Symposium starts in 2 hours" },
];