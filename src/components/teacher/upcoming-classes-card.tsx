
"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";

const todaysSchedule = [
    { time: '09:00 - 10:00', course: 'CS101', type: 'Lecture' },
    { time: '12:00 - 01:00', course: 'PHY101', type: 'Lab' },
    { time: '02:00 - 03:00', course: 'CS101', type: 'Tutorial' },
];

export function UpcomingClassesCard() {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Here are your classes for today.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
                {todaysSchedule.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                        <div>
                            <p className="font-semibold">{item.course}</p>
                            <p className="text-sm text-muted-foreground">{item.time}</p>
                        </div>
                        <Badge variant={item.type === 'Lab' ? 'destructive' : 'secondary'}>{item.type}</Badge>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
