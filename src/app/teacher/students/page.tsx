
import { ViewStudents } from "@/components/teacher/view-students";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockStudents, mockTeachers } from "@/lib/mock-data";
import { Users, UserCheck, TrendingUp, AlertTriangle } from "lucide-react";

export default function TeacherStudentsPage() {
    // Assuming the logged-in teacher is Dr. Alan Turing
    const teacher = mockTeachers.find((t) => t.name === "Alan Turing");
    const teacherStudents = teacher
        ? mockStudents.filter((s) => s.major === teacher.department)
        : [];

    const totalStudents = teacherStudents.length;

    const avgAttendance =
        totalStudents > 0
            ? Math.round(
                teacherStudents.reduce((acc, s) => acc + s.attendancePercentage, 0) /
                totalStudents
            )
            : 0;
    
    const topStudent =
        totalStudents > 0
            ? teacherStudents.reduce((prev, current) =>
                prev.attendancePercentage > current.attendancePercentage ? prev : current
              )
            : null;

    const lowAttendanceStudents = teacherStudents.filter(
        (s) => s.attendancePercentage < 75
    ).length;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">My Students</h1>
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalStudents}</div>
                        <p className="text-xs text-muted-foreground">Across all your classes</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Student Attendance</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgAttendance}%</div>
                        <p className="text-xs text-muted-foreground">Campus average is 88%</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{topStudent?.name || 'N/A'}</div>
                        <p className="text-xs text-muted-foreground">Highest attendance at {topStudent?.attendancePercentage || 0}%</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Low Attendance</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{lowAttendanceStudents}</div>
                        <p className="text-xs text-muted-foreground">Students with &lt;75% attendance</p>
                    </CardContent>
                </Card>
            </div>
            <ViewStudents />
        </div>
    );
}
