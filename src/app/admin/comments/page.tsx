
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetCommentsQuery, useUpdateCommentMutation, useDeleteCommentMutation, useGetNewsQuery } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog";
import Link from "next/link";

export default function CommentsPage() {
    const { data: comments = [], isLoading } = useGetCommentsQuery(undefined);
    const { data: news = [], isLoading: isLoadingNews } = useGetNewsQuery(undefined);
    const [updateComment] = useUpdateCommentMutation();
    const [deleteComment] = useDeleteCommentMutation();
    const { toast } = useToast();

    const [commentToAction, setCommentToAction] = React.useState<any>(null);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleUpdateStatus = async (id: string, approved: boolean) => {
        try {
            await updateComment({ _id: id, approved }).unwrap();
            toast({
                title: "Status Updated",
                description: `Comment status has been updated to ${approved ? 'Approved' : 'Unapproved'}.`
            });
        } catch (error) {
            toast({
                title: "Update Failed",
                description: "There was an error updating the comment status.",
                variant: "destructive"
            });
        }
    };
    
    const handleDeleteClick = (comment: any) => {
        setCommentToAction(comment);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (commentToAction) {
            try {
                await deleteComment(commentToAction._id).unwrap();
                toast({ title: "Comment Deleted" });
                setDeleteDialogOpen(false);
            } catch (error) {
                toast({ title: "Error deleting comment", variant: "destructive" });
            }
        }
    };
    
    const getNewsTitle = (newsId: string) => {
        const newsItem = news.find((n: any) => n._id === newsId);
        return newsItem ? newsItem.title : "Unknown Article";
    };
    
    const getNewsSlug = (newsId: string) => {
        const newsItem = news.find((n: any) => n._id === newsId);
        return newsItem ? newsItem.slug : null;
    }

    const totalPages = Math.ceil(comments.length / rowsPerPage);
    const paginatedComments = comments.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    return (
        <div className="space-y-6 p-4 md:p-6">
            <div>
                <h1 className="text-2xl font-bold">Comment Moderation</h1>
                <p className="text-muted-foreground mt-1">Review and approve user-submitted comments.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Comments</CardTitle>
                    <CardDescription>Approve, unapprove, or delete comments.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Comment</TableHead>
                                    <TableHead>Article</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading || isLoadingNews ? (
                                    [...Array(5)].map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                            <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : paginatedComments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6}>
                                            <EmptyState title="No Comments" description="No comments have been submitted yet." />
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedComments.map((c: any) => (
                                        <TableRow key={c._id}>
                                            <TableCell className="font-medium">{c.authorName}</TableCell>
                                            <TableCell className="max-w-xs truncate">{c.content}</TableCell>
                                            <TableCell>
                                                <Link href={`/news/${getNewsSlug(c.newsId)}`} target="_blank" className="hover:underline text-primary">
                                                    {getNewsTitle(c.newsId)}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Badge variant={c.approved ? "default" : "secondary"}>
                                                    {c.approved ? 'Approved' : 'Pending'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {!c.approved ? (
                                                    <Button size="icon" variant="ghost" className="text-green-600" onClick={() => handleUpdateStatus(c._id, true)}>
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    <Button size="icon" variant="ghost" className="text-yellow-600" onClick={() => handleUpdateStatus(c._id, false)}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDeleteClick(c)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <div>
                            <span className="text-sm text-muted-foreground">
                                Page {page + 1} of {totalPages || 1}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
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
                </CardContent>
            </Card>
            <DeleteConfirmationDialog 
                open={isDeleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
                itemName="this comment"
            />
        </div>
    );
}
