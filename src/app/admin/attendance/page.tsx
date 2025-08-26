
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mockClasses, mockStudents, mockTeachers } from "@/lib/mock-data";
import { Class, Student } from "@/lib/types";
import { BookCopy, Users } from "lucide-react";
import { ClassAttendanceModal } from "@/components/admin/class-attendance-modal";

interface ClassWithStudentDetails extends Class {
    teacher: string;
    studentCount: number;
    students: Student[];
}

export default function AttendancePage() {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [selectedClass, setSelectedClass] = React.useState<ClassWithStudentDetails | null>(null);

    const classDetails: ClassWithStudentDetails[] = mockClasses.map(c => {
        const teacher = mockTeachers.find(t => t.courses.some(course => c.name.includes(course)))?.name || "N/A";
        const studentsInClass = mockStudents.filter(s => c.name.includes(s.major));
        return {
            ...c,
            teacher,
            studentCount: studentsInClass.length,
            students: studentsInClass,
        };
    });

    const filteredClasses = classDetails.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.teacher.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Attendance Management</CardTitle>
                        <CardDescription>
                            Select a class to view and manage student attendance.
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

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredClasses.map(c => (
                        <Card
                            key={c.id}
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
            </div>

            {selectedClass && (
                <ClassAttendanceModal
                    isOpen={!!selectedClass}
                    onOpenChange={() => setSelectedClass(null)}
                    classData={selectedClass}
                />
            )}
        </>
    );
}
