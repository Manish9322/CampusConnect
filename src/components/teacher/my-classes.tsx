"use client";

import * as React from "react";
import { mockClasses, mockStudents, mockTeachers } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Users, BookOpen, Eye } from "lucide-react";
import { ClassDetailsDialog } from "./class-details-dialog";
import { ClassWithDetails, Student } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function MyClasses() {
    const [selectedClass, setSelectedClass] = React.useState<ClassWithDetails | null>(null);
    const [isDetailsOpen, setDetailsOpen] = React.useState(false);

    // Assuming the logged-in teacher is Dr. Alan Turing
    const teacher = mockTeachers.find(t => t.name === "Dr. Alan Turing");
    if (!teacher) return <div>Teacher not found.</div>;

    const teacherClasses = mockClasses.filter(c => teacher.courses.includes(c.name));

    const classesWithDetails = teacherClasses.map(c => {
        const students = mockStudents.filter(s => s.major === teacher.department); // Simplified logic
        return {
            ...c,
            teacher: teacher.name,
            studentCount: students.length,
            subjects: teacher.courses,
            students: students,
        };
    });
    
    const activeClasses = classesWithDetails.filter(c => c.status === 'active');
    const pastClasses = classesWithDetails.filter(c => c.status === 'inactive');

    const handleViewDetails = (c: any) => {
        setSelectedClass(c);
        setDetailsOpen(true);
    };

    const renderClassGrid = (classes: (ClassWithDetails & { students: Student[] })[]) => (
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {classes.map(c => (
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
                        <Button className="w-full" onClick={() => handleViewDetails(c)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );

    return (
        <>
        <Tabs defaultValue="active">
            <TabsList className="mb-4">
                <TabsTrigger value="active">Active Classes</TabsTrigger>
                <TabsTrigger value="past">Past Classes</TabsTrigger>
            </TabsList>
            <TabsContent value="active">
                {renderClassGrid(activeClasses)}
            </TabsContent>
            <TabsContent value="past">
                {renderClassGrid(pastClasses)}
            </TabsContent>
        </Tabs>
           
        {selectedClass && (
             <ClassDetailsDialog 
                isOpen={isDetailsOpen}
                onOpenChange={setDetailsOpen}
                classData={selectedClass}
             />
        )}
        </>
    );
}
