
"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockStudents } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookCopy, CalendarCheck, Users } from "lucide-react";
import Link from "next/link";
import { UpcomingClassesCard } from "./upcoming-classes-card";

export function TeacherDashboardCards() {
    const recentlyAbsent = mockStudents.filter(s => s.attendancePercentage < 80).slice(0, 3);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Welcome Card - Spans 2 columns on larger screens */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Navigate Your Day</CardTitle>
                    <CardDescription>Your central hub for managing classes and students.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link href="/teacher/attendance">
                         <Card className="hover:bg-accent/50 transition-colors">
                            <CardHeader>
                                <CalendarCheck className="h-8 w-8 text-accent" />
                                <CardTitle className="text-lg mt-2">Take Attendance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">Mark today's attendance for your classes.</p>
                            </CardContent>
                        </Card>
                    </Link>
                     <Link href="/teacher/classes">
                        <Card className="hover:bg-accent/50 transition-colors">
                            <CardHeader>
                                <BookCopy className="h-8 w-8 text-accent" />
                                <CardTitle className="text-lg mt-2">My Classes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">View and manage your assigned courses.</p>
                            </CardContent>
                        </Card>
                    </Link>
                </CardContent>
            </Card>

            {/* Upcoming Classes Card */}
            <Card className="lg:col-span-2">
               <UpcomingClassesCard />
            </Card>

             {/* Total Students Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">45</div>
                    <p className="text-xs text-muted-foreground">Across all your classes</p>
                </CardContent>
                <CardFooter>
                     <Button variant="link" asChild className="p-0 h-auto">
                        <Link href="/teacher/students">View all students <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </CardFooter>
            </Card>

            {/* Courses Assigned Card */}
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Courses Assigned</CardTitle>
                    <BookCopy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">2</div>
                    <p className="text-xs text-muted-foreground">CS101, CS303</p>
                </CardContent>
                 <CardFooter>
                     <Button variant="link" asChild className="p-0 h-auto">
                        <Link href="/teacher/classes">Manage classes <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </CardFooter>
            </Card>

             {/* Recent Absences Card */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Recent Absences</CardTitle>
                    <CardDescription>Students with low recent attendance.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {recentlyAbsent.map(student => (
                         <div key={student.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="person portrait" />
                                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{student.name}</p>
                                    <p className="text-sm text-muted-foreground">{student.rollNo}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                 <p className="font-medium text-red-500">{student.attendancePercentage}%</p>
                                 <p className="text-xs text-muted-foreground">Attendance</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
