
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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Teacher } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Mail, Phone, BookCopy, Building } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

interface TeacherProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher: Teacher;
}

export function TeacherProfileDialog({ open, onOpenChange, teacher }: TeacherProfileDialogProps) {
  if (!teacher) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Teacher Profile</DialogTitle>
          <DialogDescription>
            Detailed view of the teacher's record.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 p-1">
            <Card>
                <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={teacher.profileImage} />
                        <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1 text-center sm:text-left">
                        <CardTitle className="text-2xl">{teacher.designation} {teacher.name}</CardTitle>
                        <CardDescription>Teacher ID: {teacher.teacherId}</CardDescription>
                        <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground mt-2">
                            <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                <span>{teacher.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                <span>{teacher.phone}</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-muted-foreground" />
                        <strong>Department:</strong> <Badge variant="outline">{teacher.department}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        <BookCopy className="h-5 w-5 text-muted-foreground" />
                        <strong>Subjects:</strong> 
                        <div className="flex flex-wrap gap-1">
                            {teacher.courses.map(course => (
                                <Badge key={course} variant="secondary">{course}</Badge>
                            ))}
                        </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <strong>Status:</strong> 
                        <Badge variant={teacher.status === 'active' ? "default" : "destructive"}>
                            {teacher.status.charAt(0).toUpperCase() + teacher.status.slice(1)}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    
