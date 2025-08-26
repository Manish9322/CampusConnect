
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { mockStudents, mockTeachers, mockClasses } from "@/lib/mock-data";
import { Progress } from "../ui/progress";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, Eye, User } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { EmptyState } from "../shared/empty-state";
import { ErrorState } from "../shared/error-state";
import { Student } from "@/lib/types";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { StudentProfileDialog } from "./student-profile-dialog";

type LoadingState = "loading" | "error" | "timeout" | "success";

export function ViewStudents() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [students, setStudents] = React.useState<Student[]>([]);
  const [loadingState, setLoadingState] = React.useState<LoadingState>("loading");
  const [selectedClass, setSelectedClass] = React.useState<string>("all");
  const [showLowAttendance, setShowLowAttendance] = React.useState(false);
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null);
  const [isProfileOpen, setProfileOpen] = React.useState(false);


  // Assuming the logged-in teacher is Dr. Alan Turing
  const teacher = mockTeachers.find((t) => t.name === "Dr. Alan Turing");
  const teacherClasses = teacher ? mockClasses.filter(c => teacher.courses.some(course => c.name.includes(course))) : [];

  const fetchStudents = React.useCallback(() => {
    setLoadingState("loading");
    // Simulate API call
    setTimeout(() => {
        const studentsInTeacherCourses = teacher
            ? mockStudents.filter((s) => s.major === teacher.department)
            : [];
        
        setStudents(studentsInTeacherCourses);
        setLoadingState("success");
    }, 1500);
  }, [teacher]);

  React.useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);


  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredStudents = students
    .filter((student) => {
        if (selectedClass === 'all') return true;
        // This is a simplified logic, in real-world you'd have a proper mapping
        return student.major === teacher?.department && teacherClasses.some(c => c.name.includes(student.major));
    })
    .filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((student) => {
        if (!showLowAttendance) return true;
        return student.attendancePercentage < 75;
    });

  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  const paginatedStudents = filteredStudents.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  const handleRowsPerPageChange = (value: string) => {
    if (value === "all") {
      setRowsPerPage(filteredStudents.length);
    } else {
      setRowsPerPage(Number(value));
    }
    setPage(0);
  };

  const handleViewProfile = (student: Student) => {
    setSelectedStudent(student);
    setProfileOpen(true);
  };
  
  const renderContent = () => {
    switch (loadingState) {
        case "loading":
            return (
                <div className="space-y-4">
                    {[...Array(rowsPerPage)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4 p-4 border rounded-md">
                           <Skeleton className="h-6 w-16" />
                           <Skeleton className="h-6 w-32" />
                           <Skeleton className="h-6 w-24" />
                           <Skeleton className="h-6 flex-1" />
                           <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                    ))}
                </div>
            )
        case "error":
            return <ErrorState type="error" title="Could Not Load Students" description="There was an issue fetching the student data. Please try again." onRetry={fetchStudents} />
        case "timeout":
            return <ErrorState type="timeout" title="Request Timed Out" description="Your request took too long to respond. Check your connection and try again." onRetry={fetchStudents} />
        case "success":
            if (paginatedStudents.length === 0) {
                 return <EmptyState title="No Students Found" description="There are no students matching your search criteria." />
            }
            return (
                 <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Roll No.</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>Attendance</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {paginatedStudents.map((student) => (
                            <TableRow key={student.id}>
                            <TableCell>{student.rollNo}</TableCell>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>{student.major}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                <Progress
                                    value={student.attendancePercentage}
                                    className="h-2 w-20"
                                />
                                <span>{student.attendancePercentage}%</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => handleViewProfile(student)}>
                                    <Eye className="h-4 w-4" />
                                </Button>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
            )
    }
  }

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>All Students</CardTitle>
        <CardDescription>
          A list of all students in your classes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {teacherClasses.map(c => (
                  <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Search by name or roll no..."
              value={searchTerm}
              onChange={handleSearch}
              className="max-w-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="low-attendance" checked={showLowAttendance} onCheckedChange={setShowLowAttendance} />
            <Label htmlFor="low-attendance">Show Low Attendance (&lt;75%)</Label>
          </div>
        </div>
        {renderContent()}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Rows per page
            </span>
            <Select
              onValueChange={handleRowsPerPageChange}
              defaultValue={`${rowsPerPage}`}
            >
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
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
    {selectedStudent && (
        <StudentProfileDialog
            isOpen={isProfileOpen}
            onOpenChange={setProfileOpen}
            student={selectedStudent}
        />
    )}
    </>
  );
}
