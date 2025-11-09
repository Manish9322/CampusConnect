
"use client";

import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, PlusCircle, Trash2, ChevronLeft, ChevronRight, Eye, ArrowUp, ArrowDown } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useAddFaqMutation, useDeleteFaqMutation, useUpdateFaqMutation } from "@/services/api";
import { AddFaqDialog } from "./add-faq-dialog";
import { ViewFaqDialog } from "./view-faq-dialog";
import { Card, CardContent } from "@/components/ui/card";

interface FaqTableProps {
  faqs: any[];
  isLoading: boolean;
}

export function FaqTable({ faqs: initialFaqs, isLoading }: FaqTableProps) {
  const [faqs, setFaqs] = React.useState(initialFaqs);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [isViewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [faqToAction, setFaqToAction] = React.useState<any | null>(null);
  
  const { toast } = useToast();

  const [addFaq, { isLoading: isAdding }] = useAddFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const [deleteFaq] = useDeleteFaqMutation();

  React.useEffect(() => {
    // Sort initial faqs by order
    const sortedFaqs = [...initialFaqs].sort((a, b) => a.order - b.order);
    setFaqs(sortedFaqs);
  }, [initialFaqs]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredFaqs = faqs.filter(
    (item) =>
      (item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || (statusFilter === "approved" ? item.approved : !item.approved))
  );

  const totalPages = Math.ceil(filteredFaqs.length / rowsPerPage);
  const paginatedFaqs = filteredFaqs.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setPage(0);
  };

  const handleEdit = (item: any) => {
    setFaqToAction(item);
    setAddDialogOpen(true);
  };

  const handleView = (item: any) => {
    setFaqToAction(item);
    setViewDialogOpen(true);
  };

  const handleAdd = () => {
    setFaqToAction(null);
    setAddDialogOpen(true);
  };

  const openDeleteDialog = (item: any) => {
    setFaqToAction(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (faqToAction) {
      try {
        await deleteFaq(faqToAction._id).unwrap();
        toast({ title: "FAQ Deleted" });
        setDeleteDialogOpen(false);
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete FAQ.", variant: "destructive" });
      }
    }
  };

  const handleToggleApproved = async (faq: any, isApproved: boolean) => {
    try {
      await updateFaq({ ...faq, approved: isApproved }).unwrap();
      toast({ title: "Status Updated", description: `FAQ has been ${isApproved ? 'approved' : 'unapproved'}.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    }
  };
  
  const handleSave = async (data: any) => {
    try {
      if (faqToAction) {
        await updateFaq({ ...data, _id: faqToAction._id }).unwrap();
        toast({ title: "FAQ Updated" });
      } else {
        await addFaq(data).unwrap();
        toast({ title: "FAQ Added" });
      }
      setAddDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save FAQ.", variant: "destructive" });
    }
  };

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= faqs.length) return;

    const newFaqs = [...faqs];
    const item = newFaqs.splice(index, 1)[0];
    newFaqs.splice(newIndex, 0, item);

    const reorderedFaqsWithOrder = newFaqs.map((faq, idx) => ({ ...faq, order: idx }));
    setFaqs(reorderedFaqsWithOrder);

    // Prepare for bulk update
    const updatePayload = reorderedFaqsWithOrder.map(faq => ({ _id: faq._id, order: faq.order }));
    try {
        await updateFaq(updatePayload).unwrap();
        toast({ title: "Order Updated", description: "FAQ order has been saved." });
    } catch (error) {
        toast({ title: "Error", description: "Failed to save new order.", variant: "destructive" });
        // Revert UI on error
        setFaqs(faqs);
    }
  };


  const renderContent = () => {
    if (isLoading) {
      return (
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-5 w-12" /></TableCell>
              <TableCell><Skeleton className="h-5 w-full" /></TableCell>
              <TableCell><Skeleton className="h-6 w-11" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    }
    
    if (filteredFaqs.length === 0) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={4}>
              <EmptyState title="No FAQs Found" description="No FAQs match your current filters." />
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    return (
      <TableBody>
        {paginatedFaqs.map((item, paginatedIndex) => {
          const originalIndex = faqs.findIndex(f => f._id === item._id);
          return (
            <TableRow key={item._id}>
              <TableCell>
                  <div className="flex flex-col gap-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6" disabled={originalIndex === 0} onClick={() => handleReorder(originalIndex, 'up')}>
                          <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" disabled={originalIndex === faqs.length - 1} onClick={() => handleReorder(originalIndex, 'down')}>
                          <ArrowDown className="h-4 w-4" />
                      </Button>
                  </div>
              </TableCell>
              <TableCell className="font-medium max-w-md truncate">{item.question}</TableCell>
              <TableCell>
                <Switch
                  checked={item.approved}
                  onCheckedChange={(checked) => handleToggleApproved(item, checked)}
                  aria-label="Toggle approved status"
                />
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => handleView(item)}>
                  <Eye className="h-4 w-4" />
                </Button>
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
          );
        })}
      </TableBody>
    );
  };
  
  return (
    <>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Input
              placeholder="Search by question or answer..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full md:max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
        </div>
        <Button onClick={handleAdd} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" /> Add FAQ
        </Button>
      </div>
      
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[5%]">Order</TableHead>
              <TableHead className="w-[65%]">Question</TableHead>
              <TableHead>Approved</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          {renderContent()}
        </Table>
      </div>

       <div className="md:hidden space-y-4">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-full" />
                <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : paginatedFaqs.length === 0 ? (
          <EmptyState title="No FAQs Found" description="There are no FAQs matching your criteria." />
        ) : (
          paginatedFaqs.map((item, paginatedIndex) => {
            const originalIndex = faqs.findIndex(f => f._id === item._id);
            return (
              <Card key={item._id}>
                  <CardContent className="p-4 space-y-3">
                      <p className="font-semibold line-clamp-2">{item.question}</p>
                      <div className="flex justify-between items-center pt-2 border-t">
                          <div className="flex items-center gap-2">
                              <Switch
                                  checked={item.approved}
                                  onCheckedChange={(checked) => handleToggleApproved(item, checked)}
                                  id={`switch-mobile-${item._id}`}
                              />
                              <label htmlFor={`switch-mobile-${item._id}`} className="text-sm">
                                  {item.approved ? 'Approved' : 'Pending'}
                              </label>
                          </div>
                          <div className="flex items-center">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleReorder(originalIndex, 'up')} disabled={originalIndex === 0}>
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleReorder(originalIndex, 'down')} disabled={originalIndex === faqs.length - 1}>
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleView(item)}>View</Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>Edit</Button>
                              <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(item)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                          </div>
                      </div>
                  </CardContent>
              </Card>
            )
          })
        )}
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
                <Button variant="outline" size="icon" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
      </div>

      <AddFaqDialog
        open={isAddDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSave={handleSave}
        faqData={faqToAction}
        isSaving={isAdding || isUpdating}
      />
      {faqToAction && (
        <>
            <DeleteConfirmationDialog
            open={isDeleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={handleDelete}
            itemName="this FAQ"
            />
            <ViewFaqDialog
            open={isViewDialogOpen}
            onOpenChange={setViewDialogOpen}
            faq={faqToAction}
            />
        </>
      )}
    </>
  );
}
