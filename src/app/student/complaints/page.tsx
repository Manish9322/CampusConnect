"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAddComplaintMutation, useGetComplaintsQuery } from "@/services/api";
import { Student } from "@/lib/types";
import { FileText, Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight, Download, Filter, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const complaintSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  category: z.enum(['Academic', 'Hostel', 'Faculty', 'Infrastructure', 'Other']),
  description: z.string().min(20, "Description must be at least 20 characters."),
});

export default function StudentComplaintsPage() {
    const [student, setStudent] = React.useState<Student | null>(null);
    const { toast } = useToast();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [isConfirmOpen, setConfirmOpen] = React.useState(false);
    const [formValues, setFormValues] = React.useState<z.infer<typeof complaintSchema> | null>(null);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [categoryFilter, setCategoryFilter] = React.useState("all");

    React.useEffect(() => {
        const storedUser = localStorage.getItem('student_user');
        if (storedUser) {
            setStudent(JSON.parse(storedUser));
        }
    }, []);

    const { data: complaints = [], isLoading } = useGetComplaintsQuery({ studentId: student?._id }, { skip: !student });
    const [addComplaint, { isLoading: isSubmitting }] = useAddComplaintMutation();

    const form = useForm<z.infer<typeof complaintSchema>>({
        resolver: zodResolver(complaintSchema),
        defaultValues: {
            subject: "",
            category: "Academic",
            description: "",
        },
    });

    const onSubmit = (values: z.infer<typeof complaintSchema>) => {
        setFormValues(values);
        setConfirmOpen(true);
    };

    const handleConfirmSubmit = async () => {
        if (!student || !formValues) return;
        try {
            await addComplaint({ ...formValues, studentId: student._id }).unwrap();
            toast({
                title: "Complaint Submitted",
                description: "Your complaint has been submitted and will be reviewed shortly.",
            });
            form.reset();
            setFormValues(null);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Submission Failed",
                description: "There was an error submitting your complaint.",
            });
        } finally {
            setConfirmOpen(false);
        }
    };
    
    const stats = React.useMemo(() => {
        return {
            total: complaints.length,
            pending: complaints.filter((c: any) => c.status === 'Pending').length,
            resolved: complaints.filter((c: any) => c.status === 'Resolved').length,
            inProgress: complaints.filter((c: any) => c.status === 'In Progress').length,
        };
    }, [complaints]);

    const filteredComplaints = React.useMemo(() => {
        return complaints.filter((c: any) =>
            (c.subject.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (statusFilter === "all" || c.status === statusFilter) &&
            (categoryFilter === "all" || c.category === categoryFilter)
        );
    }, [complaints, searchTerm, statusFilter, categoryFilter]);

    const totalPages = Math.ceil(filteredComplaints.length / rowsPerPage);
    const paginatedComplaints = filteredComplaints.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    const handleExport = () => {
        const headers = ['Date', 'Subject', 'Category', 'Status'];
        const rows = filteredComplaints.map((c: any) => [
            new Date(c.createdAt).toLocaleDateString(),
            c.subject.replace(/,/g, ''),
            c.category,
            c.status,
        ]);
        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.href) {
            URL.revokeObjectURL(link.href);
        }
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', `complaints-${student?.name}-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
            title: "Export Successful",
            description: "Your complaint history has been exported as a CSV file.",
        });
    };

    const isFiltered = searchTerm !== '' || statusFilter !== 'all' || categoryFilter !== 'all';

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setCategoryFilter('all');
        setPage(0);
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">My Complaints</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">All complaints you have filed</p>
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
                        <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.resolved}</div>
                        <p className="text-xs text-muted-foreground">Successfully resolved</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.inProgress}</div>
                        <p className="text-xs text-muted-foreground">Currently being reviewed</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Submit a New Complaint</CardTitle>
                        <CardDescription>Fill out the form to submit a new complaint.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="subject"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Subject</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Issue with library facilities" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Academic">Academic</SelectItem>
                                                    <SelectItem value="Hostel">Hostel</SelectItem>
                                                    <SelectItem value="Faculty">Faculty</SelectItem>
                                                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Please describe your issue in detail..." {...field} rows={5} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    Submit Complaint
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>My Complaint History</CardTitle>
                        <CardDescription>A list of all complaints you have submitted.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
                            <Input
                                placeholder="Search by subject..."
                                value={searchTerm}
                                onChange={(e) => {setSearchTerm(e.target.value); setPage(0);}}
                                className="flex-1"
                            />
                            <Select value={statusFilter} onValueChange={(v) => {setStatusFilter(v); setPage(0);}}>
                                <SelectTrigger className="w-full sm:w-[150px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Resolved">Resolved</SelectItem>
                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={categoryFilter} onValueChange={(v) => {setCategoryFilter(v); setPage(0);}}>
                                <SelectTrigger className="w-full sm:w-[150px]">
                                    <SelectValue placeholder="Filter by category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="Academic">Academic</SelectItem>
                                    <SelectItem value="Hostel">Hostel</SelectItem>
                                    <SelectItem value="Faculty">Faculty</SelectItem>
                                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" onClick={handleExport} disabled={filteredComplaints.length === 0}><Download className="mr-2 h-4 w-4"/>Export</Button>
                            {isFiltered && <Button variant="ghost" size="icon" onClick={clearFilters}><X className="h-4 w-4"/></Button>}
                        </div>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        [...Array(3)].map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                                <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : paginatedComplaints.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4}>
                                                <EmptyState title="No Complaints Yet" description="You haven't submitted any complaints." />
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedComplaints.map((c: any) => (
                                            <TableRow key={c._id}>
                                                <TableCell>{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell className="font-medium">{c.subject}</TableCell>
                                                <TableCell><Badge variant="outline">{c.category}</Badge></TableCell>
                                                <TableCell><Badge>{c.status}</Badge></TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        {filteredComplaints.length > 0 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-muted-foreground">Rows per page</span>
                                    <Select onValueChange={(value) => {setRowsPerPage(Number(value)); setPage(0);}} defaultValue={`${rowsPerPage}`}>
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
             <AlertDialog open={isConfirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will submit your complaint to the administration for review. You cannot edit it after submission.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Confirm & Submit"}
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
