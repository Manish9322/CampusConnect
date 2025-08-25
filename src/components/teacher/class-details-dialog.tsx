"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClassWithDetails, Student } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ScrollArea } from "../ui/scroll-area";
import { Users, BookOpen, User } from "lucide-react";

interface ClassDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  classData: ClassWithDetails & { students: Student[] };
}

export function ClassDetailsDialog({ isOpen, onOpenChange, classData }: ClassDetailsDialogProps) {
  if (!classData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{classData.name} - Class Details</DialogTitle>
          <DialogDescription>
            Detailed information about the class and enrolled students.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <strong>Teacher:</strong> {classData.teacher}
            </div>
            <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <strong>Students:</strong> {classData.studentCount}
            </div>
             <div className="flex items-center gap-2 col-span-full">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <strong>Subjects:</strong> 
                <div className="flex flex-wrap gap-1">
                    {classData.subjects.map(sub => (
                        <Badge key={sub} variant="secondary">{sub}</Badge>
                    ))}
                </div>
            </div>
        </div>
        <div>
            <h4 className="font-semibold my-4">Enrolled Students</h4>
            <ScrollArea className="h-64">
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Roll No.</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {classData.students.map(student => (
                            <TableRow key={student.id}>
                                <TableCell>{student.rollNo}</TableCell>
                                <TableCell className="font-medium">{student.name}</TableCell>
                                <TableCell>{student.email}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
