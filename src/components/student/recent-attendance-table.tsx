
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockAttendance } from "@/lib/mock-data";
import { AttendanceStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const studentRecords = mockAttendance.filter(record => record.studentId === 'S001');

const statusVariant: { [key in AttendanceStatus]: "default" | "destructive" | "secondary" } = {
    present: "default",
    absent: "destructive",
    late: "secondary",
};

export function RecentAttendanceTable() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Attendance</CardTitle>
                <CardDescription>Here are your last 5 attendance records.</CardDescription>
            </CardHeader>
            <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {studentRecords.slice(0, 5).map((record) => (
                        <TableRow key={record.id}>
                            <TableCell className="font-medium">{record.date}</TableCell>
                            <TableCell>{record.course}</TableCell>
                            <TableCell className="text-right">
                            <Badge variant={statusVariant[record.status]} className={cn(record.status === 'present' && 'bg-green-600 text-white hover:bg-green-700', record.status === 'late' && 'bg-yellow-500 text-white hover:bg-yellow-600')}>
                                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            </Badge>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
