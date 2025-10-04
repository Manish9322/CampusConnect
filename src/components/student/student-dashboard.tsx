
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockAttendance } from "@/lib/mock-data";
import { AttendanceStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { AttendanceCard } from "./attendance-card";

const studentRecords = mockAttendance.filter(record => record.studentId === 'S001');

const statusVariant: { [key in AttendanceStatus]: "default" | "destructive" | "secondary" } = {
    present: "default",
    absent: "destructive",
    late: "secondary",
};

export function StudentDashboard() {
  const attendancePercentage = 95; // From mock data, can be calculated
  const totalClasses = 20;
  const presentDays = 19;
  const absentDays = 1;

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold">Welcome back, Alice!</h1>
            <p className="text-muted-foreground">Here's a summary of your academic progress.</p>
        </div>
       </div>

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
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Overall Attendance</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center">
                            <div className="relative h-28 w-28">
                                <svg className="h-full w-full" width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200 dark:text-gray-700" strokeWidth="2"></circle>
                                    <g className="origin-center -rotate-90 transform">
                                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-primary" strokeWidth="2" strokeDasharray="100" strokeDashoffset={100 - attendancePercentage}></circle>
                                    </g>
                                </svg>
                                <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
                                    <span className="text-center text-2xl font-bold text-gray-800 dark:text-white">{attendancePercentage}%</span>
                                </div>
                            </div>
                             <p className="text-xs text-muted-foreground mt-2">{presentDays} of {totalClasses} classes attended</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle>Days Present</CardTitle><CardDescription>This Semester</CardDescription></CardHeader>
                        <CardContent><p className="text-4xl font-bold text-green-600">{presentDays}</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Days Absent</CardTitle><CardDescription>Keep an eye on this</CardDescription></CardHeader>
                        <CardContent><p className="text-4xl font-bold text-red-600">{absentDays}</p></CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Attendance</CardTitle>
                        <CardDescription>Here are your last 5 attendance records.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {studentRecords.slice(0, 5).map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell className="font-medium">{record.date}</TableCell>
                                    <TableCell>{record.course}</TableCell>
                                    <TableCell className="text-right">
                                    <Badge variant={statusVariant[record.status]} className={cn(record.status === 'present' && 'bg-green-600 text-white hover:bg-green-700', record.status === 'late' && 'bg-yellow-500 text-white hover:bg-yellow-600')}>
                                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                    </Badge>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1 order-1 lg:order-2">
                <AttendanceCard />
            </div>
        </div>
    </div>
  )
}
