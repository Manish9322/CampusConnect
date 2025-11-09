
"use client";

import { StaffTable } from "@/components/admin/staff/staff-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetStaffQuery } from "@/services/api";
import { Briefcase, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import * as React from "react";

export default function ManageStaffPage() {
    const { data: staff = [], isLoading } = useGetStaffQuery({});

    const totalStaff = staff.length;
    
    const renderCardContent = (value: number) => {
        return isLoading ? <Skeleton className="h-8 w-1/3" /> : <div className="text-2xl font-bold">{value}</div>
    }

    return (
        <div className="space-y-4 md:space-y-6 p-4 md:p-6">
            <h1 className="text-xl md:text-2xl font-bold">Staff Management</h1>
             <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Staff Members</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {renderCardContent(totalStaff)}
                        <p className="text-xs text-muted-foreground">All non-teaching staff</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Showing</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <Skeleton className="h-8 w-1/3" /> : <div className="text-2xl font-bold">{totalStaff}</div>}
                        <p className="text-xs text-muted-foreground">Based on current filters</p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader className="space-y-1.5">
                    <CardTitle className="text-xl md:text-2xl">Staff Directory</CardTitle>
                    <CardDescription className="text-sm">
                        Add, edit, and manage staff members for the "Our Team" section.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-2 md:px-6">
                    <StaffTable staff={staff} isLoading={isLoading} />
                </CardContent>
            </Card>
        </div>
    );
}
