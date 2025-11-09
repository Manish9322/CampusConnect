
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
import { Edit, PlusCircle, Trash2, ChevronLeft, ChevronRight, Check, X, GripVertical } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useAddTestimonialMutation, useDeleteTestimonialMutation, useUpdateTestimonialMutation } from "@/services/api";
import { AddTestimonialDialog } from "./add-testimonial-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface TestimonialsTableProps {
  testimonials: any[];
  isLoading: boolean;
}

export function TestimonialsTable({ testimonials: initialTestimonials, isLoading }: TestimonialsTableProps) {
  const [testimonials, setTestimonials] = React.useState(initialTestimonials);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [testimonialToAction, setTestimonialToAction] = React.useState<any | null>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { toast } = useToast();

  const [addTestimonial] = useAddTestimonialMutation();
  const [updateTestimonial] = useUpdateTestimonialMutation();
  const [deleteTestimonial] = useDeleteTestimonialMutation();

  React.useEffect(() => {
    const sortedTestimonials = [...initialTestimonials].sort((a, b) => a.order - b.order);
    setTestimonials(sortedTestimonials);
  }, [initialTestimonials]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredTestimonials = testimonials.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.quote.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTestimonials.length / rowsPerPage);
  const paginatedTestimonials = filteredTestimonials.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setPage(0);
  };

  const handleEdit = (item: any) => {
    setTestimonialToAction(item);
    setAddDialogOpen(true);
  };

  const handleAdd = () => {
    setTestimonialToAction(null);
    setAddDialogOpen(true);
  };

  const openDeleteDialog = (item: any) => {
    setTestimonialToAction(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (testimonialToAction) {
      try {
        await deleteTestimonial(testimonialToAction._id).unwrap();
        toast({ title: "Testimonial Deleted", description: `Testimonial by ${testimonialToAction.name} has been deleted.` });
        setDeleteDialogOpen(false);
        setTestimonialToAction(null);
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete testimonial.", variant: "destructive" });
      }
    }
  };

  const handleToggleApproved = async (testimonial: any, isApproved: boolean) => {
    try {
        await updateTestimonial({ ...testimonial, approved: isApproved }).unwrap();
        toast({ title: "Status Updated", description: `Testimonial from "${testimonial.name}" has been ${isApproved ? 'approved' : 'unapproved'}.` });
    } catch(error) {
        toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    }
  };
  
  const handleSave = async (data: any) => {
    try {
      if (testimonialToAction) {
        await updateTestimonial({ ...data, _id: testimonialToAction._id, order: testimonialToAction.order }).unwrap();
        toast({ title: "Testimonial Updated" });
      } else {
        await addTestimonial({...data, order: testimonials.length}).unwrap();
        toast({ title: "Testimonial Added" });
      }
      setAddDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save testimonial.", variant: "destructive" });
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const newTestimonials = Array.from(testimonials);
    const [reorderedItem] = newTestimonials.splice(result.source.index, 1);
    newTestimonials.splice(result.destination.index, 0, reorderedItem);

    const reorderedTestimonialsWithOrder = newTestimonials.map((t, idx) => ({ ...t, order: idx }));
    setTestimonials(reorderedTestimonialsWithOrder);

    const updatePayload = reorderedTestimonialsWithOrder.map(t => ({ _id: t._id, order: t.order }));
    updateTestimonial(updatePayload)
      .unwrap()
      .then(() => {
        toast({ title: "Order Updated", description: "Testimonial order has been saved." });
      })
      .catch(() => {
        toast({ title: "Error", description: "Failed to save new order.", variant: "destructive" });
        setTestimonials(testimonials); // Revert on error
      });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-5 w-8" /></TableCell>
              <TableCell><Skeleton className="h-5 w-48" /></TableCell>
              <TableCell><Skeleton className="h-5 w-20" /></TableCell>
              <TableCell><Skeleton className="h-5 w-24" /></TableCell>
              <TableCell><Skeleton className="h-6 w-11" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    }
    
    if (paginatedTestimonials.length === 0) {
        return (
            <TableBody>
                <TableRow>
                    <TableCell colSpan={6}>
                        <EmptyState title="No Testimonials Found" description="There are no testimonials matching your criteria." />
                    </TableCell>
                </TableRow>
            </TableBody>
        )
    }

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="testimonials">
          {(provided) => (
            <TableBody ref={provided.innerRef} {...provided.droppableProps}>
              {paginatedTestimonials.map((item, index) => (
                <Draggable key={item._id} draggableId={item._id} index={index}>
                  {(provided) => (
                  <TableRow ref={provided.innerRef} {...provided.draggableProps}>
                    <TableCell {...provided.dragHandleProps} className="w-12 text-center">
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={item.avatar} />
                        <AvatarFallback>{item.initials}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{item.name}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.designation}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.quote}</TableCell>
                    <TableCell>
                      <Switch
                        checked={item.approved}
                        onCheckedChange={(checked) => handleToggleApproved(item, checked)}
                        aria-label="Toggle approved status"
                      />
                    </TableCell>
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
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </TableBody>
          )}
        </Droppable>
      </DragDropContext>
    );
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <Input
          placeholder="Search by name or quote..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full md:max-w-sm"
        />
        <Button onClick={handleAdd} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Testimonial
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Quote</TableHead>
              <TableHead>Approved</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          {renderContent()}
        </Table>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 mt-4">
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page</span>
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
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
                Page {page + 1} of {totalPages || 1}
            </span>
            <div className="flex gap-1">
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
      </div>
      <AddTestimonialDialog
        open={isAddDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSave={handleSave}
        testimonialData={testimonialToAction}
      />
      {testimonialToAction && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDelete}
          itemName={`testimonial from ${testimonialToAction.name}`}
        />
      )}
    </>
  );
}
