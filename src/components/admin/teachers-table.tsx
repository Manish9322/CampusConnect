"use client"

import * as React from "react"
import { PlusCircle, Edit, Trash2 } from "lucide-react"

import { Teacher } from "@/lib/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AddTeacherDialog } from "./add-teacher-dialog"
import { DeleteConfirmationDialog } from "../shared/delete-confirmation-dialog"
import { Badge } from "../ui/badge"

interface TeachersTableProps {
  data: Teacher[]
}

export function TeachersTable({ data }: TeachersTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddTeacherDialogOpen, setAddTeacherDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [teacherToAction, setTeacherToAction] = React.useState<Teacher | null>(null);

  const filteredTeachers = data.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (teacher: Teacher) => {
    setTeacherToAction(teacher);
    setAddTeacherDialogOpen(true);
  }

  const handleDelete = (teacher: Teacher) => {
    setTeacherToAction(teacher);
    setDeleteDialogOpen(true);
  }

  const confirmDelete = () => {
    // Logic to delete teacher would go here
    console.log("Deleting:", teacherToAction?.name);
    setDeleteDialogOpen(false);
    setTeacherToAction(null);
  }

  const handleAdd = () => {
    setTeacherToAction(null);
    setAddTeacherDialogOpen(true);
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Filter by name or email..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        </div>
        <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={handleAdd}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Teacher
            </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Teacher ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeachers.length ? (
              filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                    <TableCell>{teacher.teacherId}</TableCell>
                    <TableCell>{teacher.name}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell><Badge variant="outline">{teacher.department}</Badge></TableCell>
                    <TableCell>
                        <Badge variant={teacher.status === 'active' ? 'default' : 'destructive'}>
                            {teacher.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(teacher)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(teacher)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
       <AddTeacherDialog 
        open={isAddTeacherDialogOpen}
        onOpenChange={setAddTeacherDialogOpen}
        onAddTeacher={() => {}}
        teacher={teacherToAction}
      />
       {teacherToAction && <DeleteConfirmationDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        itemName={teacherToAction.name}
      />}
    </div>
  )
}
