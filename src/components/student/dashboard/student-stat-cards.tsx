
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Percent,
  CheckCircle,
  XCircle,
  TrendingUp,
} from "lucide-react";
import { Student, AttendanceRecord } from "@/lib/types";

interface StudentStatCardsProps {
  student: Student;
  attendanceRecords: AttendanceRecord[];
}

export function StudentStatCards({ student, attendanceRecords }: StudentStatCardsProps) {
  const calculateStats = () => {
    if (!attendanceRecords || !Array.isArray(attendanceRecords)) {
      return {
        attendedClasses: 0,
        missedClasses: 0,
        bestSubject: 'N/A',
        bestAttendance: 0,
      };
    }

    const studentRecords = attendanceRecords.filter(r => r.studentId === student._id);
    const attendedClasses = studentRecords.filter(r => r.status === 'present' || r.status === 'late').length;
    const missedClasses = studentRecords.filter(r => r.status === 'absent').length;

    const subjectAttendance: {[key: string]: {present: number, total: number}} = {};
    studentRecords.forEach(record => {
      const courseName = record.course || 'Unknown';
      if (!subjectAttendance[courseName]) {
        subjectAttendance[courseName] = { present: 0, total: 0 };
      }
      if (record.status === 'present' || record.status === 'late') {
        subjectAttendance[courseName].present++;
      }
      subjectAttendance[courseName].total++;
    });

    let bestSubject = 'N/A';
    let bestAttendance = 0;

    for (const subject in subjectAttendance) {
      const rate = (subjectAttendance[subject].present / subjectAttendance[subject].total) * 100;
      if (rate > bestAttendance) {
        bestAttendance = rate;
        bestSubject = subject;
      }
    }

    return {
      attendedClasses,
      missedClasses,
      bestSubject,
      bestAttendance,
    };
  };

  const { attendedClasses, missedClasses, bestSubject, bestAttendance } = calculateStats();

  const stats = [
    {
      title: "Overall Attendance",
      value: `${student.attendancePercentage}%`,
      icon: Percent,
      description: "Across all subjects",
    },
    {
      title: "Classes Attended",
      value: attendedClasses,
      icon: CheckCircle,
      description: "Total classes marked present/late",
    },
    {
      title: "Classes Missed",
      value: missedClasses,
      icon: XCircle,
      description: "Total classes marked absent",
    },
    {
      title: "Best Subject",
      value: bestSubject,
      icon: TrendingUp,
      description: bestAttendance > 0 ? `With ${Math.round(bestAttendance)}% attendance` : 'No data yet',
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 text-muted-foreground`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold`}>{stat.value}</div>
            {stat.description && (
                <p className="text-xs text-muted-foreground pt-1">{stat.description}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
