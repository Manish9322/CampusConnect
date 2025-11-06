
"use client";

import * as React from "react";
import { FeeManagementDashboard } from "@/components/admin/fees/fee-management-dashboard";
import { mockFeeRecords, mockStudents } from "@/lib/mock-data";
import { DollarSign, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetFeeStructureQuery } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeeManagementPage() {
    const { data: feeStructure = [], isLoading: isLoadingFeeStructure } = useGetFeeStructureQuery();

    // Calculate total fees from active components
    const totalFees = React.useMemo(() => {
        if (isLoadingFeeStructure || feeStructure.length === 0) return 0;
        return feeStructure
            .filter((item: any) => item.isActive)
            .reduce((sum: number, item: any) => sum + item.amount, 0);
    }, [feeStructure, isLoadingFeeStructure]);

    // Mock data for now, can be replaced with dynamic data later
    const paidCount = mockFeeRecords.filter(r => r.status === 'Paid').length;
    const pendingCount = mockFeeRecords.filter(r => r.status === 'Pending').length;
    const overdueCount = mockFeeRecords.filter(r => r.status === 'Overdue').length;

    const stats = [
        { title: 'Total Defined Fees', value: totalFees, icon: DollarSign, isCurrency: true },
        { title: 'Paid Records', value: paidCount, icon: CheckCircle },
        { title: 'Pending Records', value: pendingCount, icon: Clock },
        { title: 'Overdue Records', value: overdueCount, icon: AlertCircle },
    ];

    return (
        <div className="space-y-4 md:space-y-6 p-4 md:p-6">
            <h1 className="text-xl md:text-2xl font-bold">Fee Management</h1>
            <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
                {stats.map(stat => (
                     <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-2xl font-bold">
                                {isLoadingFeeStructure && stat.isCurrency ? 
                                    <Skeleton className="h-8 w-24" /> : 
                                    (stat.isCurrency ? `$${stat.value.toLocaleString()}` : stat.value)
                                }
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <FeeManagementDashboard initialRecords={mockFeeRecords} students={mockStudents} />
        </div>
    );
}
