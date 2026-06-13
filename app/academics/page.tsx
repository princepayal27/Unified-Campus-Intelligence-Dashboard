"use client";

import { ModuleCard } from "@/components/ModuleCard";
import { 
  attendanceRecord, 
  upcomingClasses, 
  assignments 
} from "@/lib/mock/academics";
import { Clock, BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AcademicsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Academics Portal</h1>
        <p className="text-gray-400">
          Monitor your attendance, daily schedule, and pending deadlines.
        </p>
      </div>

      {/* Attendance Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 rounded-[18px] bg-[#1a1a1a]/40 border border-white/5 flex flex-col justify-between">
          <p className="text-gray-400 text-sm">Overall Attendance</p>
          <div className="mt-4">
            <span className="text-4xl font-bold text-white">{attendanceRecord.overallPercentage}%</span>
            <div className="w-full bg-white/10 h-2 rounded-full mt-2">
              <div 
                className={`h-2 rounded-full ${attendanceRecord.status === 'good' ? 'bg-green-500' : 'bg-yellow-500'}`} 
                style={{ width: `${attendanceRecord.overallPercentage}%` }}
              />
            </div>
          </div>
        </div>
        <div className="card p-6 rounded-[18px] bg-[#1a1a1a]/40 border border-white/5 flex flex-col justify-center">
          <p className="text-gray-400 text-sm">Classes Attended</p>
          <p className="text-2xl font-semibold text-white mt-1">{attendanceRecord.attendedClasses} / {attendanceRecord.totalClasses}</p>
        </div>
        <div className="card p-6 rounded-[18px] bg-[#1a1a1a]/40 border border-white/5 flex flex-col justify-center">
          <p className="text-gray-400 text-sm">Academic Status</p>
          <p className="text-2xl font-semibold capitalize text-[#c9a86a] mt-1">{attendanceRecord.status}</p>
        </div>
      </section>

      {/* Classes Grid */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Clock className="text-[#c9a86a]" /> Upcoming Classes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingClasses.map((cls) => (
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

      {/* Assignments Grid */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <BookOpen className="text-[#c9a86a]" /> Pending Assignments
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.filter(a => !a.submitted).map((asg) => (
            <ModuleCard
              key={asg.id}
              title={asg.title}
              subtitle={`Subject Code: ${asg.subjectCode}`}
              status={asg.priority === 'high' ? 'Busy' : 'Available'}
              extraInfo={`Due: ${asg.dueDate}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}