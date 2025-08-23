"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock } from "lucide-react";

export function AttendanceCard() {
  const [punchedIn, setPunchedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePunchIn = () => {
    setPunchedIn(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mark Your Attendance</CardTitle>
        <CardDescription>Punch in to record your attendance for today.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-6 p-10">
        <div className="text-center">
            <p className="text-xl font-medium text-muted-foreground">{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="text-6xl font-bold text-primary">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        
        {punchedIn ? (
          <div className="flex flex-col items-center text-center text-green-600">
            <CheckCircle className="h-16 w-16" />
            <p className="mt-4 text-xl font-semibold">You're punched in for today!</p>
            <p className="text-muted-foreground">Attendance recorded at {new Date().toLocaleTimeString()}</p>
          </div>
        ) : (
          <Button size="lg" className="w-full max-w-xs py-8 text-xl" onClick={handlePunchIn}>
            <Clock className="mr-4 h-8 w-8" />
            Punch In
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
