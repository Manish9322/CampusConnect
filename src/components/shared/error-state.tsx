
import { cn } from "@/lib/utils";
import { AlertTriangle, WifiOff } from "lucide-react";
import { Button } from "../ui/button";

interface ErrorStateProps {
  type: "error" | "timeout";
  title: string;
  description: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ type, title, description, onRetry, className }: ErrorStateProps) {
  const Icon = type === "timeout" ? WifiOff : AlertTriangle;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-destructive/50 p-8 text-center",
        className
      )}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <Icon className="h-10 w-10 text-destructive" />
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-semibold text-destructive">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {onRetry && (
        <Button variant="destructive" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
