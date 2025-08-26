
"use client"

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
    const [subjects, setSubjects] = React.useState(["Math", "Science", "History", "English", "Physics"]);
    const [departments, setDepartments] = React.useState(["Computer Science", "Physics", "Mathematics", "Chemistry"]);
    const [newSubject, setNewSubject] = React.useState("");
    const [newDepartment, setNewDepartment] = React.useState("");
    const { toast } = useToast();

    const handleAddSubject = () => {
        if (newSubject.trim()) {
            setSubjects(prev => [...prev, newSubject.trim()]);
            setNewSubject("");
            toast({ title: "Subject Added", description: `"${newSubject.trim()}" has been added.` });
        }
    };

    const handleRemoveSubject = (subject: string) => {
        setSubjects(prev => prev.filter(s => s !== subject));
        toast({ title: "Subject Removed", description: `"${subject}" has been removed.` });
    };

    const handleAddDepartment = () => {
        if (newDepartment.trim()) {
            setDepartments(prev => [...prev, newDepartment.trim()]);
            setNewDepartment("");
            toast({ title: "Department Added", description: `"${newDepartment.trim()}" has been added.` });
        }
    };

    const handleRemoveDepartment = (department: string) => {
        setDepartments(prev => prev.filter(d => d !== department));
        toast({ title: "Department Removed", description: `"${department}" has been removed.` });
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
                            <div className="flex gap-2">
                                <Input
                                    value={newSubject}
                                    onChange={(e) => setNewSubject(e.target.value)}
                                    placeholder="New subject name"
                                />
                                <Button onClick={handleAddSubject}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {subjects.map(subject => (
                                    <div key={subject} className="flex items-center justify-between p-2 border rounded-md">
                                        <span>{subject}</span>
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveSubject(subject)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
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
                            <div className="flex gap-2">
                                <Input
                                    value={newDepartment}
                                    onChange={(e) => setNewDepartment(e.target.value)}
                                    placeholder="New department name"
                                />
                                <Button onClick={handleAddDepartment}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {departments.map(department => (
                                    <div key={department} className="flex items-center justify-between p-2 border rounded-md">
                                        <span>{department}</span>
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveDepartment(department)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
