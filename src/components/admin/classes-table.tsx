
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
import { ClassWithDetails } from "@/lib/types";
import { Edit, PlusCircle, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { AddClassDialog } from "./add-class-dialog";
import { DeleteConfirmationDialog } from "../shared/delete-confirmation-dialog";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { mockTeachers } from "@/lib/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface ClassesTableProps {
  classes: ClassWithDetails[];
}

export function ClassesTable({ classes: initialClasses }: ClassesTableProps) {
  const [classes, setClasses] = React.useState(initialClasses);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [classToAction, setClassToAction] = React.useState<ClassWithDetails | null>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);


  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredClasses = classes.filter(
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

  const handleDelete = () => {
    if (classToAction) {
      setClasses(classes.filter((c) => c.id !== classToAction.id));
      setClassToAction(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleToggleStatus = (classId: string, newStatus: boolean) => {
    setClasses(
      classes.map((c) =>
        c.id === classId ? { ...c, status: newStatus ? "active" : "inactive" } : c
      )
    );
  };
  
   const handleSaveClass = (classData: any) => {
    // This is where you would handle saving the data, for now, we'll just update the local state
    console.log("Saving class:", classData);
    setAddDialogOpen(false);
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
              <TableHead>Assigned Teacher</TableHead>
              <TableHead>Subjects</TableHead>
              <TableHead>No. of Students</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedClasses.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.teacher}</TableCell>
                <TableCell>
                    {c.subjects.map(sub => <Badge key={sub} variant="outline" className="mr-1">{sub}</Badge>)}
                </TableCell>
                <TableCell>{c.studentCount}</TableCell>
                <TableCell>
                  <Switch
                    checked={c.status === "active"}
                    onCheckedChange={(checked) => handleToggleStatus(c.id, checked)}
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
        allTeachers={mockTeachers}
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
