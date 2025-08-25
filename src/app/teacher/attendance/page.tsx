import { AttendanceTool } from "@/components/teacher/attendance-tool";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Percent, UserX } from "lucide-react";

export default function TeacherAttendancePage() {
    return (
        <div className="space-y-6">
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's Rate (CS101)</CardTitle>
                        <Percent className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">95%</div>
                        <p className="text-xs text-muted-foreground">
                            Based on submitted data
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Recent Absences</CardTitle>
                        <UserX className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2</div>
                        <p className="text-xs text-muted-foreground">
                            In the last 7 days
                        </p>
                    </CardContent>
                </Card>
            </div>
            <AttendanceTool />
        </div>
    );
}
