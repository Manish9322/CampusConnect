
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnnouncementsTable } from "@/components/admin/announcements/announcements-table";
import { mockAnnouncements } from "@/lib/mock-data";

export default function ManageAnnouncementsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Manage Announcements</h1>
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
