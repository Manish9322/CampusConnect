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
import { Class } from "@/lib/types";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { AddClassDialog } from "./add-class-dialog";
import { DeleteConfirmationDialog } from "../shared/delete-confirmation-dialog";

interface ClassesTableProps {
  classes: Class[];
}

export function ClassesTable({ classes: initialClasses }: ClassesTableProps) {
  const [classes, setClasses] = React.useState(initialClasses);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [classToDelete, setClassToDelete] = React.useState<Class | null>(null);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredClasses = classes.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.year.toString().includes(searchTerm)
  );

  const openDeleteDialog = (c: Class) => {
    setClassToDelete(c);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (classToDelete) {
      setClasses(classes.filter((c) => c.id !== classToDelete.id));
      setClassToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Search classes..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-sm"
        />
        <Button onClick={() => setAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Class
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class Name</TableHead>
              <TableHead>Year</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClasses.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.year}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
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
      <AddClassDialog
        open={isAddDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAddClass={() => {}}
      />
      {classToDelete && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDelete}
          itemName={classToDelete.name}
        />
      )}
    </>
  );
}
