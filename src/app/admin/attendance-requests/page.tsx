
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { useGetAttendanceRequestsQuery, useUpdateAttendanceRequestMutation, useGetStudentsQuery, useGetAttendanceQuery } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, ChevronLeft, ChevronRight, MessageSquare, FileText, Clock, CheckCircle2, XCircle, Calendar, Download, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AttendanceStatus } from "@/lib/types";
import { SendNoteDialog } from "@/components/admin/send-note-dialog";

export default function AttendanceRequestsPage() {
    const { data: requests = [], isLoading: isLoadingRequests, refetch } = useGetAttendanceRequestsQuery(undefined);
    const { data: students = [], isLoading: isLoadingStudents } = useGetStudentsQuery({});
    const { data: attendanceRecords = [], isLoading: isLoadingAttendance } = useGetAttendanceQuery({});
    const [updateAttendanceRequest] = useUpdateAttendanceRequestMutation();
    const { toast } = useToast();

    // State for filters and pagination
    const [searchTerm, setSearchTerm] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState<string>('all');
    const [dateFilter, setDateFilter] = React.useState<string>('all');
    const [startDate, setStartDate] = React.useState("");
    const [endDate, setEndDate] = React.useState("");
    const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    
    // State for note dialog
    const [isNoteDialogOpen, setIsNoteDialogOpen] = React.useState(false);
    const [selectedRequest, setSelectedRequest] = React.useState<any>(null);
    const [noteText, setNoteText] = React.useState("");

    const isLoading = isLoadingRequests || isLoadingStudents || isLoadingAttendance;

    const getStudentName = (studentId: string) => students.find((s: any) => s._id === studentId)?.name || "Unknown";
    const getAttendanceDetails = (attendanceId: string) => attendanceRecords.find((a: any) => a._id === attendanceId);

    // Calculate statistics
    const stats = React.useMemo(() => {
        const total = requests.length;
        const pending = requests.filter((r: any) => r.status === 'pending').length;
        const approved = requests.filter((r: any) => r.status === 'approved').length;
        const denied = requests.filter((r: any) => r.status === 'denied').length;
        return { total, pending, approved, denied };
    }, [requests]);

    // Filter requests
    const filteredRequests = React.useMemo(() => {
        return requests.filter((req: any) => {
            const studentName = getStudentName(req.studentId).toLowerCase();
            const matchesSearch = searchTerm === '' || 
                studentName.includes(searchTerm.toLowerCase()) ||
                req.reason.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
            
            // Date filtering
            let matchesDate = true;
            const attendance = getAttendanceDetails(req.attendanceId);
            if (attendance && attendance.date) {
                const reqDate = new Date(attendance.date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (dateFilter === 'today') {
                    matchesDate = reqDate.toDateString() === today.toDateString();
                } else if (dateFilter === 'week') {
                    const weekAgo = new Date(today);
                    weekAgo.setDate(today.getDate() - 7);
                    matchesDate = reqDate >= weekAgo && reqDate <= today;
                } else if (dateFilter === 'month') {
                    const monthAgo = new Date(today);
                    monthAgo.setMonth(today.getMonth() - 1);
                    matchesDate = reqDate >= monthAgo && reqDate <= today;
                } else if (dateFilter === 'custom' && startDate && endDate) {
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    matchesDate = reqDate >= start && reqDate <= end;
                }
            }
            
            return matchesSearch && matchesStatus && matchesDate;
        });
    }, [requests, searchTerm, statusFilter, dateFilter, startDate, endDate, students, attendanceRecords]);

    // Pagination
    const totalPages = Math.ceil(filteredRequests.length / rowsPerPage);
    const paginatedRequests = filteredRequests.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    const handleRowsPerPageChange = (value: string) => {
        setRowsPerPage(Number(value));
        setPage(0);
    };

    const handleUpdateRequest = async (requestId: string, status: 'approved' | 'denied') => {
        try {
            await updateAttendanceRequest({ _id: requestId, status }).unwrap();
            toast({
                title: "Request Updated",
                description: `The request has been ${status}.`
            });
            refetch();
        } catch(err) {
            toast({
                title: "Update Failed",
                description: "There was an error updating the request.",
                variant: "destructive"
            });
        }
    };

    const handleSendNote = (request: any) => {
        setSelectedRequest(request);
        setIsNoteDialogOpen(true);
    };

    const isFiltered = searchTerm !== '' || statusFilter !== 'all' || dateFilter !== 'all';

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setDateFilter('all');
        setStartDate('');
        setEndDate('');
        setPage(0);
    };

    const handleExport = () => {
        // Create CSV content
        const headers = ['Student', 'Date', 'Current Status', 'Requested Status', 'Reason', 'Request Status'];
        const rows = filteredRequests.map((req: any) => {
            const attendance = getAttendanceDetails(req.attendanceId);
            return [
                getStudentName(req.studentId),
                attendance ? new Date(attendance.date).toLocaleDateString() : 'N/A',
                req.currentStatus,
                req.requestedStatus,
                req.reason.replace(/,/g, ';'), // Escape commas
                req.status
            ];
        });
        
        const csvContent = [
            headers.join(','),
            ...rows.map((row: string[]) => row.join(','))
        ].join('\n');
        
        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance-requests-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        toast({
            title: "Export Complete",
            description: "Attendance requests have been exported to CSV."
        });
    };

    const renderContent = () => {
        if(isLoading) {
            return (
                 <TableBody>
                    {[...Array(3)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            )
        }

        if(requests.length === 0) {
            return (
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={6}>
                             <EmptyState 
                                title="No Pending Requests"
                                description="There are currently no attendance requests to review."
                            />
                        </TableCell>
                    </TableRow>
                </TableBody>
            )
        }

        return (
            <TableBody>
                {paginatedRequests.map((req: any) => {
                    const attendance = getAttendanceDetails(req.attendanceId);
                    return (
                         <TableRow key={req._id}>
                            <TableCell className="font-medium">{getStudentName(req.studentId)}</TableCell>
                            <TableCell>{attendance ? new Date(attendance.date).toLocaleDateString() : 'N/A'}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Badge variant="destructive">{req.currentStatus}</Badge>
                                    <span className="text-muted-foreground">→</span>
                                    <Badge variant="default">{req.requestedStatus}</Badge>
                                </div>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{req.reason}</TableCell>
                            <TableCell>
                                <Badge variant={req.status === 'pending' ? 'secondary' : req.status === 'approved' ? 'default' : 'destructive'}>
                                    {req.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                    {req.status === 'pending' && (
                                        <>
                                            <Button size="icon" variant="ghost" className="text-blue-600 hover:bg-green-50" onClick={() => handleUpdateRequest(req._id, 'approved')}>
                                                <Check className="h-4 w-4"/>
                                            </Button>
                                            <Button size="icon" variant="ghost" className="text-blue-600 hover:bg-red-50" onClick={() => handleUpdateRequest(req._id, 'denied')}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                    <Button size="icon" variant="ghost" className="text-blue-600 hover:bg-blue-50" onClick={() => handleSendNote(req)}>
                                        <MessageSquare className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        )
    }

    return (
        <div className="space-y-4 md:space-y-6 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h1 className="text-xl md:text-2xl font-bold">Attendance Requests</h1>
                <Badge variant="outline" className="text-sm sm:text-base">
                    {filteredRequests.length} {filteredRequests.length === 1 ? 'Request' : 'Requests'}
                </Badge>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Total Requests</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground hidden sm:block">All time requests</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">{stats.pending}</div>
                        <p className="text-xs text-muted-foreground hidden sm:block">Awaiting review</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Approved</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">{stats.approved}</div>
                        <p className="text-xs text-muted-foreground hidden sm:block">Accepted requests</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Denied</CardTitle>
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">{stats.denied}</div>
                        <p className="text-xs text-muted-foreground hidden sm:block">Rejected requests</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="space-y-1.5">
                    <CardTitle className="text-xl md:text-2xl">Review Requests</CardTitle>
                    <CardDescription className="text-sm">
                        Review and approve or deny attendance change requests from students.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 px-4 md:px-6">
                    {/* Filters */}
                    <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Input
                                placeholder="Search by student name or reason..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setPage(0);
                                }}
                                className="flex-1"
                            />
                            <Select value={statusFilter} onValueChange={(value) => {
                                setStatusFilter(value);
                                setPage(0);
                            }}>
                                <SelectTrigger className="w-full sm:w-[150px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="denied">Denied</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={dateFilter} onValueChange={(value) => {
                                setDateFilter(value);
                                setPage(0);
                            }}>
                                <SelectTrigger className="w-full sm:w-[150px]">
                                    <SelectValue placeholder="Date Range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Dates</SelectItem>
                                    <SelectItem value="today">Today</SelectItem>
                                    <SelectItem value="week">Last Week</SelectItem>
                                    <SelectItem value="month">Last Month</SelectItem>
                                    <SelectItem value="custom">Custom Range</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button 
                                variant="outline" 
                                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                className="w-full sm:w-auto"
                            >
                                <Filter className="mr-2 h-4 w-4" />
                                {showAdvancedFilters ? 'Hide' : 'More'}
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={handleExport}
                                disabled={filteredRequests.length === 0}
                                className="w-full sm:w-auto"
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Export
                            </Button>
                        </div>
                        
                        {/* Custom Date Range */}
                        {dateFilter === 'custom' && (
                            <div className="flex flex-col sm:flex-row gap-3 p-3 border rounded-lg bg-muted/50">
                                <div className="flex-1">
                                    <label className="text-sm font-medium mb-1 block">Start Date</label>
                                    <Input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => {
                                            setStartDate(e.target.value);
                                            setPage(0);
                                        }}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm font-medium mb-1 block">End Date</label>
                                    <Input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => {
                                            setEndDate(e.target.value);
                                            setPage(0);
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                        
                        {/* Results Count */}
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Showing {filteredRequests.length} of {requests.length} requests
                            </div>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {isFiltered && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <span className="text-sm text-muted-foreground whitespace-nowrap">Active filters:</span>
                            <div className="flex flex-wrap items-center gap-2">
                                {searchTerm && (
                                    <Badge variant="secondary" className="text-xs">
                                        Search: {searchTerm}
                                    </Badge>
                                )}
                                {statusFilter !== 'all' && (
                                    <Badge variant="secondary" className="text-xs">
                                        Status: {statusFilter}
                                    </Badge>
                                )}
                                {dateFilter !== 'all' && (
                                    <Badge variant="secondary" className="text-xs">
                                        Date: {dateFilter === 'custom' ? `${startDate} to ${endDate}` : dateFilter}
                                    </Badge>
                                )}
                                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7">
                                    <X className="mr-1 h-3 w-3" />
                                    <span className="text-xs">Clear All</span>
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Desktop Table View */}
                    <div className="hidden md:block rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Change</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            {renderContent()}
                        </Table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {isLoading ? (
                            [...Array(3)].map((_, i) => (
                                <Card key={i}>
                                    <CardContent className="p-4 space-y-3">
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                        <div className="flex gap-2">
                                            <Skeleton className="h-6 w-16" />
                                            <Skeleton className="h-6 w-16" />
                                        </div>
                                        <Skeleton className="h-16 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                    </CardContent>
                                </Card>
                            ))
                        ) : requests.length === 0 ? (
                            <Card>
                                <CardContent className="p-8 text-center">
                                    <EmptyState 
                                        title="No Pending Requests"
                                        description="There are currently no attendance requests to review."
                                    />
                                </CardContent>
                            </Card>
                        ) : (
                            paginatedRequests.map((req: any) => {
                                const attendance = getAttendanceDetails(req.attendanceId);
                                return (
                                    <Card key={req._id}>
                                        <CardContent className="p-4 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-base">{getStudentName(req.studentId)}</h3>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {attendance ? new Date(attendance.date).toLocaleDateString() : 'N/A'}
                                                    </p>
                                                </div>
                                                <Badge variant={req.status === 'pending' ? 'secondary' : req.status === 'approved' ? 'default' : 'destructive'}>
                                                    {req.status}
                                                </Badge>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-muted-foreground">Change:</span>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="destructive" className="text-xs">{req.currentStatus}</Badge>
                                                        <span className="text-muted-foreground">→</span>
                                                        <Badge variant="default" className="text-xs">{req.requestedStatus}</Badge>
                                                    </div>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="text-muted-foreground">Reason: </span>
                                                    <span className="line-clamp-2">{req.reason}</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 pt-2">
                                                {req.status === 'pending' && (
                                                    <>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm" 
                                                            className="flex-1 text-green-600 hover:bg-green-50"
                                                            onClick={() => handleUpdateRequest(req._id, 'approved')}
                                                        >
                                                            <Check className="h-4 w-4 mr-1" />
                                                            Approve
                                                        </Button>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            className="flex-1 text-red-600 hover:bg-red-50"
                                                            onClick={() => handleUpdateRequest(req._id, 'denied')}
                                                        >
                                                            <X className="h-4 w-4 mr-1" />
                                                            Deny
                                                        </Button>
                                                    </>
                                                )}
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    className={req.status === 'pending' ? '' : 'flex-1'}
                                                    onClick={() => handleSendNote(req)}
                                                >
                                                    <MessageSquare className="h-4 w-4 mr-1" />
                                                    Note
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })
                        )}
                    </div>

                    {/* Pagination - Responsive */}
                    {!isLoading && filteredRequests.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
                                <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page</span>
                                <Select onValueChange={handleRowsPerPageChange} defaultValue={`${rowsPerPage}`}>
                                    <SelectTrigger className="w-[70px]">
                                        <SelectValue placeholder={`${rowsPerPage}`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
                                <span className="text-sm text-muted-foreground whitespace-nowrap">
                                    Page {page + 1} of {totalPages || 1}
                                </span>
                                <div className="flex gap-1">
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
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Send Note Dialog */}
            {selectedRequest && (
                <SendNoteDialog
                    isOpen={isNoteDialogOpen}
                    onClose={() => {
                        setIsNoteDialogOpen(false);
                        setSelectedRequest(null);
                    }}
                    student={{
                        _id: selectedRequest.studentId,
                        name: getStudentName(selectedRequest.studentId),
                        email: students.find((s: any) => s._id === selectedRequest.studentId)?.email || '',
                    }}
                    sender={{ name: "Admin", role: "admin" }}
                />
            )}
        </div>
    );
}
