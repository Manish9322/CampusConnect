
"use client";

import * as React from "react";
import { TeacherDashboardCards } from "@/components/teacher/teacher-dashboard-cards";
import { TeacherAttendanceOverviewChart } from "@/components/teacher/teacher-attendance-overview-chart";
import { StudentEngagementChart } from "@/components/teacher/student-engagement-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Users, Percent, ArrowUp } from "lucide-react";
import { useGetClassesQuery, useGetStudentsQuery, useGetAssignmentsQuery, useGetGradesQuery } from "@/services/api";
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
    
    const isLoading = isLoadingClasses || isLoadingStudents || isLoadingAssignments || isLoadingGrades || !teacher;

    const teacherName = teacher ? `${teacher.designation || ''} ${teacher.name}` : 'Teacher';

    const { teacherClasses, teacherStudents } = React.useMemo(() => {
        if (!teacher || !allClasses.length || !allStudents.length) {
            return { teacherClasses: [], teacherStudents: [] };
        }
        const teacherId = teacher._id || teacher.id;
        const classesForTeacher = allClasses.filter((c: any) => (c.teacherId?._id || c.teacherId) === teacherId);
        const classIdsForTeacher = classesForTeacher.map((c: any) => c._id);
        const studentsForTeacher = allStudents.filter((s: any) => classIdsForTeacher.includes(s.classId?._id || s.classId));
        return { teacherClasses: classesForTeacher, teacherStudents: studentsForTeacher };
    }, [teacher, allClasses, allStudents]);

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
                <TeacherAttendanceOverviewChart />
                <StudentEngagementChart />
            </div>

            <TeacherDashboardCards teacher={teacher} teacherClasses={teacherClasses} teacherStudents={teacherStudents} />
        </div>
    );
}
