
import { AttendanceTable } from "@/components/admin/attendance-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAttendance } from "@/lib/mock-data";

export default function AttendanceRecordsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Attendance Management</CardTitle>
                <CardDescription>
                    A comprehensive log of all student attendance records. You can view and edit attendance here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AttendanceTable records={mockAttendance} />
            </CardContent>
        </Card>
    );
}
