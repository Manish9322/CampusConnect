
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookCheck, Clock, Lightbulb, Target, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Assignment, Grade, Student } from "@/lib/types";

interface ActionableInsightsProps {
    student: Student;
    assignments: Assignment[];
    grades: Grade[];
}

export function ActionableInsights({ student, assignments, grades }: ActionableInsightsProps) {
    // Generate dynamic insights based on real data
    const generateInsights = () => {
        const insights = [];

        // Check for low performance subjects
        const subjectPerformance = new Map<string, { total: number; earned: number; count: number }>();
        grades.forEach((grade: Grade) => {
            if (grade.marks !== null && grade.marks !== undefined) {
                const assignment = assignments.find((a: Assignment) => a._id === grade.assignmentId);
                if (assignment) {
                    const existing = subjectPerformance.get(assignment.courseName) || { total: 0, earned: 0, count: 0 };
                    subjectPerformance.set(assignment.courseName, {
                        total: existing.total + assignment.totalMarks,
                        earned: existing.earned + grade.marks,
                        count: existing.count + 1,
                    });
                }
            }
        });

        subjectPerformance.forEach((perf, subject) => {
            const percentage = (perf.earned / perf.total) * 100;
            if (percentage < 70 && perf.count >= 2) {
                insights.push({
                    text: `Your performance in ${subject} is at ${percentage.toFixed(0)}%. Consider reviewing recent topics and seeking help.`,
                    icon: Target,
                    type: "Focus"
                });
            } else if (percentage >= 90) {
                insights.push({
                    text: `Excellent work in ${subject}! You're scoring ${percentage.toFixed(0)}%. Keep up the momentum!`,
                    icon: TrendingUp,
                    type: "Continue"
                });
            }
        });

        // Check attendance
        if (student.attendancePercentage < 75) {
            insights.push({
                text: `Your attendance is at ${student.attendancePercentage}%. Regular attendance is crucial for success.`,
                icon: Clock,
                type: "Improve"
            });
        }

        // Check for late submissions
        const lateSubmissions = grades.filter((g: Grade) => g.status === 'Late').length;
        if (lateSubmissions > 2) {
            insights.push({
                text: `You have ${lateSubmissions} late submissions. Try to submit assignments on time to avoid penalties.`,
                icon: Clock,
                type: "Improve"
            });
        }

        // Check for pending assignments
        const pendingCount = assignments.filter((a: Assignment) => 
            !grades.find((g: Grade) => g.assignmentId === a._id)
        ).length;
        if (pendingCount > 0) {
            insights.push({
                text: `You have ${pendingCount} pending assignment${pendingCount > 1 ? 's' : ''}. Plan your time to stay on track.`,
                icon: BookCheck,
                type: "Focus"
            });
        }

        // Default message if no insights
        if (insights.length === 0) {
            insights.push({
                text: "Great job! You're doing well across all metrics. Keep maintaining this consistency!",
                icon: Lightbulb,
                type: "Continue"
            });
        }

        return insights.slice(0, 4); // Limit to 4 insights
    };

    // Get upcoming deadlines
    const getUpcomingDeadlines = () => {
        const now = new Date();
        const pendingAssignments = assignments.filter((a: Assignment) => {
            const hasSubmission = grades.find((g: Grade) => g.assignmentId === a._id);
            const dueDate = new Date(a.dueDate);
            return !hasSubmission && dueDate > now;
        });

        return pendingAssignments
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            .slice(0, 5)
            .map((assignment: Assignment) => {
                const dueDate = new Date(assignment.dueDate);
                const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                
                let dueDateText = '';
                if (daysUntilDue === 0) dueDateText = 'Today';
                else if (daysUntilDue === 1) dueDateText = 'Tomorrow';
                else if (daysUntilDue < 7) dueDateText = `${daysUntilDue} days`;
                else if (daysUntilDue < 14) dueDateText = '1 week';
                else dueDateText = `${Math.ceil(daysUntilDue / 7)} weeks`;

                return {
                    title: assignment.title,
                    dueDate: dueDateText,
                    course: assignment.courseName,
                };
            });
    };

    const insights = generateInsights();
    const upcomingDeadlines = getUpcomingDeadlines();

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Actionable Insights & Deadlines</CardTitle>
                <CardDescription>Personalized recommendations to boost your performance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Recommendations</h4>
                    <div className="space-y-4">
                        {insights.map((item, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary mt-1">
                                <item.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-medium">{item.text}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Upcoming Deadlines</h4>
                    <div className="space-y-3">
                        {upcomingDeadlines.length > 0 ? (
                            upcomingDeadlines.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                    <div>
                                        <p className="font-semibold">{item.title}</p>
                                        <p className="text-xs text-muted-foreground">{item.course}</p>
                                    </div>
                                    <Badge variant="secondary">Due in {item.dueDate}</Badge>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                No upcoming deadlines. Great job staying on top of your work!
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
