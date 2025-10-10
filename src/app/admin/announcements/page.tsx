
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnnouncementsTable } from "@/components/admin/announcements/announcements-table";
import { mockAnnouncements } from "@/lib/mock-data";

export default function ManageAnnouncementsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Announcements</CardTitle>
                <CardDescription>
                    Create, edit, and publish announcements for the campus.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AnnouncementsTable announcements={mockAnnouncements} />
            </CardContent>
        </Card>
    );
}
