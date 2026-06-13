// lib/mock/academics.ts

export type AttendanceRecord = {
  overallPercentage: number;
  totalClasses: number;
  attendedClasses: number;
  status: "good" | "warning" | "critical";
};

export type Subject = {
  id: string;
  name: string;
  code: string;
  faculty: string;
  credits: number;
};

export type UpcomingClass = {
  id: string;
  subjectCode: string;
  subjectName: string;
  faculty: string;
  startTime: string;
  room: string;
};

export type Assignment = {
  id: string;
  subjectCode: string;
  title: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  submitted: boolean;
};

export const attendanceRecord: AttendanceRecord = {
  overallPercentage: 82,
  totalClasses: 120,
  attendedClasses: 98,
  status: "warning",
};

export const subjects: Subject[] = [
  { id: "SUB001", name: "Data Structures", code: "CS201", faculty: "Dr. A. Sharma", credits: 4 },
  { id: "SUB002", name: "Database Management Systems", code: "CS202", faculty: "Prof. R. Gupta", credits: 3 },
  { id: "SUB003", name: "Operating Systems", code: "CS301", faculty: "Dr. K. Verma", credits: 4 },
  { id: "SUB004", name: "Computer Networks", code: "CS302", faculty: "Prof. S. Mehta", credits: 3 },
  { id: "SUB005", name: "Machine Learning", code: "CS401", faculty: "Dr. L. Singh", credits: 4 },
  { id: "SUB006", name: "Software Engineering", code: "CS402", faculty: "Prof. P. Iyer", credits: 3 },
];

export const upcomingClasses: UpcomingClass[] = [
  { id: "CLS001", subjectCode: "CS301", subjectName: "Operating Systems", faculty: "Dr. K. Verma", startTime: "09:00 AM", room: "Room 204" },
  { id: "CLS002", subjectCode: "CS401", subjectName: "Machine Learning", faculty: "Dr. L. Singh", startTime: "10:30 AM", room: "Lab-3" },
  { id: "CLS003", subjectCode: "CS202", subjectName: "Database Management Systems", faculty: "Prof. R. Gupta", startTime: "11:30 AM", room: "Room 101" },
  { id: "CLS004", subjectCode: "CS302", subjectName: "Computer Networks", faculty: "Prof. S. Mehta", startTime: "02:00 PM", room: "Room 205" },
  { id: "CLS005", subjectCode: "CS201", subjectName: "Data Structures", faculty: "Dr. A. Sharma", startTime: "03:30 PM", room: "Lab-1" },
];

export const assignments: Assignment[] = [
  { id: "ASG001", subjectCode: "CS202", title: "DBMS ER Diagram Submission", dueDate: "2026-06-15", priority: "high", submitted: false },
  { id: "ASG002", subjectCode: "CS301", title: "OS Scheduling Report", dueDate: "2026-06-18", priority: "medium", submitted: true },
  { id: "ASG003", subjectCode: "CS401", title: "ML Model Evaluation", dueDate: "2026-06-20", priority: "high", submitted: false },
  { id: "ASG004", subjectCode: "CS302", title: "Network Topology Analysis", dueDate: "2026-06-22", priority: "low", submitted: false },
  { id: "ASG005", subjectCode: "CS402", title: "Software Project Proposal", dueDate: "2026-06-25", priority: "medium", submitted: true },
];