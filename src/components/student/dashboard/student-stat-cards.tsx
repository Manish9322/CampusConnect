
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  CalendarClock,
  GraduationCap,
  User,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function StudentStatCards() {
  const stats = [
    {
      title: "Overall Attendance",
      value: "92%",
      icon: User,
      color: "text-primary",
      progress: 92,
    },
    {
      title: "Courses Enrolled",
      value: "4",
      icon: BookOpen,
      color: "text-accent",
    },
    {
      title: "Upcoming Deadlines",
      value: "3",
      icon: CalendarClock,
      color: "text-destructive",
    },
    {
      title: "Overall Grade",
      value: "A-",
      icon: GraduationCap,
      color: "text-primary",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 text-muted-foreground`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            {stat.progress !== undefined && (
              <Progress value={stat.progress} className="mt-2 h-2" />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
