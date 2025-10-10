
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";

export default function AttendanceRequestsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Attendance Requests</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Review Requests</CardTitle>
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
        </div>
    );
}
