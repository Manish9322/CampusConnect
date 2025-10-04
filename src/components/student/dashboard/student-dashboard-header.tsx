
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StudentDashboardHeaderProps {
  name: string;
}

export function StudentDashboardHeader({ name }: StudentDashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Welcome back, {name}!
        </h1>
        <p className="text-muted-foreground">
          Here is your academic overview for the semester.
        </p>
      </div>
      <Avatar className="h-12 w-12 hidden sm:flex">
        <AvatarImage src="https://placehold.co/100x100.png" alt={name} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
    </div>
  );
}
