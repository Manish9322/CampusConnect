
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
import {
  Mail,
  MailOpen,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import {
  useDeleteContactInquiryMutation,
  useUpdateContactInquiryMutation,
} from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface InquiriesTableProps {
  inquiries: any[];
  isLoading: boolean;
}

export function InquiriesTable({ inquiries, isLoading }: InquiriesTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [readFilter, setReadFilter] = React.useState<"all" | "read" | "unread">("all");
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [isViewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [inquiryToAction, setInquiryToAction] = React.useState<any | null>(
    null
  );
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { toast } = useToast();

  const [updateInquiry] = useUpdateContactInquiryMutation();
  const [deleteInquiry] = useDeleteContactInquiryMutation();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredInquiries = inquiries.filter(
    (item) =>
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (readFilter === "all" || (readFilter === "read" && item.isRead) || (readFilter === "unread" && !item.isRead))
  );

  const totalPages = Math.ceil(filteredInquiries.length / rowsPerPage);
  const paginatedInquiries = filteredInquiries.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  const openDeleteDialog = (item: any) => {
    setInquiryToAction(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (inquiryToAction) {
      try {
        await deleteInquiry(inquiryToAction._id).unwrap();
        toast({
          title: "Inquiry Deleted",
          description: `The inquiry from ${inquiryToAction.name} has been deleted.`,
        });
        setDeleteDialogOpen(false);
        setInquiryToAction(null);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete inquiry.",
          variant: "destructive",
        });
      }
    }
  };

  const handleToggleRead = async (inquiry: any) => {
    try {
      await updateInquiry({ ...inquiry, isRead: !inquiry.isRead }).unwrap();
      toast({
        title: "Status Updated",
        description: `Inquiry marked as ${!inquiry.isRead ? "read" : "unread"}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const handleView = (inquiry: any) => {
    setInquiryToAction(inquiry);
    setViewDialogOpen(true);
    if (!inquiry.isRead) {
      handleToggleRead(inquiry);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-5 w-8" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-40" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-24" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-8 w-24 ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    }

    if (paginatedInquiries.length === 0) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={5}>
              <EmptyState
                title="No Inquiries Found"
                description="There are no inquiries matching your criteria."
              />
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    return (
      <TableBody>
        {paginatedInquiries.map((item) => (
          <TableRow
            key={item._id}
            className={!item.isRead ? "font-bold bg-muted/50" : ""}
          >
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleToggleRead(item)}
              >
                {item.isRead ? (
                  <MailOpen className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
              </Button>
            </TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell className="max-w-xs truncate">{item.message}</TableCell>
            <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleView(item)}
              >
                <Eye className="h-4 w-4" />
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
    );
  };
  
  const renderMobileCards = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }

     if (paginatedInquiries.length === 0) {
      return <EmptyState title="No Inquiries Found" description="There are no inquiries matching your criteria." />
    }
    
    return (
      <div className="space-y-4">
        {paginatedInquiries.map(item => (
          <Card key={item._id} className={!item.isRead ? "border-primary" : ""}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
                {!item.isRead && <div className="h-3 w-3 rounded-full bg-primary mt-1" />}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{item.message}</p>
              <div className="flex gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleView(item)}>View</Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleToggleRead(item)}>{item.isRead ? 'Mark Unread' : 'Mark Read'}</Button>
                <Button variant="destructive" size="icon" onClick={() => openDeleteDialog(item)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <Input
          placeholder="Search by name, email, or message..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full md:max-w-sm"
        />
        <Select value={readFilter} onValueChange={(value) => setReadFilter(value as any)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Received</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          {renderContent()}
        </Table>
      </div>

      <div className="md:hidden">
        {renderMobileCards()}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-end mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Page {page + 1} of {totalPages || 1}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      {inquiryToAction && (
        <>
          <DeleteConfirmationDialog
            open={isDeleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={handleDelete}
            itemName={`inquiry from ${inquiryToAction.name}`}
          />
          <Dialog open={isViewDialogOpen} onOpenChange={setViewDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Inquiry from {inquiryToAction.name}</DialogTitle>
                <DialogDescription>
                  <a
                    href={`mailto:${inquiryToAction.email}`}
                    className="text-primary hover:underline"
                  >
                    {inquiryToAction.email}
                  </a>
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 whitespace-pre-wrap">{inquiryToAction.message}</div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setViewDialogOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}
