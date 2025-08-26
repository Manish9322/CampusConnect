
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";

export default function AttendanceRequestsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Attendance Requests</CardTitle>
                <CardDescription>
                    Review and approve or deny attendance change requests from students and teachers.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <EmptyState 
                    title="No Pending Requests"
                    description="There are currently no attendance requests to review."
                />
            </CardContent>
        </Card>
    );
}
