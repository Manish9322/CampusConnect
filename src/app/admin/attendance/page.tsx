
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Class, Student } from "@/lib/types";
import { BookCopy, Users } from "lucide-react";
import { ClassAttendanceModal } from "@/components/admin/class-attendance-modal";
import { useGetClassesQuery, useGetStudentsQuery, useGetTeachersQuery } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";

interface ClassWithStudentDetails extends Class {
    teacher: string;
    studentCount: number;
    students: Student[];
}

export default function AttendancePage() {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [selectedClass, setSelectedClass] = React.useState<ClassWithStudentDetails | null>(null);

    const { data: classes = [], isLoading: isLoadingClasses } = useGetClassesQuery();
    const { data: teachers = [], isLoading: isLoadingTeachers } = useGetTeachersQuery();
    const { data: students = [], isLoading: isLoadingStudents } = useGetStudentsQuery();

    const isLoading = isLoadingClasses || isLoadingTeachers || isLoadingStudents;

    const classDetails: ClassWithStudentDetails[] = React.useMemo(() => {
        if (isLoading) return [];
        return classes.map((c: Class) => {
            const teacher = teachers.find((t: any) => t._id === c.teacherId)?.name || "N/A";
            const studentsInClass = students.filter((s: Student) => s.classId === c._id);
            return {
                ...c,
                teacher,
                studentCount: studentsInClass.length,
                students: studentsInClass,
            };
        });
    }, [classes, teachers, students, isLoading]);

    const filteredClasses = classDetails.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.teacher.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderClassGrid = () => {
        if (isLoading) {
            return (
                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-5 w-1/3" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )
        }

        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredClasses.map(c => (
                    <Card
                        key={c._id}
                        className="cursor-pointer hover:shadow-lg hover:border-primary transition-all"
                        onClick={() => setSelectedClass(c)}
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookCopy className="h-5 w-5 text-primary" />
                                {c.name}
                            </CardTitle>
                            <CardDescription>Taught by {c.teacher}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>{c.studentCount} Students</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Attendance Management</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Select a Class</CardTitle>
                    <CardDescription>
                        Click on a class to view and manage student attendance.
                    </CardDescription>
                </CardHeader>
                    <CardContent>
                    <Input
                        placeholder="Search for a class or teacher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                </CardContent>
            </Card>

            {renderClassGrid()}

            {selectedClass && (
                <ClassAttendanceModal
                    isOpen={!!selectedClass}
                    onOpenChange={() => setSelectedClass(null)}
                    classData={selectedClass}
                />
            )}
        </div>
    );
}
