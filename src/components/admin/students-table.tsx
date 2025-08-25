
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
import { Edit, PlusCircle, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { DeleteConfirmationDialog } from "../shared/delete-confirmation-dialog";
import { AddStudentDialog } from "./add-student-dialog";
import { Progress } from "../ui/progress";
import { Switch } from "../ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";

interface StudentsTableProps {
  students: Student[];
}

export function StudentsTable({ students: initialStudents }: StudentsTableProps) {
  const [students, setStudents] = React.useState(initialStudents);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [studentToAction, setStudentToAction] = React.useState<Student | null>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
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


  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Search students..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-sm"
        />
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
              <TableHead>Phone</TableHead>
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
                <TableCell>{student.phone}</TableCell>
                <TableCell>{student.major}</TableCell>
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
