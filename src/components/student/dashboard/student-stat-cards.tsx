
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BookOpen,
  CalendarClock,
  GraduationCap,
  User,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export function StudentStatCards() {
  const stats = [
    {
      title: "Overall Attendance",
      value: "92%",
      icon: User,
      description: (
        <span className="flex items-center">
          <ArrowUp className="h-3 w-3 mr-1 text-green-500" />
          +2% from last month
        </span>
      ),
      progress: 92,
    },
    {
      title: "Courses Enrolled",
      value: "4",
      icon: BookOpen,
      description: (
        <div className="flex flex-wrap gap-1 mt-1">
          <Badge variant="secondary">CS101</Badge>
          <Badge variant="secondary">PHY101</Badge>
          <Badge variant="secondary">MTH201</Badge>
          <Badge variant="secondary">CS303</Badge>
        </div>
      ),
    },
    {
      title: "Upcoming Deadlines",
      value: "3",
      icon: CalendarClock,
      description: "In the next 7 days",
    },
    {
      title: "Overall Grade",
      value: "A-",
      icon: GraduationCap,
      description: "Excellent standing",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 text-muted-foreground`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold`}>{stat.value}</div>
            {stat.progress !== undefined && (
              <Progress value={stat.progress} className="mt-2 h-1.5" />
            )}
             {stat.description && (
                <p className="text-xs text-muted-foreground pt-1">{stat.description}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
