
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Download, Edit, Bell } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeeRecord, FeeStatus, Student } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { UpdateFeeStatusDialog } from "./update-fee-status-dialog";

interface FeeManagementDashboardProps {
    initialRecords: FeeRecord[];
    students: Student[];
}

const statusVariant: { [key in FeeStatus]: "default" | "destructive" | "secondary" | "outline" } = {
    Paid: "default",
    Pending: "secondary",
    Overdue: "destructive",
};

export function FeeManagementDashboard({ initialRecords, students }: FeeManagementDashboardProps) {
    const [records, setRecords] = React.useState(initialRecords);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [statusFilter, setStatusFilter] = React.useState<"all" | FeeStatus>("all");
    const [isUpdateOpen, setUpdateOpen] = React.useState(false);
    const [recordToUpdate, setRecordToUpdate] = React.useState<FeeRecord | null>(null);

    const { toast } = useToast();

    const filteredRecords = records
        .filter(record => statusFilter === 'all' || record.status === statusFilter)
        .filter(record => 
            record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.studentId.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const totalPages = Math.ceil(filteredRecords.length / rowsPerPage);
    const paginatedRecords = filteredRecords.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    const handleUpdateStatus = (record: FeeRecord) => {
        setRecordToUpdate(record);
        setUpdateOpen(true);
    };

    const handleSaveStatus = (newStatus: FeeStatus) => {
        if (recordToUpdate) {
            setRecords(records.map(r => r.id === recordToUpdate.id ? { ...r, status: newStatus } : r));
            toast({ title: 'Status Updated', description: `Fee status for ${recordToUpdate.studentName} updated to ${newStatus}.` });
        }
        setUpdateOpen(false);
        setRecordToUpdate(null);
    };

    const sendReminder = (record: FeeRecord) => {
        toast({
            title: "Reminder Sent",
            description: `Fee reminder sent to ${record.studentName}.`
        });
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Student Fee Records</CardTitle>
                    <CardDescription>View and manage all student fee payments.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                            <Input
                                placeholder="Search by student name or ID..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full md:max-w-sm"
                            />
                            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="Paid">Paid</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Overdue">Overdue</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button variant="outline" className="w-full md:w-auto">
                            <Download className="mr-2 h-4 w-4" />
                            Export Report
                        </Button>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student ID</TableHead>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Total Amount</TableHead>
                                    <TableHead>Due Amount</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedRecords.map(record => (
                                    <TableRow key={record.id}>
                                        <TableCell>{record.studentId}</TableCell>
                                        <TableCell className="font-medium">{record.studentName}</TableCell>
                                        <TableCell>${record.totalAmount.toLocaleString()}</TableCell>
                                        <TableCell>${record.dueAmount.toLocaleString()}</TableCell>
                                        <TableCell>{record.dueDate}</TableCell>
                                        <TableCell>
                                            <Badge variant={statusVariant[record.status]} className={cn(
                                                record.status === 'Paid' && 'bg-green-600 text-white hover:bg-green-700',
                                            )}>
                                                {record.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleUpdateStatus(record)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            {record.status !== 'Paid' && (
                                                <Button variant="ghost" size="icon" onClick={() => sendReminder(record)}>
                                                    <Bell className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">Rows per page</span>
                            <Select onValueChange={(val) => setRowsPerPage(Number(val))} defaultValue={`${rowsPerPage}`}>
                                <SelectTrigger className="w-20">
                                    <SelectValue placeholder={`${rowsPerPage}`} />
                                </SelectTrigger>
                                <SelectContent>
                                    {[10, 20, 50].map(val => <SelectItem key={val} value={`${val}`}>{val}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">Page {page + 1} of {totalPages}</span>
                            <Button variant="outline" size="icon" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            {recordToUpdate && (
                <UpdateFeeStatusDialog
                    open={isUpdateOpen}
                    onOpenChange={setUpdateOpen}
                    record={recordToUpdate}
                    onSave={handleSaveStatus}
                />
            )}
        </>
    );
}
