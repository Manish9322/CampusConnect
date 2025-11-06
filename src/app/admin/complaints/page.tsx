
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetComplaintsQuery, useUpdateComplaintMutation } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useToast } from "@/hooks/use-toast";
import { FileText, Clock, CheckCircle, XCircle, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

export default function ComplaintsPage() {
    const { data: complaints = [], isLoading } = useGetComplaintsQuery(undefined);
    const [updateComplaint] = useUpdateComplaintMutation();
    const { toast } = useToast();

    const [filters, setFilters] = React.useState({
        searchTerm: "",
        status: "all",
        category: "all"
    });
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await updateComplaint({ _id: id, status }).unwrap();
            toast({
                title: "Status Updated",
                description: `Complaint status has been updated to ${status}.`
            });
        } catch (error) {
            toast({
                title: "Update Failed",
                description: "There was an error updating the complaint status.",
                variant: "destructive"
            });
        }
    };

    const stats = React.useMemo(() => ({
        total: complaints.length,
        pending: complaints.filter((c: any) => c.status === 'Pending').length,
        resolved: complaints.filter((c: any) => c.status === 'Resolved').length,
        inProgress: complaints.filter((c: any) => c.status === 'In Progress').length,
    }), [complaints]);

    const filteredComplaints = React.useMemo(() => {
        return complaints.filter((c: any) =>
            (filters.status === "all" || c.status === filters.status) &&
            (filters.category === "all" || c.category === filters.category) &&
            (c.subject.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            c.studentName.toLowerCase().includes(filters.searchTerm.toLowerCase()))
        );
    }, [complaints, filters]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(0);
    };
    
    const categories = ["all", "Academic", "Hostel", "Faculty", "Infrastructure", "Other"];
    const statuses = ["all", "Pending", "In Progress", "Resolved", "Rejected"];

    const totalPages = Math.ceil(filteredComplaints.length / rowsPerPage);
    const paginatedComplaints = filteredComplaints.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    const handleRowsPerPageChange = (value: string) => {
        setRowsPerPage(Number(value));
        setPage(0);
    };

    return (
        <div className="space-y-6 p-4 md:p-6">
            <div>
                <h1 className="text-2xl font-bold">Complaint Management</h1>
                <p className="text-muted-foreground mt-1">Review, manage, and resolve student complaints.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">Across all categories</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pending}</div>
                         <p className="text-xs text-muted-foreground">Awaiting initial review</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.resolved}</div>
                        <p className="text-xs text-muted-foreground">Successfully closed</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.inProgress}</div>
                        <p className="text-xs text-muted-foreground">Currently being addressed</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Complaints</CardTitle>
                    <CardDescription>View, manage, and resolve student complaints.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
                        <Input 
                            placeholder="Search by subject or student..." 
                            className="flex-1"
                            value={filters.searchTerm}
                            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                        />
                        <Select value={filters.status} onValueChange={(v) => handleFilterChange('status', v)}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={filters.category} onValueChange={(v) => handleFilterChange('category', v)}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filter by category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="hidden md:block rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    [...Array(5)].map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                            <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : paginatedComplaints.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6}>
                                            <EmptyState title="No Complaints Found" description="There are no complaints matching your filters." />
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedComplaints.map((c: any) => (
                                        <TableRow key={c._id}>
                                            <TableCell>
                                                <div className="font-medium">{c.studentName}</div>
                                                <div className="text-sm text-muted-foreground">{c.studentRollNo}</div>
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate">{c.subject}</TableCell>
                                            <TableCell><Badge variant="outline">{c.category}</Badge></TableCell>
                                            <TableCell>{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell><Badge>{c.status}</Badge></TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem onClick={() => handleUpdateStatus(c._id, 'In Progress')}>Mark as In Progress</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleUpdateStatus(c._id, 'Resolved')}>Mark as Resolved</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleUpdateStatus(c._id, 'Rejected')}>Mark as Rejected</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="md:hidden space-y-4">
                        {isLoading ? (
                            [...Array(3)].map((_, i) => (
                                <Card key={i}><CardContent className="p-4"><Skeleton className="h-24 w-full" /></CardContent></Card>
                            ))
                        ) : paginatedComplaints.length === 0 ? (
                            <EmptyState title="No Complaints Found" description="There are no complaints matching your filters." />
                        ) : (
                            paginatedComplaints.map((c: any) => (
                                <Card key={c._id}>
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold">{c.studentName} ({c.studentRollNo})</h3>
                                                <p className="text-sm text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <Badge>{c.status}</Badge>
                                        </div>
                                        <div>
                                            <p className="font-medium">{c.subject}</p>
                                            <Badge variant="outline" className="mt-1">{c.category}</Badge>
                                        </div>
                                        <div className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">Update Status</Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(c._id, 'In Progress')}>In Progress</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(c._id, 'Resolved')}>Resolved</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(c._id, 'Rejected')}>Rejected</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {filteredComplaints.length > 0 && (
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
        </div>
    );
}
