
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Assignment, Grade } from "@/lib/types";
import { Award, Book, CheckCircle, Percent } from "lucide-react";

interface GradeStatCardsProps {
    assignments: Assignment[];
    grades: Grade[];
}

// Function to calculate GPA from a percentage
const calculateGPA = (percentage: number) => {
    if (percentage >= 90) return 4.0;
    if (percentage >= 85) return 3.7;
    if (percentage >= 80) return 3.3;
    if (percentage >= 75) return 3.0;
    if (percentage >= 70) return 2.7;
    if (percentage >= 65) return 2.3;
    if (percentage >= 60) return 2.0;
    if (percentage >= 50) return 1.0;
    return 0.0;
};

export function GradeStatCards({ assignments, grades }: GradeStatCardsProps) {
    
    const gradedAssignments = grades.filter(g => g.marks !== null && g.marks !== undefined);
    
    const totalMarksPossible = gradedAssignments.reduce((sum, g) => {
        const assignment = assignments.find(a => a._id === g.assignmentId);
        return sum + (assignment?.totalMarks || 0);
    }, 0);

    const totalMarksEarned = gradedAssignments.reduce((sum, g) => sum + (g.marks || 0), 0);

    const overallPercentage = totalMarksPossible > 0
        ? ((totalMarksEarned / totalMarksPossible) * 100).toFixed(1)
        : 0;

    const gpa = calculateGPA(Number(overallPercentage));

    const stats = [
        {
            title: "Overall Percentage",
            value: `${overallPercentage}%`,
            icon: Percent,
            description: `Based on ${gradedAssignments.length} graded items`
        },
        {
            title: "GPA (Estimated)",
            value: gpa.toFixed(2),
            icon: Award,
            description: "Calculated on a 4.0 scale"
        },
        {
            title: "Total Assignments",
            value: assignments.length,
            icon: Book,
            description: "Across all your subjects"
        },
        {
            title: "Graded Assignments",
            value: gradedAssignments.length,
            icon: CheckCircle,
            description: `${assignments.length - gradedAssignments.length} pending`
        }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
