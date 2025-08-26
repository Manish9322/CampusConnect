
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAttendance } from "@/lib/mock-data";
import { AttendanceStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusVariant: { [key in AttendanceStatus]: "default" | "destructive" | "secondary" } = {
    present: "default",
    absent: "destructive",
    late: "secondary",
};

export function RecentAttendance() {
  const recentRecords = mockAttendance.slice(0, 8);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Attendance</CardTitle>
        <CardDescription>A log of the most recent attendance records.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Course</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.studentName}</TableCell>
                <TableCell>{record.course}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={statusVariant[record.status]}
                    className={cn(record.status === 'present' && 'bg-green-600 text-white')}
                  >
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
