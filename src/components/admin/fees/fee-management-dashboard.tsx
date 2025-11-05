
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
                <CardHeader className="space-y-1.5">
                    <CardTitle className="text-xl md:text-2xl">Student Fee Records</CardTitle>
                    <CardDescription className="text-sm">View and manage all student fee payments.</CardDescription>
                </CardHeader>
                <CardContent className="px-4 md:px-6">
                    <div className="flex flex-col gap-3 mb-4">
                        <Input
                            placeholder="Search by student name or ID..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full"
                        />
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                                <SelectTrigger className="w-full sm:flex-1">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="Paid">Paid</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Overdue">Overdue</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" className="w-full sm:flex-1">
                                <Download className="mr-2 h-4 w-4" />
                                Export Report
                            </Button>
                        </div>
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block rounded-md border">
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

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {paginatedRecords.map(record => (
                            <Card key={record.id}>
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="font-semibold text-base">{record.studentName}</div>
                                            <div className="text-sm text-muted-foreground">ID: {record.studentId}</div>
                                        </div>
                                        <Badge variant={statusVariant[record.status]} className={cn(
                                            record.status === 'Paid' && 'bg-green-600 text-white hover:bg-green-700',
                                        )}>
                                            {record.status}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <div className="text-muted-foreground text-xs">Total Amount</div>
                                            <div className="font-medium">${record.totalAmount.toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground text-xs">Due Amount</div>
                                            <div className="font-medium">${record.dueAmount.toLocaleString()}</div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-muted-foreground text-xs">Due Date</div>
                                            <div className="font-medium">{record.dueDate}</div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="flex-1"
                                            onClick={() => handleUpdateStatus(record)}
                                        >
                                            <Edit className="h-4 w-4 mr-1" />
                                            Update
                                        </Button>
                                        {record.status !== 'Paid' && (
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => sendReminder(record)}
                                            >
                                                <Bell className="h-4 w-4 mr-1" />
                                                Remind
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    
                    {/* Pagination Controls - Responsive */}
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
