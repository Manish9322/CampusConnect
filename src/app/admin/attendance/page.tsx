import { AttendanceTable } from "@/components/admin/attendance-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAttendance } from "@/lib/mock-data";

export default function AttendanceRecordsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Attendance Records</CardTitle>
                <CardDescription>
                    A comprehensive log of all student attendance records.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AttendanceTable records={mockAttendance} />
            </CardContent>
        </Card>
    );
}
