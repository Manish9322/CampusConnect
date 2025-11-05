
import { FeeManagementDashboard } from "@/components/admin/fees/fee-management-dashboard";
import { mockFeeRecords, mockStudents } from "@/lib/mock-data";
import { DollarSign, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeeManagementPage() {
    const totalRecords = mockFeeRecords.length;
    const paidCount = mockFeeRecords.filter(r => r.status === 'Paid').length;
    const pendingCount = mockFeeRecords.filter(r => r.status === 'Pending').length;
    const overdueCount = mockFeeRecords.filter(r => r.status === 'Overdue').length;

    const stats = [
        { title: 'Total Records', value: totalRecords, icon: DollarSign },
        { title: 'Paid', value: paidCount, icon: CheckCircle },
        { title: 'Pending', value: pendingCount, icon: Clock },
        { title: 'Overdue', value: overdueCount, icon: AlertCircle },
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
                            <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <FeeManagementDashboard initialRecords={mockFeeRecords} students={mockStudents} />
        </div>
    );
}
