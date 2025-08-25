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
import { Input } from "@/components/ui/input";
import { mockStudents, mockTeachers } from "@/lib/mock-data";
import { Progress } from "../ui/progress";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ViewStudents() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
  // Assuming the logged-in teacher is Dr. Alan Turing
  const teacher = mockTeachers.find(t => t.name === "Dr. Alan Turing");
  
  const studentsInTeacherCourses = teacher ? mockStudents.filter(s => s.major === teacher.department) : [];

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredStudents = studentsInTeacherCourses.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Students</CardTitle>
        <CardDescription>A list of all students in your classes.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
            <Input
              placeholder="Search by name or roll no..."
              value={searchTerm}
              onChange={handleSearch}
              className="max-w-sm"
            />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Attendance</TableHead>
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
                      <Progress value={student.attendancePercentage} className="h-2 w-20" />
                      <span>{student.attendancePercentage}%</span>
                    </div>
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
      </CardContent>
    </Card>
  );
}

// Dummy Card components for structure, assuming they are defined elsewhere
const Card = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="border rounded-lg shadow-sm" {...props}>{children}</div>
);
const CardHeader = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="p-6" {...props}>{children}</div>
);
const CardTitle = ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className="text-2xl font-semibold leading-none tracking-tight" {...props}>{children}</h3>
);
const CardDescription = ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-sm text-muted-foreground" {...props}>{children}</p>
);
const CardContent = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="p-6 pt-0" {...props}>{children}</div>
);
