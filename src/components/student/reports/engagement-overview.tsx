
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const engagementData = [
    { title: "Quiz Participation", value: 85, color: "bg-primary" },
    { title: "Discussion Forums", value: 60, color: "bg-accent" },
    { title: "Project Submissions", value: 100, color: "bg-green-500" },
    { title: "Peer Reviews", value: 75, color: "bg-orange-500" },
];

export function EngagementOverview() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Engagement Analytics</CardTitle>
                <CardDescription>Your participation across various activities.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {engagementData.map(item => (
                    <div key={item.title}>
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.value}%</p>
                        </div>
                        <Progress value={item.value} className="h-2" indicatorClassName={item.color} />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

// Add this to progress.tsx to support indicatorClassName if not already present
// Or modify the component to accept a color prop
declare module "react" {
  interface ComponentProps<T> {
    indicatorClassName?: string;
  }
}
