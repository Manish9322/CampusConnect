
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnnouncementsTable } from "@/components/admin/announcements/announcements-table";
import { mockAnnouncements } from "@/lib/mock-data";
import { Megaphone, CheckCircle, FileText, AlertTriangle } from "lucide-react";

export default function ManageAnnouncementsPage() {
    const totalAnnouncements = mockAnnouncements.length;
    const publishedCount = mockAnnouncements.filter(a => a.isPublished).length;
    const unpublishedCount = totalAnnouncements - publishedCount;
    const urgentCount = mockAnnouncements.filter(a => a.category === 'Urgent' && a.isPublished).length;

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
                        <div className="text-2xl font-bold">{totalAnnouncements}</div>
                        <p className="text-xs text-muted-foreground">All announcements created</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Published</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{publishedCount}</div>
                        <p className="text-xs text-muted-foreground">Currently live</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unpublished Drafts</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{unpublishedCount}</div>
                        <p className="text-xs text-muted-foreground">Not yet visible</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Urgent Alerts</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{urgentCount}</div>
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
                    <AnnouncementsTable announcements={mockAnnouncements} />
                </CardContent>
            </Card>
        </div>
    );
}
