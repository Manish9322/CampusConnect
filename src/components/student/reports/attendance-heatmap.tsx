
"use client"

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useGetAttendanceQuery } from "@/services/api";
import { AttendanceRecord } from "@/lib/types";

interface AttendanceHeatmapProps {
    studentId: string;
}

const
  MONTHS = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
  DAYS_IN_WEEK = 7,
  SQUARE_SIZE = 10,
  MONTH_LABEL_GUTTER_SIZE = 4,
  WEEK_WIDTH = DAYS_IN_WEEK * (SQUARE_SIZE + 2);

export function AttendanceHeatmap({ studentId }: AttendanceHeatmapProps) {
  const today = new Date();
  
  // Fetch attendance records for this student
  const { data: attendanceRecords = [], isLoading } = useGetAttendanceQuery({ studentId }, { skip: !studentId });

  const data = React.useMemo(() => {
    const days = Array.from({ length: 365 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      return d.toISOString().slice(0, 10);
    }).reverse();

    return days.map(date => {
      const attendanceRecord = attendanceRecords.find((a: AttendanceRecord) => a.date === date);
      let count = 0;
      if (attendanceRecord) {
        if (attendanceRecord.status === 'present') count = 3;
        if (attendanceRecord.status === 'late') count = 2;
        if (attendanceRecord.status === 'absent') count = 1;
      }
      return { date, count };
    });
  }, [attendanceRecords, today]);

  const year = today.getFullYear();
  const weeks = React.useMemo(() => {
    const firstDay = new Date(year, today.getMonth() - 11, 1);
    const dayOfWeek = firstDay.getDay();

    return Array.from({ length: 53 }).map((_, weekIndex) =>
      Array.from({ length: 7 }).map((_, dayIndex) => {
        const date = new Date(firstDay);
        date.setDate(firstDay.getDate() + weekIndex * 7 + dayIndex - dayOfWeek);
        const dateStr = date.toISOString().slice(0, 10);
        const d = data.find(d => d.date === dateStr);
        return { date: dateStr, count: d?.count || 0 };
      })
    );
  }, [year, data]);

  const monthLabels = React.useMemo(() => {
    const labels = [];
    let lastMonth = -1;
    for (let i = 0; i < weeks.length; i++) {
        const firstDayOfWeek = new Date(weeks[i][0].date);
        const month = firstDayOfWeek.getMonth();
        if (month !== lastMonth) {
            labels.push({
                weekIndex: i,
                label: MONTHS[month],
            });
            lastMonth = month;
        }
    }
    return labels;
  }, [weeks]);

  const getColor = (count: number) => {
    if (count === 3) return 'bg-green-600';
    if (count === 2) return 'bg-yellow-400';
    if (count === 1) return 'bg-red-500';
    return 'bg-muted/50';
  };
  

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Heatmap</CardTitle>
        <CardDescription>Your attendance consistency over the past year.</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="flex gap-2 text-xs text-muted-foreground">
          {monthLabels.map(({ weekIndex, label }) => (
            <div key={weekIndex} style={{
              minWidth: WEEK_WIDTH,
              marginLeft: weekIndex === 0 ? (new Date(weeks[0][0].date).getDay() * (SQUARE_SIZE+2)) : 0
            }}>
              {label}
            </div>
          ))}
        </div>
        <div className="flex gap-[2px]">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-rows-7 gap-[2px]">
              {week.map(day => {
                const statusText = day.count === 0 ? 'No Record' : (day.count === 1 ? 'Absent' : (day.count === 2 ? 'Late' : 'Present'));
                return (
                  <div
                    key={day.date}
                    className="h-2.5 w-2.5 rounded-sm cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: getColor(day.count) }}
                    title={`${day.date}: ${statusText}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
