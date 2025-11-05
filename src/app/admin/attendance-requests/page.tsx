
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
import { Check, X, ChevronLeft, ChevronRight, MessageSquare, FileText, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AttendanceStatus } from "@/lib/types";

export default function AttendanceRequestsPage() {
    const { data: requests = [], isLoading: isLoadingRequests, refetch } = useGetAttendanceRequestsQuery(undefined);
    const { data: students = [], isLoading: isLoadingStudents } = useGetStudentsQuery({});
    const { data: attendanceRecords = [], isLoading: isLoadingAttendance } = useGetAttendanceQuery({});
    const [updateAttendanceRequest] = useUpdateAttendanceRequestMutation();
    const { toast } = useToast();

    // State for filters and pagination
    const [searchTerm, setSearchTerm] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState<string>('all');
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
            return matchesSearch && matchesStatus;
        });
    }, [requests, searchTerm, statusFilter, students]);

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
        setNoteText("");
        setIsNoteDialogOpen(true);
    };

    const handleSubmitNote = () => {
        // In a real application, you would send this note via an API
        toast({
            title: "Note Sent",
            description: `Note has been sent to ${getStudentName(selectedRequest.studentId)}.`
        });
        setIsNoteDialogOpen(false);
        setNoteText("");
        setSelectedRequest(null);
    };

    const isFiltered = searchTerm !== '' || statusFilter !== 'all';

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setPage(0);
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Attendance Requests</h1>
                <Badge variant="outline" className="text-base">
                    {filteredRequests.length} {filteredRequests.length === 1 ? 'Request' : 'Requests'}
                </Badge>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">All time requests</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pending}</div>
                        <p className="text-xs text-muted-foreground">Awaiting review</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.approved}</div>
                        <p className="text-xs text-muted-foreground">Accepted requests</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Denied</CardTitle>
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.denied}</div>
                        <p className="text-xs text-muted-foreground">Rejected requests</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Review Requests</CardTitle>
                    <CardDescription>
                        Review and approve or deny attendance change requests from students.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Filters */}
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
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="denied">Denied</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Active Filters */}
                    {isFiltered && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Active filters:</span>
                            {searchTerm && (
                                <Badge variant="secondary">
                                    Search: {searchTerm}
                                </Badge>
                            )}
                            {statusFilter !== 'all' && (
                                <Badge variant="secondary">
                                    Status: {statusFilter}
                                </Badge>
                            )}
                            <Button variant="ghost" size="sm" onClick={clearFilters}>
                                <X className="mr-2 h-4 w-4" /> Clear All
                            </Button>
                        </div>
                    )}

                    <div className="rounded-md border">
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

                    {/* Pagination */}
                    {!isLoading && filteredRequests.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground">Rows per page</span>
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
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground">
                                    Page {page + 1} of {totalPages || 1}
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

            {/* Send Note Dialog */}
            <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Send Note to Student</DialogTitle>
                        <DialogDescription>
                            Send a note to {selectedRequest && getStudentName(selectedRequest.studentId)} regarding their attendance request.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Note Message</label>
                            <Textarea
                                placeholder="Enter your message to the student..."
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                rows={5}
                            />
                        </div>
                        {selectedRequest && (
                            <div className="rounded-lg bg-muted p-3 space-y-2 text-sm">
                                <div><span className="font-medium">Request:</span> {selectedRequest.reason}</div>
                                <div><span className="font-medium">Status:</span> <Badge variant="secondary">{selectedRequest.status}</Badge></div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsNoteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmitNote} disabled={!noteText.trim()}>
                            Send Note
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
