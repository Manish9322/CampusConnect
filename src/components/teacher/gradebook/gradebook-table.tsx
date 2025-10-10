
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

interface GradebookTableProps {
  students: Student[];
  assignments: Assignment[];
  grades: Grade[];
  classes: Class[];
}

const statusColor: { [key in SubmissionStatus]: string } = {
    'Submitted': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    'Late': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

export function GradebookTable({ students, assignments, grades: initialGrades, classes }: GradebookTableProps) {
  const [grades, setGrades] = React.useState(initialGrades);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [classFilter, setClassFilter] = React.useState<string>(classes[0]?.name || "all");

  const [isGradingDialogOpen, setGradingDialogOpen] = React.useState(false);
  const [selectedGrade, setSelectedGrade] = React.useState<{ student: Student, grade: Grade, assignment: Assignment } | null>(null);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAssignments = assignments.filter(assignment => classFilter === 'all' || assignment.courseName === classFilter);

  const getStudentGrade = (studentId: string, assignmentId: string) => {
    return grades.find(g => g.studentId === studentId && g.assignmentId === assignmentId);
  };
  
  const handleViewSubmission = (student: Student, assignment: Assignment) => {
    const grade = getStudentGrade(student.id, assignment.id);
    if(grade) {
        setSelectedGrade({ student, grade, assignment });
        setGradingDialogOpen(true);
    }
  };

  const handleSaveGrade = (updatedGrade: Grade) => {
    setGrades(grades.map(g => g.studentId === updatedGrade.studentId && g.assignmentId === updatedGrade.assignmentId ? updatedGrade : g));
    setGradingDialogOpen(false);
  };

  const calculateOverall = (studentId: string) => {
    const studentGrades = grades.filter(g => g.studentId === studentId && g.marks !== null);
    if(studentGrades.length === 0) return { score: "N/A", grade: "N/A"};

    const totalMarks = studentGrades.reduce((acc, grade) => {
        const assignment = assignments.find(a => a.id === grade.assignmentId);
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
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
      
          {filteredStudents.length === 0 ? (
            <EmptyState 
                title="No Students Found"
                description="There are no students matching your search criteria."
            />
          ) : (
          <>
            <div className="rounded-md border overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="sticky left-0 bg-background z-10 min-w-40">Student Name</TableHead>
                        {filteredAssignments.map(assignment => (
                            <TableHead key={assignment.id} className="text-center">{assignment.title}</TableHead>
                        ))}
                        <TableHead className="text-right sticky right-0 bg-background z-10">Overall</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredStudents.map(student => (
                        <TableRow key={student.id}>
                            <TableCell className="font-medium sticky left-0 bg-background z-10">{student.name}</TableCell>
                            {filteredAssignments.map(assignment => {
                                const grade = getStudentGrade(student.id, assignment.id);
                                return (
                                    <TableCell key={assignment.id} className="text-center">
                                        {grade ? (
                                            <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => handleViewSubmission(student, assignment)}>
                                                <span className={cn("font-semibold", grade.marks && grade.marks < (assignment.totalMarks / 2) && "text-destructive")}>{grade.marks !== null ? `${grade.marks}/${assignment.totalMarks}` : '-'}</span>
                                                <Badge className={cn("text-xs", statusColor[grade.status])}>{grade.status}</Badge>
                                            </div>
                                        ) : (
                                            <span>-</span>
                                        )}
                                    </TableCell>
                                )
                            })}
                            <TableCell className="text-right sticky right-0 bg-background z-10">
                                <div className="flex flex-col items-end">
                                    <span className="font-bold text-lg">{calculateOverall(student.id).grade}</span>
                                    <span className="text-xs text-muted-foreground">{calculateOverall(student.id).score}</span>
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

      {selectedGrade && (
        <GradeSubmissionDialog
          open={isGradingDialogOpen}
          onOpenChange={setGradingDialogOpen}
          student={selectedGrade.student}
          assignment={selectedGrade.assignment}
          grade={selectedGrade.grade}
          onSave={handleSaveGrade}
        />
      )}
    </>
  );
}
