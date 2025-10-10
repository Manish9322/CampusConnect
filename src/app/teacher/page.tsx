import { TeacherDashboardCards } from "@/components/teacher/teacher-dashboard-cards";
import { TeacherAttendanceOverviewChart } from "@/components/teacher/teacher-attendance-overview-chart";
import { StudentEngagementChart } from "@/components/teacher/student-engagement-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockTeachers } from "@/lib/mock-data";
import { BarChart, Users, Percent, ArrowUp } from "lucide-react";

export default function TeacherDashboardPage() {
    const teacher = mockTeachers.find(t => t.id === '101');
    const teacherName = teacher ? `${teacher.designation || ''} ${teacher.name}` : 'Teacher';
    
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                 <h1 className="text-2xl font-bold">Welcome back, {teacherName}!</h1>
                 <p className="text-muted-foreground">Here's your dashboard overview for today.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45</div>
                        <p className="text-xs text-muted-foreground">Across 2 classes</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Class Size</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">22</div>
                        <p className="text-xs text-muted-foreground">Campus average is 28</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Attendance Rate</CardTitle>
                        <Percent className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">94%</div>
                        <p className="text-xs text-muted-foreground flex items-center">
                            <ArrowUp className="h-3 w-3 mr-1 text-green-500"/>
                            +2% from last week
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Assignments Graded</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">34/45</div>
                        <p className="text-xs text-muted-foreground">Physics Lab Report</p>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
                <TeacherAttendanceOverviewChart />
                <StudentEngagementChart />
            </div>

            <TeacherDashboardCards />
        </div>
    );
}
