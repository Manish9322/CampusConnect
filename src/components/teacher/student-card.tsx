
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Student } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";

interface StudentCardProps {
  student: Student;
  onVewProfile: () => void;
}

export function StudentCard({ student, onVewProfile }: StudentCardProps) {
  const attendanceColor = student.attendancePercentage >= 75 ? "text-green-500" : "text-red-500";
  return (
    <Card className="flex flex-col text-center hover:shadow-lg transition-shadow">
      <CardHeader className="items-center">
        <Avatar className="h-20 w-20">
          <AvatarImage src={`https://placehold.co/100x100.png`} />
          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent className="flex-1 space-y-1">
        <CardTitle className="text-lg">{student.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{student.rollNo}</p>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <div>
          <p className={cn("text-lg font-bold", attendanceColor)}>
            {student.attendancePercentage}%
          </p>
          <p className="text-xs text-muted-foreground">Attendance</p>
        </div>
        <Progress value={student.attendancePercentage} className="h-2" />
        <Button className="w-full mt-2" variant="outline" onClick={onVewProfile}>
          <Eye className="mr-2 h-4 w-4" />
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
}
