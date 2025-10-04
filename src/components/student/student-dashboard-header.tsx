
"use client";

interface StudentDashboardHeaderProps {
    name: string;
}

export function StudentDashboardHeader({ name }: StudentDashboardHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold">Welcome back, {name}!</h1>
                <p className="text-muted-foreground">Here's a summary of your academic progress.</p>
            </div>
        </div>
    )
}
