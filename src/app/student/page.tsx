
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CalendarClock, GraduationCap, TrendingUp, TrendingDown, User } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function StudentDashboardPage() {
  const user = { name: "Alice Johnson" };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">
        Welcome back, {user.name}!
      </h1>
      <p className="text-muted-foreground">
        Here is your academic overview for the semester.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>Overall Attendance</span>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardDescription>
            <CardTitle className="text-4xl font-bold text-blue-500">92%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              +2% from last month
            </p>
            <Progress value={92} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>Courses Enrolled</span>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardDescription>
            <CardTitle className="text-4xl font-bold text-purple-500">4</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              This semester
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>Upcoming Deadlines</span>
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
            </CardDescription>
            <CardTitle className="text-4xl font-bold text-orange-500">3</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-xs text-muted-foreground">
              In the next 7 days
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>Overall Grade</span>
               <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardDescription>
            <CardTitle className="text-4xl font-bold text-green-500">A-</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-xs text-muted-foreground">
              Current GPA: 3.8
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
