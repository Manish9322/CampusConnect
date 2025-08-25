
import { ClassesTable } from "@/components/admin/classes-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockClasses, mockStudents, mockTeachers } from "@/lib/mock-data";

export default function ManageClassesPage() {
    const classesWithDetails = mockClasses.map(c => {
        const teacher = mockTeachers.find(t => t.courses.includes(c.name));
        const students = mockStudents.filter(s => s.major === teacher?.department); // simple mapping for demo
        return {
            ...c,
            teacher: teacher?.name || 'N/A',
            subjects: teacher?.courses || [],
            studentCount: students.length,
        };
    });


    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Classes</CardTitle>
                <CardDescription>
                    A list of all classes offered. You can add, edit, or delete class records.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ClassesTable classes={classesWithDetails} />
            </CardContent>
        </Card>
    );
}
