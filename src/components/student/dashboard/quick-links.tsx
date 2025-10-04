
"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart2, BookOpen, CalendarCheck } from "lucide-react";
import Link from 'next/link';

const links = [
    { href: "/student/attendance", label: "My Attendance", icon: CalendarCheck },
    { href: "/student/schedule", label: "Class Schedule", icon: BookOpen },
    { href: "/student/reports", label: "View Reports", icon: BarChart2 },
]

export function QuickLinks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Links</CardTitle>
        <CardDescription>Navigate to key sections quickly.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {links.map(link => (
            <Button key={link.href} asChild variant="ghost" className="w-full justify-start">
                <Link href={link.href}>
                    <link.icon className="mr-2 h-4 w-4" />
                    {link.label}
                    <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
            </Button>
        ))}
      </CardContent>
    </Card>
  );
}
