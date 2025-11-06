
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Edit, Settings } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Student } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { StudentFeeSettingsDialog } from "./student-fee-settings-dialog";
import { useGetStudentFeeSettingsQuery } from "@/services/api";

interface FeeManagementDashboardProps {
    students: Student[];
    feeStructure: any[];
}

export function FeeManagementDashboard({ students, feeStructure }: FeeManagementDashboardProps) {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [isSettingsOpen, setSettingsOpen] = React.useState(false);
    const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null);

    const { data: allStudentSettings } = useGetStudentFeeSettingsQuery({});
    const { toast } = useToast();

    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
    const paginatedStudents = filteredStudents.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
    
    const handleConfigureClick = (student: Student) => {
        setSelectedStudent(student);
        setSettingsOpen(true);
    };

    const getStudentFeeMode = (studentId: string) => {
        const setting = allStudentSettings?.find((s: any) => s.studentId === studentId);
        return setting ? setting.mode : 'Default';
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
                    </div>

                    <div className="hidden md:block rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student ID</TableHead>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Fee Mode</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedStudents.map(student => (
                                    <TableRow key={student.id}>
                                        <TableCell>{student.studentId}</TableCell>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell>{(student.classId as any)?.name || 'N/A'}</TableCell>
                                        <TableCell>{getStudentFeeMode(student._id!)}</TableCell>
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
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <div className="text-muted-foreground text-xs">Class</div>
                                            <div className="font-medium">{(student.classId as any)?.name || 'N/A'}</div>
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
                                    {[10, 20, 50].map(val => <SelectItem key={val} value={`${val}`}>{val}</SelectItem>)}
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
