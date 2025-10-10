
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, CalendarCheck, CheckCircle, Star } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const achievements = [
    { title: "Perfect Attendance", icon: CalendarCheck, description: "Attended all classes last month.", achieved: true },
    { title: "Top Performer", icon: Star, description: "Scored in the top 10% in CS101.", achieved: true },
    { title: "On-Time Submitter", icon: CheckCircle, description: "Submitted all assignments on time.", achieved: true },
    { title: "Quiz Master", icon: Award, description: "Achieved a perfect score on the last quiz.", achieved: false },
    { title: "Early Bird", icon: Clock, description: "Submitted an assignment more than 3 days early.", achieved: true },
    { title: "Semester Rockstar", icon: Award, description: "Maintained over 95% attendance for the whole semester.", achieved: false },
];

export function Achievements() {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>My Achievements</CardTitle>
                <CardDescription>Badges earned for your hard work and consistency.</CardDescription>
            </CardHeader>
            <CardContent>
                <TooltipProvider>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-4 text-center">
                        {achievements.map((badge, index) => (
                            <Tooltip key={index}>
                                <TooltipTrigger>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className={`flex items-center justify-center w-16 h-16 rounded-full transition-all ${badge.achieved ? 'bg-yellow-400 text-white shadow-lg' : 'bg-muted text-muted-foreground'}`}>
                                            <badge.icon className="h-8 w-8" />
                                        </div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="font-semibold">{badge.title}</p>
                                    <p>{badge.description}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                </TooltipProvider>
            </CardContent>
        </Card>
    );
}
