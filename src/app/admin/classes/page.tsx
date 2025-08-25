
import { ClassesTable } from "@/components/admin/classes-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockClasses, mockStudents, mockTeachers } from "@/lib/mock-data";
import { BookCopy, School, Users, BarChart } from "lucide-react";

export default function ManageClassesPage() {
    const classesWithDetails = mockClasses.map(c => {
        const teacher = mockTeachers.find(t => t.courses.includes(c.name));
        // A more realistic student count logic
        const students = mockStudents.filter(s => teacher?.courses.includes(s.major)); 
        return {
            ...c,
            teacher: teacher?.name || 'N/A',
            subjects: teacher?.courses.filter(course => c.name.includes(course)) || [],
            studentCount: students.length,
        };
    });

    const totalClasses = classesWithDetails.length;
    const activeClasses = classesWithDetails.filter(c => c.status === 'active').length;
    const totalStudents = mockStudents.length; // Or a sum of studentCount if classes don't overlap students
    const avgStudentsPerClass = totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0;

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                        <School className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalClasses}</div>
                        <p className="text-xs text-muted-foreground">Across all departments</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
                        <BookCopy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeClasses}</div>
                        <p className="text-xs text-muted-foreground">Currently in session</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalStudents}</div>
                        <p className="text-xs text-muted-foreground">Enrolled in all classes</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Students/Class</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgStudentsPerClass}</div>
                        <p className="text-xs text-muted-foreground">Average class size</p>
                    </CardContent>
                </Card>
            </div>
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
        </div>
    );
}
