
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Send, X, ChevronLeft, ChevronRight, Users, CheckCircle2, XCircle, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Class, Student, AttendanceStatus, AttendanceRecord } from "@/lib/types";
import { useAddAttendanceMutation, useGetAttendanceQuery } from "@/services/api";
import { ThreeStateToggle } from "../shared/three-state-toggle";
import { Skeleton } from "../ui/skeleton";

interface ClassWithStudentDetails extends Class {
  teacher: string;
  studentCount: number;
  students: Student[];
}

interface ClassAttendanceModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  classData: ClassWithStudentDetails;
}

type AttendanceState = {
  [studentId: string]: AttendanceStatus;
};

export function ClassAttendanceModal({ isOpen, onOpenChange, classData }: ClassAttendanceModalProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [attendance, setAttendance] = React.useState<AttendanceState>({});
  const { toast } = useToast();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  const formattedDate = date ? format(date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
  const { data: existingAttendance = [], isLoading: isLoadingAttendance } = useGetAttendanceQuery(
    { classId: classData._id!, date: formattedDate },
    { skip: !classData._id || !date }
  );

  const [addAttendance, { isLoading: isSubmitting }] = useAddAttendanceMutation();

  // Fixed: Use a ref to track if we've initialized attendance for this date
  const initializedDateRef = React.useRef<string>('');

  React.useEffect(() => {
    if (classData.students && formattedDate !== initializedDateRef.current) {
      const initialAttendance: AttendanceState = {};
      classData.students.forEach(student => {
        const record = existingAttendance.find((r: AttendanceRecord) => r.studentId === student._id);
        initialAttendance[student._id!] = record ? record.status : 'present';
      });
      setAttendance(initialAttendance);
      initializedDateRef.current = formattedDate;
      setPage(0); // Reset to first page when date changes
    }
  }, [classData.students, formattedDate, existingAttendance]);

  const handleAttendanceChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };
  
  const markAll = (status: AttendanceStatus) => {
    const newAttendance: AttendanceState = {};
    classData.students.forEach(student => {
      newAttendance[student._id!] = status;
    });
    setAttendance(newAttendance);
  }

  const handleSubmit = async () => {
    const attendanceData = classData.students.map(student => ({
      studentId: student._id!,
      classId: classData._id!,
      date: formattedDate,
      status: attendance[student._id!],
      recordedBy: classData.teacherId,
    }));

    try {
      await addAttendance(attendanceData).unwrap();
      toast({
        title: "Attendance Submitted",
        description: `Attendance for ${classData.name} on ${format(date || new Date(), "PPP")} has been recorded.`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit attendance.",
        variant: "destructive",
      });
    }
  };

  const filteredStudents = classData.students.filter(
    (student) =>
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'all' || attendance[student._id!] === statusFilter)
  );

  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  const paginatedStudents = filteredStudents.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setPage(0);
  };

  // Calculate attendance statistics
  const stats = React.useMemo(() => {
    const total = classData.students.length;
    const present = Object.values(attendance).filter(s => s === 'present').length;
    const absent = Object.values(attendance).filter(s => s === 'absent').length;
    const late = Object.values(attendance).filter(s => s === 'late').length;
    return { total, present, absent, late };
  }, [attendance, classData.students.length]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col scrollbar-hide">
        <DialogHeader>
          <DialogTitle>Mark Attendance for {classData.name}</DialogTitle>
          <DialogDescription>
            Update student attendance for the selected date. Today is {format(new Date(), "PPP")}.
          </DialogDescription>
        </DialogHeader>

        {/* Attendance Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-semibold">{stats.total}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-blue-600/20 rounded-lg">
            <CheckCircle2 className="h-4 w-4 text-blue-850" />
            <div>
              <p className="text-xs text-blue-850">Present</p>
              <p className="text-lg font-semibold">{stats.present}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <XCircle className="h-4 w-4 text-blue-850" />
            <div>
              <p className="text-xs text-muted-foreground">Absent</p>
              <p className="text-lg font-semibold">{stats.absent}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Late</p>
              <p className="text-lg font-semibold">{stats.late}</p>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full sm:w-[200px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
              </SelectContent>
            </Select> 
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => markAll('present')}>All Present</Button>
            <Button variant="outline" size="sm" onClick={() => markAll('absent')}>All Absent</Button>
            <Badge variant="outline" className="ml-auto">
              {filteredStudents.length} of {classData.students.length} students
            </Badge>
          </div>
        </div>
        {/* Table */}
        <div className="flex-1 border rounded-lg overflow-hidden">
          <ScrollArea className="h-full">
            {isLoadingAttendance ? (
              <div className="space-y-2 p-2">
                {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-12 w-full"/>)}
              </div>
            ) : paginatedStudents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStudents.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell>{student.rollNo}</TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell className="text-right">
                        <ThreeStateToggle 
                          status={attendance[student._id!] || 'present'}
                          onChange={(newStatus) => handleAttendanceChange(student._id!, newStatus)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                No students found matching your criteria
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <Select onValueChange={handleRowsPerPageChange} defaultValue={`${rowsPerPage}`}>
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder={`${rowsPerPage}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Page {page + 1} of {totalPages || 1}
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
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : <><Send className="mr-2 h-4 w-4" /> Submit Attendance</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
