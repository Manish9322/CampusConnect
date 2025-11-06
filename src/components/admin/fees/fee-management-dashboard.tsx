
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Settings, Filter, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Student } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { StudentFeeSettingsDialog } from "./student-fee-settings-dialog";
import { useGetClassesQuery, useGetStudentFeeSettingsQuery } from "@/services/api";
import { Badge } from "@/components/ui/badge";

interface FeeManagementDashboardProps {
    students: Student[];
    feeStructure: any[];
}

export function FeeManagementDashboard({ students, feeStructure }: FeeManagementDashboardProps) {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [isSettingsOpen, setSettingsOpen] = React.useState(false);
    const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null);
    
    // Filters
    const [classFilter, setClassFilter] = React.useState("all");
    const [statusFilter, setStatusFilter] = React.useState("all");

    const { data: allStudentSettings } = useGetStudentFeeSettingsQuery({});
    const { data: classes = [] } = useGetClassesQuery(undefined);
    const { toast } = useToast();

    const getStudentFeeMode = (studentId: string) => {
        const setting = allStudentSettings?.find((s: any) => s.studentId === studentId);
        return setting ? setting.mode : 'Default';
    };

    const getStudentFeeStatus = (studentId: string) => {
        // This is a mock function. In a real app, you'd calculate this based on payments.
        const mockStatuses = ['Paid', 'Pending', 'Overdue'];
        const studentIndex = students.findIndex(s => s._id === studentId);
        return mockStatuses[studentIndex % mockStatuses.length];
    }
    
    const getClassName = (classId: any) => {
        if (typeof classId === 'object' && classId !== null && classId.name) return classId.name;
        return classes.find((c: any) => c._id === classId)?.name || 'N/A';
    }

    const filteredStudents = students.filter(student => {
        const nameMatch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
        const idMatch = student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
        const classMatch = classFilter === 'all' || getClassName(student.classId) === classFilter;
        const statusMatch = statusFilter === 'all' || getStudentFeeStatus(student._id!) === statusFilter;
        return (nameMatch || idMatch) && classMatch && statusMatch;
    });

    const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
    const paginatedStudents = filteredStudents.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
    
    const handleConfigureClick = (student: Student) => {
        setSelectedStudent(student);
        setSettingsOpen(true);
    };

    const isFiltered = searchTerm !== "" || classFilter !== "all" || statusFilter !== "all";

    const clearFilters = () => {
        setSearchTerm("");
        setClassFilter("all");
        setStatusFilter("all");
    };

    return (
        <>
            <Card>
                <CardHeader className="space-y-1.5">
                    <CardTitle className="text-xl md:text-2xl">Student-Specific Fee Configuration</CardTitle>
                    <CardDescription className="text-sm">Override default fee settings for individual students.</CardDescription>
                </CardHeader>
                <CardContent className="px-4 md:px-6">
                    <div className="flex flex-col gap-3 mb-4">
                        <Input
                            placeholder="Search by student name or ID..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full"
                        />
                         <div className="flex flex-col sm:flex-row gap-2">
                             <Select value={classFilter} onValueChange={setClassFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by class" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Classes</SelectItem>
                                    {classes.map((c: any) => (
                                        <SelectItem key={c._id} value={c.name}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                             <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="Paid">Paid</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Overdue">Overdue</SelectItem>
                                </SelectContent>
                            </Select>
                            {isFiltered && (
                                <Button variant="ghost" onClick={clearFilters}>
                                    <X className="mr-2 h-4 w-4" /> Clear Filters
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="hidden md:block rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student ID</TableHead>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Fee Mode</TableHead>
                                    <TableHead>Fee Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedStudents.map(student => (
                                    <TableRow key={student.id}>
                                        <TableCell>{student.studentId}</TableCell>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell>{getClassName(student.classId)}</TableCell>
                                        <TableCell>{getStudentFeeMode(student._id!)}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStudentFeeStatus(student._id!) === 'Paid' ? 'default' : getStudentFeeStatus(student._id!) === 'Pending' ? 'secondary' : 'destructive'}>
                                                {getStudentFeeStatus(student._id!)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" onClick={() => handleConfigureClick(student)}>
                                                <Settings className="mr-2 h-4 w-4" />
                                                Configure
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="md:hidden space-y-4">
                        {paginatedStudents.map(student => (
                            <Card key={student.id}>
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="font-semibold text-base">{student.name}</div>
                                            <div className="text-sm text-muted-foreground">ID: {student.studentId}</div>
                                        </div>
                                         <Badge variant={getStudentFeeStatus(student._id!) === 'Paid' ? 'default' : getStudentFeeStatus(student._id!) === 'Pending' ? 'secondary' : 'destructive'}>
                                            {getStudentFeeStatus(student._id!)}
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <div className="text-muted-foreground text-xs">Class</div>
                                            <div className="font-medium">{getClassName(student.classId)}</div>
                                        </div>
                                         <div>
                                            <div className="text-muted-foreground text-xs">Fee Mode</div>
                                            <div className="font-medium">{getStudentFeeMode(student._id!)}</div>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="w-full" onClick={() => handleConfigureClick(student)}>
                                        <Settings className="mr-2 h-4 w-4" />
                                        Configure Fees
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 mt-4">
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
                            <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page</span>
                            <Select onValueChange={(val) => setRowsPerPage(Number(val))} defaultValue={`${rowsPerPage}`}>
                                <SelectTrigger className="w-20">
                                    <SelectValue placeholder={`${rowsPerPage}`} />
                                </SelectTrigger>
                                <SelectContent>
                                    {[5, 10, 20].map(val => <SelectItem key={val} value={`${val}`}>{val}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                                Page {page + 1} of {totalPages || 1}
                            </span>
                            <div className="flex gap-1">
                                <Button variant="outline" size="icon" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            {selectedStudent && (
                <StudentFeeSettingsDialog
                    open={isSettingsOpen}
                    onOpenChange={setSettingsOpen}
                    student={selectedStudent}
                    totalFees={feeStructure.reduce((sum, item) => sum + item.amount, 0)}
                />
            )}
        </>
    );
}
