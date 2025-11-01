
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
import { Student, Class, Teacher } from "@/lib/types";
import { Eye, ChevronLeft, ChevronRight, X } from "lucide-react";
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
import { Skeleton } from "../ui/skeleton";

interface ViewStudentsProps {
    teacherClasses: Class[];
    teacherStudents: Student[];
    isLoading: boolean;
}

export function ViewStudents({ teacherClasses, teacherStudents, isLoading }: ViewStudentsProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [classFilter, setClassFilter] = React.useState<string>("all");
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null);
  const [isProfileOpen, setProfileOpen] = React.useState(false);

  const studentsWithAttendance = React.useMemo(() => {
    return teacherStudents.map(student => ({
      ...student,
      attendancePercentage: student.attendancePercentage || Math.floor(Math.random() * (100 - 70 + 1) + 70)
    }));
  }, [teacherStudents]);

  const filteredStudents = studentsWithAttendance.filter(
    (student) =>
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.rollNo && student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (classFilter === 'all' || student.classId === classFilter)
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
  
  const getClassName = (classId: string) => {
    return teacherClasses.find(c => c._id === classId)?.name || 'N/A';
  }
  
  const renderTableBody = () => {
    if(isLoading) {
        return (
            <TableBody>
                {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        )
    }

    if(paginatedStudents.length === 0) {
        return (
            <TableBody>
                <TableRow>
                    <TableCell colSpan={6}>
                        <EmptyState title="No Students Found" description="There are no students matching your filter criteria." />
                    </TableCell>
                </TableRow>
            </TableBody>
        )
    }

    return (
        <TableBody>
            {paginatedStudents.map((student) => (
            <TableRow key={student._id}>
                <TableCell>{student.rollNo}</TableCell>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell><Badge variant="outline">{getClassName(student.classId)}</Badge></TableCell>
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
    )
  }

  return (
    <>
      <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:max-w-xs"
                    />
                    <Select value={classFilter} onValueChange={setClassFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by class" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Classes</SelectItem>
                             {teacherClasses.map(c => (
                                <SelectItem key={c._id} value={c._id!}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {isFiltered && <Button variant="ghost" onClick={clearFilters}><X className="mr-2 h-4 w-4" /> Clear Filters</Button>}
                </div>
            </div>
            
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
                {renderTableBody()}
                </Table>
            </div>
            {paginatedStudents.length > 0 && (
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
            )}
        </CardContent>
      </Card>
      {selectedStudent && (
        <StudentProfileDialog
          open={isProfileOpen}
          onOpenChange={setProfileOpen}
          student={selectedStudent}
          classes={teacherClasses}
        />
      )}
    </>
  );
}
