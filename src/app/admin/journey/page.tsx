
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
import { Edit, PlusCircle, Trash2, GripVertical, Milestone, Rocket, Building, Users, Briefcase, ChevronLeft, ChevronRight } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useAddJourneyMutation, useDeleteJourneyMutation, useUpdateJourneyMutation, useGetJourneyQuery } from "@/services/api";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AddJourneyDialog } from "@/components/admin/journey/add-journey-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const iconMap: { [key: string]: React.ElementType } = {
  Milestone: Milestone,
  Rocket: Rocket,
  Building: Building,
  Users: Users,
  Briefcase: Briefcase,
};

export default function ManageJourneyPage() {
  const { data: initialItems = [], isLoading } = useGetJourneyQuery(undefined);
  const [items, setItems] = React.useState(initialItems);
  
  const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [itemToAction, setItemToAction] = React.useState<any | null>(null);
  const { toast } = useToast();

  const [addJourney, { isLoading: isAdding }] = useAddJourneyMutation();
  const [updateJourney, { isLoading: isUpdating }] = useUpdateJourneyMutation();
  const [deleteJourney] = useDeleteJourneyMutation();
  
  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  React.useEffect(() => {
    const sortedItems = [...initialItems].sort((a, b) => a.order - b.order);
    setItems(sortedItems);
  }, [initialItems]);
  
  const filteredItems = React.useMemo(() => {
    return items.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const totalPages = Math.ceil(filteredItems.length / rowsPerPage);
  const paginatedItems = filteredItems.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setPage(0);
  };

  const handleEdit = (item: any) => {
    setItemToAction(item);
    setAddDialogOpen(true);
  };

  const handleAdd = () => {
    setItemToAction(null);
    setAddDialogOpen(true);
  };

  const openDeleteDialog = (item: any) => {
    setItemToAction(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (itemToAction) {
      try {
        await deleteJourney(itemToAction._id).unwrap();
        toast({ title: "Journey Item Deleted" });
        setDeleteDialogOpen(false);
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete item.", variant: "destructive" });
      }
    }
  };
  
  const handleSave = async (data: any) => {
    try {
      if (itemToAction) {
        await updateJourney({ ...data, _id: itemToAction._id, order: itemToAction.order }).unwrap();
        toast({ title: "Journey Item Updated" });
      } else {
        await addJourney({ ...data, order: items.length }).unwrap();
        toast({ title: "Journey Item Added" });
      }
      setAddDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save item.", variant: "destructive" });
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    const reorderedItemsWithOrder = newItems.map((item, idx) => ({ ...item, order: idx }));
    setItems(reorderedItemsWithOrder);

    const updatePayload = reorderedItemsWithOrder.map(item => ({ _id: item._id, order: item.order }));
    updateJourney(updatePayload)
      .unwrap()
      .then(() => toast({ title: "Order Updated" }))
      .catch(() => {
        toast({ title: "Error", description: "Failed to save new order.", variant: "destructive" });
        setItems(items); // Revert on error
      });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-5 w-8" /></TableCell>
              <TableCell><Skeleton className="h-5 w-20" /></TableCell>
              <TableCell><Skeleton className="h-5 w-32" /></TableCell>
              <TableCell><Skeleton className="h-5 w-full" /></TableCell>
              <TableCell><Skeleton className="h-5 w-8" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    }
    
    if (paginatedItems.length === 0) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={6}>
              <EmptyState title="No Journey Items Found" description={searchTerm ? "No items match your search." : "Add items to build your company's story timeline."} />
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="journey-items">
          {(provided) => (
            <TableBody ref={provided.innerRef} {...provided.droppableProps}>
              {paginatedItems.map((item, index) => {
                const Icon = iconMap[item.icon] || Milestone;
                return (
                  <Draggable key={item._id} draggableId={item._id} index={index}>
                    {(provided) => (
                      <TableRow ref={provided.innerRef} {...provided.draggableProps}>
                        <TableCell {...provided.dragHandleProps} className="w-12 text-center">
                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                        </TableCell>
                        <TableCell className="font-medium">{item.year}</TableCell>
                        <TableCell>{item.title}</TableCell>
                        <TableCell className="max-w-md truncate">{item.description}</TableCell>
                        <TableCell><Icon className="h-5 w-5" /></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(item)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </TableBody>
          )}
        </Droppable>
      </DragDropContext>
    );
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <CardTitle>Manage "Our Story"</CardTitle>
              <CardDescription className="leading-relaxed">Add, edit, and reorder milestones for the "Our Story" timeline on the About page.</CardDescription>
            </div>
            <Button onClick={handleAdd} className="mt-4 sm:mt-0">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Milestone
            </Button>
          </div>
        </CardHeader>
        <CardContent>
           <div className="mb-4">
              <Input 
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
           </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              {renderContent()}
            </Table>
          </div>
           {filteredItems.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
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
                        Page {page + 1} of {totalPages || 1}
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
          )}
        </CardContent>
      </Card>
      
      <AddJourneyDialog
        open={isAddDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSave={handleSave}
        itemData={itemToAction}
        isSaving={isAdding || isUpdating}
      />
      
      {itemToAction && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDelete}
          itemName={`the milestone "${itemToAction.title}"`}
        />
      )}
    </div>
  );
}
