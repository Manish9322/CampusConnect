
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AttendanceRecord, AttendanceStatus, Student } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { DatePickerWithRange } from "./date-picker-range";
import { useGetAttendanceQuery, useGetStudentsQuery, useGetTeachersQuery } from "@/services/api";
import { Skeleton } from "../ui/skeleton";

const statusVariant: { [key in AttendanceStatus]: "default" | "destructive" | "secondary" } = {
    present: "default",
    absent: "destructive",
    late: "secondary",
};

export function AttendanceDetails() {
  const [user, setUser] = React.useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
  // Mocking user login
  React.useEffect(() => {
    const loggedInUser: Student = {
        _id: '1',
        id: '1',
        studentId: 'S001',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: 'student',
        classId: 'C01', // Example classId
        rollNo: 'CS-001',
        phone: '123-456-7890',
        status: 'active',
        attendancePercentage: 95,
    };
    setUser(loggedInUser);
  }, []);
  
  // This is not efficient, but for the sake of getting all attendance for a student,
  // we are fetching all and then filtering. In a real-world scenario, you'd have a dedicated endpoint.
  const { data: allAttendance = [], isLoading: isLoadingAttendance } = useGetAttendanceQuery({}, { skip: !user });
  const { data: teachers = [], isLoading: isLoadingTeachers } = useGetTeachersQuery();
  const { data: students = [], isLoading: isLoadingStudents } = useGetStudentsQuery();

  const isLoading = isLoadingAttendance || isLoadingTeachers || isLoadingStudents || !user;

  const studentRecords = React.useMemo(() => {
    if (isLoading) return [];
    return allAttendance
      .filter((record: AttendanceRecord) => record.studentId === user?._id)
      .map((record: AttendanceRecord) => ({
        ...record,
        teacherName: teachers.find((t: any) => t._id === record.recordedBy)?.name || 'N/A'
      }));
  }, [allAttendance, user, teachers, isLoading]);


  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredRecords = studentRecords.filter(
    (record: any) =>
      record.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.teacherName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage);
  const paginatedRecords = filteredRecords.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setPage(0);
  };

  const renderTableBody = () => {
    if (isLoading) {
      return (
        [...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-5 w-24"/></TableCell>
            <TableCell><Skeleton className="h-5 w-20"/></TableCell>
            <TableCell><Skeleton className="h-5 w-32"/></TableCell>
            <TableCell className="text-right"><Skeleton className="h-6 w-20 ml-auto"/></TableCell>
          </TableRow>
        ))
      )
    }

    return paginatedRecords.map((record: any) => (
      <TableRow key={record._id}>
        <TableCell className="font-medium">{new Date(record.date).toLocaleDateString()}</TableCell>
        <TableCell>{record.course}</TableCell>
          <TableCell>{record.teacherName}</TableCell>
        <TableCell className="text-right">
          <Badge variant={statusVariant[record.status]} className={cn(
              record.status === 'present' && 'bg-green-600 text-white hover:bg-green-700',
              record.status === 'late' && 'bg-yellow-500 text-white hover:bg-yellow-600',
              record.status === 'absent' && 'bg-red-600 text-white hover:bg-red-700'
              )}>
              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
          </Badge>
        </TableCell>
      </TableRow>
    ))
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>My Attendance Details</CardTitle>
        <CardDescription>A detailed log of your attendance records.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                 <DatePickerWithRange className="w-full md:w-auto" />
                 <Input
                    placeholder="Search by subject..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full md:max-w-xs"
                />
            </div>
            <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
            </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Marked By</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderTableBody()}
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
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                    Page {page + 1} of {totalPages || 1}
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
