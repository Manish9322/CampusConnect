
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Fingerprint } from "lucide-react";
import { format } from "date-fns";

export function MarkAttendanceCard() {
  const [punchedIn, setPunchedIn] = useState(false);
  const { toast } = useToast();
  const today = format(new Date(), "PPP");

  const handlePunchIn = () => {
    setPunchedIn(true);
    toast({
      title: "Attendance Marked!",
      description: `You have been marked present for ${today}.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mark Today's Attendance</CardTitle>
        <CardDescription>{today}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
        {punchedIn ? (
          <>
            <CheckCircle className="h-16 w-16 text-green-500" />
            <p className="font-semibold text-green-600">You are marked as present!</p>
          </>
        ) : (
          <>
            <Fingerprint className="h-16 w-16 text-primary" />
            <p className="text-muted-foreground">Click the button below to mark your attendance for today.</p>
            <Button onClick={handlePunchIn} className="w-full">
              Punch In
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
