
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnnouncementsTable } from "@/components/admin/announcements/announcements-table";
import { useGetAnnouncementsQuery } from "@/services/api";
import { Megaphone, CheckCircle, FileText, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ManageAnnouncementsPage() {
    const { data: announcements = [], isLoading } = useGetAnnouncementsQuery();

    const totalAnnouncements = announcements.length;
    const publishedCount = announcements.filter((a: { isPublished: any; }) => a.isPublished).length;
    const unpublishedCount = totalAnnouncements - publishedCount;
    const urgentCount = announcements.filter((a: { category: string; isPublished: any; }) => a.category === 'Urgent' && a.isPublished).length;

    const renderCardContent = (value: number) => {
        return isLoading ? <Skeleton className="h-8 w-1/3" /> : <div className="text-2xl font-bold">{value}</div>
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Manage Announcements</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Announcements</CardTitle>
                        <Megaphone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {renderCardContent(totalAnnouncements)}
                        <p className="text-xs text-muted-foreground">All announcements created</p>
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
                        <CardTitle className="text-sm font-medium">Unpublished Drafts</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {renderCardContent(unpublishedCount)}
                        <p className="text-xs text-muted-foreground">Not yet visible</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Urgent Alerts</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        {renderCardContent(urgentCount)}
                        <p className="text-xs text-muted-foreground">Active urgent notices</p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Campus Announcements</CardTitle>
                    <CardDescription>
                        Create, edit, and publish announcements for the campus.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AnnouncementsTable announcements={announcements} isLoading={isLoading} />
                </CardContent>
            </Card>
        </div>
    );
}
