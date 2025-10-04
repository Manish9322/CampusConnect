
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockAttendance } from "@/lib/mock-data";
import { AttendanceStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const statusVariant: {
  [key in AttendanceStatus]: "default" | "destructive" | "secondary";
} = {
  present: "default",
  absent: "destructive",
  late: "secondary",
};

export function RecentAttendance() {
  const recentRecords = mockAttendance
    .filter((record) => record.studentId === "S001")
    .slice(0, 3);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Attendance</CardTitle>
          <CardDescription>A log of your recent attendance.</CardDescription>
        </div>
         <Button asChild variant="link">
            <Link href="/student/attendance">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
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
            {recentRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.course}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={statusVariant[record.status]}
                    className={cn(
                      record.status === "present" &&
                        "bg-green-600 text-white hover:bg-green-700",
                      record.status === "late" &&
                        "bg-yellow-500 text-white hover:bg-yellow-600",
                      record.status === "absent" &&
                        "bg-red-600 text-white hover:bg-red-700"
                    )}
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
