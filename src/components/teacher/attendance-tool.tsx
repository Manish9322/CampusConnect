
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Send, ChevronLeft, ChevronRight, CalendarIcon, AlertTriangle, Lock } from "lucide-react";
import { AttendanceRecord, AttendanceStatus, Student, Teacher, Class } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format, differenceInDays } from "date-fns";
import { useAddAttendanceMutation, useGetAttendanceQuery, useGetStudentsQuery } from "@/services/api";
import { Skeleton } from "../ui/skeleton";
import { EmptyState } from "../shared/empty-state";
import { ThreeStateToggle } from "../shared/three-state-toggle";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

type AttendanceState = {
  [studentId: string]: AttendanceStatus;
};

interface AttendanceToolProps {
    teacher: Teacher | null;
    teacherClasses: Class[];
}

export function AttendanceTool({ teacher, teacherClasses }: AttendanceToolProps) {
  const { toast } = useToast();
  
  const [selectedClassId, setSelectedClassId] = React.useState<string>("");
  const [attendance, setAttendance] = React.useState<AttendanceState>({});
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  React.useEffect(() => {
    if (teacherClasses.length > 0 && !teacherClasses.some(c => c._id === selectedClassId)) {
        setSelectedClassId(teacherClasses[0]._id!);
    } else if (teacherClasses.length === 0) {
        setSelectedClassId("");
    }
  }, [teacherClasses, selectedClassId]);

  const { data: studentsInCourse = [], isLoading: isLoadingStudents } = useGetStudentsQuery(
    { classId: selectedClassId }, 
    { skip: !selectedClassId }
  );
  
  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
  const { data: existingAttendance = [], isLoading: isLoadingExistingAttendance, refetch: refetchAttendance } = useGetAttendanceQuery(
    { classId: selectedClassId, date: formattedDate },
    { skip: !selectedClassId || !formattedDate }
  );

  const [addAttendance, { isLoading: isSubmitting }] = useAddAttendanceMutation();
  
  const isDateOutOfRange = date ? differenceInDays(new Date(), date) > 6 : false;
  const isLocked = existingAttendance.length > 0 || isDateOutOfRange;

  React.useEffect(() => {
    const newAttendance: AttendanceState = {};
    if (studentsInCourse.length > 0) {
        studentsInCourse.forEach((student: Student) => {
            const record = existingAttendance.find((r: any) => r.studentId === student._id);
            newAttendance[student._id!] = record ? record.status : 'present';
        });
        setAttendance(newAttendance);
    } else {
        setAttendance({});
    }
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
    if(isLocked) return;
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    if (!selectedClassId || !formattedDate || !teacher || isLocked) return;

    const attendanceData: Omit<AttendanceRecord, '_id' | 'id'>[] = studentsInCourse.map((student: Student) => ({
      studentId: student._id!,
      classId: selectedClassId,
      date: formattedDate,
      status: attendance[student._id!] || 'present',
      recordedBy: teacher._id!,
    }));

    try {
      await addAttendance(attendanceData).unwrap();
      toast({
        title: "Attendance Submitted",
        description: `Attendance for class on ${format(date!, "PPP")} has been recorded.`,
      });
      refetchAttendance();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit attendance.",
        variant: "destructive",
      });
    }
  };
  
  const markAll = (status: AttendanceStatus) => {
    if(isLocked) return;
    const newAttendance: AttendanceState = {};
    studentsInCourse.forEach((student: Student) => {
      newAttendance[student._id!] = status;
    });
    setAttendance(newAttendance);
  }

  const isLoading = isLoadingStudents;

  const renderTableBody = () => {
    if (isLoading || isLoadingExistingAttendance) {
      return [...Array(rowsPerPage)].map((_, i) => (
        <TableRow key={i}>
            <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-20"/></TableCell>
            <TableCell><Skeleton className="h-5 w-32"/></TableCell>
            <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-48"/></TableCell>
            <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-16"/></TableCell>
            <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-md"/></TableCell>
        </TableRow>
      ));
    }
    if (paginatedStudents.length === 0) {
      return <TableRow><TableCell colSpan={5}><EmptyState title="No Students Found" description="There are no students in the selected class." /></TableCell></TableRow>
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
                disabled={isLocked}
            />
          </TableCell>
        </TableRow>
    ))
  }

  return (
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                  <CardTitle>Take Attendance</CardTitle>
                  <CardDescription>Select a class and date, then mark student attendance.</CardDescription>
              </div>
               <div className="flex flex-col sm:flex-row items-center gap-2">
                   <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                      <SelectTrigger className="w-full sm:w-[200px]" disabled={teacherClasses.length === 0}>
                          <SelectValue placeholder="Select a class for today" />
                      </SelectTrigger>
                      <SelectContent>
                          {teacherClasses.length === 0 && <div className="p-2 text-sm text-muted-foreground">No classes scheduled today.</div>}
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
            {isDateOutOfRange && (
                <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Date Out of Range</AlertTitle>
                    <AlertDescription>
                        Attendance can only be recorded or edited for dates within the last 6 days.
                    </AlertDescription>
                </Alert>
            )}
            {existingAttendance.length > 0 && !isDateOutOfRange && (
                <div className="flex items-center gap-2 mb-4 p-3 rounded-md bg-muted text-muted-foreground text-sm">
                    <Lock className="h-4 w-4" />
                    <span>Attendance is locked. Changes must be initiated by a student request.</span>
                </div>
            )}
           <div className="flex w-full sm:w-auto items-center gap-2 mb-4">
              <Button variant="outline" className="w-full" onClick={() => markAll('present')} disabled={isLoading || isLoadingStudents || isLocked}>All Present</Button>
              <Button variant="outline" className="w-full" onClick={() => markAll('absent')} disabled={isLoading || isLoadingStudents || isLocked}>All Absent</Button>
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
               <Button onClick={handleSubmit} disabled={isSubmitting || isLoadingStudents || paginatedStudents.length === 0 || isLocked} className="bg-accent hover:bg-accent/90 w-full sm:w-auto">
                  {isSubmitting ? "Submitting..." : <><Send className="mr-2 h-4 w-4" />Submit Attendance</>}
              </Button>
          </div>
        </CardContent>
      </Card>
  );
}
