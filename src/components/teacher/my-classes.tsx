
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Eye, PlusCircle } from "lucide-react";
import { ClassDetailsDialog } from "./class-details-dialog";
import { Class, ClassWithDetails, Student, Teacher } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { AddClassDialog } from "../admin/add-class-dialog";
import { EmptyState } from "../shared/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Skeleton } from "../ui/skeleton";
import { useAddClassMutation } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface MyClassesProps {
    teacher: Teacher | null;
    teacherClasses: Class[];
    allStudents: Student[];
    isLoading: boolean;
}

export function MyClasses({ teacher, teacherClasses, allStudents, isLoading }: MyClassesProps) {
    const { toast } = useToast();
    const [selectedClass, setSelectedClass] = React.useState<(ClassWithDetails & { students: Student[] }) | null>(null);
    const [isDetailsOpen, setDetailsOpen] = React.useState(false);
    const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");

    const [addClass] = useAddClassMutation();

    const filteredClasses = teacherClasses.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const classesWithDetails = filteredClasses.map(c => {
        const students = allStudents.filter(s => s.classId === c._id);
        const teacherName = (c.teacherId as Teacher)?.name || teacher?.name || 'N/A';
        return {
            ...c,
            teacher: teacherName,
            studentCount: students.length,
            students: students,
        };
    });
    
    const activeClasses = classesWithDetails.filter(c => c.status === 'active');
    const pastClasses = classesWithDetails.filter(c => c.status === 'inactive');

    const handleViewDetails = (c: ClassWithDetails & { students: Student[] }) => {
        setSelectedClass(c);
        setDetailsOpen(true);
    };
    
    const handleSaveClass = async (classData: any) => {
        if (!teacher) return;
        try {
            await addClass({ ...classData, teacherId: teacher._id }).unwrap();
            toast({ title: "Class Added", description: `Class ${classData.name} has been requested.` });
        } catch (error) {
            toast({ title: "Error", description: "Failed to add class.", variant: "destructive" });
        }
        setAddDialogOpen(false);
    };

    const renderClassTable = (classes: (ClassWithDetails & { students: Student[] })[]) => {
        if (isLoading) {
            return (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Class Name</TableHead>
                                <TableHead>Year</TableHead>
                                <TableHead>Subjects</TableHead>
                                <TableHead>No. of Students</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...Array(3)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            );
        }

        if (classes.length === 0) {
            return <EmptyState title="No Classes Found" description="You do not have any classes in this category." />;
        }

        return (
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Class Name</TableHead>
                            <TableHead>Year</TableHead>
                            <TableHead>Subjects</TableHead>
                            <TableHead>No. of Students</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {classes.map(c => (
                            <TableRow key={c._id}>
                                <TableCell className="font-medium">{c.name}</TableCell>
                                <TableCell>{c.year}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {c.subjects.map(sub => (
                                            <Badge key={sub} variant="secondary">{sub}</Badge>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>{c.studentCount}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleViewDetails(c)}>
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Class Management</CardTitle>
                    <CardDescription>View and manage your assigned classes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
                        <Input
                            placeholder="Search classes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>

                    <Tabs defaultValue="active">
                        <TabsList className="mb-4">
                            <TabsTrigger value="active">Active Classes ({activeClasses.length})</TabsTrigger>
                            <TabsTrigger value="past">Past Classes ({pastClasses.length})</TabsTrigger>
                        </TabsList>
                        <TabsContent value="active">
                            {renderClassTable(activeClasses)}
                        </TabsContent>
                        <TabsContent value="past">
                            {renderClassTable(pastClasses)}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
           
            {selectedClass && (
                <ClassDetailsDialog 
                    isOpen={isDetailsOpen}
                    onOpenChange={setDetailsOpen}
                    classData={selectedClass}
                />
            )}
            
            {teacher && 
                <AddClassDialog 
                    open={isAddDialogOpen}
                    onOpenChange={setAddDialogOpen}
                    onSave={handleSaveClass}
                />
            }
        </>
    );
}
