
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
import { Student, Class } from "@/lib/types";
import { Edit, PlusCircle, Trash2, ChevronLeft, ChevronRight, X, Eye } from "lucide-react";
import { DeleteConfirmationDialog } from "../shared/delete-confirmation-dialog";
import { AddStudentDialog } from "./add-student-dialog";
import { Progress } from "../ui/progress";
import { Switch } from "../ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Badge } from "../ui/badge";
import { useAddStudentMutation, useDeleteStudentMutation, useUpdateStudentMutation } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";
import { EmptyState } from "../shared/empty-state";
import { StudentProfileDialog } from "./student-profile-dialog";

interface StudentsTableProps {
  students: Student[];
  classes: Class[];
  isLoading: boolean;
}

export function StudentsTable({ students: initialStudents, classes, isLoading }: StudentsTableProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [studentToAction, setStudentToAction] = React.useState<Student | null>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [classFilter, setClassFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [isProfileOpen, setProfileOpen] = React.useState(false);

  const [addStudent] = useAddStudentMutation();
  const [updateStudent] = useUpdateStudentMutation();
  const [deleteStudent] = useDeleteStudentMutation();
  
  // Debug logging
  console.log('StudentsTable - initialStudents:', initialStudents);
  console.log('StudentsTable - initialStudents length:', initialStudents?.length);
  console.log('StudentsTable - classes:', classes);
  console.log('StudentsTable - isLoading:', isLoading);

  const studentsWithRandomAttendance = React.useMemo(() => {
    return initialStudents.map(student => ({
      ...student,
      attendancePercentage: student.attendancePercentage || Math.floor(Math.random() * (100 - 70 + 1) + 70) // Random value between 70 and 100
    }));
  }, [initialStudents]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredStudents = studentsWithRandomAttendance.filter(
    (student) =>
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.rollNo && student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (classFilter === 'all' || student.classId === classFilter) &&
      (statusFilter === 'all' || student.status === statusFilter)
  );

  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  const paginatedStudents = filteredStudents.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setPage(0);
  };
  
  const handleEdit = (student: Student) => {
    setStudentToAction(student);
    setAddDialogOpen(true);
  };

  const handleViewProfile = (student: Student) => {
    setStudentToAction(student);
    setProfileOpen(true);
  };

  const handleAdd = () => {
    setStudentToAction(null);
    setAddDialogOpen(true);
  };

  const openDeleteDialog = (student: Student) => {
    setStudentToAction(student);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (studentToAction) {
      try {
        await deleteStudent(studentToAction._id).unwrap();
        toast({ title: "Student Deleted", description: `Student ${studentToAction.name} has been deleted.` });
        setDeleteDialogOpen(false);
      } catch {
        toast({ title: "Error deleting student", variant: "destructive" });
      }
    }
  };
  
  const handleToggleStatus = async (student: Student, newStatus: boolean) => {
    try {
      await updateStudent({ ...student, status: newStatus ? "active" : "inactive" }).unwrap();
      toast({ title: "Status Updated", description: `${student.name}'s status has been updated.` });
    } catch {
      toast({ title: "Error updating status", variant: "destructive" });
    }
  };
  
  const handleSaveStudent = async (studentData: any) => {
    try {
        const payload = {
            ...studentData,
            role: 'student',
            studentId: studentToAction?.studentId || `SID${Date.now()}`
        };

        if(studentToAction) {
            if (!payload.password) {
                delete payload.password;
            }
            await updateStudent({ _id: studentToAction._id, ...payload }).unwrap();
            toast({ 
              title: "Student Updated", 
              description: `Details for ${studentData.name} have been updated.` 
            });
        } else {
            await addStudent(payload).unwrap();
            toast({ 
              title: "Student Added", 
              description: `${studentData.name} has been added to the system.` 
            });
        }
    } catch (error) {
        toast({ 
          title: "Error",
          description: "An error occurred while saving the student.", 
          variant: "destructive" 
        });
    }
  };

  const isFiltered = classFilter !== 'all' || statusFilter !== 'all' || searchTerm !== '';

  const clearFilters = () => {
    setClassFilter('all');
    setStatusFilter('all');
    setSearchTerm('');
  };
  
  const getClassName = (classId: any) => {
    if (typeof classId === 'object' && classId !== null && classId.name) {
      return classId.name;
    }
    return classes.find(c => c._id === classId)?.name || 'N/A';
  }

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-5 w-20" /></TableCell>
              <TableCell><Skeleton className="h-5 w-32" /></TableCell>
              <TableCell><Skeleton className="h-5 w-40" /></TableCell>
              <TableCell><Skeleton className="h-5 w-24" /></TableCell>
              <TableCell><Skeleton className="h-5 w-24" /></TableCell>
              <TableCell><Skeleton className="h-6 w-11" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    }

    if (paginatedStudents.length === 0) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              <EmptyState title="No Students Found" description="There are no students matching your criteria." />
            </TableCell>
          </TableRow>
        </TableBody>
      );
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
            <TableCell>
              <Switch
                checked={student.status === 'active'}
                onCheckedChange={(checked) => handleToggleStatus(student, checked)}
                aria-label="Toggle student status"
              />
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" onClick={() => handleViewProfile(student)}>
                <Eye className="h-4 w-4" />
              </Button>
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
    )
  }


  return (
    <>
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
                    {classes.map((c: Class) => (
                        <SelectItem key={c._id} value={c._id!}>{c.name}</SelectItem>
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
        <Button onClick={handleAdd} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Student
        </Button>
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
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          {renderTableBody()}
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
        <>
          <DeleteConfirmationDialog
            open={isDeleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={handleDelete}
            itemName={studentToAction.name}
          />
          <StudentProfileDialog
            isOpen={isProfileOpen}
            onOpenChange={setProfileOpen}
            student={studentToAction}
            classes={classes}
          />
        </>
      )}
    </>
  );
}
