
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Assignment, Grade } from "@/lib/types";
import { 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
} from "lucide-react";

interface AssignmentStatCardsProps {
  assignments: Assignment[];
  grades: Grade[];
}

export function AssignmentStatCards({ assignments, grades }: AssignmentStatCardsProps) {
  // Calculate statistics
  const totalAssignments = assignments.length;
  
  const pendingAssignments = assignments.filter(a => !grades.find(g => g.assignmentId === a._id));
  const lateSubmissions = grades.filter(g => g.status === 'Late');
  
  const stats = [
    {
      title: "Total Assignments",
      value: totalAssignments,
      icon: ClipboardList,
      color: "text-blue-500",
    },
    {
      title: "Pending",
      value: pendingAssignments.length,
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      title: "Submitted",
      value: grades.length,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "Late Submissions",
      value: lateSubmissions.length,
      icon: AlertTriangle,
      color: "text-red-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.title === "Submitted" && (
              <p className="text-xs text-muted-foreground mt-1">
                {grades.filter(g => (g.marks === null || g.marks === undefined)).length} pending review
              </p>
            )}
             {stat.title === "Total Assignments" && (
                <p className="text-xs text-muted-foreground mt-1">
                    Across all subjects
                </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
