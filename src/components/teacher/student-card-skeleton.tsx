
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StudentCardSkeleton() {
  return (
    <Card className="flex flex-col">
        <CardHeader className="items-center text-center">
            <Skeleton className="h-20 w-20 rounded-full" />
        </CardHeader>
        <CardContent className="flex-1 space-y-2 text-center">
            <Skeleton className="h-5 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
        </CardContent>
        <CardFooter className="flex-col gap-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-10 w-full mt-2" />
        </CardFooter>
    </Card>
  );
}
