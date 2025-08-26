
import { TeacherDashboardCards } from "@/components/teacher/teacher-dashboard-cards";
import { mockTeachers } from "@/lib/mock-data";

export default function TeacherDashboardPage() {
    const teacher = mockTeachers.find(t => t.id === '101');
    const teacherName = teacher ? `${teacher.designation || ''} ${teacher.name}` : 'Teacher';
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                 <h1 className="text-2xl font-bold">Welcome back, {teacherName}!</h1>
                 <p className="text-muted-foreground">Here's your dashboard overview for today.</p>
            </div>
            <TeacherDashboardCards />
        </div>
    );
}
