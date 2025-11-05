
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
import { AttendanceStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const statusVariant: { [key in AttendanceStatus]: "default" | "destructive" | "secondary" } = {
    present: "default",
    absent: "destructive",
    late: "secondary",
};

interface RecentAttendanceProps {
    data?: Array<{
        studentName: string;
        subject: string;
        status: AttendanceStatus;
        date: Date;
    }>;
    isLoading?: boolean;
}

export function RecentAttendance({ data, isLoading }: RecentAttendanceProps) {
  const recentRecords = data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Attendance</CardTitle>
        <CardDescription>A log of the most recent attendance records across all classes.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        ) : recentRecords.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No recent attendance records found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentRecords.map((record, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{record.studentName}</TableCell>
                  <TableCell>{record.subject}</TableCell>
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
        )}
      </CardContent>
    </Card>
  );
}
