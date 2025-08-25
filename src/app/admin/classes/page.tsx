import { ClassesTable } from "@/components/admin/classes-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockClasses } from "@/lib/mock-data";

export default function ManageClassesPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Classes</CardTitle>
                <CardDescription>
                    A list of all classes offered. You can add, edit, or delete class records.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ClassesTable classes={mockClasses} />
            </CardContent>
        </Card>
    );
}
