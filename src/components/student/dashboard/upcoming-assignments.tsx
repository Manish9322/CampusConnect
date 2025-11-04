
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Assignment, Grade } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface UpcomingAssignmentsProps {
  assignments: Assignment[];
  grades: Grade[];
}

const courseColors: { [key: string]: string } = {
    'PHY101': 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
    'MTH201': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200',
    'CS303': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200',
    'CS101': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
    'CHM101': 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200',
};

export function UpcomingAssignments({ assignments, grades }: UpcomingAssignmentsProps) {
  // Get upcoming assignments (not submitted and not past due)
  const getUpcomingAssignments = () => {
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

  const upcomingAssignments = getUpcomingAssignments();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Upcoming Assignments</CardTitle>
          <CardDescription>Deadlines you need to keep an eye on.</CardDescription>
        </div>
        <Button asChild variant="link" size="sm">
          <Link href="/student/assignments">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingAssignments.length > 0 ? (
          upcomingAssignments.map((item, index) => (
            <div
              key={index}
              className="flex items-start justify-between"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{item.title}</p>
                <Badge variant="outline" className={courseColors[item.course] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-200'}>
                  {item.course}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground whitespace-nowrap ml-2">Due in {item.dueDate}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No upcoming assignments. Great job staying on top of your work!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
