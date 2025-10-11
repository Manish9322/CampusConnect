
"use client"

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGetSubjectsQuery, useAddSubjectMutation, useDeleteSubjectMutation, useGetDepartmentsQuery, useAddDepartmentMutation, useDeleteDepartmentMutation } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
    const [newSubjectName, setNewSubjectName] = React.useState("");
    const [newSubjectDescription, setNewSubjectDescription] = React.useState("");
    const [newDepartmentName, setNewDepartmentName] = React.useState("");
    const [newDepartmentDescription, setNewDepartmentDescription] = React.useState("");
    const { toast } = useToast();

    const { data: subjects = [], isLoading: isLoadingSubjects } = useGetSubjectsQuery();
    const [addSubject, { isLoading: isAddingSubject }] = useAddSubjectMutation();
    const [deleteSubject] = useDeleteSubjectMutation();
    
    const { data: departments = [], isLoading: isLoadingDepartments } = useGetDepartmentsQuery();
    const [addDepartment, { isLoading: isAddingDepartment }] = useAddDepartmentMutation();
    const [deleteDepartment] = useDeleteDepartmentMutation();

    const handleAddSubject = async () => {
        if (newSubjectName.trim()) {
            try {
                await addSubject({ name: newSubjectName.trim(), description: newSubjectDescription.trim() }).unwrap();
                toast({ title: "Subject Added", description: `"${newSubjectName.trim()}" has been added.` });
                setNewSubjectName("");
                setNewSubjectDescription("");
            } catch (error) {
                toast({ title: "Error", description: "Failed to add subject.", variant: "destructive" });
            }
        }
    };

    const handleRemoveSubject = async (subject: { _id: string, name: string }) => {
        try {
            await deleteSubject(subject._id).unwrap();
            toast({ title: "Subject Removed", description: `"${subject.name}" has been removed.` });
        } catch (error) {
            toast({ title: "Error", description: "Failed to remove subject.", variant: "destructive" });
        }
    };

    const handleAddDepartment = async () => {
        if (newDepartmentName.trim()) {
            try {
                await addDepartment({ name: newDepartmentName.trim(), description: newDepartmentDescription.trim() }).unwrap();
                toast({ title: "Department Added", description: `"${newDepartmentName.trim()}" has been added.` });
                setNewDepartmentName("");
                setNewDepartmentDescription("");
            } catch (error) {
                toast({ title: "Error", description: "Failed to add department.", variant: "destructive" });
            }
        }
    };

    const handleRemoveDepartment = async (department: { _id: string, name: string }) => {
        try {
            await deleteDepartment(department._id).unwrap();
            toast({ title: "Department Removed", description: `"${department.name}" has been removed.` });
        } catch (error) {
            toast({ title: "Error", description: "Failed to remove department.", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Manage Subjects</CardTitle>
                        <CardDescription>Add or remove subjects offered.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <Input
                                    value={newSubjectName}
                                    onChange={(e) => setNewSubjectName(e.target.value)}
                                    placeholder="New subject name"
                                    disabled={isAddingSubject}
                                />
                                <Textarea
                                    value={newSubjectDescription}
                                    onChange={(e) => setNewSubjectDescription(e.target.value)}
                                    placeholder="Subject description (optional)"
                                    disabled={isAddingSubject}
                                />
                                <Button onClick={handleAddSubject} disabled={isAddingSubject}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> {isAddingSubject ? "Adding..." : "Add Subject"}
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {isLoadingSubjects ? (
                                    [...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
                                ) : subjects.length > 0 ? (
                                    subjects.map((subject) => (
                                        <div key={subject._id} className="flex items-center justify-between p-2 border rounded-md">
                                            <div>
                                                <p className="font-medium">{subject.name}</p>
                                                {subject.description && <p className="text-sm text-muted-foreground">{subject.description}</p>}
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => handleRemoveSubject(subject)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <EmptyState title="No Subjects" description="No subjects have been added yet." />
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Manage Departments</CardTitle>
                        <CardDescription>Add or remove academic departments.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <Input
                                    value={newDepartmentName}
                                    onChange={(e) => setNewDepartmentName(e.target.value)}
                                    placeholder="New department name"
                                    disabled={isAddingDepartment}
                                />
                                <Textarea
                                    value={newDepartmentDescription}
                                    onChange={(e) => setNewDepartmentDescription(e.target.value)}
                                    placeholder="Department description (optional)"
                                    disabled={isAddingDepartment}
                                />
                                <Button onClick={handleAddDepartment} disabled={isAddingDepartment}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> {isAddingDepartment ? "Adding..." : "Add Department"}
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {isLoadingDepartments ? (
                                    [...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
                                ) : departments.length > 0 ? (
                                    departments.map((department) => (
                                        <div key={department._id} className="flex items-center justify-between p-2 border rounded-md">
                                            <div>
                                                <p className="font-medium">{department.name}</p>
                                                {department.description && <p className="text-sm text-muted-foreground">{department.description}</p>}
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => handleRemoveDepartment(department)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                     <EmptyState title="No Departments" description="No departments have been added yet." />
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
