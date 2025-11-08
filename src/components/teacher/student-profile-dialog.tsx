
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Student, Class, AttendanceRecord } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Badge } from "../ui/badge";
import { Mail, Phone, AlertTriangle } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertTitle } from "../ui/alert";

interface StudentProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student;
  classes: Class[];
}

const chartConfig = {
  attendance: {
    label: "Attendance (%)",
    color: "hsl(var(--primary))",
  },
};

export function StudentProfileDialog({ isOpen, onOpenChange, student, classes }: StudentProfileDialogProps) {
  const [monthlyData, setMonthlyData] = useState<Array<{ month: string; attendance: number }>>([]);
  const [subjectData, setSubjectData] = useState<Array<{ subject: string; attendance: number }>>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // This should not be null when the dialog is open, but we check for safety
  if (!student) return null;

  const getClassName = (classId: any) => {
    if (typeof classId === 'object' && classId !== null && classId.name) {
      return classId.name;
    }
    return classes.find(c => c._id === classId)?.name || 'N/A';
  }

  const actualClassId = typeof student.classId === 'object' && student.classId !== null 
    ? (student.classId as any)._id 
    : student.classId;
  const studentClass = classes.find(c => c._id === actualClassId);

  // Fetch attendance data when dialog opens
  useEffect(() => {
    if (isOpen && student) {
      const fetchAttendanceData = async () => {
        setIsLoadingData(true);
        try {
          // Fetch all attendance records for this student
          const response = await fetch(`/api/attendance?studentId=${student._id}`);
          if (!response.ok) throw new Error('Failed to fetch attendance data');
          const attendanceRecords: AttendanceRecord[] = await response.json();

          // Calculate monthly attendance (last 6 months)
          const monthlyAttendance = calculateMonthlyAttendance(attendanceRecords);
          setMonthlyData(monthlyAttendance);

          // Calculate subject-wise attendance
          const subjectAttendance = calculateSubjectAttendance(attendanceRecords, studentClass);
          setSubjectData(subjectAttendance);
        } catch (error) {
          console.error('Error fetching attendance data:', error);
          setMonthlyData([]);
          setSubjectData([]);
        } finally {
          setIsLoadingData(false);
        }
      };

      fetchAttendanceData();
    }
  }, [isOpen, student, studentClass]);

  const calculateMonthlyAttendance = (records: AttendanceRecord[]) => {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyStats: { [key: string]: { present: number; total: number } } = {};

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`;
      monthlyStats[monthKey] = { present: 0, total: 0 };
    }

    records.forEach(record => {
      const recordDate = new Date(record.date);
      const monthKey = `${months[recordDate.getMonth()]} ${recordDate.getFullYear()}`;
      
      if (monthlyStats[monthKey]) {
        monthlyStats[monthKey].total++;
        if (record.status === 'present' || record.status === 'late') {
          monthlyStats[monthKey].present++;
        }
      }
    });

    return Object.entries(monthlyStats).map(([month, stats]) => ({
      month: month.split(' ')[0],
      attendance: stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0
    }));
  };
  
  const calculateSubjectAttendance = (records: AttendanceRecord[], studentClass: Class | undefined) => {
    if (!studentClass || !studentClass.subjects || records.length === 0) {
      return [];
    }

    const subjectStats: { [key: string]: { present: number; total: number } } = {};
    studentClass.subjects.forEach(subject => {
      subjectStats[subject] = { present: 0, total: 0 };
    });

    records.forEach(record => {
        const classInfo = classes.find(c => c._id === record.classId);
        if (classInfo) {
            // This is a simplification. A real app would link attendance to a specific subject period.
            // Here, we assume attendance for a class applies to all its subjects for that day.
            classInfo.subjects.forEach(subject => {
                if (subjectStats[subject]) {
                    subjectStats[subject].total++;
                    if (record.status === 'present' || record.status === 'late') {
                        subjectStats[subject].present++;
                    }
                }
            });
        }
    });

    return Object.entries(subjectStats).map(([subject, stats]) => ({
      subject,
      attendance: stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Student Profile</DialogTitle>
          <DialogDescription>
            Detailed view of the student's record and performance.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1">
            <div className="space-y-6 p-1">
                <Card>
                    <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={student.profileImage} />
                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1 text-center sm:text-left">
                            <CardTitle className="text-2xl">{student.name}</CardTitle>
                            <CardDescription>Roll No: {student.rollNo}</CardDescription>
                            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground mt-2">
                                <div className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    <span>{student.email}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    <span>{student.phone}</span>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-4 text-sm">
                       <div>
                         <strong>Class:</strong> <Badge variant="outline">{getClassName(student.classId)}</Badge>
                       </div>
                        <div>
                         <strong>Status:</strong> <Badge variant={student.status === 'active' ? 'default' : 'destructive'}>{student.status}</Badge>
                       </div>
                        <div>
                         <strong>Overall Attendance:</strong> <Badge>{student.attendancePercentage}%</Badge>
                       </div>
                    </CardContent>
                </Card>

                {(student.attendancePercentage || 0) < 75 && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Low Attendance Warning</AlertTitle>
                        This student's attendance is below the 75% threshold.
                    </Alert>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Subject-wise Attendance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoadingData ? (
                                <div className="h-64 flex items-center justify-center">
                                    <Skeleton className="h-full w-full" />
                                </div>
                            ) : subjectData.length > 0 ? (
                                <ChartContainer config={chartConfig} className="h-64 w-full">
                                    <BarChart data={subjectData} margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="subject" />
                                        <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="attendance" fill="var(--color-attendance)" radius={4} />
                                    </BarChart>
                                </ChartContainer>
                            ) : (
                                <div className="h-64 flex items-center justify-center text-muted-foreground">
                                    No subject attendance data available
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Attendance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoadingData ? (
                                <div className="h-64 flex items-center justify-center">
                                    <Skeleton className="h-full w-full" />
                                </div>
                            ) : monthlyData.length > 0 ? (
                                <ChartContainer config={chartConfig} className="h-64 w-full">
                                    <BarChart data={monthlyData} margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="attendance" fill="var(--color-attendance)" radius={4} />
                                    </BarChart>
                                </ChartContainer>
                            ) : (
                                <div className="h-64 flex items-center justify-center text-muted-foreground">
                                    No monthly attendance data available
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
