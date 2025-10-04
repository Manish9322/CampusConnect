
"use client"

import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { AttendanceCard } from "./attendance-card";
import { StudentDashboardHeader } from "./student-dashboard-header";
import { StudentStatCards } from "./student-stat-cards";
import { RecentAttendanceTable } from "./recent-attendance-table";

export function StudentDashboard() {
  const attendancePercentage = 95;

  return (
    <div className="space-y-6">
       <StudentDashboardHeader name="Alice" />

        {attendancePercentage < 75 && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Low Attendance Warning</AlertTitle>
                <AlertDescription>
                    Your attendance is below 75%. Please ensure you attend classes regularly.
                </AlertDescription>
            </Alert>
        )}
        
        <div className="grid gap-6 lg:grid-cols-3">
             <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
                <StudentStatCards attendancePercentage={95} presentDays={19} absentDays={1} totalClasses={20} />
                <RecentAttendanceTable />
            </div>
            <div className="lg:col-span-1 order-1 lg:order-2">
                <AttendanceCard />
            </div>
        </div>
    </div>
  )
}
