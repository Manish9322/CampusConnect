
"use client";

import { NewsTable } from "@/components/admin/news/news-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetNewsQuery } from "@/services/api";
import { Newspaper, CheckCircle, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ManageNewsPage() {
    const { data: news = [], isLoading } = useGetNewsQuery(undefined);

    const totalNews = news.length;
    const publishedCount = news.filter((n: any) => n.isPublished).length; // Assuming isPublished field
    const draftsCount = totalNews - publishedCount;

    const renderCardContent = (value: number) => {
        return isLoading ? <Skeleton className="h-8 w-1/3" /> : <div className="text-2xl font-bold">{value}</div>
    }

    return (
        <div className="space-y-4 md:space-y-6 p-4 md:p-6">
            <h1 className="text-xl md:text-2xl font-bold">Manage News</h1>
            <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                        <Newspaper className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {renderCardContent(totalNews)}
                        <p className="text-xs text-muted-foreground">All news articles created</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Published</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {renderCardContent(publishedCount)}
                        <p className="text-xs text-muted-foreground">Currently live</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {renderCardContent(draftsCount)}
                        <p className="text-xs text-muted-foreground">Not yet visible</p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader className="space-y-1.5">
                    <CardTitle className="text-xl md:text-2xl">Campus News</CardTitle>
                    <CardDescription className="text-sm">
                        Create, edit, and publish news articles for the campus.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-2 md:px-6">
                    <NewsTable news={news} isLoading={isLoading} />
                </CardContent>
            </Card>
        </div>
    );
}
