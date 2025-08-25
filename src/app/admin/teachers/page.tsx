import { TeachersTable } from "@/components/admin/teachers-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockTeachers } from "@/lib/mock-data";

export default function ManageTeachersPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Teachers</CardTitle>
                <CardDescription>
                    A list of all teachers in the system. You can add, edit, or delete teacher records.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <TeachersTable data={mockTeachers} />
            </CardContent>
        </Card>
    );
}
