
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
import { Edit, PlusCircle, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { DeleteConfirmationDialog } from "../shared/delete-confirmation-dialog";
import { AddStudentDialog } from "./add-student-dialog";
import { Progress } from "../ui/progress";
import { Switch } from "../ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Badge } from "../ui/badge";

interface StudentsTableProps {
  students: Student[];
  majors: string[];
}

export function StudentsTable({ students: initialStudents, majors }: StudentsTableProps) {
  const [students, setStudents] = React.useState(initialStudents);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [studentToAction, setStudentToAction] = React.useState<Student | null>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [majorFilter, setMajorFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');


  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredStudents = students.filter(
    (student) =>
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (majorFilter === 'all' || student.major === majorFilter) &&
      (statusFilter === 'all' || student.status === statusFilter)
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
  
  const handleEdit = (student: Student) => {
    setStudentToAction(student);
    setAddDialogOpen(true);
  };

  const handleAdd = () => {
    setStudentToAction(null);
    setAddDialogOpen(true);
  };


  const openDeleteDialog = (student: Student) => {
    setStudentToAction(student);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (studentToAction) {
      setStudents(students.filter((s) => s.id !== studentToAction.id));
      setStudentToAction(null);
      setDeleteDialogOpen(false);
    }
  };
  
  const handleToggleStatus = (studentId: string, newStatus: boolean) => {
    setStudents(
      students.map((s) =>
        s.id === studentId ? { ...s, status: newStatus ? "active" : "inactive" } : s
      )
    );
  };
  
  const handleSaveStudent = (studentData: any) => {
    // This is where you would handle saving the data, for now, we'll just update the local state
    console.log("Saving student:", studentData);
    setAddDialogOpen(false);
  };

  const isFiltered = majorFilter !== 'all' || statusFilter !== 'all';

  const clearFilters = () => {
    setMajorFilter('all');
    setStatusFilter('all');
    setSearchTerm('');
  };


  return (
    <>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <div className="flex flex-wrap items-center gap-4">
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={handleSearch}
              className="max-w-sm"
            />
            <Select value={majorFilter} onValueChange={setMajorFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by major" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Majors</SelectItem>
                    {majors.map(major => (
                        <SelectItem key={major} value={major}>{major}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
             <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
            </Select>
            {isFiltered && <Button variant="ghost" onClick={clearFilters}><X className="mr-2 h-4 w-4" /> Clear Filters</Button>}
        </div>
        <Button onClick={handleAdd}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Student
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Roll No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Major</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.studentId}</TableCell>
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
                <TableCell>
                  <Switch
                    checked={student.status === 'active'}
                    onCheckedChange={(checked) => handleToggleStatus(student.id, checked)}
                    aria-label="Toggle student status"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(student)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(student)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
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
       <AddStudentDialog
        open={isAddDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSave={handleSaveStudent}
        studentData={studentToAction}
      />
      {studentToAction && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDelete}
          itemName={studentToAction.name}
        />
      )}
    </>
  );
}
