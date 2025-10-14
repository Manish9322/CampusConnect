
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
import { Assignment, Class } from "@/lib/types";
import { Edit, PlusCircle, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddAssignmentDialog } from "./add-assignment-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { useAddAssignmentMutation, useDeleteAssignmentMutation, useUpdateAssignmentMutation } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface AssignmentDataTableProps {
  initialAssignments: Assignment[];
  teacherClasses: Class[];
  isLoading: boolean;
}

export function AssignmentDataTable({ initialAssignments, teacherClasses, isLoading }: AssignmentDataTableProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [assignmentToAction, setAssignmentToAction] = React.useState<Assignment | null>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [classFilter, setClassFilter] = React.useState<string>("all");

  const [addAssignment] = useAddAssignmentMutation();
  const [updateAssignment] = useUpdateAssignmentMutation();
  const [deleteAssignment] = useDeleteAssignmentMutation();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredAssignments = initialAssignments
    .filter(item => classFilter === 'all' || item.courseName === classFilter)
    .filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.ceil(filteredAssignments.length / rowsPerPage);
  const paginatedAssignments = filteredAssignments.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setPage(0);
  };

  const handleEdit = (item: Assignment) => {
    setAssignmentToAction(item);
    setAddDialogOpen(true);
  };

  const handleAdd = () => {
    setAssignmentToAction(null);
    setAddDialogOpen(true);
  };

  const openDeleteDialog = (item: Assignment) => {
    setAssignmentToAction(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (assignmentToAction) {
      try {
        await deleteAssignment(assignmentToAction._id).unwrap();
        toast({ title: "Assignment Deleted" });
        setDeleteDialogOpen(false);
      } catch (error) {
        toast({ title: "Error deleting assignment", variant: "destructive" });
      }
    }
  };

  const handleSave = async (data: any) => {
    try {
        if (assignmentToAction) {
            await updateAssignment({ _id: assignmentToAction._id, ...data }).unwrap();
            toast({ title: "Assignment Updated" });
        } else {
            await addAssignment(data).unwrap();
            toast({ title: "Assignment Created" });
        }
        setAddDialogOpen(false);
    } catch (error) {
        toast({ title: "Error saving assignment", variant: "destructive" });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
            <CardTitle>Assignment Management</CardTitle>
            <CardDescription>Create, edit, and manage all assignments for your classes.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
              <Input
                placeholder="Search by title..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full sm:max-w-sm"
              />
              <Select value={classFilter} onValueChange={setClassFilter} disabled={isLoading}>
                <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by class"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {teacherClasses.map(c => <SelectItem key={c._id} value={c.name}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAdd} className="w-full sm:w-auto" disabled={isLoading}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Assignment
            </Button>
          </div>
      
          {isLoading ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Total Marks</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : paginatedAssignments.length === 0 ? (
            <EmptyState 
                title="No Assignments Found"
                description="You haven't created any assignments for the selected class yet."
            />
          ) : (
          <>
            <div className="rounded-md border">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Total Marks</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedAssignments.map((item) => (
                    <TableRow key={item._id}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell><Badge variant="outline">{item.courseName}</Badge></TableCell>
                        <TableCell><Badge variant="secondary">{item.type}</Badge></TableCell>
                        <TableCell>{new Date(item.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>{item.totalMarks}</TableCell>
                        <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteDialog(item)}
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
           </>
          )}
        </CardContent>
      </Card>

      <AddAssignmentDialog
        open={isAddDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSave={handleSave}
        assignmentData={assignmentToAction}
        teacherClasses={teacherClasses}
      />
      {assignmentToAction && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDelete}
          itemName={assignmentToAction.title}
        />
      )}
    </>
  );
}
