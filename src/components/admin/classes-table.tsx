
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
import { ClassWithDetails, Teacher } from "@/lib/types";
import { Edit, PlusCircle, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { AddClassDialog } from "./add-class-dialog";
import { DeleteConfirmationDialog } from "../shared/delete-confirmation-dialog";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { useAddClassMutation, useDeleteClassMutation, useGetTeachersQuery, useUpdateClassMutation } from "@/services/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";

interface ClassesTableProps {
  classes: ClassWithDetails[];
  isLoading: boolean;
}

export function ClassesTable({ classes: initialClasses, isLoading }: ClassesTableProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [classToAction, setClassToAction] = React.useState<ClassWithDetails | null>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
  const { data: teachers = [] } = useGetTeachersQuery();
  const [addClass, { isLoading: isAdding }] = useAddClassMutation();
  const [updateClass, { isLoading: isUpdating }] = useUpdateClassMutation();
  const [deleteClass] = useDeleteClassMutation();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };
  
  const classesWithTeacherNames = initialClasses.map(c => {
    const teacher = teachers.find((t: Teacher) => t._id === c.teacherId);
    return { ...c, teacher: teacher?.name || 'N/A' };
  });

  const filteredClasses = classesWithTeacherNames.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredClasses.length / rowsPerPage);
  const paginatedClasses = filteredClasses.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleRowsPerPageChange = (value: string) => {
    if (value === 'all') {
        setRowsPerPage(filteredClasses.length);
    } else {
        setRowsPerPage(Number(value));
    }
    setPage(0);
  };


  const handleEdit = (c: ClassWithDetails) => {
    setClassToAction(c);
    setAddDialogOpen(true);
  };

  const handleAdd = () => {
    setClassToAction(null);
    setAddDialogOpen(true);
  };

  const openDeleteDialog = (c: ClassWithDetails) => {
    setClassToAction(c);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (classToAction) {
        try {
            await deleteClass(classToAction._id!).unwrap();
            toast({ title: "Class Deleted", description: `Class ${classToAction.name} has been deleted.` });
            setDeleteDialogOpen(false);
            setClassToAction(null);
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete class.", variant: "destructive" });
        }
    }
  };

  const handleToggleStatus = async (classData: ClassWithDetails, newStatus: boolean) => {
    const status = newStatus ? "active" : "inactive";
    try {
        await updateClass({ ...classData, status }).unwrap();
        toast({ title: "Status Updated", description: `${classData.name}'s status updated.` });
    } catch (error) {
        toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    }
  };
  
   const handleSaveClass = async (classData: any) => {
    try {
        if(classToAction) {
            await updateClass({ _id: classToAction._id, ...classData }).unwrap();
            toast({ title: "Class Updated", description: `${classData.name} has been updated.` });
        } else {
            await addClass(classData).unwrap();
            toast({ title: "Class Added", description: `${classData.name} has been added.` });
        }
    } catch(error) {
        toast({ title: "Error", description: "An error occurred while saving the class.", variant: "destructive" });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Search by class name or teacher..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-sm"
        />
        <Button onClick={handleAdd}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Class
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class Name</TableHead>
              <TableHead>Class Teacher</TableHead>
              <TableHead>Subjects</TableHead>
              <TableHead>No. of Students</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
                [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-11" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                    </TableRow>
                ))
            ) : paginatedClasses.map((c) => (
              <TableRow key={c._id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.teacher}</TableCell>
                <TableCell>
                    {c.subjects.map(sub => <Badge key={sub} variant="outline" className="mr-1">{sub}</Badge>)}
                </TableCell>
                <TableCell>{c.studentCount}</TableCell>
                <TableCell>
                  <Switch
                    checked={c.status === "active"}
                    onCheckedChange={(checked) => handleToggleStatus(c, checked)}
                    aria-label="Toggle class status"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(c)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(c)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
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
      <AddClassDialog
        open={isAddDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSave={handleSaveClass}
        classData={classToAction}
      />
      {classToAction && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDelete}
          itemName={classToAction.name}
        />
      )}
    </>
  );
}
