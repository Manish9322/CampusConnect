
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

interface ReportStatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendDirection?: 'up' | 'down';
}

export function ReportStatCard({ title, value, icon: Icon, trend, trendDirection }: ReportStatCardProps) {
  const TrendIcon = trendDirection === 'up' ? ArrowUp : ArrowDown;
  const trendColor = trendDirection === 'up' ? 'text-green-500' : 'text-red-500';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
            <p className="text-xs text-muted-foreground flex items-center">
                <TrendIcon className={cn("h-3 w-3 mr-1", trendColor)} />
                <span className={trendColor}>{trend}</span> vs last month
            </p>
        )}
      </CardContent>
    </Card>
  );
}
