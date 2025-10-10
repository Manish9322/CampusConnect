
"use client";

import * as React from "react";
import { Assignment, Grade, SubmissionStatus } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, Upload, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/empty-state";
import { SubmitAssignmentDialog } from "./submit-assignment-dialog";
import { useToast } from "@/hooks/use-toast";

interface AssignmentsListProps {
  assignments: Assignment[];
  grades: Grade[];
}

const statusConfig: { [key in SubmissionStatus]: { icon: React.ElementType, className: string } } = {
    'Submitted': { icon: CheckCircle, className: 'text-green-600' },
    'Pending': { icon: Clock, className: 'text-yellow-600' },
    'Late': { icon: Clock, className: 'text-red-600' },
};

export function AssignmentsList({ assignments, grades: initialGrades }: AssignmentsListProps) {
    const [grades, setGrades] = React.useState(initialGrades);
    const [isSubmitOpen, setSubmitOpen] = React.useState(false);
    const [selectedAssignment, setSelectedAssignment] = React.useState<Assignment | null>(null);
    const { toast } = useToast();

    const getGradeInfo = (assignmentId: string) => {
        return grades.find(g => g.assignmentId === assignmentId);
    };

    const handleOpenSubmit = (assignment: Assignment) => {
        setSelectedAssignment(assignment);
        setSubmitOpen(true);
    };

    const handleSubmitAssignment = (file: File) => {
        if (!selectedAssignment) return;
        
        const updatedGrade: Grade = {
            studentId: '1', // Mock student
            assignmentId: selectedAssignment.id,
            marks: null,
            status: new Date() > new Date(selectedAssignment.dueDate) ? 'Late' : 'Submitted',
            submittedAt: new Date().toISOString(),
            submissionUrl: URL.createObjectURL(file),
        };

        setGrades(prev => {
            const existing = prev.find(g => g.assignmentId === selectedAssignment.id);
            if(existing) {
                return prev.map(g => g.assignmentId === selectedAssignment.id ? updatedGrade : g);
            }
            return [...prev, updatedGrade];
        });

        toast({
            title: "Assignment Submitted!",
            description: `Your work for "${selectedAssignment.title}" has been submitted.`,
        });

        setSubmitOpen(false);
    };


    const renderAssignmentCard = (assignment: Assignment) => {
        const gradeInfo = getGradeInfo(assignment.id);
        const status = gradeInfo?.status || 'Pending';
        const StatusIcon = statusConfig[status].icon;

        return (
            <Card key={assignment.id} className="flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-start gap-2">
                        <CardTitle>{assignment.title}</CardTitle>
                        <Badge variant="secondary">{assignment.courseName}</Badge>
                    </div>
                    <CardDescription>Due: {new Date(assignment.dueDate).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-2">
                    <p className="text-sm text-muted-foreground line-clamp-2">{assignment.description}</p>
                    <div className="flex items-center gap-2 pt-2">
                         <StatusIcon className={cn("h-4 w-4", statusConfig[status].className)} />
                         <span className={cn("text-sm font-semibold", statusConfig[status].className)}>{status}</span>
                    </div>
                    {gradeInfo?.marks !== null && gradeInfo?.marks !== undefined && (
                        <div className="flex items-center gap-2 pt-2 text-primary font-semibold">
                            <Award className="h-4 w-4" />
                            <span>Grade: {gradeInfo.marks} / {assignment.totalMarks}</span>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    {status === 'Pending' && (
                        <Button className="w-full" onClick={() => handleOpenSubmit(assignment)}>
                            <Upload className="mr-2 h-4 w-4" />
                            Submit Assignment
                        </Button>
                    )}
                     {(status === 'Submitted' || status === 'Late') && !gradeInfo?.marks && (
                        <Button className="w-full" disabled>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Submitted for Grading
                        </Button>
                    )}
                    {gradeInfo?.marks !== null && gradeInfo?.marks !== undefined && (
                         <Button className="w-full" variant="outline" disabled>
                            Graded
                        </Button>
                    )}
                </CardFooter>
            </Card>
        );
    };

    const pendingAssignments = assignments.filter(a => !getGradeInfo(a.id) || getGradeInfo(a.id)?.status === 'Pending');
    const submittedAssignments = assignments.filter(a => getGradeInfo(a.id) && getGradeInfo(a.id)?.status !== 'Pending');

  return (
    <>
      <Tabs defaultValue="pending">
        <TabsList>
            <TabsTrigger value="pending">Pending ({pendingAssignments.length})</TabsTrigger>
            <TabsTrigger value="submitted">Submitted ({submittedAssignments.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
            {pendingAssignments.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {pendingAssignments.map(renderAssignmentCard)}
                </div>
            ) : (
                <EmptyState title="All Caught Up!" description="You have no pending assignments." />
            )}
        </TabsContent>
        <TabsContent value="submitted">
             {submittedAssignments.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {submittedAssignments.map(renderAssignmentCard)}
                </div>
            ) : (
                <EmptyState title="No Submissions Yet" description="Your submitted assignments will appear here." />
            )}
        </TabsContent>
      </Tabs>
      {selectedAssignment && (
        <SubmitAssignmentDialog 
            isOpen={isSubmitOpen}
            onOpenChange={setSubmitOpen}
            assignment={selectedAssignment}
            onSubmit={handleSubmitAssignment}
        />
      )}
    </>
  );
}
