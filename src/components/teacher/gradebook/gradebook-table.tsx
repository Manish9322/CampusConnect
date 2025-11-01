
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
import { Button } from "@/components/ui/button";
import { Assignment, Class, Grade, Student, SubmissionStatus } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { GradeSubmissionDialog } from "./grade-submission-dialog";
import { useUpdateGradeMutation } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GradebookTableProps {
  students: Student[];
  assignments: Assignment[];
  grades: Grade[];
  classes: Class[];
  onGradeUpdate: () => void;
}

const statusColor: { [key in SubmissionStatus]: string } = {
    'Submitted': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    'Late': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

export function GradebookTable({ students, assignments, grades, classes, onGradeUpdate }: GradebookTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [classFilter, setClassFilter] = React.useState<string>(classes[0]?._id || "all");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [isGradingDialogOpen, setGradingDialogOpen] = React.useState(false);
  const [selectedGradeInfo, setSelectedGradeInfo] = React.useState<{ student: Student, grade: Grade, assignment: Assignment } | null>(null);

  const [updateGrade, { isLoading: isUpdatingGrade }] = useUpdateGradeMutation();
  const { toast } = useToast();

  const filteredStudentsForClass = students.filter(student => {
    if (classFilter === 'all') return true;
    // Handle both string and object ID comparisons
    const studentClassId = typeof student.classId === 'object' ? (student.classId as any)?._id : student.classId;
    return studentClassId === classFilter || studentClassId?.toString() === classFilter?.toString();
  });

  const filteredStudents = filteredStudentsForClass.filter(student =>
    (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.rollNo && student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())))
  );
  
  console.log('Filtered Students Debug:', {
    totalStudentsPassed: students.length,
    classFilter,
    studentsAfterClassFilter: filteredStudentsForClass.length,
    studentsAfterSearch: filteredStudents.length,
    sampleStudent: students[0] ? {
      id: students[0]._id,
      name: students[0].name,
      classId: students[0].classId
    } : null
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  const paginatedStudents = filteredStudents.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setPage(0);
  };

  // Reset page when search or filter changes
  React.useEffect(() => {
    setPage(0);
  }, [searchTerm, classFilter]);

  // Filter assignments based on selected class
  const filteredAssignments = React.useMemo(() => {
    // Filter assignments by class selection
    const classFilteredAssignments = assignments.filter(assignment => {
      return classFilter === 'all' || assignment.courseId === classFilter;
    });
    
    // Get submission statistics for debugging
    const submittedAssignmentIds = new Set(
      grades
        .filter(grade => {
          const gradeStudentId = typeof grade.studentId === 'object' ? (grade.studentId as any)?._id : grade.studentId;
          return filteredStudentsForClass.some(s => s._id === gradeStudentId || s._id?.toString() === gradeStudentId?.toString());
        })
        .map(grade => {
          const gradeAssignmentId = typeof grade.assignmentId === 'object' ? (grade.assignmentId as any)?._id : grade.assignmentId;
          return gradeAssignmentId;
        })
    );
    
    console.log('=== GRADEBOOK DEBUG ===');
    console.log('Assignments:', {
      total: assignments.length,
      classFiltered: classFilteredAssignments.length,
      assignmentIds: classFilteredAssignments.map(a => ({ id: a._id, title: a.title, courseId: a.courseId })),
    });
    console.log('Students:', {
      total: filteredStudentsForClass.length,
      studentIds: filteredStudentsForClass.map(s => ({ id: s._id, name: s.name, classId: s.classId })),
    });
    console.log('Grades:', {
      total: grades.length,
      allGrades: grades.map(g => ({ 
        studentId: typeof g.studentId === 'object' ? (g.studentId as any)?._id : g.studentId,
        assignmentId: typeof g.assignmentId === 'object' ? (g.assignmentId as any)?._id : g.assignmentId,
        status: g.status,
        marks: g.marks 
      })),
      submittedAssignmentIds: Array.from(submittedAssignmentIds),
    });
    console.log('Filter:', { classFilter });
    
    // Return assignments sorted by due date
    return classFilteredAssignments.sort((a, b) => 
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
  }, [assignments, grades, classFilter, filteredStudentsForClass]);

  const getStudentGrade = (studentId: string, assignmentId: string) => {
    const grade = grades.find(g => {
      // Handle both string and object ID comparisons
      const gradeStudentId = typeof g.studentId === 'object' ? (g.studentId as any)?._id : g.studentId;
      const gradeAssignmentId = typeof g.assignmentId === 'object' ? (g.assignmentId as any)?._id : g.assignmentId;
      
      return (gradeStudentId === studentId || gradeStudentId === studentId.toString()) && 
             (gradeAssignmentId === assignmentId || gradeAssignmentId === assignmentId.toString());
    });
    
    if (grade) {
      console.log('Found grade match:', { studentId, assignmentId, gradeStudentId: grade.studentId, gradeAssignmentId: grade.assignmentId });
    }
    
    return grade;
  };
  
  const getSubmissionCount = (assignmentId: string) => {
    return grades.filter(g => {
      const gradeAssignmentId = typeof g.assignmentId === 'object' ? (g.assignmentId as any)?._id : g.assignmentId;
      return (gradeAssignmentId === assignmentId || gradeAssignmentId === assignmentId.toString()) &&
             (g.status === 'Submitted' || g.status === 'Late');
    }).length;
  };
  
  const handleViewSubmission = (student: Student, assignment: Assignment) => {
    const grade = getStudentGrade(student._id!, assignment._id);
    if(grade) {
        setSelectedGradeInfo({ student, grade, assignment });
        setGradingDialogOpen(true);
    }
  };

  const handleSaveGrade = async (updatedGrade: Grade) => {
    try {
        await updateGrade(updatedGrade).unwrap();
        onGradeUpdate();
        toast({
            title: "Grade Updated",
            description: `Grade for ${selectedGradeInfo?.student.name} has been successfully updated.`,
        });
        setGradingDialogOpen(false);
    } catch(error) {
        toast({
            title: "Update Failed",
            description: "There was an error updating the grade.",
            variant: "destructive"
        })
    }
  };

  const calculateOverall = (studentId: string) => {
    const studentAssignments = filteredAssignments.filter(a => a.courseId === students.find(s => s._id === studentId)?.classId);
    
    const studentGrades = grades.filter(g => {
      const gradeStudentId = typeof g.studentId === 'object' ? (g.studentId as any)?._id : g.studentId;
      const gradeAssignmentId = typeof g.assignmentId === 'object' ? (g.assignmentId as any)?._id : g.assignmentId;
      
      return (gradeStudentId === studentId || gradeStudentId === studentId.toString()) && 
             g.marks !== null && 
             studentAssignments.some(a => a._id === gradeAssignmentId || a._id === gradeAssignmentId.toString());
    });

    if(studentGrades.length === 0) return { score: "N/A", grade: "N/A"};

    const totalMarks = studentGrades.reduce((acc, grade) => {
        const gradeAssignmentId = typeof grade.assignmentId === 'object' ? (grade.assignmentId as any)?._id : grade.assignmentId;
        const assignment = assignments.find(a => a._id === gradeAssignmentId || a._id === gradeAssignmentId.toString());
        return acc + (assignment?.totalMarks || 0);
    }, 0);
    const earnedMarks = studentGrades.reduce((acc, grade) => acc + (grade.marks || 0), 0);

    if (totalMarks === 0) return { score: "N/A", grade: "N/A"};

    const percentage = (earnedMarks / totalMarks) * 100;
    let letterGrade = 'F';
    if(percentage >= 90) letterGrade = 'A';
    else if(percentage >= 80) letterGrade = 'B';
    else if(percentage >= 70) letterGrade = 'C';
    else if(percentage >= 60) letterGrade = 'D';

    return { score: `${percentage.toFixed(1)}%`, grade: letterGrade };
  }

  return (
    <>
      <Card>
        <CardHeader>
            <CardTitle>Student Gradebook</CardTitle>
            <CardDescription>View, enter, and edit grades for all students and assignments.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <Input
              placeholder="Search by student name or roll no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:max-w-sm"
            />
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by class"/>
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">All My Classes</SelectItem>
                  {classes.map(c => <SelectItem key={c._id} value={c._id!}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
      
          {(filteredStudents.length === 0 || filteredAssignments.length === 0) ? (
            <EmptyState 
                title={filteredStudents.length === 0 ? "No Students Found" : "No Assignments Yet"}
                description={
                  filteredStudents.length === 0 
                    ? "There are no students in the selected class." 
                    : "No assignments have been created yet for this class. Create assignments first."
                }
            />
          ) : (
          <>
            <div className="rounded-md border overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="sticky left-0 bg-background z-10 min-w-40">Student Name</TableHead>
                        {filteredAssignments.map(assignment => {
                            const submissionCount = getSubmissionCount(assignment._id);
                            const totalStudents = filteredStudentsForClass.length;
                            return (
                                <React.Fragment key={assignment._id}>
                                    <TableHead className="text-center min-w-28">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="font-semibold">{assignment.title}</span>
                                            <span className="text-xs text-muted-foreground font-normal">
                                                Marks ({submissionCount}/{totalStudents})
                                            </span>
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-center min-w-24">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="font-semibold">Status</span>
                                        </div>
                                    </TableHead>
                                </React.Fragment>
                            );
                        })}
                        <TableHead className="text-right sticky right-0 bg-background z-10 min-w-24">Overall</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedStudents.map(student => (
                        <TableRow key={student._id}>
                            <TableCell className="font-medium sticky left-0 bg-background z-10">{student.name}</TableCell>
                            {filteredAssignments.map(assignment => {
                                const grade = getStudentGrade(student._id!, assignment._id);
                                return (
                                    <React.Fragment key={assignment._id}>
                                        <TableCell className="text-center cursor-pointer hover:bg-muted/50" onClick={() => grade && handleViewSubmission(student, assignment)}>
                                            {grade ? (
                                                <span className={cn("font-semibold", grade.marks && grade.marks < (assignment.totalMarks / 2) && "text-destructive")}>
                                                    {grade.marks !== null ? `${grade.marks}/${assignment.totalMarks}` : '-'}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground text-xs">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {grade ? (
                                                <Badge className={cn("text-xs", statusColor[grade.status])}>
                                                    {grade.status}
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-xs">
                                                    Not Submitted
                                                </Badge>
                                            )}
                                        </TableCell>
                                    </React.Fragment>
                                )
                            })}
                            <TableCell className="text-right sticky right-0 bg-background z-10">
                                <div className="flex flex-col items-end">
                                    <span className="font-bold text-lg">{calculateOverall(student._id!).grade}</span>
                                    <span className="text-xs text-muted-foreground">{calculateOverall(student._id!).score}</span>
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
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                        Page {totalPages > 0 ? page + 1 : 0} of {totalPages || 1}
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
                        disabled={page >= totalPages - 1 || totalPages === 0}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
           </>
          )}
        </CardContent>
      </Card>

      {selectedGradeInfo && (
        <GradeSubmissionDialog
          open={isGradingDialogOpen}
          onOpenChange={setGradingDialogOpen}
          student={selectedGradeInfo.student}
          assignment={selectedGradeInfo.assignment}
          grade={selectedGradeInfo.grade}
          onSave={handleSaveGrade}
          isSaving={isUpdatingGrade}
        />
      )}
    </>
  );
}
