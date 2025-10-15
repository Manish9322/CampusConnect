
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { useGetAttendanceRequestsQuery, useUpdateAttendanceRequestMutation, useGetStudentsQuery, useGetAttendanceQuery } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AttendanceStatus } from "@/lib/types";

export default function AttendanceRequestsPage() {
    const { data: requests = [], isLoading: isLoadingRequests, refetch } = useGetAttendanceRequestsQuery();
    const { data: students = [], isLoading: isLoadingStudents } = useGetStudentsQuery({});
    const { data: attendanceRecords = [], isLoading: isLoadingAttendance } = useGetAttendanceQuery({});
    const [updateAttendanceRequest] = useUpdateAttendanceRequestMutation();
    const { toast } = useToast();

    const isLoading = isLoadingRequests || isLoadingStudents || isLoadingAttendance;

    const handleUpdateRequest = async (requestId: string, status: 'approved' | 'denied') => {
        try {
            await updateAttendanceRequest({ _id: requestId, status }).unwrap();
            toast({
                title: "Request Updated",
                description: `The request has been ${status}.`
            });
            refetch(); // Refetch requests to update the list
        } catch(err) {
            toast({
                title: "Update Failed",
                description: "There was an error updating the request.",
                variant: "destructive"
            });
        }
    };

    const getStudentName = (studentId: string) => students.find((s: any) => s._id === studentId)?.name || "Unknown";
    const getAttendanceDetails = (attendanceId: string) => attendanceRecords.find((a: any) => a._id === attendanceId);

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
                {requests.map((req: any) => {
                    const attendance = getAttendanceDetails(req.attendanceId);
                    return (
                         <TableRow key={req._id}>
                            <TableCell>{getStudentName(req.studentId)}</TableCell>
                            <TableCell>{attendance ? new Date(attendance.date).toLocaleDateString() : 'N/A'}</TableCell>
                            <TableCell>
                                <Badge variant="destructive">{req.currentStatus}</Badge> -> <Badge variant="default">{req.requestedStatus}</Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{req.reason}</TableCell>
                            <TableCell><Badge variant={req.status === 'pending' ? 'secondary' : req.status === 'approved' ? 'default' : 'destructive'}>{req.status}</Badge></TableCell>
                            <TableCell className="text-right">
                                {req.status === 'pending' && (
                                    <>
                                        <Button size="icon" variant="ghost" className="text-green-600" onClick={() => handleUpdateRequest(req._id, 'approved')}><Check className="h-4 w-4"/></Button>
                                        <Button size="icon" variant="ghost" className="text-red-600" onClick={() => handleUpdateRequest(req._id, 'denied')}><X className="h-4 w-4" /></Button>
                                    </>
                                )}
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        )
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Attendance Requests</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Review Requests</CardTitle>
                    <CardDescription>
                        Review and approve or deny attendance change requests from students.
                    </CardDescription>
                </CardHeader>
                <CardContent>
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
                </CardContent>
            </Card>
        </div>
    );
}
