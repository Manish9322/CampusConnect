
"use client"

import * as React from "react"
import { PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
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
import { Switch } from "../ui/switch"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select"
import { useAddTeacherMutation, useDeleteTeacherMutation, useUpdateTeacherMutation } from "@/services/api"
import { Skeleton } from "../ui/skeleton"

interface TeachersTableProps {
  data: Teacher[];
  isLoading: boolean;
}

export function TeachersTable({ data, isLoading }: TeachersTableProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddTeacherDialogOpen, setAddTeacherDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [teacherToAction, setTeacherToAction] = React.useState<Teacher | null>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
  const [addTeacher] = useAddTeacherMutation();
  const [updateTeacher] = useUpdateTeacherMutation();
  const [deleteTeacher] = useDeleteTeacherMutation();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredTeachers = data.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTeachers.length / rowsPerPage);
  const paginatedTeachers = filteredTeachers.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleEdit = (teacher: Teacher) => {
    setTeacherToAction(teacher);
    setAddTeacherDialogOpen(true);
  }

  const handleDeleteClick = (teacher: Teacher) => {
    setTeacherToAction(teacher);
    setDeleteDialogOpen(true);
  }

  const confirmDelete = async () => {
    if(teacherToAction) {
      try {
        await deleteTeacher(teacherToAction._id).unwrap();
        toast({ title: "Teacher Deleted", description: `${teacherToAction.name} has been deleted.` });
        setDeleteDialogOpen(false);
        setTeacherToAction(null);
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete teacher.", variant: "destructive" });
      }
    }
  }

  const handleAdd = () => {
    setTeacherToAction(null);
    setAddTeacherDialogOpen(true);
  }

  const handleSaveTeacher = async (values: any) => {
    try {
        if(teacherToAction) {
            await updateTeacher({ _id: teacherToAction._id, ...values }).unwrap();
            toast({ title: "Teacher Updated", description: `${values.name} has been updated.` });
        } else {
            await addTeacher(values).unwrap();
            toast({ title: "Teacher Added", description: `${values.name} has been added.` });
        }
    } catch(error) {
        toast({ title: "Error", description: "An error occurred while saving the teacher.", variant: "destructive" });
    }
  }

  const handleToggleStatus = async (teacher: Teacher, newStatus: boolean) => {
    const status = newStatus ? 'active' : 'inactive';
    try {
        await updateTeacher({ ...teacher, status }).unwrap();
        toast({ title: "Status Updated", description: `${teacher.name}'s status has been updated to ${status}.` });
    } catch (error) {
        toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    }
  }
  
  const handleRowsPerPageChange = (value: string) => {
    if (value === 'all') {
        setRowsPerPage(filteredTeachers.length);
    } else {
        setRowsPerPage(Number(value));
    }
    setPage(0);
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Filter by name, email, or department..."
            value={searchTerm}
            onChange={handleSearch}
            className="h-10 w-full md:w-[300px]"
          />
        </div>
        <div className="flex items-center gap-2">
            <Button
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
            {isLoading ? (
                [...Array(rowsPerPage)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-11" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                    </TableRow>
                ))
            ) : paginatedTeachers.length > 0 ? (
              paginatedTeachers.map((teacher) => (
                <TableRow key={teacher._id}>
                    <TableCell>{teacher.teacherId}</TableCell>
                    <TableCell className="font-medium">{teacher.designation} {teacher.name}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell><Badge variant="outline">{teacher.department}</Badge></TableCell>
                    <TableCell>
                        <Switch
                            checked={teacher.status === 'active'}
                            onCheckedChange={(checked) => handleToggleStatus(teacher, checked)}
                        />
                    </TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(teacher)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(teacher)}>
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
        <div className="flex items-center justify-between">
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
      </div>
       <AddTeacherDialog 
        open={isAddTeacherDialogOpen}
        onOpenChange={setAddTeacherDialogOpen}
        onSave={handleSaveTeacher}
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
