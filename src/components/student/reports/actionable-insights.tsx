
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookCheck, Clock, Lightbulb, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const insights = [
    { text: "Your performance in PHY101 is slightly below average. Consider reviewing the last two chapters.", icon: Target, type: "Focus" },
    { text: "Great job on the recent CS303 quiz! Keep up the momentum.", icon: Lightbulb, type: "Continue" },
    { text: "You have 2 assignments due next week. Plan your time accordingly.", icon: Clock, type: "Improve" },
];

const upcomingDeadlines = [
    { title: "Calculus Problem Set", dueDate: "5 days", course: "MTH201" },
    { title: "Final Project Proposal", dueDate: "1 week", course: "CS303" },
];

export function ActionableInsights() {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Actionable Insights & Deadlines</CardTitle>
                <CardDescription>Personalized recommendations to boost your performance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Recommendations</h4>
                    <div className="space-y-4">
                        {insights.map((item, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary mt-1">
                                <item.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-medium">{item.text}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Upcoming Deadlines</h4>
                    <div className="space-y-3">
                         {upcomingDeadlines.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                <div>
                                    <p className="font-semibold">{item.title}</p>
                                    <p className="text-xs text-muted-foreground">{item.course}</p>
                                </div>
                                <Badge variant="secondary">Due in {item.dueDate}</Badge>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
