"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { mockStudents } from "@/lib/mock-data";
import { Student } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

type AttendanceState = {
  [studentId: string]: "present" | "absent" | "late";
};

export function AttendanceTool() {
  const [selectedCourse, setSelectedCourse] = useState("CS101");
  const [attendance, setAttendance] = useState<AttendanceState>({});
  const { toast } = useToast();

  const studentsInCourse = mockStudents.filter(s => s.major === 'Computer Science');

  const handleAttendanceChange = (studentId: string, status: "present" | "absent" | "late") => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = () => {
    const absentStudents = studentsInCourse.filter(
      (student) => attendance[student.id] === "absent"
    );

    if (absentStudents.length > 0) {
      toast({
        title: "Absence Notifications Sent",
        description: `Notifications sent to ${absentStudents.map(s => s.name).join(', ')}.`,
        variant: "default",
      });
    }

    toast({
        title: "Attendance Submitted",
        description: `Attendance for ${selectedCourse} has been successfully recorded.`,
    });
    setAttendance({});
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
                <CardTitle>Take Attendance</CardTitle>
                <CardDescription>Select a course and mark student attendance for today.</CardDescription>
            </div>
            <div className="mt-4 md:mt-0">
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="CS101">CS101 - Intro to Programming</SelectItem>
                        <SelectItem value="CS303">CS303 - Advanced Algorithms</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentsInCourse.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell className="text-right">
                    <RadioGroup
                      value={attendance[student.id] || "present"}
                      onValueChange={(value) => handleAttendanceChange(student.id, value as any)}
                      className="flex justify-end gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="present" id={`present-${student.id}`} />
                        <Label htmlFor={`present-${student.id}`}>Present</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="absent" id={`absent-${student.id}`} />
                        <Label htmlFor={`absent-${student.id}`}>Absent</Label>
                      </div>
                       <div className="flex items-center space-x-2">
                        <RadioGroupItem value="late" id={`late-${student.id}`} />
                        <Label htmlFor={`late-${student.id}`}>Late</Label>
                      </div>
                    </RadioGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end mt-6">
            <Button onClick={handleSubmit} className="bg-accent hover:bg-accent/90">
                <Send className="mr-2 h-4 w-4" />
                Submit Attendance
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
