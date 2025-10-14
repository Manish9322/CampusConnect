
"use client"

import * as React from "react";
import { UpdateProfileForm } from "@/components/teacher/profile/update-profile-form";
import { ChangePasswordForm } from "@/components/teacher/profile/change-password-form";
import { Teacher } from "@/lib/types";

export default function TeacherProfilePage() {
    const [teacher, setTeacher] = React.useState<Teacher | null>(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setTeacher(JSON.parse(storedUser));
        }
    }, []);

    if (!teacher) {
        return <div>Loading...</div>; // Or a skeleton loader
    }

    const handleProfileUpdate = (updatedTeacher: Teacher) => {
        setTeacher(updatedTeacher);
        localStorage.setItem('user', JSON.stringify(updatedTeacher));
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
