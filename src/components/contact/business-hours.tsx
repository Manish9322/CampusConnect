
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

const hours = [
  { day: 'Monday - Friday', time: '9:00 AM - 6:00 PM' },
  { day: 'Saturday', time: '10:00 AM - 4:00 PM' },
  { day: 'Sunday', time: 'Closed' },
];

export function BusinessHours() {
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-16 duration-700 delay-400">
      <CardHeader>
        <CardTitle>Business Hours</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {hours.map((item, index) => (
            <li key={index} className="flex justify-between items-center text-muted-foreground">
              <span className="font-medium">{item.day}</span>
              <span className="text-sm">{item.time}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
