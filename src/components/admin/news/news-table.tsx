
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
import { Edit, PlusCircle, Trash2, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useAddNewsMutation, useDeleteNewsMutation, useUpdateNewsMutation } from "@/services/api";
import { AddNewsDialog } from "./add-news-dialog";
import Link from "next/link";
import Image from "next/image";

interface NewsTableProps {
  news: any[];
  isLoading: boolean;
}

export function NewsTable({ news, isLoading }: NewsTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [newsToAction, setNewsToAction] = React.useState<any | null>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { toast } = useToast();

  const [addNews] = useAddNewsMutation();
  const [updateNews] = useUpdateNewsMutation();
  const [deleteNews] = useDeleteNewsMutation();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredNews = news.filter(
    (item) => item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNews.length / rowsPerPage);
  const paginatedNews = filteredNews.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setPage(0);
  };

  const handleEdit = (item: any) => {
    setNewsToAction(item);
    setAddDialogOpen(true);
  };

  const handleAdd = () => {
    setNewsToAction(null);
    setAddDialogOpen(true);
  };

  const openDeleteDialog = (item: any) => {
    setNewsToAction(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (newsToAction) {
      try {
        await deleteNews(newsToAction._id).unwrap();
        toast({ title: "News Deleted", description: `"${newsToAction.title}" has been deleted.` });
        setDeleteDialogOpen(false);
        setNewsToAction(null);
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete news article.", variant: "destructive" });
      }
    }
  };
  
  const handleSave = async (data: any) => {
    try {
      if (newsToAction) {
        await updateNews({ ...data, _id: newsToAction._id }).unwrap();
        toast({ title: "News Updated" });
      } else {
        await addNews({ ...data, author: "Admin User" }).unwrap();
        toast({ title: "News Created" });
      }
      setAddDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save news article.", variant: "destructive" });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-10 w-16" /></TableCell>
              <TableCell><Skeleton className="h-5 w-48" /></TableCell>
              <TableCell><Skeleton className="h-5 w-20" /></TableCell>
              <TableCell><Skeleton className="h-5 w-24" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    }
    
    if (paginatedNews.length === 0) {
        return (
            <TableBody>
                <TableRow>
                    <TableCell colSpan={5}>
                        <EmptyState title="No News Found" description="There are no news articles matching your criteria." />
                    </TableCell>
                </TableRow>
            </TableBody>
        )
    }

    return (
      <TableBody>
        {paginatedNews.map((item) => (
          <TableRow key={item._id}>
            <TableCell>
              <Image src={item.bannerImage} alt={item.title} width={64} height={40} className="rounded-md object-cover" />
            </TableCell>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
            <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
              <Link href={`/news/${item.slug}`} target="_blank">
                <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                </Button>
              </Link>
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
          <span className="hidden sm:inline">Add News</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Banner</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
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
      <AddNewsDialog
        open={isAddDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSave={handleSave}
        newsData={newsToAction}
      />
      {newsToAction && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDelete}
          itemName={newsToAction.title}
        />
      )}
    </>
  );
}
