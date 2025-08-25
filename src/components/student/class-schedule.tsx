
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "../ui/badge";

const schedule = [
    { time: '09:00 - 10:00', mon: 'CS101', tue: 'PHY101', wed: 'CS101', thu: 'PHY101', fri: 'CS101' },
    { time: '10:00 - 11:00', mon: 'MTH201', tue: 'CS303', wed: 'MTH201', thu: 'CS303', fri: 'MTH201' },
    { time: '11:00 - 12:00', mon: 'Break', tue: 'Break', wed: 'Break', thu: 'Break', fri: 'Break' },
    { time: '12:00 - 01:00', mon: 'PHY101', tue: 'CS101', wed: 'PHY101', thu: 'CS101', fri: 'PHY101' },
    { time: '01:00 - 02:00', mon: 'CS303', tue: 'MTH201', wed: 'CS303', thu: 'MTH201', fri: 'CS303' },
];

const subjectColors: { [key: string]: string } = {
    'CS101': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'PHY101': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'MTH201': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'CS303': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    'Break': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};


export function ClassSchedule() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Class Schedule</CardTitle>
        <CardDescription>Your weekly timetable.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Time</TableHead>
                <TableHead>Monday</TableHead>
                <TableHead>Tuesday</TableHead>
                <TableHead>Wednesday</TableHead>
                <TableHead>Thursday</TableHead>
                <TableHead>Friday</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedule.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.time}</TableCell>
                  <TableCell><Badge className={subjectColors[row.mon]}>{row.mon}</Badge></TableCell>
                  <TableCell><Badge className={subjectColors[row.tue]}>{row.tue}</Badge></TableCell>
                  <TableCell><Badge className={subjectColors[row.wed]}>{row.wed}</Badge></TableCell>
                  <TableCell><Badge className={subjectColors[row.thu]}>{row.thu}</Badge></TableCell>
                  <TableCell><Badge className={subjectColors[row.fri]}>{row.fri}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
