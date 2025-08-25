
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookCopy, Users } from "lucide-react";

export default function TeacherDashboardPage() {
    return (
        <div className="space-y-6">
             <div className="text-center py-10">
                <h2 className="text-2xl font-bold">Welcome, Dr. Alan Turing!</h2>
                <p className="text-muted-foreground">Use the sidebar to navigate to your classes, students, or to take attendance.</p>
            </div>
        </div>
    );
}
