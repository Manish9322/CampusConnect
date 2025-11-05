
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
import { Announcement } from "@/lib/types";
import { Edit, PlusCircle, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddAnnouncementDialog } from "./add-announcement-dialog";
import { useAddAnnouncementMutation, useDeleteAnnouncementMutation, useUpdateAnnouncementMutation } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";

interface AnnouncementsTableProps {
  announcements: Announcement[];
  isLoading: boolean;
}

export function AnnouncementsTable({ announcements, isLoading }: AnnouncementsTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [announcementToAction, setAnnouncementToAction] = React.useState<Announcement | null>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { toast } = useToast();

  const [addAnnouncement] = useAddAnnouncementMutation();
  const [updateAnnouncement] = useUpdateAnnouncementMutation();
  const [deleteAnnouncement] = useDeleteAnnouncementMutation();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredAnnouncements = announcements.filter(
    (item) => item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAnnouncements.length / rowsPerPage);
  const paginatedAnnouncements = filteredAnnouncements.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setPage(0);
  };

  const handleEdit = (item: Announcement) => {
    setAnnouncementToAction(item);
    setAddDialogOpen(true);
  };

  const handleAdd = () => {
    setAnnouncementToAction(null);
    setAddDialogOpen(true);
  };

  const openDeleteDialog = (item: Announcement) => {
    setAnnouncementToAction(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (announcementToAction) {
      try {
        await deleteAnnouncement(announcementToAction._id).unwrap();
        toast({ title: "Announcement Deleted", description: `"${announcementToAction.title}" has been deleted.` });
        setDeleteDialogOpen(false);
        setAnnouncementToAction(null);
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete announcement.", variant: "destructive" });
      }
    }
  };

  const handleTogglePublished = async (announcement: Announcement, isPublished: boolean) => {
    try {
        await updateAnnouncement({ ...announcement, isPublished }).unwrap();
        toast({ title: "Status Updated", description: `"${announcement.title}" has been ${isPublished ? 'published' : 'unpublished'}.` });
    } catch(error) {
        toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    }
  };
  
  const handleSave = async (data: { title: string; content: string; category: string; isPublished: boolean; }) => {
    try {
      if (announcementToAction) {
        await updateAnnouncement({ ...data, _id: announcementToAction._id }).unwrap();
        toast({ title: "Announcement Updated" });
      } else {
        await addAnnouncement({ ...data, author: "Admin User" }).unwrap();
        toast({ title: "Announcement Created" });
      }
      setAddDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save announcement.", variant: "destructive" });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
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
    
    if (paginatedAnnouncements.length === 0) {
        return (
            <TableBody>
                <TableRow>
                    <TableCell colSpan={5}>
                        <EmptyState title="No Announcements Found" description="There are no announcements matching your criteria." />
                    </TableCell>
                </TableRow>
            </TableBody>
        )
    }

    return (
      <TableBody>
        {paginatedAnnouncements.map((item) => (
          <TableRow key={item._id}>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
            <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
              <Switch
                checked={item.isPublished}
                onCheckedChange={(checked) => handleTogglePublished(item, checked)}
                aria-label="Toggle published status"
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
        ))}
      </TableBody>
    );
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <Input
          placeholder="Search by title..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full md:max-w-sm"
        />
        <Button onClick={handleAdd} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Add Announcement</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          {renderContent()}
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))
        ) : paginatedAnnouncements.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <EmptyState title="No Announcements Found" description="There are no announcements matching your criteria." />
            </CardContent>
          </Card>
        ) : (
          paginatedAnnouncements.map((item) => (
            <Card key={item._id}>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="outline">{item.category}</Badge>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {item.isPublished ? 'Published' : 'Draft'}
                    </span>
                    <Switch
                      checked={item.isPublished}
                      onCheckedChange={(checked) => handleTogglePublished(item, checked)}
                      aria-label="Toggle published status"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 min-w-0"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">Edit</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-shrink-0"
                    onClick={() => openDeleteDialog(item)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      {/* Pagination Controls - Responsive */}
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
      <AddAnnouncementDialog
        open={isAddDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSave={handleSave}
        announcementData={announcementToAction}
      />
      {announcementToAction && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDelete}
          itemName={announcementToAction.title}
        />
      )}
    </>
  );
}
