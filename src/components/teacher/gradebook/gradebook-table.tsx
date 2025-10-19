
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

  const [isGradingDialogOpen, setGradingDialogOpen] = React.useState(false);
  const [selectedGradeInfo, setSelectedGradeInfo] = React.useState<{ student: Student, grade: Grade, assignment: Assignment } | null>(null);

  const [updateGrade, { isLoading: isUpdatingGrade }] = useUpdateGradeMutation();
  const { toast } = useToast();

  const filteredStudentsForClass = students.filter(student => classFilter === 'all' || student.classId === classFilter);

  const filteredStudents = filteredStudentsForClass.filter(student =>
    (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.rollNo && student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  // Show ALL assignments for the selected class(es), not just those with submissions
  const filteredAssignments = React.useMemo(() => {
    const classFilteredAssignments = assignments.filter(assignment => 
      classFilter === 'all' || assignment.courseId === classFilter
    );
    
    // Count submissions for each assignment
    const submissionCounts = classFilteredAssignments.map(assignment => {
      const submissionCount = grades.filter(grade => 
        grade.assignmentId === assignment._id && 
        (grade.status === 'Submitted' || grade.status === 'Late')
      ).length;
      return {
        assignmentId: assignment._id,
        count: submissionCount
      };
    });
    
    console.log('Gradebook Debug:', {
      totalAssignments: assignments.length,
      classFilteredAssignments: classFilteredAssignments.length,
      totalGrades: grades.length,
      submissionCounts: submissionCounts,
      classFilter,
    });
    
    // Return all assignments sorted by due date
    return classFilteredAssignments.sort((a, b) => 
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
  }, [assignments, grades, classFilter]);

  const getStudentGrade = (studentId: string, assignmentId: string) => {
    return grades.find(g => g.studentId === studentId && g.assignmentId === assignmentId);
  };
  
  const getSubmissionCount = (assignmentId: string) => {
    return grades.filter(g => 
      g.assignmentId === assignmentId && 
      (g.status === 'Submitted' || g.status === 'Late')
    ).length;
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
    const studentGrades = grades.filter(g => g.studentId === studentId && g.marks !== null && studentAssignments.some(a => a._id === g.assignmentId));

    if(studentGrades.length === 0) return { score: "N/A", grade: "N/A"};

    const totalMarks = studentGrades.reduce((acc, grade) => {
        const assignment = assignments.find(a => a._id === grade.assignmentId);
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
                            const totalStudents = filteredStudents.length;
                            return (
                                <TableHead key={assignment._id} className="text-center min-w-36">
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="font-semibold">{assignment.title}</span>
                                        <span className="text-xs text-muted-foreground font-normal">
                                            {submissionCount}/{totalStudents} submitted
                                        </span>
                                    </div>
                                </TableHead>
                            );
                        })}
                        <TableHead className="text-right sticky right-0 bg-background z-10">Overall</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredStudents.map(student => (
                        <TableRow key={student._id}>
                            <TableCell className="font-medium sticky left-0 bg-background z-10">{student.name}</TableCell>
                            {filteredAssignments.map(assignment => {
                                const grade = getStudentGrade(student._id!, assignment._id);
                                return (
                                    <TableCell key={assignment._id} className="text-center">
                                        {grade ? (
                                            <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => handleViewSubmission(student, assignment)}>
                                                <span className={cn("font-semibold", grade.marks && grade.marks < (assignment.totalMarks / 2) && "text-destructive")}>{grade.marks !== null ? `${grade.marks}/${assignment.totalMarks}` : '-'}</span>
                                                <Badge className={cn("text-xs", statusColor[grade.status])}>{grade.status}</Badge>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground text-xs">Not Submitted</span>
                                        )}
                                    </TableCell>
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
