"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Assignment, Grade } from "@/lib/types";
import { 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Award
} from "lucide-react";

interface AssignmentStatCardsProps {
  assignments: Assignment[];
  grades: Grade[];
}

export function AssignmentStatCards({ assignments, grades }: AssignmentStatCardsProps) {
  // Calculate statistics
  const totalAssignments = assignments.length;
  
  // Get graded assignments count and their grades
  const gradedAssignments = grades.filter(g => g.marks !== null && g.marks !== undefined);
  const pendingAssignments = assignments.filter(a => !grades.find(g => g.assignmentId === a._id));
  const submittedButNotGraded = grades.filter(g => 
    (g.status === 'Submitted' || g.status === 'Late') && 
    (g.marks === null || g.marks === undefined)
  );
  const lateSubmissions = grades.filter(g => g.status === 'Late');
  
  // Calculate average grade
  const averageGrade = gradedAssignments.length > 0
    ? (gradedAssignments.reduce((sum, g) => {
        const assignment = assignments.find(a => a._id === g.assignmentId);
        if (assignment && g.marks !== null && g.marks !== undefined) {
          // Calculate percentage
          return sum + (g.marks / assignment.totalMarks) * 100;
        }
        return sum;
      }, 0) / gradedAssignments.length).toFixed(1)
    : 0;

  // Calculate completion rate
  const completionRate = totalAssignments > 0
    ? ((grades.length / totalAssignments) * 100).toFixed(0)
    : 0;

  const stats = [
    {
      title: "Total Assignments",
      value: totalAssignments,
      icon: ClipboardList,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Pending",
      value: pendingAssignments.length,
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-950",
    },
    {
      title: "Submitted",
      value: grades.length,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Late Submissions",
      value: lateSubmissions.length,
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950",
    },
    {
      title: "Average Grade",
      value: gradedAssignments.length > 0 ? `${averageGrade}%` : "N/A",
      icon: Award,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-950",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.title === "Average Grade" && gradedAssignments.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Based on {gradedAssignments.length} graded assignment{gradedAssignments.length !== 1 ? 's' : ''}
              </p>
            )}
            {stat.title === "Submitted" && submittedButNotGraded.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {submittedButNotGraded.length} awaiting grade
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
