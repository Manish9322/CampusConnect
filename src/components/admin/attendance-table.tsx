
"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { AttendanceRecord, AttendanceStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ChevronLeft, ChevronRight, Edit } from "lucide-react";
import { EditAttendanceDialog } from "./edit-attendance-dialog";

interface AttendanceTableProps {
  records: AttendanceRecord[];
}

const statusVariant: { [key in AttendanceStatus]: "default" | "destructive" | "secondary" | "outline" } = {
    present: "default",
    absent: "destructive",
    late: "secondary",
};

export function AttendanceTable({ records: initialRecords }: AttendanceTableProps) {
  const [records, setRecords] = React.useState(initialRecords);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isEditDialogOpen, setEditDialogOpen] = React.useState(false);
  const [recordToEdit, setRecordToEdit] = React.useState<AttendanceRecord | null>(null);


  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredRecords = records.filter(
    (record) =>
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
  };

  const handleEditClick = (record: AttendanceRecord) => {
    setRecordToEdit(record);
    setEditDialogOpen(true);
  };

  const handleSaveAttendance = (updatedRecord: AttendanceRecord) => {
    setRecords(records.map(r => r.id === updatedRecord.id ? updatedRecord : r));
    setEditDialogOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Search by student, ID, or course..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Student ID</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.studentId}</TableCell>
                <TableCell className="font-medium">{record.studentName}</TableCell>
                <TableCell>{record.course}</TableCell>
                <TableCell>
                  <Badge
                    variant={statusVariant[record.status]}
                    className={cn(
                        record.status === 'present' && 'bg-green-600 text-white hover:bg-green-700',
                        record.status === 'late' && 'bg-yellow-500 text-white hover:bg-yellow-600'
                    )}
                  >
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEditClick(record)}>
                    <Edit className="h-4 w-4" />
                  </Button>
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
      {recordToEdit && (
        <EditAttendanceDialog
            open={isEditDialogOpen}
            onOpenChange={setEditDialogOpen}
            record={recordToEdit}
            onSave={handleSaveAttendance}
        />
      )}
    </>
  );
}
