"use client"

import * as React from "react"
import { PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"

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

interface TeachersTableProps {
  data: Teacher[]
}

export function TeachersTable({ data }: TeachersTableProps) {
  const [teachers, setTeachers] = React.useState(data);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddTeacherDialogOpen, setAddTeacherDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [teacherToAction, setTeacherToAction] = React.useState<Teacher | null>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
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

  const confirmDelete = () => {
    if(teacherToAction) {
      setTeachers(prev => prev.filter(t => t.id !== teacherToAction.id));
      setDeleteDialogOpen(false);
      setTeacherToAction(null);
    }
  }

  const handleAdd = () => {
    setTeacherToAction(null);
    setAddTeacherDialogOpen(true);
  }

  const handleSaveTeacher = (teacher: Teacher) => {
    setTeachers(prev => {
        const existing = prev.find(t => t.id === teacher.id);
        if (existing) {
            return prev.map(t => t.id === teacher.id ? teacher : t);
        }
        return [...prev, teacher];
    });
  }

  const handleToggleStatus = (teacherId: string, newStatus: boolean) => {
    setTeachers(prev => prev.map(t => t.id === teacherId ? { ...t, status: newStatus ? 'active' : 'inactive' } : t));
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
            placeholder="Filter by name or email..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-10 w-full md:w-[250px]"
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
            {paginatedTeachers.length ? (
              paginatedTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                    <TableCell>{teacher.teacherId}</TableCell>
                    <TableCell className="font-medium">{teacher.name}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell><Badge variant="outline">{teacher.department}</Badge></TableCell>
                    <TableCell>
                        <Switch
                            checked={teacher.status === 'active'}
                            onCheckedChange={(checked) => handleToggleStatus(teacher.id, checked)}
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
