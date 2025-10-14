
"use client";

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
import { Student, Class } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Badge } from "../ui/badge";
import { Mail, Phone } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

interface StudentProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student;
  classes: Class[];
}

const monthlyData = [
  { month: "Jan", attendance: 88 },
  { month: "Feb", attendance: 92 },
  { month: "Mar", attendance: 95 },
  { month: "Apr", attendance: 93 },
  { month: "May", attendance: 85 },
  { month: "Jun", attendance: 97 },
];

const chartConfig = {
  attendance: {
    label: "Attendance (%)",
    color: "hsl(var(--primary))",
  },
};

export function StudentProfileDialog({ isOpen, onOpenChange, student, classes }: StudentProfileDialogProps) {
  if (!student) return null;

  const studentClass = classes.find(c => c._id === student.classId);
  const subjectData = studentClass?.subjects.map(subject => ({
    subject,
    attendance: Math.floor(Math.random() * (100 - 80 + 1) + 80) // Random attendance for now
  })) || [];

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
                            <CardDescription>Roll No: {student.rollNo} | Class: {studentClass?.name || 'N/A'}</CardDescription>
                            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
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
                    <CardContent>
                        <p>Overall Attendance: <Badge>{student.attendancePercentage}%</Badge></p>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Subject-wise Attendance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="h-64 w-full">
                                <BarChart data={subjectData} margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="subject" />
                                    <YAxis domain={[70, 100]} tickFormatter={(tick) => `${tick}%`} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="attendance" fill="var(--color-attendance)" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Attendance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="h-64 w-full">
                                <BarChart data={monthlyData} margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis domain={[70, 100]} tickFormatter={(tick) => `${tick}%`} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="attendance" fill="var(--color-attendance)" radius={4} />
                                </BarChart>
                            </ChartContainer>
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
