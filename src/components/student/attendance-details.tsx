
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AttendanceRecord, AttendanceStatus, Student, Class } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, Edit } from "lucide-react";
import { DatePickerWithRange } from "./date-picker-range";
import { useGetAttendanceQuery, useAddAttendanceRequestMutation, useGetTeachersQuery, useGetClassesQuery } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { RequestChangeDialog } from "./attendance/request-change-dialog";
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from "@/components/shared/empty-state";

const statusVariant: { [key in AttendanceStatus]: "default" | "destructive" | "secondary" } = {
    present: "default",
    absent: "destructive",
    late: "secondary",
};

export function AttendanceDetails() {
  const [user, setUser] = React.useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isRequestDialogOpen, setRequestDialogOpen] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState<any | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    const storedUser = localStorage.getItem('student_user');
    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Ensure both id and _id are set for compatibility
        if (parsedUser.id && !parsedUser._id) {
            parsedUser._id = parsedUser.id;
        }
        console.log('Student Attendance - Logged in user:', parsedUser);
        setUser(parsedUser);
    }
  }, []);
  
  const { data: allAttendance = [], isLoading: isLoadingAttendance } = useGetAttendanceQuery({}, { skip: !user });
  const { data: teachers = [], isLoading: isLoadingTeachers } = useGetTeachersQuery(undefined);
  const { data: classes = [], isLoading: isLoadingClasses } = useGetClassesQuery(undefined);
  const [addAttendanceRequest] = useAddAttendanceRequestMutation();

  const isLoading = isLoadingAttendance || isLoadingTeachers || !user || isLoadingClasses;

  const studentRecords = React.useMemo(() => {
    if (isLoading || !user) return [];
    
    const userId = user._id || user.id;
    console.log('Student Attendance Debug:', {
      userId,
      totalAttendance: allAttendance.length,
      sampleRecord: allAttendance[0],
    });
    
    const filtered = allAttendance
      .filter((record: any) => {
        const recordStudentId = record.studentId?._id || record.studentId;
        return recordStudentId === userId;
      })
      .map((record: any) => {
        const teacher = teachers.find((t: any) => t._id === record.recordedBy);
        const course = classes.find((c: Class) => c._id === record.classId);
        return {
            ...record,
            teacherName: teacher ? teacher.name : 'N/A',
            course: course ? course.name : 'N/A'
        }
      });
    
    console.log('Filtered student records:', filtered.length);
    return filtered;
  }, [allAttendance, user, teachers, classes, isLoading]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredRecords = studentRecords.filter(
    (record: any) =>
      record.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.teacherName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage);
  const paginatedRecords = filteredRecords.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setPage(0);
  };

  const handleRequestChangeClick = (record: any) => {
    setSelectedRecord(record);
    setRequestDialogOpen(true);
  };

  const handleSaveRequest = async (data: { requestedStatus: AttendanceStatus; reason: string }) => {
    if (!selectedRecord || !user) return;
    try {
        await addAttendanceRequest({
            studentId: user.id,
            attendanceId: selectedRecord._id,
            currentStatus: selectedRecord.status,
            requestedStatus: data.requestedStatus,
            reason: data.reason,
            status: 'pending',
        }).unwrap();
        toast({
            title: "Request Submitted",
            description: "Your attendance change request has been submitted for review.",
        });
        setRequestDialogOpen(false);
    } catch(err) {
        toast({
            title: "Submission Failed",
            description: "There was an error submitting your request.",
            variant: "destructive"
        });
    }
  };


  const renderTableBody = () => {
    if (isLoading) {
      return (
        [...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-5 w-24"/></TableCell>
            <TableCell><Skeleton className="h-5 w-20"/></TableCell>
            <TableCell><Skeleton className="h-5 w-32"/></TableCell>
            <TableCell><Skeleton className="h-6 w-20"/></TableCell>
            <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto"/></TableCell>
          </TableRow>
        ))
      )
    }
    
    if(paginatedRecords.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5}>
            <EmptyState title="No Records Found" description="Your attendance records will appear here." />
          </TableCell>
        </TableRow>
      )
    }

    return paginatedRecords.map((record: any) => (
      <TableRow key={record._id}>
        <TableCell className="font-medium">{new Date(record.date).toLocaleDateString()}</TableCell>
        <TableCell>{record.course || 'N/A'}</TableCell>
          <TableCell>{record.teacherName}</TableCell>
        <TableCell>
          <Badge variant={statusVariant[record.status as AttendanceStatus] || 'default'} className={cn(
              record.status === 'present' && 'bg-green-600 text-white hover:bg-green-700',
              record.status === 'late' && 'bg-yellow-500 text-white hover:bg-yellow-600',
              record.status === 'absent' && 'bg-red-600 text-white hover:bg-red-700'
              )}>
              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
            <Button variant="outline" size="sm" onClick={() => handleRequestChangeClick(record)}>
                <Edit className="mr-2 h-3 w-3" />
                Request Change
            </Button>
        </TableCell>
      </TableRow>
    ))
  }


  return (
    <>
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
                      placeholder="Search by subject or teacher..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="w-full md:max-w-xs"
                  />
              </div>
              <Button variant="outline" className="w-full md:w-auto">
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
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderTableBody()}
              </TableBody>
            </Table>
          </div>
          {paginatedRecords.length > 0 && (
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
          )}
        </CardContent>
      </Card>
      {selectedRecord && (
        <RequestChangeDialog 
            open={isRequestDialogOpen}
            onOpenChange={setRequestDialogOpen}
            record={selectedRecord}
            onSave={handleSaveRequest}
        />
      )}
    </>
  );
}
