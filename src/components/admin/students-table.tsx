
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
import { Edit, PlusCircle, Trash2, ChevronLeft, ChevronRight, X, Eye, MessageSquare, UserCheck, Filter } from "lucide-react";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { SendNoteDialog } from "./send-note-dialog";
import { Slider } from "@/components/ui/slider";

interface StudentsTableProps {
  students: Student[];
  classes: Class[];
  isLoading: boolean;
}

export function StudentsTable({ students: initialStudents, classes, isLoading }: StudentsTableProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [studentToAction, setStudentToAction] = React.useState<Student | null>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [classFilter, setClassFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [isProfileOpen, setProfileOpen] = React.useState(false);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = React.useState(false);
  const [attendanceFilter, setAttendanceFilter] = React.useState<number[]>([0, 100]);
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);

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

  // Helper function to extract numeric value from roll number
  const extractNumericRollNo = (rollNo: string): number => {
    if (!rollNo) return 999999; // Put students without roll numbers at the end
    const match = rollNo.match(/\d+/);
    return match ? parseInt(match[0], 10) : 999999;
  };

  // Helper function to extract classId (handles both object and string)
  const getActualClassId = (classId: any): string => {
    if (typeof classId === 'object' && classId !== null && classId._id) {
      return classId._id;
    }
    return classId;
  };

  const filteredStudents = studentsWithRandomAttendance
    .filter(
      (student) =>
        (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.rollNo && student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (classFilter === 'all' || getActualClassId(student.classId) === classFilter) &&
        (statusFilter === 'all' || student.status === statusFilter) &&
        (student.attendancePercentage >= attendanceFilter[0] && student.attendancePercentage <= attendanceFilter[1])
    )
    .sort((a, b) => {
      const numA = extractNumericRollNo(a.rollNo);
      const numB = extractNumericRollNo(b.rollNo);
      return numA - numB;
    });

  const effectiveRowsPerPage = rowsPerPage === 999999 ? filteredStudents.length : rowsPerPage;
  const totalPages = Math.ceil(filteredStudents.length / effectiveRowsPerPage);
  const paginatedStudents = rowsPerPage === 999999 
    ? filteredStudents 
    : filteredStudents.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleRowsPerPageChange = (value: string) => {
    if (value === 'all') {
      setRowsPerPage(999999);
    } else {
      setRowsPerPage(Number(value));
    }
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

  const handleSendNote = (student: Student) => {
    setStudentToAction(student);
    setIsNoteDialogOpen(true);
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
  
  const generateRollNumber = (classId: string): string => {
    // Get all students in the same class
    const classStudents = studentsWithRandomAttendance.filter(s => s.classId === classId);
    
    if (classStudents.length === 0) {
      return "1";
    }

    // Extract numeric values from roll numbers
    const numericRollNos = classStudents
      .map(s => {
        const match = s.rollNo?.match(/\d+/);
        return match ? parseInt(match[0], 10) : null;
      })
      .filter(n => n !== null)
      .sort((a, b) => a! - b!);

    if (numericRollNos.length === 0) {
      return "1";
    }

    // Find the first gap in the sequence
    for (let i = 1; i <= numericRollNos[numericRollNos.length - 1]!; i++) {
      if (!numericRollNos.includes(i)) {
        return i.toString();
      }
    }

    // No gap found, return next number
    return (numericRollNos[numericRollNos.length - 1]! + 1).toString();
  };

  const handleSaveStudent = async (studentData: any) => {
    try {
        // Auto-generate roll number if not provided
        let rollNo = studentData.rollNo;
        if (!rollNo || rollNo.trim() === '') {
          rollNo = generateRollNumber(studentData.classId);
        }

        const payload = {
            ...studentData,
            rollNo,
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
              description: `${studentData.name} has been added with roll number ${rollNo}.` 
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

  const isFiltered = classFilter !== 'all' || statusFilter !== 'all' || searchTerm !== '' || attendanceFilter[0] !== 0 || attendanceFilter[1] !== 100;

  const clearFilters = () => {
    setClassFilter('all');
    setStatusFilter('all');
    setSearchTerm('');
    setAttendanceFilter([0, 100]);
  };
  
  const getClassName = (classId: any) => {
    if (typeof classId === 'object' && classId !== null && classId.name) {
      return classId.name;
    }
    return classes.find(c => c._id === classId)?.name || 'N/A';
  }

  const renderMobileCards = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-48 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (paginatedStudents.length === 0) {
      return (
        <div className="py-8">
          <EmptyState title="No Students Found" description="There are no students matching your criteria." />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {paginatedStudents.map((student) => (
          <Card key={student._id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-base">{student.name}</h3>
                    <Switch
                      checked={student.status === 'active'}
                      onCheckedChange={(checked) => handleToggleStatus(student, checked)}
                      aria-label="Toggle student status"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{student.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Roll No.</p>
                  <p className="font-medium">{student.rollNo}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Class</p>
                  <Badge variant="outline" className="text-xs">{getClassName(student.classId)}</Badge>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-muted-foreground text-xs mb-2">Attendance</p>
                <div className="flex items-center gap-2">
                  <Progress value={student.attendancePercentage} className="h-2 flex-1" />
                  <span className="text-sm font-medium">{student.attendancePercentage}%</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleViewProfile(student)}
                >
                  <Eye className="h-4 w-4 mr-1" /> View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleSendNote(student)}
                >
                  <MessageSquare className="h-4 w-4 mr-1" /> Note
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEdit(student)}
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDeleteDialog(student)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

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
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleViewProfile(student)} title="View Profile">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleSendNote(student)} title="Send Note">
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(student)} title="Edit">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openDeleteDialog(student)}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    )
  }


  return (
    <>
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
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
          <Button 
            variant="outline" 
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} 
            className="w-full sm:w-auto"
          >
            <Filter className="mr-2 h-4 w-4" /> 
            {showAdvancedFilters ? "Hide" : "More"} Filters
          </Button>
          {isFiltered && (
            <Button variant="ghost" onClick={clearFilters} className="w-full sm:w-auto">
              <X className="mr-2 h-4 w-4" /> Clear Filters
            </Button>
          )}
        </div>
        
        {showAdvancedFilters && (
          <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Attendance Range</label>
                <span className="text-sm text-muted-foreground">
                  {attendanceFilter[0]}% - {attendanceFilter[1]}%
                </span>
              </div>
              <Slider
                value={attendanceFilter}
                onValueChange={setAttendanceFilter}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredStudents.length} of {studentsWithRandomAttendance.length} students
          </div>
          <Button onClick={handleAdd} className="w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Student
          </Button>
        </div>
      </div>

      {isMobile ? (
        renderMobileCards()
      ) : (
        <div className="rounded-md border overflow-x-auto">
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
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page</span>
          <Select onValueChange={handleRowsPerPageChange} defaultValue={`${rowsPerPage}`}>
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder={`${rowsPerPage}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-1">
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
          <SendNoteDialog
            isOpen={isNoteDialogOpen}
            onClose={() => setIsNoteDialogOpen(false)}
            student={studentToAction ? {
              _id: studentToAction._id || '',
              name: studentToAction.name,
              email: studentToAction.email,
              rollNo: studentToAction.rollNo
            } : null}
            sender={{ name: "Admin", role: "admin" }}
          />
        </>
      )}
    </>
  );
}
