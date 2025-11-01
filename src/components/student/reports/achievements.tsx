
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, CalendarCheck, CheckCircle, Clock, Star, Target, Trophy } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Assignment, Grade, Student } from "@/lib/types";

interface AchievementsProps {
    student: Student;
    assignments: Assignment[];
    grades: Grade[];
}

export function Achievements({ student, assignments, grades }: AchievementsProps) {
    // Calculate achievements based on real data
    const calculateAchievements = () => {
        const achievements = [];

        // Perfect Attendance (>= 95%)
        achievements.push({
            title: "Perfect Attendance",
            icon: CalendarCheck,
            description: student.attendancePercentage >= 95 
                ? `Maintained ${student.attendancePercentage}% attendance!` 
                : `Current attendance: ${student.attendancePercentage}%. Reach 95% to unlock.`,
            achieved: student.attendancePercentage >= 95,
        });

        // Top Performer (Average >= 90%)
        const gradedAssignments = grades.filter((g: Grade) => g.marks !== null && g.marks !== undefined);
        const averageScore = gradedAssignments.length > 0
            ? (gradedAssignments.reduce((sum: number, g: Grade) => {
                const assignment = assignments.find((a: Assignment) => a._id === g.assignmentId);
                if (assignment && g.marks !== null && g.marks !== undefined) {
                    return sum + (g.marks / assignment.totalMarks) * 100;
                }
                return sum;
            }, 0) / gradedAssignments.length)
            : 0;
        
        achievements.push({
            title: "Top Performer",
            icon: Star,
            description: averageScore >= 90 
                ? `Maintained ${averageScore.toFixed(0)}% average score!` 
                : `Current average: ${averageScore.toFixed(0)}%. Reach 90% to unlock.`,
            achieved: averageScore >= 90,
        });

        // On-Time Submitter (No late submissions)
        const lateSubmissions = grades.filter((g: Grade) => g.status === 'Late').length;
        const totalSubmissions = grades.length;
        achievements.push({
            title: "On-Time Submitter",
            icon: CheckCircle,
            description: lateSubmissions === 0 && totalSubmissions > 0
                ? `All ${totalSubmissions} assignments submitted on time!` 
                : `${lateSubmissions} late submission${lateSubmissions !== 1 ? 's' : ''}. Submit on time to unlock.`,
            achieved: lateSubmissions === 0 && totalSubmissions > 0,
        });

        // Quiz Master (Perfect score on any assignment)
        const perfectScores = gradedAssignments.filter((g: Grade) => {
            const assignment = assignments.find((a: Assignment) => a._id === g.assignmentId);
            return assignment && g.marks === assignment.totalMarks;
        });
        achievements.push({
            title: "Quiz Master",
            icon: Award,
            description: perfectScores.length > 0
                ? `Achieved ${perfectScores.length} perfect score${perfectScores.length !== 1 ? 's' : ''}!` 
                : "Score 100% on an assignment to unlock.",
            achieved: perfectScores.length > 0,
        });

        // Early Bird (Submitted assignment 3+ days early)
        const earlySubmissions = grades.filter((g: Grade) => {
            if (!g.submittedAt) return false;
            const assignment = assignments.find((a: Assignment) => a._id === g.assignmentId);
            if (!assignment) return false;
            const daysEarly = (new Date(assignment.dueDate).getTime() - new Date(g.submittedAt).getTime()) / (1000 * 60 * 60 * 24);
            return daysEarly >= 3;
        }).length;
        
        achievements.push({
            title: "Early Bird",
            icon: Clock,
            description: earlySubmissions > 0
                ? `Submitted ${earlySubmissions} assignment${earlySubmissions !== 1 ? 's' : ''} 3+ days early!` 
                : "Submit an assignment 3+ days early to unlock.",
            achieved: earlySubmissions > 0,
        });

        // Semester Rockstar (95%+ attendance)
        achievements.push({
            title: "Semester Rockstar",
            icon: Trophy,
            description: student.attendancePercentage >= 95
                ? `Outstanding ${student.attendancePercentage}% attendance!` 
                : `Maintain 95%+ attendance to unlock.`,
            achieved: student.attendancePercentage >= 95,
        });

        // Consistent Performer (Graded in 5+ assignments)
        achievements.push({
            title: "Consistent Performer",
            icon: Target,
            description: gradedAssignments.length >= 5
                ? `Completed ${gradedAssignments.length} graded assignments!` 
                : `Complete ${5 - gradedAssignments.length} more to unlock.`,
            achieved: gradedAssignments.length >= 5,
        });

        // High Achiever (Average >= 85% with 5+ assignments)
        achievements.push({
            title: "High Achiever",
            icon: Award,
            description: averageScore >= 85 && gradedAssignments.length >= 5
                ? `Maintained ${averageScore.toFixed(0)}% average!` 
                : "Maintain 85%+ average with 5+ graded assignments.",
            achieved: averageScore >= 85 && gradedAssignments.length >= 5,
        });

        return achievements;
    };

    const achievements = calculateAchievements();

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>My Achievements</CardTitle>
                <CardDescription>Badges earned for your hard work and consistency.</CardDescription>
            </CardHeader>
            <CardContent>
                <TooltipProvider>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-4 text-center">
                        {achievements.map((badge, index) => (
                            <Tooltip key={index}>
                                <TooltipTrigger>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className={`flex items-center justify-center w-16 h-16 rounded-full transition-all ${badge.achieved ? 'bg-yellow-400 text-white shadow-lg' : 'bg-muted text-muted-foreground'}`}>
                                            <badge.icon className="h-8 w-8" />
                                        </div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="font-semibold">{badge.title}</p>
                                    <p>{badge.description}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                </TooltipProvider>
            </CardContent>
        </Card>
    );
}
