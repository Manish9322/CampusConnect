"use client";

import { mockClasses, mockStudents, mockTeachers } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Users, BookOpen } from "lucide-react";

export function MyClasses() {
    // Assuming the logged-in teacher is Dr. Alan Turing
    const teacher = mockTeachers.find(t => t.name === "Dr. Alan Turing");
    if (!teacher) return <div>Teacher not found.</div>;

    const teacherClasses = mockClasses.filter(c => teacher.courses.includes(c.name));

    const classesWithDetails = teacherClasses.map(c => {
        const students = mockStudents.filter(s => s.major === teacher.department); // Simplified logic
        return {
            ...c,
            studentCount: students.length,
            subjects: teacher.courses,
        };
    });

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {classesWithDetails.map(c => (
                <Card key={c.id}>
                    <CardHeader>
                        <CardTitle>{c.name}</CardTitle>
                        <CardDescription>Year: {c.year}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{c.studentCount} Students</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <BookOpen className="h-4 w-4" />
                            <span>Subjects:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {c.subjects.map(sub => (
                                <Badge key={sub} variant="secondary">{sub}</Badge>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full">View Details</Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
