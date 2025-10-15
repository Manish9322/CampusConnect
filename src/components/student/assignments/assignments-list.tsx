
"use client";

import * as React from "react";
import { Assignment, Grade, SubmissionStatus, Student } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, Upload, Award, AlertTriangle, ListFilter, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/empty-state";
import { SubmitAssignmentDialog } from "./submit-assignment-dialog";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAddGradeMutation, useGetAssignmentsForStudentQuery, useGetGradesQuery } from "@/services/api";


interface AssignmentsListProps {
  student: Student;
}

const statusConfig: { [key in SubmissionStatus]: { icon: React.ElementType, className: string, variant: "default" | "secondary" | "destructive" | "outline" } } = {
    'Submitted': { icon: CheckCircle, className: 'text-green-600', variant: "secondary" },
    'Pending': { icon: Clock, className: 'text-yellow-600', variant: "outline" },
    'Late': { icon: AlertTriangle, className: 'text-red-600', variant: "destructive" },
};

export function AssignmentsList({ student }: AssignmentsListProps) {
    const [isSubmitOpen, setSubmitOpen] = React.useState(false);
    const [selectedAssignment, setSelectedAssignment] = React.useState<Assignment | null>(null);
    const [courseFilter, setCourseFilter] = React.useState("all");
    const [sortOption, setSortOption] = React.useState("due-date-asc");
    const { toast } = useToast();
    
    const { data: assignments = [], isLoading: isLoadingAssignments } = useGetAssignmentsForStudentQuery(student?._id, { skip: !student?._id });
    const { data: grades = [], isLoading: isLoadingGrades, refetch: refetchGrades } = useGetGradesQuery(student?._id, { skip: !student?._id });

    const [addGrade, { isLoading: isSubmitting }] = useAddGradeMutation();

    const getGradeInfo = (assignmentId: string) => {
        return grades.find((g: Grade) => g.assignmentId === assignmentId);
    };

    const handleOpenSubmit = (assignment: Assignment) => {
        setSelectedAssignment(assignment);
        setSubmitOpen(true);
    };

    const handleSubmitAssignment = async (file: File) => {
        if (!selectedAssignment) return;
        
        // This would be a file upload to a service like S3 in a real app.
        // For now, we simulate it and use a local blob URL.
        const mockSubmissionUrl = file ? URL.createObjectURL(file) : undefined;

        const newGrade: Partial<Grade> = {
            studentId: student._id!,
            assignmentId: selectedAssignment._id,
            marks: null,
            status: new Date() > new Date(selectedAssignment.dueDate) ? 'Late' : 'Submitted',
            submittedAt: new Date().toISOString(),
            submissionUrl: mockSubmissionUrl,
        };

        try {
            await addGrade(newGrade).unwrap();
            refetchGrades();
            toast({
                title: "Assignment Submitted!",
                description: `Your work for "${selectedAssignment.title}" has been submitted.`,
            });
            setSubmitOpen(false);
        } catch(error) {
             toast({
                title: "Submission Failed",
                description: "There was an error submitting your assignment.",
                variant: "destructive"
            });
        }
    };

    const processAssignments = (assignmentList: Assignment[]) => {
        let filtered = assignmentList;
        if (courseFilter !== "all") {
            filtered = filtered.filter(a => a.courseName === courseFilter);
        }

        return filtered.sort((a, b) => {
            switch (sortOption) {
                case 'due-date-desc':
                    return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
                case 'status':
                    const statusA = getGradeInfo(a._id)?.status || 'Pending';
                    const statusB = getGradeInfo(b._id)?.status || 'Pending';
                    return statusA.localeCompare(statusB);
                case 'due-date-asc':
                default:
                    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            }
        });
    };

    const renderAssignmentCard = (assignment: Assignment) => {
        const gradeInfo = getGradeInfo(assignment._id);
        const status = gradeInfo?.status || 'Pending';
        const config = statusConfig[status];

        return (
            <Card key={assignment._id} className="flex flex-col hover:shadow-md transition-shadow">
                <CardHeader>
                    <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-lg">{assignment.title}</CardTitle>
                        <Badge variant="outline">{assignment.courseName}</Badge>
                    </div>
                    <CardDescription>Due: {new Date(assignment.dueDate).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2 h-10">{assignment.description}</p>
                    <div className="flex items-center gap-4 pt-2">
                         <Badge variant={config.variant} className="flex items-center gap-2">
                            <config.icon className="h-4 w-4" />
                            <span>{status}</span>
                         </Badge>
                         {gradeInfo?.marks !== null && gradeInfo?.marks !== undefined && (
                            <div className="flex items-center gap-2 text-primary font-semibold">
                                <Award className="h-4 w-4" />
                                <span>Grade: {gradeInfo.marks} / {assignment.totalMarks}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    {status === 'Pending' && (
                        <Button className="w-full" onClick={() => handleOpenSubmit(assignment)}>
                            <Upload className="mr-2 h-4 w-4" />
                            Submit Assignment
                        </Button>
                    )}
                     {(status === 'Submitted' || status === 'Late') && !gradeInfo?.marks && (
                        <Button className="w-full" variant="secondary" disabled>
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

    const allCourses = [...new Set(assignments.map(a => a.courseName))];
    const pendingAssignments = processAssignments(assignments.filter(a => !getGradeInfo(a._id)));
    const submittedAssignments = processAssignments(assignments.filter(a => getGradeInfo(a._id)));
    
    const isLoading = isLoadingAssignments || isLoadingGrades;

  return (
    <>
      <Card>
        <CardHeader>
            <CardTitle>My Assignments</CardTitle>
            <CardDescription>Manage and track all your course assignments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center mb-4">
                <TabsList>
                    <TabsTrigger value="pending">Pending ({pendingAssignments.length})</TabsTrigger>
                    <TabsTrigger value="submitted">Submitted ({submittedAssignments.length})</TabsTrigger>
                </TabsList>
                 <div className="flex items-center gap-2">
                    <Select value={courseFilter} onValueChange={setCourseFilter}>
                        <SelectTrigger className="w-full sm:w-[150px]">
                            <ListFilter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Filter by course" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Courses</SelectItem>
                            {allCourses.map(course => <SelectItem key={course} value={course}>{course}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     <Select value={sortOption} onValueChange={setSortOption}>
                        <SelectTrigger className="w-full sm:w-[150px]">
                             <ChevronsUpDown className="h-4 w-4 mr-2"/>
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="due-date-asc">Due Date</SelectItem>
                            <SelectItem value="due-date-desc">Due Date (Desc)</SelectItem>
                            <SelectItem value="status">Status</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <TabsContent value="pending">
                {isLoading ? (
                    <div className="text-center p-8">Loading assignments...</div>
                ) : pendingAssignments.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {pendingAssignments.map(renderAssignmentCard)}
                    </div>
                ) : (
                    <EmptyState title="All Caught Up!" description="You have no pending assignments." />
                )}
            </TabsContent>
            <TabsContent value="submitted">
                 {isLoading ? (
                    <div className="text-center p-8">Loading assignments...</div>
                ) : submittedAssignments.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {submittedAssignments.map(renderAssignmentCard)}
                    </div>
                ) : (
                    <EmptyState title="No Submissions Yet" description="Your submitted assignments will appear here." />
                )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      {selectedAssignment && (
        <SubmitAssignmentDialog 
            isOpen={isSubmitOpen}
            onOpenChange={setSubmitOpen}
            assignment={selectedAssignment}
            onSubmit={handleSubmitAssignment}
            isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}
