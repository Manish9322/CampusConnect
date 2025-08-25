
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockAttendance } from "@/lib/mock-data";
import { AttendanceRecord, AttendanceStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { DatePickerWithRange } from "./date-picker-range";

const statusVariant: { [key in AttendanceStatus]: "default" | "destructive" | "secondary" } = {
    present: "default",
    absent: "destructive",
    late: "secondary",
};

export function AttendanceDetails() {
  const studentRecords = mockAttendance.filter(record => record.studentId === 'S001');

  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);


  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredRecords = studentRecords.filter(
    (record) =>
      record.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage);
  const paginatedRecords = filteredRecords.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleRowsPerPageChange = (value: string) => {
    if (value === 'all') {
        setRowsPerPage(filteredRecords.length);
    } else {
        setRowsPerPage(Number(value));
    }
    setPage(0);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Attendance Details</CardTitle>
        <CardDescription>A detailed log of your attendance records.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                 <DatePickerWithRange className="w-full md:w-auto" />
                 <Input
                    placeholder="Search by subject..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full md:max-w-xs"
                />
            </div>
            <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
            </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Marked By</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.date}</TableCell>
                  <TableCell>{record.course}</TableCell>
                   <TableCell>Dr. Alan Turing</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={statusVariant[record.status]} className={cn(
                        record.status === 'present' && 'bg-green-600 text-white hover:bg-green-700',
                        record.status === 'late' && 'bg-yellow-500 text-white hover:bg-yellow-600',
                        record.status === 'absent' && 'bg-red-600 text-white hover:bg-red-700'
                        )}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
         <div className="flex items-center justify-between mt-4">
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
                        <SelectItem value="all">All</SelectItem>
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
                    disabled={page === totalPages - 1}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
