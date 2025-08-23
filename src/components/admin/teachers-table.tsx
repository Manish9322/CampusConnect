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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Teacher } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { DeleteConfirmationDialog } from "../shared/delete-confirmation-dialog";

interface TeachersTableProps {
  teachers: Teacher[];
}

export function TeachersTable({ teachers: initialTeachers }: TeachersTableProps) {
  const [teachers, setTeachers] = React.useState(initialTeachers);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [teacherToDelete, setTeacherToDelete] = React.useState<Teacher | null>(null);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.teacherId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDeleteDialog = (teacher: Teacher) => {
    setTeacherToDelete(teacher);
    setDialogOpen(true);
  };

  const handleDelete = () => {
    if (teacherToDelete) {
      setTeachers(teachers.filter((t) => t.id !== teacherToDelete.id));
      setTeacherToDelete(null);
      setDialogOpen(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Search teachers..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-sm"
        />
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Teacher
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Teacher ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Courses</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>{teacher.teacherId}</TableCell>
                <TableCell className="font-medium">{teacher.name}</TableCell>
                <TableCell>{teacher.department}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {teacher.courses.map((course) => (
                      <Badge key={course} variant="secondary">
                        {course}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(teacher)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {teacherToDelete && (
        <DeleteConfirmationDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onConfirm={handleDelete}
          itemName={teacherToDelete.name}
        />
      )}
    </>
  );
}
