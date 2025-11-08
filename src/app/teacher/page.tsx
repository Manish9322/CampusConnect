
"use client";

import * as React from "react";
import { TeacherDashboardCards } from "@/components/teacher/teacher-dashboard-cards";
import { TeacherAttendanceOverviewChart } from "@/components/teacher/teacher-attendance-overview-chart";
import { StudentEngagementChart } from "@/components/teacher/student-engagement-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Users, Percent, ArrowUp } from "lucide-react";
import { useGetClassesQuery, useGetStudentsQuery, useGetAssignmentsQuery, useGetGradesQuery, useGetAttendanceQuery } from "@/services/api";
import { Teacher } from "@/lib/types";

export default function TeacherDashboardPage() {
    const [teacher, setTeacher] = React.useState<Teacher | null>(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('teacher_user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.id && !parsedUser._id) {
                parsedUser._id = parsedUser.id;
            }
            setTeacher(parsedUser);
        }
    }, []);

    const { data: allClasses = [], isLoading: isLoadingClasses } = useGetClassesQuery(undefined);
    const { data: allStudents = [], isLoading: isLoadingStudents } = useGetStudentsQuery({ includeAttendance: true });
    const { data: allAssignments = [], isLoading: isLoadingAssignments } = useGetAssignmentsQuery({});
    const { data: allGrades = [], isLoading: isLoadingGrades } = useGetGradesQuery(undefined);
    const { data: allAttendance = [], isLoading: isLoadingAttendance } = useGetAttendanceQuery({});
    
    const isLoading = isLoadingClasses || isLoadingStudents || isLoadingAssignments || isLoadingGrades || isLoadingAttendance || !teacher;

    const teacherName = teacher ? `${teacher.designation || ''} ${teacher.name}` : 'Teacher';

    const { teacherClasses, teacherStudents, teacherStudentIds } = React.useMemo(() => {
        if (!teacher || !allClasses.length || !allStudents.length) {
            return { teacherClasses: [], teacherStudents: [], teacherStudentIds: [] };
        }
        const teacherId = teacher._id || teacher.id;
        const classesForTeacher = allClasses.filter((c: any) => (c.teacherId?._id || c.teacherId) === teacherId);
        const classIdsForTeacher = classesForTeacher.map((c: any) => c._id);
        const studentsForTeacher = allStudents.filter((s: any) => classIdsForTeacher.includes(s.classId?._id || s.classId));
        const studentIdsForTeacher = studentsForTeacher.map((s: any) => s._id);
        return { teacherClasses: classesForTeacher, teacherStudents: studentsForTeacher, teacherStudentIds: studentIdsForTeacher };
    }, [teacher, allClasses, allStudents]);

    const weeklyAttendanceData = React.useMemo(() => {
        if (isLoading || teacherStudentIds.length === 0) return [];
        
        const weeklyData: { [key: string]: { present: number, total: number } } = {};
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dayKey = daysOfWeek[date.getDay()];
            weeklyData[dayKey] = { present: 0, total: 0 };
        }

        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 6);
        oneWeekAgo.setHours(0,0,0,0);

        const relevantAttendance = allAttendance.filter((att: any) => 
            teacherStudentIds.includes(att.studentId) && new Date(att.date) >= oneWeekAgo
        );

        relevantAttendance.forEach((att: any) => {
            const date = new Date(att.date);
            const dayKey = daysOfWeek[date.getDay()];
            if (weeklyData[dayKey]) {
                weeklyData[dayKey].total++;
                if (att.status === 'present' || att.status === 'late') {
                    weeklyData[dayKey].present++;
                }
            }
        });

        return Object.entries(weeklyData).map(([day, data]) => ({
            day,
            attendance: data.total > 0 ? Math.round((data.present / data.total) * 100) : 0
        }));

    }, [isLoading, allAttendance, teacherStudentIds]);

    const studentEngagementData = React.useMemo(() => {
        if (isLoading || teacherStudents.length === 0) return [];
        
        const engagement = {
            'Highly Engaged': 0,
            'Moderately Engaged': 0,
            'Low Engagement': 0,
        };

        teacherStudents.forEach(student => {
            const attendance = student.attendancePercentage || 0;
            if (attendance >= 90) {
                engagement['Highly Engaged']++;
            } else if (attendance >= 75) {
                engagement['Moderately Engaged']++;
            } else {
                engagement['Low Engagement']++;
            }
        });

        return [
            { type: "Highly Engaged", value: engagement['Highly Engaged'] },
            { type: "Moderately Engaged", value: engagement['Moderately Engaged'] },
            { type: "Low Engagement", value: engagement['Low Engagement'] },
        ];
    }, [isLoading, teacherStudents]);

    const stats = React.useMemo(() => {
        if(isLoading) return { totalStudents: 0, avgClassSize: 0, avgAttendance: 0, assignmentsGraded: '0/0' };
        
        const totalStudents = teacherStudents.length;
        const avgClassSize = teacherClasses.length > 0 ? Math.round(totalStudents / teacherClasses.length) : 0;
        
        const avgAttendance = teacherStudents.length > 0 
            ? Math.round(teacherStudents.reduce((acc, s) => acc + (s.attendancePercentage || 0), 0) / teacherStudents.length)
            : 0;

        const teacherAssignments = allAssignments.filter((a: any) => teacherClasses.some(c => c._id === a.courseId));
        const teacherAssignmentIds = teacherAssignments.map((a: any) => a._id);
        
        const gradedCount = allGrades.filter(g => teacherAssignmentIds.includes(g.assignmentId) && g.marks !== null).length;
        const totalSubmissions = allGrades.filter(g => teacherAssignmentIds.includes(g.assignmentId)).length;
        
        const assignmentsGraded = `${gradedCount}/${totalSubmissions}`;

        return { totalStudents, avgClassSize, avgAttendance, assignmentsGraded };
    }, [isLoading, teacherStudents, teacherClasses, allAssignments, allGrades]);
    
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
                        <div className="text-2xl font-bold">{stats.totalStudents}</div>
                        <p className="text-xs text-muted-foreground">Across {teacherClasses.length} classes</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Class Size</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.avgClassSize}</div>
                        <p className="text-xs text-muted-foreground">Campus average is 28</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Attendance Rate</CardTitle>
                        <Percent className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.avgAttendance}%</div>
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
                        <div className="text-2xl font-bold">{stats.assignmentsGraded}</div>
                        <p className="text-xs text-muted-foreground">Total submissions graded</p>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
                <TeacherAttendanceOverviewChart data={weeklyAttendanceData} isLoading={isLoading} />
                <StudentEngagementChart data={studentEngagementData} isLoading={isLoading} />
            </div>

            <TeacherDashboardCards teacher={teacher} teacherClasses={teacherClasses} teacherStudents={teacherStudents} />
        </div>
    );
}
