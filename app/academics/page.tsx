"use client";

import { useState, useEffect } from "react";
import { ModuleCard } from "@/components/ModuleCard";
import { Clock, BookOpen } from "lucide-react";

type AttendanceRecord = {
  overallPercentage: number;
  attendedClasses: number;
  totalClasses: number;
  status: string;
};

type UpcomingClass = {
  id: string;
  subjectName: string;
  faculty: string;
  room: string;
  startTime: string;
};

type Assignment = {
  id: string;
  title: string;
  subjectCode: string;
  dueDate: string;
  submitted: boolean;
  priority: string;
};

type DashboardData = {
  attendance: AttendanceRecord;
  classes: UpcomingClass[];
  assignments: Assignment[];
};

export default function AcademicsPage() {
  const [dashboard, setDashboard] = useState<DashboardData>({
    attendance: {
      overallPercentage: 0,
      attendedClasses: 0,
      totalClasses: 0,
      status: "unknown",
    },
    classes: [],
    assignments: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://127.0.0.1:8004/academics/dashboard");

      if (!res.ok) {
        throw new Error("Failed to fetch academics data");
      }

      const data = await res.json();

      setDashboard({
        attendance: data.attendance || {},
        classes: data.classes || [],
        assignments: data.assignments || [],
      });
    } catch (err) {
      console.error(err);
      setError("Unable to connect to Academics MCP server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const { attendance, classes, assignments } = dashboard;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">
          Academics Portal
        </h1>
        <p className="text-gray-400">
          Monitor your attendance, daily schedule, and pending deadlines.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-400 py-10">
          Loading academic data...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center text-red-400 py-10">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Attendance */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6 rounded-[18px] bg-[#1a1a1a]/40 border border-white/5 flex flex-col justify-between">
              <p className="text-gray-400 text-sm">Overall Attendance</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-white">
                  {attendance.overallPercentage}%
                </span>
                <div className="w-full bg-white/10 h-2 rounded-full mt-2">
                  <div
                    className={`h-2 rounded-full ${
                      attendance.status === "good"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                    style={{
                      width: `${attendance.overallPercentage}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="card p-6 rounded-[18px] bg-[#1a1a1a]/40 border border-white/5 flex flex-col justify-center">
              <p className="text-gray-400 text-sm">Classes Attended</p>
              <p className="text-2xl font-semibold text-white mt-1">
                {attendance.attendedClasses} / {attendance.totalClasses}
              </p>
            </div>

            <div className="card p-6 rounded-[18px] bg-[#1a1a1a]/40 border border-white/5 flex flex-col justify-center">
              <p className="text-gray-400 text-sm">Academic Status</p>
              <p className="text-2xl font-semibold capitalize text-[#c9a86a] mt-1">
                {attendance.status}
              </p>
            </div>
          </section>

          {/* Upcoming Classes */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Clock className="text-[#c9a86a]" /> Upcoming Classes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((cls) => (
                <ModuleCard
                  key={cls.id}
                  title={cls.subjectName}
                  subtitle={`${cls.faculty} • ${cls.room}`}
                  status="Upcoming"
                  extraInfo={`Starts at: ${cls.startTime}`}
                />
              ))}
            </div>
          </section>

          {/* Assignments */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <BookOpen className="text-[#c9a86a]" /> Pending Assignments
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignments
                .filter((a) => !a.submitted)
                .map((asg) => (
                  <ModuleCard
                    key={asg.id}
                    title={asg.title}
                    subtitle={`Subject Code: ${asg.subjectCode}`}
                    status={asg.priority === "high" ? "Busy" : "Available"}
                    extraInfo={`Due: ${asg.dueDate}`}
                  />
                ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}