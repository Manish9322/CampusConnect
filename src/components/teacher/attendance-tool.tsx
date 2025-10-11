
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Send, ChevronLeft, ChevronRight, CalendarIcon, Check, Clock, X } from "lucide-react";
import { AttendanceStatus, Student, Teacher } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useAddAttendanceMutation, useGetAttendanceQuery, useGetClassesQuery, useGetStudentsQuery, useGetTeachersQuery } from "@/services/api";
import { Skeleton } from "../ui/skeleton";
import { EmptyState } from "../shared/empty-state";

type AttendanceState = {
  [studentId: string]: AttendanceStatus;
};

const statusCycle: AttendanceStatus[] = ['present', 'late', 'absent'];

const statusConfig: { [key in AttendanceStatus]: { icon: React.ElementType; className: string; text: string } } = {
  present: { icon: Check, className: "bg-green-600 hover:bg-green-700 text-white border-green-600", text: "Present" },
  late: { icon: Clock, className: "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500", text: "Late" },
  absent: { icon: X, className: "bg-destructive hover:bg-destructive/90 text-destructive-foreground border-destructive", text: "Absent" },
};


const ThreeStateToggle = ({ status, onChange }: { status: AttendanceStatus, onChange: (newStatus: AttendanceStatus) => void }) => {
  const handleClick = () => {
    const currentIndex = statusCycle.indexOf(status);
    const nextIndex = (currentIndex + 1) % statusCycle.length;
    onChange(statusCycle[nextIndex]);
  };
  const Icon = statusConfig[status].icon;
  const config = statusConfig[status];

  return (
    <Tooltip>
        <TooltipTrigger asChild>
            <Button
              onClick={handleClick}
              variant="outline"
              size="icon"
              className={cn("transition-colors duration-200", config.className)}
              aria-label={`Change status from ${config.text}`}
            >
              <Icon className="h-4 w-4" />
            </Button>
        </TooltipTrigger>
        <TooltipContent>
            <p>{config.text}</p>
        </TooltipContent>
    </Tooltip>
  );
};


export function AttendanceTool() {
  const { toast } = useToast();
  
  // Mock logged in teacher
  const { data: allTeachers = [], isLoading: isLoadingTeachers } = useGetTeachersQuery();
  const teacher = allTeachers.find((t: Teacher) => t.name === 'Alan Turing');

  const { data: allClasses = [], isLoading: isLoadingClasses } = useGetClassesQuery();
  const teacherClasses = allClasses.filter((c: any) => c.teacherId._id === teacher?._id);

  const [selectedClassId, setSelectedClassId] = React.useState<string | undefined>(teacherClasses[0]?._id);
  
  const [attendance, setAttendance] = React.useState<AttendanceState>({});
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  
  const { data: studentsInCourse = [], isLoading: isLoadingStudents } = useGetStudentsQuery({ classId: selectedClassId }, {
    skip: !selectedClassId,
  });

  const formattedDate = date ? format(date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
  const { data: existingAttendance = [] } = useGetAttendanceQuery(
    { classId: selectedClassId!, date: formattedDate },
    { skip: !selectedClassId || !date }
  );

  const [addAttendance, { isLoading: isSubmitting }] = useAddAttendanceMutation();

  React.useEffect(() => {
      if (teacherClasses.length > 0 && !selectedClassId) {
          setSelectedClassId(teacherClasses[0]._id);
      }
  }, [teacherClasses, selectedClassId]);

  React.useEffect(() => {
    const newAttendance: AttendanceState = {};
    studentsInCourse.forEach((student: Student) => {
        const record = existingAttendance.find((r: any) => r.studentId === student._id);
        newAttendance[student._id!] = record ? record.status : 'present';
    });
    setAttendance(newAttendance);
  }, [studentsInCourse, existingAttendance]);


  const totalPages = Math.ceil(studentsInCourse.length / rowsPerPage);
  const paginatedStudents = studentsInCourse.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleRowsPerPageChange = (value: string) => {
    if (value === 'all') {
        setRowsPerPage(studentsInCourse.length);
    } else {
        setRowsPerPage(Number(value));
    }
    setPage(0);
  };

  const handleAttendanceChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    if (!selectedClassId) return;

    const attendanceData = studentsInCourse.map((student: Student) => ({
      studentId: student._id!,
      classId: selectedClassId,
      date: formattedDate,
      status: attendance[student._id!] || 'present',
      recordedBy: teacher?._id,
    }));

    try {
      await addAttendance(attendanceData).unwrap();
      toast({
        title: "Attendance Submitted",
        description: `Attendance for class on ${format(date || new Date(), "PPP")} has been recorded.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit attendance.",
        variant: "destructive",
      });
    }
  };
  
  const markAll = (status: AttendanceStatus) => {
    const newAttendance: AttendanceState = {};
    studentsInCourse.forEach((student: Student) => {
      newAttendance[student._id!] = status;
    });
    setAttendance(newAttendance);
  }

  const renderTableBody = () => {
    if (isLoadingStudents) {
      return [...Array(rowsPerPage)].map((_, i) => (
        <TableRow key={i}>
            <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-20"/></TableCell>
            <TableCell><Skeleton className="h-5 w-32"/></TableCell>
            <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-48"/></TableCell>
            <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-16"/></TableCell>
            <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-full"/></TableCell>
        </TableRow>
      ));
    }
    if (paginatedStudents.length === 0) {
      return <TableRow><TableCell colSpan={5}><EmptyState title="No Students" description="There are no students in the selected class." /></TableCell></TableRow>
    }
    return paginatedStudents.map((student: Student) => (
        <TableRow key={student._id}>
          <TableCell className="hidden md:table-cell">{student.rollNo}</TableCell>
          <TableCell className="font-medium">{student.name}</TableCell>
          <TableCell className="hidden lg:table-cell">{student.email}</TableCell>
          <TableCell className="hidden sm:table-cell">{student.attendancePercentage || 0}%</TableCell>
          <TableCell className="text-right">
            <ThreeStateToggle 
                status={attendance[student._id!] || 'present'}
                onChange={(newStatus) => handleAttendanceChange(student._id!, newStatus)}
            />
          </TableCell>
        </TableRow>
    ))
  }

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                  <CardTitle>Take Attendance</CardTitle>
                  <CardDescription>Select a class and date, then mark student attendance.</CardDescription>
              </div>
               <div className="flex flex-col sm:flex-row items-center gap-2">
                   <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                      <SelectTrigger className="w-full sm:w-[200px]" disabled={isLoadingClasses}>
                          <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                          {teacherClasses.map((c: any) => (
                               <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                   <Popover>
                      <PopoverTrigger asChild>
                          <Button
                          variant={"outline"}
                          className={cn(
                              "w-full sm:w-[240px] justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                          )}
                          >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                          <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          />
                      </PopoverContent>
                  </Popover>
              </div>
          </div>
        </CardHeader>
        <CardContent>
           <div className="flex w-full sm:w-auto items-center gap-2 mb-4">
              <Button variant="outline" className="w-full" onClick={() => markAll('present')} disabled={isLoadingStudents}>All Present</Button>
              <Button variant="outline" className="w-full" onClick={() => markAll('absent')} disabled={isLoadingStudents}>All Absent</Button>
           </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden md:table-cell">Roll No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden lg:table-cell">Email</TableHead>
                  <TableHead className="hidden sm:table-cell">Overall Attendance</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderTableBody()}
              </TableBody>
            </Table>
          </div>
           <div className="flex items-center justify-between mt-4 flex-wrap gap-4">
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
                      disabled={page >= totalPages - 1}
                  >
                      <ChevronRight className="h-4 w-4" />
                  </Button>
              </div>
               <Button onClick={handleSubmit} disabled={isSubmitting || isLoadingStudents} className="bg-accent hover:bg-accent/90 w-full sm:w-auto">
                  {isSubmitting ? "Submitting..." : <><Send className="mr-2 h-4 w-4" />Submit Attendance</>}
              </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
