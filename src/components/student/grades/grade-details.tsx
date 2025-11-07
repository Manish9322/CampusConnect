
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Assignment, Grade, SubmissionStatus } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Award, Book, Calendar, Check, Clock, FileText, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

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
    const [statusFilter, setStatusFilter] = React.useState<SubmissionStatus | "all">("all");
    const [searchTerm, setSearchTerm] = React.useState("");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const allCourses = [...new Set(assignments.map(a => a.courseName))];

    const getGradeInfo = (assignmentId: string) => {
        return grades.find(g => g.assignmentId === assignmentId);
    };

    const filteredAssignments = assignments
        .filter(assignment => {
            const courseMatch = courseFilter === "all" || assignment.courseName === courseFilter;
            const gradeInfo = getGradeInfo(assignment._id);
            const status = gradeInfo?.status || 'Pending';
            const statusMatch = statusFilter === "all" || status === statusFilter;
            const searchMatch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase());
            return courseMatch && statusMatch && searchMatch;
        })
        .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

    const totalPages = Math.ceil(filteredAssignments.length / rowsPerPage);
    const paginatedAssignments = filteredAssignments.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    const handleRowsPerPageChange = (value: string) => {
        setRowsPerPage(Number(value));
        setPage(0);
    };
    
    const isFiltered = courseFilter !== 'all' || statusFilter !== 'all' || searchTerm !== '';
    const clearFilters = () => {
        setCourseFilter('all');
        setStatusFilter('all');
        setSearchTerm('');
        setPage(0);
    };

    const renderTableContent = () => {
        if (paginatedAssignments.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={5}>
                        <EmptyState title="No Grades Found" description="No assignments match your current filters." />
                    </TableCell>
                </TableRow>
            );
        }

        return paginatedAssignments.map(assignment => {
            const gradeInfo = getGradeInfo(assignment._id);
            const status = gradeInfo?.status || 'Pending';
            const StatusIcon = statusConfig[status].icon;
            const statusClassName = statusConfig[status].className;

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
                            <span className={statusClassName}>{status}</span>
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
        });
    };
    
    const renderMobileCards = () => {
        if (paginatedAssignments.length === 0) {
            return <EmptyState title="No Grades Found" description="No assignments match your current filters." />;
        }

        return paginatedAssignments.map(assignment => {
            const gradeInfo = getGradeInfo(assignment._id);
            const status = gradeInfo?.status || 'Pending';

            return (
                <Card key={assignment._id}>
                    <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold">{assignment.title}</h3>
                                <Badge variant="outline" className="mt-1">{assignment.courseName}</Badge>
                            </div>
                             <Badge variant={status === 'Pending' ? 'outline' : status === 'Submitted' ? 'default' : 'destructive'}>
                                {status}
                            </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                            <div className="flex items-center gap-2"><Calendar className="h-4 w-4"/>Due: {new Date(assignment.dueDate).toLocaleDateString()}</div>
                        </div>
                         <div className="flex items-center justify-end font-semibold text-primary pt-2 border-t">
                             {gradeInfo?.marks !== null && gradeInfo?.marks !== undefined ? (
                                <>{gradeInfo.marks} / {assignment.totalMarks}</>
                             ) : (
                                <span className="text-sm text-muted-foreground">Not Graded</span>
                             )}
                        </div>
                    </CardContent>
                </Card>
            )
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Detailed Report</CardTitle>
                <CardDescription>Your grades for all assignments and exams.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="space-y-4 mb-4">
                    <div className="flex flex-col md:flex-row gap-3">
                        <Input
                            placeholder="Search assignments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:max-w-xs"
                        />
                        <Select value={courseFilter} onValueChange={setCourseFilter}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Filter by course" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Courses</SelectItem>
                                {allCourses.map((course, index) => (
                                    <SelectItem key={index} value={course}>{course}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                         <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Submitted">Submitted</SelectItem>
                                <SelectItem value="Late">Late</SelectItem>
                            </SelectContent>
                        </Select>
                        {isFiltered && (
                             <Button variant="ghost" onClick={clearFilters}>
                                <X className="mr-2 h-4 w-4"/>
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block rounded-md border">
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
                           {renderTableContent()}
                        </TableBody>
                    </Table>
                </div>

                 {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                    {renderMobileCards()}
                </div>

                {/* Pagination */}
                {filteredAssignments.length > 0 && (
                     <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
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
                )}
            </CardContent>
        </Card>
    );
}

