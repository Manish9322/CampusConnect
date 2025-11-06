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
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";

const complaintSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  category: z.enum(['Academic', 'Hostel', 'Faculty', 'Infrastructure', 'Other']),
  description: z.string().min(20, "Description must be at least 20 characters."),
});

export default function StudentComplaintsPage() {
    const [student, setStudent] = React.useState<Student | null>(null);
    const { toast } = useToast();

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

    const onSubmit = async (values: z.infer<typeof complaintSchema>) => {
        if (!student) return;
        try {
            await addComplaint({ ...values, studentId: student._id }).unwrap();
            toast({
                title: "Complaint Submitted",
                description: "Your complaint has been submitted and will be reviewed shortly.",
            });
            form.reset();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Submission Failed",
                description: "There was an error submitting your complaint.",
            });
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
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pending}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.resolved}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.inProgress}</div>
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
                                    {isSubmitting ? "Submitting..." : "Submit Complaint"}
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
                                    ) : complaints.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4}>
                                                <EmptyState title="No Complaints Yet" description="You haven't submitted any complaints." />
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        complaints.map((c: any) => (
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
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
