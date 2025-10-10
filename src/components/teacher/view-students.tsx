
"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Student } from "@/lib/types";
import { Edit, Trash2, ChevronLeft, ChevronRight, X, Eye } from "lucide-react";
import { mockStudents, mockTeachers, mockClasses } from "@/lib/mock-data";
import { Progress } from "../ui/progress";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { StudentProfileDialog } from "./student-profile-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "../shared/empty-state";

export function ViewStudents() {
  const [students, setStudents] = React.useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [classFilter, setClassFilter] = React.useState<string>("all");
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null);
  const [isProfileOpen, setProfileOpen] = React.useState(false);


  // Assuming the logged-in teacher is Dr. Alan Turing
  const teacher = mockTeachers.find((t) => t.name === "Alan Turing");
  const teacherClasses = teacher ? mockClasses.filter(c => teacher.courses.some(course => c.name.includes(course))) : [];


  React.useEffect(() => {
    const studentsInTeacherCourses = teacher
        ? mockStudents.filter((s) => s.major === teacher.department)
        : [];
    setStudents(studentsInTeacherCourses);
  }, [teacher]);


  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredStudents = students.filter(
    (student) =>
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (classFilter === 'all' || student.major === teacher?.department && teacherClasses.some(c => c.name === classFilter))
  );

  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  const paginatedStudents = filteredStudents.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleRowsPerPageChange = (value: string) => {
    if (value === 'all') {
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

  const isFiltered = classFilter !== 'all' || searchTerm !== '';

  const clearFilters = () => {
    setClassFilter('all');
    setSearchTerm('');
  };


  return (
    <>
      <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full sm:max-w-xs"
                    />
                    <Select value={classFilter} onValueChange={setClassFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by class" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Classes</SelectItem>
                             {teacherClasses.map(c => (
                                <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {isFiltered && <Button variant="ghost" onClick={clearFilters}><X className="mr-2 h-4 w-4" /> Clear Filters</Button>}
                </div>
            </div>
            {paginatedStudents.length > 0 ? (
            <>
                <div className="rounded-md border">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Roll No.</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
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
                            <TableCell>{student.email}</TableCell>
                            <TableCell><Badge variant="outline">{student.major}</Badge></TableCell>
                            <TableCell>
                            <div className="flex items-center gap-2">
                                <Progress value={student.attendancePercentage} className="h-2 w-20" />
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
                <div className="flex items-center justify-between mt-4">
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
                </div>
            </>
            ) : (
                <EmptyState title="No Students Found" description="There are no students matching your filter criteria." />
            )}
        </CardContent>
      </Card>
      {selectedStudent && (
        <StudentProfileDialog
          open={isProfileOpen}
          onOpenChange={setProfileOpen}
          student={selectedStudent}
        />
      )}
    </>
  );
}
