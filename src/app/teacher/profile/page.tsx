
"use client"

import * as React from "react";
import { UpdateProfileForm } from "@/components/teacher/profile/update-profile-form";
import { ChangePasswordForm } from "@/components/teacher/profile/change-password-form";
import { Teacher } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function TeacherProfilePage() {
    const [teacher, setTeacher] = React.useState<Teacher | null>(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('teacher_user');
        if (storedUser) {
            // Add a small delay to better visualize the skeleton
            setTimeout(() => {
                setTeacher(JSON.parse(storedUser));
            }, 300);
        }
    }, []);

    if (!teacher) {
        return (
            <div className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-72" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-1/3" />
                                <Skeleton className="h-4 w-2/3" />
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="flex items-center gap-6">
                                    <Skeleton className="h-20 w-20 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                         <Skeleton className="h-4 w-1/4" />
                                         <Skeleton className="h-10 w-full" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-1/4" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                 <div className="space-y-2">
                                    <Skeleton className="h-4 w-1/4" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-1/4" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <Skeleton className="h-10 w-32" />
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                       <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-1/2" />
                                <Skeleton className="h-4 w-full" />
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                 <div className="space-y-2">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                 <div className="space-y-2">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <Skeleton className="h-10 w-full" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    const handleProfileUpdate = (updatedTeacher: Teacher) => {
        setTeacher(updatedTeacher);
        localStorage.setItem('teacher_user', JSON.stringify(updatedTeacher));
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">My Profile</h1>
                <p className="text-muted-foreground">
                    Manage your personal information and account settings.
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <UpdateProfileForm teacher={teacher} onProfileUpdate={handleProfileUpdate} />
                </div>
                <div>
                    <ChangePasswordForm teacherId={teacher._id!} />
                </div>
            </div>
        </div>
    );
}
