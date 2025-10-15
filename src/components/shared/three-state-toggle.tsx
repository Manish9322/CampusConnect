
"use client"

import { Check, Clock, X } from "lucide-react";
import { AttendanceStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const statusCycle: AttendanceStatus[] = ['present', 'late', 'absent'];

const statusConfig: { [key in AttendanceStatus]: { icon: React.ElementType; className: string; text: string } } = {
  present: { icon: Check, className: "bg-green-600 hover:bg-green-700 text-white border-green-600", text: "Present" },
  late: { icon: Clock, className: "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500", text: "Late" },
  absent: { icon: X, className: "bg-destructive hover:bg-destructive/90 text-destructive-foreground border-destructive", text: "Absent" },
};

export const ThreeStateToggle = ({ status, onChange, disabled }: { status: AttendanceStatus, onChange: (newStatus: AttendanceStatus) => void, disabled?: boolean }) => {
  const handleClick = () => {
    if (disabled) return;
    const currentIndex = statusCycle.indexOf(status);
    const nextIndex = (currentIndex + 1) % statusCycle.length;
    onChange(statusCycle[nextIndex]);
  };
  const Icon = statusConfig[status].icon;
  const config = statusConfig[status];

  return (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                onClick={handleClick}
                variant="outline"
                size="icon"
                className={cn("transition-colors duration-200 w-8 h-8", config.className)}
                aria-label={`Change status from ${config.text}`}
                disabled={disabled}
                >
                <Icon className="h-4 w-4" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{disabled ? 'Editing locked' : config.text}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  );
};
