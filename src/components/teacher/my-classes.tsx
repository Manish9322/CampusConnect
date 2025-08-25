
"use client";

import * as React from "react";
import { mockClasses, mockStudents, mockTeachers } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Users, BookOpen, Eye, PlusCircle } from "lucide-react";
import { ClassDetailsDialog } from "./class-details-dialog";
import { ClassWithDetails, Student } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { AddClassDialog } from "../admin/add-class-dialog";

export function MyClasses() {
    const [selectedClass, setSelectedClass] = React.useState<(ClassWithDetails & { students: Student[] }) | null>(null);
    const [isDetailsOpen, setDetailsOpen] = React.useState(false);
    const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");

    // Assuming the logged-in teacher is Dr. Alan Turing
    const teacher = mockTeachers.find(t => t.name === "Dr. Alan Turing");
    if (!teacher) return <div>Teacher not found.</div>;

    const teacherClasses = mockClasses.filter(c => teacher.courses.some(course => c.name.includes(course)));

    const filteredClasses = teacherClasses.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const classesWithDetails = filteredClasses.map(c => {
        const students = mockStudents.filter(s => c.name.includes(s.major)); // Simplified logic
        return {
            ...c,
            teacher: teacher.name,
            studentCount: students.length,
            subjects: [c.name],
            students: students,
        };
    });
    
    const activeClasses = classesWithDetails.filter(c => c.status === 'active');
    const pastClasses = classesWithDetails.filter(c => c.status === 'inactive');

    const handleViewDetails = (c: ClassWithDetails & { students: Student[] }) => {
        setSelectedClass(c);
        setDetailsOpen(true);
    };
    
    const handleSaveClass = (classData: any) => {
        // This is where you would handle saving the data, for now, we'll just update the local state
        console.log("Saving class:", classData);
        setAddDialogOpen(false);
    };

    const renderClassGrid = (classes: (ClassWithDetails & { students: Student[] })[]) => (
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {classes.length > 0 ? classes.map(c => (
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
            )) : <p className="text-muted-foreground col-span-full">No classes found.</p>}
        </div>
    );

    return (
        <>
        <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
            <Input
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
            <Button onClick={() => setAddDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Class
            </Button>
        </div>

        <Tabs defaultValue="active">
            <TabsList className="mb-4">
                <TabsTrigger value="active">Active Classes ({activeClasses.length})</TabsTrigger>
                <TabsTrigger value="past">Past Classes ({pastClasses.length})</TabsTrigger>
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
        <AddClassDialog 
            open={isAddDialogOpen}
            onOpenChange={setAddDialogOpen}
            onSave={handleSaveClass}
            allTeachers={[teacher]}
        />
        </>
    );
}
