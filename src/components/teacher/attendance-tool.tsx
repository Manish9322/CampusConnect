
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockStudents } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { Send, ChevronLeft, ChevronRight } from "lucide-react";
import { AttendanceStatus, Student } from "@/lib/types";
import { cn } from "@/lib/utils";

type AttendanceState = {
  [studentId: string]: AttendanceStatus;
};

const statusCycle: AttendanceStatus[] = ['present', 'late', 'absent'];

const statusConfig: { [key in AttendanceStatus]: { text: string; className: string } } = {
  present: { text: "Present", className: "bg-green-600 hover:bg-green-700 text-white border-green-600" },
  late: { text: "Late", className: "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500" },
  absent: { text: "Absent", className: "bg-destructive hover:bg-destructive/90 text-destructive-foreground border-destructive" },
};

const ThreeStateToggle = ({ status, onChange }: { status: AttendanceStatus, onChange: (newStatus: AttendanceStatus) => void }) => {
  const handleClick = () => {
    const currentIndex = statusCycle.indexOf(status);
    const nextIndex = (currentIndex + 1) % statusCycle.length;
    onChange(statusCycle[nextIndex]);
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className={cn("w-24 transition-colors duration-200", statusConfig[status].className)}
    >
      {statusConfig[status].text}
    </Button>
  );
};


export function AttendanceTool() {
  const [selectedCourse, setSelectedCourse] = useState("CS101");
  const [attendance, setAttendance] = useState<AttendanceState>({});
  const { toast } = useToast();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const studentsInCourse = mockStudents.filter(s => s.major === 'Computer Science');

  const getInitialAttendance = (students: Student[]): AttendanceState => {
    const initialState: AttendanceState = {};
    students.forEach(student => {
      initialState[student.id] = 'present';
    });
    return initialState;
  };

  useState(() => {
    setAttendance(getInitialAttendance(studentsInCourse));
  });
  
  const totalPages = Math.ceil(studentsInCourse.length / rowsPerPage);
  const paginatedStudents = studentsInCourse.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleRowsPerPageChange = (value: string) => {
    if (value === 'all') {
        setRowsPerPage(studentsInCourse.length);
    } else {
        setRowsPerPage(Number(value));
    }
    setPage(0);
  };

  const handleAttendanceChange = (studentId: string, status: AttendanceStatus) => {
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
    setAttendance(getInitialAttendance(studentsInCourse));
  };
  
  const markAll = (status: AttendanceStatus) => {
    const newAttendance: AttendanceState = {};
    studentsInCourse.forEach(student => {
      newAttendance[student.id] = status;
    });
    setAttendance(newAttendance);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <CardTitle>Take Attendance</CardTitle>
                <CardDescription>Select a course and mark student attendance for today.</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
                 <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="CS101">CS101 - Intro to Programming</SelectItem>
                        <SelectItem value="CS303">CS303 - Advanced Algorithms</SelectItem>
                    </SelectContent>
                </Select>
                 <div className="flex w-full sm:w-auto items-center gap-2">
                    <Button variant="outline" className="w-full" onClick={() => markAll('present')}>All Present</Button>
                    <Button variant="outline" className="w-full" onClick={() => markAll('absent')}>All Absent</Button>
                 </div>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.rollNo}</TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell className="text-right">
                    <ThreeStateToggle 
                        status={attendance[student.id] || 'present'}
                        onChange={(newStatus) => handleAttendanceChange(student.id, newStatus)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
         <div className="flex items-center justify-between mt-4 flex-wrap gap-4">
            <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Rows per page</span>
                <Select onValueChange={handleRowsPerPageChange} defaultValue={`${rowsPerPage}`}>
                    <SelectTrigger className="w-20">
                        <SelectValue placeholder={`${rowsPerPage}`} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="all">All</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                    Page {page + 1} of {totalPages}
                </span>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
             <Button onClick={handleSubmit} className="bg-accent hover:bg-accent/90 w-full sm:w-auto">
                <Send className="mr-2 h-4 w-4" />
                Submit Attendance
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
