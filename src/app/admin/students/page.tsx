import { AddStudentDialog } from "@/components/admin/add-student-dialog";
import { StudentsTable } from "@/components/admin/students-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockStudents } from "@/lib/mock-data";

export default function ManageStudentsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Students</CardTitle>
                <CardDescription>
                    A list of all students in the system. You can add, edit, or delete student records.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <StudentsTable students={mockStudents} />
            </CardContent>
        </Card>
    );
}
