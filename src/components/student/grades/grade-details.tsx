
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Assignment, Grade, SubmissionStatus } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Award, Book, Calendar, Check, Clock, FileText } from "lucide-react";

interface GradeDetailsProps {
    assignments: Assignment[];
    grades: Grade[];
}

const statusConfig: { [key in SubmissionStatus]: { icon: React.ElementType, className: string } } = {
    'Submitted': { icon: Check, className: 'text-green-600' },
    'Pending': { icon: Clock, className: 'text-yellow-600' },
    'Late': { icon: Clock, className: 'text-red-600' },
};

export function GradeDetails({ assignments, grades }: GradeDetailsProps) {
    const [courseFilter, setCourseFilter] = React.useState("all");

    const allCourses = [...new Set(assignments.map(a => a.courseName))];

    const filteredAssignments = (courseFilter === "all" 
        ? assignments 
        : assignments.filter(a => a.courseName === courseFilter)
    ).sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

    const getGradeInfo = (assignmentId: string) => {
        return grades.find(g => g.assignmentId === assignmentId);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <CardTitle>Detailed Report</CardTitle>
                        <CardDescription>Your grades for all assignments and exams.</CardDescription>
                    </div>
                     <Select value={courseFilter} onValueChange={setCourseFilter}>
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="Filter by course" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Courses</SelectItem>
                            {allCourses.map((course, index) => (
                                <SelectItem key={index} value={course}>{course}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Assignment</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Score</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAssignments.length > 0 ? (
                                filteredAssignments.map(assignment => {
                                    const gradeInfo = getGradeInfo(assignment._id);
                                    const StatusIcon = gradeInfo ? statusConfig[gradeInfo.status].icon : statusConfig['Pending'].icon;
                                    const statusClassName = gradeInfo ? statusConfig[gradeInfo.status].className : statusConfig['Pending'].className;

                                    return (
                                        <TableRow key={assignment._id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-muted-foreground"/>
                                                    <span className="font-medium">{assignment.title}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{assignment.courseName}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground"/>
                                                    {new Date(assignment.dueDate).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <StatusIcon className={`h-4 w-4 ${statusClassName}`} />
                                                    <span className={statusClassName}>{gradeInfo?.status || 'Pending'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {gradeInfo?.marks !== null && gradeInfo?.marks !== undefined ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Award className="h-4 w-4 text-primary" />
                                                        <span className="font-semibold">{gradeInfo.marks} / {assignment.totalMarks}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">N/A</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <EmptyState title="No Assignments" description="No assignments found for the selected course." />
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
