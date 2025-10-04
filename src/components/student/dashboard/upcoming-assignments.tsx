
"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const assignments = [
    { title: "Physics Lab Report", dueDate: "3 days", course: "PHY101" },
    { title: "Calculus Problem Set", dueDate: "5 days", course: "MTH201" },
    { title: "Final Project Proposal", dueDate: "1 week", course: "CS303" },
];

const courseColors: { [key: string]: string } = {
    'PHY101': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'MTH201': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'CS303': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
};


export function UpcomingAssignments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Assignments</CardTitle>
        <CardDescription>Deadlines you need to keep an eye on.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {assignments.map((item, index) => (
          <div
            key={index}
            className="flex items-start justify-between"
          >
            <div>
              <p className="font-semibold">{item.title}</p>
              <Badge variant="outline" className={courseColors[item.course]}>{item.course}</Badge>
            </div>
            <p className="text-sm text-muted-foreground whitespace-nowrap">Due in {item.dueDate}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
