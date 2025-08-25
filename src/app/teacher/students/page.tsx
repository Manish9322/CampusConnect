import { ViewStudents } from "@/components/teacher/view-students";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Percent } from "lucide-react";

export default function TeacherStudentsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold mb-6">My Students</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45</div>
                        <p className="text-xs text-muted-foreground">
                            Enrolled in your classes
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
                        <Percent className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">92%</div>
                        <p className="text-xs text-muted-foreground">
                            Across all your students
                        </p>
                    </CardContent>
                </Card>
            </div>
            <ViewStudents />
        </div>
    );
}
