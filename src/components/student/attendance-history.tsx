"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

export function AttendanceHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Attendance History</CardTitle>
        <CardDescription>A log of your recent attendance.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.date}</TableCell>
                  <TableCell>{record.course}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[record.status]} className={cn(record.status === 'present' && 'bg-green-600 text-white')}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
