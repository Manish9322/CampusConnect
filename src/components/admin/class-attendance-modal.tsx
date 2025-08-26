
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, ChevronsUpDown, Send, X } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Class, Student, AttendanceStatus } from "@/lib/types";

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

const statusCycle: AttendanceStatus[] = ['present', 'late', 'absent'];

const statusConfig: { [key in AttendanceStatus]: { text: string; className: string } } = {
  present: { text: "Present", className: "bg-green-600 hover:bg-green-700 text-white border-green-600" },
  late: { text: "Late", className: "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500" },
  absent: { text: "Absent", className: "bg-destructive hover:bg-destructive/90 text-destructive-foreground border-destructive" },
};

const ThreeStateToggle = ({ status, onChange }: { status: AttendanceStatus, onChange: (newStatus: AttendanceStatus) => void }) => {
  const handleClick = () => {
    const currentIndex = statusCycle.indexOf(status);
    const nextIndex = (currentIndex + 1) % statusCycle.length;
    onChange(statusCycle[nextIndex]);
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className={cn("w-24 transition-colors duration-200", statusConfig[status].className)}
    >
      {statusConfig[status].text}
    </Button>
  );
};


export function ClassAttendanceModal({ isOpen, onOpenChange, classData }: ClassAttendanceModalProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [attendance, setAttendance] = React.useState<AttendanceState>({});
  const { toast } = useToast();

  React.useEffect(() => {
    if (classData) {
      const initialAttendance: AttendanceState = {};
      classData.students.forEach(student => {
        initialAttendance[student.id] = 'present';
      });
      setAttendance(initialAttendance);
    }
  }, [classData]);

  const handleAttendanceChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };
  
  const markAll = (status: AttendanceStatus) => {
    const newAttendance: AttendanceState = {};
    classData.students.forEach(student => {
      newAttendance[student.id] = status;
    });
    setAttendance(newAttendance);
  }

  const handleSubmit = () => {
    toast({
      title: "Attendance Submitted",
      description: `Attendance for ${classData.name} on ${format(date || new Date(), "PPP")} has been recorded.`,
    });
    onOpenChange(false);
  };

  const filteredStudents = classData.students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Mark Attendance for {classData.name}</DialogTitle>
          <DialogDescription>
            Update student attendance for the selected date. Today is {format(new Date(), "PPP")}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between py-4">
            <div className="flex flex-col sm:flex-row gap-2">
                <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn("w-full sm:w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                </Popover>
            </div>
             <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => markAll('present')}>All Present</Button>
                <Button variant="outline" size="sm" onClick={() => markAll('absent')}>All Absent</Button>
             </div>
        </div>
        <div className="flex-1 relative">
            <ScrollArea className="absolute inset-0">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Roll No.</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                        <TableCell>{student.rollNo}</TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell className="text-right">
                           <ThreeStateToggle 
                                status={attendance[student.id] || 'present'}
                                onChange={(newStatus) => handleAttendanceChange(student.id, newStatus)}
                            />
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Send className="mr-2 h-4 w-4" /> Submit Attendance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
